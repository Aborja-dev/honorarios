import type { FormEvent } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Calendar } from 'primereact/calendar'
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
import { useTitulo } from '../../lib/hooks'
import MenuFlotante, { type ItemMenuFlotante } from '../../components/MenuFlotante'

import '../PadronPrestadoresServicio.css'
import '../PrestadoresPage.css'
import './style.css'
const SECCIONES: ItemMenuFlotante[] = [
  {
    texto: 'Validación de CURP',
    descripcion: 'CURP y periodo del servicio',
    icono: 'snd-document',
    ancla: 'padron-seccion-curp',
    tooltip: '1. Datos Contrato',
  },
  {
    texto: 'Datos personales',
    descripcion: 'Nombre, apellidos y RFC',
    icono: 'snd-edit',
    ancla: 'padron-seccion-personal',
    tooltip: '2. Actividades',
  },
  {
    texto: 'Dirección',
    descripcion: 'Domicilio contractual',
    icono: 'snd-checkmark--filled',
    ancla: 'padron-seccion-direccion',
    tooltip: '3. Entregables',
  },
  {
    texto: 'Escolaridad',
    descripcion: 'Grado máximo y cédula',
    icono: 'snd-user',
    ancla: 'padron-seccion-escolaridad',
    tooltip: '4. Escolaridad',
  },
  {
    texto: 'Experiencia laboral',
    descripcion: 'Trayectoria comprobable',
    icono: 'snd-calendar',
    ancla: 'padron-seccion-experiencia',
    tooltip: '5. Experiencia laboral',
  },
]
import { useForm, aMayusculas, comoFecha, soloDigitos } from '../../lib/useForm'
import {
  DATOS_INICIALES,
  ACTIVIDADES_INICIALES,
  ENTREGABLES_INICIALES,
  ESCOLARIDAD_INICIALES,
  EXPERIENCIA_INICIALES,
} from './data'
import { FormValidators } from './validations'
import type { UIState } from '../../lib/pageReducer'
import {
  OPCIONES_AREA_ESPECIFICA,
  OPCIONES_ESTATUS_ESTUDIOS,
  OPCIONES_FORMATO_ENTREGA,
  OPCIONES_IMPACTO,
  OPCIONES_MODALIDAD,
  OPCIONES_NIVEL_ESTUDIOS,
  OPCIONES_PERIODICIDAD_ACTIVIDAD,
  OPCIONES_SECTOR_LABORAL,
  OPCIONES_TIPO_ENTREGABLE,
} from './data'
import { BotonHome } from '../../components/BotonHome'

// ---------------------------------------------------------------------------
// Formas y validaciones: viven en `data.ts` (valores iniciales) y
// `validations.ts` (reglas + avisos). Aquí solo se instancian en `useForm`.
// ---------------------------------------------------------------------------

export interface AltaModeloProps {
  // Estado de la página
  state: UIState
  // Acciones de la página
  expandirTodo: () => void
  colapsarTodo: () => void
  handleCambiarAcordeon: (e: { index: number | number[] }) => void
  abrirModal: () => void
  cerrarModal: () => void
  reiniciar: () => void
  avanzar: (tabIndex: number, folio?: string | null) => void
  abrirPendientes: (pendientes: number[]) => void
  // Valores calculados / derivados del estado
  acordeonesActivos: number[]
  completed: number
  intentoEnvio: boolean
  folioGenerado: string | null
  modalAbierto: boolean
}

export default function AltaModelosContratos({
  initialValues = DATOS_INICIALES,
  state,
  acordeonesActivos,
  completed,
  intentoEnvio,
  folioGenerado,
  modalAbierto,
  expandirTodo,
  colapsarTodo,
  handleCambiarAcordeon,
  abrirModal,
  cerrarModal,
  reiniciar,
  avanzar,
  abrirPendientes,
}: AltaModeloProps & { initialValues?: typeof DATOS_INICIALES }) {
  useTitulo('Alta de Modelos de Contratos · Módulo de Honorarios')
  const notificar = useNotificaciones()

  // 1. Datos Contrato
  const contratoForm = useForm({
    initialValues: initialValues,
    ...FormValidators.contrato,
    guardar: () => {
      avanzar(0)
    },
    notificar,
  })

  // 2. Actividades
  const actividadesForm = useForm({
    initialValues: ACTIVIDADES_INICIALES,
    ...FormValidators.actividades,
    guardar: () => {
      avanzar(1)
    },
    notificar,
  })

  // 3. Entregables
  const entregablesForm = useForm({
    initialValues: ENTREGABLES_INICIALES,
    ...FormValidators.entregables,
    guardar: () => {
      avanzar(2)
    },
    notificar,
  })

  // 4. Escolaridad
  const escolaridadForm = useForm({
    initialValues: ESCOLARIDAD_INICIALES,
    ...FormValidators.escolaridad,
    guardar: () => {
      avanzar(3)
    },
    notificar,
  })

  // 5. Experiencia Laboral
  const experienciaForm = useForm({
    initialValues: EXPERIENCIA_INICIALES,
    ...FormValidators.experiencia,
    guardar: () => {
      avanzar(4)
    },
    notificar,
  })

  // Valores del formulario desestructurados para el JSX
  const datos = contratoForm.valores
  const actividades = actividadesForm.valores
  const entregables = entregablesForm.valores
  const escolaridad = escolaridadForm.valores
  const experiencia = experienciaForm.valores

  const { cambiarTexto, crearCambioValor } = contratoForm

  // Validaciones por sección (fuente única: `validations.ts`)
  const seccionDatosContratoCompleta = FormValidators.contrato.validar(datos)
  const seccionActividadesCompleta = FormValidators.actividades.validar(actividades)
  const seccionEntregablesCompleta = FormValidators.entregables.validar(entregables)
  const seccionEscolaridadCompleta = FormValidators.escolaridad.validar(escolaridad)
  const seccionExperienciaCompleta = FormValidators.experiencia.validar(experiencia)

  const guardarModeloContrato = (e: FormEvent) => {
    e.preventDefault()
    const seccionesIncompletas = [
      seccionDatosContratoCompleta,
      seccionActividadesCompleta,
      seccionEntregablesCompleta,
      seccionEscolaridadCompleta,
      seccionExperienciaCompleta,
    ]

    if (seccionesIncompletas.some((completa) => !completa)) {
      const pendientes = seccionesIncompletas
        .map((completa, index) => (completa ? -1 : index))
        .filter((index) => index !== -1)
      abrirPendientes(pendientes)
      notificar.error(
        'Por favor completa los campos obligatorios marcados con asterisco (*) en las cinco secciones.',
        'Campos pendientes',
      )
      return
    }

    const nuevoFolio = `MOD-HON-2026-${Math.floor(1000 + Math.random() * 9000)}`
    // Avanzar desde el último índice cierra y completa todas las secciones
    avanzar(state.tabs.length, nuevoFolio)
    notificar.exito(
      `El modelo de contrato "${datos.nombreModelo}" fue registrado con el folio ${nuevoFolio}.`,
      'Alta de Modelo Exitosa',
    )
  }

  // ---------------------------------------------------------------------------
  // Handlers de eventos de la interfaz
  // ---------------------------------------------------------------------------

  const handleSubmitFormulario = (e: FormEvent<HTMLFormElement>) => guardarModeloContrato(e)
  const handleColapsarMenu = () => colapsarTodo()
  const handleAbrirCargaMasiva = () => abrirModal()
  const handleCerrarCargaMasiva = () => cerrarModal()
  const handleOmitir = () => {
    reiniciar()
    contratoForm.limpiarFormulario()
    actividadesForm.limpiarFormulario()
    entregablesForm.limpiarFormulario()
    escolaridadForm.limpiarFormulario()
    experienciaForm.limpiarFormulario()
    notificar.info('Se borraron las secciones de escolaridad y experiencia laboral.')
  }

  // Sección 1: Datos Contrato (los cambios los resuelve `cambiarTexto`/`crearCambioValor`)
  const handleGuardarDatosContrato = () => contratoForm.guardarFormulario()
  // Sección 2: Actividades
  const handleGuardarActividades = () => actividadesForm.guardarFormulario()
  // Sección 3: Entregables (el guardar es genérico, reutiliza `cambiarTexto`)
  const handleGuardarEntregables = () => entregablesForm.guardarFormulario()
  // Sección 4: Escolaridad
  const handleGuardarEscolaridad = () => escolaridadForm.guardarFormulario()
  // Sección 5: Experiencia Laboral
  const handleGuardarExperienciaLaboral = () => experienciaForm.guardarFormulario()
  

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
          onColapsar={handleColapsarMenu}
        />
      </aside>
      <div className="prestadores-layout">
        <div className="prestadores-layout__contenido">
          <div className="contenedor">
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
                <BotonHome />
              </div>
            </div>

            {/* BARRA DE PROGRESO Y CONTROLES DE ACORDEÓN */}
            <article className="honorarios-tarjeta" style={{ marginTop: 20 }}>
              <div className="honorarios-detalle-barra">
                <div className="fila">
                  <span className="b1sb color--principal">Avance de captura:</span>
                  <span className={`pildora pildora--${completed === 5 ? 'exito' : 'info'} snd-pildora`}>
                    <span className="pildora__dot" aria-hidden="true" />
                    {completed} de 5 secciones completas
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
                    onClick={handleAbrirCargaMasiva}
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
                    <strong>{datos.nombreModelo}</strong> han quedado registrados y listos para su uso en la formalización de
                    contratos.
                  </p>
                </SndMensaje>
              </div>
            )}

            {/* FORMULARIO CON LOS CINCO ACORDEONES */}
            <form onSubmit={handleSubmitFormulario} noValidate style={{ marginTop: 20 }}>
              <Accordion
                multiple
                activeIndex={acordeonesActivos}
                onTabChange={handleCambiarAcordeon}
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
                      <span className={`pildora pildora--${state.tabs[0].complete ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {state.tabs[0].complete ? 'Completado' : 'Por capturar'}
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
                        value={datos.claveModelo}
                        invalid={intentoEnvio && !datos.claveModelo.trim()}
                        onChange={cambiarTexto('claveModelo', aMayusculas)}
                        placeholder="Ej. 000000001"
                      />
                      {intentoEnvio && !datos.claveModelo.trim() && (
                        <span className="campo__error">La clave del modelo es obligatoria.</span>
                      )}
                    </div>

                    <div className="campo padron-form-grid__col-2">
                      <label htmlFor="dc-nombre" className="b1sb">
                        Nombre del Modelo de Contrato <span className="requerido">*</span>
                      </label>
                      <InputText
                        id="dc-nombre"
                        value={datos.nombreModelo}
                        invalid={intentoEnvio && !datos.nombreModelo.trim()}
                        onChange={cambiarTexto('nombreModelo')}
                        placeholder="Ej. Modelo Estándar Capítulo 1000 (Persona Física)"
                      />
                      {intentoEnvio && !datos.nombreModelo.trim() && (
                        <span className="campo__error">El nombre del modelo de contrato es obligatorio.</span>
                      )}
                    </div>

                    <div className="campo">
                      <label htmlFor="dc-oficio" className="b1sb">
                        Proyecto / Objeto del contrato
                      </label>
                      <InputText
                        id="dc-oficio"
                        value={datos.oficioDictamen}
                        onChange={cambiarTexto('oficioDictamen')}
                        placeholder="Ej. Proyecto para servicios profesionales"
                      />
                    </div>

                    <div className="campo">
                      <label htmlFor="dc-fecha-inicio" className="b1sb">
                        Fecha de Inicio de Vigencia <span className="requerido">*</span>
                      </label>
                      <Calendar
                        inputId="dc-fecha-inicio"
                        value={datos.fechaInicioVigencia}
                        invalid={intentoEnvio && !datos.fechaInicioVigencia}
                        onChange={crearCambioValor('fechaInicioVigencia', comoFecha)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        appendTo="self"
                      />
                      {intentoEnvio && !datos.fechaInicioVigencia && (
                        <span className="campo__error">Selecciona la fecha de inicio de vigencia.</span>
                      )}
                    </div>

                    <div className="campo">
                      <label htmlFor="dc-fecha-fin" className="b1sb">
                        Fecha de Término de Vigencia <span className="requerido">*</span>
                      </label>
                      <Calendar
                        inputId="dc-fecha-fin"
                        value={datos.fechaFinVigencia}
                        invalid={intentoEnvio && !datos.fechaFinVigencia}
                        onChange={crearCambioValor('fechaFinVigencia', comoFecha)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        appendTo="self"
                      />
                      {intentoEnvio && !datos.fechaFinVigencia && (
                        <span className="campo__error">Selecciona la fecha de término de vigencia.</span>
                      )}
                    </div>

                    <div className="campo padron-form-grid__col-3">
                      <label htmlFor="dc-objeto" className="b1sb">
                        Comentario
                      </label>
                      <textarea
                        id="dc-objeto"
                        className={`padron-textarea ${intentoEnvio && !datos.objetoContrato.trim() ? 'padron-textarea--invalido' : ''}`}
                        value={datos.objetoContrato}
                        onChange={cambiarTexto('objetoContrato')}
                        placeholder="Comentario adiciónal al modelo de contrato..."
                      />
                      {intentoEnvio && !datos.objetoContrato.trim() && (
                        <span className="campo__error">El objeto del contrato es obligatorio.</span>
                      )}
                    </div>
                  </div>

                  <SndBoton
                    type="button"
                    style={{ marginTop: '1rem' }}
                    onClick={handleGuardarDatosContrato}
                  >
                    <SndIcono nombre="snd-save" tamano={18} />
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
                      <span className={`pildora pildora--${state.tabs[1].complete ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {state.tabs[1].complete ? 'Completado' : 'Por capturar'}
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
                        value={actividades.periodicidadActividad}
                        onChange={actividadesForm.crearCambioValor('periodicidadActividad')}
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
                        value={actividades.modalidadServicio}
                        onChange={actividadesForm.crearCambioValor('modalidadServicio')}
                        appendTo="self"
                      />
                    </div>

                    <div className="campo">
                      <label htmlFor="act-fecha-inicio" className="b1sb">
                        Fecha de Inicio<span className="requerido">*</span>
                      </label>
                      <Calendar
                        inputId="act-fecha-inicio"
                        value={datos.fechaInicioVigencia}
                        invalid={intentoEnvio && !datos.fechaInicioVigencia}
                        onChange={crearCambioValor('fechaInicioVigencia', comoFecha)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        appendTo="self"
                      />
                      {intentoEnvio && !datos.fechaInicioVigencia && (
                        <span className="campo__error">Selecciona la fecha de inicio de vigencia.</span>
                      )}
                    </div>

                    <div className="campo">
                      <label htmlFor="act-fecha-fin" className="b1sb">
                        Fecha de Fin <span className="requerido">*</span>
                      </label>
                      <Calendar
                        inputId="act-fecha-fin"
                        value={datos.fechaFinVigencia}
                        invalid={intentoEnvio && !datos.fechaFinVigencia}
                        onChange={crearCambioValor('fechaFinVigencia', comoFecha)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        appendTo="self"
                      />
                      {intentoEnvio && !datos.fechaFinVigencia && (
                        <span className="campo__error">Selecciona la fecha de término de vigencia.</span>
                      )}
                    </div>




                    <div className="campo padron-form-grid__col-3">
                      <label htmlFor="act-descripcion" className="b1sb">
                        Descripción actividad <span className="requerido">*</span>
                      </label>
                      <textarea
                        id="act-descripcion"
                        className={`padron-textarea ${intentoEnvio && !actividades.descripcionActividades.trim() ? 'padron-textarea--invalido' : ''}`}
                        value={actividades.descripcionActividades}
                        onChange={actividadesForm.cambiarTexto('descripcionActividades')}
                        placeholder="Describe la actividad específica que integrarán el contrato..."
                      />
                      {intentoEnvio && !actividades.descripcionActividades.trim() && (
                        <span className="campo__error">La descripción de actividades es obligatoria.</span>
                      )}
                    </div>
                  </div>

                  <SndBoton
                    type="button"
                    style={{ marginTop: '1rem' }}
                    onClick={handleGuardarActividades}
                  >
                    <SndIcono nombre="snd-save" tamano={18} />
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
                      <span className={`pildora pildora--${state.tabs[2].complete ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {state.tabs[2].complete ? 'Completado' : 'Por capturar'}
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
                        value={entregables.nombreEntregable}
                        invalid={intentoEnvio && !entregables.nombreEntregable.trim()}
                        onChange={entregablesForm.cambiarTexto('nombreEntregable')}
                        placeholder="Ej. Informe mensual de actividades y relación de expedientes"
                      />
                      {intentoEnvio && !entregables.nombreEntregable.trim() && (
                        <span className="campo__error">El nombre del entregable es obligatorio.</span>
                      )}
                    </div>
                    <div className="campo">
                      <label htmlFor="ent-fecha" className="b1sb">
                        Fecha entregable <span className="requerido">*</span>
                      </label>
                      <Calendar
                        inputId="ent-fecha"
                        value={entregables.fechaEntregable}
                        invalid={intentoEnvio && !entregables.fechaEntregable}
                        onChange={entregablesForm.crearCambioValor('fechaEntregable', comoFecha)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        appendTo="self"
                      />
                      {intentoEnvio && !entregables.fechaEntregable && (
                        <span className="campo__error">Selecciona la fecha de entrega del entregable.</span>
                      )}
                    </div>

                    <div className="campo">
                      <label htmlFor="ent-tipo" className="b1sb">
                        ID RUSP Recibe Entregable <span className="requerido">*</span>
                      </label>
                      <Dropdown
                        inputId="ent-tipo"
                        options={OPCIONES_TIPO_ENTREGABLE}
                        value={entregables.tipoEntregable}
                        onChange={entregablesForm.crearCambioValor('tipoEntregable')}
                        placeholder="Selecciona tipo de entregable"
                        appendTo="self"
                      />
                    </div>

                    <div className="campo">
                      <label htmlFor="ent-periodicidad" className="b1sb">
                        Autonomia<span className="requerido">*</span>
                      </label>
                      <Dropdown
                        inputId="ent-periodicidad"
                        options={OPCIONES_PERIODICIDAD_ACTIVIDAD}
                        value={entregables.periodicidadEntregable}
                        onChange={entregablesForm.crearCambioValor('periodicidadEntregable')}
                        appendTo="self"
                      />
                    </div>

                    <div className="campo">
                      <label htmlFor="ent-formato" className="b1sb">
                        Complejidad
                      </label>
                      <Dropdown
                        inputId="ent-formato"
                        options={OPCIONES_FORMATO_ENTREGA}
                        value={entregables.formatoEntrega}
                        onChange={entregablesForm.crearCambioValor('formatoEntrega')}
                        appendTo="self"
                      />
                    </div>



                    <div className="campo">
                      <label htmlFor="ent-impacto" className="b1sb">
                        Impacto
                      </label>
                      <Dropdown
                        inputId="ent-impacto"
                        options={OPCIONES_IMPACTO}
                        value={entregables.impacto}
                        onChange={entregablesForm.crearCambioValor('impacto')}
                        appendTo="self"
                      />
                    </div>



                    <div className="campo padron-form-grid__col-3">
                      <label htmlFor="ent-criterios" className="b1sb">
                        Descripción Entregable <span className="requerido">*</span>
                      </label>
                      <textarea
                        id="ent-criterios"
                        className={`padron-textarea ${intentoEnvio && !entregables.criteriosAceptacion.trim() ? 'padron-textarea--invalido' : ''}`}
                        value={entregables.criteriosAceptacion}
                        onChange={entregablesForm.cambiarTexto('criteriosAceptacion')}
                        placeholder="Especifica la descripción del entregable..."
                      />
                      {intentoEnvio && !entregables.criteriosAceptacion.trim() && (
                        <span className="campo__error">Los criterios de aceptación son obligatorios.</span>
                      )}
                    </div>
                  </div>

                  <SndBoton
                    type="button"
                    style={{ marginTop: '1rem' }}
                    onClick={handleGuardarEntregables}
                  >
                    <SndIcono nombre="snd-save" tamano={18} />
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
                            Área de estudio, grado de estudios y registro de certificado requerido
                          </span>
                        </div>
                      </div>
                      <span className={`pildora pildora--${state.tabs[3].complete ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {state.tabs[3].complete ? 'Completado' : 'Por capturar'}
                      </span>
                    </div>
                  }
                >
                  <div className="padron-form-grid">
                    <div className="campo">
                      <label htmlFor="esc-nivel" className="b1sb">
                        Nivel estudio <span className="requerido">*</span>
                      </label>
                      <Dropdown
                        inputId="esc-nivel"
                        options={OPCIONES_NIVEL_ESTUDIOS}
                        value={escolaridad.nivelEstudios}
                        onChange={escolaridadForm.crearCambioValor('nivelEstudios')}
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
                        value={escolaridad.carreraRequerida}
                        invalid={intentoEnvio && !escolaridad.carreraRequerida.trim()}
                        onChange={escolaridadForm.cambiarTexto('carreraRequerida')}
                        placeholder="Ej. Licenciatura en Derecho / Ingeniería en Sistemas"
                      />
                      {intentoEnvio && !escolaridad.carreraRequerida.trim() && (
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
                        value={escolaridad.estatusEstudios}
                        onChange={escolaridadForm.crearCambioValor('estatusEstudios')}
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
                        value={escolaridad.numeroCertificado}
                        onChange={escolaridadForm.cambiarTexto('numeroCertificado', soloDigitos)}
                        placeholder="Ej. 08945123"
                      />
                    </div>
                  </div>

                  <SndBoton
                    type="button"
                    style={{ marginTop: '1rem' }}
                    onClick={handleGuardarEscolaridad}
                  >
                    <SndIcono nombre="snd-save" tamano={18} />
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
                            Área de experiencia y años de experiencia
                          </span>
                        </div>
                      </div>
                      <span className={`pildora pildora--${state.tabs[4].complete ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {state.tabs[4].complete ? 'Completado' : 'Por capturar'}
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
                        value={experiencia.areaGeneralExperiencia}
                        onChange={experienciaForm.crearCambioValor('areaGeneralExperiencia')}
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
                        value={experiencia.areaEspecificaExperiencia}
                        onChange={experienciaForm.crearCambioValor('areaEspecificaExperiencia')}
                        appendTo="self"
                      />
                    </div>

                    <div className="campo">
                      <label htmlFor="exp-anios" className="b1sb">
                        Años de Experiencia <span className="requerido">*</span>
                      </label>
                      <InputText
                        id="exp-anios"
                        maxLength={2}
                        value={experiencia.aniosExperiencia}
                        invalid={intentoEnvio && !experiencia.aniosExperiencia.trim()}
                        onChange={experienciaForm.cambiarTexto('aniosExperiencia', soloDigitos)}
                        placeholder="Ej. 4"
                      />
                      {intentoEnvio && !experiencia.aniosExperiencia.trim() && (
                        <span className="campo__error">Indica los años de experiencia comprobable requeridos.</span>
                      )}
                    </div>

                    <div className="campo padron-form-grid__col-3">
                      <label htmlFor="exp-comentarios" className="b1sb">
                        Comentarios <span className="requerido">*</span>
                      </label>
                      <textarea
                        id="exp-comentarios"
                        className={`padron-textarea ${intentoEnvio && !experiencia.comentariosExperiencia.trim() ? 'padron-textarea--invalido' : ''}`}
                        value={experiencia.comentariosExperiencia}
                        onChange={experienciaForm.cambiarTexto('comentariosExperiencia')}
                        placeholder="Describe las actividades técnicas, administrativas o profesionales requeridas para el modelo de contrato..."
                      />
                      {intentoEnvio && !experiencia.comentariosExperiencia.trim() && (
                        <span className="campo__error">
                          La descripción de experiencia requerida es obligatoria para el modelo.
                        </span>
                      )}
                    </div>
                  </div>

                  <SndBoton
                    type="button"
                    style={{ marginTop: '1rem' }}
                    onClick={handleGuardarExperienciaLaboral}
                  >
                    <SndIcono nombre="snd-save" tamano={18} />
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
                    <SndBoton type="submit">
                      <SndIcono nombre="snd-save" tamano={20} />
                      Guardar modelo de contrato
                    </SndBoton>
                    <SndBoton variante="secundario" type="button" onClick={handleOmitir}>
                      <SndIcono nombre="snd-renew" tamano={20} />
                      Omitir todos los cambios
                    </SndBoton>
                  </div>
                </div>
              </article>
            </form>

            {/* MODAL DE CARGA MASIVA */}
            <ModalCargaMasiva
              visible={modalAbierto}
              onCerrar={handleCerrarCargaMasiva}
            />
          </div>
        </div>
      </div>

    </>
  )
}
