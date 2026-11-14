/**
 * El mapa, solo si lo piden.
 *
 * La web no carga nada de Google hasta que alguien pulsa «Ver el mapa». Así, quien entra a
 * mirar el horario no recibe ni una cookie de terceros, y la página se ahorra el peso del
 * mapa entero —Google Maps son cientos de peticiones— en la primera visita.
 *
 * Al pulsar, el mapa se abre **en el sitio**: el botón se sustituye por el `<iframe>`. Ese
 * clic es el consentimiento para ese servicio, que es lo que pide la AEPD: una acción
 * afirmativa del visitante, no un «si sigues navegando, aceptas».
 *
 * La dirección viaja en la propia URL de Google (`?q=…&output=embed`), sin clave de API y
 * sin inventar coordenadas.
 */

const DIRECCION = 'Av. Antonio Segado del Olmo 19, Bolnuevo, Mazarrón, Murcia';

export function iniciarMapa() {
  document.querySelectorAll('[data-mapa]').forEach((caja) => {
    const boton = caja.querySelector('[data-mapa-abrir]');
    if (!boton) return;

    boton.addEventListener('click', () => {
      const marco = document.createElement('iframe');
      marco.className = 'cierre__mapa-marco';
      marco.src = `https://www.google.com/maps?q=${encodeURIComponent(DIRECCION)}&z=16&output=embed`;
      marco.title = 'Mapa con la ubicación del Bar El Jardín';
      marco.referrerPolicy = 'no-referrer-when-downgrade';
      marco.allowFullscreen = true;

      caja.replaceChildren(marco);
      caja.dataset.cargado = 'si';
    });
  });
}
