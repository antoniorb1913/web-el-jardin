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

export function iniciarCartas() {
  document.querySelectorAll('[data-carta]').forEach((carta) => {
    const tira = carta.querySelector('[data-tira]');
    if (!tira) return;

    const relleno = carta.querySelector('[data-progreso]');
    const anterior = carta.querySelector('[data-anterior]');
    const siguiente = carta.querySelector('[data-siguiente]');
    const piezas = Array.from(tira.querySelectorAll('.tira__pieza'));
    if (piezas.length === 0) return;

    let animando = false;

    /** Dónde empieza cada tarjeta, medido sobre el carril. */
    function posiciones() {
      const margen = parseFloat(getComputedStyle(tira).paddingLeft) || 0;
      return piezas.map((pieza) => pieza.offsetLeft - tira.offsetLeft - margen);
    }

    /** La tarjeta que está más cerca del borde izquierdo ahora mismo. */
    function indiceActual() {
      let mejor = 0;
      let distancia = Infinity;
      posiciones().forEach((punto, i) => {
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
      const puntos = posiciones();
      const destino = puntos[indiceActual() + direccion];
      desplazarA(destino ?? (direccion > 0 ? tira.scrollWidth : 0));
    }

    /** La barra de progreso y el estado de las flechas. */
    function pintarProgreso() {
      const recorrido = tira.scrollWidth - tira.clientWidth;
      const avance = recorrido > 0 ? tira.scrollLeft / recorrido : 1;
      const visible = tira.scrollWidth > 0 ? tira.clientWidth / tira.scrollWidth : 1;

      if (relleno) {
        const ancho = Math.max(visible, 0.12) * 100;
        relleno.style.width = `${ancho}%`;
        relleno.style.transform = `translateX(${recorrido > 0 ? (avance * (100 - ancho)) / Math.max(visible, 0.12) : 0}%)`;
      }

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
    }

    anterior?.addEventListener('click', () => mover(-1));
    siguiente?.addEventListener('click', () => mover(1));

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
    window.addEventListener('resize', pintarProgreso);

    pintarProgreso();
    iniciarVisor(carta, piezas);
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
    boton.addEventListener('click', () => abrir(indice, boton));
  });

  cerrar?.addEventListener('click', cerrarVisor);
  anterior?.addEventListener('click', () => mostrar(actual - 1));
  siguiente?.addEventListener('click', () => mostrar(actual + 1));

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

  // Un clic fuera de la foto también cierra.
  visor.addEventListener('click', (evento) => {
    if (evento.target === visor) cerrarVisor();
  });
}
