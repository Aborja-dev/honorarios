import { useState, type FormEvent } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import {
  ModalCargaMasiva,
  SndBoton,
  SndBotonEnlace,
  SndIcono,
  SndMensaje,
  useNotificaciones,
} from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'
import { UNIDADES_ADMINISTRATIVAS } from '../services'

const OPCIONES_TIPO_MODELO = [
  { label: 'Honorarios Capítulo 1000 (Persona Física)', value: 'CAP_1000' },
  { label: 'Honorarios Asimilados a Salarios (Art. 94 LISR)', value: 'ASIMILADOS' },
  { label: 'Servicios Profesionales Capítulo 3000', value: 'CAP_3000' },
  { label: 'Prestación de Servicios por Obra Determinada', value: 'OBRA_DETERMINADA' },
  { label: 'Convenio Modificatorio de Monto / Plazo', value: 'CONVENIO_MODIFICATORIO' },
]

const OPCIONES_PARTIDA = [
  { label: '12101 - Honorarios', value: '12101' },
  { label: '33101 - Asesorías asociadas a convenios o tratados', value: '33101' },
  { label: '33901 - Subcontratación de servicios con terceros', value: '33901' },
]

const OPCIONES_PERIODICIDAD_PAGO = [
  { label: 'Mensual (mes vencido)', value: 'MENSUAL' },
  { label: 'Quincenal', value: 'QUINCENAL' },
  { label: 'Contra entrega de producto dictaminado', value: 'CONTRA_ENTREGABLE' },
]

const OPCIONES_MODALIDAD = [
  { label: 'Presencial en sede institucional', value: 'PRESENCIAL' },
  { label: 'Híbrida (presencial y remota)', value: 'HIBRIDA' },
  { label: 'A distancia / Remota', value: 'REMOTA' },
]

const OPCIONES_PERIODICIDAD_ACTIVIDAD = [
  { label: 'Mensual', value: 'MENSUAL' },
  { label: 'Quincenal', value: 'QUINCENAL' },
  { label: 'Bimestral', value: 'BIMESTRAL' },
  { label: 'Trimestral', value: 'TRIMESTRAL' },
  { label: 'Permanente durante la vigencia', value: 'PERMANENTE' },
]

const OPCIONES_NIVEL_HOMOLOGACION = [
  { label: 'Enlace / Operativo Especializado', value: 'ENLACE' },
  { label: 'Jefe de Departamento Homologado', value: 'JEFE_DEPTO' },
  { label: 'Subdirección de Área Homologada', value: 'SUBDIRECCION' },
  { label: 'Dirección de Área / Especialista Senior', value: 'DIRECCION' },
  { label: 'Asesoría Técnica / Jurídica Especializada', value: 'ASESORIA' },
]

const OPCIONES_TIPO_ENTREGABLE = [
  { label: 'Informe mensual de actividades firmado', value: 'INFORME_MENSUAL' },
  { label: 'Dictamen técnico o jurídico', value: 'DICTAMEN' },
  { label: 'Expediente documental integrado', value: 'EXPEDIENTE' },
  { label: 'Base de datos / Reporte estadístico', value: 'BASE_DATOS' },
  { label: 'Manual, guía o proyecto normativo', value: 'DOCUMENTO_NORMATIVO' },
]

const OPCIONES_FORMATO_ENTREGA = [
  { label: 'Digital PDF firmado con e.firma (FIEL)', value: 'PDF_EFIRMA' },
  { label: 'Impreso con firma autógrafa y respaldo digital', value: 'IMPRESO_DIGITAL' },
  { label: 'Carga en repositorio institucional SABG', value: 'REPOSITORIO' },
]

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

const OPCIONES_SECTOR_LABORAL = [
  { label: 'Sector Público Federal (APF)', value: 'PUBLICO_FEDERAL' },
  { label: 'Sector Público Estatal / Municipal', value: 'PUBLICO_LOCAL' },
  { label: 'Sector Privado', value: 'PRIVADO' },
  { label: 'Académico / Investigación', value: 'ACADEMICO' },
  { label: 'Organismo Autónomo / Social', value: 'AUTONOMO' },
]

const OPCIONES_AREA_ESPECIFICA = [
  { label: 'Jurídico, Normatividad y Contratos', value: 'JURIDICO' },
  { label: 'Administración, Presupuesto y Finanzas', value: 'FINANZAS' },
  { label: 'Recursos Humanos y Servicio Profesional', value: 'RECURSOS_HUMANOS' },
  { label: 'Tecnologías de la Información y Sistemas', value: 'TI' },
  { label: 'Auditoría, Fiscalización y Control Interno', value: 'AUDITORIA' },
  { label: 'Contrataciones Públicas y Adquisiciones', value: 'CONTRATACIONES' },
]

const ESTILOS_ACORDEON_MODELO = `
  .padron-form-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 20px;
  }
  .padron-form-grid__col-2 {
    grid-column: span 2;
  }
  .padron-form-grid__col-3 {
    grid-column: 1 / -1;
  }
  .padron-acordeon .p-accordion-tab {
    margin-bottom: 14px;
    border-radius: 16px;
    border: 1px solid var(--neutro400, #dddddd);
    background: var(--neutro100, #ffffff);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  .padron-acordeon .p-accordion-header .p-accordion-header-link {
    padding: 18px 22px;
    background: var(--neutro200, #f9f9f9);
    color: var(--neutro800, #222222);
    border: 0;
    border-radius: 0;
    transition: background-color 150ms ease, color 150ms ease;
    text-decoration: none;
  }
  .padron-acordeon .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
    background: var(--gama100, #f9ebf0);
    color: var(--gama900, #611232);
    border-bottom: 1px solid var(--gama300, var(--neutro400));
  }
  .padron-acordeon .p-accordion-header:not(.p-disabled) .p-accordion-header-link:hover {
    background: var(--gama100, #f9ebf0);
    color: var(--principal, #9B2247);
  }
  .padron-acordeon .p-accordion-header:not(.p-disabled) .p-accordion-header-link:focus-visible {
    box-shadow: inset 0 0 0 2px var(--principal, #9B2247);
    outline: none;
  }
  .padron-acordeon .p-accordion-content {
    padding: 22px 24px;
    background: var(--neutro100, #ffffff);
    border: 0;
  }
  .padron-acordeon__cabecera {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    flex-wrap: wrap;
  }
  .padron-acordeon__titulo-grupo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .padron-acordeon__icono {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--principal, #9B2247);
    color: #ffffff;
    flex: none;
  }
  .padron-textarea {
    width: 100%;
    min-height: 92px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 1rem;
    border: 1px solid var(--neutro600, #767676);
    border-radius: 8px;
    color: var(--neutro800, #222222);
    background: var(--neutro100, #ffffff);
    resize: vertical;
  }
  .padron-textarea:focus {
    border-color: var(--principal, #9B2247);
    outline: none;
  }
  .padron-textarea--invalido {
    border-color: var(--rojo500, #9B0F15);
    box-shadow: 0 0 0 1px var(--rojo500, #9B0F15);
  }
  @media (max-width: 960px) {
    .padron-form-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .padron-form-grid__col-2 {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 640px) {
    .padron-form-grid {
      grid-template-columns: 1fr;
    }
  }
`

/**
 * Pantalla dedicada "Alta de modelos de contratos" (`src/pages/AltaModelosContratos.tsx`).
 * Contiene el formulario integral estructurado en cinco acordeones con el estilo institucional del SND:
 * 1. Datos Contrato
 * 2. Actividades
 * 3. Entregables
 * 4. Escolaridad
 * 5. Experiencia Laboral
 */
export default function AltaModelosContratos() {
  useTitulo('Alta de Modelos de Contratos · Módulo de Honorarios')
  const notificar = useNotificaciones()

  // Control de pestañas abiertas en el acordeón (permite abrir una o varias secciones)
  const [acordeonesActivos, setAcordeonesActivos] = useState<number | number[]>([0])
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [folioGenerado, setFolioGenerado] = useState<string | null>(null)
  const [modalCargaMasivaAbierto, setModalCargaMasivaAbierto] = useState(false)

  // 1. Estado: Datos Contrato
  const [claveModelo, setClaveModelo] = useState('')
  const [nombreModelo, setNombreModelo] = useState('')
  const [tipoContrato, setTipoContrato] = useState<string | null>('CAP_1000')
  const [unidadAdministrativa, setUnidadAdministrativa] = useState<string | null>(
    UNIDADES_ADMINISTRATIVAS[0],
  )
  const [partidaPresupuestal, setPartidaPresupuestal] = useState<string | null>('12101')
  const [montoBrutoMensual, setMontoBrutoMensual] = useState('')
  const [periodicidadPago, setPeriodicidadPago] = useState<string | null>('MENSUAL')
  const [fechaInicioVigencia, setFechaInicioVigencia] = useState<Date | null>(null)
  const [fechaFinVigencia, setFechaFinVigencia] = useState<Date | null>(null)
  const [oficioDictamen, setOficioDictamen] = useState('')
  const [objetoContrato, setObjetoContrato] = useState('')

  // 2. Estado: Actividades
  const [claveActividad, setClaveActividad] = useState('')
  const [funcionPrincipal, setFuncionPrincipal] = useState('')
  const [periodicidadActividad, setPeriodicidadActividad] = useState<string | null>('MENSUAL')
  const [modalidadServicio, setModalidadServicio] = useState<string | null>('PRESENCIAL')
  const [nivelHomologacion, setNivelHomologacion] = useState<string | null>('SUBDIRECCION')
  const [areaSupervisora, setAreaSupervisora] = useState('')
  const [descripcionActividades, setDescripcionActividades] = useState('')

  // 3. Estado: Entregables
  const [nombreEntregable, setNombreEntregable] = useState('')
  const [tipoEntregable, setTipoEntregable] = useState<string | null>('INFORME_MENSUAL')
  const [periodicidadEntregable, setPeriodicidadEntregable] = useState<string | null>('MENSUAL')
  const [formatoEntrega, setFormatoEntrega] = useState<string | null>('PDF_EFIRMA')
  const [diaCorteEntrega, setDiaCorteEntrega] = useState('')
  const [cargoReceptor, setCargoReceptor] = useState('')
  const [criteriosAceptacion, setCriteriosAceptacion] = useState('')

  // 4. Estado: Escolaridad
  const [nivelEstudios, setNivelEstudios] = useState<string | null>('LICENCIATURA')
  const [carreraRequerida, setCarreraRequerida] = useState('')
  const [estatusEstudios, setEstatusEstudios] = useState<string | null>('TITULADO')
  const [documentoComprobatorio, setDocumentoComprobatorio] = useState<string | null>('CEDULA')
  const [numeroCertificado, setNumeroCertificado] = useState('')

  // 5. Estado: Experiencia Laboral
  const [areaGeneralExperiencia, setAreaGeneralExperiencia] = useState<string | null>('PUBLICO_FEDERAL')
  const [areaEspecificaExperiencia, setAreaEspecificaExperiencia] = useState<string | null>('JURIDICO')
  const [aniosExperiencia, setAniosExperiencia] = useState('')
  const [comentariosExperiencia, setComentariosExperiencia] = useState('')

  // Validaciones por cada una de las 5 secciones
  const seccionDatosContratoCompleta = Boolean(
    claveModelo.trim() &&
    nombreModelo.trim() &&
    tipoContrato &&
    unidadAdministrativa &&
    partidaPresupuestal &&
    montoBrutoMensual.trim() &&
    fechaInicioVigencia &&
    fechaFinVigencia &&
    objetoContrato.trim(),
  )

  const seccionActividadesCompleta = Boolean(
    funcionPrincipal.trim() &&
    periodicidadActividad &&
    areaSupervisora.trim() &&
    descripcionActividades.trim(),
  )

  const seccionEntregablesCompleta = Boolean(
    nombreEntregable.trim() &&
    tipoEntregable &&
    periodicidadEntregable &&
    diaCorteEntrega.trim() &&
    cargoReceptor.trim() &&
    criteriosAceptacion.trim(),
  )

  const seccionEscolaridadCompleta = Boolean(
    nivelEstudios && carreraRequerida.trim() && estatusEstudios,
  )

  const seccionExperienciaCompleta = Boolean(
    areaGeneralExperiencia &&
    areaEspecificaExperiencia &&
    aniosExperiencia.trim() &&
    comentariosExperiencia.trim(),
  )

  const totalSeccionesCompletas = [
    seccionDatosContratoCompleta,
    seccionActividadesCompleta,
    seccionEntregablesCompleta,
    seccionEscolaridadCompleta,
    seccionExperienciaCompleta,
  ].filter(Boolean).length

  const expandirTodo = () => setAcordeonesActivos([0, 1, 2, 3, 4])
  const colapsarTodo = () => setAcordeonesActivos([])

  const cargarDatosEjemplo = () => {
    setClaveModelo('MOD-JUR-2026-04')
    setNombreModelo('Modelo Estándar Capítulo 1000 · Especialista en Normatividad')
    setTipoContrato('CAP_1000')
    setUnidadAdministrativa('Unidad de Asuntos Jurídicos')
    setPartidaPresupuestal('12101')
    setMontoBrutoMensual('38500.00')
    setPeriodicidadPago('MENSUAL')
    setFechaInicioVigencia(new Date(2026, 0, 1))
    setFechaFinVigencia(new Date(2026, 11, 31))
    setOficioDictamen('UAJ/DGNC/2026/0418')
    setObjetoContrato(
      'Prestación de servicios profesionales por honorarios para la dictaminación jurídica, revisión de anexos técnicos y validación normativa de contratos institucionales del Ejercicio Fiscal 2026.',
    )

    setClaveActividad('ACT-HON-01')
    setFuncionPrincipal('Análisis y dictaminación técnico-jurídica de expedientes contractuales')
    setPeriodicidadActividad('MENSUAL')
    setModalidadServicio('PRESENCIAL')
    setNivelHomologacion('SUBDIRECCION')
    setAreaSupervisora('Dirección de Normatividad y Consulta')
    setDescripcionActividades(
      '1. Revisar proyectos de contratos y convenios modificatorios.\n2. Verificar el cumplimiento de suficiencia presupuestal y compatibilidad de empleo.\n3. Elaborar opiniones jurídicas e integrar el anexo técnico correspondiente.',
    )

    setNombreEntregable('Informe mensual de actividades y relación de expedientes dictaminados')
    setTipoEntregable('INFORME_MENSUAL')
    setPeriodicidadEntregable('MENSUAL')
    setFormatoEntrega('PDF_EFIRMA')
    setDiaCorteEntrega('Último día hábil de cada mes')
    setCargoReceptor('Titular de la Dirección de Normatividad y Consulta')
    setCriteriosAceptacion(
      'El entregable deberá contener la bitácora detallada de folios atendidos, acuses de validación presupuestal y firma electrónica avanzada (e.firma) vigente del prestador.',
    )

    setNivelEstudios('LICENCIATURA')
    setCarreraRequerida('Licenciatura en Derecho, Administración Pública o afín')
    setEstatusEstudios('TITULADO')
    setDocumentoComprobatorio('CEDULA')
    setNumeroCertificado('08945123')

    setAreaGeneralExperiencia('PUBLICO_FEDERAL')
    setAreaEspecificaExperiencia('JURIDICO')
    setAniosExperiencia('4')
    setComentariosExperiencia(
      'Experiencia comprobable en elaboración y revisión de contratos gubernamentales bajo el régimen del Capítulo 1000, normatividad de la APF y control presupuestal.',
    )

    setIntentoEnvio(false)
    setAcordeonesActivos([0, 1, 2, 3, 4])
    notificar.info('Se cargaron datos de demostración en las cinco secciones del modelo de contrato.')
  }

  const limpiarFormulario = () => {
    setClaveModelo('')
    setNombreModelo('')
    setTipoContrato('CAP_1000')
    setUnidadAdministrativa(UNIDADES_ADMINISTRATIVAS[0])
    setPartidaPresupuestal('12101')
    setMontoBrutoMensual('')
    setPeriodicidadPago('MENSUAL')
    setFechaInicioVigencia(null)
    setFechaFinVigencia(null)
    setOficioDictamen('')
    setObjetoContrato('')

    setClaveActividad('')
    setFuncionPrincipal('')
    setPeriodicidadActividad('MENSUAL')
    setModalidadServicio('PRESENCIAL')
    setNivelHomologacion('SUBDIRECCION')
    setAreaSupervisora('')
    setDescripcionActividades('')

    setNombreEntregable('')
    setTipoEntregable('INFORME_MENSUAL')
    setPeriodicidadEntregable('MENSUAL')
    setFormatoEntrega('PDF_EFIRMA')
    setDiaCorteEntrega('')
    setCargoReceptor('')
    setCriteriosAceptacion('')

    setNivelEstudios('LICENCIATURA')
    setCarreraRequerida('')
    setEstatusEstudios('TITULADO')
    setDocumentoComprobatorio('CEDULA')
    setNumeroCertificado('')

    setAreaGeneralExperiencia('PUBLICO_FEDERAL')
    setAreaEspecificaExperiencia('JURIDICO')
    setAniosExperiencia('')
    setComentariosExperiencia('')

    setIntentoEnvio(false)
    setFolioGenerado(null)
    setAcordeonesActivos([0])
    notificar.info('Formulario reiniciado correctamente.')
  }

  const guardarModeloContrato = (e: FormEvent) => {
    e.preventDefault()
    setIntentoEnvio(true)

    if (
      !seccionDatosContratoCompleta ||
      !seccionActividadesCompleta ||
      !seccionEntregablesCompleta ||
      !seccionEscolaridadCompleta ||
      !seccionExperienciaCompleta
    ) {
      const pendientes: number[] = []
      if (!seccionDatosContratoCompleta) pendientes.push(0)
      if (!seccionActividadesCompleta) pendientes.push(1)
      if (!seccionEntregablesCompleta) pendientes.push(2)
      if (!seccionEscolaridadCompleta) pendientes.push(3)
      if (!seccionExperienciaCompleta) pendientes.push(4)
      setAcordeonesActivos(pendientes)
      notificar.error(
        'Por favor completa los campos obligatorios marcados con asterisco (*) en las cinco secciones.',
        'Campos pendientes',
      )
      return
    }

    const nuevoFolio = `MOD-HON-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setFolioGenerado(nuevoFolio)
    notificar.exito(
      `El modelo de contrato "${nombreModelo}" fue registrado con el folio ${nuevoFolio}.`,
      'Alta de Modelo Exitosa',
    )
  }

  return (
    <div className="contenedor">
      <style>{ESTILOS_ACORDEON_MODELO}</style>

      {/* ENCABEZADO INSTITUCIONAL DE LA PANTALLA */}
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Información del modelo de contrato
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Registro de datos del contrato, actividades, entregables, escolaridad y experiencia laboral
          </p>
        </div>
        <div className="fila">

          <SndBotonEnlace variante="secundario" to="/admin/modelo-contrato">
            Ver catálogo de modelos
          </SndBotonEnlace>
        </div>
      </div>

      {/* BARRA DE PROGRESO Y CONTROLES DE ACORDEÓN */}
      <article className="honorarios-tarjeta" style={{ marginTop: 20 }}>
        <div className="honorarios-detalle-barra">
          <div className="fila">
            <span className="b1sb color--principal">Avance de captura:</span>
            <span className={`pildora pildora--${totalSeccionesCompletas === 5 ? 'exito' : 'info'} snd-pildora`}>
              <span className="pildora__dot" aria-hidden="true" />
              {totalSeccionesCompletas} de 5 secciones completas
            </span>
            {folioGenerado && (
              <span className="pildora pildora--exito snd-pildora">
                <span className="pildora__dot" aria-hidden="true" />
                Folio asignado: {folioGenerado}
              </span>
            )}
          </div>

          <div className="fila">
            <SndBoton
              variante="secundario"
              type="button"
              onClick={() => setModalCargaMasivaAbierto(true)}
            >
              <SndIcono nombre="snd-document" tamano={18} />
              Carga masiva
            </SndBoton>
            <SndBoton variante="secundario" type="button" onClick={expandirTodo}>
              Expandir las 5 secciones
            </SndBoton>
            <SndBoton variante="fantasma" type="button" onClick={colapsarTodo}>
              Contraer todo
            </SndBoton>
          </div>
        </div>
      </article>

      {folioGenerado && (
        <div style={{ marginTop: 16 }}>
          <SndMensaje tipo="exito">
            <p>
              <strong>El Modelo de Contrato ({folioGenerado}) ha sido guardado correctamente.</strong> Los datos del
              contrato, actividades, entregables, escolaridad y experiencia laboral de{' '}
              <strong>{nombreModelo}</strong> han quedado registrados y listos para su uso en la formalización de
              contratos.
            </p>
          </SndMensaje>
        </div>
      )}

      {/* FORMULARIO CON LOS CINCO ACORDEONES */}
      <form onSubmit={guardarModeloContrato} noValidate style={{ marginTop: 20 }}>
        <Accordion
          multiple
          activeIndex={acordeonesActivos}
          onTabChange={(e) => setAcordeonesActivos(e.index)}
          className="padron-acordeon"
        >
          {/* =====================================================================
              ACORDEÓN 1: DATOS CONTRATO
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-document" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      1. Datos Contrato
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Información general del contrato por honorarios

                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionDatosContratoCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionDatosContratoCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid">
              <div className="campo">
                <label htmlFor="dc-clave" className="b1sb">
                  Clave del Modelo de Contrato<span className="requerido">*</span>
                </label>
                <InputText
                  id="dc-clave"
                  value={claveModelo}
                  invalid={intentoEnvio && !claveModelo.trim()}
                  onChange={(e) => setClaveModelo(e.target.value.toUpperCase())}
                  placeholder="Ej. 000000001"
                />
                {intentoEnvio && !claveModelo.trim() && (
                  <span className="campo__error">La clave del modelo es obligatoria.</span>
                )}
              </div>

              <div className="campo padron-form-grid__col-2">
                <label htmlFor="dc-nombre" className="b1sb">
                  Nombre del Modelo de Contrato <span className="requerido">*</span>
                </label>
                <InputText
                  id="dc-nombre"
                  value={nombreModelo}
                  invalid={intentoEnvio && !nombreModelo.trim()}
                  onChange={(e) => setNombreModelo(e.target.value)}
                  placeholder="Ej. Modelo Estándar Capítulo 1000 (Persona Física)"
                />
                {intentoEnvio && !nombreModelo.trim() && (
                  <span className="campo__error">El nombre del modelo de contrato es obligatorio.</span>
                )}
              </div>


              <div className="campo">
                <label htmlFor="dc-unidad" className="b1sb">
                  Unidad Administrativa <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="dc-unidad"
                  options={UNIDADES_ADMINISTRATIVAS.map((u) => ({ label: u, value: u }))}
                  value={unidadAdministrativa}
                  onChange={(e) => setUnidadAdministrativa(e.value)}
                  placeholder="Selecciona unidad administrativa"
                  appendTo="self"
                />
              </div>





              <div className="campo">
                <label htmlFor="dc-oficio" className="b1sb">
                  Proyecto / Objeto del contrato
                </label>
                <InputText
                  id="dc-oficio"
                  value={oficioDictamen}
                  onChange={(e) => setOficioDictamen(e.target.value)}
                  placeholder="Ej. Proyecto para servicios profesionales"
                />
              </div>

              <div className="campo">
                <label htmlFor="dc-fecha-inicio" className="b1sb">
                  Fecha de Inicio de Vigencia <span className="requerido">*</span>
                </label>
                <Calendar
                  inputId="dc-fecha-inicio"
                  value={fechaInicioVigencia}
                  invalid={intentoEnvio && !fechaInicioVigencia}
                  onChange={(e) => setFechaInicioVigencia((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  showIcon
                  appendTo="self"
                />
                {intentoEnvio && !fechaInicioVigencia && (
                  <span className="campo__error">Selecciona la fecha de inicio de vigencia.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="dc-fecha-fin" className="b1sb">
                  Fecha de Término de Vigencia <span className="requerido">*</span>
                </label>
                <Calendar
                  inputId="dc-fecha-fin"
                  value={fechaFinVigencia}
                  invalid={intentoEnvio && !fechaFinVigencia}
                  onChange={(e) => setFechaFinVigencia((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  showIcon
                  appendTo="self"
                />
                {intentoEnvio && !fechaFinVigencia && (
                  <span className="campo__error">Selecciona la fecha de término de vigencia.</span>
                )}
              </div>

              <div className="campo padron-form-grid__col-3">
                <label htmlFor="dc-objeto" className="b1sb">
                  Comentario
                </label>
                <textarea
                  id="dc-objeto"
                  className={`padron-textarea ${intentoEnvio && !objetoContrato.trim() ? 'padron-textarea--invalido' : ''}`}
                  value={objetoContrato}
                  onChange={(e) => setObjetoContrato(e.target.value)}
                  placeholder="Comentario adiciónal al modelo de contrato..."
                />
                {intentoEnvio && !objetoContrato.trim() && (
                  <span className="campo__error">El objeto del contrato es obligatorio.</span>
                )}
              </div>
            </div>

            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionDatosContratoCompleta) {
                  setAcordeonesActivos([1])
                  notificar.exito('Datos del contrato guardados correctamente.')
                } else {
                  notificar.alerta('Por favor completa los datos obligatorios del contrato.')
                }
              }}
            >
              Guardar datos contrato
            </SndBoton>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 2: ACTIVIDADES
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-edit" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      2. Actividades
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>

                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionActividadesCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionActividadesCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid">




              <div className="campo">
                <label htmlFor="act-periodicidad" className="b1sb">
                  ID actividad <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="act-periodicidad"
                  options={OPCIONES_PERIODICIDAD_ACTIVIDAD}
                  value={periodicidadActividad}
                  onChange={(e) => setPeriodicidadActividad(e.value)}
                  appendTo="self"
                />
              </div>


              <div className="campo">
                <label htmlFor="act-modalidad" className="b1sb">
                  Tipo de actividad
                </label>
                <Dropdown
                  inputId="act-modalidad"
                  options={OPCIONES_MODALIDAD}
                  value={modalidadServicio}
                  onChange={(e) => setModalidadServicio(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="dc-fecha-inicio" className="b1sb">
                  Fecha de Inicio<span className="requerido">*</span>
                </label>
                <Calendar
                  inputId="dc-fecha-inicio"
                  value={fechaInicioVigencia}
                  invalid={intentoEnvio && !fechaInicioVigencia}
                  onChange={(e) => setFechaInicioVigencia((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  showIcon
                  appendTo="self"
                />
                {intentoEnvio && !fechaInicioVigencia && (
                  <span className="campo__error">Selecciona la fecha de inicio de vigencia.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="dc-fecha-fin" className="b1sb">
                  Fecha de Fin <span className="requerido">*</span>
                </label>
                <Calendar
                  inputId="dc-fecha-fin"
                  value={fechaFinVigencia}
                  invalid={intentoEnvio && !fechaFinVigencia}
                  onChange={(e) => setFechaFinVigencia((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  showIcon
                  appendTo="self"
                />
                {intentoEnvio && !fechaFinVigencia && (
                  <span className="campo__error">Selecciona la fecha de término de vigencia.</span>
                )}
              </div>




              <div className="campo padron-form-grid__col-3">
                <label htmlFor="act-descripcion" className="b1sb">
                  Descripción actividad <span className="requerido">*</span>
                </label>
                <textarea
                  id="act-descripcion"
                  className={`padron-textarea ${intentoEnvio && !descripcionActividades.trim() ? 'padron-textarea--invalido' : ''}`}
                  value={descripcionActividades}
                  onChange={(e) => setDescripcionActividades(e.target.value)}
                  placeholder="Describe la actividad específica que integrarán el contrato..."
                />
                {intentoEnvio && !descripcionActividades.trim() && (
                  <span className="campo__error">La descripción de actividades es obligatoria.</span>
                )}
              </div>
            </div>

            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionActividadesCompleta) {
                  setAcordeonesActivos([2])
                  notificar.exito('Actividades del modelo guardadas temporalmente.')
                } else {
                  notificar.alerta('Por favor completa los datos obligatorios de actividades.')
                }
              }}
            >
              Guardar actividades
            </SndBoton>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 3: ENTREGABLES
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-checkmark--filled" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      3. Entregables
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Entregables esperados, fecha de entrega, impacto y complejidad.
                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionEntregablesCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionEntregablesCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid">
              <div className="campo padron-form-grid__col-2">
                <label htmlFor="ent-nombre" className="b1sb">
                  Nombre del entregable <span className="requerido">*</span>
                </label>
                <InputText
                  id="ent-nombre"
                  value={nombreEntregable}
                  invalid={intentoEnvio && !nombreEntregable.trim()}
                  onChange={(e) => setNombreEntregable(e.target.value)}
                  placeholder="Ej. Informe mensual de actividades y relación de expedientes"
                />
                {intentoEnvio && !nombreEntregable.trim() && (
                  <span className="campo__error">El nombre del entregable es obligatorio.</span>
                )}
              </div>
              <div className="campo">
                <label htmlFor="dc-fecha-fin" className="b1sb">
                  Fecha entregable <span className="requerido">*</span>
                </label>
                <Calendar
                  inputId="dc-fecha-fin"
                  value={fechaFinVigencia}
                  invalid={intentoEnvio && !fechaFinVigencia}
                  onChange={(e) => setFechaFinVigencia((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  showIcon
                  appendTo="self"
                />
                {intentoEnvio && !fechaFinVigencia && (
                  <span className="campo__error">Selecciona la fecha de término de vigencia.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="ent-tipo" className="b1sb">
                  Tipo de Entregable <span className="requerido">*</span>
                </label>
                <InputText
                  inputId="ent-tipo"
                  options={OPCIONES_TIPO_ENTREGABLE}
                  value={tipoEntregable}
                  onChange={(e) => setTipoEntregable(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="ent-periodicidad" className="b1sb">
                  Periodicidad de Entrega <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="ent-periodicidad"
                  options={OPCIONES_PERIODICIDAD_ACTIVIDAD}
                  value={periodicidadEntregable}
                  onChange={(e) => setPeriodicidadEntregable(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="ent-formato" className="b1sb">
                  Formato y Medio de Entrega
                </label>
                <Dropdown
                  inputId="ent-formato"
                  options={OPCIONES_FORMATO_ENTREGA}
                  value={formatoEntrega}
                  onChange={(e) => setFormatoEntrega(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="ent-corte" className="b1sb">
                  Fecha o Día Límite de Corte <span className="requerido">*</span>
                </label>
                <InputText
                  id="ent-corte"
                  value={diaCorteEntrega}
                  invalid={intentoEnvio && !diaCorteEntrega.trim()}
                  onChange={(e) => setDiaCorteEntrega(e.target.value)}
                  placeholder="Ej. Último día hábil de cada mes"
                />
                {intentoEnvio && !diaCorteEntrega.trim() && (
                  <span className="campo__error">Indica el plazo o día de corte del entregable.</span>
                )}
              </div>

              <div className="campo padron-form-grid__col-3">
                <label htmlFor="ent-receptor" className="b1sb">
                  Cargo del Servidor Público que Recibe y Valida <span className="requerido">*</span>
                </label>
                <InputText
                  id="ent-receptor"
                  value={cargoReceptor}
                  invalid={intentoEnvio && !cargoReceptor.trim()}
                  onChange={(e) => setCargoReceptor(e.target.value)}
                  placeholder="Ej. Titular de la Dirección de Normatividad y Consulta"
                />
                {intentoEnvio && !cargoReceptor.trim() && (
                  <span className="campo__error">El cargo del servidor público validador es obligatorio.</span>
                )}
              </div>

              <div className="campo padron-form-grid__col-3">
                <label htmlFor="ent-criterios" className="b1sb">
                  Criterios de Aceptación y Verificación <span className="requerido">*</span>
                </label>
                <textarea
                  id="ent-criterios"
                  className={`padron-textarea ${intentoEnvio && !criteriosAceptacion.trim() ? 'padron-textarea--invalido' : ''}`}
                  value={criteriosAceptacion}
                  onChange={(e) => setCriteriosAceptacion(e.target.value)}
                  placeholder="Especifica las condiciones de calidad, elementos mínimos y firmas requeridas para liberar el pago..."
                />
                {intentoEnvio && !criteriosAceptacion.trim() && (
                  <span className="campo__error">Los criterios de aceptación son obligatorios.</span>
                )}
              </div>
            </div>

            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionEntregablesCompleta) {
                  setAcordeonesActivos([3])
                  notificar.exito('Entregables del modelo guardados temporalmente.')
                } else {
                  notificar.alerta('Por favor completa los datos obligatorios de entregables.')
                }
              }}
            >
              Guardar entregables
            </SndBoton>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 4: ESCOLARIDAD
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-user" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      4. Escolaridad
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Área de estudio, grado máximo de estudios y registro de certificado requerido
                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionEscolaridadCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionEscolaridadCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid">
              <div className="campo">
                <label htmlFor="esc-nivel" className="b1sb">
                  Nivel Máximo de Estudios <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="esc-nivel"
                  options={OPCIONES_NIVEL_ESTUDIOS}
                  value={nivelEstudios}
                  onChange={(e) => setNivelEstudios(e.value)}
                  placeholder="Selecciona nivel académico"
                  appendTo="self"
                />
              </div>

              <div className="campo padron-form-grid__col-2">
                <label htmlFor="esc-carrera" className="b1sb">
                  Área de estudio <span className="requerido">*</span>
                </label>
                <InputText
                  id="esc-carrera"
                  value={carreraRequerida}
                  invalid={intentoEnvio && !carreraRequerida.trim()}
                  onChange={(e) => setCarreraRequerida(e.target.value)}
                  placeholder="Ej. Licenciatura en Derecho / Ingeniería en Sistemas"
                />
                {intentoEnvio && !carreraRequerida.trim() && (
                  <span className="campo__error">La carrera o área de conocimiento es obligatoria.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="esc-estatus" className="b1sb">
                  Grado de avance <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="esc-estatus"
                  options={OPCIONES_ESTATUS_ESTUDIOS}
                  value={estatusEstudios}
                  onChange={(e) => setEstatusEstudios(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="esc-documento" className="b1sb">
                  Documento Acreditable
                </label>
                <Dropdown
                  inputId="esc-documento"
                  options={OPCIONES_DOCUMENTO_ACADEMICO}
                  value={documentoComprobatorio}
                  onChange={(e) => setDocumentoComprobatorio(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="esc-cedula" className="b1sb">
                  Número de Certificado
                </label>
                <InputText
                  id="esc-cedula"
                  maxLength={10}
                  value={numeroCertificado}
                  onChange={(e) => setNumeroCertificado(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 08945123"
                />
              </div>
            </div>

            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionEscolaridadCompleta) {
                  setAcordeonesActivos([4])
                  notificar.exito('Datos de escolaridad guardados temporalmente.')
                } else {
                  notificar.alerta('Por favor completa los datos de escolaridad obligatorios.')
                }
              }}
            >
              Guardar escolaridad
            </SndBoton>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 5: EXPERIENCIA LABORAL
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-calendar" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      5. Experiencia Laboral
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Área de experiencia, años de experiencia y perfil requerido
                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionExperienciaCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionExperienciaCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid">
              <div className="campo">
                <label htmlFor="exp-area-general" className="b1sb">
                  Área General <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="exp-area-general"
                  options={OPCIONES_SECTOR_LABORAL}
                  value={areaGeneralExperiencia}
                  onChange={(e) => setAreaGeneralExperiencia(e.value)}
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="exp-area-especifica" className="b1sb">
                  Área Específica <span className="requerido">*</span>
                </label>
                <Dropdown
                  inputId="exp-area-especifica"
                  options={OPCIONES_AREA_ESPECIFICA}
                  value={areaEspecificaExperiencia}
                  onChange={(e) => setAreaEspecificaExperiencia(e.value)}
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
                  value={aniosExperiencia}
                  invalid={intentoEnvio && !aniosExperiencia.trim()}
                  onChange={(e) => setAniosExperiencia(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 4"
                />
                {intentoEnvio && !aniosExperiencia.trim() && (
                  <span className="campo__error">Indica los años de experiencia comprobable requeridos.</span>
                )}
              </div>

              <div className="campo padron-form-grid__col-3">
                <label htmlFor="exp-comentarios" className="b1sb">
                  Comentarios <span className="requerido">*</span>
                </label>
                <textarea
                  id="exp-comentarios"
                  className={`padron-textarea ${intentoEnvio && !comentariosExperiencia.trim() ? 'padron-textarea--invalido' : ''}`}
                  value={comentariosExperiencia}
                  onChange={(e) => setComentariosExperiencia(e.target.value)}
                  placeholder="Describe las actividades técnicas, administrativas o profesionales requeridas para el modelo de contrato..."
                />
                {intentoEnvio && !comentariosExperiencia.trim() && (
                  <span className="campo__error">
                    La descripción de experiencia requerida es obligatoria para el modelo.
                  </span>
                )}
              </div>
            </div>

            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionExperienciaCompleta) {
                  notificar.exito('Datos de experiencia laboral guardados temporalmente.')
                } else {
                  notificar.alerta('Por favor completa los datos de experiencia laboral obligatorios.')
                }
              }}
            >
              Guardar experiencia laboral
            </SndBoton>
          </AccordionTab>
        </Accordion>

        {/* BARRA INFERIOR DE ACCIONES DEL FORMULARIO */}
        <article className="honorarios-tarjeta" style={{ marginTop: 12 }}>
          <div className="honorarios-detalle-barra">
            <span className="sdr" style={{ color: 'var(--neutro600)' }}>
              Los campos marcados con <span className="requerido">*</span> son obligatorios para dar de alta la
              plantilla en el Catálogo de Modelos de Contratos.
            </span>

            <div className="fila fila--derecha">
              <SndBoton variante="secundario" type="button" onClick={limpiarFormulario}>
                Limpiar formulario
              </SndBoton>
              <SndBoton type="submit">
                <SndIcono nombre="snd-checkmark--filled" tamano={20} />
                Guardar modelo de contrato
              </SndBoton>
            </div>
          </div>
        </article>
      </form>

      {/* MODAL DE CARGA MASIVA */}
      <ModalCargaMasiva
        visible={modalCargaMasivaAbierto}
        onCerrar={() => setModalCargaMasivaAbierto(false)}
      />
    </div>
  )
}
