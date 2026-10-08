# 🏗️ ObraGest — Gestión de Proyectos de Obra Pública en Equipo

Aplicación web **plenamente operativa, sin dependencias y lista para ejecutar en GitHub** (GitHub Pages).
Permite repartir tareas, adjudicar subproyectos a miembros, gestionar tiempos y controlar avances.

## ✨ Funcionalidades

- **Proyectos:** expediente, tipo de obra, ubicación, presupuesto, plazos, responsable.
- **Subproyectos:** fracciones adjudicables a un miembro del equipo, con avance auto-calculado.
- **Tareas / Kanban:** reparto por responsable, prioridad, estado (pendiente → en curso → en revisión → completada), arrastrar y soltar, % avance, horas estimadas/reales.
- **Equipo:** roles, especialidades, carga de trabajo.
- **Tiempos:** registro de horas, comparativa estimadas vs reales, cronograma Gantt simplificado, alerta de vencimientos a 14 días.
- **Avances:** progreso por proyecto → subproyecto → tarea, bitácora de obra, informe CSV.
- **Persistencia** en `localStorage`, exportar/importar JSON, datos de ejemplo, buscador global (`/`).

## 🚀 Ejecutar en local

Solo necesitas un navegador. Opción 1 — abrir el archivo:

```bash
index.html  # doble clic
```

Opción 2 — servidor local:

```bash
npx serve .
# o
python -m http.server 8000
# abrir http://localhost:8000
```

## ☁️ Subir a GitHub y activar Pages

```bash
git init
git add .
git commit -m "ObraGest: gestor de obra pública"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/obragest.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.
El workflow incluido (`.github/workflows/deploy-pages.yml`) también despliega automáticamente.

Tu app quedará en: `https://TU_USUARIO.github.io/obragest/`

## 🧱 Estructura

```
index.html   # SPA: panel, proyectos, subproyectos, kanban, equipo, tiempos, avances
styles.css   # tema oscuro profesional, responsive
app.js       # lógica completa vanilla JS (CRUD, filtros, gráficos canvas, Gantt, CSV)
```

Sin build, sin npm, sin backend. Funciona offline una vez cargada.

## 📊 Modelo de datos (localStorage `obragest_v1`)

`miembros, proyectos, subproyectos, tareas, registros, bitacora`. Usa **Exportar** para copia de seguridad.

## 📄 Licencia

MIT — uso libre en administración pública y empresas.
