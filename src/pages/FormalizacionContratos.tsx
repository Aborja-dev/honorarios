import { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import {
  ModalCargaMasiva,
  SndBoton,
  SndBotonEnlace,
  SndBuscador,
  SndIcono,
  SndMensaje,
  useNotificaciones,
} from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'
import { CATEGORIAS_OPERATIVAS, UNIDADES_ADMINISTRATIVAS } from '../services'
import MenuFlotante from '../components/MenuFlotante'
import { BotonHome } from './BotonHome'
import './PadronPrestadoresServicio.css'
const OPCIONES_SI_NO = [
  { label: 'Sí', value: 'SI' },
  { label: 'No', value: 'NO' },
]

const OPCIONES_MOT_DECPAT = [
  { label: 'PORQUE EL PUESTO ESTÁ COMPRENDIDO EN LAS FRACCIONES II, III, IV, VI, VII, Y XIII DEL ARTÍCULO 36 DE LA LFRASP SIN SER HOMÓLOGOS', value: '1' },
  { label: 'POR MANEJAR O APLICAR RECURSOS ECONÓMICOS, VALORES Y FONDOS DE LA FEDERACIÓN', value: '2' },
  { label: 'POR REALIZAR ACTIVIDADES DE INSPECCIÓN Y VIGILANCIA', value: '3' },
]

const OPCIONES_HON_EXEPCIONES = [
  { label: 'PORQUE EL PUESTO ESTÁ COMPRENDIDO EN LAS FRACCIONES II, III, IV, VI, VII, Y XIII DEL ARTÍCULO 36 DE LA LFRASP SIN SER HOMÓLOGOS', value: '1' },
  { label: 'POR MANEJAR O APLICAR RECURSOS ECONÓMICOS, VALORES Y FONDOS DE LA FEDERACIÓN', value: '2' },
  { label: 'POR REALIZAR ACTIVIDADES DE INSPECCIÓN Y VIGILANCIA', value: '3' },
]

const OPCIONES_RAMO = [
  { label: '27 - Función Pública / Buen Gobierno', value: '27' },
  { label: '06 - Hacienda y Crédito Público', value: '06' },
  { label: '04 - Gobernación', value: '04' },
  { label: '11 - Educación Pública', value: '11' },
  { label: '12 - Salud', value: '12' },
]

const OPCIONES_MODELO_CONTRATO = [
  { label: 'MOD-JUR-2026-01 · Modelo Estándar Capítulo 1000 (Persona Física)', value: 'MOD-JUR-2026-01' },
  { label: 'MOD-JUR-2026-02 · Modelo de Honorarios Asimilados a Salarios', value: 'MOD-JUR-2026-02' },
  { label: 'MOD-JUR-2026-03 · Modelo Convenio Modificatorio de Monto / Plazo', value: 'MOD-JUR-2026-03' },
]


const SECCIONES: ItemMenuFlotante[] = [
  {
    texto: 'Validación de CURP',
    descripcion: 'CURP y periodo del servicio',
    icono: 'snd-document',
    ancla: 'padron-seccion-curp',
    tooltip: 'Validación de CURP',
  },
  {
    texto: 'Datos personales',
    descripcion: 'Nombre, apellidos y RFC',
    icono: 'snd-calendar',
    ancla: 'padron-seccion-personal',
    tooltip: 'Datos personales',
  },
  {
    texto: 'Dirección',
    descripcion: 'Domicilio contractual',
    icono: 'snd-checkmark--filled',
    ancla: 'padron-seccion-direccion',
    tooltip: 'Dirección',
  },
  {
    texto: 'Escolaridad',
    descripcion: 'Grado máximo y cédula',
    icono: 'snd-user',
    ancla: 'padron-seccion-escolaridad',
    tooltip: 'Escolaridad',
  },
  {
    texto: 'Experiencia laboral',
    descripcion: 'Trayectoria comprobable',
    icono: 'snd-edit',
    ancla: 'padron-seccion-experiencia',
    tooltip: 'Experiencia laboral',
  },
]

const OPCIONES_PAIS = [
  { label: 'México', value: 'México' },
  { label: 'Estados Unidos', value: 'Estados Unidos' },
  { label: 'Canadá', value: 'Canadá' },
  { label: 'España', value: 'España' },
  { label: 'Otro', value: 'Otro' },
]

const ENTIDADES_FEDERATIVAS = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
].map((e) => ({ label: e, value: e }))

const OPCIONES_PERIODO = [
  { label: 'Mensual', value: 'MENSUAL' },
  { label: 'Quincenal', value: 'QUINCENAL' },
  { label: 'Bimestral', value: 'BIMESTRAL' },
  { label: 'Trimestral', value: 'TRIMESTRAL' },
  { label: 'Única exhibición', value: 'UNICA' },
]

const OPCIONES_PARTIDA = [
  { label: '12101 - Honorarios', value: '12101' },
  { label: '33101 - Asesorías asociadas a convenios o tratados', value: '33101' },
  { label: '33901 - Subcontratación de servicios con terceros', value: '33901' },
]

const OPCIONES_ORIGEN = [
  { label: 'Fiscales', value: 'FISCALES' },
  { label: 'Propios', value: 'PROPIOS' },
  { label: 'Externo', value: 'EXTERNO' },
]

const OPCIONES_PEF = [
  { label: 'ARTICULO 15', value: '17' },
  { label: 'ARTICULO 13', value: '16' },
  { label: 'ARTICULO 14', value: '15' },
]

const ESTILOS_ACORDEON_FORMALIZACION = `
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
  .padron-form-grid .snd-buscador,
  .padron-form-grid .snd-buscador .search-container {
    width: 100% !important;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  .padron-form-grid .snd-buscador .form__inset,
  .padron-form-grid .snd-buscador .main-search,
  .padron-form-grid .snd-buscador .general-search {
    display: flex;
    align-items: stretch;
    width: 100%;
    min-height: 0;
    height: auto;
    margin: 0;
    padding: 0;
    background: var(--neutro100, #ffffff);
    border: 1px solid var(--neutro600, #767676);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: none;
    outline: none;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .padron-form-grid .snd-buscador .form__inset:hover {
    border-color: var(--neutro800, #222222);
  }
  .padron-form-grid .snd-buscador .form__inset:has(input:focus),
  .padron-form-grid .snd-buscador .form__inset:has(input:focus-visible),
  .padron-form-grid .snd-buscador .main-search:has(input:focus-visible) {
    border-color: var(--principal, #9B2247);
    outline: none;
    box-shadow: none;
  }
  .padron-form-grid .padron-buscador--invalido .snd-buscador .form__inset {
    border-color: var(--rojo500, #9B0F15);
    box-shadow: 0 0 0 1px var(--rojo500, #9B0F15);
  }
  .padron-form-grid .snd-buscador .form__inset input {
    flex: 1 1 auto;
    min-width: 0;
    font-family: var(--font-family, 'Noto Sans', sans-serif);
    font-size: 1rem;
    font-weight: 400;
    line-height: normal;
    color: var(--neutro800, #222222);
    background: transparent;
    padding: 0.75rem 0.75rem;
    margin: 0;
    border: 0;
    border-radius: 0;
    outline: none;
    box-shadow: none;
  }
  .padron-form-grid .snd-buscador .form__inset input::placeholder {
    color: var(--neutro600, #767676);
    opacity: 1;
  }
  .padron-form-grid .snd-buscador .search-button {
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    min-width: 3rem;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: var(--principal, #9B2247);
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
  }
  .padron-form-grid .snd-buscador .search-button:hover {
    background: var(--gama800, #7a1b38);
  }
  .padron-form-grid .snd-buscador .search-button:focus-visible {
    outline: none;
    box-shadow: var(--snd-foco);
  }
  .padron-form-grid .snd-buscador .search-button .snd-icono {
    width: 18px !important;
    height: 18px !important;
  }
  .padron-form-grid .snd-buscador .general-search {
    padding-left: 0.75rem;
    align-items: center;
  }
  .padron-form-grid .snd-buscador .general-search .search-icon {
    width: 18px !important;
    height: 18px !important;
    color: var(--neutro600, #767676);
    flex: none;
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
 * Pantalla dedicada "Formalización de contratos" (`src/pages/FormalizacionContratos.tsx`).
 * Contiene el formulario integral estructurado en cinco acordeones con el estilo institucional del SND:
 * 1. Formalización de contratos · Datos Generales y Vigencia
 * 2. Formalización de contratos · Importes, Partida y Obligaciones Fiscales
 * 3. Formalización de contratos · Normatividad, Dictámenes y Plaza
 * 4. Servidores públicos que suscriben
 * 5. Excepciones de contrato
 */
export default function FormalizacionContratos() {
  useTitulo('Formalización de Contratos · Módulo de Honorarios')
  const notificar = useNotificaciones()

  const [acordeonesActivos, setAcordeonesActivos] = useState<number | number[]>([0])
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [folioGenerado, setFolioGenerado] = useState<string | null>(null)
  const [modalCargaMasivaAbierto, setModalCargaMasivaAbierto] = useState(false)

  // =========================================================================
  // 1. Estado: Formalización de contratos (Datos Generales y Vigencia)
  // =========================================================================
  const [ramo, setRamo] = useState<string | null>('27')
  const [institucion, setInstitucion] = useState('Secretaría Anticorrupción y Buen Gobierno')
  const [unidadAdministrativa, setUnidadAdministrativa] = useState<string | null>(
    UNIDADES_ADMINISTRATIVAS[0],
  )
  const [modeloContrato, setModeloContrato] = useState<string | null>('MOD-JUR-2026-01')
  const [prestadorServicio, setPrestadorServicio] = useState('')
  const [ordinalContrato, setOrdinalContrato] = useState('1')
  const [chkCompatHon, setChkCompatHon] = useState(false)
  const [fechaInicioContrato, setFechaInicioContrato] = useState<Date | null>(null)
  const [fechaTerminoContrato, setFechaTerminoContrato] = useState<Date | null>(null)
  const [estatus, setEstatus] = useState<string | null>(CATEGORIAS_OPERATIVAS[0])
  const [anioContrato, setAnioContrato] = useState('2026')
  const [perteneceOic, setPerteneceOic] = useState(false)
  const [fechaFirma, setFechaFirma] = useState<Date | null>(null)
  const [pais, setPais] = useState<string | null>('México')
  const [estado, setEstado] = useState<string | null>('Ciudad de México')

  // =========================================================================
  // 2. Estado: Formalización de contratos (Importes, Partida y Fiscales)
  // =========================================================================
  const [importeTotalBruto, setImporteTotalBruto] = useState('')
  const [periodoD, setPeriodoD] = useState<string | null>('MENSUAL')
  const [numeroExhibiciones, setNumeroExhibiciones] = useState('')
  const [montoPorExhibiciones, setMontoPorExhibiciones] = useState('')
  const [importeMensual, setImporteMensual] = useState('')
  const [partida, setPartida] = useState<string | null>('12101')
  const [origen, setOrigen] = useState<string | null>('FISCALES')
  const [articuloPef, setArticuloPef] = useState('')
  const [declaraIsr, setDeclaraIsr] = useState(false)
  const [declaracionPatrimonial, setDeclaracionPatrimonial] = useState(false)
  const [motivoDeclaracionPatrimonial, setMotivoDeclaracionPatrimonial] = useState('')

  // =========================================================================
  // 3. Estado: Formalización de contratos (Normatividad, Dictámenes y Plaza)
  // =========================================================================
  const [disposiciones, setDisposiciones] = useState('')
  const [fundamentoLegal, setFundamentoLegal] = useState('')
  const [lugarTrabajo, setLugarTrabajo] = useState('')
  const [chkRecomendOic, setChkRecomendOic] = useState<string | null>('NO')
  const [autorizacionDictamenPresupuestal, setAutorizacionDictamenPresupuestal] = useState('')
  const [chkServicioIgual, setChkServicioIgual] = useState(false)
  const [numeroOficioExcepcion, setNumeroOficioExcepcion] = useState('')
  const [existePlazaHon, setExistePlazaHon] = useState(false)
  const [justificacionPlaza, setJustificacionPlaza] = useState('')
  const [comentarioFormalizacion, setComentarioFormalizacion] = useState('')

  // =========================================================================
  // 4. Estado: Servidores públicos que suscriben
  // =========================================================================
  const [idServidorPublicoSuscribe, setIdServidorPublicoSuscribe] = useState('')
  const [comentarioServidorPublico, setComentarioServidorPublico] = useState('')

  // =========================================================================
  // 5. Estado: Excepciones de contrato
  // =========================================================================
  const [idExcepcion, setIdExcepcion] = useState('')
  const [comentarioExcepcion, setComentarioExcepcion] = useState('')

  // Validaciones por cada una de las 5 secciones
  const seccionGeneralesCompleta = Boolean(
    ramo &&
    institucion.trim() &&
    unidadAdministrativa &&
    modeloContrato &&
    prestadorServicio.trim() &&
    ordinalContrato.trim() &&
    fechaInicioContrato &&
    fechaTerminoContrato &&
    estatus &&
    anioContrato.trim() &&
    fechaFirma &&
    pais &&
    estado,
  )

  const seccionPresupuestalCompleta = Boolean(
    importeTotalBruto.trim() &&
    periodoD &&
    numeroExhibiciones.trim() &&
    montoPorExhibiciones.trim() &&
    importeMensual.trim() &&
    partida &&
    origen &&
    articuloPef.trim(),
  )

  const seccionNormatividadCompleta = Boolean(
    disposiciones.trim() &&
    fundamentoLegal.trim() &&
    lugarTrabajo.trim() &&
    autorizacionDictamenPresupuestal.trim() &&
    comentarioFormalizacion.trim(),
  )

  const seccionServidoresCompleta = Boolean(
    idServidorPublicoSuscribe.trim() && comentarioServidorPublico.trim(),
  )

  const seccionExcepcionesCompleta = Boolean(
    idExcepcion.trim() && comentarioExcepcion.trim(),
  )

  const totalSeccionesCompletas = [
    seccionGeneralesCompleta,
    seccionPresupuestalCompleta,
    seccionNormatividadCompleta,
    seccionServidoresCompleta,
    seccionExcepcionesCompleta,
  ].filter(Boolean).length

  const expandirTodo = () => setAcordeonesActivos([0, 1, 2, 3, 4])
  const colapsarTodo = () => setAcordeonesActivos([])

  const limpiarFormulario = () => {
    setRamo('27')
    setInstitucion('Secretaría Anticorrupción y Buen Gobierno')
    setUnidadAdministrativa(UNIDADES_ADMINISTRATIVAS[0])
    setModeloContrato('MOD-JUR-2026-01')
    setPrestadorServicio('')
    setOrdinalContrato('1')
    setChkCompatHon(false)
    setFechaInicioContrato(null)
    setFechaTerminoContrato(null)
    setEstatus(CATEGORIAS_OPERATIVAS[0])
    setAnioContrato('2026')
    setPerteneceOic(false)
    setFechaFirma(null)
    setPais('México')
    setEstado('Ciudad de México')

    setImporteTotalBruto('')
    setPeriodoD('MENSUAL')
    setNumeroExhibiciones('')
    setMontoPorExhibiciones('')
    setImporteMensual('')
    setPartida('12101')
    setOrigen('FISCALES')
    setArticuloPef('')
    setDeclaraIsr(false)
    setDeclaracionPatrimonial(false)
    setMotivoDeclaracionPatrimonial('')

    setDisposiciones('')
    setFundamentoLegal('')
    setLugarTrabajo('')
    setChkRecomendOic('NO')
    setAutorizacionDictamenPresupuestal('')
    setChkServicioIgual(false)
    setNumeroOficioExcepcion('')
    setExistePlazaHon(false)
    setJustificacionPlaza('')
    setComentarioFormalizacion('')

    setIdServidorPublicoSuscribe('')
    setComentarioServidorPublico('')

    setIdExcepcion('')
    setComentarioExcepcion('')

    setIntentoEnvio(false)
    setFolioGenerado(null)
    setAcordeonesActivos([0])
    notificar.info('Formulario de formalización reiniciado correctamente.')
  }

  const guardarFormalizacion = () => {
    setIntentoEnvio(true)

    if (
      !seccionGeneralesCompleta ||
      !seccionPresupuestalCompleta ||
      !seccionNormatividadCompleta ||
      !seccionServidoresCompleta ||
      !seccionExcepcionesCompleta
    ) {
      const pendientes: number[] = []
      if (!seccionGeneralesCompleta) pendientes.push(0)
      if (!seccionPresupuestalCompleta) pendientes.push(1)
      if (!seccionNormatividadCompleta) pendientes.push(2)
      if (!seccionServidoresCompleta) pendientes.push(3)
      if (!seccionExcepcionesCompleta) pendientes.push(4)
      setAcordeonesActivos(pendientes)
      notificar.error(
        'Por favor completa los campos obligatorios marcados con asterisco (*) en las cinco secciones.',
        'Campos pendientes',
      )
      return
    }

    const nuevoFolio = `CTO-HON-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setFolioGenerado(nuevoFolio)
    notificar.exito(
      `La formalización del contrato fue registrada con el folio ${nuevoFolio}.`,
      'Formalización de Contrato Exitosa',
    )
  }

  return (
    <>
      <aside
        className="prestadores-layout__menu"
      >
        <MenuFlotante
          titulo="Secciones del expediente"
          items={SECCIONES}
          activa={""}
          colapsado={true}
          onColapsar={() => { }}
        />
      </aside>
      <div className='prestadores-layout'>
        <div className="prestadores-layout__contenido">
<div className="contenedor">
        <style>{ESTILOS_ACORDEON_FORMALIZACION}</style>

        {/* ENCABEZADO INSTITUCIONAL DE LA PANTALLA */}
        <div className="honorarios-encabezado-seccion">
          <div>
            <h1 className="h1b patria" style={{ margin: 0 }}>
              Formalización de Contratos
            </h1>
            <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>

            </p>
          </div>
          <div className="fila">
            <BotonHome />
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
                <strong>El Contrato ({folioGenerado}) ha sido formalizado correctamente.</strong> Los datos de
                formalización, servidores públicos que suscriben y excepciones han quedado registrados en el sistema.
              </p>
            </SndMensaje>
          </div>
        )}

        {/* FORMULARIO CON LOS CINCO ACORDEONES */}
        <div style={{ marginTop: 20 }}>
          <Accordion
            multiple
            activeIndex={acordeonesActivos}
            onTabChange={(e) => setAcordeonesActivos(e.index)}
            className="padron-acordeon"
          >
            {/* =====================================================================
              ACORDEÓN 1: FORMALIZACIÓN DE CONTRATOS (DATOS GENERALES Y VIGENCIA)
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
                        1. Formalización de contratos · Datos Generales
                      </span>

                    </div>
                  </div>
                  <span className={`pildora pildora--${seccionGeneralesCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {seccionGeneralesCompleta ? 'Completado' : 'Por capturar'}
                  </span>
                </div>
              }
            >
              <div className="padron-form-grid">
                <div className="campo">
                  <label htmlFor="fc-ramo" className="b1sb">
                    Ramo <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-ramo"
                    options={OPCIONES_RAMO}
                    value={ramo}
                    onChange={(e) => setRamo(e.value)}
                    placeholder="Selecciona el ramo"
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-institucion" className="b1sb">
                    Institución <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-institucion"
                    value={institucion}
                    invalid={intentoEnvio && !institucion.trim()}
                    onChange={(e) => setInstitucion(e.target.value)}
                    placeholder="Ej. Secretaría Anticorrupción y Buen Gobierno"
                  />
                  {intentoEnvio && !institucion.trim() && (
                    <span className="campo__error">La institución es obligatoria.</span>
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
                  <label htmlFor="fc-modelo" className="b1sb">
                    Modelo de contrato <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-modelo"
                    options={OPCIONES_MODELO_CONTRATO}
                    value={modeloContrato}
                    onChange={(e) => setModeloContrato(e.value)}
                    placeholder="Selecciona el modelo de contrato"
                    appendTo="self"
                  />
                </div>

                <div
                  className={`campo ${intentoEnvio && !prestadorServicio.trim() ? 'padron-buscador--invalido' : ''}`}
                >
                  <label htmlFor="fc-prestador" className="b1sb">
                    Prestador de servicio <span className="requerido">*</span>
                  </label>
                  <SndBuscador
                    variante="principal"
                    etiqueta="Buscar prestador de servicio"
                    placeholder="Ej. RFC, CURP o nombre del prestador"
                    valor={prestadorServicio}
                    ancho="100%"
                    onValor={setPrestadorServicio}
                    onBuscar={(valor) => {
                      if (valor.trim()) {
                        notificar.info(`Buscando prestador de servicio: «${valor}».`)
                      }
                    }}
                  />
                  {intentoEnvio && !prestadorServicio.trim() && (
                    <span className="campo__error">El prestador de servicio es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-ordinal" className="b1sb">
                    Ordinal del contrato <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-ordinal"
                    value={ordinalContrato}
                    invalid={intentoEnvio && !ordinalContrato.trim()}
                    onChange={(e) => setOrdinalContrato(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 1"
                  />
                  {intentoEnvio && !ordinalContrato.trim() && (
                    <span className="campo__error">El ordinal del contrato es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-chk-compat" className="b1sb">
                    Compatibilidad
                  </label>
                  <Checkbox
                    inputId="fc-chk-compat"
                    checked={chkCompatHon}
                    onChange={(e) => setChkCompatHon(Boolean(e.checked))}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-fecha-inicio" className="b1sb">
                    Fecha inicio contrato <span className="requerido">*</span>
                  </label>
                  <Calendar
                    inputId="fc-fecha-inicio"
                    value={fechaInicioContrato}
                    invalid={intentoEnvio && !fechaInicioContrato}
                    onChange={(e) => setFechaInicioContrato((e.value as Date | null) ?? null)}
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/aaaa"
                    showIcon
                    appendTo="self"
                  />
                  {intentoEnvio && !fechaInicioContrato && (
                    <span className="campo__error">Selecciona la fecha de inicio del contrato.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-fecha-termino" className="b1sb">
                    Fecha termino contrato <span className="requerido">*</span>
                  </label>
                  <Calendar
                    inputId="fc-fecha-termino"
                    value={fechaTerminoContrato}
                    invalid={intentoEnvio && !fechaTerminoContrato}
                    onChange={(e) => setFechaTerminoContrato((e.value as Date | null) ?? null)}
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/aaaa"
                    showIcon
                    appendTo="self"
                  />
                  {intentoEnvio && !fechaTerminoContrato && (
                    <span className="campo__error">Selecciona la fecha de término del contrato.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-estatus" className="b1sb">
                    Estatus <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-estatus"
                    options={CATEGORIAS_OPERATIVAS.map((c) => ({ label: c, value: c }))}
                    value={estatus}
                    onChange={(e) => setEstatus(e.value)}
                    placeholder="Selecciona estatus"
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-anio" className="b1sb">
                    Año del contrato <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-anio"
                    maxLength={4}
                    value={anioContrato}
                    invalid={intentoEnvio && !anioContrato.trim()}
                    onChange={(e) => setAnioContrato(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 2026"
                  />
                  {intentoEnvio && !anioContrato.trim() && (
                    <span className="campo__error">El año del contrato es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-pertenece-oic" className="b1sb">
                    Pertenece OIC
                  </label>
                  <Checkbox
                    inputId="fc-pertenece-oic"
                    checked={perteneceOic}
                    onChange={(e) => setPerteneceOic(Boolean(e.checked))}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-fecha-firma" className="b1sb">
                    Fecha Firma <span className="requerido">*</span>
                  </label>
                  <Calendar
                    inputId="fc-fecha-firma"
                    value={fechaFirma}
                    invalid={intentoEnvio && !fechaFirma}
                    onChange={(e) => setFechaFirma((e.value as Date | null) ?? null)}
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/aaaa"
                    showIcon
                    appendTo="self"
                  />
                  {intentoEnvio && !fechaFirma && (
                    <span className="campo__error">Selecciona la fecha de firma.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-pais" className="b1sb">
                    Pais <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-pais"
                    options={OPCIONES_PAIS}
                    value={pais}
                    onChange={(e) => setPais(e.value)}
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-estado" className="b1sb">
                    Estado <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-estado"
                    options={ENTIDADES_FEDERATIVAS}
                    value={estado}
                    onChange={(e) => setEstado(e.value)}
                    appendTo="self"
                  />
                </div>
              </div>

              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionGeneralesCompleta) {
                    setAcordeonesActivos([1])
                    notificar.exito('Datos generales de formalización guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos generales obligatorios.')
                  }
                }}
              >
                <SndIcono nombre="snd-save" tamano={18} />
                Guardar datos generales
              </SndBoton>
            </AccordionTab>

            {/* =====================================================================
              ACORDEÓN 2: FORMALIZACIÓN DE CONTRATOS (PRESUPUESTO Y FISCAL)
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
                        2. Formalización de contratos · Importes y Declaración Patrimonial
                      </span>

                    </div>
                  </div>
                  <span className={`pildora pildora--${seccionPresupuestalCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {seccionPresupuestalCompleta ? 'Completado' : 'Por capturar'}
                  </span>
                </div>
              }
            >
              <div className="padron-form-grid">
                <div className="campo">
                  <label htmlFor="fc-importe-bruto" className="b1sb">
                    Importe Total Bruto <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-importe-bruto"
                    value={importeTotalBruto}
                    invalid={intentoEnvio && !importeTotalBruto.trim()}
                    onChange={(e) => setImporteTotalBruto(e.target.value)}
                    placeholder="Ej. 462000.00"
                  />
                  {intentoEnvio && !importeTotalBruto.trim() && (
                    <span className="campo__error">El importe total bruto es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-periodo-d" className="b1sb">
                    Periodo de pago <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-periodo-d"
                    options={OPCIONES_PERIODO}
                    value={periodoD}
                    onChange={(e) => setPeriodoD(e.value)}
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-num-exhibiciones" className="b1sb">
                    Numero de Exhibiciones <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-num-exhibiciones"
                    value={numeroExhibiciones}
                    invalid={intentoEnvio && !numeroExhibiciones.trim()}
                    onChange={(e) => setNumeroExhibiciones(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 12"
                  />
                  {intentoEnvio && !numeroExhibiciones.trim() && (
                    <span className="campo__error">El número de exhibiciones es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-monto-exhibiciones" className="b1sb">
                    Monto po Exhibiciones <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-monto-exhibiciones"
                    value={montoPorExhibiciones}
                    invalid={intentoEnvio && !montoPorExhibiciones.trim()}
                    onChange={(e) => setMontoPorExhibiciones(e.target.value)}
                    placeholder="Ej. 38500.00"
                  />
                  {intentoEnvio && !montoPorExhibiciones.trim() && (
                    <span className="campo__error">El monto por exhibiciones es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-importe-mensual" className="b1sb">
                    Importe Mensual <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-importe-mensual"
                    value={importeMensual}
                    invalid={intentoEnvio && !importeMensual.trim()}
                    onChange={(e) => setImporteMensual(e.target.value)}
                    placeholder="Ej. 38500.00"
                  />
                  {intentoEnvio && !importeMensual.trim() && (
                    <span className="campo__error">El importe mensual es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-partida" className="b1sb">
                    Partida <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-partida"
                    options={OPCIONES_PARTIDA}
                    value={partida}
                    onChange={(e) => setPartida(e.value)}
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-origen" className="b1sb">
                    Origen <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    inputId="fc-origen"
                    options={OPCIONES_ORIGEN}
                    value={origen}
                    onChange={(e) => setOrigen(e.value)}
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-articulo-pef" className="b1sb">
                    Articulo PEF <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    id="fc-articulo-pef"
                    options={OPCIONES_PEF}
                    value={articuloPef}
                    invalid={intentoEnvio && !articuloPef.trim()}
                    onChange={(e) => setArticuloPef(e.target.value)}

                  />
                  {intentoEnvio && !articuloPef.trim() && (
                    <span className="campo__error">El artículo PEF es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-declara-isr" className="b1sb">
                    Declara ISR
                  </label>
                  <Checkbox
                    inputId="fc-declara-isr"
                    checked={declaraIsr}
                    onChange={(e) => setDeclaraIsr(Boolean(e.checked))}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-declara-patrimonial" className="b1sb">
                    Declaración Patrimonial
                  </label>
                  <Checkbox
                    inputId="fc-declara-patrimonial"
                    checked={declaracionPatrimonial}
                    onChange={(e) => setDeclaracionPatrimonial(Boolean(e.checked))}
                  />
                </div>

                <div className="campo padron-form-grid__col-2">
                  <label htmlFor="fc-motivo-patrimonial" className="b1sb">
                    Motivo Declaración Patrimonial
                  </label>
                  <Dropdown
                    id="fc-motivo-patrimonial"
                    value={motivoDeclaracionPatrimonial}
                    options={OPCIONES_MOT_DECPAT}
                    onChange={(e) => setMotivoDeclaracionPatrimonial(e.target.value)}

                  />
                </div>
              </div>

              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionPresupuestalCompleta) {
                    setAcordeonesActivos([2])
                    notificar.exito('Importes y Declaración Patrimonial guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de importes y declaración patrimonial obligatorios.')
                  }
                }}
              >
                <SndIcono nombre="snd-save" tamano={18} />
                Guardar importes y declaración patrimonial
              </SndBoton>
            </AccordionTab>

            {/* =====================================================================
              ACORDEÓN 3: FORMALIZACIÓN DE CONTRATOS (NORMATIVIDAD, DICTÁMENES Y PLAZA)
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
                        3. Formalización de contratos · Normatividad y Disposiciones
                      </span>

                    </div>
                  </div>
                  <span className={`pildora pildora--${seccionNormatividadCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {seccionNormatividadCompleta ? 'Completado' : 'Por capturar'}
                  </span>
                </div>
              }
            >
              <div className="padron-form-grid">
                <div className="campo padron-form-grid__col-3">
                  <label htmlFor="fc-disposiciones" className="b1sb">
                    Disposiciones <span className="requerido">*</span>
                  </label>
                  <textarea
                    id="fc-disposiciones"
                    className={`padron-textarea ${intentoEnvio && !disposiciones.trim() ? 'padron-textarea--invalido' : ''}`}
                    value={disposiciones}
                    onChange={(e) => setDisposiciones(e.target.value)}
                    placeholder="Ej. Disposiciones en las materias de Recursos Humanos"
                  />
                  {intentoEnvio && !disposiciones.trim() && (
                    <span className="campo__error">Las disposiciones son obligatorias.</span>
                  )}
                </div>

                <div className="campo padron-form-grid__col-3" >
                  <label htmlFor="fc-fundamento-legal" className="b1sb">
                    Fundamento Legal <span className="requerido">*</span>
                  </label>
                  <textarea
                    id="fc-fundamento-legal"
                    className={`padron-textarea ${intentoEnvio && !disposiciones.trim() ? 'padron-textarea--invalido' : ''}`}
                    value={fundamentoLegal}
                    onChange={(e) => setFundamentoLegal(e.target.value)}
                    placeholder="Ej. Art. 69 LFPRH y Código Civil Federal"
                  />
                  {intentoEnvio && !fundamentoLegal.trim() && (
                    <span className="campo__error">El fundamento legal es obligatorio.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-lugar-trabajo" className="b1sb">
                    Lugar Trabajo <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-lugar-trabajo"
                    value={lugarTrabajo}
                    invalid={intentoEnvio && !lugarTrabajo.trim()}
                    onChange={(e) => setLugarTrabajo(e.target.value)}
                    placeholder="Ej. Av. Insurgentes Sur 1735, CDMX"
                  />
                  {intentoEnvio && !lugarTrabajo.trim() && (
                    <span className="campo__error">El lugar de trabajo es obligatorio.</span>
                  )}
                </div>



                <div className="campo">
                  <label htmlFor="fc-dictamen-presupuestal" className="b1sb">
                    Autorización o dictamen presupuestal <span className="requerido">*</span>
                  </label>
                  <InputText
                    id="fc-dictamen-presupuestal"
                    value={autorizacionDictamenPresupuestal}
                    invalid={intentoEnvio && !autorizacionDictamenPresupuestal.trim()}
                    onChange={(e) => setAutorizacionDictamenPresupuestal(e.target.value)}
                    placeholder="Ej. SUF-2026-0312"
                  />
                  {intentoEnvio && !autorizacionDictamenPresupuestal.trim() && (
                    <span className="campo__error">La autorización o dictamen presupuestal es obligatoria.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="fc-chk-servicio-igual" className="b1sb">
                    Servicios Iguales
                  </label>
                  <Checkbox
                    inputId="fc-chk-servicio-igual"
                    checked={chkServicioIgual}
                    onChange={(e) => setChkServicioIgual(Boolean(e.checked))}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-oficio-excepcion" className="b1sb">
                    Numero de Oficio Excepción
                  </label>
                  <InputText
                    id="fc-oficio-excepcion"
                    value={numeroOficioExcepcion}
                    onChange={(e) => setNumeroOficioExcepcion(e.target.value)}
                    placeholder="Ej. OF-EXC-2026-0045"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="fc-existe-plaza" className="b1sb">
                    Existe Plaza Estructura
                  </label>
                  <Checkbox
                    inputId="fc-existe-plaza"
                    checked={existePlazaHon}
                    onChange={(e) => setExistePlazaHon(Boolean(e.checked))}
                  />
                </div>


                {/* tabla de exepciones TablaExepciones */}
                <div className="padron-form-grid__col-3">
                  <div className="contenedor-tabla" style={{ marginTop: '0.5rem' }}>
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
                        <tr style={{ backgroundColor: 'var(--principal, #9B2247)' }}>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Id Exepción
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Numero de fracción
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Descripción
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                              textAlign: 'center',
                            }}
                          >
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--neutro400, #dddddd)' }}>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            EXC-HON-2026-01
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            Fracción I
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            Excepción autorizada para contratación de servicios profesionales por honorarios.
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--neutro400, #cccccc)',
                                  borderRadius: '8px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  color: 'var(--neutro800, #333)',
                                }}
                                title="Modificar excepción"
                              >
                                Modificar
                              </button>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--principal, #9B2247)',
                                  borderRadius: '8px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  color: 'var(--principal, #9B2247)',
                                }}
                                title="Agregar excepción"
                              >
                                Agregar
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="campo">
                  <label htmlFor="exc-id-excepcion" className="b1sb">
                    Id Excepción <span className="requerido">*</span>
                  </label>
                  <Dropdown
                    id="exc-id-excepcion"
                    value={idExcepcion}
                    options={OPCIONES_HON_EXEPCIONES}
                    invalid={intentoEnvio && !idExcepcion.trim()}
                    onChange={(e) => setIdExcepcion(e.target.value.toUpperCase())}
                    placeholder=""
                  />
                  {intentoEnvio && !idExcepcion.trim() && (
                    <span className="campo__error">El identificador de excepción es obligatorio.</span>
                  )}
                </div>


              </div>

              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionNormatividadCompleta) {
                    setAcordeonesActivos([3])
                    notificar.exito('Datos de normatividad y disposiciones guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de normatividad obligatorios.')
                  }
                }}
              >
                <SndIcono nombre="snd-save" tamano={18} />
                Guardar normatividad y disposiciones
              </SndBoton>
            </AccordionTab>

            {/* =====================================================================
              ACORDEÓN 4: SERVIDORES PÚBLICOS QUE SUSCRIBEN
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
                        4. Formalizacion de contratos · Servidores públicos que suscriben y reciben entregables.
                      </span>

                    </div>
                  </div>
                  <span className={`pildora pildora--${seccionServidoresCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {seccionServidoresCompleta ? 'Completado' : 'Por capturar'}
                  </span>
                </div>
              }
            >
              <div className="padron-form-grid">
                {/* tabla de Servidores publicos que suscriben TablaServidoresPublicos */}
                <div className="padron-form-grid__col-3">
                  <div className="contenedor-tabla" style={{ marginTop: '0.5rem' }}>
                    <table
                      id="TablaServidoresPublicos"
                      style={{
                        width: '100%',
                        minWidth: '40rem',
                        borderCollapse: 'collapse',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: 'var(--principal, #9B2247)' }}>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Ordinal
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Id RUSP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                            }}
                          >
                            Nombre del servidor público
                          </th>
                          <th
                            style={{
                              padding: '0.75rem 1rem',
                              fontWeight: 600,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--gama800, #6F1D36)',
                              textAlign: 'center',
                            }}
                          >
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--neutro400, #dddddd)' }}>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            1
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            000004918
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                            }}
                          >
                            Alejandro Morales Domínguez
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 1rem',
                              color: 'var(--neutro800, #333)',
                              verticalAlign: 'middle',
                              border: '1px solid var(--neutro400, #dddddd)',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--neutro400, #cccccc)',
                                  borderRadius: '8px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  color: 'var(--neutro800, #333)',
                                }}
                                title="Modificar servidor público"
                              >
                                Modificar
                              </button>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--principal, #9B2247)',
                                  borderRadius: '8px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  color: 'var(--principal, #9B2247)',
                                }}
                                title="Agregar servidor público"
                              >
                                Agregar
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  className={`campo ${intentoEnvio && !idServidorPublicoSuscribe.trim() ? 'padron-buscador--invalido' : ''}`}
                >
                  <label htmlFor="sp-id-servidor" className="b1sb">
                    Id Servidores publico que suscribe <span className="requerido">*</span>
                  </label>
                  <SndBuscador
                    variante="principal"
                    etiqueta="Buscar servidor público que suscribe"
                    placeholder="Ej. 000004918"
                    valor={idServidorPublicoSuscribe}
                    ancho="100%"
                    onValor={(valor) => setIdServidorPublicoSuscribe(valor.toUpperCase())}
                    onBuscar={(valor) => {
                      if (valor.trim()) {
                        notificar.info(`Buscando servidor público: «${valor}».`)
                      }
                    }}
                  />
                  {intentoEnvio && !idServidorPublicoSuscribe.trim() && (
                    <span className="campo__error">
                      El identificador del servidor público que suscribe es obligatorio.
                    </span>
                  )}
                </div>

                <div className="campo padron-form-grid__col-3">
                  <label htmlFor="sp-comentario" className="b1sb">
                    Comentario <span className="requerido">*</span>
                  </label>
                  <textarea
                    id="sp-comentario"
                    className={`padron-textarea ${intentoEnvio && !comentarioServidorPublico.trim() ? 'padron-textarea--invalido' : ''}`}
                    value={comentarioServidorPublico}
                    onChange={(e) => setComentarioServidorPublico(e.target.value)}
                    placeholder="Ingresa el comentario sobre la suscripción por parte del servidor público..."
                  />
                  {intentoEnvio && !comentarioServidorPublico.trim() && (
                    <span className="campo__error">
                      El comentario de servidores públicos que suscriben es obligatorio.
                    </span>
                  )}
                </div>
              </div>

              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionServidoresCompleta) {
                    setAcordeonesActivos([4])
                    notificar.exito('Servidor público que suscribe guardado temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos del servidor público que suscribe.')
                  }
                }}
              >
                <SndIcono nombre="snd-save" tamano={18} />
                Guardar servidor público
              </SndBoton>
            </AccordionTab>

            {/* =====================================================================
              ACORDEÓN 5: EXCEPCIONES DE CONTRATO
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
                        5. Formalizacion de contratos · Comentarios de contrato y justificación
                      </span>
                    </div>
                  </div>
                  <span className={`pildora pildora--${seccionExcepcionesCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {seccionExcepcionesCompleta ? 'Completado' : 'Por capturar'}
                  </span>
                </div>
              }
            >
              <div className="padron-form-grid">


                <div className="campo padron-form-grid__col-3">
                  <label htmlFor="fc-justificacion-plaza" className="b1sb">
                    Justificacion Plaza
                  </label>
                  <textarea
                    id="fc-justificacion-plaza"
                    value={justificacionPlaza}
                    className={`padron-textarea ${intentoEnvio && !disposiciones.trim() ? 'padron-textarea--invalido' : ''}`}
                    onChange={(e) => setJustificacionPlaza(e.target.value)}
                    placeholder="Ej. Actividades temporales sin plaza equivalente vacante"
                  />
                </div>

                <div className="campo padron-form-grid__col-3">
                  <label htmlFor="fc-comentario" className="b1sb">
                    Comentario <span className="requerido">*</span>
                  </label>
                  <textarea
                    id="fc-comentario"
                    className={`padron-textarea ${intentoEnvio && !comentarioFormalizacion.trim() ? 'padron-textarea--invalido' : ''}`}
                    value={comentarioFormalizacion}
                    onChange={(e) => setComentarioFormalizacion(e.target.value)}
                    placeholder="Ingresa comentarios adicionales sobre la formalización del contrato..."
                  />
                  {intentoEnvio && !comentarioFormalizacion.trim() && (
                    <span className="campo__error">El comentario de formalización es obligatorio.</span>
                  )}
                </div>
              </div>

              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionExcepcionesCompleta) {
                    notificar.exito('Datos de excepciones de contrato guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de excepciones de contrato.')
                  }
                }}
              >
                <SndIcono nombre="snd-save" tamano={18} />
                Guardar excepciones de contrato
              </SndBoton>
            </AccordionTab>
          </Accordion>

          {/* BARRA INFERIOR DE ACCIONES DEL FORMULARIO */}
          <article className="honorarios-tarjeta" style={{ marginTop: 12 }}>
            <div className="honorarios-detalle-barra">
              <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                Los campos marcados con <span className="requerido">*</span> son obligatorios para concluir la
                formalización del contrato por honorarios.
              </span>

              <div className="fila fila--derecha">
                <SndBoton type="submit">
                  <SndIcono nombre="snd-save" tamano={20} />
                  Guardar formalización de contrato
                </SndBoton>
                <SndBoton variante="secundario" type="button" onClick={limpiarFormulario}>
                  <SndIcono nombre="snd-renew" tamano={20} />
                  Omitir todos los cambios
                </SndBoton>
              </div>
            </div>
          </article>
        </div>

        {/* MODAL DE CARGA MASIVA */}
        <ModalCargaMasiva
          visible={modalCargaMasivaAbierto}
          onCerrar={() => setModalCargaMasivaAbierto(false)}
        />
      </div>
        </div>
      </div>
      
    </>
  )
}
