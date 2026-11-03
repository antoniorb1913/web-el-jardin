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

    // Arrastre con el ratón: en escritorio el carril no se puede arrastrar solo.
    let arrastrando = false;
    let inicioX = 0;
    let inicioScroll = 0;

    tira.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType !== 'mouse' || animando) return;
      arrastrando = true;
      inicioX = evento.clientX;
      inicioScroll = tira.scrollLeft;
      tira.setPointerCapture(evento.pointerId);
    });

    tira.addEventListener('pointermove', (evento) => {
      if (!arrastrando) return;
      tira.scrollLeft = inicioScroll - (evento.clientX - inicioX);
    });

    tira.addEventListener('pointerup', (evento) => {
      arrastrando = false;
      tira.releasePointerCapture?.(evento.pointerId);
    });

    tira.addEventListener('scroll', pintarProgreso, { passive: true });
    window.addEventListener('resize', pintarProgreso);

    pintarProgreso();
  });
}
