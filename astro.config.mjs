// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Configuración del proyecto: Astro compila a HTML estático y Tailwind se encarga
// del CSS desde el plugin de Vite (Tailwind v4 no necesita tailwind.config.js).
// El dominio definitivo (`site`) se fija en T18, cuando se conecte Netlify.
export default defineConfig({
  // Dominio del sitio. Hoy es la dirección provisional de Netlify; en T18, cuando se
  // conecte el dominio definitivo, se cambia esta línea y con ella cambian las canónicas,
  // las URLs de Open Graph y las del sitemap.
  site: 'https://bareljardin.netlify.app',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Los scripts deben salir como archivo aparte, nunca incrustados en el HTML:
      // una CSP estricta sin `unsafe-inline` bloquearía un <script> inline.
      assetsInlineLimit: 0,
    },
  },
});
