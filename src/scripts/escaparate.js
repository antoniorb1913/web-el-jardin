/**
 * El escaparate del bar.
 *
 * Cambia de diapositiva por cruce: se marca cuál está activa con un atributo y el CSS hace
 * el resto (opacidad y una deriva muy lenta). Nada de animar con JavaScript: son dos
 * propiedades y una transición, y así corre fuera del hilo principal.
 *
 * Se mueve con las marcas del pie, con las flechas, con el teclado y arrastrando. Cuando
 * la diapositiva activa es el vídeo, su play se lleva el foco del teclado.
 *
 * Aquí solo se decide *cuál* está activa. El botón de cada foto lo maneja `galeria.js`,
 * que es quien abre el visor.
 */

export function iniciarEscaparate() {
  document.querySelectorAll('[data-escaparate]').forEach((raiz) => {
    const pases = Array.from(raiz.querySelectorAll('[data-pase]'));
    const saltos = Array.from(raiz.querySelectorAll('[data-salto]'));
    const cuenta = raiz.querySelector('[data-cuenta]');
    const nombre = raiz.querySelector('[data-nombre]');
    const anuncio = raiz.querySelector('[data-anuncio]');
    const anterior = raiz.querySelector('[data-anterior]');
    const siguiente = raiz.querySelector('[data-siguiente]');
    if (pases.length === 0) return;

    const leyendas = pases.map((pase) => {
      const texto = pase.querySelector('img')?.getAttribute('alt') || '';
      const esVideo = pase.hasAttribute('data-video');
      return esVideo ? 'El bar en vídeo' : texto;
    });

    // Nombres cortos para el pie: los de la lista de saltos son los mismos.
    const cortos = saltos.map((salto) => salto.getAttribute('aria-label')?.replace('Ir a ', '') || '');

    let actual = 0;
    let animando = false;

    function pintar(indice) {
      actual = (indice + pases.length) % pases.length;

      pases.forEach((pase, i) => {
        if (i === actual) pase.dataset.activa = 'si';
        else delete pase.dataset.activa;
      });

      saltos.forEach((salto, i) => {
        if (i === actual) salto.dataset.activa = 'si';
        else delete salto.dataset.activa;
      });

      if (cuenta) cuenta.textContent = String(actual + 1).padStart(2, '0');
      if (nombre) nombre.textContent = cortos[actual] || leyendas[actual];

      if (anuncio) anuncio.textContent = `${cortos[actual] || leyendas[actual]} (${actual + 1} de ${pases.length})`;

      if (anterior) anterior.disabled = actual === 0;
      if (siguiente) siguiente.disabled = actual === pases.length - 1;

      animando = true;
      window.setTimeout(() => {
        animando = false;
      }, 260);
    }

    function pedir(indice) {
      if (animando) return;
      pintar(indice);
    }

    // El `click` y el `pointerup` llegan los dos: un cerrojo corto evita el salto doble.
    let ultimo = 0;
    function pedirUna(indice) {
      const ahora = Date.now();
      if (ahora - ultimo < 260) return;
      ultimo = ahora;
      pedir(indice);
    }

    saltos.forEach((salto, indice) => {
      salto.addEventListener('click', () => pedirUna(indice));
    });

    anterior?.addEventListener('click', () => pedirUna(actual - 1));
    anterior?.addEventListener('pointerup', () => pedirUna(actual - 1));
    siguiente?.addEventListener('click', () => pedirUna(actual + 1));
    siguiente?.addEventListener('pointerup', () => pedirUna(actual + 1));

    raiz.addEventListener('keydown', (evento) => {
      if (evento.target.closest('dialog')) return;
      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        pedir(actual - 1);
      }
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        pedir(actual + 1);
      }
    });

    // Arrastre: si se mueve lo suficiente, pasa de diapositiva.
    let inicioX = null;
    let huboArrastre = false;

    raiz.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      if (evento.target.closest('.escaparate__pie, dialog')) return;
      inicioX = evento.clientX;
      huboArrastre = false;
    });

    raiz.addEventListener('pointerup', (evento) => {
      if (inicioX === null) return;
      const recorrido = evento.clientX - inicioX;
      inicioX = null;
      if (Math.abs(recorrido) > 48) {
        huboArrastre = true;
        pedir(recorrido < 0 ? actual + 1 : actual - 1);
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

    pintar(0);
  });
}
