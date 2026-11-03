/**
 * La carta del bar.
 *
 * Solo nombres: ni precios ni descripciones. El usuario lo dejó claro — la carta con
 * importes se consulta en el bar, y aquí no se inventa nada que no esté aprobado.
 *
 * `foto` es el nombre del archivo en `public/productos/`. `null` significa que esa
 * pieza no tiene foto todavía: se maqueta con su hueco, no se deja un espacio vacío.
 */

export const bebidas = [
  { nombre: 'Kiwi de la casa', foto: 'kiwi' },
  { nombre: 'Pasión de la casa', foto: null },
  { nombre: 'Drácula', foto: 'dracula' },
  { nombre: 'Aperol', foto: 'aperol' },
  { nombre: 'Gin Tonic', foto: 'gin-tonic' },
];

export const platos = [
  { nombre: 'Salchicha bratwurst', foto: 'bratwurst' },
  { nombre: 'Salchicha currywurst', foto: 'currywurst' },
  { nombre: 'Tabla de jamón serrano de Teruel', foto: 'tabla-jamon' },
];

/** Lo único que se dice de la carta, y es verdad: está en el bar. */
export const notaCarta = 'La carta completa, en el bar.';
