/**
 * Visor de las fotos de la galería.
 *
 * Mismo patrón que el de la carta: `<dialog>` del navegador, foco atrapado y Escape.
 * Aquí la foto grande se carga **solo al abrir** (la rejilla usa la de 800 px), y se
 * cambia con las flechas o con el teclado, con un cruce corto.
 */

const ESPERA_CRUCE = 140;

export function iniciarGaleria() {
  document.querySelectorAll('[data-galeria]').forEach((galeria) => {
    const visor = galeria.querySelector('[data-visor-galeria]');
    const imagen = galeria.querySelector('[data-visor-imagen]');
    const pie = galeria.querySelector('[data-visor-pie]');
    const botones = Array.from(galeria.querySelectorAll('[data-abrir-foto]'));
    if (!visor || !imagen || botones.length === 0) return;

    let actual = 0;
    let devolverFoco = null;
    let pendiente = null;

    function mostrar(indice) {
      actual = (indice + botones.length) % botones.length;
      const boton = botones[actual];
      const miniatura = boton.querySelector('img');
      const grande = miniatura.getAttribute('src').replace('-pequena', '');

      window.clearTimeout(pendiente);

      if (!visor.open) {
        imagen.src = grande;
        imagen.alt = miniatura.alt;
        pie.textContent = miniatura.alt;
        return;
      }

      imagen.dataset.cambiando = 'si';
      pie.dataset.cambiando = 'si';

      pendiente = window.setTimeout(() => {
        imagen.src = grande;
        imagen.alt = miniatura.alt;
        pie.textContent = miniatura.alt;
        delete imagen.dataset.cambiando;
        delete pie.dataset.cambiando;
      }, ESPERA_CRUCE);
    }

    function abrir(indice, boton) {
      devolverFoco = boton;
      mostrar(indice);
      visor.showModal();
      delete visor.dataset.visible;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          visor.dataset.visible = 'si';
        });
      });
    }

    function cerrar() {
      delete visor.dataset.visible;
      window.setTimeout(() => visor.close(), 260);
    }

    botones.forEach((boton, indice) => {
      boton.addEventListener('click', () => abrir(indice, boton));
    });

    galeria.querySelector('[data-visor-cerrar]')?.addEventListener('click', cerrar);
    galeria.querySelector('[data-visor-anterior]')?.addEventListener('click', () => mostrar(actual - 1));
    galeria.querySelector('[data-visor-siguiente]')?.addEventListener('click', () => mostrar(actual + 1));

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

    visor.addEventListener('close', () => devolverFoco?.focus());
    visor.addEventListener('click', (evento) => {
      if (evento.target === visor) cerrar();
    });
  });
}
