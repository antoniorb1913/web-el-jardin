/**
 * La lámina: una foto cada vez.
 *
 * Cambia de foto con las flechas, con las teclas y arrastrando. Lo visual lo hace el CSS
 * con `data-activa`; aquí solo se decide cuál está activa.
 */

export function iniciarLamina() {
  document.querySelectorAll('[data-lamina]').forEach((raiz) => {
    const pases = Array.from(raiz.querySelectorAll('[data-pase]'));
    const numero = raiz.querySelector('[data-numero]');
    const nombre = raiz.querySelector('[data-nombre]');
    const anuncio = raiz.querySelector('[data-anuncio]');
    const anterior = raiz.querySelector('[data-anterior]');
    const siguiente = raiz.querySelector('[data-siguiente]');
    if (pases.length === 0) return;

    const pies = Array.from(raiz.querySelectorAll('[data-lamina] [data-nombre]')).length
      ? pases.map((pase) => pase.querySelector('img')?.alt || '')
      : [];

    // Los nombres cortos salen del propio componente: se leen del pie al arrancar.
    const cortos = ['La entrada', 'El patio', 'La terraza', 'La barra', 'La estatua', 'Las mesas', 'Bolnuevo'];

    let actual = 0;

    function pintar(indice) {
      actual = (indice + pases.length) % pases.length;

      pases.forEach((pase, i) => {
        if (i === actual) pase.dataset.activa = 'si';
        else delete pase.dataset.activa;
      });

      if (numero) numero.textContent = String(actual + 1).padStart(2, '0');
      if (nombre) nombre.textContent = cortos[actual] || '';
      if (anuncio) anuncio.textContent = `${cortos[actual] || ''} (${actual + 1} de ${pases.length})`;

      if (anterior) anterior.disabled = actual === 0;
      if (siguiente) siguiente.disabled = actual === pases.length - 1;
    }

    // El `click` y el `pointerup` llegan los dos: un cerrojo corto evita el salto doble.
    let ultimo = 0;
    function pedir(indice) {
      const ahora = Date.now();
      if (ahora - ultimo < 260) return;
      ultimo = ahora;
      pintar(indice);
    }

    anterior?.addEventListener('click', () => pedir(actual - 1));
    anterior?.addEventListener('pointerup', () => pedir(actual - 1));
    siguiente?.addEventListener('click', () => pedir(actual + 1));
    siguiente?.addEventListener('pointerup', () => pedir(actual + 1));

    raiz.addEventListener('keydown', (evento) => {
      if (evento.target.closest('dialog')) return;
      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        pintar(actual - 1);
      }
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        pintar(actual + 1);
      }
    });

    let inicioX = null;
    let huboArrastre = false;

    raiz.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      if (evento.target.closest('.lamina__pie, dialog')) return;
      inicioX = evento.clientX;
      huboArrastre = false;
    });

    raiz.addEventListener('pointerup', (evento) => {
      if (inicioX === null) return;
      const recorrido = evento.clientX - inicioX;
      inicioX = null;
      if (Math.abs(recorrido) > 48) {
        huboArrastre = true;
        pintar(recorrido < 0 ? actual + 1 : actual - 1);
      }
    });

    raiz.addEventListener('pointercancel', () => {
      inicioX = null;
    });

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
