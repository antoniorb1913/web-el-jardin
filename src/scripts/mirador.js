/**
 * El mirador: fotos en profundidad.
 *
 * Cada foto recibe dos números: `--d`, su distancia a la que está delante (−3 a 3), y
 * `--a`, esa distancia en positivo. El CSS compone con ellos la posición en el espacio:
 * desplazamiento lateral, profundidad, giro y escala. Aquí solo se decide cuál está
 * delante y cada cuánto avanza sola.
 */

const ESPERA = 5500;
const DURACION = 1400;

export function iniciarMirador() {
  document.querySelectorAll('[data-mirador]').forEach((raiz) => {
    const fotos = Array.from(raiz.querySelectorAll('[data-foto]'));
    const nombre = raiz.querySelector('[data-nombre]');
    const anterior = raiz.querySelector('[data-anterior]');
    const siguiente = raiz.querySelector('[data-siguiente]');
    if (fotos.length === 0) return;

    // Los nombres salen del propio marcado: así sirve igual para las fotos del bar que
    // para las bebidas y los platos.
    const pies = fotos.map((foto) => foto.dataset.pie || foto.querySelector('img')?.alt || '');
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conRaton = window.matchMedia('(hover: hover) and (pointer: fine)');
    const animar = document.documentElement.dataset.animar === 'si';

    let delante = 0;
    let temporizador = null;
    let pausado = false;

    function pintar() {
      fotos.forEach((foto, indice) => {
        // Distancia en anillo: de −3 a +3, de modo que el último queda a la izquierda del
        // primero y el mirador se recorre en círculo.
        let distancia = indice - delante;
        const mitad = Math.floor(fotos.length / 2);
        if (distancia > mitad) distancia -= fotos.length;
        if (distancia < -mitad) distancia += fotos.length;

        foto.style.setProperty('--d', String(distancia));
        foto.style.setProperty('--a', String(Math.abs(distancia)));
        if (distancia === 0) foto.dataset.delante = 'si';
        else delete foto.dataset.delante;
      });

      if (nombre) nombre.textContent = pies[delante] || '';
      if (anterior) anterior.disabled = false;
      if (siguiente) siguiente.disabled = false;
    }

    function ir(indice) {
      delante = (indice + fotos.length) % fotos.length;
      pintar();
    }

    let ultimoPedido = 0;
    function pedir(indice) {
      const ahora = Date.now();
      if (ahora - ultimoPedido < 300) return;
      ultimoPedido = ahora;
      ir(indice);
      reiniciar();
    }

    anterior?.addEventListener('click', () => pedir(delante - 1));
    siguiente?.addEventListener('click', () => pedir(delante + 1));

    // Pulsar una foto de lado la trae al frente; la de delante se abre en grande (eso lo
    // lleva `galeria.js`).
    fotos.forEach((foto, indice) => {
      foto.addEventListener('click', () => {
        if (foto.dataset.delante === 'si') return;
        pedir(indice);
      });
    });

    raiz.addEventListener('keydown', (evento) => {
      if (evento.target.closest('dialog')) return;
      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        pedir(delante - 1);
      }
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        pedir(delante + 1);
      }
    });

    // Avance solo: lento y en silencio. Se para con el ratón encima, con el foco dentro y
    // si el sistema pide menos movimiento (aquí no se fuerza con `?animar`, porque este
    // movimiento no explica nada: es ambiente).
    function arrancar() {
      if (sinMovimiento.matches || pausado) return;
      parar();
      temporizador = window.setInterval(() => ir(delante + 1), ESPERA);
    }

    function parar() {
      if (temporizador !== null) {
        window.clearInterval(temporizador);
        temporizador = null;
      }
    }

    function reiniciar() {
      if (!sinMovimiento.matches && !pausado) arrancar();
    }

    raiz.addEventListener('pointerenter', () => {
      if (!conRaton.matches) return;
      pausado = true;
      parar();
    });

    raiz.addEventListener('pointerleave', () => {
      pausado = false;
      arrancar();
    });

    raiz.addEventListener('focusin', parar);
    raiz.addEventListener('focusout', () => {
      if (!pausado) arrancar();
    });

    // Con la pestaña en segundo plano, quieto.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) parar();
      else arrancar();
    });

    pintar();
    arrancar();
  });
}
