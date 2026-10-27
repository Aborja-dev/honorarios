import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BienvenidaHonorarios,
  CifrasYEstadisticas,
  ModalRegistroHonorarios,
  PanelSubmodulos,
  SndBuscador,
  useNotificaciones,
} from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'
import {
  SUBMODULOS_HONORARIOS,
  TRIMESTRES_HONORARIOS,
  honorariosService,
  type ClaveSubmodulo,
} from '../services'
import { sinAcentos } from '../utils'

/**
 * Pantalla principal (`Landing.tsx`) del Módulo de Honorarios.
 * Presenta el tablero dividido: bienvenida y bloques de cifras/estadísticas a la izquierda,
 * división vertical central, y submódulos de Honorarios a la derecha.
 */




export default function Landing() {
  useTitulo('Módulo de Honorarios · SABG')
  const notificar = useNotificaciones()
  const [searchParams, setSearchParams] = useSearchParams()

  const submoduloParam = searchParams.get('submodulo') as ClaveSubmodulo | null
  const submoduloActivo: ClaveSubmodulo =
    submoduloParam && ['padron', 'contratos', 'modelo', 'suficiencia'].includes(submoduloParam)
      ? submoduloParam
      : 'padron'

  const seleccionarSubmodulo = (id: ClaveSubmodulo) => {
    setSearchParams({ submodulo: id })
  }

  const [busqueda, setBusqueda] = useState('')
  const [indiceTrimestre, setIndiceTrimestre] = useState(2)
  const datosTrimestre = TRIMESTRES_HONORARIOS[indiceTrimestre]

  const [cumplimiento, setCumplimiento] = useState(92)
  const [ventanillaAbierta, setVentanillaAbierta] = useState(true)
  const [firmaActiva, setFirmaActiva] = useState(true)

  const [categoriasActivas, setCategoriasActivas] = useState<string[]>([])
  const alternarCategoria = (cat: string, nuevoEstado: boolean) => {
    setCategoriasActivas((prev) => (nuevoEstado ? [...prev, cat] : prev.filter((c) => c !== cat)))
  }

  const [modalTipo, setModalTipo] = useState<'padron' | 'contratos' | 'modelo' | null>(null)

  const submoduloInfoActual =
    SUBMODULOS_HONORARIOS.find((s) => s.id === submoduloActivo) ?? SUBMODULOS_HONORARIOS[0]

  const registrosFiltrados = useMemo(() => {
    const base = honorariosService.obtenerRegistrosPorSubmodulo(submoduloActivo)
    const q = sinAcentos(busqueda.trim())
    if (!q) return base
    return base.filter((r) =>
      sinAcentos(`${r.folio} ${r.nombre} ${r.unidad} ${r.concepto} ${r.estado}`).includes(q),
    )
  }, [submoduloActivo, busqueda])

  return (
    <div className="contenedor">
      <div className="honorarios-tablero">
        {/* COLUMNA IZQUIERDA: Buscador, Bienvenida y Bloques de Cifras y Estadísticas */}
        <div className="honorarios-columna">
          <SndBuscador
            variante="principal"
            etiqueta="Buscar en el módulo de Honorarios"
            placeholder="Buscar prestador, RFC, folio de contrato o modelo…"
            valor={busqueda}
            onValor={setBusqueda}
            onBuscar={(valor) => {
              if (valor.trim()) {
                notificar.info(`Mostrando coincidencias para «${valor}» en ${submoduloInfoActual.titulo}.`)
              }
            }}
          />

          <BienvenidaHonorarios etiquetaPeriodo={datosTrimestre.etiqueta} />

          <CifrasYEstadisticas
            datosTrimestre={datosTrimestre}
            indiceTrimestre={indiceTrimestre}
            totalTrimestres={TRIMESTRES_HONORARIOS.length}
            onCambiarTrimestre={setIndiceTrimestre}
            ventanillaAbierta={ventanillaAbierta}
            onCambiarVentanilla={setVentanillaAbierta}
            firmaActiva={firmaActiva}
            onCambiarFirma={setFirmaActiva}
          />
        </div>

        {/* DIVISIÓN VERTICAL CENTRAL */}
        <div className="honorarios-divisor" role="separator" aria-orientation="vertical" />

        {/* COLUMNA DERECHA: Opciones de Submódulos, Acciones Rápidas y Cumplimiento */}
        <PanelSubmodulos
          submodulos={SUBMODULOS_HONORARIOS}
          submoduloActivo={submoduloActivo}
          onSeleccionarSubmodulo={seleccionarSubmodulo}
          onAbrirModal={setModalTipo}
          categoriasActivas={categoriasActivas}
          onAlternarCategoria={alternarCategoria}
          cumplimiento={cumplimiento}
          onCambiarCumplimiento={setCumplimiento}
        />
      </div>


      {/* DIÁLOGO MODAL DE ALTA RÁPIDA */}
      <ModalRegistroHonorarios modalTipo={modalTipo} onCerrar={() => setModalTipo(null)} />
    </div>
  )
}
