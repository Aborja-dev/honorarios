import { Children, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react'

/**
 * Tabla de datos con acciones por renglón (Editar / Eliminar).
 *
 * Es el corazón visual compartido por todas las secciones del padrón que
 * funcionan como maestro-detalle. Cada sección solo declara sus columnas
 * (`<TablaAcciones.Columna encabezado="Alias">{(fila) => ...}</TablaAcciones.Columna>`)
 * y este componente se encarga del encabezado, el estado vacío y la celda de
 * acciones. Así los textos y el formato de cada columna viven en su sección y
 * la mecánica de la tabla vive en un solo archivo.
 */

/**
 * La restricción deliberadamente laxa: acepta `DireccionItem`,
 * `EscolaridadItem`, etc. sin exigir una propiedad común, porque
 * `{ [clave: string]: unknown }` rechaza interfaces sin índice implícito.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fila = any

export interface TablaAccionesProps<T extends Fila = Fila> {
  /** Renglones a pintar. También alimenta las columnas declarativas. */
  filas: readonly T[]
  /** Mensaje que ocupa toda la tabla cuando no hay filas. */
  vacia: ReactNode
  /** Columnas declaradas como hijos: `<TablaAcciones.Columna encabezado={...}>{(fila, i) => ...}</TablaAcciones.Columna>`. */
  children?: ReactNode
  /** Alternativa programática a los hijos. */
  columnas?: readonly TablaAccionesColumna<T>[]
  /** Ancho mínimo de la tabla, para mantener legibilidad en móvil. */
  anchoMinimo?: string
  /** Si no se entrega ningún manejador, se omite la columna de acciones. */
  onEditar?: (fila: T, indice: number) => void
  onEliminar?: (indice: number) => void
  /** Texto (y `title` de accesibilidad) del botón de editar. */
  textoEditar?: string
  /** Texto (y `title` de accesibilidad) del botón de eliminar. */
  textoEliminar?: string
}

export interface TablaAccionesColumna<T extends Fila = Fila> {
  encabezado: ReactNode
  celda: (fila: T, indice: number) => ReactNode
}

export interface TablaAccionesColumnaProps<T extends Fila = Fila> {
  encabezado: ReactNode
  children: (fila: T, indice: number) => ReactNode
}

/**
 * Declaración de una columna. No pinta nada por sí misma: `TablaAcciones` lee
 * sus props y las convierte en `<th>`/`<td>`. Permite escribir las columnas de
 * forma declarativa sin anidar a mano cada fila.
 */
function Columna<T extends Fila>(_props: TablaAccionesColumnaProps<T>) {
  return null
}

function esColumna(nodo: ReactNode): nodo is ReactElement<TablaAccionesColumnaProps> {
  return isValidElement(nodo) && nodo.type === Columna
}

export function TablaAcciones<T extends Fila = Fila>({
  filas,
  vacia,
  children,
  columnas,
  anchoMinimo = '40rem',
  onEditar,
  onEliminar,
  textoEditar = 'Editar',
  textoEliminar = 'Eliminar',
}: TablaAccionesProps<T>) {
  const declaradas: TablaAccionesColumna<T>[] = [
    ...(columnas ?? []),
    ...[...Children.toArray(children)].filter(esColumna).map(({ props }) => ({
      encabezado: props.encabezado,
      celda: props.children,
    })),
  ]

  const tieneAcciones = Boolean(onEditar || onEliminar)
  const totalColumnas = Math.max(declaradas.length + (tieneAcciones ? 1 : 0), 1)

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
            {declaradas.map((columna, indice) => (
              <th key={indice} style={thStyle}>
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
                {declaradas.map((columna, i) => (
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
                          onClick={() => onEditar(fila, indice)}
                          style={btnAccionStyle}
                          title={textoEditar}
                        >
                          Editar
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          onClick={() => onEliminar(indice)}
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

TablaAcciones.Columna = Columna
export { Columna as ColumnaTablaAcciones }

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
