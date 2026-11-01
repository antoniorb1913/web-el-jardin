# AGENTS.md — Reglas del proyecto «Web Bar El Jardín»

> Documento de instrucciones permanente. **Se lee entero antes de tocar nada, en cada tarea.**
> Si algo de aquí choca con una petición puntual del usuario, gana el usuario, pero se avisa y se actualiza este archivo.

---

## 0. Cómo se trabaja aquí

Eres el agente que construye la web de un **bar familiar**. Trabajas **una tarea a la vez**, con confirmación humana entre tareas. No eres autónomo: el usuario aprueba cada paso. El ciclo completo está en **REGLA 1** y no se salta nunca.

---

## 1. El negocio (datos reales — no inventar otros)

| Dato | Valor |
|---|---|
| Nombre | **Bar El Jardín** |
| Concepto | «Un paraíso de flores y plantas»: bar rodeado de naturaleza, ambiente agradable y relajado, sin dejar de lado pasar un rato alegre |
| Dirección | Av. Antonio Segado del Olmo, 19 — **Bolnuevo, Mazarrón (Murcia)** |
| Horario | Domingo a jueves: **16:00 – 23:00** · Viernes y sábado: **16:00 – 00:00** |
| Zona horaria | `Europe/Madrid` (fijar explícitamente, nunca la del navegador) |

**Especialidades (bebidas de la casa):** Kiwi de la casa · Pasión de la casa · **Drácula** · **Aperol**.

> Cambio del 2026-11-01: «Especial Jardín» pasa a llamarse **Drácula**, y se añade **Aperol**. Hay foto de las cuatro menos de «Pasión de la casa», que sigue pendiente.

**Comida:** Salchicha bratwurst · Salchicha currywurst · Tabla de jamón serrano de Teruel.

> ⚠️ **Sin precios en la web.** El usuario lo decidió: la carta se consulta en el propio bar. Está prohibido inventar precios, horarios distintos a los de la tabla o textos que prometan servicios no confirmados (reservas, terraza, wifi, mascotas…).

---

## 2. Fuera de alcance (no se construye, no se propone sin que lo pidan)

- Formularios de contacto, reservas o newsletter.
- Backend, base de datos, login, pagos, carrito, API propia.
- CMS o panel de administración.
- Precios o carta con importes.
- Analítica de terceros y cookies de marketing.

---

## 3. Stack decidido (REGLA 2)

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Astro** (salida 100 % estática) | Da componentes, layouts y dev server, pero compila a HTML plano con **0 KB de JS de framework** |
| Estilos | **Tailwind CSS** | Utilidades, sin CSS muerto, coherente con el diseño |
| JS de cliente | **JS vanilla en módulos** (`src/scripts/`), sin dependencias | Regla de eficiencia: nada de librerías para cosas de 20 líneas |
| Contenido | Archivos de datos en `src/data/*.js` | Cambiar un horario o un plato = editar un archivo |
| Hosting | **Netlify** (plan gratuito) | Deploy estático automático, `_headers`, HTTPS y CDN gratis |
| Vídeo | **ffmpeg** para análisis y troceado en escenas | El original (`transicion.mp4`) no es apto para web tal cual |
| Mapas | **Fachada con imagen + enlace**, no iframe directo | Sin cookies de terceros antes del consentimiento (AEPD/LOPDGDD) ni coste de LCP |

**Descartado y por qué:** Angular / React / Next → convierten la web en una aplicación: 120-200 KB de JS mínimo, HTML vacío en el primer byte, previews pobres al compartir por WhatsApp y mantenimiento de dependencias sin necesidad. Ver `HISTORIAL.md` cuando se registre la decisión.

### 3.1 Scrollytelling (la decisión técnica central)

El usuario quiere el vídeo de fondo y que **cada cambio de escena acompañe a una sección** («por cada parón o cambio de escena se verán las cosas»).

**Planteamiento aprobado:**

1. El vídeo original (20 s, 19,8 MB) **se trocea en clips de una escena cada uno** (≈3-6 clips de 1-3 s). Un solo archivo de 20 MB es inviable en móvil y no permite control fino.
2. En la portada, el vídeo va en un contenedor **`position: sticky`** a pantalla completa. Las secciones (`¿Quiénes Somos?`, `Especialidades`, `Comida`, `Fotos`, `Ubicación`) **flotan por encima** con paneles semitransparentes para que el texto siempre se lea.
3. Un `IntersectionObserver` detecta qué sección está activa e **intercambia el clip** con un fundido corto. Así «la escena cambia cuando llega la sección», no de forma aleatoria.
4. `requestAnimationFrame` sólo para el parallax/zoom suave de entrada y salida (`congelarFondo`), nunca en bucle infinito.
5. **Degradación obligatoria** (esto es calidad, no un extra):
   - `prefers-reduced-motion: reduce` → imagen estática por escena, cero vídeo.
   - `Save-Data` o pantalla pequeña con `prefers-reduced-data` → clips ligeros o imagen.
   - Ningún texto depende del vídeo: si no carga, la web es 100 % usable.
   - `playsinline muted loop preload="none"` + `poster` en cada clip.

> **Nunca** se hace *scrub* de `video.currentTime` ligado al scroll: en iOS Safari el *seek* continuo va a tirones y en Android de gama baja ni responde. Por eso el cambio es **por escena**, no por frame.

---

## 4. Estructura de carpetas prevista

```
web-el-jardin/               ← raíz del repo (github.com/antoniorb1913/web-el-jardin)
├─ AGENTS.md · TAREAS.md · HISTORIAL.md · README.md
├─ astro.config.mjs · package.json · netlify.toml
├─ fotos/                    ← originales del usuario. NUNCA se tocan ni se borran
│  └─ logo.png               ← el logo original vive aquí dentro
├─ transicion.mp4            ← vídeo original. NUNCA se sobrescribe
├─ public/
│  ├─ _headers               ← cabeceras de seguridad (CSP incluida)
│  ├─ robots.txt · favicon.svg
│  └─ video/                 ← clips ya troceados y comprimidos
└─ src/
   ├─ layouts/Base.astro
   ├─ components/  (Header, Footer, HeroScrolly, Seccion, TarjetaEspecialidad, Galeria)
   ├─ pages/       (index, aviso-legal, privacidad, 404)
   ├─ data/        (negocio.js, especialidades.js, escenas.js)
   ├─ scripts/     (app.js, horario.js, i18n.js)
   ├─ styles/global.css
   └─ assets/      ← copias optimizadas de las fotos
```

Los archivos originales del usuario se tratan como **sólo lectura**: se copian y se optimizan, nunca se modifican in situ.

---

## 5. REGLA 1 — El ciclo de trabajo (no se salta nunca)

Cada tarea, una vuelta completa:

1. **Leer** este `AGENTS.md` y `TAREAS.md`. Elegir la siguiente tarea pendiente **por orden**. Si conviene cambiar el orden, **justificarlo** al usuario antes de empezar.
2. Marcar la tarea como **🔧 En curso** en `TAREAS.md`.
3. **Implementar solo esa tarea.** Prohibido colar cambios de otras tareas en el mismo trabajo.
4. Informar al usuario con:
   - qué se ha hecho,
   - qué archivos se han tocado,
   - cómo comprobarlo paso a paso, en lenguaje claro,
   - y la pregunta literal: **«¿Todo OK?»**
5. **Parar y esperar.** No se avanza a la siguiente tarea bajo ningún concepto.
6. Cuando el usuario responde **«sí»**:
   - comprobar que todo está bien subido e informar de lo que falte (ver **REGLA 6**),
   - marcar **✅ Completada** en `TAREAS.md`,
   - añadir la entrada correspondiente en `HISTORIAL.md`,
   - indicar qué subir a GitHub (rama propuesta, mensaje de commit y archivos) y cuándo hacerlo.
7. Si el usuario dice que algo falla: volver al paso 3, corregir y repetir el paso 4. La tarea **no** se marca ✅.

**Estados posibles en `TAREAS.md`:** ⏳ Pendiente · 🔧 En curso · 👀 Esperando tu OK · ✅ Completada · ⛔ Bloqueada.

> Al terminar de implementar (paso 4) la tarea queda en **👀 Esperando tu OK**, no en ✅.

---

## 6. REGLA 3 — Documentación

### `TAREAS.md`
- Lista viva de tareas, agrupadas por fases, con **dependencias explícitas**.
- **Solo una** tarea en 🔧 En curso a la vez.
- Una tarea pasa a ✅ **únicamente** con el «sí» del usuario.

### `HISTORIAL.md` — registro obligatorio
**Recordar siempre:** al terminar una tarea y recibir el «sí», se registra en `HISTORIAL.md`. **Sin excepciones.**

Cada entrada lleva obligatoriamente estos 4 puntos:

1. **¿Qué he realizado?** — una o dos frases, sin jerga innecesaria.
2. **¿Por qué?** — el problema que resolvía o el beneficio.
3. **¿Dónde verlo en el código?** — rutas y líneas concretas (`js/app.js:120`).
4. **¿Cómo comprobar que funciona?** — pasos reproducibles.

Formato exacto:

```markdown
## AAAA-MM-DD · Tn — Título de la tarea

**Estado:** ✅ Completada
**Rama:** `tipo/tn-descripcion`
**Commit:** `fix: mensaje`
**Archivos:** `ruta/a.js`, `ruta/b.css`

### 1. ¿Qué he realizado?

### 2. ¿Por qué?

### 3. ¿Dónde verlo en el código?

### 4. ¿Cómo comprobar que funciona?
```

---

## 7. REGLA 4 — Calidad del código

### Seguro
- **CSP estricta posible**: cero `onclick`/`onload` inline, cero `<style>` inline, cero `eval`, cero `document.write`, cero `innerHTML` con datos.
- Todo texto dinámico va con **`textContent`**.
- Enlaces externos: siempre `rel="noopener noreferrer"` y `target="_blank"`.
- Acceso a `localStorage` siempre con `try/catch` (si el navegador lo bloquea, la página debe seguir funcionando). *Nota: en este proyecto no está previsto usar `localStorage`; la regla se mantiene por si hiciera falta.*
- **Sin dependencias de terceros servidas desde CDN** (fuentes y scripts, autoalojados).
- Cabeceras de seguridad en `_headers`.

### Eficiente
- Nada de librerías para resolver algo que cabe en 20 líneas.
- Imágenes optimizadas y con `width`/`height` (sin saltos de layout).
- Solo los pesos de fuente que se usan de verdad.
- Animaciones que no disparen layout/paint innecesarios; `requestAnimationFrame` y `ResizeObserver` donde haga falta.
- **Presupuesto de arranque: < 120 KB propios** (sin contar fuentes, vídeo ni fotos) y primera pintura útil rápida en 4G.

### Refactorizado y estructurado
- Una responsabilidad por función; funciones cortas y **con nombre en español** (`calcularEstadoBar`, `congelarFondo`), manteniendo el estilo del código actual.
- Sin código muerto, sin variables huérfanas, sin duplicación de strings.
- Sin variables globales sueltas: encapsular en un namespace o en módulos.
- Comentarios **en español**, explicando **por qué**, no qué.
- **Sin dependencias circulares** entre `i18n.js`, `horario.js` y `app.js`. El arranque se centraliza en `app.js` dentro de `DOMContentLoaded`.

---

## 8. REGLA 5 — Git y GitHub

- La gestión de Git y GitHub **la hace el usuario**. El agente **NO ejecuta comandos de git** (`git init`, `add`, `commit`, `push`, `branch`, `merge`, `gh`), ni toca `.git/config`, ni crea repos, ni abre PRs.
- Cuando una tarea queda completada, el agente indica:
  1. **Cuándo** subirla: siempre después del «sí» a «¿Todo OK?» y antes de empezar la siguiente.
  2. **Qué archivos** entran en el commit.
  3. **Nombre de rama** propuesto.
  4. **Mensaje de commit** (Conventional Commits: `feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`).
  5. **Descripción breve para el Pull Request.**
- Ramas: `tipo/tn-descripcion-corta` → PR a `main`. **Una rama y un PR por tarea.**
- Nunca proponer `git push --force` ni commits directos a `main`.

---

## 9. REGLA 6 — Comprobación obligatoria al recibir «sí» (§7.1)

Cada vez que el usuario responda **«sí»** a «¿Todo OK?», el agente comprueba que todo está bien subido y avisa de lo que falte. **Sin excepciones.** Se revisa, en este orden:

1. **Rama actual (HEAD)** y si es la que corresponde a la tarea.
2. **Archivos rastreados por git** frente a los que hay en disco: si un archivo de la tarea existe pero no está rastreado, falta `git add` (el error más común).
3. **Cambios sin comitear**: si un archivo rastreado tiene fecha de modificación posterior a la de `.git/index`, probablemente no está comiteado.
4. **Commits sin subir**: si la rama local apunta a un commit que `origin/` no tiene, falta `git push`.
5. **PR y merge**: si la rama de la tarea existe en `origin` y si `main` ya la ha incorporado; y si `main` local apunta al mismo commit que `origin/main`.
6. **Registro incluido**: que `TAREAS.md` (✅) y `HISTORIAL.md` (entrada con los 4 puntos) formen parte de **lo subido**, no solo del disco.

Se informa con esta tabla:

| Comprobación | Estado |
|---|---|
| Rama de la tarea subida | ✅ / ⚠️ |
| Archivos de la tarea rastreados | ✅ / ⚠️ |
| PR mergeado en main | ✅ / ⚠️ |
| main local al día | ✅ / ⚠️ |
| Tablero e historial incluidos | ✅ / ⚠️ |

Si algo está ⚠️, el agente dice **exactamente qué comando falta** y no da la tarea por subida.

**Cómo lo comprueba sin ejecutar git** (la gestión de git sigue siendo del usuario): leyendo en **solo lectura** los metadatos de `.git/` — `HEAD`, `refs/`, `packed-refs`, `logs/HEAD` e `index`. Nunca escribe nada ahí. Si el usuario prefiere, puede pegar el resultado de `git status` y el agente lo usa como fuente.

---

## 10. Entorno de trabajo (comprobado el 2026-11-01)

| Cosa | Estado |
|---|---|
| Node.js en el PATH del sistema | ❌ No instalado. El agente usa el runtime incluido: `C:\Users\GIGABYTE-PC\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe` y `pnpm` en `…\dependencies\pnpm\bin\pnpm.mjs` |
| ffmpeg / ffprobe | ❌ No instalado en el sistema. Para T4 se usará un binario empaquetado (dev-only, no viaja al sitio) |
| Repositorio git | ✅ `github.com/antoniorb1913/web-el-jardin`, clonado en `Desktop\web\web-el-jardin`. `main` = `a2482f7` (T1). Los assets grandes siguen **sin rastrear** |
| Node/pnpm del agente | `node v24.21.0` · `pnpm 11.7.0` (runtime incluido; **no hay `node` ni `npm` en el PATH**) |
| Carpeta de fotos | ✅ `fotos/` con **10 archivos, 31,8 MB**: `kiwi.jpg`, `aperol.png`, `dracula.heic`, `gintonic.png`, `bratwurst.png`, `currywurst.png`, `tabla_jamon.png`, `bar1.jpg`, `bar2.heic` y una copia de `logo.png` |
| Fotos en **HEIC** | ⚠️ `dracula.heic` y `bar2.heic` son de iPhone. Ni el navegador ni Pillow las leen tal cual: hay que convertirlas a JPEG antes de usarlas (`pillow-heif`, todavía no instalado) |
| Huecos de material | Falta foto de **«Pasión de la casa»**; y `gintonic.png` no corresponde a ninguna especialidad de la lista |
| `transicion.mp4` | 20 s · 19,8 MB · resolución pendiente de medir (T4) |
| `logo.png` | 1052 × 467 px · 378 KB · fondo blanco, sin transparencia |

**Recomendación al usuario:** instalar Node.js LTS para poder ejecutar `npm run dev` por su cuenta; el agente puede levantar el *dev server* con el runtime incluido, pero conviene que no dependa de él.

---

## 11. Qué NO hace el agente

- No ejecuta git ni `gh`, ni crea repositorios, ni toca `.git/`.
- No inventa precios, horarios, teléfonos ni textos legales con datos del titular.
- No sube nada a Netlify en nombre del usuario sin pedirlo explícitamente.
- No modifica los archivos originales (`transicion.mp4`, `logo.png`, `fotos/`).
- No avanza de tarea sin el «sí» explícito.
