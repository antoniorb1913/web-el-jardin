/**
 * ¿Está abierto el bar?
 *
 * El horario está en `AGENTS.md` §1 y en `negocio.js`: de domingo a jueves de 16:00 a
 * 23:00, y viernes y sábados de 16:00 a 00:00.
 *
 * Tres cosas que se hacen mal casi siempre y aquí están resueltas:
 *
 * 1. **La hora se lee en Madrid**, no en la del visitante. Un cliente mirando la web
 *    desde Alemania tiene que ver si el bar está abierto aquí, no allí.
 * 2. **00:00 es el final del día**, no el principio del siguiente. El viernes cierra a
 *    medianoche: a las 00:30 del sábado ya está cerrado.
 * 3. **El paso de hora** de verano a invierno también va en hora de Madrid, así que el
 *    cálculo no se rompe dos veces al año.
 *
 * Es una función pura: recibe la hora y los tramos, y devuelve el estado. Así se puede
 * probar sin esperar a que lleguen las once de la noche.
 */

/** Días de la semana como los devuelve `Intl`: 0 es domingo. */
const NOMBRES_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * Un tramo: `{ dias, desde, hasta }`.
 *
 * `dias` son los días en que se abre (0 domingo … 6 sábado), `desde` y `hasta` son horas
 * en formato «HH:MM». `hasta` puede ser «24:00», que significa medianoche del mismo día.
 */
export function estadoEn(tramos, ahora = new Date()) {
  const { dia, minutos } = horaEnMadrid(ahora);

  // ¿Estamos dentro de algún tramo de hoy?
  for (const tramo of tramos) {
    if (!tramo.dias.includes(dia)) continue;
    const inicio = aMinutos(tramo.desde);
    const fin = aMinutos(tramo.hasta);
    if (minutos >= inicio && minutos < fin) {
      return {
        abierto: true,
        cierra: fin === 24 * 60 ? 'a las 00:00' : `a las ${tramo.hasta}`,
        dia,
        minutos,
      };
    }
  }

  // Cerrado: se busca cuándo abre otra vez, como mucho una semana por delante.
  for (let salto = 0; salto < 8; salto += 1) {
    const diaBuscado = (dia + salto) % 7;
    const tramo = tramos.find((t) => t.dias.includes(diaBuscado));
    if (!tramo) continue;

    const inicio = aMinutos(tramo.desde);
    // Hoy mismo, pero antes de abrir.
    if (salto === 0 && minutos < inicio) {
      return {
        abierto: false,
        abre: `a las ${tramo.desde}`,
        cuando: 'hoy',
        dia,
        minutos,
      };
    }
    // Hoy mismo, pero después de cerrar.
    if (salto === 0 && minutos >= aMinutos(tramo.hasta)) continue;

    if (salto === 1) {
      return { abierto: false, abre: `a las ${tramo.desde}`, cuando: 'mañana', dia, minutos };
    }
    return {
      abierto: false,
      abre: `a las ${tramo.desde}`,
      cuando: `el ${NOMBRES_DIAS[diaBuscado]}`,
      dia,
      minutos,
    };
  }

  return { abierto: false, abre: '', cuando: '', dia, minutos };
}

/** La hora y el día en Madrid, sea cual sea la zona horaria del navegador. */
export function horaEnMadrid(ahora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(ahora);

  const buscar = (tipo) => partes.find((p) => p.type === tipo)?.value ?? '';
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  // `hour` puede venir como «24» a medianoche según el navegador: se normaliza a 0.
  const hora = Number(buscar('hour')) % 24;

  return {
    dia: dias[buscar('weekday')] ?? 0,
    minutos: hora * 60 + Number(buscar('minute')),
  };
}

function aMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * El texto que se enseña. Sin promesas raras: si está abierto, cuándo cierra; si está
 * cerrado, cuándo abre.
 */
export function textoEstado(estado) {
  if (estado.abierto) return `Cierra ${estado.cierra}`;
  if (!estado.abre) return 'Consulta el horario';
  return `Abre ${estado.cuando} ${estado.abre}`;
}

/**
 * Enciende el rótulo de la sección. Se actualiza cada minuto: un bar que abre a las 16:00
 * no puede seguir diciendo «cerrado» a las 16:01 porque el visitante no recargue.
 */
export function iniciarEstadoBar(tramos) {
  const rotulos = document.querySelectorAll('[data-estado-bar]');
  if (rotulos.length === 0) return;

  function pintar() {
    const estado = estadoEn(tramos, new Date());
    rotulos.forEach((rotulo) => {
      const texto = rotulo.querySelector('[data-estado-texto]');
      if (texto) texto.textContent = textoEstado(estado);
      if (estado.abierto) rotulo.dataset.abierto = 'si';
      else delete rotulo.dataset.abierto;
    });
  }

  pintar();
  window.setInterval(pintar, 60_000);

  // Al volver a la pestaña, se actualiza en el momento: puede haber pasado una hora.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) pintar();
  });
}
