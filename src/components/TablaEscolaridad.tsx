import React from 'react'

export interface EscolaridadItem {
  id?: string | number
  nivelEstudios: string | null
  carrera: string
  institucionEducativa?: string
  estatusEstudios: string | null
  documentoComprobatorio?: string | null
  cedulaProfesional?: string
  anioTitulacion?: string
}

interface TablaEscolaridadProps {
  escolaridades?: EscolaridadItem[]
  onEditar?: (escolaridad: EscolaridadItem, index: number) => void
  onEliminar?: (index: number) => void
}

const DATOS_EJEMPLO: EscolaridadItem[] = [
  {
    id: 1,
    nivelEstudios: 'LICENCIATURA',
    carrera: 'Licenciatura en Derecho',
    institucionEducativa: 'UNAM',
    estatusEstudios: 'TITULADO',
    documentoComprobatorio: 'CEDULA',
    cedulaProfesional: '08945123',
    anioTitulacion: '2013',
  },
]

export const TablaEscolaridad: React.FC<TablaEscolaridadProps> = ({
  escolaridades = DATOS_EJEMPLO,
  onEditar,
  onEliminar,
}) => {
  const tieneAcciones = Boolean(onEditar || onEliminar)

  const obtenerEtiquetaNivel = (valor: string | null) => {
    if (!valor) return '-'
    const opciones: Record<string, string> = {
      BACHILLERATO: 'Bachillerato / Equivalente',
      TSU: 'Técnico Superior Universitario',
      LICENCIATURA: 'Licenciatura / Ingeniería',
      ESPECIALIDAD: 'Especialidad',
      MAESTRIA: 'Maestría',
      DOCTORADO: 'Doctorado',
    }
    return opciones[valor] || valor
  }

  const obtenerEtiquetaEstatus = (valor: string | null) => {
    if (!valor) return '-'
    const opciones: Record<string, string> = {
      TITULADO: 'Titulado(a) con Cédula',
      TRAMITE: 'En trámite de titulación',
      PASANTE: 'Pasante / Carta de pasante',
      CERTIFICADO: 'Certificado total de estudios',
    }
    return opciones[valor] || valor
  }

  const obtenerEtiquetaDocumento = (valor: string | null | undefined) => {
    if (!valor) return '-'
    const opciones: Record<string, string> = {
      CEDULA: 'Cédula Profesional Electrónica',
      TITULO: 'Título Profesional',
      ACTA: 'Acta de Examen Profesional',
      CONSTANCIA: 'Constancia Oficial de Estudios',
    }
    return opciones[valor] || valor
  }

  return (
    <div className="contenedor-tabla" style={{ marginTop: '1rem' }}>
      <table
        style={{
          width: '100%',
          minWidth: '60rem',
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
            <th style={thStyle}>Nivel de Estudios</th>
            <th style={thStyle}>Área de Estudio / Carrera</th>
            <th style={thStyle}>Institución Educativa</th>
            <th style={thStyle}>Grado de Avance</th>
            <th style={thStyle}>Documento Comprobatorio</th>
            <th style={thStyle}>Núm. Certificado / Cédula</th>
            <th style={thStyle}>Año de Titulación</th>
            {tieneAcciones && <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {escolaridades.length === 0 ? (
            <tr>
              <td
                colSpan={tieneAcciones ? 8 : 7}
                style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: 'var(--neutro600, #767676)',
                  padding: '2rem',
                }}
              >
                No hay estudios registrados.
              </td>
            </tr>
          ) : (
            escolaridades.map((esc, index) => (
              <tr
                key={esc.id ?? index}
                style={{
                  borderBottom: '1px solid var(--neutro400, #dddddd)',
                }}
              >
                <td style={tdStyle}>{obtenerEtiquetaNivel(esc.nivelEstudios)}</td>
                <td style={tdStyle}>{esc.carrera || '-'}</td>
                <td style={tdStyle}>{esc.institucionEducativa || '-'}</td>
                <td style={tdStyle}>{obtenerEtiquetaEstatus(esc.estatusEstudios)}</td>
                <td style={tdStyle}>{obtenerEtiquetaDocumento(esc.documentoComprobatorio)}</td>
                <td style={tdStyle}>{esc.cedulaProfesional || '-'}</td>
                <td style={tdStyle}>{esc.anioTitulacion || '-'}</td>
                {tieneAcciones && (
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {onEditar && (
                        <button
                          type="button"
                          onClick={() => onEditar(esc, index)}
                          style={btnAccionStyle}
                          title="Editar escolaridad"
                        >
                          Editar
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          onClick={() => onEliminar(index)}
                          style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                          title="Eliminar escolaridad"
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

export default TablaEscolaridad
