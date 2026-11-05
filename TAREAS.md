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
| 1 · Scrollytelling | **T5** · Motor de scrollytelling (sticky + escenas + fallbacks) | ✅ Completada | T4 |
| 2 · Contenido | **T6** · Layout base: header, navegación y footer | ✅ Completada | T3 |
| 2 · Contenido | **T7** · Sección «¿Quiénes Somos?» | ✅ Completada | T6 |
| 2 · Contenido | **T8** · Secciones «Especialidades» y «Nuestra comida» | ✅ Completada | T7 |
| 2 · Contenido | **T9** · Galería de fotos del bar | 🔧 En curso | T8 |
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

### T4 · Análisis del vídeo y troceado en escenas — ✅ Completada (2026-11-01, revisada con los originales)

**Objetivo:** medir `transicion.mp4`, decidir dónde empieza y acaba cada estancia y generar un clip por escena con su póster.

**Resultado (revisado con los clips originales):** el material real son **4 clips de 5,04 s** (1116×836, 24 fps, ~8 Mbps) y `transicion.mp4` es su unión. Por tanto los cortes buenos están en **5,04 / 10,08 / 15,12 s**, no donde se supuso la primera vez. Se respetan esos cuatro cortes (calle → patio → jardín → terraza) y se codifica a **1116×760 —resolución nativa—, H.264 CRF 26, 24 fps, 4,2 s por clip** (se recortan 0,4 s por extremo). **Total: 7,3 MB**, entre 1,5 y 2,0 MB por clip.

> **Qué se corrigió:** la primera versión partía el vídeo en 6 trozos de 2-4 s cortando *por dentro* de las escenas del autor, y bajaba la resolución a 960 con CRF 32. Se veía blando y los cortes no coincidían con nada. Ahora no se reescala y los cortes son los del material original.
> **Qué se mantiene:** el recorte del 9 % inferior para quitar la marca de agua del generador y la decisión de no generar WebM.
> **Coste:** son clips más pesados (1,5-2 MB frente a 0,3-0,7 MB). Se compensa en T5: primero se pinta el póster de 60-90 KB y el vídeo solo se descarga cuando su sección se acerca.

**Archivos:** `clips-originales/escena1-4.mp4` (material de partida), `public/video/escena-1..4-*.mp4` y `.jpg`, `src/data/escenas.js`, `src/pages/escenas.astro` (visor temporal).

**Verificación:** reproducir dos clips seguidos y comprobar que cada uno empieza y acaba en la estancia correcta (no a mitad de un giro); comprobar que ninguno pasa de 800 KB.

---

### T5 · Motor de scrollytelling — ✅ Completada (2026-11-01)

**Objetivo:** fondo que recorre el bar al hacer scroll, con el contenido apareciendo y desvaneciéndose sin moverse de sitio.

**Lo que hay:**
- **240 fotogramas AVIF** (`public/fondo/`, 1000 px, 6,7 MB) dibujados en un `<canvas>` según el scroll. Sin `<video>`: no depende del autoplay.
- **Modo ligero** en móvil, ahorro de datos o 2G: 120 fotogramas (3,3 MB).
- **Carga por capas** (10 fotogramas primero, ≈290 KB) e **inercia** en el avance.
- **Un fotograma por repintado**, sin fundidos: producían fantasma.
- **Paradas de cámara al principio de cada cuarto** (`PAUSA = 0.26`): la cámara se queda quieta el 26 % de cada tramo. Se probó a atarlas a los centros de los apartados; el reparto quedaba desigual y se revirtió.
- **Cinco fotos nítidas** (`public/escenas/`, WebP 2400 y 1200 px) en los fotogramas 0, 60, 120, 180 y 239.
- **Paneles de texto** fijos en el centro, con tramos entre ellos en los que solo se ve el bar.
- **Degradaciones**: `prefers-reduced-motion` → fotograma fijo; sin JS → texto íntegro en el HTML.

**Dónde se enciende cada foto:**

| Fotograma | Foto | Momento |
|---|---|---|
| 0 | Fachada | Portada |
| 60 | Entrada | Arranque del segundo cuarto |
| 120 | Patio | Arranque del tercero |
| 180 | Terraza | Arranque del cuarto |
| 239 | Estatua | Final del recorrido |

> El texto de cada apartado se rige por su sección y la foto por el fotograma, así que
> no siempre coinciden al píxel: el texto puede entrar cuando la foto ya lleva un rato
> encendida. Es el compromiso que se eligió tras probar el anclaje exacto, que dejaba
> el recorrido desigual.

**Números finales:**

| Concepto | Valor |
|---|---|
| Recorrido | 15 pantallas (`min-h-[300dvh]` por sección) |
| Velocidad media por tramo | 45 px de scroll por fotograma (≈25 mientras camina) |
| Peso del fondo | 6,7 MB escritorio · 3,3 MB móvil |
| Carga inicial | ≈290 KB de fotogramas + la primera foto |

**Cómo se ajusta:**
- Velocidad general → `min-h-[300dvh]` en `index.astro`.
- Rato nítido → `PAUSA` en `app.js` (subirlo acelera la animación).
- Reparto texto/foto → `FOTOGRAMAS_ANCLA` en `app.js`.

**Pendiente para T9:** en las fotos de la terraza y la estatua se lee la pizarra de precios del bar. Decidir si se recorta o se elige otro encuadre (REGLA: sin precios en la web).

**Verificación:** bajar despacio y comprobar que cada apartado aparece **a la vez** que su imagen nítida; que no hay doble imagen; que entre apartados solo se ve el bar; y que al final está la estatua nítida con la dirección.

---

### T6 · Layout base: header, navegación y cierre — ✅ Completada

**Objetivo:** cabecera con el logotipo y navegación a los 5 apartados, menú móvil accesible, y el pie **dentro** de la película como última escena.

**Lo que hay:**
- **`src/data/negocio.js`**: nombre, lema, dirección, horarios, enlace a Google Maps y lista de apartados. Única fuente de estos datos.
- **Cabecera fija** sobre la película: **el logotipo** a la izquierda (sin repetir el nombre en texto) y los cinco apartados a la derecha, sobre un velo que los hace legibles. Sin tarjetas ni sombras de caja; el ámbar del logo se reserva para el foco y el hover.
- **La cabecera no se ve en la primera pantalla**: allí manda el logotipo grande de la portada y dos a la vez sería ruido. Aparece al salir del héroe y se retira al llegar a un pie claro (en las páginas que lo tengan).
- **Índice a pantalla completa** por debajo de 860 px: mismo listado, más la dirección y el horario al pie. Abre con el botón, cierra con «Cerrar», con Escape o al elegir un apartado; el foco entra en el primer apartado, no escapa del panel y vuelve al botón al cerrar; la página de debajo no hace scroll.
- **Cruce al pulsar un apartado**: la cabecera **no recorre la página**. El fondo se
  desenfoca (0,46 s), se salta al apartado con la pantalla tapada, se mantiene tapado un
  respiro (0,28 s) y se abre despacio (0,95 s) mientras el texto del destino entra
  desenfocado y se enfoca. Total ~1,7 s. El fotograma se coloca de golpe, sin barrido de
  cámara. Con `prefers-reduced-motion` el salto es directo, sin animación; `?animar=1`
  fuerza la animación.
- **Cinco apartados, cinco paradas**: «Quiénes somos» va con el logo en la portada, así que la página
  queda en portada, especialidades, comida, fotos y dónde estamos. Cada uno cae en una de las cuatro
  paradas de cámara o en el final, donde está la estatua, y en todas se enciende su foto nítida. El
  mapa APARECE_EN de pp.js es la única lista que hay que tocar para moverlos.
- **Cierre dentro de la película**: el pie ya no es un bloque aparte debajo de la animación. Es la última escena, sobre el fotograma de la estatua: «Dónde estamos», la dirección en dos líneas, el horario en dos filas con su raya, «Cómo llegar» con subrayado ámbar y la línea de copyright. `Base.astro` acepta `pie={false}` para no repetirlo.
- **Enlace «Saltar al contenido»** y foco visible en toda la web (anillo oscuro con halo ámbar: se ve igual sobre crema que sobre foto).
- El JS se arranca desde `Base.astro`, único punto de entrada.
- **El cruce entre escenas**: al irse el texto, un círculo nace pequeño en el centro y crece
  desenfocando el fondo (`backdrop-filter` + máscara radial), de modo que el viaje de la cámara
  queda tapado y la escena siguiente entra nítida. Son cuatro cruces, uno por tramo, y empiezan
  en cuanto desaparece su apartado (28 % del tramo) y se abren al llegar el siguiente (90 %).
- **Los 240 fotogramas se descargan de golpe** al entrar. Antes iban por capas y, si faltaba el
  tramo que se estaba viendo, el dibujo se quedaba quieto y luego saltaba.
- **La foto nítida se enciende con su apartado y se apaga al arrancar la cámara**, nunca a medias:
  la foto y el fotograma son imágenes distintas de la misma escena y mezclarlas deja dos paredes
  superpuestas. La del cierre entra con el último desenfoque, en el fotograma 228 de 239.

**Archivos:** `src/data/negocio.js` (nuevo), `src/components/Header.astro` (nuevo), `src/components/Footer.astro` (para las páginas que sí llevan pie al final), `src/layouts/Base.astro`, `src/pages/index.astro`, `src/scripts/app.js`, `src/styles/global.css`, `src/components/HeroScrolly.astro`.

**Verificación:**
1. Arriba del todo la cabecera **no** se ve: solo el logotipo grande de la portada.
2. Al bajar una pantalla aparece la cabecera con el logotipo y los cinco apartados.
3. Desde otra posición, pulsar «Especialidades»: la cámara recorre el bar **sin que aparezcan los textos** de los apartados intermedios, y al llegar se enciende solo el de destino. Lo mismo hacia atrás.
4. Con el teclado: Tab hasta los enlaces y Enter para activarlos; el foco se ve siempre.
5. En ventana estrecha (< 860 px): los enlaces se esconden y aparece «Índice»; al abrirlo el foco entra en «Quiénes somos», Escape lo cierra y devuelve el foco al botón.
6. Bajar hasta el final: el cierre aparece **sobre** el último fotograma, sin bloque aparte debajo.
7. `?animar=1` sigue funcionando y el fondo recorre el bar.

**Pendiente (no es de esta tarea):**
- Redes sociales: no se han puesto porque no se han facilitado las cuentas.
- ~~El logotipo grande de la portada cae encima del rótulo pintado «JARDÍN» de la pared.~~ Resuelto: en la portada la mitad derecha se oscurece con una sombra cálida, así solo se lee un «JARDIN».

---

### T7 · Sección «¿Quiénes Somos?» — ✅

**Objetivo:** el texto aprobado del bar (ambiente agradable, relajado, alegre, rodeado de naturaleza) con tratamiento visual sobre el fondo vegetal.

**Archivos:** `src/components/Seccion.astro`, `src/pages/index.astro`, `src/styles/global.css`, `src/scripts/app.js`, `public/fonts/chorus.woff2`.

**Lo que quedó:**
- **Portada**: la foto entera, sin bandas, y un **bloque pequeño** abajo a la izquierda sobre una línea fina: nombre, titular y párrafo. La foto manda y la tipografía susurra. El bloque mide lo que mide el texto, para que la línea acabe donde acaba el párrafo.
- **Titular aprobado**: «Un paraíso en Bolnuevo», en dos líneas, la segunda en peso 300 y un punto más apagada.
- **Caligráfica de la carta**: TeX Gyre Chorus (clon libre de la cancilleresca del menú impreso) en los cinco títulos de apartado, con trazo de 0,3 px. Autoalojada, 14 KB.
- **Zona de agarre**: 160 px de scroll en cada apartado sin que se mueva nada; el texto se funde después a lo largo de otros 300.
- **Menos scroll**: las secciones pasan de 300dvh a 250dvh (de 12 a 10 pantallas), y el recorrido termina al 96 % de la página para que el final no dé un salto al tocar fondo.
- **El cierre** ya no se ve doble: la foto de la estatua entra con el desenfoque a tope y el último tramo no se abre hasta que la cámara llega al fotograma 239.

**Verificación:**
1. Contraste medido sobre la foto: nombre 5,1:1 · titular 11,9:1 · párrafo 8,3:1 · pie 4,8:1.
2. El bloque no se descuadra en móvil (390 px) ni en escritorio (1440 px).
3. Los cinco títulos de apartado se ven en la caligráfica.
4. Bajar hasta el final: la estatua queda nítida y los últimos 360 px no cambian nada.

---

### T8 · Secciones «Especialidades» y «Nuestra comida» — ✅

**Objetivo:** la carta del bar —**5 bebidas** y **3 platos**, sin precios— con sus fotos.

**Archivos:** `src/data/carta.js`, `src/components/Carta.astro`, `src/scripts/carrusel.js`,
`src/styles/global.css`, `src/pages/index.astro`, `public/productos/`.

**Lo que quedó:**
- **Una tira horizontal** por apartado: el título arriba, las tarjetas en medio (se ven tres y
  pico) y abajo la barra de progreso con las flechas.
- **El bloque entero mide lo mismo**: título, tira y barra van de la primera foto a la
  última; nada ocupa la pantalla de lado a lado.
- **Se arrastra, se mueve con las flechas** (660 ms con curva de entrada y salida) **y con el
  trackpad**; el enganche se apaga mientras dura el movimiento.
- **Al pasar el cursor** crece el cuadrado (+4 % en 0,8 s), la foto se acerca dentro (+7 % en
  1,6 s), sube un velo cálido y el nombre se enciende en ámbar con un filete que se dibuja.
  Con movimiento reducido el cuadrado crece un 2 % y la foto un 3 %: se nota igual.
- **«Pasión de la casa» sin foto**: su tarjeta lleva el verde de la baldosa y la «J» del
  logotipo, para que se lea como decisión y no como imagen rota.
- **Sin precios y sin descripciones inventadas**: solo el nombre y «La carta completa, en el
  bar.»

**Fotos:** siete a WebP en dos tamaños (860 y 430 px), recortadas a 3:4 por el centro.
**1,75 MB** las catorce piezas, desde 16,6 MB de PNG originales.

**Verificación:**
1. Los **8** nombres aparecen escritos igual que en `AGENTS.md`.
2. `document.body.innerText` no contiene ningún importe: comprobado.
3. La flecha derecha desplaza una tarjeta con curva suave (medido: 1 → 14 → 48 → 194 → 339 → 373).
4. La barra de progreso se rellena al 60 % en escritorio (lo que cabe en pantalla).
5. En móvil las tarjetas miden 62vw y el carril no se sale de la pantalla.

---

### T9 · Galería de fotos del bar — 🔧 En curso

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
