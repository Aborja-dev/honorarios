import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndIcono, SndMensaje, SndPildora } from '../snd'

/**
 * MAQUETA de la sección "Experiencia laboral" del Padrón de Prestadores.
 *
 * Este archivo es **solo diseño**: no hay estado, validación, envío ni
 * llamadas a servicios. Los datos que se pintan son los de ejemplo y cualquier
 * interacción está desactivada (`onChange` vacío, `onClick` vacío), para que la
 * maqueta se pueda revisar sin que nada dispare lógica real.
 *
 * Origen del diseño (para no duplicar definiciones si luego se conecta):
 * - Sección: `src/pages/PadronPrestadoresServicio.tsx` (acordeón 4)
 * - Tabla: `src/components/prestadoresServicios/TablaExperiencia.tsx`
 * - Estilos: `.padron-*` de `PadronPrestadoresServicio.css` y `.campo` /
 *   `.requerido` / `.campo__error` de `Honorarios.css`.
 */

/* =========================================================================
 * Modelo de ejemplo (solo para la maqueta)
 * ========================================================================= */

export interface ExperienciaMaqueta {
  id: number
  institucionLaboral: string
  sectorLaboral: string
  puestoDesempenado: string
  areaAdscripcion: string
  fechaInicioLaboral: Date | null
  fechaFinLaboral: Date | null
  aniosExperiencia: string
  funcionesPrincipales: string
}

/** Etiquetas del catálogo de sectores, tal como las muestra la tabla. */
const ETIQUETAS_SECTOR: Record<string, string> = {
  PUBLICO_FEDERAL: 'Sector Público Federal (APF)',
  PUBLICO_LOCAL: 'Sector Público Estatal / Municipal',
  PRIVADO: 'Sector Privado',
  ACADEMICO: 'Académico / Investigación',
  AUTONOMO: 'Organismo Autónomo / Social',
}

const OPCIONES_SECTOR_LABORAL = Object.entries(ETIQUETAS_SECTOR).map(([value, label]) => ({
  label,
  value,
}))

/** Registros de ejemplo: son los mismos que ya muestra la tabla del padrón. */
const EXPERIENCIAS_EJEMPLO: ExperienciaMaqueta[] = [
  {
    id: 1,
    institucionLaboral: 'Secretaría Anticorrupción y Buen Gobierno',
    sectorLaboral: 'PUBLICO_FEDERAL',
    puestoDesempenado: 'Especialista en Análisis Normativo',
    areaAdscripcion: 'Dirección General',
    fechaInicioLaboral: null,
    fechaFinLaboral: null,
    aniosExperiencia: '6',
    funcionesPrincipales:
      'Revisión técnico-jurídica de expedientes de prestadores de servicios profesionales por honorarios.',
  },
  {
    id: 2,
    institucionLaboral: 'Universidad Nacional Autónoma de México',
    sectorLaboral: 'ACADEMICO',
    puestoDesempenado: 'Profesora de asignatura',
    areaAdscripcion: 'Facultad de Derecho',
    fechaInicioLaboral: null,
    fechaFinLaboral: null,
    aniosExperiencia: '3',
    funcionesPrincipales: 'Impartición de cátedra y asesoría en materia administrativa.',
  },
]

/* =========================================================================
 * Tabla: misma estructura de columnas y estilos de TablaExperiencia
 * ========================================================================= */

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

/** Maqueta de la tabla: 6 columnas + acciones, igual que `TablaExperiencia`. */
export function TablaExperienciaMaqueta({
  experiencias = EXPERIENCIAS_EJEMPLO,
}: {
  experiencias?: ExperienciaMaqueta[]
}) {
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
          {experiencias.map((exp) => (
            <tr
              key={exp.id}
              style={{ borderBottom: '1px solid var(--neutro400, #dddddd)' }}
            >
              <td style={tdStyle}>{exp.institucionLaboral || '-'}</td>
              <td style={tdStyle}>{ETIQUETAS_SECTOR[exp.sectorLaboral] || exp.sectorLaboral}</td>
              <td style={tdStyle}>{exp.puestoDesempenado || '-'}</td>
              <td style={tdStyle}>{exp.areaAdscripcion || '-'}</td>
              <td style={tdStyle}>{exp.aniosExperiencia || '-'}</td>
              <td style={{ ...tdStyle, maxWidth: '400px' }}>{exp.funcionesPrincipales || '-'}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {/* Botones de maqueta: no tienen manejador a propósito. */}
                  <button type="button" style={btnAccionStyle} title="Editar experiencia">
                    Editar
                  </button>
                  <button
                    type="button"
                    style={{ ...btnAccionStyle, color: 'var(--rojo500, #9B0F15)' }}
                    title="Eliminar experiencia"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* =========================================================================
 * Formulario: mismos 6 campos y rejilla de 3 columnas del acordeón 4
 * ========================================================================= */

/** Valores precargados para ver el formulario con contenido en la maqueta. */
const VALORES_EJEMPLO: ExperienciaMaqueta = {
  id: 0,
  institucionLaboral: 'Secretaría de Hacienda y Crédito Público',
  sectorLaboral: 'PUBLICO_FEDERAL',
  puestoDesempenado: 'Jefe de Departamento',
  areaAdscripcion: 'Dirección General',
  fechaInicioLaboral: null,
  fechaFinLaboral: null,
  aniosExperiencia: '',
  funcionesPrincipales: '',
}

export function FormExperienciaMaqueta({ valores = VALORES_EJEMPLO }: {
  valores?: ExperienciaMaqueta
}) {
  /* Maqueta: se muestra el estado de error del último campo para revisar el
     estilo, sin que dependa de validación real. */
  const mostrarError = true

  return (
    <>
      <SndMensaje tipo="info">Estás capturando una experiencia laboral (vista de maqueta).</SndMensaje>
      <div className="padron-form-grid" style={{ marginTop: '12px' }}>
        <div className="campo">
          <label htmlFor="exp-institucion" className="b1sb">
            Institución
          </label>
          <InputText
            id="exp-institucion"
            value={valores.institucionLaboral}
            onChange={() => {}}
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
            onChange={() => {}}
            appendTo="self"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-puesto" className="b1sb">
            Puesto Desempeñado
          </label>
          <InputText
            id="exp-puesto"
            value={valores.puestoDesempenado}
            onChange={() => {}}
            placeholder="Ej. Jefe de Departamento"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-area" className="b1sb">
            Área de Adscripción
          </label>
          <InputText
            id="exp-area"
            value={valores.areaAdscripcion}
            onChange={() => {}}
            placeholder="Ej. Dirección General"
          />
        </div>

        <div className="campo">
          <label htmlFor="exp-inicio" className="b1sb">
            Fecha de inicio
          </label>
          <Calendar
            inputId="exp-inicio"
            value={valores.fechaInicioLaboral}
            onChange={() => {}}
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
            value={valores.fechaFinLaboral}
            onChange={() => {}}
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
            invalid={mostrarError}
            onChange={() => {}}
            placeholder="Ej. 5"
          />
          {mostrarError && (
            <span className="campo__error">Indica los años de experiencia comprobable.</span>
          )}
        </div>

        <div className="campo padron-form-grid__col-3">
          <label htmlFor="exp-funciones" className="b1sb">
            Comentarios / Funciones Principales <span className="requerido">*</span>
          </label>
          <textarea
            id="exp-funciones"
            className={`padron-textarea ${mostrarError ? 'padron-textarea--invalido' : ''}`}
            value={valores.funcionesPrincipales}
            onChange={() => {}}
            placeholder="Describe las actividades técnicas, administrativas o profesionales desempeñadas..."
          />
          {mostrarError && (
            <span className="campo__error">
              La descripción de funciones principales es obligatoria para acreditar experiencia.
            </span>
          )}
        </div>
      </div>
    </>
  )
}

/* =========================================================================
 * Sección: la "cabecera de acordeón" + tabla + formulario, en una maqueta
 * ========================================================================= */

/**
 * Maqueta completa de la sección de Experiencia laboral.
 *
 * `vista` alterna entre tabla y formulario igual que `ToggleTabla` en el
 * padrón, pero es una prop fija: no hay estado propio ni interruptor real.
 */
export function ExperienciaMaqueta({ vista = 'tabla' }: { vista?: 'tabla' | 'formulario' }) {
  const completa = true

  return (
    <article className="honorarios-tarjeta">
      {/* Cabecera equivalente a la del acordeón 4 */}
      <div className="padron-acordeon__cabecera">
        <div className="padron-acordeon__titulo-grupo">
          <span className="padron-acordeon__icono">
            <SndIcono nombre="snd-calendar" tamano={22} />
          </span>
          <div>
            <span className="sh0b" style={{ display: 'block' }}>
              4. Experiencia Laboral
            </span>
            <span className="sdr" style={{ color: 'var(--neutro600)' }}>
              Área de experiencia, Años de experiencia
            </span>
          </div>
        </div>
        <SndPildora tipo={completa ? 'exito' : 'alerta'}>
          {completa ? 'Completado' : 'Por capturar'}
        </SndPildora>
      </div>

      <div style={{ marginTop: '16px' }}>
        {vista === 'formulario' ? <FormExperienciaMaqueta /> : <TablaExperienciaMaqueta />}
      </div>

      {/* Botón equivalente al "Experiencia nueva" / "Guardar" de la sección */}
      <SndBoton type="button" style={{ marginTop: '1rem' }}>
        {vista === 'formulario' ? 'Guardar experiencia laboral' : 'Experiencia nueva'}
      </SndBoton>
    </article>
  )
}

export default ExperienciaMaqueta
