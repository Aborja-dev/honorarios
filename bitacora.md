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
