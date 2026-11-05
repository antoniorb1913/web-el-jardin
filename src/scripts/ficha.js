/**
 * La ficha editorial de las fotos.
 *
 * Hay una entrada elegida y una que se está mirando. Al pasar por un nombre de la lista se
 * previsualiza su foto; al salir se vuelve a la elegida. Pulsar un nombre lo deja elegido.
 *
 * Lo visual lo hace el CSS con `data-activa`; aquí solo se decide cuál es y se copia el pie.
 */

export function iniciarFicha() {
  document.querySelectorAll('[data-ficha]').forEach((raiz) => {
    const pases = Array.from(raiz.querySelectorAll('[data-pase]'));
    const filas = Array.from(raiz.querySelectorAll('[data-fila]'));
    const pie = raiz.querySelector('[data-pie]');
    if (pases.length === 0 || filas.length === 0) return;

    // El pie de cada foto es el texto largo de la imagen; el del vídeo, su propia frase.
    const pies = pases.map((pase) => {
      if (pase.hasAttribute('data-video')) {
        return 'Paseo por el bar: la entrada, la terraza, la barra y las vistas.';
      }
      return pase.querySelector('img')?.getAttribute('alt') || '';
    });

    let elegida = 0;
    let mirando = 0;

    function marcar(indice) {
      pases.forEach((pase, i) => {
        if (i === indice) pase.dataset.activa = 'si';
        else delete pase.dataset.activa;
      });

      filas.forEach((fila, i) => {
        if (i === indice) {
          fila.dataset.activa = 'si';
          fila.setAttribute('aria-current', 'true');
        } else {
          delete fila.dataset.activa;
          fila.setAttribute('aria-current', 'false');
        }
      });

      if (pie) pie.textContent = pies[indice] || '';
    }

    function mostrar(indice) {
      mirando = indice;
      marcar(indice);
    }

    const conRaton = window.matchMedia('(hover: hover) and (pointer: fine)');

    filas.forEach((fila, indice) => {
      fila.addEventListener('pointerenter', () => {
        if (conRaton.matches) mostrar(indice);
      });

      fila.addEventListener('focus', () => mostrar(indice));

      fila.addEventListener('blur', () => {
        if (mirando !== elegida) mostrar(elegida);
      });

      fila.addEventListener('click', () => {
        elegida = indice;
        mostrar(indice);
      });
    });

    raiz.addEventListener('pointerleave', () => {
      if (mirando !== elegida) mostrar(elegida);
    });

    // Teclado: las flechas recorren el índice.
    raiz.addEventListener('keydown', (evento) => {
      if (evento.target.closest('dialog')) return;
      if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowDown' && evento.key !== 'ArrowRight' && evento.key !== 'ArrowUp') {
        return;
      }
      evento.preventDefault();
      const paso = evento.key === 'ArrowRight' || evento.key === 'ArrowDown' ? 1 : -1;
      elegida = (elegida + paso + pases.length) % pases.length;
      mostrar(elegida);
      filas[elegida]?.focus();
    });

    marcar(0);
  });
}
