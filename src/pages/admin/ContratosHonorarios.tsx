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
 * Vista dedicada del submódulo "Contratos de honorarios" (`pages/admin/ContratosHonorarios.tsx`).
 */
export default function ContratosHonorarios() {
  useTitulo('Contratos de Honorarios · SABG')
  const [busqueda, setBusqueda] = useState('')
  const [soloVigentes, setSoloVigentes] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  const info = SUBMODULOS_HONORARIOS[1]
  const registros = useMemo(() => {
    const base = honorariosService.obtenerRegistrosPorSubmodulo('contratos')
    const q = sinAcentos(busqueda.trim())
    return base.filter(
      (r) =>
        (!soloVigentes || r.estado === 'Vigente') &&
        (!q || sinAcentos(`${r.folio} ${r.nombre} ${r.unidad} ${r.concepto}`).includes(q)),
    )
  }, [busqueda, soloVigentes])

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Contratos de Honorarios
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Seguimiento de elaboración, suficiencia presupuestal y firma electrónica
          </p>
        </div>
        <div className="fila">
          <SndBotonEnlace variante="primario" to="/formalizacion-contratos">
            Formalización de contratos
          </SndBotonEnlace>
          <SndBotonEnlace variante="secundario" to="/prueba-fiel">
            Bandeja e.firma
          </SndBotonEnlace>
          <SndBotonEnlace variante="secundario" to="/">
            Volver al tablero
          </SndBotonEnlace>
        </div>
      </div>

      <div className="fila" style={{ marginTop: 16 }}>
        <SndPildoraFiltro activo={soloVigentes} onCambio={setSoloVigentes}>
          Solo contratos vigentes
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
        <SndMensaje tipo="alerta">
          <p>
            Recuerda verificar el oficio de suficiencia presupuestal de la Partida 12101 antes de enviar un lote de
            contratos a firma electrónica.
          </p>
        </SndMensaje>
      </div>

      <ModalRegistroHonorarios
        modalTipo={modalAbierto ? 'contratos' : null}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  )
}
