/**
 * Tira horizontal de la carta.
 *
 * Es un carril que se desplaza en horizontal: se arrastra, se mueve con las flechas o con
 * el desplazamiento lateral del trackpad, y la barra de abajo marca por dónde vas.
 *
 * Las flechas no usan el desplazamiento suave del navegador: ese arranca y frena de golpe
 * y con el enganche da tirones. Aquí se mueve a mano con una curva que arranca despacio,
 * acelera en el centro y frena al final, y el enganche se apaga mientras dura el
 * movimiento para que no luche con él.
 */

/** Cuánto tarda una flecha en llevar a la tarjeta siguiente, en milisegundos. */
const DURACION = 660;

/** Arranca despacio, acelera en el centro y frena: la curva de una puerta con muelle. */
function suavizar(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

/**
 * El carrusel de una carta: la tira, la tarjeta destacada y las flechas.
 *
 * Vale para cualquier bloque con `[data-carta]`, tenga cartas de la carta o fotos de la
 * galería. Se marca como iniciada para que no se enganchen los manejadores dos veces
 * cuando la página tiene varios de estos bloques.
 */
/**
 * Engancha una acción al `click` **y** al `pointerup`.
 *
 * Dentro del panel del recorrido el navegador entrega el `pointerdown` y el `pointerup`
 * pero no siempre emite el `click` con ratón —lo descubrimos con las flechas del
 * carrusel—, así que un botón enganchado solo al `click` parece muerto. Se escuchan los
 * dos con un cerrojo corto para que, cuando el `click` sí llega, no se ejecute dos veces.
 */
function alPulsar(elemento, accion) {
  if (!elemento) return;
  let ultima = 0;
  const lanzar = (evento) => {
    const ahora = Date.now();
    if (ahora - ultima < 300) return;
    ultima = ahora;
    accion(evento);
  };
  elemento.addEventListener('click', lanzar);
  elemento.addEventListener('pointerup', lanzar);
}

export function iniciarTira(carta) {
    const tira = carta.querySelector('[data-tira]');
    if (!tira || carta.dataset.iniciada === 'si') return;
    carta.dataset.iniciada = 'si';

        const anterior = carta.querySelector('[data-anterior]');
    const siguiente = carta.querySelector('[data-siguiente]');
    const rayas = Array.from(carta.querySelectorAll('[data-raya]'));
    const piezas = Array.from(tira.querySelectorAll('.tira__pieza'));
    if (piezas.length === 0) return;

    let animando = false;

    /** Dónde empieza cada tarjeta, medido sobre el carril. */
    function posiciones() {
      const margen = parseFloat(getComputedStyle(tira).paddingLeft) || 0;
      return piezas.map((pieza) => pieza.offsetLeft - tira.offsetLeft - margen);
    }

    /**
     * Las paradas de verdad: cada tarjeta al borde izquierdo, pero sin pasarse del final
     * del carril. Las últimas tarjetas comparten parada con el tope, y esas se descartan.
     *
     * Sin esto, con un ancho de una tarjeta y media, el carril tiene dos posiciones para
     * tres fotos y las flechas se saltaban una: `indiceActual` decía «voy por la segunda»
     * cuando el carril ya estaba al final.
     */
    function paradas() {
      const tope = Math.max(0, tira.scrollWidth - tira.clientWidth);
      const lista = [];
      posiciones().forEach((punto) => {
        const destino = Math.min(Math.max(punto, 0), tope);
        if (lista.length === 0 || Math.abs(destino - lista[lista.length - 1]) > 2) {
          lista.push(destino);
        }
      });
      return lista;
    }

    /** La parada más cercana a la posición actual del carril. */
    function indiceActual() {
      const lista = paradas();
      let mejor = 0;
      let distancia = Infinity;
      lista.forEach((punto, i) => {
        const diferencia = Math.abs(punto - tira.scrollLeft);
        if (diferencia < distancia) {
          distancia = diferencia;
          mejor = i;
        }
      });
      return mejor;
    }

    /**
     * Lleva el carril a una posición con la curva de arriba.
     *
     * Se anima siempre, también con «reducir movimiento»: es un desplazamiento corto
     * dentro de su propio carril y, sin animación, la flecha pega un salto seco que se
     * lee como un fallo.
     */
    function desplazarA(destino) {
      const limite = tira.scrollWidth - tira.clientWidth;
      const objetivo = Math.max(0, Math.min(destino, limite));
      const inicio = tira.scrollLeft;
      const distancia = objetivo - inicio;

      if (Math.abs(distancia) < 1) return;

      // El enganche se apaga mientras dura el movimiento: si no, tira del carril a su
      // manera y el recorrido se ve a saltos.
      animando = true;
      tira.style.scrollSnapType = 'none';

      const arranque = performance.now();

      function paso(ahora) {
        const avance = Math.min((ahora - arranque) / DURACION, 1);
        tira.scrollLeft = inicio + distancia * suavizar(avance);

        if (avance < 1) {
          requestAnimationFrame(paso);
          return;
        }

        tira.style.scrollSnapType = '';
        animando = false;
      }

      requestAnimationFrame(paso);
    }

    function mover(direccion) {
      const lista = paradas();
      const destino = lista[indiceActual() + direccion];
      // Si no hay parada en esa dirección, la flecha no hace nada (y ya está deshabilitada).
      if (destino === undefined) return;
      desplazarA(destino);
    }

    /** La barra de progreso, el estado de las flechas y el ancho del bloque. */
    function pintarProgreso() {
      const recorrido = tira.scrollWidth - tira.clientWidth;

      // Una raya por parada: se enciende la de la posición que manda en el carril. Si
      // caben dos fotos a la vez hay una parada menos que fotos, y la raya que sobra se
      // oculta en vez de quedarse muerta.
      const total = paradas().length;
      const activa = indiceActual();
      rayas.forEach((raya, i) => {
        raya.hidden = i >= total;
        if (i === activa) raya.dataset.activa = 'si';
        else delete raya.dataset.activa;
      });


      if (anterior) anterior.disabled = tira.scrollLeft <= 2;
      if (siguiente) siguiente.disabled = tira.scrollLeft >= recorrido - 2;

      // Cuando no hay nada que desplazar —la comida son tres piezas— la tira se centra.
      tira.dataset.llena = recorrido <= 2 ? 'si' : 'no';

      // El título, la nota, la barra y las flechas comparten el ancho que ocupan las
      // fotos. Se mide de la primera a la última tarjeta, no con `scrollWidth`: ese
      // devuelve como mínimo el ancho visible y dejaba la cabecera más ancha que las
      // fotos cuando la tira cabía entera.
      const primera = piezas[0];
      const ultima = piezas[piezas.length - 1];
      const anchoFotos = Math.min(
        ultima.offsetLeft + ultima.offsetWidth - primera.offsetLeft,
        tira.clientWidth,
      );
      carta.style.setProperty('--ancho-tira', `${Math.round(anchoFotos)}px`);

      // El texto de la izquierda se alinea con la primera foto, no con un porcentaje de
      // la pantalla: se mide dónde empieza la tira y se le pasa al CSS en píxeles. Con un
      // valor fijo, en un monitor se ve bien y en el otro no.
      const aire = parseFloat(getComputedStyle(tira).paddingTop) || 0;
      carta.style.setProperty('--texto-top', `${Math.round(tira.offsetTop + aire)}px`);
    }

    /*
     * Las flechas responden al `pointerup`, no solo al `click`.
     *
     * Dentro del panel del recorrido, el navegador recibe el `pointerdown` y el
     * `pointerup` de la flecha pero **no llega a emitir el `click`**, así que la flecha
     * se quedaba muerta al ratón —aunque funcionaba con el teclado y al llamarla desde
     * consola—. Se escuchan los dos gestos con un cerrojo de 300 ms para que, cuando el
     * `click` sí llega, no se mueva dos veces.
     */
    // Pulsar una raya lleva a su pieza. Se usa el mismo desplazamiento que las flechas.
    rayas.forEach((raya, indice) => {
      raya.addEventListener('click', () => {
        const destino = paradas()[indice];
        if (destino !== undefined) desplazarA(destino);
      });
    });

    let ultimoMover = 0;

    function pedirMover(direccion) {
      const ahora = Date.now();
      if (ahora - ultimoMover < 300) return;
      ultimoMover = ahora;
      mover(direccion);
    }

    anterior?.addEventListener('click', () => pedirMover(-1));
    anterior?.addEventListener('pointerup', () => pedirMover(-1));
    siguiente?.addEventListener('click', () => pedirMover(1));
    siguiente?.addEventListener('pointerup', () => pedirMover(1));

    tira.addEventListener('keydown', (evento) => {
      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        mover(-1);
      }
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        mover(1);
      }
    });

    /*
     * Arrastre con el ratón.
     *
     * El puntero NO se captura al pulsar: si se captura, el `click` acaba en el carril y
     * la tarjeta nunca se enteraba — por eso no se abría la foto en grande. Se captura
     * solo cuando el ratón ya se ha movido más de 6 px, que es cuando deja de ser un clic
     * y pasa a ser un arrastre.
     */
    const UMBRAL_ARRASTRE = 6;
    let pulsado = false;
    let arrastrando = false;
    let inicioX = 0;
    let inicioScroll = 0;

    tira.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType !== 'mouse' || animando) return;
      pulsado = true;
      arrastrando = false;
      inicioX = evento.clientX;
      inicioScroll = tira.scrollLeft;
    });

    tira.addEventListener('pointermove', (evento) => {
      if (!pulsado) return;
      const recorrido = evento.clientX - inicioX;

      if (!arrastrando && Math.abs(recorrido) > UMBRAL_ARRASTRE) {
        arrastrando = true;
        tira.style.cursor = 'grabbing';
        tira.setPointerCapture(evento.pointerId);
      }

      if (arrastrando) tira.scrollLeft = inicioScroll - recorrido;
    });

    function soltar(evento) {
      pulsado = false;
      tira.style.cursor = '';
      if (arrastrando) {
        arrastrando = false;
        tira.releasePointerCapture?.(evento.pointerId);
      }
    }

    tira.addEventListener('pointerup', soltar);
    tira.addEventListener('pointercancel', soltar);

    // Si hubo arrastre, el clic que viene detrás no debe abrir la foto.
    tira.addEventListener(
      'click',
      (evento) => {
        if (!arrastrando) return;
        evento.stopPropagation();
        evento.preventDefault();
      },
      true,
    );

    tira.addEventListener('scroll', pintarProgreso, { passive: true });
    window.addEventListener('resize', pintarProgreso, { passive: true });

    // La tipografía cambia de alto al cargar y mueve la tira: se vuelve a medir cuando
    // las fuentes están listas, si no el texto se queda unos píxeles arriba.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => pintarProgreso());
    }
    window.addEventListener('resize', pintarProgreso);

    pintarProgreso();
}

/** Recorre todos los bloques de carta de la página. */
export function iniciarCartas() {
  document.querySelectorAll('[data-carta]').forEach((carta) => {
    iniciarTira(carta);
    const piezas = Array.from(carta.querySelectorAll('[data-abrir]'));
    if (piezas.length > 0) iniciarVisor(carta, piezas);
  });
}

/**
 * Visor de la foto ampliada.
 *
 * Usa un `<dialog>` del navegador, que ya trae lo difícil: el foco se queda dentro, el
 * Escape cierra y el fondo no se puede tocar. Aquí solo se pone la foto, se pasan las
 * flechas y se devuelve el foco a la tarjeta al cerrar.
 */
function iniciarVisor(carta, piezas) {
  // El visor de ESTE apartado. Con `document.querySelector` los dos apartados
  // compartían el primero y abrir la comida cambiaba la foto de las bebidas.
  const seccion = carta.closest('section');
  const visor = seccion ? seccion.querySelector('[data-visor]') : null;
  if (!visor) return;

  const foto = visor.querySelector('[data-visor-foto]');
  const nombre = visor.querySelector('[data-visor-nombre]');
  const cerrar = visor.querySelector('[data-visor-cerrar]');
  const anterior = visor.querySelector('[data-visor-anterior]');
  const siguiente = visor.querySelector('[data-visor-siguiente]');

  // Solo las piezas con foto: la de «Pasión» no se puede abrir.
  const ampliables = Array.from(carta.querySelectorAll('[data-abrir]'));
  if (ampliables.length === 0) return;

  let actual = 0;
  let devolverFoco = null;

  let cambioPendiente = null;

  /**
   * Cambia la foto del visor con un cruce: la que estaba se apaga, se cambia la fuente y
   * la nueva entra. Sin esto, la imagen cambia de golpe y parece un fallo.
   */
  function mostrar(indice) {
    actual = (indice + ampliables.length) % ampliables.length;
    const boton = ampliables[actual];
    const imagen = boton.querySelector('img');
    const titulo = boton.getAttribute('aria-label') || '';
    const texto = imagen?.alt || titulo.replace(/^Ver /, '').replace(/ en grande$/, '');

    window.clearTimeout(cambioPendiente);

    if (!visor.open) {
      // Aún cerrado: se pone la foto y ya entrará con la animación de apertura.
      if (foto && imagen) {
        foto.src = imagen.currentSrc || imagen.src;
        foto.alt = texto;
      }
      if (nombre) nombre.textContent = texto;
      return;
    }

    if (foto) foto.dataset.cambiando = 'si';
    if (nombre) nombre.dataset.cambiando = 'si';

    cambioPendiente = window.setTimeout(() => {
      if (foto && imagen) {
        foto.src = imagen.currentSrc || imagen.src;
        foto.alt = texto;
        delete foto.dataset.cambiando;
      }
      if (nombre) {
        nombre.textContent = texto;
        delete nombre.dataset.cambiando;
      }
    }, 150);
  }

  function abrir(indice, boton) {
    devolverFoco = boton;
    mostrar(indice);
    if (typeof visor.showModal === 'function') visor.showModal();
    else visor.setAttribute('open', '');

    // Un fotograma después de abrir se enciende: así el navegador tiene de dónde
    // transicionar y la entrada se ve fundida en vez de plantada.
    delete visor.dataset.visible;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        visor.dataset.visible = 'si';
      });
    });
  }

  function cerrarVisor() {
    // Se apaga, y cuando termina el fundido se cierra de verdad.
    delete visor.dataset.visible;
    window.setTimeout(() => {
      if (typeof visor.close === 'function') visor.close();
      else visor.removeAttribute('open');
    }, 280);
  }

  ampliables.forEach((boton, indice) => {
    alPulsar(boton, () => abrir(indice, boton));
  });

  alPulsar(cerrar, cerrarVisor);
  alPulsar(anterior, () => mostrar(actual - 1));
  alPulsar(siguiente, () => mostrar(actual + 1));

  // Flechas dentro del visor.
  visor.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      mostrar(actual - 1);
    }
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      mostrar(actual + 1);
    }
  });

  // Al cerrarse por cualquier vía —Escape incluido— el foco vuelve a su tarjeta.
  visor.addEventListener('close', () => {
    devolverFoco?.focus();
  });

  // Un clic fuera de la foto también cierra, aunque caiga en la caja que la envuelve.
  visor.addEventListener('click', (evento) => {
    if (evento.target.closest('img, button, a')) return;
    cerrarVisor();
  });
}
