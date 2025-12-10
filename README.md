# 📘 Notion MFE — Plataforma Modular con Microfrontends (Nx + React + Rspack + Module Federation)

Bienvenido a **Notion MFE**, una plataforma modular inspirada en Notion, construida utilizando **Microfrontends**, **Nx**, **React**, **Rspack**, y **Module Federation**.  
El objetivo del proyecto es demostrar una arquitectura escalable, desacoplada y mantenible, donde cada módulo puede evolucionar de forma independiente.

---

## 🚀 Tecnologías Principales

- **Nx Workspace** → Monorepo y orquestación de builds/serve
- **React 18**
- **Rspack** → Bundler ultrarrápido compatible con Module Federation
- **Webpack Module Federation** → Carga remota de microfrontends
- **Zustand** → Estado global compartido entre remotes
- **TailwindCSS** → Estilos modernos y rápidos
- **TypeScript**

---

## 🏗️ Arquitectura del Proyecto

```
mfe-notion/
│
├── apps/
│ ├── shell/ → Host principal
│ ├── workspace/ → MFE: administración de páginas
│ ├── notes/ → MFE: editor de contenido estilo Notion
│ ├── tasks/ → MFE: tablero Kanban
│ └── calendar/ → MFE: planificación mensual
│
├── shared/
│ ├── ui/ → Componentes reutilizables (Button, Input, Modal, Switch…)
│ ├── store/ → Zustand con estado global compartido
│ ├── theme/ → Paleta dinámica Light/Dark y hook useThemeColor
│ └── index.ts → Barrel file exportable vía Module Federation
│
└── module-federation.config.ts
```

---

## 🧩 Microfrontends

### 🟦 Shell (Host)

Controla navegación, tema global y carga dinámica de remotes.

### 🟩 Workspace

Gestión de páginas: crear, renombrar, seleccionar, buscar.

### 🟨 Notes

Editor estilo Notion sincronizado en tiempo real.

### 🟪 Tasks

Tablero Kanban con **drag & drop entre columnas**.

### 🟧 Calendar

Calendario con creación de notas o tareas por día o rango.

---

## 🎨 Tema Dinámico (Light/Dark)

El sistema usa una paleta compartida y `useThemeColor()` para adaptar todos los remotes de forma sincronizada.

---

## 🧰 Scripts Útiles

```bash
# 🟦 1) Levantar todos los remotos en paralelo (NO incluye el shell)
npm run dev:remotes

# 🟧 2) Levantar el shell con remotos cargados dinámicamente
npm run dev:shell

# 🟨 3) Levantar el shell solo (sin forzar carga dinámica)
npm run shell

# 🟩 4) Levantar un remote individualmente
npm run workspace
npm run notes
npm run tasks
npm run calendar
```

### 📌 Explicación rápida

| Script                     | ¿Qué hace?                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev:remotes`      | Levanta **solo los remotos** (workspace, notes, tasks, calendar).                    |
| `npm run dev:shell`        | Levanta **el shell**, cargando los remotos dinámicamente usando `NX_MF_DEV_REMOTES`. |
| `npm run shell`            | Levanta **solo el shell**, sin forzar carga dinámica.                                |
| `npm run workspace` (etc.) | Levanta un remote individual para desarrollo aislado.                                |

---

## 📦 Instalación

```bash
npm install
npm run shell
```

## 🌐 Ejecución

El host se levanta en:

```bash
  http://localhost:4200
```

Los remotes se exponen en:

```bash
  http://localhost:4201  (notes)
  http://localhost:4202  (workspace)
  http://localhost:4203  (tasks)
  http://localhost:4204  (calendar)
```

---

## 🧪 Objetivo del Proyecto

Simular un entorno profesional de microfrontends donde:
• Cada equipo podría trabajar en su propio remote
• Los remotes pueden desplegarse por separado
• El shell orquesta todo
• El estado global asegura sincronización entre apps

---

## 📜 Licencia

Proyecto educativo. Sin restricciones.
