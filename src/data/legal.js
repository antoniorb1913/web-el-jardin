/**
 * Datos del titular para los textos legales.
 *
 * **Esto no se inventa.** Los tres campos vacíos son los únicos que faltan y la web
 * avisa en pantalla mientras lo estén: no se puede publicar con ellos en blanco.
 *
 * Si el bar tributa como autónomo, el titular es la persona; si es una sociedad, la
 * razón social. El NIF es el del titular, no el del local.
 */
export const titular = {
  nombre: '',
  nif: '',
  correo: '',
  /** Domicilio a efectos legales: se usa la dirección del bar. */
  domicilio: 'Av. Antonio Segado del Olmo, 19 — 30877 Bolnuevo, Mazarrón (Murcia)',
};

/** ¿Están los tres datos que la ley exige? Con uno que falte, no se publica. */
export const titularCompleto = Boolean(titular.nombre && titular.nif && titular.correo);

/**
 * Fecha de la última revisión de los textos. Se muestra al pie de las dos páginas: es lo
 * que da credibilidad a un aviso legal, más que la parafernalia.
 */
export const ultimaRevision = '14 de noviembre de 2026';
