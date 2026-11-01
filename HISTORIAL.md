# HISTORIAL — Web Bar El Jardín

Registro de tareas completadas. **Una entrada por tarea, añadida únicamente cuando el usuario responde «sí» a «¿Todo OK?».** Sin excepciones (AGENTS.md · REGLA 3).

Cada entrada lleva obligatoriamente los 4 puntos: **¿qué?**, **¿por qué?**, **¿dónde en el código?** y **¿cómo comprobarlo?**

---

## Índice

| # | Fecha | Tarea | Estado |
|---|---|---|---|
| T1 | 2026-11-01 | Documentación y plan de trabajo | ✅ Completada |

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
