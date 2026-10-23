import { useMemo, useState } from 'react'
import {
  BandejaSubmodulo,
  ModalRegistroHonorarios,
  SndBotonEnlace,
  SndMensaje,
  SndPildoraFiltro,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService } from '../../services'
import { sinAcentos } from '../../utils'

/**
 * Vista dedicada del submódulo "Padrón del prestador de servicios" (`pages/admin/PadronPrestadores.tsx`).
 */
export default function PadronPrestadores() {
  useTitulo('Padrón del Prestador de Servicios · Honorarios')
  const [busqueda, setBusqueda] = useState('')
  const [soloValidados, setSoloValidados] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

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
            Padrón del Prestador de Servicios
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Administración de expedientes, constancias fiscales y compatibilidad
          </p>
        </div>
        <SndBotonEnlace variante="secundario" to="/">
          Volver al tablero
        </SndBotonEnlace>
      </div>

      <div className="fila" style={{ marginTop: 16 }}>
        <SndPildoraFiltro activo={soloValidados} onCambio={setSoloValidados}>
          Solo expedientes validados
        </SndPildoraFiltro>
      </div>

      <BandejaSubmodulo
        submodulo={info}
        registros={registros}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onNuevoRegistro={() => setModalAbierto(true)}
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
