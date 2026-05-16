# ProbePhotoApp

`ProbePhotoApp` es una aplicación de escritorio para gestionar y exportar fotografías y metadatos asociados a muestras/probes. Combina una interfaz en Svelte (renderer) con un proceso principal que gestiona almacenamiento de archivos, base de datos y procesos de exportación.

### Objetivo

Facilitar la captura, organización y exportación de imágenes y metadatos de muestras para labores de campo y laboratorio, permitiendo crear lotes, ver detalles de muestras y generar archivos (PDF) con la información relevante en formato estándar.

## Características principales

- Captura y preview de imágenes
- Gestión de muestras: crear, listar y ver detalles
- Creación de lotes y exportación a PDF
- Almacenamiento local de archivos y metadatos
- Arquitectura separada entre proceso principal y renderer

## Estructura del proyecto (resumen)

- `main.js` — Entrada principal de la aplicación (proceso main/electron)
- `preload.js` — Puente seguro entre renderer y main
- `src/renderer/` — Código UI en Svelte (App.svelte, componentes)
- `src/master/` — Lógica del proceso principal (fileStorage, ipcMain, db, export)
- `src/utils/` — Utilidades compartidas

## Tecnologías

- Electron + Vite
- Svelte
- Node.js (servicios de base de datos y almacenamiento local)

## Instalación (desarrollo)

1. Clona el repositorio
2. Instala dependencias:

```
npm install
```

3. Ejecuta en modo desarrollo (comandos pueden variar según configuración del proyecto):

```
npm run dev
```

## Uso

- Abrir la app en modo desarrollo para probar la UI.
- Crear muestras desde la interfaz, adjuntar imágenes y metadatos.
- Utilizar la opción de exportar para generar PDF.

## Desarrollo y arquitectura

- El proceso `main` expone canales IPC gestionados en `src/master/ipcMain.js`.
- El almacenamiento de archivos está en `src/master/fileStorage.js`.
- Los servicios de base de datos se encuentran en `src/master/db/`.
- Las funciones de exportación están en `src/master/export/`.


![Fitzroy Minerals Logo](/src/assets/fitzroy-minerals-logo.png)