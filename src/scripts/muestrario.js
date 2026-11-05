/**
 * El muestrario del bar.
 *
 * Hay dos estados: la foto **elegida** y la que se está **mirando** al pasar por encima de
 * una miniatura. Al salir del ratón se vuelve a la elegida. Es lo que hace que la tira se
 * sienta viva sin que nada se mueva de sitio.
 *
 * Todo el cambio visual lo hace el CSS con `data-activa`; aquí solo se decide cuál es la
 * activa y se copia el nombre al pie.
 */

export function iniciarMuestrario() {
  document.querySelectorAll('[data-muestrario]').forEach((raiz) => {
    const pases = Array.from(raiz.querySelectorAll('[data-pase]'));
    const minis = Array.from(raiz.querySelectorAll('[data-mini]'));
    const cuenta = raiz.querySelector('[data-cuenta]');
    const nombre = raiz.querySelector('[data-nombre]');
    const anuncio = raiz.querySelector('[data-anuncio]');
    if (pases.length === 0) return;

    const pies = minis.map((mini) => mini.getAttribute('aria-label')?.replace('Ver ', '') || '');

    let elegida = 0;
    let mirando = 0;
    let anunciando = 0;

    function marcar(indice) {
      pases.forEach((pase, i) => {
        if (i === indice) pase.dataset.activa = 'si';
        else delete pase.dataset.activa;
      });

      minis.forEach((mini, i) => {
        if (i === indice) mini.dataset.activa = 'si';
        else delete mini.dataset.activa;
      });

      if (cuenta) cuenta.textContent = String(indice + 1).padStart(2, '0');
      if (nombre) nombre.textContent = pies[indice] || '';

      if (anuncio && anunciando !== indice) {
        anunciando = indice;
        anuncio.textContent = `${pies[indice] || ''} (${indice + 1} de ${pases.length})`;
      }
    }

    function mostrar(indice) {
      mirando = indice;
      marcar(indice);
    }

    minis.forEach((mini, indice) => {
      // Al pasar por encima se previsualiza; al salir, vuelve la elegida.
      mini.addEventListener('pointerenter', () => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) mostrar(indice);
      });

      mini.addEventListener('focus', () => mostrar(indice));

      mini.addEventListener('blur', () => {
        if (mirando !== elegida) mostrar(elegida);
      });

      mini.addEventListener('click', () => {
        elegida = indice;
        mostrar(indice);
      });
    });

    raiz.addEventListener('pointerleave', () => {
      if (mirando !== elegida) mostrar(elegida);
    });

    // Teclado: ← y → cambian la elegida, sin tocar el hover.
    raiz.addEventListener('keydown', (evento) => {
      if (evento.target.closest('dialog')) return;
      if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
      evento.preventDefault();
      const paso = evento.key === 'ArrowRight' ? 1 : -1;
      elegida = (elegida + paso + pases.length) % pases.length;
      mostrar(elegida);
    });

    // Arrastrar sobre la foto grande también cambia de diapositiva.
    let inicioX = null;
    let huboArrastre = false;

    raiz.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      if (evento.target.closest('.muestrario__tira, dialog')) return;
      inicioX = evento.clientX;
      huboArrastre = false;
    });

    raiz.addEventListener('pointerup', (evento) => {
      if (inicioX === null) return;
      const recorrido = evento.clientX - inicioX;
      inicioX = null;
      if (Math.abs(recorrido) > 48) {
        huboArrastre = true;
        elegida = (elegida + (recorrido < 0 ? 1 : -1) + pases.length) % pases.length;
        mostrar(elegida);
      }
    });

    raiz.addEventListener('pointercancel', () => {
      inicioX = null;
    });

    // Si fue un arrastre, la foto no se abre además.
    raiz.addEventListener(
      'click',
      (evento) => {
        if (!huboArrastre) return;
        huboArrastre = false;
        evento.stopPropagation();
        evento.preventDefault();
      },
      true,
    );

    marcar(0);
  });
}
