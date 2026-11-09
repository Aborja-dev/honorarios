import { useMemo, useState } from 'react'
import { ModalRegistroHonorarios, useNotificaciones } from '../../components'
import { Hero } from './sections/Hero'
import { Graficas } from './sections/Graficas'
import { Submodulo } from './sections/Submodulo'
import { Informes } from './sections/Informes'
import { honorariosService, SUBMODULOS_HONORARIOS, TRIMESTRES_HONORARIOS, type ClaveSubmodulo } from '../../services'
import { sinAcentos } from '../../utils'
import { useTitulo } from '../../hooks'
import { useSearchParams } from 'react-router-dom'
import { landingTextos } from '../LandingTextos'

const HomePage = () => {
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
    <main className="contenedor">
      <div className="honorarios-tablero">
        {/* COLUMNA IZQUIERDA: Buscador, Bienvenida y Bloques de Cifras y Estadísticas */}
        <section className="honorarios-columna">
          <Hero 
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            notificar={notificar}
            submoduloInfoActual={submoduloInfoActual}
            datosTrimestre={datosTrimestre}
          />
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

        {/* DIVISIÓN VERTICAL CENTRAL */}
        <div className="honorarios-divisor" role="separator" aria-orientation="vertical" />

        {/* COLUMNA DERECHA: Opciones de Submódulos, Acciones Rápidas y Cumplimiento */}
        <section className="honorarios-columna">
          <Submodulo 
            submodulos={SUBMODULOS_HONORARIOS}
            submoduloActivo={submoduloActivo}
            onSeleccionarSubmodulo={seleccionarSubmodulo}
            categoriasActivas={categoriasActivas}
            onAlternarCategoria={alternarCategoria}
            landingTextos={landingTextos}
          />
          <Informes 
            categoriasActivas={categoriasActivas}
            onAlternarCategoria={alternarCategoria}
            landingTextos={landingTextos}
          />
        </section>
      </div>


      {/* DIÁLOGO MODAL DE ALTA RÁPIDA */}
      <ModalRegistroHonorarios modalTipo={modalTipo} onCerrar={() => setModalTipo(null)} />
    </main>
  )
}

export default HomePage

