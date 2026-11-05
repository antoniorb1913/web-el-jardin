/**
 * El arrastre del carrete.
 *
 * La tira ya se desplaza con la rueda y con el dedo; esto añade el arrastre con el ratón,
 * que es lo que pide un carrete. El puntero no se captura al pulsar —si se captura, el
 * clic acaba en la tira y la foto nunca se abre—, sino solo cuando el ratón ya se ha
 * movido lo suficiente.
 */

const UMBRAL = 6;

export function iniciarArrastre() {
  document.querySelectorAll('.carrete__tira').forEach((tira) => {
    let pulsado = false;
    let arrastrando = false;
    let inicioX = 0;
    let inicioScroll = 0;

    tira.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType !== 'mouse' || evento.button !== 0) return;
      pulsado = true;
      arrastrando = false;
      inicioX = evento.clientX;
      inicioScroll = tira.scrollLeft;
    });

    tira.addEventListener('pointermove', (evento) => {
      if (!pulsado) return;
      const recorrido = evento.clientX - inicioX;

      if (!arrastrando && Math.abs(recorrido) > UMBRAL) {
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

    // Con el teclado, la tira se recorre a saltos de un fotograma.
    tira.addEventListener('keydown', (evento) => {
      if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
      evento.preventDefault();
      const marco = tira.querySelector('.carrete__marco');
      const paso = (marco?.offsetWidth || 240) + 12;
      tira.scrollBy({ left: evento.key === 'ArrowRight' ? paso : -paso, behavior: 'smooth' });
    });
  });
}
