/**
 * Los textos legales, en los tres idiomas (T16).
 *
 * El español es el texto de referencia; el inglés y el alemán son traducciones y así se
 * dice al pie de las dos: en caso de discrepancia, manda la versión española. Es lo que
 * hace cualquier empresa que opera en varios idiomas y no quiere dos verdades distintas.
 *
 * Cada página es una lista de bloques. Los datos del titular —nombre, NIF, correo— no se
 * escriben aquí: se leen de `legal.js`, porque son los mismos en los tres idiomas.
 */

export const legales = {
  /* ---------------------------------------------------------------- ESPAÑOL */
  es: {
    aviso: {
      titulo: 'Aviso legal',
      entradilla:
        'Quién está detrás de esta web, cómo se puede contactar y en qué condiciones se puede usar lo que hay en ella.',
      ficha: { titular: 'Titular', nif: 'NIF', domicilio: 'Domicilio', correo: 'Correo' },
      bloques: [
        {
          titulo: 'Quién es el titular',
          parrafos: [
            'Esta web es el sitio informativo del Bar El Jardín, en Bolnuevo (Mazarrón, Murcia). El correo de contacto es el que figura en la ficha de arriba: es el único canal de la web, que no tiene formularios, ni reservas, ni área de usuario.',
          ],
        },
        {
          titulo: 'Para qué sirve esta web',
          parrafos: [
            'Es una web informativa. Cuenta qué es el bar, qué se puede tomar y comer, cómo es el local y dónde y cuándo abrir. No vende nada, no cobra nada y no tiene carrito: los precios y la carta se consultan en el propio bar.',
            'La información se ofrece de buena fe y se revisa cuando cambia. Aun así, los horarios pueden variar por festivos, temporada o eventos del pueblo: si vienes de lejos, mejor confirmar antes de venir.',
          ],
        },
        {
          titulo: 'Lo que hay escrito y fotografiado',
          parrafos: [
            'Los textos, el logotipo y las fotografías del local son del titular de esta web. Se pueden leer, ver y compartir enlazando a esta dirección; lo que no se puede es copiarlos a otro sitio como si fueran propios, ni usarlos para otro negocio, sin permiso por escrito.',
            'El logotipo del bar es obra de su diseñador. Las tipografías —Fredoka, Figtree y Chorus— se usan con su licencia libre y se sirven desde este mismo servidor.',
          ],
        },
        {
          titulo: 'Puede que algo falle',
          parrafos: [
            'Esta web se hace con cuidado, pero no hay servidor infalible: puede haber una imagen que no carga, un enlace caído o un horario sin actualizar. El titular no responde de los daños que pudieran derivarse de usar la web, y no garantiza que el sitio esté disponible sin interrupciones.',
          ],
        },
        {
          titulo: 'Enlaces a otros sitios',
          parrafos: [
            'La web enlaza a Google Maps para llegar al bar y a las redes del local. Esos servicios son de sus dueños, tienen sus propias condiciones y su propia política de privacidad, y el titular de esta web no responde de lo que hagan con los datos de quien los use.',
            'El mapa solo se carga cuando el visitante pulsa «Ver el mapa»: hasta entonces, Google no recibe ni una petición.',
          ],
          enlaces: [{ texto: 'Está explicado en la política de privacidad', href: '/privacidad' }],
        },
        {
          titulo: 'Qué ley manda aquí',
          parrafos: [
            'Esta web se rige por la legislación española. Para cualquier desacuerdo, si la ley no obliga a otro fuero, serán competentes los juzgados y tribunales de Murcia.',
          ],
        },
      ],
    },
    privacidad: {
      titulo: 'Privacidad',
      entradilla:
        'Qué datos se tratan cuando entras en esta web, quién los trata y cómo pedir que se borren. Es corta porque la web pide muy poco.',
      ficha: { titular: 'Titular', nif: 'NIF', domicilio: 'Domicilio', correo: 'Correo' },
      bloques: [
        {
          titulo: 'Qué datos recoge esta web',
          parrafos: [
            'Ninguno por su cuenta. La web no tiene formularios, ni cuentas, ni comentarios, ni carrito. No pide nombre, ni correo, ni teléfono, ni documento.',
            'No hay analítica, ni píxeles publicitarios, ni perfiles de visitante. El titular no sabe quién ha entrado, ni desde dónde, ni cuánto rato.',
          ],
        },
        {
          titulo: 'Lo único que sí pasa: el mapa',
          parrafos: [
            'En el último apartado hay un mapa de Google que solo se carga si el visitante pulsa «Ver el mapa». Hasta que no lo pulsa, la web no manda ni una petición a Google.',
            'Al pulsarlo, ese mapa se descarga desde los servidores de Google, y Google puede instalar sus cookies y recoger la dirección IP desde la que entras. Ese tratamiento no lo hace el bar: lo hace Google, según sus propias condiciones.',
          ],
        },
        {
          titulo: 'Si escribes un correo',
          parrafos: [
            'Si decides escribir al correo de contacto, el titular usará tu dirección y lo que le cuentes solo para responderte. La base legal es tu consentimiento al escribir. No se usa para publicidad y no se cede a nadie. Se conserva mientras dure la conversación y lo mínimo que exija la ley.',
          ],
        },
        {
          titulo: 'Qué derechos tienes',
          parrafos: [
            'Tienes derecho a saber si se están tratando datos tuyos, a que se corrijan, a que se supriman, a oponerte al tratamiento y a pedirlos en un formato portable. Para ejercerlos basta con escribir al correo de contacto indicando qué derecho pides.',
            'Si no quedas conforme con la respuesta, puedes reclamar ante la Agencia Española de Protección de Datos.',
          ],
          enlaces: [{ texto: 'Agencia Española de Protección de Datos', href: 'https://www.aepd.es' }],
        },
        {
          titulo: 'Cookies',
          parrafos: [
            'La web, por sí misma, no instala cookies. Solo hay una excepción, y no es del bar: el mapa de Google, cuando el visitante decide abrirlo.',
            'Mientras no se pulse, la web no pone ni una cookie, y por eso no hay un aviso que aceptar.',
          ],
        },
        {
          titulo: 'Cambios en este texto',
          parrafos: [
            'Si algún día la web añade algo que trate datos —un formulario, un boletín, una analítica—, este texto se actualizará antes de encenderlo. La fecha del pie dice cuándo se revisó por última vez.',
          ],
        },
      ],
    },
    notaIdioma: 'Texto de referencia en español. En caso de discrepancia, prevalece la versión española.',
  },

  /* ----------------------------------------------------------------- INGLÉS */
  en: {
    aviso: {
      titulo: 'Legal notice',
      entradilla:
        'Who is behind this website, how to get in touch and on what terms the content may be used.',
      ficha: { titular: 'Owner', nif: 'Tax ID', domicilio: 'Address', correo: 'Email' },
      bloques: [
        {
          titulo: 'Who the owner is',
          parrafos: [
            'This is the information site of Bar El Jardín, in Bolnuevo (Mazarrón, Murcia). The contact email is the one in the box above: it is the only channel on the site, which has no forms, no bookings and no user area.',
          ],
        },
        {
          titulo: 'What this site is for',
          parrafos: [
            'This is an information site. It tells you what the bar is, what you can drink and eat, what the place is like and where and when it opens. It sells nothing, charges nothing and has no shopping cart: prices and the full menu are available at the bar.',
            'The information is given in good faith and updated when it changes. Opening hours can still vary on public holidays, in season or during local events: if you are coming from far away, it is worth checking first.',
          ],
        },
        {
          titulo: 'Text and photographs',
          parrafos: [
            'The text, logo and photographs of the bar belong to the owner of this site. You may read, view and share them by linking to this address; you may not copy them elsewhere as your own or use them for another business without written permission.',
          ],
        },
        {
          titulo: 'Things can fail',
          parrafos: [
            'This site is made with care, but no server is infallible: an image may fail to load, a link may break, a schedule may be out of date. The owner is not liable for any damage arising from the use of the site and does not guarantee uninterrupted availability.',
          ],
        },
        {
          titulo: 'Links to other sites',
          parrafos: [
            'The site links to Google Maps to help you find the bar and to the bar’s social media. Those services belong to their owners, have their own terms and their own privacy policy, and the owner of this site is not responsible for what they do with visitors’ data.',
            'The map only loads when the visitor presses “See the map”: until then, Google receives no request at all.',
          ],
          enlaces: [{ texto: 'Explained in the privacy policy', href: '/en/privacy' }],
        },
        {
          titulo: 'Which law applies',
          parrafos: [
            'This site is governed by Spanish law. Unless the law requires another jurisdiction, any dispute will be settled by the courts of Murcia.',
          ],
        },
      ],
    },
    privacidad: {
      titulo: 'Privacy',
      entradilla:
        'What data is processed when you visit this site, who processes it and how to ask for it to be deleted. It is short because the site asks for very little.',
      ficha: { titular: 'Owner', nif: 'Tax ID', domicilio: 'Address', correo: 'Email' },
      bloques: [
        {
          titulo: 'What this site collects',
          parrafos: [
            'Nothing on its own. There are no forms, no accounts, no comments and no shopping cart. It does not ask for your name, email, phone number or ID.',
            'There is no analytics, no advertising pixels and no visitor profiles. The owner does not know who visited, from where, or for how long.',
          ],
        },
        {
          titulo: 'The one exception: the map',
          parrafos: [
            'The last section has a Google map that only loads if the visitor presses “See the map”. Until then, the site does not send a single request to Google.',
            'Once pressed, that map is downloaded from Google’s servers, and Google may set its cookies and collect the IP address you are browsing from. That processing is not done by the bar: it is done by Google, under its own terms.',
          ],
        },
        {
          titulo: 'If you send an email',
          parrafos: [
            'If you write to the contact address, the owner will use your address and what you tell them only to reply. The legal basis is your consent in writing. It is not used for advertising and is not shared with anyone. It is kept for as long as the conversation lasts and for the minimum the law requires.',
          ],
        },
        {
          titulo: 'Your rights',
          parrafos: [
            'You have the right to know whether your data is being processed, to have it corrected or deleted, to object to the processing and to receive it in a portable format. To exercise them, write to the contact address stating which right you are asking for.',
            'If you are not satisfied with the answer, you can complain to the Spanish Data Protection Agency.',
          ],
          enlaces: [{ texto: 'Spanish Data Protection Agency', href: 'https://www.aepd.es' }],
        },
        {
          titulo: 'Cookies',
          parrafos: [
            'The site itself sets no cookies. The only exception is not the bar’s: Google’s map, when the visitor chooses to open it.',
            'Until it is pressed, the site sets no cookies at all, which is why there is no banner to accept.',
          ],
        },
      ],
    },
    notaIdioma:
      'Reference text in Spanish. In case of discrepancy, the Spanish version prevails.',
  },

  /* ----------------------------------------------------------------- ALEMÁN */
  de: {
    aviso: {
      titulo: 'Impressum',
      entradilla:
        'Wer hinter dieser Website steht, wie Sie uns erreichen und zu welchen Bedingungen die Inhalte genutzt werden dürfen.',
      ficha: { titular: 'Inhaber', nif: 'Steuernummer', domicilio: 'Anschrift', correo: 'E-Mail' },
      bloques: [
        {
          titulo: 'Wer der Inhaber ist',
          parrafos: [
            'Dies ist die Informationsseite der Bar El Jardín in Bolnuevo (Mazarrón, Murcia). Die Kontaktadresse steht im Kasten oben: sie ist der einzige Kanal der Website, die keine Formulare, keine Reservierungen und keinen Nutzerbereich hat.',
          ],
        },
        {
          titulo: 'Wozu diese Website dient',
          parrafos: [
            'Die Website informiert. Sie zeigt, was die Bar ist, was man trinken und essen kann, wie das Lokal aussieht und wann es öffnet. Sie verkauft nichts, kostet nichts und hat keinen Warenkorb: Preise und die vollständige Karte gibt es in der Bar.',
            'Die Angaben sind nach bestem Wissen und werden bei Änderungen aktualisiert. Öffnungszeiten können an Feiertagen, in der Saison oder bei Veranstaltungen im Ort abweichen: Wer von weiter her kommt, fragt besser vorher nach.',
          ],
        },
        {
          titulo: 'Texte und Fotos',
          parrafos: [
            'Texte, Logo und Fotos des Lokals gehören dem Inhaber dieser Website. Man darf sie lesen, ansehen und mit einem Link auf diese Adresse teilen; nicht erlaubt ist, sie als eigene zu kopieren oder für ein anderes Geschäft zu verwenden — ohne schriftliche Erlaubnis.',
          ],
        },
        {
          titulo: 'Es kann etwas schiefgehen',
          parrafos: [
            'Diese Website ist sorgfältig gebaut, aber kein Server ist unfehlbar: ein Bild lädt nicht, ein Link ist tot, eine Uhrzeit veraltet. Der Inhaber haftet nicht für Schäden aus der Nutzung der Website und garantiert keine ununterbrochene Verfügbarkeit.',
          ],
        },
        {
          titulo: 'Links zu anderen Seiten',
          parrafos: [
            'Die Website verlinkt auf Google Maps und auf die sozialen Netzwerke der Bar. Diese Dienste gehören ihren Betreibern, haben eigene Bedingungen und eigene Datenschutzregeln; der Inhaber dieser Website haftet nicht dafür.',
            'Die Karte lädt erst, wenn man auf „Karte ansehen“ drückt: bis dahin geht keine einzige Anfrage an Google.',
          ],
          enlaces: [{ texto: 'Steht in der Datenschutzerklärung', href: '/de/datenschutz' }],
        },
        {
          titulo: 'Welches Recht gilt',
          parrafos: [
            'Es gilt spanisches Recht. Soweit gesetzlich kein anderer Gerichtsstand vorgeschrieben ist, sind die Gerichte in Murcia zuständig.',
          ],
        },
      ],
    },
    privacidad: {
      titulo: 'Datenschutz',
      entradilla:
        'Welche Daten beim Besuch dieser Website verarbeitet werden, wer sie verarbeitet und wie man deren Löschung verlangt. Kurz, weil die Website wenig verlangt.',
      ficha: { titular: 'Inhaber', nif: 'Steuernummer', domicilio: 'Anschrift', correo: 'E-Mail' },
      bloques: [
        {
          titulo: 'Was diese Website erhebt',
          parrafos: [
            'Von sich aus nichts. Es gibt keine Formulare, keine Konten, keine Kommentare und keinen Warenkorb. Name, E-Mail, Telefonnummer oder Ausweis werden nicht abgefragt.',
            'Es gibt keine Analyse, keine Werbe-Pixel und keine Besucherprofile. Der Inhaber weiß nicht, wer hereingeschaut hat, von wo oder wie lange.',
          ],
        },
        {
          titulo: 'Die einzige Ausnahme: die Karte',
          parrafos: [
            'Im letzten Abschnitt steht eine Google-Karte, die erst lädt, wenn man auf „Karte ansehen“ drückt. Bis dahin schickt die Website keine einzige Anfrage an Google.',
            'Nach dem Drücken wird die Karte von Google geladen; Google kann dabei Cookies setzen und die IP-Adresse erfassen. Diese Verarbeitung macht nicht die Bar, sondern Google, nach eigenen Bedingungen.',
          ],
        },
        {
          titulo: 'Wenn Sie eine E-Mail schreiben',
          parrafos: [
            'Schreiben Sie an die Kontaktadresse, nutzt der Inhaber Ihre Adresse und Ihre Nachricht nur, um zu antworten. Rechtsgrundlage ist Ihre Einwilligung. Die Daten dienen nicht der Werbung und werden nicht weitergegeben. Sie bleiben, solange das Gespräch dauert, und so lange es das Gesetz verlangt.',
          ],
        },
        {
          titulo: 'Ihre Rechte',
          parrafos: [
            'Sie haben das Recht zu erfahren, ob Daten über Sie verarbeitet werden, sie berichtigen oder löschen zu lassen, der Verarbeitung zu widersprechen und sie in einem übertragbaren Format zu erhalten. Schreiben Sie dazu an die Kontaktadresse und nennen Sie das Recht.',
            'Sind Sie mit der Antwort nicht einverstanden, können Sie sich bei der spanischen Datenschutzbehörde beschweren.',
          ],
          enlaces: [{ texto: 'Spanische Datenschutzbehörde', href: 'https://www.aepd.es' }],
        },
        {
          titulo: 'Cookies',
          parrafos: [
            'Die Website selbst setzt keine Cookies. Die einzige Ausnahme stammt nicht von der Bar: die Google-Karte, wenn man sie öffnet.',
            'Solange sie nicht geöffnet wird, setzt die Website kein einziges Cookie — deshalb gibt es auch kein Banner zum Wegklicken.',
          ],
        },
      ],
    },
    notaIdioma:
      'Referenztext auf Spanisch. Bei Abweichungen gilt die spanische Fassung.',
  },
};

/** Los textos legales de un idioma, con el español como red de seguridad. */
export function textosLegales(idioma) {
  return legales[idioma] ?? legales.es;
}
