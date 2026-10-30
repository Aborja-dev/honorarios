# Bitácora del Proyecto

Registro automático de cambios realizados por el agente.

---

## [2026-10-26 09:55:29] Corrección del truncado en píldoras de filtro

**Acción:** Reemplazado `.pildoraFiltro span` por reglas que truncan solo el texto y preservan el ícono de cierre.
**Archivos:** src/components/honorarios/Honorarios.css
**Aprendizaje:** `text-overflow: ellipsis` exige `overflow: hidden` y `white-space: nowrap`; además, el elemento debe poder encogerse (`min-width: 0`). El selector original también afectaba los spans del ícono.

---

## [2026-10-26 12:11:16] CardRUSP convertida a mock estático

**Acción:** Eliminados props y dependencia de `SubmoduloInfo`; la tarjeta ahora muestra datos fijos y handlers eliminados.
**Archivos:** src/components/honorarios/CardRUSP.tsx, src/components/honorarios/CifrasYEstadisticas.tsx
**Aprendizaje:** El typecheck del árbol ya falla por imports sin uso previos (PanelSubmodulos, Landing, etc.); no se introdujeron errores nuevos.

---

## [2026-10-26 17:11:44] Separación de gráficos de Honorarios

**Acción:** Movido el doughnut a `ChartAsignacion` y el pie a `ChartEstatus`, ambos integrados en las tarjetas de `CifrasYEstadisticas`; eliminado `Chars.tsx` y añadida la clase `.honorarios-grafico`.
**Archivos:** src/components/honorarios/chart/ChartAsignacion.tsx, src/components/honorarios/chart/ChartEstatus.tsx, src/components/honorarios/CifrasYEstadisticas.tsx, src/components/honorarios/Honorarios.css, src/components/honorarios/chart/Chars.tsx
**Aprendizaje:** El proyecto no usa Tailwind (Chars.tsx tenía clases que no aplicaban); se usan las variables/estilos del SND. Los plugins de Chart.js necesitan tipado explícito y `Element.tooltipPosition(true)` puede devolver coordenadas nulas.

---

## [2026-10-28 10:21:01] Calendarios en Validación de Identidad

**Acción:** Reemplazados los campos de fecha de inicio y fin por componentes Calendar controlados, con etiquetas asociadas, formato dd/mm/yy y estilos SND existentes.
**Archivos:** src/pages/ValidarIdentidad.tsx, bitacora.md
**Aprendizaje:** El proyecto ya centraliza la apariencia de Calendar en snd-prime.css, por lo que no fue necesario agregar CSS específico. El typecheck conserva errores preexistentes por variables no usadas en otros archivos, sin errores en ValidarIdentidad.tsx.

---

## [2026-10-28 11:20:00] Porcentaje visible en gráfica de asignación

**Acción:** Agregado al centro de la gráfica el porcentaje redondeado de contratos asignados respecto del total.
**Archivos:** src/components/honorarios/chart/ChartAsignacion.tsx, bitacora.md
**Aprendizaje:** El indicador muestra 0% cuando no hay contratos para evitar una división entre cero. El typecheck conserva errores preexistentes por variables no usadas, sin errores en ChartAsignacion.tsx.

---

## [2026-10-28 12:31:52] Fila de búsqueda en Padrón de Prestadores

**Acción:** Agregados los campos Nombre, CURP y RFC junto a los botones Buscar y Nuevo en una sola fila.
**Archivos:** src/pages/PadronPrestadoresServicio.tsx, bitacora.md
**Aprendizaje:** Se reutilizó la clase `fila` para conservar el espaciado y permitir adaptación en pantallas angostas. El typecheck conserva errores preexistentes en el proyecto.

---

## [2026-10-30 17:50:00] Bandera VITE_SCROLL para el scroll interno del Padrón

**Acción:** Agregada la variable de entorno `VITE_SCROLL` (`on`/`off`, sin definir = `on`) que enciende o apaga el scroll interno del panel del Padrón de Prestadores.
**Archivos:** src/app/config.ts, src/app/index.ts, src/vite-env.d.ts, src/pages/PrestadoresPage.tsx, src/pages/PrestadoresPage.css, bitacora.md
**Aprendizaje:** El scroll interno no estaba en `PadronPrestadoresServicio.css` (ese archivo no tiene ninguna regla de scroll) sino en `PrestadoresPage.css`: el layout tenía altura fija `100vh − encabezado` y el panel desbordaba con `overflow-y: auto`. Esas reglas se movieron bajo el modificador `.prestadores-layout--scroll-interno`, que se aplica solo con la bandera activa; sin la bandera, el panel crece y el scroll pasa a la ventana. La navegación por anclas del menú de secciones ahora decide panel o ventana según la misma bandera. Se tipó la variable en `src/vite-env.d.ts` porque el proyecto no tenía tipos de Vite. El build real no se pudo correr: Vite necesita `execFile` para resolver rutas y el sandbox lo corta con `spawn EPERM`; la evaluación de la bandera se verificó con un script de Node aparte.

---

## [2026-10-30 18:05:00] Scripts npm para arrancar/compilar con VITE_SCROLL=off

**Acción:** Agregados `dev:scroll-off` y `build:scroll-off` en `package.json`, respaldados por `scripts/con-scroll.mjs`, que fija `VITE_SCROLL` en el proceso hijo y llama al Vite local.
**Archivos:** scripts/con-scroll.mjs, package.json, bitacora.md
**Aprendizaje:** `spawn('vite', …, { shell: true })` no sirve: `vite` no está en el PATH fuera de los scripts npm y Node avisa con `DEP0190`. La solución es resolver `vite/package.json` con `createRequire` y lanzar `process.execPath` con la ruta del binario, sin shell: funciona en cualquier terminal, con rutas que tienen espacios y propaga el código de salida. Se probó con un Vite falso en una carpeta temporal (los cuatro casos dan el código esperado).

---
