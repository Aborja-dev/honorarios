import { useEffect, useRef, useState } from 'react'
import { SndIcono } from './SndIcono'
import { cn, nuevoId } from '../../utils/cn'

export type PosicionTooltip =
  | 'arriba-izquierda'
  | 'arriba-centro'
  | 'arriba-derecha'
  | 'abajo-izquierda'
  | 'abajo-centro'
  | 'abajo-derecha'

export type TamanoTooltip = 'ajustar' | 'chico' | 'mediano' | 'grande'

export interface SndTooltipProps {
  texto: string
  posicion?: PosicionTooltip
  tamano?: TamanoTooltip
  icono?: string
  etiqueta?: string
}

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
