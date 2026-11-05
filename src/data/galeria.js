/**
 * Los rincones del bar.
 *
 * Las fotos son del local: terraza, patio, barra, jardín y las vistas. Los textos alternativos
 * describen lo que se ve, sin adornos: son lo que lee quien no puede ver la imagen.
 *
 * `foto` es el nombre del archivo en `public/galeria/` sin extensión ni sufijo: hay dos
 * tamaños de cada una, `bar1.webp` (1600 px) y `bar1-pequena.webp` (800 px).
 */

export const fotos = [
  { foto: 'bar1', alt: 'La entrada de la terraza, entre plantas' },
  { foto: 'bar3', alt: 'La terraza, con las sillas de colores' },
  { foto: 'bar4', alt: 'La barra, con las banderas de España y Murcia' },
  { foto: 'bar5', alt: 'La estatua dorada junto a la pared de platos' },
  { foto: 'bar6', alt: 'Las mesas amarillas, con el campo al fondo' },
  { foto: 'bar7', alt: 'Bolnuevo desde la terraza' },
];

/**
 * El vídeo, uno por idioma.
 *
 * Ahora solo existe el español; el inglés y el alemán llegan con la versión en otros
 * idiomas (T16). El reproductor elige el archivo según el `lang` de la página.
 */
export const videos = {
  es: {
    archivo: '/video/bar-es.mp4',
    poster: '/video/bar-es-poster.webp',
    duracion: '0:54',
    alt: 'Paseo por el bar: la entrada, la terraza, la barra y las vistas',
  },
};
