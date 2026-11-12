import { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import {
  ModalCargaMasiva,
  SndBoton,
  SndIcono,
  SndMensaje,
  useNotificaciones,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import './PadronPrestadoresServicio.css'
import { useTitulo } from '../../lib/hooks'
import { type DireccionItem } from '../PadronPrestadores/sections/TablaDireccion'
import SeccionDireccion from '../PadronPrestadores/sections/SeccionDireccion'
import { SeccionEscolaridad } from '../PadronPrestadores/sections/Escolaridad'
import { Experiencia, type ExperienciaItem } from '../PadronPrestadores/sections/Experiencia'
import type { FilaEscolaridad } from '../../components/SeccionGenerica'
import { DATOS_EJEMPLO_DIRECCIONES, DATOS_PERSONALES_PRUEBA } from '../PadronPrestadoresServicio.mock'
import { Calendar } from 'primereact/calendar'
import { BotonHome } from '../BotonHome'

const OPCIONES_NACIONALIDAD = [
  { label: 'México', value: 'MEXICANA' },
  { label: 'Extranjero con residencia permanente', value: 'EXTRANJERA' },
]
const DATOS_EJEMPLO: DireccionItem[] = DATOS_EJEMPLO_DIRECCIONES

/*
  Los catálogos de escolaridad (nivel, estatus, documento) y el de sector
  laboral se mudaron a `PadronPrestadores/sections`, junto a sus campos.
*/


/**
 * Pantalla dedicada "Padrón de Prestadores de Servicio" (`src/pages/PadronPrestadoresServicio.tsx`).
 * Contiene en un solo archivo el formulario integral estructurado en cuatro acordeones:
 * 1. Datos Personales
 * 2. Dirección
 * 3. Escolaridad
 * 4. Experiencia Laboral
 */
export interface PadronPrestadoresServicioProps {
  /**
   * Índices de los acordeones abiertos. Si se indica junto con `onAcordeonesChange`,
   * el componente funciona en modo controlado y el estado lo posee el padre.
   */
  acordeonesActivos?: number | number[]
  /** Notifica los cambios de acordeón abierto al padre (modo controlado). */
  onAcordeonesChange?: (indices: number | number[]) => void
  /** Id del elemento raíz, para enlazar anchors desde fuera. */
  id?: string
}

export default function PadronPrestadoresServicio({
  acordeonesActivos: acordeonesControlados,
  onAcordeonesChange,
  id,
}: PadronPrestadoresServicioProps = {}) {
  useTitulo('Padrón de Prestadores de Servicio · Módulo de Honorarios')
  const notificar = useNotificaciones()

  // Estado local de respaldo para cuando el componente se usa sin controlar.
  const [acordeonesLocales, setAcordeonesLocales] = useState<number | number[]>([0])

  // Modo controlado si el padre entrega ambos: valor y notificador.
  const esControlado = acordeonesControlados !== undefined && onAcordeonesChange !== undefined
  const acordeonesActivos = esControlado ? acordeonesControlados : acordeonesLocales

  /** Actualiza el acordeón en el estado correcto según el modo. */
  const setAcordeonesActivos = (indices: number | number[]) => {
    if (!esControlado) {
      setAcordeonesLocales(indices)
      return
    }
    onAcordeonesChange(indices)
  }
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

  /*
    Dirección, escolaridad y experiencia ya viven en sus secciones
    (`PadronPrestadores/sections`). Aquí solo se conserva lo que la página sigue
    leyendo: la lista de direcciones (validación del expediente) y las fechas de
    vigencia del acordeón de CURP.
  */
  const [direcciones, setDirecciones] = useState<DireccionItem[]>(DATOS_EJEMPLO)
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)

  /* Renglones con los que arranca la sección de experiencia. Después de eso,
     la sección es dueña de su lista (vive en su SectionProvider). */
  const experienciasIniciales: ExperienciaItem[] = [
    {
      id: 1,
      institucionLaboral: 'Secretaría Anticorrupción y Buen Gobierno',
      sectorLaboral: 'PUBLICO_FEDERAL',
      puestoDesempenado: 'Especialista en Análisis Normativo',
      areaAdscripcion: 'Dirección General',
      aniosExperiencia: '6',
      funcionesPrincipales:
        'Revisión técnico-jurídica de expedientes de prestadores de servicios profesionales por honorarios.',
    },
  ]

  /* Renglones de escolaridad: los controla la página, como los de dirección.
     La sección sigue el mismo flujo tabla → formulario → guardar. */
  const [escolaridad, setEscolaridad] = useState<FilaEscolaridad[]>([
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
  ])

  const [showFormulario, setShowFormulario] = useState(false)
  // Validaciones por sección
  const seccionPersonalCompleta = Boolean(
    nombres.trim() &&
    primerApellido.trim() &&
    curp.trim().length >= 18 &&
    rfc.trim().length >= 10
  )

  const seccionDireccionCompleta = direcciones.length > 0

  /*
    Escolaridad y experiencia viven en sus secciones, que calculan su propio
    "completado". La página no puede leerlo, así que estas dos banderas quedan en
    falso hasta que se conecte el aviso de cada sección (`onCompletaChange`).
  */
  const seccionEscolaridadCompleta = false
  const seccionExperienciaCompleta = false

  const totalSeccionesCompletas = [
    seccionPersonalCompleta,
    seccionDireccionCompleta,
    seccionEscolaridadCompleta,
    seccionExperienciaCompleta,
  ].filter(Boolean).length

  const expandirTodo = () => setAcordeonesActivos([0, 1, 2, 3, 4])
  const colapsarTodo = () => setAcordeonesActivos([])


  const limpiarFormulario = () => {
    /* Solo se limpia lo que todavía vive en la página; cada sección limpia su
       propia captura al pulsar Cancelar. */
    setNombres('')
    setPrimerApellido('')
    setSegundoApellido('')
    setCurp('')
    setRfc('')
    setFechaInicio(null)
    setFechaFin(null)

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
      if (!seccionPersonalCompleta) pendientes.push(0, 1)
      if (!seccionDireccionCompleta) pendientes.push(2)
      if (!seccionEscolaridadCompleta) pendientes.push(3)
      if (!seccionExperienciaCompleta) pendientes.push(4)
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
  }

  const [curpValidado, setCurpValidado] = useState(false)
  const handlerValidarCurp = () => {
    setCurpValidado(true)
    setNombres(DATOS_PERSONALES_PRUEBA.nombre)
    setPrimerApellido(DATOS_PERSONALES_PRUEBA.primerApellido)
    setSegundoApellido(DATOS_PERSONALES_PRUEBA.segundoApellido)
    setCurp(DATOS_PERSONALES_PRUEBA.curp)
    setRfc(DATOS_PERSONALES_PRUEBA.rfc)
    setNacionalidad(DATOS_PERSONALES_PRUEBA.nacionalidad)
    notificar.exito("CURP validada correctamente", "CURP")
  }



  return (
    <div className="contenedor" id={id}>

      {/* ENCABEZADO INSTITUCIONAL DE LA PANTALLA */}
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Padrón de Prestadores
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Registro de datos personales de prestadores de servicios profesionales por honorarios
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

          <div className="fila" >
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

      {/* FORMULARIO CON LOS ACORDEONES */}

      <form onSubmit={guardarExpediente} noValidate style={{ marginTop: 20 }}>
        <Accordion
          multiple
          activeIndex={acordeonesActivos}
          onTabChange={(e) => setAcordeonesActivos(e.index)}
          className="padron-acordeon"
        >
          {/* VALIDACIÓN DE IDENTIDAD Y VIGENCIA */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera" id="curp">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-user--avatar" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      Validación de CURP
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      CURP y periodo de prestación del servicio
                    </span>
                  </div>
                </div>

              </div>
            }
          >
            <div className="padron-form-grid" id="padron-seccion-curp">
              <div className="padron-form-grid__busqueda">
                <div className="campo">
                  <label htmlFor="dp-ramo" className="b1sb">Ramo</label>
                  <InputText
                    id="dp-ramo"
                    className="padron-form-grid__filtro"
                    defaultValue="06 - Hacienda y Crédito Público"
                    disabled
                  />
                </div>
                <div className="campo">
                  <label htmlFor="dp-ur" className="b1sb">UR</label>
                  <InputText
                    id="dp-ur"
                    className="padron-form-grid__filtro"
                    defaultValue="000 - Secretaría de Hacienda y Crédito Público"
                    disabled
                  />
                </div>
              </div>
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
                <label htmlFor="fecha-inicio" className="b1sb">
                  Fecha de inicio
                </label>
                <Calendar
                  inputId="fecha-inicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  appendTo="self"
                />
              </div>
              <div className="campo">
                <label htmlFor="fecha-fin" className="b1sb">
                  Fecha de fin
                </label>
                <Calendar
                  inputId="fecha-fin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  appendTo="self"
                />
              </div>
              <div className="campo">
                <label className="b1sb"> Validar posible compatibilidad</label>
                <SndBoton
                  type="button"
                  style={styleCURPButton}
                  onClick={() => {
                    handlerValidarCurp()
                    setShowFormulario(true)
                    if (curpValidado) {
                      setIntentoEnvio(true)
                      if (seccionPersonalCompleta) {
                        setAcordeonesActivos([2])
                        notificar.exito('Datos personales completados correctamente.')
                      } else {
                        notificar.alerta('Por favor completa los datos personales obligatorios.')
                      }
                    }
                  }}
                >
                  Validar
                </SndBoton>
              </div>
              {
                showFormulario && (
                  <div className="campo padron-form-grid__col-2">
                    <SndMensaje tipo='alerta'>{`El prestador con CURP de ${curp} tiene compatibilidad y no presenta conflictos para el ejercicio de sus funciones`}</SndMensaje>
                  </div>
                )
              }
            </div>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 1: DATOS PERSONALES
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera" id="datos-personales">
                <div className="padron-acordeon__titulo-grupo">

                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-user--avatar" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      1. Datos Personales
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Nombre, apellidos y RFC con homoclave
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
            <div className="padron-form-grid" aria-label='form-personal' id="padron-seccion-personal">
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
                  setAcordeonesActivos([2])
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
              <div className="padron-acordeon__cabecera" id="direccion">
                <div className="padron-acordeon__titulo-grupo">
                  <span className="padron-acordeon__icono">
                    <SndIcono nombre="snd-home" tamano={22} />
                  </span>
                  <div>
                    <span className="sh0b" style={{ display: 'block' }}>
                      2. Dirección
                    </span>
                    <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                      Domicilio registrado del prestador
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
            <div id="padron-seccion-direccion">
              <SeccionDireccion
                direcciones={direcciones}
                onDireccionesChange={setDirecciones}
                seccionDireccionCompleta={seccionDireccionCompleta}
                onGuardarDireccion={() => {
                  notificar.exito('Dirección agregada correctamente.')
                }}
                onSiguiente={() => {
                  setIntentoEnvio(true)
                  if (seccionDireccionCompleta) {
                    setAcordeonesActivos([3])
                    notificar.exito('Datos de domicilio guardados temporalmente.')
                  } else {
                    notificar.alerta('Por favor completa los datos de domicilio obligatorios.')
                  }
                }}
              />
            </div>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 3: ESCOLARIDAD
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera" id="escolaridad">
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
            <div id="padron-seccion-escolaridad">
              <SeccionEscolaridad
                registros={escolaridad}
                onRegistrosChange={setEscolaridad}
                onGuardar={(_fila, edicion) => {
                  notificar.exito(
                    edicion
                      ? 'Escolaridad actualizada correctamente.'
                      : 'Escolaridad agregada correctamente.',
                  )
                }}
              />
            </div>
          </AccordionTab>

          {/* =====================================================================
              ACORDEÓN 4: EXPERIENCIA LABORAL
             ===================================================================== */}
          <AccordionTab
            header={
              <div className="padron-acordeon__cabecera" id="experiencia">
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
            <div id="padron-seccion-experiencia">
              <Experiencia
                itemsIniciales={experienciasIniciales}
                onGuardar={(_fila, edicion) => {
                  notificar.exito(
                    edicion
                      ? 'Experiencia laboral actualizada correctamente.'
                      : 'Experiencia laboral agregada correctamente.',
                  )
                }}
                onCompleted={() => setAcordeonesActivos([1])}
              />
            </div>
          </AccordionTab>
        </Accordion>

        {/* BARRA INFERIOR DE ACCIONES DEL FORMULARIO */}
        <article className="honorarios-tarjeta" style={{ marginTop: 12 }}>
          <div className="honorarios-detalle-barra">
            <span className="sdr" style={{ color: 'var(--neutro600)' }}>
              Los campos marcados con <span className="requerido">*</span> son obligatorios para el registro
              en el padrón de prestadores de servicio.
            </span>

            <div className="fila fila--derecha">
              <SndBoton type="submit">
                <SndIcono nombre="snd-save" tamano={20} />
                Guardar en el Padrón
              </SndBoton>
              <SndBoton variante="secundario" type="button" onClick={limpiarFormulario}>
                <SndIcono nombre="snd-renew" tamano={20} />
                Omitir todos los cambios
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
