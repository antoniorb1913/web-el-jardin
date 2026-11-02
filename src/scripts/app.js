/**
 * Arranque del sitio: el recorrido del bar con scroll y la navegación.
 *
 * El fondo son 240 fotogramas dibujados en un `<canvas>`. El scroll elige cuál se
 * dibuja, hay una parada de cámara al principio de cada cuarto —donde se enciende una
 * foto nítida— y los paneles de texto aparecen en esas paradas y se desvanecen.
 *
 * Decisiones que conviene no deshacer sin saber qué hacen:
 *
 * - **Un solo fotograma por repintado**, el más cercano. Mezclar dos deja un fantasma.
 * - **Inercia**: la posición dibujada persigue a la del scroll, para que las muescas
 *   de la rueda no se noten como saltos.
 * - **Paneles fijos** en el centro: no viajan, solo cambian de opacidad.
 * - **Cada foto nítida se enciende en el fotograma de su escena**, que es justo donde
 *   está el apartado: así el texto y la imagen buena coinciden siempre.
 * - **Viaje entre apartados**: al pulsar un enlace de la cabecera, el scroll lo
 *   conduce este módulo y los paneles se apagan, así se ve la cámara de una tirada.
 */

/** Fracción del recorrido con la cámara parada en cada cuarto. */
const PAUSA = 0.26;

/** Cuatro clips en el vídeo. */
const TRAMOS = 4;

/** Fotogramas por clip: 60 a 12 por segundo. */
const FOTOGRAMAS_POR_TRAMO = 60;

/** Dónde aparece cada apartado, en fracción del recorrido. Uno por parada de cámara. */
const APARECE_EN = [0, 0.25, 0.5, 0.75, 1];

/** Ancho de la ventana del texto, en fracción del recorrido. */
const VENTANA_APARTADO = 0.06;

/**
 * La ventana del ultimo apartado es mas estrecha: tiene que entrar cuando el
 * recorrido ya ha terminado, no antes.
 */
const VENTANA_FINAL = 0.028;

/**
 * La portada tiene ventana propia, mucho más corta.
 *
 * Con la ventana normal, el logotipo tardaba casi una pantalla en desvanecerse y
 * durante ese rato se veía a medias encima del rótulo pintado de la pared: dos
 * «JARDIN» superpuestos. Con esta se va en el primer golpe de rueda.
 */
const VENTANA_PORTADA = 0.05;

/** Media anchura del desenfoque, en fracción del recorrido. */
const VENTANA_PORTAL = 0.03;

/** Dónde late el desenfoque: al final del recorrido de cada tramo. */
const PORTALES = [0.2, 0.45, 0.7, 0.95];

/** Pasos de carga del recorrido y cuándo empieza cada uno. */
const PASOS_CARGA = [24, 12, 4, 1];
const RETARDOS_CARGA = [0, 700, 1800, 3500];

/** Antelación con la que se pide la foto, en fotogramas. */
const ANTELACION_FOTO = 30;

/** Fotogramas de encendido y apagado de cada foto nítida. */
const ENTRADA_FOTO = 2;
const SALIDA_FOTO = 3;

const limitar = (valor, min, max) => Math.min(Math.max(valor, min), max);
const suavizar = (valor) => valor * valor * (3 - 2 * valor);

/**
 * Viaje entre apartados: estado compartido con la navegación.
 *
 * `posicionForzada` se usa durante el viaje para que la cámara vaya de una tirada, sin
 * que el reparto normal la frene en las paradas que quedan por el camino.
 */
let viajando = false;
let tokenViaje = 0;
let posicionForzada = null;

/** Lo rellena `iniciarPortada` para pedir un repintado desde la navegación. */
let refrescarPortada = () => {};

/** Lo rellena `iniciarPortada`: avance del scroll (0-1) → fotograma. */
let fotogramaDeAvance = () => 0;

function cancelarViaje() {
  tokenViaje += 1;
  viajando = false;
  posicionForzada = null;
  refrescarPortada();
}

function prefiereMenosMovimiento() {
  if (new URLSearchParams(window.location.search).has('animar')) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rutaFotograma(indice) {
  return `/fondo/${String(indice + 1).padStart(4, '0')}.avif`;
}

/** Avance del scroll (0-1) → fotograma, con la parada al principio de cada cuarto. */
function repartir(avance) {
  const total = Math.min(Math.max(avance, 0), 1) * TRAMOS;
  const tramo = Math.min(Math.floor(total), TRAMOS - 1);
  const dentro = total - tramo;

  if (dentro <= PAUSA) return tramo * FOTOGRAMAS_POR_TRAMO;

  const resto = (dentro - PAUSA) / (1 - PAUSA);
  // Curva casi lineal: un suavizado puro acelera en el medio y se percibe como
  // «avanzo poco y corre mucho».
  const curva = 0.3 * (resto * resto * (3 - 2 * resto)) + 0.7 * resto;
  // Nunca por encima del ultimo: pedir el 240 de 240 no existe y la foto del cierre
  // se quedaba a medias de opacidad.
  return Math.min((tramo + curva) * FOTOGRAMAS_POR_TRAMO, TRAMOS * FOTOGRAMAS_POR_TRAMO - 1);
}


/**
 * Estado del desenfoque: 0 sin desenfoque, 1 tapando la pantalla.
 *
 * En los tres primeros cruces es simétrico, centrado en su punto. En el último se
 * mantiene hasta el final, porque el recorrido de ese tramo es el más largo.
 */
function estadoPortal(avance) {
  const total = limitar(avance, 0, 1) * TRAMOS;
  const tramo = Math.min(Math.floor(total), TRAMOS - 1);
  const dentro = total - tramo;

  // Arranca en cuanto se va el apartado y se abre justo al llegar la escena
  // siguiente, que entra con su texto ya nitido.
  const subida = limitar((dentro - 0.28) / 0.1, 0, 1);
  const bajada = limitar((dentro - 0.9) / 0.1, 0, 1);
  return subida * (1 - bajada);
}

export function iniciarPortada() {
  const portada = document.querySelector('[data-scrolly]');
  if (!portada) return false;

  const lienzo = portada.querySelector('[data-lienzo]');
  const capa = portada.querySelector('[data-capa]');
  const portal = portada.querySelector('[data-portal]');
  const total = Number(portada.dataset.total || 0);
  const secciones = Array.from(portada.querySelectorAll('[data-seccion]'));
  const fotos = Array.from(portada.querySelectorAll('[data-foto]')).map((elemento) => ({
    elemento,
    inicio: Number(elemento.dataset.inicio || 0),
  }));
  if (!lienzo || !capa || total < 2) return false;

  const contexto = lienzo.getContext('2d');
  if (!contexto) return false;
  contexto.imageSmoothingEnabled = true;
  contexto.imageSmoothingQuality = 'high';

  const sinMovimiento = prefiereMenosMovimiento();
  const imagenes = new Array(total).fill(null);
  const estado = { posicion: 0, ancho: 0, alto: 0, dpr: 1 };
  let objetivo = 0;
  let animando = false;
  let peticion = null;

  // ---- Fotogramas --------------------------------------------------------

  function estaLista(indice) {
    // `typeof null === 'object'`: un hueco sin cargar se colaría como imagen.
    return imagenes[indice] instanceof HTMLImageElement;
  }

  function cargar(indice) {
    if (indice < 0 || indice >= total || imagenes[indice] !== null) return;
    imagenes[indice] = 'cargando';
    const imagen = new Image();
    imagen.decoding = 'async';
    imagen.addEventListener('load', () => {
      imagenes[indice] = imagen;
      pintar();
    });
    imagen.addEventListener('error', () => {
      imagenes[indice] = 'error';
    });
    imagen.src = rutaFotograma(indice);
  }

  /**
   * Pide todos los fotogramas de una vez.
   *
   * Antes se pedian por capas (uno de cada 24, luego de cada 12...) para pintar algo
   * cuanto antes. El problema es que al llegar a un tramo cuyos fotogramas aun no
   * habian llegado, el dibujo se quedaba quieto y luego saltaba. Pidiendolos todos de
   * golpe, el navegador los encola y en dos o tres segundos esta el recorrido entero.
   */
  function precargar() {
    for (let i = 0; i < total; i += 1) cargar(i);
  }


  /**
   * Pide los fotogramas que rodean a la posicion actual.
   *
   * La carga por capas trae antes los pares que los impares, y al llegar al final del
   * recorrido los ultimos podian no estar: el dibujo caia al mas cercano descargado y
   * la escena saltaba. Pidiendo el entorno de la camara en cada movimiento, el tramo
   * que se esta viendo siempre esta listo.
   */
  function precargarAlrededor(centro) {
    const desde = Math.max(0, Math.floor(centro) - 10);
    const hasta = Math.min(total - 1, Math.ceil(centro) + 36);
    for (let i = desde; i <= hasta; i += 1) cargar(i);
  }

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    estado.ancho = portada.clientWidth;
    estado.alto = window.innerHeight;
    estado.dpr = dpr;
    lienzo.width = Math.round(estado.ancho * dpr);
    lienzo.height = Math.round(estado.alto * dpr);
    pintar();
  }

  function pintar() {
    const { ancho, alto, dpr } = estado;
    if (ancho === 0 || alto === 0) return;

    contexto.setTransform(1, 0, 0, 1, 0, 0);
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);

    let indice = Math.round(estado.posicion);
    if (!estaLista(indice)) {
      // Se busca cerca, no en cualquier sitio: saltar a un fotograma lejano es lo que
      // hacia que la escena cambiara de golpe cuando faltaba el tramo descargado.
      let atras = indice;
      while (atras >= 0 && !estaLista(atras)) atras -= 1;
      let adelante = indice;
      while (adelante < total && !estaLista(adelante)) adelante += 1;
      if (atras < 0 && adelante >= total) return;
      indice = atras >= 0 && (adelante >= total || indice - atras <= adelante - indice) ? atras : adelante;
    }

    portada.dataset.fotograma = String(indice);

    const imagen = imagenes[indice];
    const escala = Math.max(ancho / imagen.naturalWidth, alto / imagen.naturalHeight);
    const w = imagen.naturalWidth * escala;
    const h = imagen.naturalHeight * escala;
    contexto.drawImage(imagen, (lienzo.width - w * dpr) / 2, (lienzo.height - h * dpr) / 2, w * dpr, h * dpr);

  }

  /**
   * Enciende las fotos nitidas segun el scroll, no segun el fotograma.
   *
   * La foto y el fotograma son dos imagenes distintas de la misma pared: si se mezclan
   * a medias se ven los dos rotulos superpuestos. Por eso la foto esta **entera**
   * mientras la camara esta parada, y se apaga en un pelin de scroll cuando arranca.
   */
  function actualizarFotos(avance) {
    const total = avance * TRAMOS;
    const tramo = Math.min(Math.floor(total), TRAMOS - 1);
    const dentro = total - tramo;

    fotos.forEach((foto, indice) => {
      const imagen = foto.elemento.querySelector('img');
      let opacidad = 0;

      if (indice < TRAMOS) {
        // Nitida mientras la camara esta parada; en cuanto arranca, se va. Asi el
        // recorrido se ve entero y no se mezclan dos imagenes de la misma pared.
        opacidad = indice === tramo && dentro <= PAUSA ? 1 : 0;
      } else {
        // La estatua entra ya borrosa, al final del ultimo tramo.
        opacidad = limitar((avance - 0.965) / 0.012, 0, 1);
      }

      if (opacidad > 0 && imagen && !imagen.getAttribute('src')) {
        imagen.setAttribute('srcset', imagen.dataset.fuenteSet || '');
        imagen.setAttribute('src', imagen.dataset.fuente || '');
      }
      foto.elemento.style.setProperty('--op-foto', opacidad.toFixed(3));
    });
  }




  /** Avance suavizado: la posición dibujada persigue a la del scroll. */
  function animar() {
    const diferencia = objetivo - estado.posicion;
    if (Math.abs(diferencia) < 0.02) {
      estado.posicion = objetivo;
      pintar();
      animando = false;
      return;
    }
    estado.posicion += diferencia * 0.16;
    pintar();
    window.requestAnimationFrame(animar);
  }




  /** Abre y cierra el círculo del cruce. */
  function actualizarPortal(avance) {
    if (!portal) return;
    const curva = suavizar(estadoPortal(avance));
    portal.style.setProperty('--radio', (curva * 115).toFixed(2));
    portal.style.setProperty('--desenfoque', (curva * 16).toFixed(2));
    portal.dataset.visible = curva > 0.004 ? 'si' : 'no';
  }



  // ---- Paneles de texto --------------------------------------------------

  function actualizarPaneles() {
    const altoPantalla = window.innerHeight;
    const recorrido = portada.offsetHeight - altoPantalla;
    const avance = recorrido > 0
      ? limitar((window.scrollY - portada.offsetTop) / recorrido, 0, 1)
      : 0;

    const ultima = secciones.length - 1;

    secciones.forEach((seccion, indice) => {
      const panel = seccion.querySelector('[data-panel]');
      if (!panel) return;

      const objetivoApartado = APARECE_EN[indice];
      let lejania;

      if (objetivoApartado === null || objetivoApartado === undefined) {
        const caja = seccion.getBoundingClientRect();
        const centro = caja.top + caja.height / 2;
        lejania = Math.abs((centro - altoPantalla / 2) / (caja.height / 2 + altoPantalla / 2)) / 0.46;
      } else {
        const ventana = indice === 0 ? VENTANA_PORTADA : indice === ultima ? VENTANA_FINAL : VENTANA_APARTADO;
        lejania = Math.abs(avance - objetivoApartado) / ventana;
      }

      const bruto = limitar(1 - (lejania - 0.1) / 0.36, 0, 1);
      // Durante un viaje entre apartados no se enseña ningún texto: solo la cámara.
      const opacidad = viajando ? 0 : bruto * bruto * (3 - 2 * bruto);

      panel.style.setProperty('--opacidad-panel', opacidad.toFixed(3));
      if (opacidad > 0.5) panel.dataset.visible = 'si';
      else delete panel.dataset.visible;
    });

    actualizarFotos(avance);
  }

  // ---- Scroll ------------------------------------------------------------

  function actualizar() {
    peticion = null;
    actualizarPaneles();
    if (sinMovimiento) return;

    const recorrido = portada.offsetHeight - window.innerHeight;
    if (recorrido <= 0) return;

    const avance = limitar((window.scrollY - portada.offsetTop) / recorrido, 0, 1);
    actualizarPortal(avance);
    objetivo = posicionForzada !== null ? posicionForzada : repartir(avance);
    precargarAlrededor(objetivo);

    const fondo = portada.querySelector('[data-fondo]');
    if (fondo) {
      // Velo de las escenas: mas oscuro que antes, para que el texto se lea siempre.
      fondo.style.setProperty('--fuerza-velo', (0.42 + avance * 0.26).toFixed(3));

      // Sin luz calida: se probo y la portada quedaba demasiado clara.
      fondo.style.setProperty('--luz-portada', '0');

      // El rotulo pintado de la pared se apaga solo en la portada: si no, se leen dos
      // JARDIN a la vez, el del logotipo y el de la pared.
      fondo.style.setProperty('--velo-lado', (limitar(1 - avance / 0.03, 0, 1) * 0.9).toFixed(3));
    }

    if (!animando) {
      animando = true;
      window.requestAnimationFrame(animar);
    }
  }

  function pedirPintado() {
    if (peticion !== null) return;
    peticion = window.requestAnimationFrame(actualizar);
  }

  window.addEventListener('scroll', pedirPintado, { passive: true });
  window.addEventListener('resize', () => {
    redimensionar();
    pedirPintado();
  });

  try {
    redimensionar();
    precargar();
    refrescarPortada = pedirPintado;
    fotogramaDeAvance = repartir;
    if (sinMovimiento) {
      estado.posicion = 0;
      pintar();
      actualizarPaneles();
    } else {
      actualizar();
    }
  } catch (error) {
    console.error('No se pudo dibujar el recorrido:', error);
  }

  return true;
}

/**
 * Cabecera, índice y viaje entre apartados.
 *
 * El destino de cada apartado es la parada de cámara donde se enciende su foto, y el
 * viaje lo conduce `viajarA` con los paneles apagados.
 */
export function iniciarNavegacion() {
  const encabezado = document.querySelector('[data-encabezado]');
  const indice = document.querySelector('[data-indice]');
  const abrir = document.querySelector('[data-abrir-indice]');
  const cerrar = document.querySelector('[data-cerrar-indice]');
  const enlaces = Array.from(document.querySelectorAll('[data-enlace-apartado]'));

  function destinoDeApartado(id) {
    const seccion = id === 'portada' ? null : document.getElementById(id);
    if (!seccion) return 0;

    const portada = document.querySelector('[data-scrolly]');
    if (portada) {
      const secciones = Array.from(portada.querySelectorAll('[data-seccion]'));
      const posicion = secciones.indexOf(seccion);
      const objetivo = APARECE_EN[posicion];
      const recorrido = portada.offsetHeight - window.innerHeight;
      if (objetivo !== null && objetivo !== undefined && recorrido > 0) {
        return Math.max(0, portada.offsetTop + objetivo * recorrido);
      }
    }

    const centro = seccion.getBoundingClientRect().top + window.scrollY + seccion.offsetHeight / 2;
    return Math.max(0, centro - window.innerHeight / 2);
  }

  function viajarA(destinoY) {
    const desde = window.scrollY;
    const distancia = destinoY - desde;
    if (Math.abs(distancia) < 40) return;

    cancelarViaje();
    const token = tokenViaje;
    viajando = true;

    const portada = document.querySelector('[data-scrolly]');
    let fotogramaDesde = null;
    let fotogramaHasta = null;
    if (portada) {
      const recorrido = portada.offsetHeight - window.innerHeight;
      if (recorrido > 0) {
        fotogramaDesde = fotogramaDeAvance(limitar((desde - portada.offsetTop) / recorrido, 0, 1));
        fotogramaHasta = fotogramaDeAvance(limitar((destinoY - portada.offsetTop) / recorrido, 0, 1));
      }
    }
    refrescarPortada();

    // El CSS tiene `scroll-behavior: smooth` y pelearía con este bucle.
    const raiz = document.documentElement;
    const comportamientoPrevio = raiz.style.scrollBehavior;
    raiz.style.scrollBehavior = 'auto';

    // Duración de 1,1 a 3,6 s según la distancia. El divisor fija la velocidad.
    const duracion = Math.min(3600, Math.max(1100, Math.abs(distancia) / 1.3));
    const arranque = performance.now();

    function paso(ahora) {
      if (token !== tokenViaje) {
        raiz.style.scrollBehavior = comportamientoPrevio;
        return;
      }
      const avance = Math.min((ahora - arranque) / duracion, 1);
      // Curva quíntica: arranca y frena con la derivada segunda a cero.
      const suave = avance * avance * avance * (avance * (avance * 6 - 15) + 10);
      window.scrollTo(0, desde + distancia * suave);
      if (fotogramaDesde !== null && fotogramaHasta !== null) {
        posicionForzada = fotogramaDesde + (fotogramaHasta - fotogramaDesde) * suave;
      }
      refrescarPortada();
      if (avance < 1) {
        window.requestAnimationFrame(paso);
        return;
      }
      raiz.style.scrollBehavior = comportamientoPrevio;
      viajando = false;
      posicionForzada = null;
      refrescarPortada();
    }

    window.requestAnimationFrame(paso);
  }

  ['wheel', 'touchstart', 'keydown'].forEach((gesto) => {
    window.addEventListener(gesto, cancelarViaje, { passive: true });
  });

  function irA(destino) {
    const destinoY = destinoDeApartado(destino);
    if (prefiereMenosMovimiento()) {
      window.scrollTo(0, destinoY);
      return;
    }
    viajarA(destinoY);
  }

  enlaces.forEach((enlace) => {
    enlace.addEventListener('click', (evento) => {
      const destino = enlace.dataset.destino;
      if (!destino) return;
      // Sin JS, el enlace sigue funcionando como ancla normal.
      evento.preventDefault();
      cerrarIndice();
      irA(destino);
      enlace.blur();
    });
  });

  if (!indice || !abrir) return;

  let focoAnterior = null;

  function abrirIndice() {
    focoAnterior = document.activeElement;
    indice.dataset.abierto = 'si';
    abrir.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const primero = indice.querySelector('.indice__lista a') || indice.querySelector('a, button');
    if (primero) primero.focus();
  }

  function cerrarIndice() {
    if (indice.dataset.abierto !== 'si') return;
    indice.dataset.abierto = 'no';
    abrir.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (focoAnterior instanceof HTMLElement) focoAnterior.focus();
  }

  abrir.addEventListener('click', abrirIndice);
  cerrar?.addEventListener('click', cerrarIndice);

  document.addEventListener('keydown', (evento) => {
    if (indice.dataset.abierto !== 'si') return;
    if (evento.key === 'Escape') {
      evento.preventDefault();
      cerrarIndice();
      return;
    }
    if (evento.key !== 'Tab') return;
    const focos = Array.from(indice.querySelectorAll('a, button'));
    if (focos.length === 0) return;
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  });

  const pelicula = document.querySelector('[data-scrolly]');
  if (pelicula && encabezado) {
    const alDesplazarCabecera = () => {
      const saliendo = window.scrollY > window.innerHeight * 0.55;
      encabezado.dataset.visible = saliendo ? 'si' : 'no';
    };
    window.addEventListener('scroll', alDesplazarCabecera, { passive: true });
    alDesplazarCabecera();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      iniciarNavegacion();
      iniciarPortada();
    },
    { once: true },
  );
} else {
  iniciarNavegacion();
  iniciarPortada();
}
