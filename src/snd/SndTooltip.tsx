import { useEffect, useRef, useState } from 'react'
import { SndIcono } from './SndIcono'
import { cn, nuevoId } from './util'

/** Lado y alineación de la burbuja respecto del botón. */
export type PosicionTooltip =
  | 'arriba-izquierda'
  | 'arriba-centro'
  | 'arriba-derecha'
  | 'abajo-izquierda'
  | 'abajo-centro'
  | 'abajo-derecha'

/** Ancho de la burbuja: `ajustar` al contenido (máx. 320 px) o ancho fijo. */
export type TamanoTooltip = 'ajustar' | 'chico' | 'mediano' | 'grande'

export interface SndTooltipProps {
  /** Texto del mensaje. */
  texto: string
  /** Lado y alineación de la burbuja respecto del botón. */
  posicion?: PosicionTooltip
  /** Ancho de la burbuja. */
  tamano?: TamanoTooltip
  /** Ícono del botón. */
  icono?: string
  /** `aria-label` del botón. */
  etiqueta?: string
}

/**
 * Mensaje emergente del SND (`.tooltip`).
 *
 * La hoja del SND lo muestra al pasar el cursor o al enfocar el botón. El componente añade lo que
 * el SND deja a cargo del proyecto:
 * - Apertura con clic o toque, reflejada en `aria-expanded`.
 * - Cierre con Escape (también cuando el cursor o el foco siguen encima, según WCAG 1.4.13),
 *   y al hacer clic fuera.
 * - Vínculo del texto con el botón mediante `aria-describedby`.
 *
 * @example
 * <SndTooltip texto="Folio asignado al registrar la solicitud." posicion="abajo-derecha" />
 */
export function SndTooltip({
  texto,
  posicion = 'arriba-derecha',
  tamano = 'ajustar',
  icono = 'snd-help',
  etiqueta = 'Ayuda',
}: SndTooltipProps) {
  const [id] = useState(() => nuevoId('snd-tooltip'))
  const [abierto, setAbierto] = useState(false)
  const [descartado, setDescartado] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setAbierto(false)
      // Escape descarta el mensaje aunque el cursor o el foco sigan encima (WCAG 1.4.13, "descartable").
      setDescartado(true)
    }
    const alHacerClic = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('keydown', alPulsarTecla)
    document.addEventListener('click', alHacerClic)
    return () => {
      document.removeEventListener('keydown', alPulsarTecla)
      document.removeEventListener('click', alHacerClic)
    }
  }, [])

  return (
    <div ref={raiz} className="snd-tooltip">
      <div
        className={cn('tooltip', abierto && 'tooltip--mostrar', descartado && 'tooltip--descartado')}
        onMouseLeave={() => setDescartado(false)}
        onBlur={() => setDescartado(false)}
      >
        <button
          type="button"
          className="tooltip__boton"
          aria-label={etiqueta}
          aria-expanded={abierto}
          aria-controls={`${id}-burbuja`}
          aria-describedby={`${id}-lector`}
          onClick={() => {
            setDescartado(false)
            setAbierto((v) => !v)
          }}
        >
          <SndIcono nombre={icono} className="color--azul500 tooltip__imgBoton" tamano={20} />
        </button>
        <div
          id={`${id}-burbuja`}
          className={`tooltip__burbuja tooltip__burbuja--${posicion} tooltip__burbuja--${tamano}`}
          role="tooltip"
          aria-hidden={!abierto}
        >
          {texto}
        </div>
        <span id={`${id}-lector`} className="oculto">
          {texto}
        </span>
      </div>
    </div>
  )
}
