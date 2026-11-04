import type { CSSProperties, ReactNode } from 'react'

/**
 * Columna de `TablaAcciones`, declarada como **dato** y no como componente.
 *
 * Antes las columnas se escribían como `<TablaAcciones.Columna>…</TablaAcciones.Columna>`,
 * un componente que devolvía `null` y que la tabla leía por sus `props`. Ese
 * patrón obligaba a anidar JSX manualmente y fue el origen de un `<thead>` mal
 * cerrado que invalidaba el módulo entero (y con él, el botón Editar). Como
 * dato, una columna es imposible de anidar mal y añadir una es una línea.
 */
export interface ColumnaTabla<T> {
  encabezado: ReactNode
  celda: (fila: T, indice: number) => ReactNode
}

/**
 * Restricción deliberadamente laxa: acepta `DireccionItem`,
 * `EscolaridadItem`, etc. sin exigir una propiedad común, porque
 * `{ [clave: string]: unknown }` rechaza interfaces sin índice implícito.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fila = any

export interface TablaAccionesProps<T extends Fila = Fila> {
  /** Renglones a pintar. */
  filas: readonly T[]
  /** Columnas, en orden de presentación. */
  columnas: readonly ColumnaTabla<T>[]
  /** Mensaje que ocupa toda la tabla cuando no hay filas. */
  vacia: ReactNode
  /** Ancho mínimo de la tabla, para mantener legibilidad en móvil. */
  anchoMinimo?: string
  /**
   * Índice que se pasa a `onEditar`. Se resuelve del arreglo **completo** de
   * renglones, no de `filas`: si la tabla muestra una vista filtrada, el
   * manejador sigue recibiendo la posición real en el estado del padre.
   */
  indiceDeFila?: (fila: T, indice: number) => number
  /** Se dispara con el índice real del renglón pulsado en "Editar". */
  onEditar?: (indice: number) => void
  onEliminar?: (indice: number) => void
  /** Texto (y `title` de accesibilidad) del botón de editar. */
  textoEditar?: string
  /** Texto (y `title` de accesibilidad) del botón de eliminar. */
  textoEliminar?: string
}

export function TablaAcciones<T extends Fila = Fila>({
  filas,
  columnas,
  vacia,
  anchoMinimo = '40rem',
  indiceDeFila,
  onEditar,
  onEliminar,
  textoEditar = 'Editar',
  textoEliminar = 'Eliminar',
}: TablaAccionesProps<T>) {
  // La columna de acciones solo aparece si hay algo que hacer.
  const tieneAcciones = Boolean(onEditar || onEliminar)
  const totalColumnas = Math.max(columnas.length + (tieneAcciones ? 1 : 0), 1)
  const indiceReal = (fila: T, indice: number) => (indiceDeFila ? indiceDeFila(fila, indice) : indice)

  return (
    <div className="contenedor-tabla" style={{ marginTop: '1rem' }}>
      <table
        style={{
          width: '100%',
          minWidth: anchoMinimo,
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--principal, #9B2247)' }}>
            {columnas.map((columna, i) => (
              <th key={i} style={thStyle}>
                {columna.encabezado}
              </th>
            ))}
            {tieneAcciones && <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td
                colSpan={totalColumnas}
                style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: 'var(--neutro600, #767676)',
                  padding: '2rem',
                }}
              >
                {vacia}
              </td>
            </tr>
          ) : (
            filas.map((fila, indice) => (
              <tr
                key={claveDeFila(fila, indice)}
                style={{ borderBottom: '1px solid var(--neutro400, #dddddd)' }}
              >
                {columnas.map((columna, i) => (
                  <td key={i} style={tdStyle}>
                    {columna.celda(fila, indice)}
                  </td>
                ))}
                {tieneAcciones && (
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {onEditar && (
                        <button
                          type="button"
                          onClick={() => onEditar(indiceReal(fila, indice))}
                          style={btnAccionStyle}
                          title={textoEditar}
                        >
                          Editar
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          onClick={() => onEliminar(indiceReal(fila, indice))}
                          style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                          title={textoEliminar}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

/** La clave estable del renglón: `id` del dominio o índice como respaldo. */
function claveDeFila(fila: Fila, indice: number) {
  const id = fila?.id
  return id ?? indice
}

const thStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  fontWeight: 600,
  color: '#fff',
  whiteSpace: 'nowrap',
  border: '1px solid var(--gama800, #6F1D36)',
  textAlign: 'left',
}

const tdStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  color: 'var(--neutro800, #333)',
  verticalAlign: 'middle',
  border: '1px solid var(--neutro400, #dddddd)',
}

const btnAccionStyle: CSSProperties = {
  background: 'none',
  border: '1px solid var(--neutro400, #cccccc)',
  borderRadius: '8px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: 'var(--neutro800, #333)',
}

export default TablaAcciones
