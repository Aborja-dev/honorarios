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
  indiceTrimestre,
  totalTrimestres,
  onCambiarTrimestre,

}: CifrasYEstadisticasProps) {
  const { vigentes, enFirma, enRevision, porVencer } = datosTrimestre.estadisticas
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
            <SndTooltip
              texto="Total de contratos de honorarios activos y porcentaje de suficiencia presupuestal ejercida en el trimestre seleccionado."
              posicion="abajo-derecha"
            />
          </div>

          <div className="honorarios-anillo-contenedor">
            <ChartAsignacion asignados={asignados} pendientes={pendientes} />
          </div>

          <div>
            <p style={{ textAlign: 'center', marginBottom: 8 }}>Presupuesto Autorizado</p>
            <p className="sdr" style={{ textAlign: 'center', marginBottom: 8 }}>
              {datosTrimestre.etiqueta} <strong>{datosTrimestre.presupuestoEjercido}</strong>
            </p>
            <div className="honorarios-control-rango">
              <SndBoton
                variante="secundario"
                aria-label="Trimestre anterior"
                disabled={indiceTrimestre === 0}
                onClick={() => onCambiarTrimestre(Math.max(0, indiceTrimestre - 1))}
              >
                −
              </SndBoton>
              <div className="honorarios-control-rango__barra" aria-hidden="true">
                <div
                  className="honorarios-control-rango__progreso"
                  style={{ width: `${((indiceTrimestre + 1) / totalTrimestres) * 100}%` }}
                />
              </div>
              <SndBoton
                variante="secundario"
                aria-label="Siguiente trimestre"
                disabled={indiceTrimestre === totalTrimestres - 1}
                onClick={() => onCambiarTrimestre(Math.min(totalTrimestres - 1, indiceTrimestre + 1))}
              >
                +
              </SndBoton>
            </div>
          </div>
        </article>

        {/* Tarjeta Derecha: Estadísticas por Estatus Contractual */}
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h2 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloEstatus}</h2>
            <SndTooltip
              texto="Distribución porcentual del estado actual de los contratos registrados en el ejercicio."
              posicion="abajo-derecha"
            />
          </div>

          <div className="honorarios-anillo-contenedor">
            <ChartEstatus datos={[vigentes, enFirma, enRevision, porVencer]} />
          </div>

          <ul className="honorarios-leyenda">
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[0] }} />
              <span>Autorizados ({vigentes}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[1] }} />
              <span>Cancelacion anticipada ({enFirma}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[2] }} />
              <span>En proceso ({enRevision}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: COLORES_ESTATUS[3] }} />
              <span>Cancelado por vencimiento ({porVencer}%)</span>
            </li>
          </ul>
        </article>
      </div>

      {/* Tarjetas inferiores de control operativo */}
      <CardRUSP />
    </>
  )
}
