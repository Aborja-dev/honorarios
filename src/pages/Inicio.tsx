import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { Download } from 'lucide-react'
import { CardSubModulo } from '../components/CardSubModulo'
import {
	SndBoton,
	SndBuscador,
	SndIcono,
	SndMensaje,
	useNotificaciones,
} from '../components/snd'
import { Graficas } from '../_pages/landing/sections/Graficas'
import '../components/honorarios/Honorarios.css'

type ClaveSubmodulo = 'padron' | 'contratos' | 'modelo' | 'suficiencia'

interface DatosTrimestre {
	etiqueta: string
	contratosActivos: number
	porcentajeAvance: number
	presupuestoEjercido: string
	estadisticas: {
		vigentes: number
		enFirma: number
		enRevision: number
		porVencer: number
		pendientes: number
	}
}

const landingTextos = {
	tituloPrincipal: '',
	descripcionPrincipal: '',
	tituloAsignacion: 'Asignación PEF',
	tituloEstatus: 'Estatus Contratos 2026',
	tituloCifrasRUSP: 'Cifras RUSP vs Honorario',
	descCifrasRUSP: 'Porcentaje de coincidencias',
	botonCifrasRusp: 'Consultar otra quincena',
	tituloPadron: 'Padrón de Prestadores',
	descPadron: 'Administra el padrón de prestadores de servicios profesionales por honorarios activos en el ejercicio fiscal 2026',
	tituloContrato: 'Formalización de contratos',
	descContrato: 'Contratos autorizados y/o cancelados anticipadamente en el ejercicio fiscal 2026',
	tituloValidarCurp: 'Validador de Compatibilidad',
	descValidarCurp: 'Valida mediante CURP si el prestador cuenta con posible compatibilidad.',
	tituloModelo: 'Modelo de contrato',
	descModelo: 'Actividades, entregables y datos generales del contrato.',
	seccionHonorarios: 'Submódulos de honorarios',
	seccionInformes: 'Informes',
	tituloInformes: 'Categorías',
	botonCargaIndividual: 'Ingresar',
}

const UNIDADES_ADMINISTRATIVAS = [
	'Unidad de Administración y Finanzas',
	'Dirección General de Recursos Humanos',
	'Unidad de Asuntos Jurídicos',
	'Dirección de Tecnologías de la Información',
]

const CATEGORIAS_OPERATIVAS = [
	'En proceso',
	'Autorizado',
	'Rechazado',
	'Cancelado anticipadamente',
	'Pendiente de Autorizar por SFP',
]

const TRIMESTRES_HONORARIOS: DatosTrimestre[] = [
	{
		etiqueta: 'quincena 18/2026',
		contratosActivos: 980,
		porcentajeAvance: 68,
		presupuestoEjercido: '$42.8 M',
		estadisticas: { vigentes: 48, enFirma: 27, enRevision: 15, porVencer: 10, pendientes: 30 },
	},
	{
		etiqueta: 'quincena 19/2026',
		contratosActivos: 1120,
		porcentajeAvance: 76,
		presupuestoEjercido: '$86.4 M',
		estadisticas: { vigentes: 52, enFirma: 23, enRevision: 15, porVencer: 10, pendientes: 30 },
	},
	{
		etiqueta: 'quincena 20/2026',
		contratosActivos: 1248,
		porcentajeAvance: 84,
		presupuestoEjercido: '$129,600,000.25',
		estadisticas: { vigentes: 50, enFirma: 25, enRevision: 15, porVencer: 10, pendientes: 30 },
	},
	{
		etiqueta: 'quincena 21/2026',
		contratosActivos: 1315,
		porcentajeAvance: 92,
		presupuestoEjercido: '$164.2 M',
		estadisticas: { vigentes: 58, enFirma: 18, enRevision: 14, porVencer: 10, pendientes: 30 },
	},
]

const SUBMODULOS_HONORARIOS = [
	{
		id: 'modelo' as const,
		titulo: landingTextos.tituloValidarCurp,
		rutaDedicada: '/validar-identidad',
		metrica: '',
		detalle: landingTextos.descValidarCurp,
		icono: 'snd-edit',
	},
	{
		id: 'padron' as const,
		titulo: landingTextos.tituloPadron,
		rutaDedicada: '/padron-prestadores-servicio',
		metrica: '1,420 Prestadores activos',
		detalle: landingTextos.descPadron,
		icono: 'snd-user--avatar',
	},
	{
		id: 'suficiencia' as const,
		titulo: landingTextos.tituloModelo,
		rutaDedicada: '/alta-modelos-contratos',
		metrica: '',
		detalle: landingTextos.descModelo,
		icono: 'snd-edit',
	},
	{
		id: 'contratos' as const,
		titulo: landingTextos.tituloContrato,
		rutaDedicada: '/formalizacion-contratos',
		metrica: '248 contratos autorizados',
		detalle: landingTextos.descContrato,
		icono: 'snd-document',
	},
]

const REGISTROS_POR_SUBMODULO: Record<ClaveSubmodulo, { folio: string; nombre: string; unidad: string; concepto: string; estado: string }[]> = {
	padron: [
		{ folio: '000000104', nombre: 'María Fernanda López Ríos', unidad: 'LORM990228MDFPSR05', concepto: 'Especialista en Control Presupuestal · Capítulo 1000', estado: 'Expediente validado' },
		{ folio: '000000108', nombre: 'Carlos Alberto Méndez Soto', unidad: 'DMESC900921MDFAA00', concepto: 'Arquitecto de Sistemas Gubernamentales · Asimilados', estado: 'En revisión' },
		{ folio: '000000115', nombre: 'Laura Patricia Gómez Vega', unidad: 'GOVL910214MDFZZ00', concepto: 'Analista de Normatividad Contractual · Capítulo 1000', estado: 'Expediente validado' },
		{ folio: '000000122', nombre: 'Jorge Eduardo Ramírez Cruz', unidad: 'DRACJ850730HDFZZ00', concepto: 'Coordinador de Capacitación y Servicio Profesional', estado: 'Por actualizar constancia' },
	],
	contratos: [
		{ folio: '0000000841', nombre: 'María Fernanda López Ríos', unidad: 'ULORM990228MDFPSR05', concepto: 'Contrato de Prestación de Servicios Profesionales Cap. 1000', estado: 'Vigente' },
		{ folio: '0000000849', nombre: 'Carlos Alberto Méndez Soto', unidad: 'DDMESC900921MDFAA00', concepto: 'Contrato de Honorarios Asimilados a Salarios', estado: 'En firma electrónica' },
		{ folio: '0000000854', nombre: 'Roberto Hernández Villalobos', unidad: 'GOVL910214MDFZZ000', concepto: 'Contrato de Asesoría Especializada en Dictaminación', estado: 'Por vencer' },
		{ folio: '0000000860', nombre: 'Ana Sofía Domínguez Lara', unidad: 'DOLA021090DFZZA000', concepto: 'Contrato de Servicios Profesionales por Obra Determinada', estado: 'Observado' },
		{ folio: '0000000861', nombre: 'Ana Sofía Juarez Rivera', unidad: 'DOLA021090DFZZA000', concepto: 'Contrato de Honorarios Asimilados a Salarios', estado: 'Observado' },
	],
	modelo: [
		{ folio: 'MOD-JUR-2026-01', nombre: 'Modelo Estándar Capítulo 1000 (Persona Física)', unidad: 'Unidad de Asuntos Jurídicos', concepto: 'Plantilla oficial con 18 cláusulas y anexo técnico de actividades', estado: 'Autorizado' },
		{ folio: 'MOD-JUR-2026-02', nombre: 'Modelo de Honorarios Asimilados a Salarios', unidad: 'Dirección General de Recursos Humanos', concepto: 'Plantilla con retención ISR Art. 94 LISR y entregables mensuales', estado: 'Autorizado' },
		{ folio: 'MOD-JUR-2026-03', nombre: 'Modelo Convenio Modificatorio de Monto / Plazo', unidad: 'Unidad de Asuntos Jurídicos', concepto: 'Adendum para ampliación de vigencia o techo presupuestal', estado: 'En actualización' },
	],
	suficiencia: [
		{ folio: 'SUF-2026-0312', nombre: 'Oficio de Suficiencia Presupuestal Partida 12101', unidad: 'Unidad de Administración y Finanzas', concepto: 'Autorización global 3.er Trimestre Honorarios Asimilados', estado: 'Liberado' },
		{ folio: 'SUF-2026-0319', nombre: 'Entregables de Actividades Septiembre 2026', unidad: 'Dirección General de Recursos Humanos', concepto: 'Lote de 142 informes mensuales firmados con e.firma', estado: 'En validación' },
	],
}

const honorariosService = {
	obtenerSubmodulos: () => SUBMODULOS_HONORARIOS,
	obtenerTrimestres: () => TRIMESTRES_HONORARIOS,
	obtenerRegistrosPorSubmodulo: (submodulo: ClaveSubmodulo) => REGISTROS_POR_SUBMODULO[submodulo] ?? [],
}

const sinAcentos = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function Inicio() {
	useEffect(() => {
		document.title = 'Módulo de Honorarios · SABG'
	}, [])

	const notificar = useNotificaciones()
	const [searchParams, setSearchParams] = useSearchParams()
	const submoduloParam = searchParams.get('submodulo') as ClaveSubmodulo | null
	const submoduloActivo: ClaveSubmodulo =
		submoduloParam && ['padron', 'contratos', 'modelo', 'suficiencia'].includes(submoduloParam)
			? submoduloParam
			: 'padron'
	const seleccionarSubmodulo = (id: ClaveSubmodulo) => setSearchParams({ submodulo: id })

	const [busqueda, setBusqueda] = useState('')
	const [indiceTrimestre, setIndiceTrimestre] = useState(2)
	const datosTrimestre = TRIMESTRES_HONORARIOS[indiceTrimestre]
	const [ventanillaAbierta, setVentanillaAbierta] = useState(true)
	const [firmaActiva, setFirmaActiva] = useState(true)
	const [categoriasActivas, setCategoriasActivas] = useState<string[]>([])
	const [modalTipo, setModalTipo] = useState<'padron' | 'contratos' | 'modelo' | null>(null)
	const [pasoModal, setPasoModal] = useState(0)
	const [nombreCaptura, setNombreCaptura] = useState('')
	const [nombreError, setNombreError] = useState(false)
	const [unidadCaptura, setUnidadCaptura] = useState<string | null>(UNIDADES_ADMINISTRATIVAS[0])
	const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date(2026, 9, 23))

	const submoduloInfoActual = SUBMODULOS_HONORARIOS.find((submodulo) => submodulo.id === submoduloActivo) ?? SUBMODULOS_HONORARIOS[0]

	const alternarCategoria = (categoria: string, activo: boolean) => {
		setCategoriasActivas((anteriores) => activo ? [...anteriores, categoria] : anteriores.filter((actual) => actual !== categoria))
	}

	const cerrarModal = () => {
		setModalTipo(null)
		setPasoModal(0)
		setNombreCaptura('')
		setNombreError(false)
	}

	const guardarRegistro = (event: FormEvent) => {
		event.preventDefault()
		if (!nombreCaptura.trim()) {
			setNombreError(true)
			return
		}
		const mensajes = {
			padron: 'Prestador registrado en el padrón correctamente.',
			contratos: 'Borrador de contrato de honorarios generado.',
			modelo: 'Nueva versión de modelo de contrato guardada.',
		}
		notificar.exito(mensajes[modalTipo ?? 'padron'], 'Operación exitosa')
		cerrarModal()
	}

	return (
		<main className="contenedor">
			<div className="honorarios-tablero">
				<section className="honorarios-columna">
					<SndBuscador
						variante="principal"
						etiqueta="Buscar en el módulo de Honorarios"
						placeholder="Buscar prestador, RFC, folio de contrato o modelo…"
						valor={busqueda}
						onValor={setBusqueda}
						onBuscar={(valor) => {
							if (valor.trim()) notificar.info(`Mostrando coincidencias para «${valor}» en ${submoduloInfoActual.titulo}.`)
						}}
					/>

					<section className="honorarios-bienvenida" aria-label="Bienvenida al módulo">
						<div className="honorarios-bienvenida__contenido">
							<span className="honorarios-bienvenida__etiqueta b1sb">
								<SndIcono nombre="snd-checkmark--filled" tamano={16} />
								quincena 20/2026 · SABG
							</span>
							<h1 className="h2b patria honorarios-bienvenida__titulo">Módulo de Honorarios</h1>
							<p className="b1r honorarios-bienvenida__texto" />

						</div>
						<div className="honorarios-bienvenida__ilustracion" aria-hidden="true">
							<SndIcono nombre="snd-user--avatar" tamano={72} />
						</div>
					</section>

					<Graficas
						datosTrimestre={datosTrimestre}
						indiceTrimestre={indiceTrimestre}
						setIndiceTrimestre={setIndiceTrimestre}
						ventanillaAbierta={ventanillaAbierta}
						setVentanillaAbierta={setVentanillaAbierta}
						firmaActiva={firmaActiva}
						setFirmaActiva={setFirmaActiva}
					/>
				</section>

				<div className="honorarios-divisor" role="separator" aria-orientation="vertical" />

				<section className="honorarios-columna">
					<div className="honorarios-encabezado-seccion">
						<div>
							<h2 className="h2b honorarios-encabezado-seccion__titulo">Submódulos de honorarios</h2>
						</div>
					</div>

					<div className="honorarios-submodulos-layout">
						<div className="honorarios-submodulos-grid">
							<CardSubModulo
								id="validacion"
								titulo="Validador de Compatibilidad"
								descripcion="Valida mediante CURP si el prestador cuenta con posible compatibilidad."
								ruta="/validar-identidad"
								icono="snd-edit"
							/>
							<CardSubModulo
								id="padron"
								titulo="Padrón de Prestadores"
								detalle="1,420 Prestadores activos"
								descripcion="Administra el padrón de prestadores de servicios profesionales por honorarios activos en el ejercicio fiscal 2026"
								ruta="/padron-prestadores-servicio"
								icono="snd-user--avatar"
							/>
							<CardSubModulo
								id="modelo"
								titulo="Modelo de contrato"
								descripcion="Actividades, entregables y datos generales del contrato."
								ruta="/alta-modelos-contratos"
								icono="snd-edit"
							/>
							<CardSubModulo
								id="contratos"
								titulo="Formalización de contratos"
								detalle="248 contratos autorizados"
								descripcion="Contratos autorizados y/o cancelados anticipadamente en el ejercicio fiscal 2026"
								ruta="/formalizacion-contratos"
								icono="snd-document"
							/>
						</div>
					</div>

					<div className="honorarios-encabezado-seccion" style={{ marginTop: 4 }}>
						<h2 className="h2b honorarios-encabezado-seccion__titulo">{landingTextos.seccionInformes}</h2>
					</div>
					<div className="honorarios-inferior-derecha">
						<article className="honorarios-tarjeta">
							<div className="honorarios-tarjeta__encabezado">
								<h3 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloInformes}</h3>
							</div>
							<div className="honorarios-pildoras-grid">
								{CATEGORIAS_OPERATIVAS.map((categoria) => (
									<span className="snd-pildora-filtro" key={categoria}>
										<button
											type="button"
											className="pildoraFiltro"
											style={{display: 'flex', justifyContent: 'space-between'}}
											aria-pressed={categoriasActivas.includes(categoria)}
											onClick={() => alternarCategoria(categoria, !categoriasActivas.includes(categoria))}
										>
											<Download size={24} />
											<span style={{textAlign: 'center', flexGrow: 1}}>{categoria}</span>
										</button>
									</span>
								))}
								<SndBoton
									style={{ fontSize: '0.8rem', width: '100%', maxWidth: '200px', padding: '1rem 0.8rem' }}
									onClick={() => notificar.info(`Reporte solicitado para ${categoriasActivas.length} categorías.`)}
								>
									Generar reporte dinámico
								</SndBoton>
							</div>
						</article>
					</div>
				</section>
			</div>

			<Dialog
				header={modalTipo === 'padron' ? 'Alta en Padrón del Prestador de Servicios' : modalTipo === 'contratos' ? 'Nuevo Contrato de Honorarios' : 'Registro de Modelo de Contrato'}
				visible={modalTipo !== null}
				onHide={cerrarModal}
				modal
				style={{ width: 'min(38rem, 94vw)' }}
				footer={
					<div className="fila fila--derecha">
						<SndBoton variante="secundario" onClick={cerrarModal}>Cancelar</SndBoton>
						<SndBoton type="submit" form="form-honorarios-modal">Guardar registro</SndBoton>
					</div>
				}
			>
				<Stepper activeStep={pasoModal} onChangeStep={(event) => setPasoModal(event.index)}>
					<StepperPanel header="Datos generales">
						<form id="form-honorarios-modal" className="formulario" onSubmit={guardarRegistro} noValidate>
							<div className="campo">
								<label htmlFor="campo-nombre-modal" className="b1sb">
									{modalTipo === 'modelo' ? 'Nombre de la plantilla o modelo' : 'Nombre completo del prestador'}{' '}
									<span className="requerido" aria-hidden="true">*</span>
								</label>
								<InputText
									id="campo-nombre-modal"
									value={nombreCaptura}
									invalid={nombreError}
									aria-invalid={nombreError}
									onChange={(event) => setNombreCaptura(event.target.value)}
									onFocus={() => setNombreError(false)}
									placeholder={modalTipo === 'modelo' ? 'Ej. Modelo Honorarios Capítulo 1000' : 'Ej. María Fernanda López Ríos'}
								/>
								{nombreError && <span className="campo__error" role="alert">Este campo es obligatorio para continuar.</span>}
							</div>
							<div className="campo">
								<label htmlFor="campo-unidad-modal" className="b1sb">Unidad Administrativa</label>
								<Dropdown
									inputId="campo-unidad-modal"
									ariaLabel="Unidad Administrativa"
									pt={{ select: { 'aria-label': 'Unidad Administrativa' } }}
									options={UNIDADES_ADMINISTRATIVAS.map((unidad) => ({ label: unidad, value: unidad }))}
									value={unidadCaptura}
									onChange={(event) => setUnidadCaptura(event.value)}
									placeholder="Selecciona una unidad"
									appendTo="self"
								/>
							</div>
							<div className="campo">
								<label htmlFor="campo-fecha-modal" className="b1sb">Fecha de inicio de vigencia</label>
								<Calendar
									inputId="campo-fecha-modal"
									value={fechaInicio}
									onChange={(event) => setFechaInicio((event.value as Date | null) ?? null)}
									dateFormat="dd/mm/yy"
									showIcon
									appendTo="self"
								/>
							</div>
						</form>
					</StepperPanel>
					<StepperPanel header="Validación y Anexos">
						<div className="pila">
							<SndMensaje tipo="exito">
								<p>Suficiencia presupuestal y compatibilidad de empleo verificadas automáticamente.</p>
							</SndMensaje>
							<p className="b1r">Al confirmar el guardado se asignará el folio consecutivo del ejercicio 2026 y se notificará al área revisora.</p>
						</div>
					</StepperPanel>
				</Stepper>
			</Dialog>
		</main>
	)
}
