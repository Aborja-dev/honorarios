import type { CSSProperties } from 'react'

/**
 * Estilos compartidos de las tablas del padrón.
 *
 * Estaban copiados en `TablaAcciones`, `TablaEscolaridad` y la sección de
 * Experiencia: tres lugares que había que cambiar a la vez para tocar el mismo
 * borde o el mismo relleno. Aquí viven una sola vez.
 *
 * Se pintan inline (y no como clases `.css`) porque el padrón ya usa estilos
 * en línea para sus tablas y así no dependen del orden de carga de las hojas.
 */

/** Encabezado de columna: guinda sólido con texto blanco. */
export const thStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  fontWeight: 600,
  color: '#fff',
  whiteSpace: 'nowrap',
  border: '1px solid var(--gama800, #6F1D36)',
  textAlign: 'left',
}

/** Celda de datos. */
export const tdStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  color: 'var(--neutro800, #333)',
  verticalAlign: 'middle',
  border: '1px solid var(--neutro400, #dddddd)',
}

/** Fila del encabezado: mismo guinda que `.principal`. */
export const trEncabezadoStyle: CSSProperties = {
  backgroundColor: 'var(--principal, #9B2247)',
}

/** Fila de datos: línea inferior sutil. */
export const trDatosStyle: CSSProperties = {
  borderBottom: '1px solid var(--neutro400, #dddddd)',
}

/** Celda del estado vacío: centrada, con aire y color secundario. */
export const tdVaciaStyle: CSSProperties = {
  ...tdStyle,
  textAlign: 'center',
  color: 'var(--neutro600, #767676)',
  padding: '2rem',
}

/** Botón de acción por renglón (Editar / Eliminar). */
export const btnAccionStyle: CSSProperties = {
  background: 'none',
  border: '1px solid var(--neutro400, #cccccc)',
  borderRadius: '8px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: 'var(--neutro800, #333)',
}
