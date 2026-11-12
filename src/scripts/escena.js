/**
 * El escenario del bar.
 *
 * Cambia de foto con un deslizamiento corto: la que entra viene desde la derecha, la que
 * sale se va a la izquierda, y el titular y el número cambian con ella, con un fundido.
 *
 * Lo visual va por CSS con `data-activa`; aquí solo se decide cuál manda.
 */

const TITULOS = [
  ['La', 'entrada'],
  ['La', 'terraza 1'],
  ['La', 'barra'],
  ['David', 'de Miguel Angel'],
  ['La', 'terraza 2'],
  ['Bolnuevo', ''],
];

export function iniciarEscena() {
  document.querySelectorAll('[data-escena]').forEach((raiz) => {
    const pases = Array.from(raiz.querySelectorAll('[data-pase]'));
    const rayas = Array.from(raiz.querySelectorAll('[data-raya]'));
    const linea1 = raiz.querySelector('[data-linea-1]');
    const linea2 = raiz.querySelector('[data-linea-2]');
    const anterior = raiz.querySelector('[data-anterior]');
    const siguiente = raiz.querySelector('[data-siguiente]');
    const enlace = raiz.querySelector('[data-abrir-actual]');
    const anuncio = raiz.querySelector('[data-anuncio]');
    if (pases.length === 0) return;

    const nombres = rayas.map((raya) => raya.getAttribute('aria-label')?.replace('Ir a ', '') || '');
    let actual = 0;

    function pintar(indice) {
      actual = (indice + pases.length) % pases.length;

      pases.forEach((pase, i) => {
        // `data-d` es la distancia a la que está: 0 es la que manda, −1 la anterior y +1
        // la siguiente. El CSS coloca cada una con eso.
        let distancia = i - actual;
        if (distancia > pases.length / 2) distancia -= pases.length;
        if (distancia < -pases.length / 2) distancia += pases.length;

        pase.style.setProperty('--d', String(distancia));
        if (distancia === 0) pase.dataset.activa = 'si';
        else delete pase.dataset.activa;
      });

      rayas.forEach((raya, i) => {
        if (i === actual) raya.dataset.activa = 'si';
        else delete raya.dataset.activa;
      });

      if (linea1) linea1.textContent = TITULOS[actual]?.[0] || '';
      if (linea2) linea2.textContent = TITULOS[actual]?.[1] || '';
      if (enlace) enlace.setAttribute('data-abrir-foto', String(actual));
      if (anuncio) anuncio.textContent = `${nombres[actual] || ''} (${actual + 1} de ${pases.length})`;

      // El enlace abre la foto que se está viendo: se le cambia el índice.
      if (enlace) {
        enlace.onclick = (evento) => {
          evento.preventDefault();
          const boton = pases[actual];
          const visor = raiz.querySelector('[data-visor-galeria]');
          if (boton && visor) {
            const imagen = visor.querySelector('[data-visor-imagen]');
            const miniatura = boton.querySelector('img');
            const grande = miniatura.getAttribute('src').replace('-pequena', '');
            if (imagen) {
              imagen.src = grande;
              imagen.alt = miniatura.alt;
            }
            const texto = visor.querySelector('[data-visor-pie]');
            if (texto) texto.textContent = miniatura.alt;
            visor.showModal();
            visor.dataset.visible = 'si';
          }
        };
      }
    }

    // Clic y `pointerup` llegan los dos: un cerrojo corto evita el salto doble.
    let ultimo = 0;
    function pedir(indice) {
      const ahora = Date.now();
      if (ahora - ultimo < 260) return;
      ultimo = ahora;
      pintar(indice);
    }

    rayas.forEach((raya, indice) => {
      raya.addEventListener('click', () => pedir(indice));
    });

    // Las flechas: `click` y `pointerup` llegan los dos, y `pedir` ya lleva el cerrojo.
    anterior?.addEventListener('click', () => pedir(actual - 1));
    anterior?.addEventListener('pointerup', () => pedir(actual - 1));
    siguiente?.addEventListener('click', () => pedir(actual + 1));
    siguiente?.addEventListener('pointerup', () => pedir(actual + 1));

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

    // Arrastrar sobre la escena también cambia de foto.
    let inicioX = null;
    let huboArrastre = false;

    raiz.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      if (evento.target.closest('.escena__rayas, .escena__enlace, dialog')) return;
      inicioX = evento.clientX;
      huboArrastre = false;
    });

    raiz.addEventListener('pointerup', (evento) => {
      if (inicioX === null) return;
      const recorrido = evento.clientX - inicioX;
      inicioX = null;
      if (Math.abs(recorrido) > 48) {
        huboArrastre = true;
        pintar(actual + (recorrido < 0 ? 1 : -1));
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
