/**
 * Los tres idiomas de la web (T16).
 *
 * Aquí viven **todos los textos de la interfaz y de los apartados**, en español, inglés y
 * alemán. Los componentes no escriben texto: piden su idioma y leen de aquí. Así, cambiar
 * una palabra en un idioma es editar una línea.
 *
 * Lo que **no** se traduce:
 * - los nombres propios: Bar El Jardín, Bolnuevo, Mazarrón, Drácula, Aperol, David.
 * - la dirección y el horario, que son los mismos datos (`negocio.js`); solo cambian los
 *   nombres de los días y las etiquetas que los rodean.
 *
 * Las traducciones al inglés y al alemán son mías y están pendientes de que alguien con el
 * idioma les eche un ojo: un alemán de Bolnuevo notará cosas que yo no.
 */

export const IDIOMAS = ['es', 'en', 'de'];

/**
 * Los idiomas **publicados**. El alemán está escrito y traducido, pero no se publica hasta
 * que alguien con el idioma lo revise: una traducción torpe se nota más que no tenerla.
 * Para encenderlo, añadir 'de' aquí y crear sus dos páginas legales.
 */
export const PUBLICADOS = ['es', 'en'];

export const IDIOMA_POR_DEFECTO = 'es';

/** Nombre del idioma en su propia lengua, para el selector. */
export const NOMBRES = { es: 'Español', en: 'English', de: 'Deutsch' };

/** Código corto para el selector de la cabecera. */
export const SIGLAS = { es: 'ES', en: 'EN', de: 'DE' };

/** `<html lang>`: el inglés británico y el alemán de Alemania. */
export const LANG = { es: 'es', en: 'en-GB', de: 'de-DE' };

export const textos = {
  /* ---------------------------------------------------------------- ESPAÑOL */
  es: {
    rutas: { portada: '/', aviso: '/aviso-legal', privacidad: '/privacidad' },
    nav: {
      portada: 'Quiénes somos',
      especialidades: 'Especialidades',
      comida: 'Comida',
      fotos: 'Fotos',
      ubicacion: 'Dónde estamos',
      aria: 'Apartados de la portada',
      indice: 'Índice',
      cerrar: 'Cerrar',
    },
    portada: {
      marca: 'Bar El Jardín · Bolnuevo',
      lineas: ['Un paraíso', 'en Bolnuevo'],
      texto:
        'Somos un bar que te ofrece una opción creada para disfrutar de un ambiente agradable, relajado, sin dejar de lado pasar un rato alegre y rodeado de naturaleza.',
      baja: 'Baja y entra',
    },
    especialidades: {
      titulo: 'Nuestras especialidades',
      texto:
        'Creaciones de autor, combinados clásicos y batidos pensados para detener el tiempo. Elige tu copa, busca tu rincón y déjate llevar por la atmósfera del Jardín.',
    },
    comida: {
      titulo: 'Nuestra comida',
      texto:
        'Bocados pensados para compartir y disfrutar sin prisas. Desde la auténtica tradición alemana con nuestras Bratwurst y Currywurst, hasta la exquisitez de una tabla de Jamón Serrano de Teruel.',
    },
    carta: {
      nota: 'La carta completa, en el bar.',
      verEnGrande: 'Ver en grande',
      cerrar: 'Cerrar',
      bebidas: ['Kiwi de la casa', 'Pasión de la casa', 'Drácula', 'Aperol', 'Gin Tonic especial con frutas'],
      platos: ['Salchicha bratwurst', 'Salchicha currywurst', 'Tabla de jamón serrano de Teruel'],
    },
    fotos: {
      frase: 'Terrazas con encanto, música ambiente y tu copa lista. Siéntete como en casa.',
      verEnGrande: 'Ver en grande',
      pies: ['La fachada', 'La entrada', 'La terraza 1', 'La barra', 'David de Miguel Angel', 'La terraza 2'],
      alt: [
        'La fachada del bar desde la calle, con el rótulo pintado y las banderas',
        'La entrada de la terraza, entre plantas',
        'La terraza, con las sillas de colores y el campo al fondo',
        'La barra, con las banderas de España y Murcia',
        'La estatua dorada junto a la pared de platos',
        'Las mesas amarillas, con las vistas al campo',
      ],
      elegir: 'Elegir foto',
      anterior: 'Foto anterior',
      siguiente: 'Foto siguiente',
      irA: 'Ir a',
    },
    ubicacion: {
      titulo: 'Dónde estamos',
      comoLlegar: 'Cómo llegar',
      siguenos: 'Síguenos',
      redes: ['Facebook', 'Instagram', 'Tarjeta digital'],
      mapa: {
        rotulo: 'Ver el mapa',
        aviso: 'Al abrirlo, Google puede usar cookies.',
        titulo: 'Mapa con la ubicación del Bar El Jardín',
      },
      dias: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      horario: [
        { dias: 'Domingo a jueves', horas: '16:00 – 23:00' },
        { dias: 'Viernes y sábados', horas: '16:00 – 00:00' },
      ],
      estado: {
        cierra: 'Cierra a las {hora}',
        hoy: 'Abre hoy a las {hora}',
        manana: 'Abre mañana a las {hora}',
        otroDia: 'Abre el {dia} a las {hora}',
        consulta: 'Consulta el horario',
      },
    },
    pie: {
      donde: 'Dónde',
      cuando: 'Cuándo',
      comoLlegar: 'Cómo llegar',
      aviso: 'Aviso legal',
      privacidad: 'Privacidad',
      derechos: 'Todos los derechos reservados',
    },
    seo: {
      titulo: 'Bar El Jardín · Bar en Bolnuevo, Mazarrón',
      descripcion:
        'Bar rodeado de flores y plantas en Bolnuevo (Mazarrón, Murcia). Especialidades de la casa, bratwurst, currywurst y tabla de jamón serrano.',
      descripcionCorta: 'Un paraíso de flores y plantas',
      tipo: 'Bar de copas y tapas en Bolnuevo (Mazarrón, Murcia)',
    },
  },

  /* ----------------------------------------------------------------- INGLÉS */
  en: {
    rutas: { portada: '/en/', aviso: '/en/legal-notice', privacidad: '/en/privacy' },
    nav: {
      portada: 'About us',
      especialidades: 'Signature drinks',
      comida: 'Food',
      fotos: 'Photos',
      ubicacion: 'Where we are',
      aria: 'Sections of the page',
      indice: 'Contents',
      cerrar: 'Close',
    },
    portada: {
      marca: 'Bar El Jardín · Bolnuevo',
      lineas: ['A little paradise', 'in Bolnuevo'],
      texto:
        'We are a bar that offers you a place to enjoy a pleasant, relaxed atmosphere — and a good time, too — surrounded by nature.',
      baja: 'Come in',
    },
    especialidades: {
      titulo: 'Our specialities',
      texto:
        'Signature creations, classic mixed drinks and smoothies made to stop time. Pick your glass, find your corner and let the garden do the rest.',
    },
    comida: {
      titulo: 'Our food',
      texto:
        'Bites made to share and enjoy slowly. From real German tradition with our bratwurst and currywurst to a plate of Teruel serrano ham.',
    },
    carta: {
      nota: 'The full menu is at the bar.',
      verEnGrande: 'See it larger',
      cerrar: 'Close',
      bebidas: ['House kiwi', 'House passion fruit', 'Drácula', 'Aperol', 'Gin tonic special with fruit'],
      platos: ['Bratwurst sausage', 'Currywurst sausage', 'Teruel serrano ham board'],
    },
    fotos: {
      frase: 'Charming terraces, music in the air and your drink ready. Make yourself at home.',
      verEnGrande: 'See it larger',
      pies: ['The facade', 'The entrance', 'The terrace 1', 'The bar', 'David by Miguel Angel', 'The terrace 2'],
      alt: [
        'The bar front from the street, with the painted sign and the flags',
        'The terrace entrance, among plants',
        'The terrace, with the coloured chairs and the countryside behind',
        'The bar counter, with the flags of Spain and Murcia',
        'The golden statue next to the wall of plates',
        'The yellow tables, with views over the countryside',
      ],
      elegir: 'Choose a photo',
      anterior: 'Previous photo',
      siguiente: 'Next photo',
      irA: 'Go to',
    },
    ubicacion: {
      titulo: 'Where we are',
      comoLlegar: 'Get directions',
      siguenos: 'Follow us',
      redes: ['Facebook', 'Instagram', 'Digital card'],
      mapa: {
        rotulo: 'See the map',
        aviso: 'Opening it lets Google use cookies.',
        titulo: 'Map with the location of Bar El Jardín',
      },
      dias: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      horario: [
        { dias: 'Sunday to Thursday', horas: '16:00 – 23:00' },
        { dias: 'Friday and Saturday', horas: '16:00 – 00:00' },
      ],
      estado: {
        cierra: 'Closes at {hora}',
        hoy: 'Opens today at {hora}',
        manana: 'Opens tomorrow at {hora}',
        otroDia: 'Opens on {dia} at {hora}',
        consulta: 'Check the opening hours',
      },
    },
    pie: {
      donde: 'Where',
      cuando: 'When',
      comoLlegar: 'Get directions',
      aviso: 'Legal notice',
      privacidad: 'Privacy',
      derechos: 'All rights reserved',
    },
    seo: {
      titulo: 'Bar El Jardín · Bar in Bolnuevo, Mazarrón',
      descripcion:
        'A bar surrounded by flowers and plants in Bolnuevo (Mazarrón, Murcia). Signature drinks, bratwurst, currywurst and a serrano ham board.',
      descripcionCorta: 'A little paradise of flowers and plants',
      tipo: 'Cocktail and tapas bar in Bolnuevo (Mazarrón, Murcia)',
    },
  },

  /* ----------------------------------------------------------------- ALEMÁN */
  de: {
    rutas: { portada: '/de/', aviso: '/de/impressum', privacidad: '/de/datenschutz' },
    nav: {
      portada: 'Über uns',
      especialidades: 'Spezialitäten',
      comida: 'Essen',
      fotos: 'Fotos',
      ubicacion: 'Wo wir sind',
      aria: 'Abschnitte der Seite',
      indice: 'Inhalt',
      cerrar: 'Schließen',
    },
    portada: {
      marca: 'Bar El Jardín · Bolnuevo',
      lineas: ['Ein kleines Paradies', 'in Bolnuevo'],
      texto:
        'Wir sind eine Bar mit einem Ort zum Wohlfühlen: entspannt, freundlich und mitten in der Natur — und für einen guten Abend ist gesorgt.',
      baja: 'Komm rein',
    },
    especialidades: {
      titulo: 'Unsere Spezialitäten',
      texto:
        'Hauskreationen, Klassiker und Shakes, die die Zeit anhalten. Wähle dein Glas, such dir deine Ecke und lass dich vom Garten treiben.',
    },
    comida: {
      titulo: 'Unser Essen',
      texto:
        'Häppchen zum Teilen und Genießen. Von echter deutscher Tradition mit Bratwurst und Currywurst bis zur Platte mit Serrano-Schinken aus Teruel.',
    },
    carta: {
      nota: 'Die vollständige Karte gibt es in der Bar.',
      verEnGrande: 'Größer ansehen',
      cerrar: 'Schließen',
      bebidas: ['Kiwi nach Hausart', 'Maracuja nach Hausart', 'Drácula', 'Aperol', 'Gin Tonic spezial mit Früchten'],
      platos: ['Bratwurst', 'Currywurst', 'Serrano-Schinkenplatte aus Teruel'],
    },
    fotos: {
      frase: 'Terrassen mit Charme, Musik im Hintergrund und dein Drink bereit. Fühl dich wie zu Hause.',
      verEnGrande: 'Größer ansehen',
      pies: ['Die Fassade', 'Der Eingang', 'Die Terrasse 1', 'Die Bar', 'David von Miguel Angel', 'Die Terrasse 2'],
      alt: [
        'Die Fassade der Bar von der Straße, mit dem bemalten Schild und den Fahnen',
        'Der Eingang zur Terrasse, zwischen Pflanzen',
        'Die Terrasse mit den bunten Stühlen und dem Feld im Hintergrund',
        'Die Theke, mit den Fahnen von Spanien und Murcia',
        'Die goldene Statue neben der Wand voller Teller',
        'Die gelben Tische mit Blick aufs Land',
      ],
      elegir: 'Foto wählen',
      anterior: 'Vorheriges Foto',
      siguiente: 'Nächstes Foto',
      irA: 'Gehe zu',
    },
    ubicacion: {
      titulo: 'Wo wir sind',
      comoLlegar: 'Anfahrt',
      siguenos: 'Folge uns',
      redes: ['Facebook', 'Instagram', 'Digitale Karte'],
      mapa: {
        rotulo: 'Karte ansehen',
        aviso: 'Beim Öffnen kann Google Cookies verwenden.',
        titulo: 'Karte mit dem Standort der Bar El Jardín',
      },
      dias: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      horario: [
        { dias: 'Sonntag bis Donnerstag', horas: '16:00 – 23:00' },
        { dias: 'Freitag und Samstag', horas: '16:00 – 00:00' },
      ],
      estado: {
        cierra: 'Schließt um {hora}',
        hoy: 'Öffnet heute um {hora}',
        manana: 'Öffnet morgen um {hora}',
        otroDia: 'Öffnet am {dia} um {hora}',
        consulta: 'Öffnungszeiten ansehen',
      },
    },
    pie: {
      donde: 'Wo',
      cuando: 'Wann',
      comoLlegar: 'Anfahrt',
      aviso: 'Impressum',
      privacidad: 'Datenschutz',
      derechos: 'Alle Rechte vorbehalten',
    },
    seo: {
      titulo: 'Bar El Jardín · Bar in Bolnuevo, Mazarrón',
      descripcion:
        'Eine Bar zwischen Blumen und Pflanzen in Bolnuevo (Mazarrón, Murcia). Hausgetränke, Bratwurst, Currywurst und eine Serrano-Schinkenplatte.',
      descripcionCorta: 'Ein kleines Paradies aus Blumen und Pflanzen',
      tipo: 'Bar für Cocktails und Tapas in Bolnuevo (Mazarrón, Murcia)',
    },
  },
};

/** Todos los textos de un idioma, con el español como red de seguridad. */
export function t(idioma) {
  return textos[idioma] ?? textos[IDIOMA_POR_DEFECTO];
}

/**
 * Los demás idiomas, para el selector de la cabecera y para las etiquetas `hreflang`.
 * `pagina` es la clave de `rutas`: portada, aviso o privacidad.
 */
export function alternativas(idiomaActual, pagina) {
  return PUBLICADOS.filter((idioma) => idioma !== idiomaActual).map((idioma) => ({
    idioma,
    siglas: SIGLAS[idioma],
    nombre: NOMBRES[idioma],
    href: textos[idioma].rutas[pagina],
  }));
}
