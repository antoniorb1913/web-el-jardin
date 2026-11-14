// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Configuración del proyecto: Astro compila a HTML estático y Tailwind se encarga
// del CSS desde el plugin de Vite (Tailwind v4 no necesita tailwind.config.js).
// El dominio definitivo (`site`) se fija en T18, cuando se conecte Netlify.
export default defineConfig({
  // Dominio del sitio: la dirección publicada en Netlify. De aquí salen las canónicas,
  // las URLs de Open Graph y las del sitemap. Si algún día hay dominio propio, se cambia
  // esta línea y todo lo demás se actualiza solo.
  site: 'https://web-bar-jardin.netlify.app',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Los scripts deben salir como archivo aparte, nunca incrustados en el HTML:
      // una CSP estricta sin `unsafe-inline` bloquearía un <script> inline.
      assetsInlineLimit: 0,
    },
  },
});
