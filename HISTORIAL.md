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
| T4 | 2026-11-01 | Análisis del vídeo y troceado en escenas | ✅ Completada |
| T5 | 2026-11-01 | Motor de scrollytelling | ✅ Completada |
| T6 | 2026-11-01 | Cabecera, navegación, cierre y cruces entre escenas | ✅ Completada |

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

## 2026-11-01 · T4 — Análisis del vídeo y troceado en escenas

**Estado:** ✅ Completada (revisada el mismo día)
**Rama:** `feat/t4-troceado-video`
**Commit:** `feat: trocear el vídeo en sus cuatro escenas a calidad nativa`
**Archivos:** `clips-originales/escena1-4.mp4`, `public/video/escena-1..4-*.mp4`, `public/video/escena-1..4-*.jpg`, `src/data/escenas.js`, `src/pages/escenas.astro`, `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

He medido el material y lo he dejado en **cuatro clips, uno por estancia real** del recorrido (calle, patio, jardín y terraza), cada uno con su imagen de póster. **Total: 7,3 MB** frente a los 19,8 MB del original, y a resolución nativa.

### 2. ¿Por qué?

Porque 20 MB de vídeo de fondo son varios segundos de espera en un móvil, y porque el scrollytelling necesita cargar solo la escena que se está viendo. Además el original traía **la marca de agua del generador** («KlingAI 4.0») y eso no puede salir en la web de un negocio: se recorta el 9 % inferior.

> **Segunda vuelta, y por qué.** La primera versión partió el vídeo en seis trozos mirando fotogramas, porque el detector de escenas no encontraba cortes. El usuario avisó de que **se veía peor que el original** y aportó los cuatro clips separados: resultó que el vídeo **está montado a partir de cuatro escenas de 5,04 s**, y los cortes buenos estaban en 5,04 / 10,08 / 15,12 s. La primera versión cortaba por dentro de las escenas y además bajaba la resolución a 960 con CRF 32. Rehecho desde el material original: sin reescalar y con CRF 26. La lección: **preguntar de dónde sale el vídeo antes de trocearlo**.

### 3. ¿Dónde verlo en el código?

- `src/data/escenas.js:17` — array `escenas`: id, `clip`, `poster`, `duracion`, `secciones` y la función `escenaDeSeccion()`.
- `public/video/escena-1-fachada.mp4` — el clip más ligero (1,5 MB).
- `public/video/escena-4-terraza.mp4` — el más pesado (2,0 MB).
- `src/pages/escenas.astro:1` — visor temporal para revisar los clips (se borra en T17).
- `clips-originales/` — las cuatro escenas de partida, sin tocar.
- `AGENTS.md` §3.1 y §10 — la decisión con las cifras reales.
- Para regenerar: `ffmpeg -ss 0.4 -t 4.2 -i clips-originales/escenaN.mp4 -vf "crop=iw:ih*0.91:0:0,scale=1116:-2,fps=24" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart salida.mp4`

### 4. ¿Cómo comprobar que funciona?

1. Con el servidor de desarrollo levantado, abrir <http://localhost:4321/escenas/> y ver los cuatro clips seguidos.
2. Comprobar que cada uno empieza y termina dentro de su estancia, y que el paso de uno a otro no corta un movimiento a medias.
3. Mirar la esquina inferior derecha: no debe aparecer ninguna marca de agua.
4. Comparar la nitidez con el original: el detalle del follaje y de la grava debe mantenerse.

---

## 2026-11-01 · T5 — Motor de scrollytelling

**Estado:** ✅ Completada
**Rama:** `feat/t5-scrollytelling`
**Commit:** `feat: recorrido del bar con scroll por fotogramas y fotos nitidas en cada apartado`
**Archivos:** `src/components/HeroScrolly.astro`, `src/scripts/app.js`, `src/styles/global.css`, `src/pages/index.astro`, `astro.config.mjs`, `public/fondo/*.avif` (240), `public/escenas/*.webp` (10), `fotos/escenas/*.jpg` (5), `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

La portada recorre el bar al hacer scroll con una secuencia de 240 fotogramas dibujados en un canvas, y en cinco puntos la cámara se detiene y se enciende una foto nítida de ese mismo encuadre. El texto de cada apartado vive en un panel fijo en el centro de la pantalla: aparece justo cuando su foto se enciende, se desvanece y deja un tramo en el que solo se ve el bar en movimiento.

### 2. ¿Por qué?

Porque el vídeo no arrancaba solo (el navegador bloquea la reproducción) y porque el fondo del vídeo se ve blando: el original mide 1116 px y el navegador lo amplía. Como cada clip se generó a partir de una foto de 4096 px, encenderla en el primer fotograma da nitidez sin romper la animación. Se bajó de 484 a 240 fotogramas para que la web pese la mitad (13,5 → 6,7 MB) con un modo de 120 para móvil (3,3 MB). Se intentó además atar las paradas de la cámara a los centros de los apartados, para que cada texto entrara justo con su foto nítida; funcionaba, pero dejaba el recorrido desigual entre tramos y el usuario prefirió el reparto regular en cuartos.

### 3. ¿Dónde verlo en el código?

- `src/components/HeroScrolly.astro:22` — contenedor sticky, canvas y las cinco capas de foto.
- `src/scripts/app.js:43` — `PAUSA`: cuánto se queda quieta la cámara en cada tramo.
- `src/scripts/app.js:68` — `repartir()`: avance del scroll → fotograma, con la parada al principio de cada tramo.
- `src/scripts/app.js:30` — `ENTRADA_FOTO` y `SALIDA_FOTO`: encendido y apagado de la foto.
- `src/scripts/app.js:196` — `cargar()`: carga por capas y modo ligero.
- `src/styles/global.css:76` — `.fondo__capa`, `.fondo__lienzo`, `.foto` y `.texto-foto`.
- `src/pages/index.astro:29` — secciones de 300dvh (solo recorrido) y sus paneles.
- `astro.config.mjs:11` — `assetsInlineLimit: 0`, para que el JS salga como archivo y no rompa la CSP.

### 4. ¿Cómo comprobar que funciona?

1. `http://localhost:4321/?animar=1` (el `?animar=1` fuerza la animación aunque el sistema pida reducir movimiento).
2. Bajar despacio: el fondo avanza sin saltos y el logo se desvanece sin moverse.
3. Al llegar a cada escena la cámara se para y la imagen se ve **nítida** durante ~1.000 px de scroll.
4. En ese momento no debe verse ninguna imagen doble ni el cartel duplicado.
5. Entre apartado y apartado solo se ve el bar en movimiento, sin texto.
6. Al final: estatua nítida con «Dónde estamos» y la dirección.
7. En una ventana estrecha (o en el móvil) comprobar que solo se descargan 120 fotogramas.

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

---

## 2026-11-01 · T6 — Cabecera, navegación, cierre y cruces entre escenas

**Estado:** ✅ Completada
**Rama:** `feat/t6-cabecera-y-navegacion`
**Commit:** `feat: cabecera, navegación, cierre y cruces entre escenas`
**Archivos:** `src/data/negocio.js`, `src/components/Header.astro`, `src/components/HeroScrolly.astro`, `src/layouts/Base.astro`, `src/pages/index.astro`, `src/scripts/app.js`, `src/styles/global.css`, `TAREAS.md`, `HISTORIAL.md`

### 1. ¿Qué he realizado?

Cabecera con el logotipo y los cinco apartados, índice a pantalla completa en móvil, y el pie dentro de la película como última escena. Además, los dos cruces con desenfoque: el del scroll, que tapa los tramos en los que la cámara viaja, y el de los enlaces de la cabecera, que llevan al apartado en 1,7 s en vez de recorrer la página entera.

### 2. ¿Por qué?

La cabecera hacía falta para poder saltar de un apartado a otro sin bajar trece pantallas, y el cierre tenía que estar dentro del recorrido para no romper la película. El cruce resuelve un problema de material: los fotogramas salen de un vídeo de 1116 px que se amplía casi al doble, y en los tramos en los que la cámara viaja se ven blandos. Tapando esos tramos con el desenfoque, la vista descansa entre apartado y apartado.

Coste y decisiones que se aprendieron por el camino:

- **`backdrop-filter` es carísimo**: desenfoca lo que hay debajo en cada fotograma y hunde la animación. Se probó a desenfocar una copia del lienzo con `filter`, pero el resultado no convenció al usuario; se volvió al `backdrop-filter` aceptando el coste porque el cruce dura poco.
- **La foto nítida no puede mezclarse con el fotograma**: son dos imágenes distintas de la misma pared y al 50 % se ven dos rótulos. Se enciende entera con su apartado y se apaga de golpe al arrancar la cámara.
- **Los fotogramas se descargan de golpe**: por capas, si faltaba el tramo que se estaba viendo, el dibujo se quedaba quieto y saltaba.
- **La portada no se ve doble**: el rótulo pintado de la pared queda a la derecha y se apaga con una sombra cálida, así solo se lee el logotipo.
- **Navegar no puede costar 2,5 s**: el viaje largo obligaba a esperar sin poder tocar nada y en móvil se hacía eterno. Ahora el enlace desenfoca, salta con la pantalla tapada y abre despacio, con el texto del destino entrando desenfocado y enfocándose. El fotograma se coloca de golpe (`colocarFotograma`), sin barrido de cámara.

### 3. ¿Dónde verlo en el código?

- `src/scripts/app.js:127` — `estadoPortal()`: el desenfoque empieza al irse el apartado (28 % del tramo) y se abre al llegar el siguiente (90 %).
- `src/scripts/app.js:300` — `actualizarPortal()`: mueve el radio del círculo y la intensidad del desenfoque.
- `src/scripts/app.js:235` — `actualizarFotos()`: la foto nítida se enciende con su apartado, nunca a medias.
- `src/scripts/app.js:190` — `precargar()` y `precargarAlrededor()`: los 240 fotogramas, de golpe, y los del entorno de la cámara al moverse.
- `src/styles/global.css:114` — `.portada__velo`: la sombra cálida sobre el rótulo pintado.
- `src/styles/global.css` (bloque «El círculo del cruce») — `.portal` y su máscara radial.
- `src/scripts/app.js` — `cruzarA()`: el cruce de los enlaces de la cabecera (entrada 0,46 s, espera 0,28 s, apertura 0,95 s, desenfoque máximo 10 px).

### 4. ¿Cómo comprobarlo?

1. Abrir `http://localhost:4321/?animar=1`.
2. Bajar despacio: en cada apartado se ve su foto nítida y su texto; al desaparecer el texto empieza el desenfoque, que cubre el recorrido y se abre con la escena siguiente.
3. Comprobar que no hay dos textos a la vez ni dos imágenes superpuestas en ningún punto.
4. Al final: la estatua entra con el último desenfoque (fotograma 228 de 239) y el apartado «Dónde estamos» aparece nítido con la dirección y el horario.
5. Pulsar «Comida» desde arriba: el fondo se desenfoca, salta y abre despacio con el texto ya entrando desenfocado. Tarda unos 1,7 s y se ve un solo apartado.

---
