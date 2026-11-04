import TablaEscolaridad, { type EscolaridadItem } from '../../../components/TablaEscolaridad'
import {
  SeccionGenerica,
  type CampoDef,
  type ColumnaDef,
  type Fila,
} from '../../../components/SeccionGenerica'

/**
 * Sección "Escolaridad" del padrón.
 *
 * Mismo comportamiento que Dirección (tabla → formulario → guardar → tabla, con
 * Editar/Eliminar y validación) usando `SeccionGenerica`, que aquí solo se
 * configura con datos: campos, columnas y valores iniciales.
 */

const OPCIONES_NIVEL_ESTUDIOS = [
  { label: 'Bachillerato / Equivalente', value: 'BACHILLERATO' },
  { label: 'Técnico Superior Universitario', value: 'TSU' },
  { label: 'Licenciatura / Ingeniería', value: 'LICENCIATURA' },
  { label: 'Especialidad', value: 'ESPECIALIDAD' },
  { label: 'Maestría', value: 'MAESTRIA' },
  { label: 'Doctorado', value: 'DOCTORADO' },
]

const OPCIONES_ESTATUS_ESTUDIOS = [
  { label: 'Titulado(a) con Cédula', value: 'TITULADO' },
  { label: 'En trámite de titulación', value: 'TRAMITE' },
  { label: 'Pasante / Carta de pasante', value: 'PASANTE' },
  { label: 'Certificado total de estudios', value: 'CERTIFICADO' },
]

const OPCIONES_DOCUMENTO_ACADEMICO = [
  { label: 'Cédula Profesional Electrónica', value: 'CEDULA' },
  { label: 'Título Profesional', value: 'TITULO' },
  { label: 'Acta de Examen Profesional', value: 'ACTA' },
  { label: 'Constancia Oficial de Estudios', value: 'CONSTANCIA' },
]

const NIVEL: Record<string, string> = Object.fromEntries(
  OPCIONES_NIVEL_ESTUDIOS.map(({ value, label }) => [value, label]),
)
const ESTATUS: Record<string, string> = Object.fromEntries(
  OPCIONES_ESTATUS_ESTUDIOS.map(({ value, label }) => [value, label]),
)
const DOCUMENTO: Record<string, string> = Object.fromEntries(
  OPCIONES_DOCUMENTO_ACADEMICO.map(({ value, label }) => [value, label]),
)

/** Campos del formulario, en el orden de la rejilla del padrón. */
const CAMPOS_ESCOLARIDAD: CampoDef[] = [
  {
    clave: 'nivelEstudios',
    etiqueta: 'Nivel Máximo de Estudios',
    tipo: 'opcion',
    opciones: OPCIONES_NIVEL_ESTUDIOS,
    requerido: true,
    placeholder: 'Selecciona nivel académico',
    mensajeError: 'Selecciona el nivel máximo de estudios.',
  },
  {
    clave: 'carrera',
    etiqueta: 'Área de estudio',
    ancho: 2,
    requerido: true,
    placeholder: 'Ej. Licenciatura en Derecho / Ingeniería en Sistemas',
    mensajeError: 'La carrera o área de conocimiento es obligatoria.',
  },
  {
    clave: 'institucionEducativa',
    etiqueta: 'Institución Educativa',
    placeholder: 'Ej. Universidad Nacional Autónoma de México',
  },
  {
    clave: 'estatusEstudios',
    etiqueta: 'Grado de avance',
    tipo: 'opcion',
    opciones: OPCIONES_ESTATUS_ESTUDIOS,
    requerido: true,
    placeholder: 'Selecciona grado de avance',
  },
  {
    clave: 'documentoComprobatorio',
    etiqueta: 'Documento Comprobatorio',
    tipo: 'opcion',
    opciones: OPCIONES_DOCUMENTO_ACADEMICO,
    placeholder: 'Selecciona documento',
  },
  {
    clave: 'cedulaProfesional',
    etiqueta: 'Número de Certificado / Cédula Profesional',
    maxLength: 10,
    soloDigitos: true,
    placeholder: 'Ej. 08945123',
  },
  {
    clave: 'anioTitulacion',
    etiqueta: 'Año de Titulación',
    maxLength: 4,
    soloDigitos: true,
    placeholder: 'Ej. 2013',
  },
]

/** Columnas de la tabla, con las etiquetas traducidas del catálogo. */
const COLUMNAS_ESCOLARIDAD: ColumnaDef[] = [
  { encabezado: 'Nivel de Estudios', valor: (f) => NIVEL[String(f.nivelEstudios)] ?? '-' },
  { encabezado: 'Área de Estudio / Carrera', clave: 'carrera' },
  { encabezado: 'Institución Educativa', clave: 'institucionEducativa' },
  { encabezado: 'Grado de Avance', valor: (f) => ESTATUS[String(f.estatusEstudios)] ?? '-' },
  { encabezado: 'Documento Comprobatorio', valor: (f) => DOCUMENTO[String(f.documentoComprobatorio)] ?? '-' },
  { encabezado: 'Núm. Certificado / Cédula', clave: 'cedulaProfesional' },
  { encabezado: 'Año de Titulación', clave: 'anioTitulacion' },
]

const ESCOLARIDAD_VACIA: Fila = {
  nivelEstudios: 'LICENCIATURA',
  carrera: '',
  institucionEducativa: '',
  estatusEstudios: 'TITULADO',
  documentoComprobatorio: 'CEDULA',
  cedulaProfesional: '',
  anioTitulacion: '',
}

export interface SeccionEscolaridadProps {
  /** Renglones capturados (los controla el padrón). */
  registros?: Fila[]
  onRegistrosChange?: (registros: Fila[]) => void
  onGuardar?: (fila: Fila, edicion: boolean) => void
}

export function SeccionEscolaridad({
  registros,
  onRegistrosChange,
  onGuardar,
}: SeccionEscolaridadProps) {
  return (
    <SeccionGenerica
      registros={registros}
      onRegistrosChange={onRegistrosChange}
      onGuardar={onGuardar}
      campos={CAMPOS_ESCOLARIDAD}
      columnas={COLUMNAS_ESCOLARIDAD}
      inicial={ESCOLARIDAD_VACIA}
      vacia="No hay estudios registrados."
      prefijoId="esc"
      textos={{
        nuevo: 'Escolaridad nueva',
        guardar: 'Guardar escolaridad',
        actualizar: 'Actualizar escolaridad',
      }}
    />
  )
}

/**
 * Tabla suelta de escolaridad, para quien no necesite el maestro-detalle.
 * Se tipa con `EscolaridadItem` para conservar el contrato anterior.
 */
export { TablaEscolaridad }
export type { EscolaridadItem }

export default SeccionEscolaridad
