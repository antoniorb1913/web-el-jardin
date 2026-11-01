# Web Bar El Jardín

Web estática del **Bar El Jardín**, en Av. Antonio Segado del Olmo, 19 — Bolnuevo, Mazarrón (Murcia).

Hecha con **Astro + Tailwind CSS**. Compila a HTML plano, sin backend y sin base de datos, pensada para desplegarse en **Netlify**.

## Estado

Proyecto en construcción, por tareas. El plan completo está en [TAREAS.md](TAREAS.md) y las reglas de trabajo en [AGENTS.md](AGENTS.md). Lo ya terminado, en [HISTORIAL.md](HISTORIAL.md).

## Requisitos

- **Node.js 22 o superior.** Ahora mismo **no está instalado en el sistema**: instálalo desde <https://nodejs.org> (versión LTS).
- **pnpm**, el gestor de paquetes con el que se ha generado el lockfile. Con Node instalado:

  ```bash
  corepack enable
  ```

## Comandos

```bash
pnpm install      # instalar dependencias (solo la primera vez y al cambiar package.json)
pnpm dev          # servidor de desarrollo en http://localhost:4321
pnpm build        # generar el sitio estático en dist/
pnpm preview      # previsualizar lo que ha generado el build
```

## Estructura

```
├─ fotos/            material original del bar (NO se modifica nunca)
├─ transicion.mp4    vídeo original para el scrollytelling (NO se modifica)
├─ public/           archivos servidos tal cual (favicon, vídeo troceado, _headers)
└─ src/
   ├─ layouts/       Base.astro: el <html> de todas las páginas
   ├─ components/    piezas reutilizables (Header, Footer, HeroScrolly…)
   ├─ pages/         una página = una ruta
   ├─ data/          datos del negocio y de la carta en archivos .js
   ├─ scripts/       JS de cliente en módulos (app.js, horario.js, i18n.js)
   ├─ styles/        global.css (Tailwind + tokens de diseño)
   └─ assets/        copias optimizadas de las fotos
```

## Despliegue

Netlify lee `netlify.toml`: ejecuta `pnpm run build` y publica `dist/`. No hay variables de entorno ni funciones.

## Notas

- **No hay precios**: la carta se consulta en el bar.
- **No hay formularios** ni cookies de terceros; el mapa de Google se carga solo si el visitante lo pide (T11).
