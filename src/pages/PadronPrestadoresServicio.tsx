import { useState, type FormEvent } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import {
  ModalCargaMasiva,
  SndBoton,
  SndIcono,
  SndMensaje,
  useNotificaciones,
} from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'
import TablaDireccion, { type DireccionItem } from '../components/prestadoresServicios/TablaDireccion'
import SeccionDireccion from '../components/prestadoresServicios/SeccionDireccion'
import TablaEscolaridad from '../components/prestadoresServicios/TablaEscolaridad'
import TablaExperiencia from '../components/prestadoresServicios/TablaExperiencia'
import { ToggleTabla } from '../components/prestadoresServicios/ToogleTabla'



const OPCIONES_NACIONALIDAD = [
  { label: 'México', value: 'MEXICANA' },
  { label: 'Extranjero con residencia permanente', value: 'EXTRANJERA' },
]
const DATOS_EJEMPLO: DireccionItem[] = [
  {
    id: 1,
    calle: 'Av. Insurgentes Sur',
    numeroExterior: '1735',
    numeroInterior: 'Piso 4, Int. 402',
    codigoPostal: '01020',
    colonia: 'Guadalupe Inn',
    municipioAlcaldia: 'Álvaro Obregón',
    entidadFederativa: 'Ciudad de México',
    pais: 'México',
    referenciasDomicilio: 'Frente al parque',
  },
]
const OPCIONES_PAIS = [
  'México',
  'Estados Unidos',
  'Canadá',
  'Guatemala',
  'Belice',
  'Colombia',
  'Argentina',
  'Chile',
  'España',
  'Otro',
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

const ESTILOS_ACORDEON_PADRON = `
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
 * Pantalla dedicada "Padrón de Prestadores de Servicio" (`src/pages/PadronPrestadoresServicio.tsx`).
 * Contiene en un solo archivo el formulario integral estructurado en cuatro acordeones:
 * 1. Datos Personales
 * 2. Dirección
 * 3. Escolaridad
 * 4. Experiencia Laboral
 */
export default function PadronPrestadoresServicio() {
  useTitulo('Padrón de Prestadores de Servicio · Módulo de Honorarios')
  const notificar = useNotificaciones()

  // Control de pestañas abiertas en el acordeón (permite abrir una o varias secciones)
  const [acordeonesActivos, setAcordeonesActivos] = useState<number | number[]>([0])
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [folioGenerado, setFolioGenerado] = useState<string | null>(null)
  const [modalCargaMasivaAbierto, setModalCargaMasivaAbierto] = useState(false)

  // 1. Estado: Datos Personales
  const [nombres, setNombres] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [curp, setCurp] = useState('')
  const [rfc, setRfc] = useState('')
  const [nacionalidad, setNacionalidad] = useState<string | null>('MEXICANA')

  const [homoclave, setHomoclave] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null)
  const [genero, setGenero] = useState<string | null>('M')
  const [estadoCivil, setEstadoCivil] = useState<string | null>('SOLTERO')
  const [correo, setCorreo] = useState('')
  const [telefonoCelular, setTelefonoCelular] = useState('')
  const [telefonoFijo, setTelefonoFijo] = useState('')

  // 2. Estado: Dirección
  const [codigoPostal, setCodigoPostal] = useState('')
  const [calle, setCalle] = useState('')
  const [numeroExterior, setNumeroExterior] = useState('')
  const [numeroInterior, setNumeroInterior] = useState('')
  const [colonia, setColonia] = useState('')
  const [pais, setPais] = useState('México')
  const [municipioAlcaldia, setMunicipioAlcaldia] = useState('')
  const [entidadFederativa, setEntidadFederativa] = useState<string | null>('Ciudad de México')
  const [referenciasDomicilio, setReferenciasDomicilio] = useState('')

  // 3. Estado: Escolaridad
  const [nivelEstudios, setNivelEstudios] = useState<string | null>('LICENCIATURA')
  const [carrera, setCarrera] = useState('')
  const [institucionEducativa, setInstitucionEducativa] = useState('')
  const [estatusEstudios, setEstatusEstudios] = useState<string | null>('TITULADO')
  const [documentoComprobatorio, setDocumentoComprobatorio] = useState<string | null>('CEDULA')
  const [cedulaProfesional, setCedulaProfesional] = useState('')
  const [anioTitulacion, setAnioTitulacion] = useState('')

  // 4. Estado: Experiencia Laboral
  const [institucionLaboral, setInstitucionLaboral] = useState('')
  const [sectorLaboral, setSectorLaboral] = useState<string | null>('PUBLICO_FEDERAL')
  const [puestoDesempenado, setPuestoDesempenado] = useState('')
  const [areaAdscripcion, setAreaAdscripcion] = useState('')
  const [fechaInicioLaboral, setFechaInicioLaboral] = useState<Date | null>(null)
  const [fechaFinLaboral, setFechaFinLaboral] = useState<Date | null>(null)
  const [aniosExperiencia, setAniosExperiencia] = useState('')
  const [funcionesPrincipales, setFuncionesPrincipales] = useState('')

  const [showEscolaridad, setShowEscolaridad] = useState(true)
  const [showExperiencia, setShowExperiencia] = useState(true)

  // Validaciones por sección
  const seccionPersonalCompleta = Boolean(
    nombres.trim() &&
    primerApellido.trim() &&
    curp.trim().length >= 18 &&
    rfc.trim().length >= 10
  )

  const seccionDireccionCompleta = direcciones.length > 0

  const seccionEscolaridadCompleta = Boolean(
    nivelEstudios && carrera.trim() && estatusEstudios,
  )

  const seccionExperienciaCompleta = Boolean(
    sectorLaboral && aniosExperiencia.trim() && funcionesPrincipales.trim(),
  )

  const totalSeccionesCompletas = [
    seccionPersonalCompleta,
    seccionDireccionCompleta,
    seccionEscolaridadCompleta,
    seccionExperienciaCompleta,
  ].filter(Boolean).length

  const expandirTodo = () => setAcordeonesActivos([0, 1, 2, 3])
  const colapsarTodo = () => setAcordeonesActivos([])

  const cargarDatosEjemplo = () => {
    setNombres('María Fernanda')
    setPrimerApellido('López')
    setSegundoApellido('Ríos')
    setCurp('LORM880412MDFRRL09')
    setRfc('LORM880412')
    setHomoclave('HDF')
    setFechaNacimiento(new Date(1988, 3, 12))
    setGenero('M')
    setEstadoCivil('SOLTERO')
    setNacionalidad('MEXICANA')
    setCorreo('mflopez.prestador@funcionpublica.gob.mx')
    setTelefonoCelular('5541239876')
    setTelefonoFijo('5520003000')

    setCodigoPostal('01020')
    setCalle('Av. Insurgentes Sur')
    setNumeroExterior('1735')
    setNumeroInterior('Piso 4')
    setColonia('Guadalupe Inn')
    setPais('México')
    setMunicipioAlcaldia('Álvaro Obregón')
    setEntidadFederativa('Ciudad de México')
    setReferenciasDomicilio('Entre Barranca del Muerto y Río Mixcoac')

    setNivelEstudios('LICENCIATURA')
    setCarrera('Licenciatura en Derecho y Administración Pública')
    setInstitucionEducativa('Universidad Nacional Autónoma de México (UNAM)')
    setEstatusEstudios('TITULADO')
    setDocumentoComprobatorio('CEDULA')
    setCedulaProfesional('08945123')
    setAnioTitulacion('2013')

    setInstitucionLaboral('Secretaría Anticorrupción y Buen Gobierno')
    setSectorLaboral('PUBLICO_FEDERAL')
    setPuestoDesempenado('Especialista en Análisis Normativo de Contratos')
    setAreaAdscripcion('Dirección General de Recursos Humanos')
    setFechaInicioLaboral(new Date(2022, 0, 16))
    setFechaFinLaboral(new Date(2025, 11, 31))
    setAniosExperiencia('6')
    setFuncionesPrincipales(
      'Revisión técnico-jurídica de expedientes de prestadores de servicios profesionales por honorarios, dictaminación de compatibilidad y validación presupuestal.',
    )

    setIntentoEnvio(false)
    setAcordeonesActivos([0, 1, 2, 3])
    notificar.info('Se cargaron datos de demostración en las cuatro secciones del formulario.')
  }

  const limpiarFormulario = () => {
    setNombres('')
    setPrimerApellido('')
    setSegundoApellido('')
    setCurp('')
    setRfc('')
    setHomoclave('')
    setFechaNacimiento(null)
    setCorreo('')
    setTelefonoCelular('')
    setTelefonoFijo('')

    setCodigoPostal('')
    setCalle('')
    setNumeroExterior('')
    setNumeroInterior('')
    setColonia('')
    setPais('México')
    setMunicipioAlcaldia('')
    setReferenciasDomicilio('')

    setCarrera('')
    setInstitucionEducativa('')
    setCedulaProfesional('')
    setAnioTitulacion('')

    setInstitucionLaboral('')
    setPuestoDesempenado('')
    setAreaAdscripcion('')
    setFechaInicioLaboral(null)
    setFechaFinLaboral(null)
    setAniosExperiencia('')
    setFuncionesPrincipales('')

    setIntentoEnvio(false)
    setFolioGenerado(null)
    setAcordeonesActivos([0])
    notificar.info('Formulario reiniciado correctamente.')
  }

  const guardarExpediente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData);
    console.log(data)
    setIntentoEnvio(true)

    if (
      !seccionPersonalCompleta ||
      !seccionDireccionCompleta ||
      !seccionEscolaridadCompleta ||
      !seccionExperienciaCompleta
    ) {
      const pendientes: number[] = []
      if (!seccionPersonalCompleta) pendientes.push(0)
      if (!seccionDireccionCompleta) pendientes.push(1)
      if (!seccionEscolaridadCompleta) pendientes.push(2)
      if (!seccionExperienciaCompleta) pendientes.push(3)
      setAcordeonesActivos(pendientes)
      notificar.error(
        'Por favor completa los campos obligatorios marcados con asterisco (*) en todas las secciones.',
        'Campos pendientes',
      )
      return
    }

    const nuevoFolio = `PAD-HON-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setFolioGenerado(nuevoFolio)
    notificar.exito(
      `El expediente de ${nombres} ${primerApellido} fue inscrito con el folio ${nuevoFolio}.`,
      'Registro en Padrón Exitoso',
    )
  }
  /* Handlers de la seccion Datso personales */
  const styleCURPButton = {
    width: '13rem',
    height: '1rem',
    marginTop: '2rem',
  }

  const datosPersonalesPrueba = {
    nombre: "Abraham",
    primerApellido: "Borja",
    segundoApellido: "Organista",
    curp: "DDFR235689HDFRRB01",
    rfc: "DDFR235689VF6",
    nacionalidad: "MEXICANA"
  }

  const [curpValidado, setCurpValidado] = useState(false)
  const handlerValidarCurp = () => {
    setCurpValidado(true)
    setNombres(datosPersonalesPrueba.nombre)
    setPrimerApellido(datosPersonalesPrueba.primerApellido)
    setSegundoApellido(datosPersonalesPrueba.segundoApellido)
    setCurp(datosPersonalesPrueba.curp)
    setRfc(datosPersonalesPrueba.rfc)
    setNacionalidad(datosPersonalesPrueba.nacionalidad)
    notificar.exito("CURP validada correctamente", "CURP")
  }



  // logica de la seccion direccion
  const [showDireccion, setShowDireccion] = useState(true)
  const [direcciones, setDirecciones] = useState<DireccionItem[]>(DATOS_EJEMPLO)
  const handleDireccionCompleto = () => {
    const newDireccion: DireccionItem = {
      calle,
      numeroExterior,
      numeroInterior,
      codigoPostal,
      colonia,
      municipioAlcaldia,
      entidadFederativa,
      pais,
      referenciasDomicilio
    }
    setDirecciones([...direcciones, newDireccion])
    setShowDireccion(true)
  }
  const clearDirecciones = () => {
    setCodigoPostal('')
    setCalle('')
    setNumeroExterior('')
    setNumeroInterior('')
    setColonia('')
    setPais('México')
    setMunicipioAlcaldia('')
    setReferenciasDomicilio('')
  }
  return (
    <div className="contenedor">
      <style>{ESTILOS_ACORDEON_PADRON}</style>

      {/* ENCABEZADO INSTITUCIONAL DE LA PANTALLA */}
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Padrón de Prestadores de Servicio
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Registro información de prestadores de servicio, domicilio, escolaridad y experiencia profesional para contratación bajo el régimen de honorarios
          </p>
        </div>
        <div className="fila">


        </div>
      </div>

      {/* BARRA DE PROGRESO Y CONTROLES DE ACORDEÓN */}
      <article className="honorarios-tarjeta" style={{ marginTop: 20 }}>
        <div className="honorarios-detalle-barra">
          <div className="fila">
            <span className="b1sb color--principal">Avance de captura:</span>
            <span className={`pildora pildora--${totalSeccionesCompletas === 4 ? 'exito' : 'info'} snd-pildora`}>
              <span className="pildora__dot" aria-hidden="true" />
              {totalSeccionesCompletas} de 4 secciones completas
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
              Expandir las 4 secciones
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
              <strong>La información del Prestador de Servicio ({folioGenerado}): ha sido guarda correctamente</strong> Los datos
              personales, dirección, escolaridad y experiencia laboral de{' '}
              <strong>
                {nombres} {primerApellido} {segundoApellido}
              </strong>{' '}
              han quedado almacenados y listos para validación presupuestal.
            </p>
          </SndMensaje>
        </div>
      )}

      {/* FORMULARIO CON LOS CUATRO ACORDEONES */}
      <form onSubmit={guardarExpediente} noValidate style={{ marginTop: 20 }}>
        <Accordion
          multiple
          activeIndex={acordeonesActivos}
          onTabChange={(e) => setAcordeonesActivos(e.index)}
          className="padron-acordeon"
        >
          {/* =====================================================================
              ACORDEÓN 1: DATOS PERSONALES
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">

                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-user--avatar" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      1. Datos Personales
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Nombre, CURP, RFC con homoclave
                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionPersonalCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionPersonalCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <div className="padron-form-grid" aria-label='form-personal'>

              <div className="campo">
                <label htmlFor="dp-curp" className="b1sb">
                  CURP (18 caracteres) <span className="requerido">*</span>
                </label>
                <InputText
                  id="dp-curp"
                  maxLength={18}
                  value={curp}
                  invalid={intentoEnvio && curp.trim().length < 18}
                  onChange={(e) => setCurp(e.target.value.toUpperCase())}
                  placeholder="Ej. LORM880412MDFRRL09"
                />
                {intentoEnvio && curp.trim().length < 18 && (
                  <span className="campo__error">Ingresa los 18 caracteres de la CURP.</span>
                )}
              </div>
              <div className="campo">
                <SndBoton
                  type="button"
                  style={styleCURPButton}
                  onClick={() => {
                    handlerValidarCurp()
                    if (curpValidado) {
                      setIntentoEnvio(true)
                      if (seccionPersonalCompleta) {
                        setAcordeonesActivos([1])
                        notificar.exito('Datos personales completados correctamente.')
                      } else {
                        notificar.alerta('Por favor completa los datos personales obligatorios.')
                      }
                    }
                  }}
                >
                  Validar Curp
                </SndBoton>
              </div>
              <div className="campo">
              </div>

              <div className="campo">
                <label htmlFor="dp-nombres" className="b1sb">
                  Nombre(s) <span className="requerido">*</span>
                </label>
                <InputText
                  id="dp-nombres"
                  value={nombres}
                  invalid={intentoEnvio && !nombres.trim()}
                  disabled={!curpValidado}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="Ej. María Fernanda"
                />
                {intentoEnvio && !nombres.trim() && (
                  <span className="campo__error">El nombre es obligatorio.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="dp-primer-apellido" className="b1sb">
                  Primer Apellido <span className="requerido">*</span>
                </label>
                <InputText
                  id="dp-primer-apellido"
                  value={primerApellido}
                  invalid={intentoEnvio && !primerApellido.trim()}
                  disabled={!curpValidado}
                  onChange={(e) => setPrimerApellido(e.target.value)}
                  placeholder="Ej. López"
                />
                {intentoEnvio && !primerApellido.trim() && (
                  <span className="campo__error">El primer apellido es obligatorio.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="dp-segundo-apellido" className="b1sb">
                  Segundo Apellido
                </label>
                <InputText
                  id="dp-segundo-apellido"
                  value={segundoApellido}
                  disabled={!curpValidado}
                  onChange={(e) => setSegundoApellido(e.target.value)}
                  placeholder="Ej. Ríos"
                />
              </div>



              <div className="campo">
                <label htmlFor="dp-rfc" className="b1sb">
                  RFC (con homoclave) <span className="requerido">*</span>
                </label>
                <InputText
                  id="dp-rfc"
                  maxLength={10}
                  disabled={!curpValidado}
                  value={rfc}
                  invalid={intentoEnvio && rfc.trim().length < 10}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  placeholder="Ej. LORM880412"
                />
                {intentoEnvio && rfc.trim().length < 10 && (
                  <span className="campo__error">Ingresa los 10 caracteres base del RFC.</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="dp-nacionalidad" className="b1sb">
                  Pais
                </label>
                <Dropdown
                  inputId="dp-nacionalidad"
                  options={OPCIONES_NACIONALIDAD}
                  value={nacionalidad}
                  disabled={!curpValidado}
                  onChange={(e) => setNacionalidad(e.value)}
                  appendTo="self"
                />
              </div>

            </div>
            <SndBoton
              type="submit"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setIntentoEnvio(true)
                if (seccionPersonalCompleta) { // if (seccionPersonalCompleta)
                  setAcordeonesActivos([1])
                  notificar.exito('Datos personales completados correctamente.')
                } else {
                  notificar.alerta('Por favor completa los datos personales obligatorios.')
                }
              }}
            >
              Guardar datos personales
            </SndBoton>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 2: DIRECCIÓN
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-home" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      2. Dirección
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Domicilio registrado para efectos contractuales
                    </span>
                  </div>
                </div>
                <span className={`pildora pildora--${seccionDireccionCompleta ? 'exito' : 'alerta'} snd-pildora`}>
                  <span className="pildora__dot" aria-hidden="true" />
                  {seccionDireccionCompleta ? 'Completado' : 'Por capturar'}
                </span>
              </div>
            }
          >
            <SeccionDireccion
              intentoEnvio={intentoEnvio}
              direcciones={direcciones}
              onDireccionesChange={setDirecciones}
              seccionDireccionCompleta={seccionDireccionCompleta}
              onGuardarDireccion={() => {
                notificar.exito('Dirección agregada correctamente.')
              }}
              onSiguiente={() => {
                setIntentoEnvio(true)
                if (seccionDireccionCompleta) {
                  setAcordeonesActivos([2])
                  notificar.exito('Datos de domicilio guardados temporalmente.')
                } else {
                  notificar.alerta('Por favor completa los datos de domicilio obligatorios.')
                }
              }}
            />
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 3: ESCOLARIDAD
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
                      3. Escolaridad
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Área de estudio, grado máximo de estudios y registro de certificado
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
            <ToggleTabla tabla={<TablaEscolaridad />} showTable={showEscolaridad}>
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
                    value={carrera}
                    invalid={intentoEnvio && !carrera.trim()}
                    onChange={(e) => setCarrera(e.target.value)}
                    placeholder="Ej. Licenciatura en Derecho / Ingeniería en Sistemas"
                  />
                  {intentoEnvio && !carrera.trim() && (
                    <span className="campo__error">La carrera o área de conocimiento es obligatoria.</span>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="esc-institucion" className="b1sb">
                    Institución Educativa
                  </label>
                  <InputText
                    id="esc-institucion"
                    value={institucionEducativa}
                    onChange={(e) => setInstitucionEducativa(e.target.value)}
                    placeholder="Ej. Universidad Nacional Autónoma de México"
                  />
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
                    Documento Comprobatorio
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
                    Número de Certificado / Cédula Profesional
                  </label>
                  <InputText
                    id="esc-cedula"
                    maxLength={10}
                    value={cedulaProfesional}
                    onChange={(e) => setCedulaProfesional(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 08945123"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="esc-anio" className="b1sb">
                    Año de Titulación
                  </label>
                  <InputText
                    id="esc-anio"
                    maxLength={4}
                    value={anioTitulacion}
                    onChange={(e) => setAnioTitulacion(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 2013"
                  />
                </div>
              </div>
            </ToggleTabla>
            {!showEscolaridad ? (
              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionEscolaridadCompleta) {
                    setAcordeonesActivos([3])
                    notificar.exito('Datos de escolaridad guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de escolaridad obligatorios.')
                  }
                }}
              >
                Guardar escolaridad
              </SndBoton>
            ) : (
              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setShowEscolaridad(false)
                }}
              >
                Escolaridad nueva
              </SndBoton>
            )}
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 4: EXPERIENCIA LABORAL
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
                      4. Experiencia Laboral
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Área de experiencia, Años de experiencia
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
            <ToggleTabla tabla={<TablaExperiencia />} showTable={showExperiencia}>
              <div className="padron-form-grid">
                <div className="campo">
                  <label htmlFor="exp-institucion" className="b1sb">
                    Institución
                  </label>
                  <InputText
                    id="exp-institucion"
                    value={institucionLaboral}
                    onChange={(e) => setInstitucionLaboral(e.target.value)}
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
                    value={sectorLaboral}
                    onChange={(e) => setSectorLaboral(e.value)}
                    appendTo="self"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="exp-puesto" className="b1sb">
                    Puesto Desempeñado
                  </label>
                  <InputText
                    id="exp-puesto"
                    value={puestoDesempenado}
                    onChange={(e) => setPuestoDesempenado(e.target.value)}
                    placeholder="Ej. Jefe de Departamento"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="exp-area" className="b1sb">
                    Área de Adscripción
                  </label>
                  <InputText
                    id="exp-area"
                    value={areaAdscripcion}
                    onChange={(e) => setAreaAdscripcion(e.target.value)}
                    placeholder="Ej. Dirección General"
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
                    placeholder="Ej. 5"
                  />
                  {intentoEnvio && !aniosExperiencia.trim() && (
                    <span className="campo__error">Indica los años de experiencia comprobable.</span>
                  )}
                </div>

                <div className="campo padron-form-grid__col-3">
                  <label htmlFor="exp-funciones" className="b1sb">
                    Comentarios / Funciones Principales <span className="requerido">*</span>
                  </label>
                  <textarea
                    id="exp-funciones"
                    className={`padron-textarea ${intentoEnvio && !funcionesPrincipales.trim() ? 'padron-textarea--invalido' : ''}`}
                    value={funcionesPrincipales}
                    onChange={(e) => setFuncionesPrincipales(e.target.value)}
                    placeholder="Describe las actividades técnicas, administrativas o profesionales desempeñadas..."
                  />
                  {intentoEnvio && !funcionesPrincipales.trim() && (
                    <span className="campo__error">
                      La descripción de funciones principales es obligatoria para acreditar experiencia.
                    </span>
                  )}
                </div>
              </div>
            </ToggleTabla>
            {!showExperiencia ? (
              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setIntentoEnvio(true)
                  if (seccionExperienciaCompleta) {
                    setAcordeonesActivos([0])
                    notificar.exito('Datos de experiencia laboral guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de experiencia laboral obligatorios.')
                  }
                }}
              >
                Guardar experiencia laboral
              </SndBoton>
            ) : (
              <SndBoton
                type="button"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setShowExperiencia(false)
                }}
              >
                Experiencia nueva
              </SndBoton>
            )}
          </AccordionTab>
        </Accordion>

        {/* BARRA INFERIOR DE ACCIONES DEL FORMULARIO */}
        <article className="honorarios-tarjeta" style={{ marginTop: 12 }}>
          <div className="honorarios-detalle-barra">
            <span className="sdr" style={{ color: 'var(--neutro600)' }}>
              Los campos marcados con <span className="requerido">*</span> son obligatorios para integrar el expediente
              en el Padrón de Prestadores de Servicio.
            </span>

            <div className="fila fila--derecha">
              <SndBoton variante="secundario" type="button" onClick={limpiarFormulario}>
                Limpiar formulario
              </SndBoton>
              <SndBoton type="submit">
                <SndIcono nombre="snd-checkmark--filled" tamano={20} />
                Guardar en el Padrón
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
