import React from 'react'

export interface ExperienciaItem {
  id?: string | number
  institucionLaboral?: string
  sectorLaboral: string | null
  puestoDesempenado?: string
  areaAdscripcion?: string
  fechaInicioLaboral?: Date | null
  fechaFinLaboral?: Date | null
  aniosExperiencia: string
  funcionesPrincipales: string
}

interface TablaExperienciaProps {
  experiencias?: ExperienciaItem[]
  onEditar?: (experiencia: ExperienciaItem, index: number) => void
  onEliminar?: (index: number) => void
}

const DATOS_EJEMPLO: ExperienciaItem[] = [
  {
    id: 1,
    institucionLaboral: 'Secretaría Anticorrupción y Buen Gobierno',
    sectorLaboral: 'PUBLICO_FEDERAL',
    puestoDesempenado: 'Especialista en Análisis Normativo',
    areaAdscripcion: 'Dirección General',
    aniosExperiencia: '6',
    funcionesPrincipales: 'Revisión técnico-jurídica de expedientes de prestadores de servicios profesionales por honorarios.',
  },
]

export const TablaExperiencia: React.FC<TablaExperienciaProps> = ({
  experiencias = DATOS_EJEMPLO,
  onEditar,
  onEliminar,
}) => {
  const tieneAcciones = Boolean(onEditar || onEliminar)

  const obtenerEtiquetaSector = (valor: string | null) => {
    if (!valor) return '-'
    const opciones: Record<string, string> = {
      PUBLICO_FEDERAL: 'Sector Público Federal (APF)',
      PUBLICO_LOCAL: 'Sector Público Estatal / Municipal',
      PRIVADO: 'Sector Privado',
      ACADEMICO: 'Académico / Investigación',
      AUTONOMO: 'Organismo Autónomo / Social',
    }
    return opciones[valor] || valor
  }

  return (
    <div className="contenedor-tabla" style={{ marginTop: '1rem' }}>
      <table
        style={{
          width: '100%',
          minWidth: '65rem',
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
            <th style={thStyle}>Institución</th>
            <th style={thStyle}>Sector</th>
            <th style={thStyle}>Puesto Desempeñado</th>
            <th style={thStyle}>Área de Adscripción</th>
            <th style={thStyle}>Años de Experiencia</th>
            <th style={thStyle}>Funciones Principales</th>
            {tieneAcciones && <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {experiencias.length === 0 ? (
            <tr>
              <td
                colSpan={tieneAcciones ? 7 : 6}
                style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: 'var(--neutro600, #767676)',
                  padding: '2rem',
                }}
              >
                No hay experiencia laboral registrada.
              </td>
            </tr>
          ) : (
            experiencias.map((exp, index) => (
              <tr
                key={exp.id ?? index}
                style={{
                  borderBottom: '1px solid var(--neutro400, #dddddd)',
                }}
              >
                <td style={tdStyle}>{exp.institucionLaboral || '-'}</td>
                <td style={tdStyle}>{obtenerEtiquetaSector(exp.sectorLaboral)}</td>
                <td style={tdStyle}>{exp.puestoDesempenado || '-'}</td>
                <td style={tdStyle}>{exp.areaAdscripcion || '-'}</td>
                <td style={tdStyle}>{exp.aniosExperiencia || '-'}</td>
                <td style={{ ...tdStyle, maxWidth: '400px' }}>{exp.funcionesPrincipales || '-'}</td>
                {tieneAcciones && (
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {onEditar && (
                        <button
                          type="button"
                          onClick={() => onEditar(exp, index)}
                          style={btnAccionStyle}
                          title="Editar experiencia"
                        >
                          Editar
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          onClick={() => onEliminar(index)}
                          style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                          title="Eliminar experiencia"
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

export default TablaExperiencia
