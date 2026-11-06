/**
 * Visor de las fotos de la galería.
 *
 * Mismo patrón que el de la carta: `<dialog>` del navegador, foco atrapado y Escape.
 * Aquí la foto grande se carga **solo al abrir** (la rejilla usa la de 800 px), y se
 * cambia con las flechas o con el teclado, con un cruce corto.
 */

const ESPERA_CRUCE = 140;

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
      alPulsar(boton, () => abrir(indice, boton));
    });

    alPulsar(galeria.querySelector('[data-visor-cerrar]'), cerrar);
    alPulsar(galeria.querySelector('[data-visor-anterior]'), () => mostrar(actual - 1));
    alPulsar(galeria.querySelector('[data-visor-siguiente]'), () => mostrar(actual + 1));

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
    // Cualquier clic que no caiga en la foto ni en un botón cierra el visor. Antes solo
    // cerraba el clic exactamente sobre el <dialog>, pero la caja interior lo cubre entero
    // y el fondo negro no respondía: parecía que el visor se había quedado atascado.
    visor.addEventListener('click', (evento) => {
      if (evento.target.closest('img, button, a')) return;
      cerrar();
    });
  });
}
