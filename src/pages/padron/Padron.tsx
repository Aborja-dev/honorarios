import { useMemo, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router-dom'
import {
  BandejaSubmodulo,
  ModalRegistroHonorarios,
  SndBoton,
  SndBotonEnlace,
  SndIcono,
  SndMensaje,
  SndPildoraFiltro,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService } from '../../services'
import { sinAcentos } from '../../utils'

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

/**
 * Vista dedicada del submódulo "Padrón del prestador de servicios" (`pages/admin/PadronPrestadores.tsx`).
 */
export default function PadronPrestadores() {
  useTitulo('Padrón del Prestador de Servicios · Honorarios')
  const [busqueda, setBusqueda] = useState('')
  const [soloValidados, setSoloValidados] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  // Estados de la sección de búsqueda
  const [ramoBusqueda, setRamoBusqueda] = useState<string | null>(null)
  const [institucionBusqueda, setInstitucionBusqueda] = useState('')
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [primerApellidoBusqueda, setPrimerApellidoBusqueda] = useState('')
  const [segundoApellidoBusqueda, setSegundoApellidoBusqueda] = useState('')
  const [curpBusqueda, setCurpBusqueda] = useState('')
  const [rfcBusqueda, setRfcBusqueda] = useState('')
  const navigate = useNavigate()
  const info = SUBMODULOS_HONORARIOS[0]
  const registros = useMemo(() => {
    const base = honorariosService.obtenerRegistrosPorSubmodulo('padron')
    const q = sinAcentos(busqueda.trim())
    return base.filter(
      (r) =>
        (!soloValidados || r.tipoPildora === 'exito') &&
        (!q || sinAcentos(`${r.folio} ${r.nombre} ${r.unidad} ${r.concepto}`).includes(q)),
    )
  }, [busqueda, soloValidados])

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Padrón de Prestadores de Servicios
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Administración del expediente de datos personales.
          </p>
        </div>
        <SndBotonEnlace variante="secundario" to="/">
          <span><SndIcono nombre="snd-home" tamano={18} /></span>Menu principal
        </SndBotonEnlace>
      </div>



      {/* sección de busqueda  */}
      <section className="honorarios-detalle-panel" aria-label="Búsqueda de prestadores">
        <div>
          <h2 className="h2b" style={{ margin: 0 }}>
            Búsqueda de Prestadores
          </h2>
          <p className="sdr" style={{ margin: '4px 0 0' }}>
            Ingresa los criterios para consultar en el padrón
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
            <label htmlFor="busq-ramo" className="b1sb">
              Ramo
            </label>
            <Dropdown
              inputId="busq-ramo"
              options={OPCIONES_RAMO}
              value={ramoBusqueda}
              onChange={(e) => setRamoBusqueda(e.value)}
              placeholder="Selecciona el ramo"
              appendTo="self"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-institucion" className="b1sb">
              Institución
            </label>
            <Dropdown
              inputId="busq-institucion"
              options={OPCIONES_UR}
              value={institucionBusqueda}
              onChange={(e) => setInstitucionBusqueda(e.value)}
              placeholder="Selecciona la institución"
              appendTo="self"
            />
          </div>
        </div>

        {/* Fila 2: Nombre, Primer apellido, Segundo Apellido, CURP y RFC */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px 20px',
          }}
        >
          <div className="campo">
            <label htmlFor="busq-nombre" className="b1sb">
              Nombre
            </label>
            <InputText
              id="busq-nombre"
              value={nombreBusqueda}
              onChange={(e) => setNombreBusqueda(e.target.value)}
              placeholder="Ej. María Fernanda"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-primer-apellido" className="b1sb">
              Primer apellido
            </label>
            <InputText
              id="busq-primer-apellido"
              value={primerApellidoBusqueda}
              onChange={(e) => setPrimerApellidoBusqueda(e.target.value)}
              placeholder="Ej. López"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-segundo-apellido" className="b1sb">
              Segundo Apellido
            </label>
            <InputText
              id="busq-segundo-apellido"
              value={segundoApellidoBusqueda}
              onChange={(e) => setSegundoApellidoBusqueda(e.target.value)}
              placeholder="Ej. Ríos"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-curp" className="b1sb">
              CURP
            </label>
            <InputText
              id="busq-curp"
              maxLength={18}
              value={curpBusqueda}
              onChange={(e) => setCurpBusqueda(e.target.value.toUpperCase())}
              placeholder="Ej. LORM990228MDFPSR05"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-rfc" className="b1sb">
              RFC
            </label>
            <InputText
              id="busq-rfc"
              maxLength={13}
              value={rfcBusqueda}
              onChange={(e) => setRfcBusqueda(e.target.value.toUpperCase())}
              placeholder="Ej. LORM880412HDF"
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

      <BandejaSubmodulo
        submodulo={info}
        registros={registros}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onNuevoRegistro={() => {
          navigate("/padron-prestadores-servicio")
        }}
      />

      <div style={{ marginTop: 20 }}>
        <SndMensaje tipo="info">
          <p>
            Todo prestador activo en el padrón debe contar con constancia de situación fiscal vigente y verificación de
            identidad antes de la emisión de su contrato.
          </p>
        </SndMensaje>
      </div>

      <ModalRegistroHonorarios
        modalTipo={modalAbierto ? 'padron' : null}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  )
}
