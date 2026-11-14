/**
 * Datos de SEO que salen de los del negocio.
 *
 * Aquí no se escribe ninguna dirección ni ningún horario nuevo: se leen de `negocio.js` y
 * se traducen al vocabulario de schema.org, que es el que entienden Google y las redes
 * sociales. Si cambia un horario en `negocio.js`, cambia también aquí solo.
 *
 * El tipo es `BarOrPub`: es el que schema.org define para un bar. Se completa con lo que
 * el bar tiene confirmado; no se rellena `priceRange` porque en la web no hay precios, ni
 * `telephone` porque no hay un teléfono publicado, ni `geo` porque no tenemos coordenadas
 * verificadas y no se inventan.
 */
import { negocio, direccion, tramos, enlaceMapa, redes } from './negocio';

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** «24:00» no existe en schema.org: medianoche se declara como 23:59. */
function horaSchema(hora) {
  return hora === '24:00' ? '23:59' : hora;
}

/** El horario, día a día, en el formato que espera Google. */
export function horarioSchema() {
  return tramos.map((tramo) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: tramo.dias.map((dia) => DIAS[dia]),
    opens: tramo.desde,
    closes: horaSchema(tramo.hasta),
  }));
}

/**
 * La ficha del bar para Google. `url` e `image` se completan desde el componente, que es
 * quien conoce el dominio del sitio.
 */
export function fichaBar(url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: negocio.nombre,
    description: `${negocio.lema}. Bar de copas y tapas en Bolnuevo (Mazarrón, Murcia).`,
    url,
    image: `${url}og.jpg`,
    hasMap: enlaceMapa,
    sameAs: redes.map((red) => red.url),
    address: {
      '@type': 'PostalAddress',
      streetAddress: direccion.calle,
      addressLocality: 'Bolnuevo, Mazarrón',
      addressRegion: 'Murcia',
      postalCode: '30877',
      addressCountry: 'ES',
    },
    openingHoursSpecification: horarioSchema(),
  };
}
