import React from 'react'

export interface DireccionItem {
  id?: string | number
  alias?: string,
  calle: string
  numeroExterior: string
  numeroInterior?: string
  codigoPostal: string
  colonia: string
  municipioAlcaldia: string
  entidadFederativa: string | null
  pais: string
  referenciasDomicilio?: string
}

interface TablaDireccionProps {
  direcciones: DireccionItem[]
  onEditar?: (direccion: DireccionItem, index: number) => void
  onEliminar?: (index: number) => void
}



export const TablaDireccion: React.FC<TablaDireccionProps> = ({
  direcciones,
  onEditar,
  onEliminar,
}) => {
  const tieneAcciones = Boolean(onEditar || onEliminar)

  return (
    <div className="contenedor-tabla" style={{ marginTop: '1rem' }}>
      <table
        style={{
          width: '100%',
          minWidth: '40rem',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--principal, #9B2247)',
            }}
          >
            <th style={thStyle}>Alias</th>
            <th style={thStyle}>Dirección</th>
            <th style={thStyle}>Estado</th>
            {tieneAcciones && <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {direcciones.length === 0 ? (
            <tr>
              <td
                colSpan={tieneAcciones ? 10 : 9}
                style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: 'var(--neutro600, #767676)',
                  padding: '2rem',
                }}
              >
                No hay direcciones registradas.
              </td>
            </tr>
          ) : (
            direcciones.map((dir, index) => (
              <tr
                key={dir.id ?? index}
                style={{
                  borderBottom: '1px solid var(--neutro400, #dddddd)',
                }}
              >
                <td style={tdStyle}>{dir.alias || `Dirección ${index +1}`}</td>
                <td style={tdStyle}>{`
                  ${dir.calle || '-'}
                  ${dir.numeroExterior || '-'}
                  ${dir.colonia || '-'}
                  ${dir.municipioAlcaldia || '-'}
                  `}</td>
                <td style={tdStyle}>{dir.entidadFederativa || '-'}</td>
                
                
                {tieneAcciones && (
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {onEditar && (
                        <button
                          type="button"
                          onClick={() => onEditar(dir, index)}
                          style={btnAccionStyle}
                          title="Editar dirección"
                        >
                          Editar
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          onClick={() => onEliminar(index)}
                          style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                          title="Eliminar dirección"
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

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  fontWeight: 600,
  color: '#fff',
  whiteSpace: 'nowrap',
  border: '1px solid var(--gama800, #6F1D36)',
  textAlign: 'left',
}

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: 'var(--neutro800, #333)',
  verticalAlign: 'middle',
  border: '1px solid var(--neutro400, #dddddd)',
}

const btnAccionStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--neutro400, #cccccc)',
  borderRadius: '8px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: 'var(--neutro800, #333)',
}

export default TablaDireccion
