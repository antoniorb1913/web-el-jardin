/**
 * Arranque del scrollytelling (T5).
 *
 * El fondo son 484 fotogramas del recorrido por el bar. El scroll elige cuál se
 * dibuja en el `<canvas>` y los paneles de texto aparecen y se desvanecen encima.
 *
 * Decisiones que conviene no deshacer sin saber qué hacen:
 *
 * - **Un solo fotograma por repintado**, el más cercano. Mezclar dos (aunque sean
 *   contiguos) deja un fantasma visible: la cámara está en dos sitios a la vez.
 * - **Inercia**: la posición dibujada persigue a la del scroll, para que las muescas
 *   de la rueda no se noten como saltos. El bucle se apaga solo al llegar.
 * - **Paneles fijos** en el centro de la pantalla: no viajan con el scroll, solo
 *   cambian de opacidad. Entre uno y otro queda un tramo en el que solo se ve el bar.
 */

/** Opacidad mínima a la que baja el fondo al final del recorrido. */
const OPACIDAD_MINIMA = 0.35;

/**
 * Nitidez puntual en el primer fotograma de cada escena.
 *
 * Cada foto es el primer fotograma de su clip, así que se enciende justo ahí.
 *
 * La duración es corta a propósito: mientras la foto está encendida, la animación
 * de debajo sigue avanzando. Si se apagara despacio, se verían las dos imágenes
 * superpuestas (la foto quieta y el vídeo movido) — la doble exposición de siempre.
 * En 5 fotogramas la cámara apenas se ha movido y la mezcla no se aprecia; en 20 sí.
 */
const ENTRADA_FOTO = 2;
const SALIDA_FOTO = 3;

/**
 * Freno en el primer fotograma de cada escena, en fotogramas.
 *
 * Sin esto el destello nítido dura 120 px de scroll y una sola muesca de rueda se lo
 * salta sin verlo. Durante estos fotogramas el lienzo se queda clavado en el corte:
 * como la foto y el fotograma son la misma imagen, la foto puede estar encendida sin
 * que aparezca nada doble. Son unos 145 px de pausa, que no se leen como tirón.
 */
const FRENO = 3;

/**
 * Reparto del scroll entre los cuatro clips.
 *
 * Cada tramo empieza con la cámara **parada** (`PAUSA` de su recorrido) y luego
 * arranca y acelera. Es la única forma de que la foto nítida se vea de verdad: si la
 * cámara sigue andando, el destello dura un parpadeo y una muesca de rueda se lo
 * salta. Parada, la imagen es la misma que el fotograma de debajo y se puede mirar
 * sin que aparezca nada doble.
 *
 * `PAUSA = 0.2` son unos 590 px de scroll quieto al principio de cada escena.
 *
 * Ojo al tocarlo: alargar la parada **acelera la animación**, porque el recorrido de
 * la sección es fijo y el trozo que camina se queda más corto. Si se sube, hay que
 * subir también la altura de las secciones en `index.astro`.
 */
const PAUSA = 0.26;

/** Número de clips del vídeo, que es también el de fotos nítidas. */
const TRAMOS = 4;

/** Fotogramas por clip. */
const FOTOGRAMAS_POR_TRAMO = 121;

/** Avance dentro de un tramo: parado al principio, luego acelera y frena. */
function repartir(avance) {
  const total = Math.min(Math.max(avance, 0), 1) * TRAMOS;
  const tramo = Math.min(Math.floor(total), TRAMOS - 1);
  const dentro = total - tramo;

  if (dentro <= PAUSA) return tramo * FOTOGRAMAS_POR_TRAMO;

  const resto = (dentro - PAUSA) / (1 - PAUSA);
  // Curva casi lineal. Con un suavizado puro la cámara va despacio al principio y al
  // final, pero **se acelera en el medio** hasta un 50 % por encima de la media, y
  // eso es justo lo que se percibe como «avanzo poco y corre mucho». Mezclada con la
  // recta, la velocidad se queda parecida en todo el tramo.
  const curva = 0.3 * (resto * resto * (3 - 2 * resto)) + 0.7 * resto;
  return (tramo + curva) * FOTOGRAMAS_POR_TRAMO;
}

/** Antelación con la que se pide la foto, en fotogramas, para que llegue a tiempo. */
const ANTELACION_FOTO = 40;

/**
 * Pasos de carga, en fotogramas de separación, y cuándo empieza cada uno.
 * Con 484 fotogramas: primero 10 (uno de cada 48) y luego se rellenan los huecos.
 * Así hay algo que enseñar en cuanto se abre la página (unos 350 KB).
 */
const PASOS_CARGA = [48, 24, 8, 1];
const RETARDOS_CARGA = [0, 700, 1800, 3500];

const limitar = (valor, min, max) => Math.min(Math.max(valor, min), max);

/** Curva de entrada y salida suave, sin saltos en los extremos. */
const suavizar = (valor) => valor * valor * (3 - 2 * valor);

function prefiereMenosMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Ruta de un fotograma: /fondo/0001.avif … /fondo/0484.avif */
function rutaFotograma(indice) {
  return `/fondo/${String(indice + 1).padStart(4, '0')}.avif`;
}

export function iniciarPortada() {
  const portada = document.querySelector('[data-scrolly]');
  if (!portada) return false;

  const lienzo = portada.querySelector('[data-lienzo]');
  const capa = portada.querySelector('[data-capa]');
  const fondo = portada.querySelector('[data-fondo]');
  const total = Number(portada.dataset.total || 0);
  const secciones = Array.from(portada.querySelectorAll('[data-seccion]'));
  const fotos = Array.from(portada.querySelectorAll('[data-foto]')).map((capa) => ({
    capa,
    inicio: Number(capa.dataset.inicio || 0),
  }));
  if (!lienzo || !capa || !fondo || total < 2) return false;

  const contexto = lienzo.getContext('2d');
  if (!contexto) return false;
  contexto.imageSmoothingEnabled = true;
  contexto.imageSmoothingQuality = 'high';

  // `?animar=1` fuerza la secuencia aunque el sistema pida menos movimiento. Sirve
  // para revisar el efecto en un equipo que tenga las animaciones desactivadas.
  const forzarAnimacion = new URLSearchParams(window.location.search).has('animar');
  const sinMovimiento = !forzarAnimacion && prefiereMenosMovimiento();

  const imagenes = new Array(total).fill(null);
  const estado = { posicion: 0, ancho: 0, alto: 0, dpr: 1 };
  let peticion = null;
  let ultimoFallo = '';
  let objetivo = 0;
  let animando = false;

  // ---- Fotogramas --------------------------------------------------------

  function estaLista(indice) {
    // `typeof null === 'object'`, así que no vale comprobar el typeof: un hueco sin
    // cargar se colaría como imagen y reventaría al leer `naturalWidth`.
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

  function precargar() {
    PASOS_CARGA.forEach((paso, orden) => {
      const tanda = () => {
        for (let i = 0; i < total; i += paso) cargar(i);
      };
      if (orden === 0) tanda();
      else window.setTimeout(tanda, RETARDOS_CARGA[orden]);
    });
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

  /** Dibuja el fotograma más cercano a la posición actual. */
  function pintar() {
    const { ancho, alto, dpr } = estado;
    if (ancho === 0 || alto === 0) return;

    contexto.setTransform(1, 0, 0, 1, 0, 0);
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);

    let indice = Math.round(estado.posicion);

    // Freno en el arranque de cada escena: el lienzo se queda en ese fotograma
    // mientras la foto nítida está encendida.
    for (const { inicio } of fotos) {
      if (Math.abs(estado.posicion - inicio) <= FRENO) {
        indice = inicio;
        break;
      }
    }

    if (!estaLista(indice)) {
      let atras = indice;
      while (atras >= 0 && !estaLista(atras)) atras -= 1;
      let adelante = indice;
      while (adelante < total && !estaLista(adelante)) adelante += 1;
      if (atras < 0 && adelante >= total) return;
      indice = atras >= 0 && (adelante >= total || indice - atras <= adelante - indice)
        ? atras
        : adelante;
    }

    const imagen = imagenes[indice];
    // La imagen llena siempre la pantalla (`cover`): se recorta lo que sobre, casi
    // siempre por los lados. Los fotogramas vienen en 16:9, así que el recorte es
    // mínimo.
    const escala = Math.max(ancho / imagen.naturalWidth, alto / imagen.naturalHeight);
    const w = imagen.naturalWidth * escala;
    const h = imagen.naturalHeight * escala;

    contexto.drawImage(
      imagen,
      (lienzo.width - w * dpr) / 2,
      (lienzo.height - h * dpr) / 2,
      w * dpr,
      h * dpr,
    );

    actualizarFotos();
  }

  /**
   * Enciende la foto nítida de la escena que empieza en este punto de la secuencia.
   * Se llama desde `pintar()`, así que va siempre sincronizada con el fotograma que
   * hay debajo (que es el mismo encuadre).
   */
  function actualizarFotos() {
    for (const { capa: foto, inicio } of fotos) {
      const imagen = foto.querySelector('img');
      // La foto se pide cuando la cámara está a 40 fotogramas del corte: da tiempo a
      // descargarla y no se paga en la primera visita si el visitante no llega.
      if (imagen && estado.posicion >= inicio - ANTELACION_FOTO) {
        if (!imagen.getAttribute('src')) {
          imagen.setAttribute('srcset', imagen.dataset.fuenteSet || '');
          imagen.setAttribute('src', imagen.dataset.fuente || '');
        }
      }

      const entrada = limitar((estado.posicion - (inicio - ENTRADA_FOTO)) / ENTRADA_FOTO, 0, 1);
      const salida = limitar(1 - (estado.posicion - inicio) / SALIDA_FOTO, 0, 1);
      const opacidad = suavizar(Math.min(entrada, salida));
      foto.style.setProperty('--op-foto', opacidad.toFixed(3));
    }
  }

  /**
   * Avance suavizado: la posición dibujada persigue a la del scroll. La rueda del
   * ratón da saltos de ~100 px y sin esto se ven escalones de varios fotogramas.
   */
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

  // ---- Paneles de texto --------------------------------------------------

  function actualizarPaneles() {
    const altoPantalla = window.innerHeight;
    const medio = altoPantalla / 2;

    secciones.forEach((seccion, indice) => {
      const panel = seccion.querySelector('[data-panel]');
      if (!panel) return;

      let lejania;

      if (indice === secciones.length - 1) {
        // El último apartado se mide contra el **final de la página**, no contra el
        // centro de la pantalla: su sección termina en el borde del documento y su
        // centro nunca llega a quedar centrado. Así aparece junto a la última foto
        // nítida y se queda puesto al llegar abajo.
        const resto = document.documentElement.scrollHeight
          - (window.scrollY + window.innerHeight);
        lejania = limitar(resto / (window.innerHeight * 0.6), 0, 2);
      } else {
        const caja = seccion.getBoundingClientRect();
        const centroSeccion = caja.top + caja.height / 2;
        // -1: sección entera por debajo · 0: centrada · +1: ya pasó por arriba.
        lejania = Math.abs((centroSeccion - medio) / (caja.height / 2 + medio));
      }

      // La ventana es estrecha a propósito: el texto se ve cerca de su punto y luego
      // se desvanece, dejando un tramo en el que solo se ve el bar en movimiento.
      const bruto = limitar(1 - (lejania - 0.1) / 0.36, 0, 1);
      const opacidad = bruto * bruto * (3 - 2 * bruto);

      panel.style.setProperty('--opacidad-panel', opacidad.toFixed(3));
      if (opacidad > 0.5) panel.dataset.visible = 'si';
      else delete panel.dataset.visible;
    });
  }

  // ---- Scroll ------------------------------------------------------------

  function alDesplazar() {
    peticion = null;
    actualizarPaneles();
    if (sinMovimiento) return;

    const inicio = portada.offsetTop;
    const recorrido = portada.offsetHeight - window.innerHeight;
    if (recorrido > 0) {
      const avance = limitar((window.scrollY - inicio) / recorrido, 0, 1);
      objetivo = Math.min(repartir(avance), total - 1);
      capa.style.setProperty(
        '--opacidad-fondo',
        (1 - avance * (1 - OPACIDAD_MINIMA)).toFixed(3),
      );
      // El velo sube poco a poco: lo justo para que el texto gane contraste sin
      // apagar la foto. Si sube más, al final del recorrido no se ve el bar.
      fondo.style.setProperty('--fuerza-velo', (0.3 + avance * 0.3).toFixed(3));
    }

    if (!animando) {
      animando = true;
      window.requestAnimationFrame(animar);
    }
  }

  function pedirPintado() {
    if (peticion !== null) return;
    peticion = window.requestAnimationFrame(alDesplazar);
  }

  window.addEventListener('scroll', pedirPintado, { passive: true });
  window.addEventListener('resize', () => {
    redimensionar();
    pedirPintado();
  });
  if (sinMovimiento) capa.style.setProperty('--opacidad-fondo', '0.6');

  // ---- Panel de estado (temporal, se quita en T17) -----------------------
  // Se crea antes de dibujar nada: si el dibujado revienta, el panel sigue ahí y
  // muestra el fallo en vez de dejar la pantalla en blanco sin explicación.
  const panelEstado = document.createElement('div');
  panelEstado.className = 'panel-depuracion';
  portada.appendChild(panelEstado);

  window.setInterval(() => {
    const cargados = imagenes.filter((i) => i instanceof HTMLImageElement).length;
    panelEstado.textContent = [
      `modo: ${sinMovimiento ? 'estatico' : 'secuencia'}`,
      `fotograma: ${estado.posicion.toFixed(1)} de ${total - 1}`,
      `cargados: ${cargados} de ${total}`,
      `fallo: ${ultimoFallo || 'ninguno'}`,
    ].join('\n');
  }, 500);

  try {
    redimensionar();
    precargar();
    if (sinMovimiento) {
      estado.posicion = 0;
      pintar();
      actualizarPaneles();
    } else {
      alDesplazar();
    }
  } catch (error) {
    ultimoFallo = error instanceof Error ? error.message : String(error);
  }

  return true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarPortada, { once: true });
} else {
  iniciarPortada();
}
