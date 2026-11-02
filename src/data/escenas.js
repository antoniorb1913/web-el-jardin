/**
 * Escenas del scrollytelling (T4).
 *
 * El material original son CUATRO clips de 5,04 s, cada uno una estancia distinta
 * del recorrido. `transicion.mp4` es simplemente la unión de los cuatro, así que
 * los cortes buenos son los del autor (5,04 / 10,08 / 15,12 s) y no subdivisiones
 * inventadas. Cada clip tiene su archivo para que el navegador descargue solo el
 * que se está viendo.
 *
 * Codificación: 1116×760 (resolución nativa, recortando el 9 % inferior donde está
 * la marca de agua del generador), H.264 CRF 26, 24 fps, sin audio, 4,2 s por clip.
 *
 * Regenerar: ver `HISTORIAL.md`, entrada de T4.
 */

export const escenas = [
  {
    id: 'fachada',
    titulo: 'La calle',
    descripcion: 'La buganvilla, el cartel y la puerta abierta.',
    clip: '/video/escena-1-fachada.mp4',
    poster: '/video/escena-1-fachada.jpg',
    duracion: 4.2,
    secciones: ['portada', 'quienes-somos'],
  },
  {
    id: 'patio',
    titulo: 'El patio',
    descripcion: 'La grava, las primeras mesas y las macetas.',
    clip: '/video/escena-2-patio.mp4',
    poster: '/video/escena-2-patio.jpg',
    duracion: 4.2,
    secciones: ['especialidades'],
  },
  {
    id: 'jardin',
    titulo: 'El jardín',
    descripcion: 'El camino entre plantas hacia la terraza.',
    clip: '/video/escena-3-jardin.mp4',
    poster: '/video/escena-3-jardin.jpg',
    duracion: 4.2,
    secciones: ['comida'],
  },
  {
    id: 'terraza',
    titulo: 'La terraza',
    descripcion: 'Las sillas amarillas y las vistas.',
    clip: '/video/escena-4-terraza.mp4',
    poster: '/video/escena-4-terraza.jpg',
    duracion: 4.2,
    secciones: ['fotos', 'ubicacion'],
  },
];

/**
 * Devuelve la escena que corresponde a una sección de la portada.
 * Vive aquí y no en `app.js` para que la relación escena↔sección esté en un solo sitio.
 * @param {string} idSeccion
 */
export function escenaDeSeccion(idSeccion) {
  return escenas.find((escena) => escena.secciones.includes(idSeccion)) ?? escenas[0];
}
