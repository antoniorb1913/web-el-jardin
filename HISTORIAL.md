# HISTORIAL — Web Bar El Jardín

Registro de tareas completadas. **Una entrada por tarea, añadida únicamente cuando el usuario responde «sí» a «¿Todo OK?».** Sin excepciones (AGENTS.md · REGLA 3).

Cada entrada lleva obligatoriamente los 4 puntos: **¿qué?**, **¿por qué?**, **¿dónde en el código?** y **¿cómo comprobarlo?**

---

## Índice

| # | Fecha | Tarea | Estado |
|---|---|---|---|
| T1 | 2026-11-01 | Documentación y plan de trabajo | ✅ Completada |
| T2 | 2026-11-01 | Andamiaje Astro + Tailwind | ✅ Completada |
| T3 | 2026-11-01 | Identidad visual: paleta, logotipo, iconos y tipografías | ✅ Completada |

---

## 2026-11-01 · T1 — Documentación y plan de trabajo

**Estado:** ✅ Completada
**Rama:** `docs/t1-documentacion-y-plan`
**Commit:** `docs: crear AGENTS.md, TAREAS.md e HISTORIAL.md con el plan del proyecto`
**Archivos:** `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

He creado la documentación permanente del proyecto: las reglas de trabajo (`AGENTS.md`), el tablero de 18 tareas agrupadas en 5 fases (`TAREAS.md`) y el registro de tareas completadas (`HISTORIAL.md`). Incluye los datos reales del bar, el stack decidido (Astro + Tailwind, salida estática para Netlify), el planteamiento técnico del scrollytelling y lo que queda fuera de alcance.

### 2. ¿Por qué?

Porque el proyecto se va a construir en muchas sesiones y sin un contrato escrito cada sesión empieza de cero: se olvidan los datos del negocio, se repiten decisiones ya tomadas y se mezclan cambios de varias tareas en un mismo commit. Estas tres piezas fijan **qué se hace, en qué orden, cómo se comprueba y qué queda prohibido** (inventar precios, avanzar sin confirmación, ejecutar git). También fijan por escrito que el scrollytelling se hace **por escenas y no atando el vídeo al scroll**, que es el error clásico en este tipo de portada.

### 3. ¿Dónde verlo en el código?

- `AGENTS.md:1` — §1 datos del negocio; §3 stack y §3.1 scrollytelling; §5 REGLA 1 (ciclo de 7 pasos); §7 REGLA 4 (calidad); §9 REGLA 6 (tabla de comprobación de git); §10 inventario del entorno.
- `TAREAS.md:7` — tabla del tablero con las 18 tareas, dependencias y estados.
- `TAREAS.md:29` — justificación del orden de las fases.
- `TAREAS.md:37` — requisitos previos que dependen del usuario.
- `HISTORIAL.md:1` — este registro y su plantilla.

### 4. ¿Cómo comprobar que funciona?

1. Abre `AGENTS.md` y baja a **§5 REGLA 1**: deben estar los 7 pasos y la pregunta literal «¿Todo OK?».
2. En `AGENTS.md` **§9 REGLA 6**, comprueba que la tabla tiene las 5 filas (rama, archivos, PR, main, tablero e historial).
3. Abre `TAREAS.md`: en la tabla del principio solo **T1** debe estar en ✅ y **ninguna** tarea en 🔧 ni 👀.
4. Comprueba que las especialidades son cuatro (Kiwi, Pasión, Drácula, Aperol) y que **no aparece ningún precio** en ningún archivo.
5. Abre `HISTORIAL.md`: este registro debe tener los 4 puntos y la fila correspondiente en el índice.

---

## 2026-11-01 · T2 — Andamiaje Astro + Tailwind

**Estado:** ✅ Completada
**Rama:** `feat/t2-andamiaje-astro-tailwind`
**Commit:** `feat: montar el andamiaje de Astro 7 + Tailwind 4`
**Archivos:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `tsconfig.json`, `netlify.toml`, `.gitignore`, `README.md`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `src/*/.gitkeep`, `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

He montado el proyecto sobre el que se construirá todo lo demás: **Astro 7.4.4 + Tailwind 4.3.3** con salida estática, la estructura de carpetas, `.gitignore`, `netlify.toml`, README nuevo y una página de prueba. Comprobado con un build real (1 página, 713 ms, 1,1 KB de HTML y 8,2 KB de CSS en archivo aparte) y con el servidor de desarrollo respondiendo 200 en `http://localhost:4321`.

### 2. ¿Por qué?

Porque sin proyecto no hay dónde escribir las 16 tareas siguientes, y quería detectar los problemas de herramienta **antes** de tener contenido que perder. Los tres que aparecieron y quedan resueltos: (1) no hay `node` ni `npm` en este equipo, así que el gestor es **pnpm** con el runtime incluido; (2) pnpm 11 ya no lee su configuración de `package.json` y bloquea los scripts de `esbuild`/`sharp`, de ahí `pnpm-workspace.yaml` con `allowBuilds`; (3) el `README.md` que venía del repo vacío no servía para nadie. Además el HTML generado sale **sin `<style>` ni `<script>` inline**, que es la condición para poder aplicar una CSP estricta en T15 sin reescribir nada.

### 3. ¿Dónde verlo en el código?

- `package.json:8` — scripts `dev`, `build`, `preview` y las tres dependencias (Astro, Tailwind, plugin de Vite).
- `astro.config.mjs:8` — `defineConfig` con el plugin de Tailwind; el `site` se fija en T18.
- `pnpm-workspace.yaml:5` — `allowBuilds` para `esbuild` y `sharp` (obligatorio en pnpm 11).
- `src/styles/global.css:1` — `@import "tailwindcss"` y la capa `base` mínima.
- `src/layouts/Base.astro:25` — el `<html lang="es">`, título y descripción por defecto.
- `src/pages/index.astro:14` — la página de prueba (se sustituye en T5/T6).
- `netlify.toml:5` — `pnpm run build` → `dist`, con Node 22 y telemetría de Astro desactivada.
- `.gitignore:26` — la nota que impide ignorar `fotos/` y `transicion.mp4` por error.
- `README.md:11` — requisitos, comandos y estructura para cuando vuelvas al proyecto en meses.

### 4. ¿Cómo comprobar que funciona?

1. En `web-el-jardin`, ejecuta `pnpm build`: debe terminar con «1 page(s) built» y crear `dist/index.html` + `dist/_astro/*.css`.
2. Ejecuta `pnpm dev` y abre <http://localhost:4321>: se ven el título, la dirección y el badge «Andamiaje listo» con colores. Eso prueba que Tailwind compila.
3. Abre `dist/index.html` con un editor: **no** debe haber ninguna etiqueta `<style>` ni `<script>`; el CSS va enlazado aparte.
4. Mira `.gitignore`: `fotos/` y `transicion.mp4` **no** aparecen (se versionan a propósito).
5. Comprueba que el título conserva las tildes: «Bar El Jardín · Bar en Bolnuevo, Mazarrón».

---

## 2026-11-01 · T3 — Identidad visual: paleta, logotipo, iconos y tipografías

**Estado:** ✅ Completada
**Rama:** `feat/t3-identidad-visual`
**Commit:** `feat: sistema de diseño con la paleta del logo, tipografías e iconos`
**Archivos:** `src/styles/global.css`, `src/layouts/Base.astro`, `src/assets/logo.png`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/fonts/*.woff2`, `public/fonts/LICENCIAS.txt`, `src/pages/estilo.astro`, `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

He definido la identidad visual del sitio: los cinco colores de marca **medidos** sobre el logotipo (no elegidos a ojo), una paleta de neutros cálidos, dos tipografías autoalojadas (Fredoka para títulos, Figtree para texto), el logotipo con el fondo blanco eliminado y el icono del sitio (la «J» roja sobre baldosa verde). Todo vive como tokens de Tailwind en `global.css` y se revisa en la página `/estilo`.

### 2. ¿Por qué?

Porque a partir de T6 se van a escribir muchas secciones y, sin tokens, cada componente inventaría su propio color y su propio tamaño: el resultado es una web que parece hecha por cinco personas distintas. Además, los colores del logo son muy saturados y usados a ojo quedan sucios, así que los medí con código — incluidas dos sorpresas: la **A** es roja, no ámbar como parecía, y el verde de la **D** es casi negro (`#004320`). Y las fuentes van autoalojadas porque la regla de seguridad prohíbe depender de un CDN de terceros.

### 3. ¿Dónde verlo en el código?

- `src/styles/global.css:10` — los dos `@font-face` (Fredoka y Figtree, woff2, `font-display: swap`).
- `src/styles/global.css:37` — el bloque `@theme` con los tokens: `--color-jardin-rojo`, `--color-jardin-ambar`, `--color-jardin-verde`, `--color-jardin-azul`, `--color-jardin-granate`, los `crema-*` y los `tinta-*`.
- `src/styles/global.css:60` — la capa `base`: fondo crema, tipografía del cuerpo y `font-display` en los `h1`-`h3`.
- `src/layouts/Base.astro:28` — `<link rel="icon">`, `apple-touch-icon` y la precarga de las dos fuentes.
- `src/assets/logo.png` — logotipo recortado con transparencia (Astro lo sirve como WebP de 21 KB).
- `src/pages/estilo.astro:1` — muestrario de revisión: paleta, tipografías, logo sobre claro y sobre verde, e iconos a tamaño real.
- `AGENTS.md` §3.2 — el resumen de la identidad para futuras sesiones.

### 4. ¿Cómo comprobar que funciona?

1. Ejecuta `pnpm dev` y abre <http://localhost:4321/estilo/>.
2. Compara los cinco bloques de color con el logotipo de la misma página: deben coincidir.
3. Los títulos deben verse **redondeados** (Fredoka) y los párrafos en una sans distinta (Figtree). Si todo se ve igual, la fuente no cargó.
4. El logotipo sobre el fondo verde **no** debe tener un rectángulo blanco detrás.
5. En la pestaña del navegador debe aparecer la «J» roja sobre cuadrado verde.
6. Con las herramientas de desarrollo abiertas, en la pestaña Red: **ninguna** petición a `fonts.googleapis.com`; las fuentes salen de `/fonts/`.

---

<!-- Plantilla para la siguiente entrada:

## AAAA-MM-DD · Tn — Título de la tarea

**Estado:** ✅ Completada
**Rama:** `tipo/tn-descripcion`
**Commit:** `tipo: mensaje`
**Archivos:** `ruta/a.js`, `ruta/b.css`

### 1. ¿Qué he realizado?

### 2. ¿Por qué?

### 3. ¿Dónde verlo en el código?

### 4. ¿Cómo comprobar que funciona?

-->
