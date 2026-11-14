/**
 * ¿Está abierto el bar? (T10 · idiomas en T16)
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
 * El cálculo no sabe idiomas: devuelve hechos —abierto, a qué hora cierra, qué día abre— y
 * es `textoEstado()` quien los convierte en una frase con las plantillas que le llegan del
 * componente. Así la misma lógica sirve para los tres idiomas sin tocar nada.
 */

/** Días de la semana como los devuelve `Intl`: 0 es domingo. */
const NOMBRES_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * El estado del bar en un momento dado.
 *
 * Devuelve siempre la misma forma:
 * `{ abierto, cuando, hora, diaNombre, cierraHora }`, donde `cuando` es `'hoy'`,
 * `'manana'` o `'el viernes'` (este último con el nombre del día ya traducido).
 */
export function estadoEn(tramos, ahora = new Date(), dias = NOMBRES_DIAS) {
  const { dia, minutos } = horaEnMadrid(ahora);

  // ¿Estamos dentro de algún tramo de hoy?
  for (const tramo of tramos) {
    if (!tramo.dias.includes(dia)) continue;
    const inicio = aMinutos(tramo.desde);
    const fin = aMinutos(tramo.hasta);
    if (minutos >= inicio && minutos < fin) {
      return {
        abierto: true,
        cuando: '',
        hora: '',
        diaNombre: '',
        cierraHora: fin === 24 * 60 ? '00:00' : tramo.hasta,
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
      return { abierto: false, cuando: 'hoy', hora: tramo.desde, diaNombre: dias[dia], cierraHora: '' };
    }

    // Hoy mismo, pero después de cerrar: se sigue buscando.
    if (salto === 0 && minutos >= aMinutos(tramo.hasta)) continue;

    if (salto === 1) {
      return { abierto: false, cuando: 'manana', hora: tramo.desde, diaNombre: dias[diaBuscado], cierraHora: '' };
    }

    return {
      abierto: false,
      cuando: 'el',
      hora: tramo.desde,
      diaNombre: dias[diaBuscado],
      cierraHora: '',
    };
  }

  return { abierto: false, cuando: '', hora: '', diaNombre: '', cierraHora: '' };
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

  return { dia: dias[buscar('weekday')] ?? 0, minutos: hora * 60 + Number(buscar('minute')) };
}

function aMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * El texto que se enseña. Las plantillas llegan del componente ya traducidas:
 * «Cierra a las {hora}», «Abre mañana a las {hora}»…
 */
export function textoEstado(estado, frases) {
  const f = frases ?? {
    cierra: 'Cierra a las {hora}',
    hoy: 'Abre hoy a las {hora}',
    manana: 'Abre mañana a las {hora}',
    otroDia: 'Abre el {dia} a las {hora}',
    consulta: 'Consulta el horario',
  };

  const rellenar = (plantilla, valores) =>
    plantilla.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? '');

  if (estado.abierto) return rellenar(f.cierra, { hora: estado.cierraHora });
  if (!estado.hora) return f.consulta;
  if (estado.cuando === 'hoy') return rellenar(f.hoy, { hora: estado.hora });
  if (estado.cuando === 'manana') return rellenar(f.manana, { hora: estado.hora });
  if (estado.cuando === 'el') {
    // «Abre el viernes a las 16:00»: la plantilla lleva el artículo, el día va aparte.
    return rellenar(f.otroDia, { dia: estado.diaNombre, hora: estado.hora });
  }
  return f.consulta;
}

/**
 * Enciende el rótulo de la sección. Se actualiza cada minuto: un bar que abre a las 16:00
 * no puede seguir diciendo «cerrado» a las 16:01 porque el visitante no recargue.
 *
 * El componente deja las frases y los nombres de los días en `data-estado`, en el idioma de
 * la página. Si falta o está roto, se usan los de por defecto, en español.
 */
export function iniciarEstadoBar(tramos) {
  const rotulos = document.querySelectorAll('[data-estado-bar]');
  if (rotulos.length === 0) return;

  function pintar() {
    rotulos.forEach((rotulo) => {
      let datos = {};
      try {
        datos = JSON.parse(rotulo.dataset.estado || '{}');
      } catch {
        datos = {};
      }

      const estado = estadoEn(tramos, new Date(), datos.dias);
      const texto = rotulo.querySelector('[data-estado-texto]');
      if (texto) texto.textContent = textoEstado(estado, datos);

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
