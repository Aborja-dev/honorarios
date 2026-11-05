import { useMemo, useState } from 'react'
import {
  BandejaSubmodulo,
  ModalRegistroHonorarios,
  SndBoton,
  SndBotonEnlace,
  SndIcono,
  SndMensaje,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService } from '../../services'
import { sinAcentos } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { BandejaSubmoduloModelo } from '../../components/honorarios/BandejaModelo'
/**
 * Vista dedicada del submódulo "Modelo de contrato" (`pages/admin/ModeloContrato.tsx`).
 */

const OPCIONES_RAMO = [
  { label: '27 - Anticorrupcíon y Buen Gobierno', value: '27' },
  { label: '06 - Hacienda y Crédito Público', value: '06' },
  { label: '04 - Gobernación', value: '04' },
  { label: '11 - Educación Pública', value: '11' },
  { label: '12 - Salud', value: '12' },
]

const OPCIONES_UR = [
  { label: '027 - Secretaria Anticorrupcíon  y Buen Gobierno', value: '27' },
  { label: '006 - Secretaria Hacienda y Crédito Público', value: '06' },
  { label: '004 - Secretaria Gobernación', value: '04' },
]


export default function ModeloContrato() {
  useTitulo('Modelo de Contrato · Módulo de Honorarios')
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)


  // Estados de la sección de búsqueda
  const [ramoBusqueda, setRamoBusqueda] = useState<string | null>(null)
  const [institucionBusqueda, setInstitucionBusqueda] = useState<string | null>(null)
  const [idContratoBusqueda, setIdContratoBusqueda] = useState('')
  const [curpBusqueda, setCurpBusqueda] = useState('')
  const [rfcBusqueda, setRfcBusqueda] = useState('')

  const navigate = useNavigate()
  const info = SUBMODULOS_HONORARIOS[2]
  const registros = useMemo(() => {
    const base = honorariosService.obtenerRegistrosPorSubmodulo('modelo')
    const q = sinAcentos(busqueda.trim())
    if (!q) return base
    return base.filter((r) => sinAcentos(`${r.folio} ${r.nombre} ${r.unidad} ${r.concepto}`).includes(q))
  }, [busqueda])

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Modelo de Contrato
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>

          </p>
        </div>
        <div className="fila">
        <SndBotonEnlace variante="secundario" to="/">
          <span><SndIcono nombre="snd-home" tamano={18} /></span>Menu principal
        </SndBotonEnlace>
        </div>
      </div>
      {/* sección de busqueda  */}
      <section className="honorarios-detalle-panel" aria-label="Búsqueda de contratos">
        <div>
          <h2 className="h2b" style={{ margin: 0 }}>
            Búsqueda de Contratos
          </h2>
          <p className="sdr" style={{ margin: '4px 0 0' }}>
            Ingresa los criterios para consultar contratos en el sistema
          </p>
        </div>

        {/* Fila 1: Ramo e Institución */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px 20px',
          }}
        >
          <div className="campo">
            <label htmlFor="busq-cto-ramo" className="b1sb">
              Ramo
            </label>
            <Dropdown
              inputId="busq-cto-ramo"
              options={OPCIONES_RAMO}
              value={ramoBusqueda}
              onChange={(e) => setRamoBusqueda(e.value)}
              placeholder="Selecciona el ramo"
              appendTo="self"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-cto-institucion" className="b1sb">
              Institución
            </label>
            <Dropdown
              inputId="busq-cto-institucion"
              options={OPCIONES_UR}
              value={institucionBusqueda}
              onChange={(e) => setInstitucionBusqueda(e.value)}
              placeholder="Selecciona la institución"
              appendTo="self"
            />
          </div>
        </div>

        {/* Fila 2: Id Contrato, CURP y RFC */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px 20px',
          }}
        >
          <div className="campo">
            <label htmlFor="busq-cto-id" className="b1sb">
              Id Contrato
            </label>
            <InputText
              id="busq-cto-id"
              value={idContratoBusqueda}
              onChange={(e) => setIdContratoBusqueda(e.target.value)}
              placeholder="Ej. 0000000841"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-cto-curp" className="b1sb">
              Nombre del modelo
            </label>
            <InputText
              id="busq-cto-curp"
              maxLength={18}
              value={curpBusqueda}
              onChange={(e) => setCurpBusqueda(e.target.value.toUpperCase())}
              placeholder="001"
            />
          </div>
        </div>

        <div className="fila">
          <SndBoton type="button">
            <SndIcono nombre="snd-search" tamano={18} />
            Buscar
          </SndBoton>
          <SndBoton variante="fantasma" type="button">
            Limpiar formulario
          </SndBoton>
        </div>
      </section>
      <BandejaSubmoduloModelo
        submodulo={info}
        registros={registros}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onNuevoRegistro={() => {
          navigate("/alta-modelos-contratos")
        }}
      />

      <div style={{ marginTop: 20 }}>
        <SndMensaje tipo="exito">
          <p>
            Las plantillas autorizadas cuentan con dictamen jurídico vigente para el Ejercicio Fiscal 2026 y generan
            automáticamente el anexo técnico de actividades.
          </p>
        </SndMensaje>
      </div>

      <ModalRegistroHonorarios
        modalTipo={modalAbierto ? 'modelo' : null}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  )
}
