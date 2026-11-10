import { UNIDADES_ADMINISTRATIVAS } from "../../services"

export const OPCIONES_TIPO_MODELO = [
  { label: 'Honorarios Capítulo 1000 (Persona Física)', value: 'CAP_1000' },
  { label: 'Honorarios Asimilados a Salarios (Art. 94 LISR)', value: 'ASIMILADOS' },
  { label: 'Servicios Profesionales Capítulo 3000', value: 'CAP_3000' },
  { label: 'Prestación de Servicios por Obra Determinada', value: 'OBRA_DETERMINADA' },
  { label: 'Convenio Modificatorio de Monto / Plazo', value: 'CONVENIO_MODIFICATORIO' },
]

export const OPCIONES_PARTIDA = [
  { label: '12101 - Honorarios', value: '12101' },
  { label: '33101 - Asesorías asociadas a convenios o tratados', value: '33101' },
  { label: '33901 - Subcontratación de servicios con terceros', value: '33901' },
]

export const OPCIONES_PERIODICIDAD_PAGO = [
  { label: 'Mensual (mes vencido)', value: 'MENSUAL' },
  { label: 'Quincenal', value: 'QUINCENAL' },
  { label: 'Contra entrega de producto dictaminado', value: 'CONTRA_ENTREGABLE' },
]

export const OPCIONES_MODALIDAD = [
  { label: 'Presencial en sede institucional', value: 'PRESENCIAL' },
  { label: 'Híbrida (presencial y remota)', value: 'HIBRIDA' },
  { label: 'A distancia / Remota', value: 'REMOTA' },
]

export const OPCIONES_PERIODICIDAD_ACTIVIDAD = [
  { label: 'Mensual', value: 'MENSUAL' },
  { label: 'Quincenal', value: 'QUINCENAL' },
  { label: 'Bimestral', value: 'BIMESTRAL' },
  { label: 'Trimestral', value: 'TRIMESTRAL' },
  { label: 'Permanente durante la vigencia', value: 'PERMANENTE' },
]

export const OPCIONES_NIVEL_HOMOLOGACION = [
  { label: 'Enlace / Operativo Especializado', value: 'ENLACE' },
  { label: 'Jefe de Departamento Homologado', value: 'JEFE_DEPTO' },
  { label: 'Subdirección de Área Homologada', value: 'SUBDIRECCION' },
  { label: 'Dirección de Área / Especialista Senior', value: 'DIRECCION' },
  { label: 'Asesoría Técnica / Jurídica Especializada', value: 'ASESORIA' },
]

export const OPCIONES_TIPO_ENTREGABLE = [
  { label: 'Informe mensual de actividades firmado', value: 'INFORME_MENSUAL' },
  { label: 'Dictamen técnico o jurídico', value: 'DICTAMEN' },
  { label: 'Expediente documental integrado', value: 'EXPEDIENTE' },
  { label: 'Base de datos / Reporte estadístico', value: 'BASE_DATOS' },
  { label: 'Manual, guía o proyecto normativo', value: 'DOCUMENTO_NORMATIVO' },
]

export const OPCIONES_FORMATO_ENTREGA = [
  { label: 'Digital PDF firmado con e.firma (FIEL)', value: 'PDF_EFIRMA' },
  { label: 'Impreso con firma autógrafa y respaldo digital', value: 'IMPRESO_DIGITAL' },
  { label: 'Carga en repositorio institucional SABG', value: 'REPOSITORIO' },
]

export const OPCIONES_IMPACTO = [
  { label: 'D1', value: '1' },
  { label: 'I2', value: '2' },
  { label: 'C3', value: '3' },
]

export const OPCIONES_NIVEL_ESTUDIOS = [
  { label: 'Bachillerato / Equivalente', value: 'BACHILLERATO' },
  { label: 'Técnico Superior Universitario', value: 'TSU' },
  { label: 'Licenciatura / Ingeniería', value: 'LICENCIATURA' },
  { label: 'Especialidad', value: 'ESPECIALIDAD' },
  { label: 'Maestría', value: 'MAESTRIA' },
  { label: 'Doctorado', value: 'DOCTORADO' },
]

export const OPCIONES_ESTATUS_ESTUDIOS = [
  { label: 'Titulado(a) con Cédula', value: 'TITULADO' },
  { label: 'En trámite de titulación', value: 'TRAMITE' },
  { label: 'Pasante / Carta de pasante', value: 'PASANTE' },
  { label: 'Certificado total de estudios', value: 'CERTIFICADO' },
]

export const OPCIONES_DOCUMENTO_ACADEMICO = [
  { label: 'Cédula Profesional Electrónica', value: 'CEDULA' },
  { label: 'Título Profesional', value: 'TITULO' },
  { label: 'Acta de Examen Profesional', value: 'ACTA' },
  { label: 'Constancia Oficial de Estudios', value: 'CONSTANCIA' },
]

export const OPCIONES_SECTOR_LABORAL = [
  { label: 'Sector Público Federal (APF)', value: 'PUBLICO_FEDERAL' },
  { label: 'Sector Público Estatal / Municipal', value: 'PUBLICO_LOCAL' },
  { label: 'Sector Privado', value: 'PRIVADO' },
  { label: 'Académico / Investigación', value: 'ACADEMICO' },
  { label: 'Organismo Autónomo / Social', value: 'AUTONOMO' },
]

export const OPCIONES_AREA_ESPECIFICA = [
  { label: 'Jurídico, Normatividad y Contratos', value: 'JURIDICO' },
  { label: 'Administración, Presupuesto y Finanzas', value: 'FINANZAS' },
  { label: 'Recursos Humanos y Servicio Profesional', value: 'RECURSOS_HUMANOS' },
  { label: 'Tecnologías de la Información y Sistemas', value: 'TI' },
  { label: 'Auditoría, Fiscalización y Control Interno', value: 'AUDITORIA' },
  { label: 'Contrataciones Públicas y Adquisiciones', value: 'CONTRATACIONES' },
]

export const DATOS_INICIALES = {
  // 1. Datos Contrato
  claveModelo: '',
  nombreModelo: '',
  tipoContrato: 'CAP_1000' as string | null,
  unidadAdministrativa: UNIDADES_ADMINISTRATIVAS[0] as string | null,
  partidaPresupuestal: '12101' as string | null,
  montoBrutoMensual: '',
  periodicidadPago: 'MENSUAL' as string | null,
  fechaInicioVigencia: null as Date | null,
  fechaFinVigencia: null as Date | null,
  oficioDictamen: '',
  objetoContrato: '',
}

export const ACTIVIDADES_INICIALES = {
  // 2. Actividades
  claveActividad: '',
  funcionPrincipal: '',
  periodicidadActividad: 'MENSUAL' as string | null,
  modalidadServicio: 'PRESENCIAL' as string | null,
  nivelHomologacion: 'SUBDIRECCION' as string | null,
  areaSupervisora: '',
  descripcionActividades: '',
}

export const ENTREGABLES_INICIALES = {
  nombreEntregable: '',
  tipoEntregable: 'INFORME_MENSUAL' as string | null,
  periodicidadEntregable: 'MENSUAL' as string | null,
  formatoEntrega: 'PDF_EFIRMA' as string | null,
  diaCorteEntrega: '',
  cargoReceptor: '',
  criteriosAceptacion: '',
  fechaEntregable: null as Date | null,
  impacto: null as string | null,
}

export const ESCOLARIDAD_INICIALES = {
  nivelEstudios: 'LICENCIATURA' as string | null,
  carreraRequerida: '',
  estatusEstudios: 'TITULADO' as string | null,
  documentoComprobatorio: 'CEDULA' as string | null,
  numeroCertificado: '',
}

export const EXPERIENCIA_INICIALES = {
  areaGeneralExperiencia: 'PUBLICO_FEDERAL' as string | null,
  areaEspecificaExperiencia: 'JURIDICO' as string | null,
  aniosExperiencia: '',
  comentariosExperiencia: '',
}

export const formInicial = {
  entregables: ENTREGABLES_INICIALES,
  escolarida: ESCOLARIDAD_INICIALES,
  experiencia: EXPERIENCIA_INICIALES,
  contrato: DATOS_INICIALES,
  actividades: ACTIVIDADES_INICIALES

}
export type FormaDatos = typeof formInicial