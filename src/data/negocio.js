/**
 * Datos del negocio.
 *
 * Fuente única: `AGENTS.md` §1. Aquí no se inventa nada — ni precios, ni horarios
 * distintos, ni servicios que el bar no haya confirmado. Si cambia un horario, se
 * cambia en este archivo y se refleja en toda la web.
 */

export const negocio = {
  nombre: 'Bar El Jardín',
  lema: 'Un paraíso de flores y plantas',
};

export const direccion = {
  calle: 'Av. Antonio Segado del Olmo, 19',
  poblacion: 'Bolnuevo, Mazarrón',
  provincia: 'Murcia',
  /** Una línea, para textos corridos y para el pie. */
  completa: 'Av. Antonio Segado del Olmo, 19 — Bolnuevo, Mazarrón (Murcia)',
};

export const horario = [
  { dias: 'Domingo a jueves', horas: '16:00 – 23:00' },
  { dias: 'Viernes y sábados', horas: '16:00 – 00:00' },
];

/**
 * Los mismos dos tramos, pero en números, para saber si el bar está abierto ahora.
 *
 * `dias` con 0 = domingo. `hasta: '24:00'` es medianoche del mismo día: el viernes cierra
 * a las 00:00, que es el final de su día, no el principio del sábado.
 *
 * Si algún día el horario cambia en verano, se añade otro tramo aquí y la web entera —el
 * rótulo de abierto y el JSON-LD del SEO— se actualiza sola.
 */
export const tramos = [
  { dias: [0, 1, 2, 3, 4], desde: '16:00', hasta: '23:00' },
  { dias: [5, 6], desde: '16:00', hasta: '24:00' },
];

/**
 * Enlace a Google Maps por búsqueda de la dirección.
 * No se inventan coordenadas ni un identificador de sitio: es una búsqueda.
 */
export const enlaceMapa =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Av. Antonio Segado del Olmo 19, Bolnuevo, Mazarrón, Murcia');

/**
 * Apartados de la portada, en el mismo orden en que aparecen.
 *
 * «Quiénes somos» va con el logo, en la portada: es el mismo sitio y la misma
 * parada de cámara. `id` es el de la sección; la navegación salta a la parada donde
 * el apartado se enciende.
 */
export const apartados = [
  { id: 'portada', nombre: 'Quiénes somos' },
  { id: 'especialidades', nombre: 'Especialidades' },
  { id: 'comida', nombre: 'Comida' },
  { id: 'fotos', nombre: 'Fotos' },
  { id: 'ubicacion', nombre: 'Dónde estamos' },
];
