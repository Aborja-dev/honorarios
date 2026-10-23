import { useState } from 'react'
import { BandejaSubmodulo, SndBotonEnlace, useNotificaciones } from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService } from '../../services'

/**
 * Vista de seguimiento de informes mensuales y suficiencia (`pages/user/MisEntregables.tsx`).
 */
export default function MisEntregables() {
  useTitulo('Mis Entregables · Módulo de Honorarios')
  const notificar = useNotificaciones()
  const [busqueda, setBusqueda] = useState('')

  const info = SUBMODULOS_HONORARIOS[3]
  const registros = honorariosService.obtenerRegistrosPorSubmodulo('suficiencia')

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Suficiencia y Entregables Mensuales
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Control de reportes de actividades firmados y liberación presupuestal
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
        onNuevoRegistro={() =>
          notificar.exito('Formulario de carga de entregable mensual habilitado.', 'Entregables')
        }
      />
    </div>
  )
}
