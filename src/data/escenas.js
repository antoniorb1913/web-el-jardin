/**
 * Escenas del scrollytelling (T4).
 *
 * `transicion.mp4` es un recorrido continuo en primera persona: calle, puerta,
 * patio, jardín, terraza y vistas. No tiene cortes duros, así que se ha troceado
 * a mano en seis estancias con sentido propio. Cada escena tiene su propio clip
 * para que el navegador descargue solo la que se está viendo.
 *
 * Regenerar los clips: ver `HISTORIAL.md`, entrada de T4.
 *
 * `seccion` es el id del bloque de la portada que activa la escena (T5).
 * `duracion` va en segundos y sirve para decidir cuándo precargar la siguiente.
 */

export const escenas = [
  {
    id: 'fachada',
    titulo: 'La fachada',
    descripcion: 'Buganvilla, la puerta abierta y el cartel en la calle.',
    clip: '/video/escena-1-fachada.mp4',
    poster: '/video/escena-1-fachada.jpg',
    duracion: 2.17,
    seccion: 'portada',
  },
  {
    id: 'entrada',
    titulo: 'El umbral',
    descripcion: 'Paredes encaladas, macetas y el cartel de la carta.',
    clip: '/video/escena-2-entrada.mp4',
    poster: '/video/escena-2-entrada.jpg',
    duracion: 2.38,
    seccion: 'quienes-somos',
  },
  {
    id: 'patio',
    titulo: 'El patio',
    descripcion: 'Grava, las primeras mesas y plantas por todas partes.',
    clip: '/video/escena-3-patio.mp4',
    poster: '/video/escena-3-patio.jpg',
    duracion: 3.33,
    seccion: 'especialidades',
  },
  {
    id: 'jardin',
    titulo: 'El jardín',
    descripcion: 'Macetas, columnas y verde hasta el techo.',
    clip: '/video/escena-4-jardin.mp4',
    poster: '/video/escena-4-jardin.jpg',
    duracion: 4.38,
    seccion: 'comida',
  },
  {
    id: 'terraza',
    titulo: 'La terraza',
    descripcion: 'Las sillas amarillas y las mesas al aire libre.',
    clip: '/video/escena-5-terraza.mp4',
    poster: '/video/escena-5-terraza.jpg',
    duracion: 4.17,
    seccion: 'fotos',
  },
  {
    id: 'vistas',
    titulo: 'Las vistas',
    descripcion: 'El final del recorrido, con la luz de la tarde.',
    clip: '/video/escena-6-vistas.mp4',
    poster: '/video/escena-6-vistas.jpg',
    duracion: 3.50,
    seccion: 'ubicacion',
  },
];
