import React from 'react'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndIcono, SndMensaje } from '../../../components'
import { SectionContainer } from '../../../components/personalizados/SectionContainer'
import { SectionProvider } from '../../../components/personalizados/SectionProvider'
import { useSection } from '../../../lib/context'

/**
 * Sección "Experiencia laboral" del Padrón.
 *
 * Estructura (una sola fuente de verdad):
 *
 * ```
 * <Experiencia />                 ← punto de entrada, envuelve todo
 *   └─ SectionContainer           ← dueño del reducer (tabla ↔ formulario)
 *       └─ Section                ← contenedor: cabecera, cuerpo y pie
 *           ├─ ExperienciaTabla   ← lee state.items y despacha EDIT_FORM / DELETE_ITEM
 *           └─ ExperienciaForm    ← lee state.values y despacha CAMBIAR
 * ```
 *
 * La tabla y el formulario no reciben props: obtienen todo del contexto
 * (`useSection`) que provee el contenedor.
 *
 * Clases reutilizadas: `.padron-acordeon*` (PadronPrestadoresServicio.css),
 * `.campo` / `.requerido` / `.campo__error` / `.contenedor-tabla` (Honorarios.css).
 */

/* =========================================================================
 * Modelo
 * ========================================================================= */

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

/** Valores de un formulario en blanco. */
export const EXPERIENCIA_VACIA: ExperienciaItem = {
  institucionLaboral: '',
  sectorLaboral: 'PUBLICO_FEDERAL',
  puestoDesempenado: '',
  areaAdscripcion: '',
  fechaInicioLaboral: null,
  fechaFinLaboral: null,
  aniosExperiencia: '',
  funcionesPrincipales: '',
}

export const OPCIONES_SECTOR_LABORAL = [
  { label: 'Sector Público Federal (APF)', value: 'PUBLICO_FEDERAL' },
  { label: 'Sector Público Estatal / Municipal', value: 'PUBLICO_LOCAL' },
  { label: 'Sector Privado', value: 'PRIVADO' },
  { label: 'Académico / Investigación', value: 'ACADEMICO' },
  { label: 'Organismo Autónomo / Social', value: 'AUTONOMO' },
]

const ETIQUETA_SECTOR: Record<string, string> = Object.fromEntries(
  OPCIONES_SECTOR_LABORAL.map(({ value, label }) => [value, label]),
)

/** Campos obligatorios para guardar; devuelve el primer mensaje de error. */
export function validarExperiencia(valores: ExperienciaItem): string | null {
  if (!valores.sectorLaboral) return 'El sector es obligatorio.'
  if (!valores.aniosExperiencia.trim()) {
    return 'Indica los años de experiencia comprobable.'
  }
  if (!valores.funcionesPrincipales.trim()) {
    return 'La descripción de funciones principales es obligatoria para acreditar experiencia.'
  }
  return null
}

/* =========================================================================
 * Tabla
 * ========================================================================= */

/**
 * Tabla de experiencia laboral: 6 columnas + acciones, con los estilos del
 * padrón.
 *
 * **Auto-conectada**: lee los renglones de `state.items` y despacha `EDIT_FORM`
 * / `DELETE_ITEM` por sí misma, así que no recibe props de acciones.
 */
export function ExperienciaTabla() {
  const { state, dispatch } = useSection<ExperienciaItem>()
  const experiencias = state.items

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
          <tr style={{ backgroundColor: 'var(--principal, #9B2247)' }}>
            <th style={thStyle}>Institución</th>
            <th style={thStyle}>Sector</th>
            <th style={thStyle}>Puesto Desempeñado</th>
            <th style={thStyle}>Área de Adscripción</th>
            <th style={thStyle}>Años de Experiencia</th>
            <th style={thStyle}>Funciones Principales</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {experiencias.length === 0 ? (
            <tr>
              <td
                colSpan={7}
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
            experiencias.map((exp, indice) => (
              <tr
                key={exp.id ?? indice}
                style={{ borderBottom: '1px solid var(--neutro400, #dddddd)' }}
              >
                <td style={tdStyle}>{exp.institucionLaboral || '-'}</td>
                <td style={tdStyle}>
                  {exp.sectorLaboral
                    ? (ETIQUETA_SECTOR[exp.sectorLaboral] ?? exp.sectorLaboral)
                    : '-'}
                </td>
                <td style={tdStyle}>{exp.puestoDesempenado || '-'}</td>
                <td style={tdStyle}>{exp.areaAdscripcion || '-'}</td>
                <td style={tdStyle}>{exp.aniosExperiencia || '-'}</td>
                <td style={{ ...tdStyle, maxWidth: '400px' }}>{exp.funcionesPrincipales || '-'}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'EDIT_FORM', payload: exp })}
                      style={btnAccionStyle}
                      title="Editar experiencia"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'DELETE_ITEM', payload: indice })}
                      style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                      title="Eliminar experiencia"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

/* =========================================================================
 * Formulario
 * ========================================================================= */

/**
 * Formulario de experiencia laboral: mismos campos y rejilla de 3 columnas que
 * el acordeón del padrón.
 *
 * **Auto-conectado**: los valores, el modo de edición y el intento de envío
 * salen del estado del reducer; cada cambio despacha `CAMBIAR`. No recibe
 * props.
 */
export function ExperienciaForm() {
  const { state, dispatch } = useSection<ExperienciaItem>()

  const valores = state.values ?? EXPERIENCIA_VACIA
  const editar = state.formMode === 'edit'
  /* `intentoEnvio` equivale a "la validación ya falló": es cuando toca marcar
     los obligatorios vacíos. */
  const intentoEnvio = state.formState === 'invalid'

  /** Atajo: un cambio de campo despacha `CAMBIAR` y nada más. */
  const onCambio = (cambios: Partial<ExperienciaItem>) =>
    dispatch({ type: 'CAMBIAR', payload: cambios })

  const aniosVacios = intentoEnvio && !valores.aniosExperiencia.trim()
  const funcionesVacias = intentoEnvio && !valores.funcionesPrincipales.trim()

  /**
   * Guardar: valida el borrador y despacha `HAS_ERRORS` o `SAVE_ITEM`, que es
   * lo que hace volver a la tabla. El aviso al padre lo emite el contenedor.
   */
  const guardar = () => {
    const mensaje = validarExperiencia(valores)
    if (mensaje) {
      dispatch({ type: 'HAS_ERRORS', payload: [{ field: 'aniosExperiencia', message: mensaje }] })
      return
    }
    dispatch({ type: 'SAVE_ITEM' })
  }

  const cancelar = () => dispatch({ type: 'CANCEL' })

  return (
    <>
      {editar ? (
        <SndMensaje tipo="info">Estás modificando una experiencia laboral.</SndMensaje>
      ) : (
        <SndMensaje tipo="exito">Se va a agregar una nueva experiencia laboral.</SndMensaje>
      )}

      <div className="padron-form-grid">
        <div className="campo">
          <label htmlFor="exp-institucion" className="b1sb">
            Institución
          </label>
          <InputText
            id="exp-institucion"
            value={valores.institucionLaboral ?? ''}
            onChange={(e) => onCambio({ institucionLaboral: e.target.value })}
            placeholder="Ej. Secretaría de Hacienda"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-sector" className="b1sb">
            Sector <span className="requerido">*</span>
          </label>
          <Dropdown
            inputId="exp-sector"
            options={OPCIONES_SECTOR_LABORAL}
            value={valores.sectorLaboral}
            onChange={(e) => onCambio({ sectorLaboral: e.value })}
            placeholder="Selecciona sector"
            appendTo="self"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-puesto" className="b1sb">
            Puesto Desempeñado
          </label>
          <InputText
            id="exp-puesto"
            value={valores.puestoDesempenado ?? ''}
            onChange={(e) => onCambio({ puestoDesempenado: e.target.value })}
            placeholder="Ej. Jefe de Departamento"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-area" className="b1sb">
            Área de Adscripción
          </label>
          <InputText
            id="exp-area"
            value={valores.areaAdscripcion ?? ''}
            onChange={(e) => onCambio({ areaAdscripcion: e.target.value })}
            placeholder="Ej. Dirección General"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-inicio" className="b1sb">
            Fecha de inicio
          </label>
          <Calendar
            inputId="exp-inicio"
            value={valores.fechaInicioLaboral ?? null}
            onChange={(e) => onCambio({ fechaInicioLaboral: (e.value as Date | null) ?? null })}
            dateFormat="dd/mm/yy"
            showIcon
            appendTo="self"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-fin" className="b1sb">
            Fecha de fin
          </label>
          <Calendar
            inputId="exp-fin"
            value={valores.fechaFinLaboral ?? null}
            onChange={(e) => onCambio({ fechaFinLaboral: (e.value as Date | null) ?? null })}
            dateFormat="dd/mm/yy"
            showIcon
            appendTo="self"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-anios" className="b1sb">
            Años de Experiencia en el Ramo <span className="requerido">*</span>
          </label>
          <InputText
            id="exp-anios"
            maxLength={2}
            value={valores.aniosExperiencia}
            invalid={aniosVacios}
            onChange={(e) => onCambio({ aniosExperiencia: e.target.value.replace(/\D/g, '') })}
            placeholder="Ej. 5"
          />
          {aniosVacios && (
            <span className="campo__error">Indica los años de experiencia comprobable.</span>
          )}
        </div>

        <div className="campo padron-form-grid__col-3">
          <label htmlFor="exp-funciones" className="b1sb">
            Comentarios / Funciones Principales <span className="requerido">*</span>
          </label>
          <textarea
            id="exp-funciones"
            className={`padron-textarea ${funcionesVacias ? 'padron-textarea--invalido' : ''}`}
            value={valores.funcionesPrincipales}
            onChange={(e) => onCambio({ funcionesPrincipales: e.target.value })}
            placeholder="Describe las actividades técnicas, administrativas o profesionales desempeñadas..."
          />
          {funcionesVacias && (
            <span className="campo__error">
              La descripción de funciones principales es obligatoria para acreditar experiencia.
            </span>
          )}
        </div>
      </div>

      {state.errors && state.errors.length > 0 && (
        <p className="campo__error">{state.errors[0].message}</p>
      )}

      <div className="fila" style={{ marginTop: '1rem' }}>
        <SndBoton type="button" onClick={guardar}>
          {editar ? 'Actualizar experiencia' : 'Guardar experiencia laboral'}
        </SndBoton>
        <SndBoton variante="secundario" type="button" onClick={cancelar}>
          Cancelar
        </SndBoton>
      </div>
    </>
  )
}

/* =========================================================================
 * Sección: provider + contenedor + tabla y formulario auto-conectados
 * ========================================================================= */

export interface ExperienciaProps {
  /** Renglones con los que arranca la sección. */
  itemsIniciales?: ExperienciaItem[]
  /** ¿La cabecera se pinta abierta? */
  abierta?: boolean
  /** Se avisa cuando el usuario pulsa "Siguiente" con al menos un renglón. */
  onCompleted?: (ok: boolean) => void
  /** Se avisa después de cada guardado exitoso (alta o actualización). */
  onGuardar?: (fila: ExperienciaItem, edicion: boolean) => void
}

/**
 * Sección "Experiencia laboral" lista para usar.
 *
 * Envuelve todo en el `SectionContainer`, que provee el estado del reducer y
 * monta el contenedor `Section`: la tabla y el formulario leen el mismo estado
 * sin que quien use `<Experiencia />` tenga que montar el provider a mano.
 *
 * ```tsx
 * <Experiencia itemsIniciales={experiencias} abierta onGuardar={...} />
 * ```
 */
export function Experiencia({
  itemsIniciales = [],
  abierta = true,
  onCompleted,
  onGuardar,
}: ExperienciaProps) {
  return (
    <SectionProvider<ExperienciaItem> itemsIniciales={itemsIniciales}>
      <SectionContainer<ExperienciaItem>
        title="4. Experiencia Laboral"
        subtitle="Área de experiencia, Años de experiencia"
        icon={<SndIcono nombre="snd-calendar" tamano={22} />}
        addButtonLabel="Experiencia nueva"
        collapsed={!abierta}
        onCompleted={onCompleted}
        /* El contenedor detecta la transición form → table y avisa al padre. */
        onGuardarSeccion={onGuardar}
        table={<ExperienciaTabla />}
      >
        <ExperienciaForm />
      </SectionContainer>
    </SectionProvider>
  )
}

/* =========================================================================
 * Estilos
 * ========================================================================= */

/** Mismos estilos de celda que `TablaExperiencia`: el padrón los pinta inline. */
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
