import { SndBoton, SndTooltip } from '../snd'
import type { DatosTrimestre } from '../../services'
import CardRUSP from './CardRUSP'
import ChartAsignacion from './chart/ChartAsignacion'
import ChartEstatus, { COLORES_ESTATUS } from './chart/ChartEstatus'
import { landingTextos } from '../../pages/LandingTextos'

export interface CifrasYEstadisticasProps {
  datosTrimestre: DatosTrimestre
  indiceTrimestre: number
  totalTrimestres: number
  onCambiarTrimestre: (nuevoIndice: number) => void
  ventanillaAbierta: boolean
  onCambiarVentanilla: (abierta: boolean) => void
  firmaActiva: boolean
  onCambiarFirma: (activa: boolean) => void
}

/**
 * Bloques de cifras principales, estadísticas circulares y estado operativo (columna izquierda).
 */
export function CifrasYEstadisticas({
  datosTrimestre,

}: CifrasYEstadisticasProps) {
  const { vigentes, enFirma, enRevision, porVencer,pendientes: conPEndientes } = datosTrimestre.estadisticas
  const asignados = Math.round(
    (datosTrimestre.contratosActivos * datosTrimestre.porcentajeAvance) / 100,
  )
  const pendientes = datosTrimestre.contratosActivos - asignados

  return (
    <>
      <div className="honorarios-cifras-grid">
        {/* Tarjeta Izquierda: Cifra Circular de Contratos Activos */}
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h2 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloAsignacion}</h2>

          </div>

          <div className="honorarios-anillo-contenedor">
            <ChartAsignacion asignados={asignados} pendientes={pendientes} />
          </div>

          <div>
            <p style={{ textAlign: 'center', marginBottom: 0 }}>Monto ejercido en la</p>
            <p className="sdr" style={{ textAlign: 'center', marginBottom: 8 }}>
              {datosTrimestre.etiqueta} <br/><strong>{datosTrimestre.presupuestoEjercido}</strong>
            </p>

          </div>
        </article>

        {/* Tarjeta Derecha: Estadísticas por Estatus Contractual */}
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h2 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloEstatus}</h2>

          </div>

          <div className="honorarios-anillo-contenedor">
            <ChartEstatus datos={[vigentes, enFirma, enRevision, porVencer, conPEndientes]} />
          </div>

          <ul className="honorarios-leyenda">
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[0] }} />
              <span>En proceso ({vigentes}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[1] }} />
              <span>Autorizados ({enFirma}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[2] }} />
              <span>Pendiente de autorizar ({enRevision}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[3] }} />
              <span>Cancelacion anticipada ({porVencer}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[4] }} />
              <span>Rechazado ({conPEndientes}%)</span>
            </li>
          </ul>
        </article>
      </div>

      {/* Tarjetas inferiores de control operativo */}
      <CardRUSP />
    </>
  )
}
