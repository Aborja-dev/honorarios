# Bitácora del Proyecto

Registro automático de cambios realizados por el agente.

---

## [2026-10-26 09:55:29] Corrección del truncado en píldoras de filtro

**Acción:** Reemplazado `.pildoraFiltro span` por reglas que truncan solo el texto y preservan el ícono de cierre.
**Archivos:** src/components/honorarios/Honorarios.css
**Aprendizaje:** `text-overflow: ellipsis` exige `overflow: hidden` y `white-space: nowrap`; además, el elemento debe poder encogerse (`min-width: 0`). El selector original también afectaba los spans del ícono.

---
