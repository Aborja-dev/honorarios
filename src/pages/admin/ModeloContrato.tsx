import { useMemo, useState } from 'react'
import {
  BandejaSubmodulo,
  ModalRegistroHonorarios,
  SndBotonEnlace,
  SndMensaje,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService } from '../../services'
import { sinAcentos } from '../../utils'

/**
 * Vista dedicada del submódulo "Modelo de contrato" (`pages/admin/ModeloContrato.tsx`).
 */
export default function ModeloContrato() {
  useTitulo('Modelo de Contrato · Módulo de Honorarios')
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

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
            Catálogo de plantillas jurídicas y clausulados dictaminados para Honorarios
          </p>
        </div>
        <SndBotonEnlace variante="secundario" to="/">
          Volver al tablero
        </SndBotonEnlace>
      </div>

      <BandejaSubmodulo
        submodulo={info}
        registros={registros}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        onNuevoRegistro={() => setModalAbierto(true)}
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
