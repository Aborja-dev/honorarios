import { SndBoton, SndIcono, SndPildora, SndTooltip, useNotificaciones } from '../snd'
import type { DatosTrimestre } from '../../services'
import { formatearNumero } from '../../utils'

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
  ventanillaAbierta,
  onCambiarVentanilla,
  firmaActiva,
  onCambiarFirma,
}: CifrasYEstadisticasProps) {
  const notificar = useNotificaciones()
  const { vigentes, enFirma, enRevision, porVencer } = datosTrimestre.estadisticas
  const corte1 = vigentes
  const corte2 = vigentes + enFirma
  const corte3 = vigentes + enFirma + enRevision

  return (
    <>
      <div className="honorarios-cifras-grid">
        {/* Tarjeta Izquierda: Cifra Circular de Contratos Activos */}
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h2 className="sh0b honorarios-tarjeta__titulo">Asignacion PEF</h2>
            <SndTooltip
              texto="Total de contratos de honorarios activos y porcentaje de suficiencia presupuestal ejercida en el trimestre seleccionado."
              posicion="abajo-derecha"
            />
          </div>

          <div className="honorarios-anillo-contenedor">
            <div
              className="honorarios-anillo"
              style={{
                background: `conic-gradient(var(--principal) 0% ${datosTrimestre.porcentajeAvance}%, var(--gama100) ${datosTrimestre.porcentajeAvance}% 100%)`,
              }}
            >
              <div className="honorarios-anillo__interior">
                <p className="h2b honorarios-anillo__valor">
                  {formatearNumero(datosTrimestre.contratosActivos)}
                </p>
                <span className="sdr honorarios-anillo__sub">Contratos</span>
              </div>
            </div>
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
            <h2 className="sh0b honorarios-tarjeta__titulo">Estatus Contratos 2026</h2>
            <SndTooltip
              texto="Distribución porcentual del estado actual de los contratos registrados en el ejercicio."
              posicion="abajo-derecha"
            />
          </div>

          <div className="honorarios-anillo-contenedor">
            <div
              className="honorarios-pastel"
              style={{
                background: `conic-gradient(
                  var(--verde500) 0% ${corte1}%,
                  var(--azul500) ${corte1}% ${corte2}%,
                  var(--dorado500) ${corte2}% ${corte3}%,
                  var(--rojo500) ${corte3}% 100%
                )`,
              }}
              role="img"
              aria-label={`Distribución de contratos: ${vigentes}% vigentes, ${enFirma}% en firma, ${enRevision}% en revisión y ${porVencer}% por vencer`}
            >
              <span className="honorarios-pastel__etiqueta" style={{ transform: 'translate(-7px, 10px)' }}>{enRevision}%</span>
              <span className="honorarios-pastel__etiqueta" style={{ transform: 'translate(-43px, -17px)' }}>{porVencer}%</span>
              <span className="honorarios-pastel__etiqueta" >{enFirma}%</span>
              <span className="honorarios-pastel__etiqueta" style={{ transform: 'translate(7px, -26px)' }}>{vigentes}%</span>
            </div>
          </div>

          <ul className="honorarios-leyenda">
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: 'var(--verde500)' }} />
              <span>Autorizados ({vigentes}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: 'var(--azul500)' }} />
              <span>Cancelacion anticipada ({enFirma}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: 'var(--dorado500)' }} />
              <span>En proceso ({enRevision}%)</span>
            </li>
            <li className="honorarios-leyenda__item">
              <span className="honorarios-leyenda__punto" style={{ background: 'var(--rojo500)' }} />
              <span>Cancelado por vencimiento ({porVencer}%)</span>
            </li>
          </ul>
        </article>
      </div>

      {/* Tarjetas inferiores de control operativo */}
    </>
  )
}
