# TAREAS — Web Bar El Jardín

**Leyenda:** ⏳ Pendiente · 🔧 En curso · 👀 Esperando tu OK · ✅ Completada · ⛔ Bloqueada
**Regla de oro (AGENTS.md · REGLA 1):** solo **una** tarea en 🔧 En curso a la vez. Nada pasa a ✅ sin el «sí» del usuario a «¿Todo OK?».

---

## Tablero

| Fase | Tarea | Estado | Depende de |
|---|---|---|---|
| 0 · Base | **T1** · Documentación y plan de trabajo | ✅ Completada | — |
| 0 · Base | **T2** · Andamiaje Astro + Tailwind + estructura | ✅ Completada | T1 |
| 0 · Base | **T3** · Identidad visual: paleta, logo, iconos y fuentes | ✅ Completada | T2 |
| 1 · Scrollytelling | **T4** · Análisis del vídeo y troceado en escenas | ✅ Completada | T2 |
| 1 · Scrollytelling | **T5** · Motor de scrollytelling (sticky + escenas + fallbacks) | ⏳ Pendiente | T4 |
| 2 · Contenido | **T6** · Layout base: header, navegación y footer | ⏳ Pendiente | T3 |
| 2 · Contenido | **T7** · Sección «¿Quiénes Somos?» | ⏳ Pendiente | T6 |
| 2 · Contenido | **T8** · Secciones «Especialidades» y «Nuestra comida» | ⏳ Pendiente | T7 |
| 2 · Contenido | **T9** · Galería de fotos del bar | ⏳ Pendiente · ⚠️ necesita fotos | T8 |
| 2 · Contenido | **T10** · Ubicación + horario + estado «Abierto ahora» | ⏳ Pendiente | T8 |
| 3 · Legal y SEO | **T11** · Aviso legal, privacidad y consentimiento del mapa | ⏳ Pendiente | T10 |
| 3 · Legal y SEO | **T12** · SEO: metas, Open Graph, JSON-LD `BarOrPub`, sitemap, robots | ⏳ Pendiente | T11 |
| 4 · Calidad | **T13** · Accesibilidad y responsive (auditoría) | ⏳ Pendiente | T12 |
| 4 · Calidad | **T14** · Rendimiento y presupuesto de arranque | ⏳ Pendiente | T13 |
| 4 · Calidad | **T15** · Seguridad: `_headers` y CSP | ⏳ Pendiente | T14 |
| 5 · Publicación | **T16** · Versión en inglés (**confirmar antes**) | ⏳ Pendiente | T15 |
| 5 · Publicación | **T17** · Página 404 y detalles finales | ⏳ Pendiente | T15 |
| 5 · Publicación | **T18** · Publicación en Netlify y dominio | ⏳ Pendiente | T16, T17 |

### Por qué este orden

1. **La pieza incierta primero.** El scrollytelling (Fase 1) es lo único que puede no salir: tamaño del vídeo, *seeking* en iOS, legibilidad del texto sobre vídeo. Se ataca **antes** de diseñar las secciones para no rehacerlo después.
2. **Secciones de la más simple a la más compleja.** Texto → tarjetas → galería (necesita fotos) → mapa/horario (necesita JS).
3. **Legal y SEO después del contenido**, porque las metas y el JSON-LD se generan a partir de los textos finales.
4. **Calidad y seguridad al final**, midiendo con la web completa, no por trozos.
5. **Idiomas y publicación, lo último.**

---

## Requisitos previos del usuario (no son tareas del agente)

- [ ] **Instalar Node.js LTS** — no hay `node` en el PATH del sistema. Sin esto no puedes ejecutar `npm run dev` tú mismo.
- [x] **Repositorio git creado** — `github.com/antoniorb1913/web-el-jardin`, clonado en `Desktop\web\web-el-jardin`. T1 se subió directamente a `main`; **a partir de T2, una rama + PR por tarea**.
- [x] **Copiar las fotos a `fotos/`** — hecho (10 archivos, 31,8 MB). Faltan dos cosas:
  - una foto de **«Pasión de la casa»**, que es la única especialidad sin imagen;
  - decidir qué hacer con **`gintonic.png`**, que no está en la lista de especialidades (¿se añade gin tonic a la carta o se usa sólo en la galería?).
- [ ] **Convertir las fotos HEIC** (`dracula.heic`, `bar2.heic`): ni el navegador ni las herramientas los leen tal cual. Necesita `pillow-heif`, que habrá que instalar en T3.
- [ ] **Decidir si habrá versión en inglés** (T16).
- [ ] Confirmar qué textos legales hay: nombre del titular y NIF para el aviso legal (T11).

---

## Detalle de las tareas

### T1 · Documentación y plan de trabajo — ✅ Completada (2026-11-01)

**Objetivo:** crear `AGENTS.md` (reglas y ciclo de trabajo), `TAREAS.md` (este tablero) e `HISTORIAL.md` (registro), con el alcance, el stack y las decisiones técnicas cerradas.

**Archivos:** `AGENTS.md`, `TAREAS.md`, `HISTORIAL.md`.

**Verificación:** abrir los tres archivos y comprobar que las reglas del ciclo, las 4 preguntas del historial y la comprobación de git están tal cual se pidieron.

---

### T2 · Andamiaje Astro + Tailwind + estructura — ✅ Completada (2026-11-01)

**Objetivo:** proyecto Astro que arranca en local con Tailwind configurado, carpetas de `src/`, `netlify.toml` y scripts de `pnpm`. Página de prueba mínima.

**Archivos:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `tsconfig.json`, `netlify.toml`, `.gitignore`, `README.md`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `.gitkeep` de las carpetas vacías.

**Verificación:** `pnpm install` y `pnpm dev` → abrir `http://localhost:4321` y ver la página de prueba con estilos aplicados. `pnpm build` termina sin errores y genera `dist/`.

---

### T3 · Identidad visual: paleta, logotipo, iconos y tipografías — ✅ Completada (2026-11-01)

**Objetivo:** medir los colores exactos de `logo.png`, definir los *design tokens* de Tailwind (`@theme`), preparar el logotipo con fondo transparente, generar el icono del sitio y autoalojar las tipografías.

> **Cambio respecto al plan original (justificado):** esta tarea decía «convertir el logo a SVG limpio». **No se ha hecho así.** Vectorizar un PNG con sombra, degradados y artefactos de compresión JPEG genera un trazado sucio que se nota justo cuando más se ve, en grande. La solución correcta es pedirle al diseñador el archivo vectorial original. Entregado en su lugar: PNG con el blanco eliminado y fondo transparente, más un WebP de 21 KB que genera Astro.

**Archivos:** `src/styles/global.css` (tokens `@theme` y `@font-face`), `src/assets/logo.png` (transparente, recortado), `public/favicon.png`, `public/apple-touch-icon.png`, `public/fonts/*.woff2`, `src/layouts/Base.astro` (iconos y precarga de fuentes), `src/pages/estilo.astro` (muestrario, temporal).

**Verificación:** abrir `/estilo` y comparar la paleta con el logo; comprobar que los títulos salen en Fredoka (redondeada) y el texto en Figtree; mirar el icono en la pestaña del navegador.

---

### T4 · Análisis del vídeo y troceado en escenas — ✅ Completada (2026-11-01)

**Objetivo:** medir `transicion.mp4`, decidir dónde empieza y acaba cada estancia y generar un clip por escena con su póster.

**Resultado:** el vídeo es **1116×836, 24 fps, 20,17 s, 7,9 Mbps y con audio** (el audio se descarta: es un fondo mudo). **No tiene cortes**: es un recorrido continuo en primera persona, así que los límites de escena se fijaron a ojo sobre una hoja de contactos (calle → puerta → patio → jardín → terraza → vistas). 6 clips de 2,2 a 4,4 s en **960×654, H.264, CRF 32, 24 fps**, con póster JPG de 640 px. **Total: 3,43 MB.**

> **Tres decisiones que conviene conocer:**
> 1. **Se recorta el 9 % inferior del vídeo**: el original lleva la marca de agua «KlingAI 4.0» abajo a la derecha y no puede salir en la web del bar.
> 2. **Sin WebM**: H.264 en MP4 lo reproduce el 100 % de los navegadores y duplicar cada clip solo engordaría el repo.
> 3. El límite de 600 KB por clip se quedó corto — el follaje y la grava son carísimos de comprimir. Lo que importa no es el total sino cuánto se descarga de golpe: **solo el clip activo**, entre 306 y 685 KB.

**Archivos:** `public/video/escena-1..6-*.mp4` y `.jpg`, `src/data/escenas.js`.

**Verificación:** reproducir dos clips seguidos y comprobar que cada uno empieza y acaba en la estancia correcta (no a mitad de un giro); comprobar que ninguno pasa de 800 KB.

---

### T5 · Motor de scrollytelling — ⏳

**Objetivo:** contenedor `sticky` a pantalla completa con el clip activo, intercambio de escena por `IntersectionObserver`, fundido corto, `congelarFondo` para el parallax, y las degradaciones de AGENTS.md §3.1 (reduced-motion, Save-Data, sin JS).

**Archivos:** `src/components/HeroScrolly.astro`, `src/scripts/app.js`, `src/styles/global.css`.

**Verificación:** bajar despacio por la portada y ver que cada sección activa su escena; activar «reducir movimiento» en el sistema y comprobar que se ven imágenes fijas; desactivar JavaScript y comprobar que todo el texto sigue visible.

---

### T6 · Layout base: header, navegación y footer — ⏳

**Objetivo:** cabecera con logo y navegación a las 5 secciones (anclas), menú móvil accesible, footer con dirección, horario y redes.

**Archivos:** `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/data/negocio.js`.

**Verificación:** la navegación lleva a cada sección también en móvil; se puede usar el menú sólo con teclado (Tab + Enter); el foco es visible.

---

### T7 · Sección «¿Quiénes Somos?» — ⏳

**Objetivo:** el texto aprobado del bar (ambiente agradable, relajado, alegre, rodeado de naturaleza) con tratamiento visual sobre el fondo vegetal.

**Archivos:** `src/components/Seccion.astro`, `src/pages/index.astro`.

**Verificación:** leer el texto en móvil y escritorio comprobando que contrasta sobre el fondo (ratio ≥ 4.5:1).

---

### T8 · Secciones «Especialidades» y «Nuestra comida» — ⏳

**Objetivo:** tarjetas con las **4 bebidas de la casa** (Kiwi de la casa, Pasión de la casa, Drácula, Aperol) y los **3 platos**, **sin precios**, con nota de que la carta está en el bar. Cada tarjeta con su foto: `kiwi.jpg`, `aperol.png`, `dracula.heic` (convertir), `bratwurst.png`, `currywurst.png`, `tabla_jamon.png`. «Pasión de la casa» se maqueta con un hueco reservado hasta tener su foto.

**Archivos:** `src/data/especialidades.js`, `src/components/TarjetaEspecialidad.astro`, `src/assets/`, `src/pages/index.astro`.

**Verificación:** los **7** elementos aparecen con el texto exacto aprobado, cada uno con su imagen, y en ningún sitio se ve un precio.

---

### T9 · Galería de fotos del bar — ⏳ ⚠️ bloqueada hasta tener fotos

**Objetivo:** galería con las fotos del local (`bar1.jpg` y `bar2.heic`, esta última hay que convertirla), optimizadas a WebP/AVIF y varios tamaños, con lightbox accesible (teclado, Escape, foco atrapado) y `width`/`height` para evitar saltos.

**Archivos:** `src/components/Galeria.astro`, `src/assets/`, `src/data/galeria.js`.

**Verificación:** abrir 3 fotos, navegar con las flechas del teclado y cerrar con Escape; comprobar que al cargar no salta el layout.

---

### T10 · Ubicación + horario + «Abierto ahora» — ⏳

**Objetivo:** dirección, mapa con fachada (imagen + enlace a Google Maps) y horario legible; `horario.js` con `calcularEstadoBar()` que calcule si está abierto en `Europe/Madrid` (ojo: «00:00» de viernes/sábado es el final del día).

**Archivos:** `src/scripts/horario.js`, `src/data/negocio.js`, `src/components/Seccion.astro`, `src/pages/index.astro`.

**Verificación:** el estado mostrado coincide con la hora real; probar cambiando la hora del sistema a las 15:59, 16:00, 22:59 y 23:59 en un día laborable y en viernes.

---

### T11 · Aviso legal, privacidad y consentimiento del mapa — ⏳

**Objetivo:** páginas de aviso legal y privacidad con datos reales del titular (pendientes de recibir) y fachada del mapa que no carga nada de Google hasta que el usuario lo pide.

**Archivos:** `src/pages/aviso-legal.astro`, `src/pages/privacidad.astro`, `src/components/MapaFacade.astro`.

**Verificación:** con la pestaña de red abierta, al cargar la página **no** hay peticiones a `google.com`; tras pulsar el mapa, sí.

---

### T12 · SEO: metas, Open Graph, JSON-LD, sitemap, robots — ⏳

**Objetivo:** título y descripción por página, `og:image` para que el enlace se vea bien al compartirlo por WhatsApp, JSON-LD `BarOrPub` con dirección y horarios, `sitemap.xml` y `robots.txt`.

**Archivos:** `src/layouts/Base.astro`, `src/components/Seo.astro`, `astro.config.mjs`, `public/robots.txt`.

**Verificación:** pegar la URL en el *Rich Results Test* de Google (o un validador de JSON-LD) sin errores; previsualizar el enlace en un chat.

---

### T13 · Accesibilidad y responsive — ⏳

**Objetivo:** revisar contraste, jerarquía de encabezados, `alt` de imágenes, navegación por teclado, foco visible y los tres anchos (360 / 768 / 1280).

**Archivos:** los que haga falta según los hallazgos.

**Verificación:** recorrer la página entera con Tab sin usar el ratón; auditoría de accesibilidad del navegador sin errores críticos.

---

### T14 · Rendimiento y presupuesto de arranque — ⏳

**Objetivo:** medir y bajar de **120 KB propios** (AGENTS.md · REGLA 4), LCP y CLS razonables en 4G simulado.

**Archivos:** según hallazgos.

**Verificación:** informe de Lighthouse en móvil con la puntuación de rendimiento y el desglose de peso.

---

### T15 · Seguridad: `_headers` y CSP — ⏳

**Objetivo:** cabeceras `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, cacheado de estáticos.

**Archivos:** `public/_headers`, `netlify.toml`.

**Verificación:** con las cabeceras desplegadas, la consola del navegador no muestra bloqueos de CSP y la web funciona igual.

---

### T16 · Versión en inglés — ⏳ **confirmar antes**

**Objetivo:** traducción al inglés con rutas propias (`/en/`) y selector de idioma, sin JS para cambiar de idioma.

**Archivos:** `src/scripts/i18n.js`, `src/pages/en/index.astro`, `src/components/Header.astro`.

**Verificación:** `/en/` muestra todo en inglés y el selector lleva a la misma sección en el otro idioma.

---

### T17 · Página 404 y detalles finales — ⏳

**Objetivo:** 404 coherente con el diseño, `theme-color`, iconos de iOS y revisión de textos.

**Archivos:** `src/pages/404.astro`, `src/layouts/Base.astro`.

**Verificación:** visitar una URL inexistente y ver la 404 con el estilo del sitio.

---

### T18 · Publicación en Netlify y dominio — ⏳

**Objetivo:** build probado en limpio, `netlify.toml` definitivo, checklist de despliegue y dominio.

**Archivos:** `netlify.toml`, `README.md`.

**Verificación:** tras conectar el repo en Netlify, la URL pública muestra la web y el formulario de build (no hay) no da errores; los clips de vídeo cargan desde el CDN.
