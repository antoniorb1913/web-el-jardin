/**
 * El vídeo del bar.
 *
 * El póster y el botón están en la página; el `<video>` no tiene `src` hasta que alguien
 * pulsa. Ahí se abre el `<dialog>`, se le pone el archivo y se reproduce con sonido: el
 * navegador lo permite porque la orden viene de un clic.
 *
 * Al cerrar se pausa y se vuelve al principio, para que no siga sonando por detrás.
 */

export function iniciarVideo() {
  document.querySelectorAll('[data-video]').forEach((bloque) => {
    const abrir = bloque.querySelector('[data-video-abrir]');
    const visor = bloque.querySelector('[data-visor-video]');
    const player = bloque.querySelector('[data-video-player]');
    const cerrar = bloque.querySelector('[data-video-cerrar]');
    const archivo = bloque.dataset.archivo;
    if (!abrir || !visor || !player || !archivo) return;

    let devolverFoco = null;

    function reproducir() {
      devolverFoco = abrir;
      visor.showModal();

      // El archivo se pone ahora, no antes: hasta este clic no se descarga nada.
      if (!player.getAttribute('src')) player.setAttribute('src', archivo);

      player.currentTime = 0;
      const intento = player.play();
      if (intento && typeof intento.catch === 'function') {
        // Si el navegador se niega —raro tras un clic—, se queda con los controles.
        intento.catch(() => {});
      }

      delete visor.dataset.visible;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          visor.dataset.visible = 'si';
        });
      });
    }

    function parar() {
      player.pause();
      player.currentTime = 0;
      delete visor.dataset.visible;
      window.setTimeout(() => visor.close(), 240);
    }

    abrir.addEventListener('click', reproducir);
    cerrar?.addEventListener('click', parar);
    visor.addEventListener('close', () => {
      player.pause();
      devolverFoco?.focus();
    });

    // Escape y clic fuera: el `dialog` cierra solo con Escape, pero hay que parar el vídeo.
    visor.addEventListener('cancel', (evento) => {
      evento.preventDefault();
      parar();
    });
    visor.addEventListener('click', (evento) => {
      if (evento.target === visor) parar();
    });
  });
}
