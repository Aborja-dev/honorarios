import type { ReactNode } from 'react'
import { SndIcono } from './SndIcono'
import { cn } from './util'

/** Tipos de mensaje informativo del SND. */
export type TipoMensaje = 'info' | 'exito' | 'alerta' | 'error' | 'neutro'

export const ICONOS_MENSAJE: Record<TipoMensaje, string> = {
  info: 'snd-information',
  exito: 'snd-checkmark--filled',
  alerta: 'snd-warning',
  error: 'snd-close--filled',
  neutro: 'snd-information',
}

export interface SndMensajeProps {
  /** Tipo de mensaje; define color e ícono. */
  tipo?: TipoMensaje
  /** Quita borde y sombra (`.aviso--borde-no`). */
  sinBorde?: boolean
  children: ReactNode
}

/**
 * Mensaje informativo del SND (`.aviso`).
 *
 * Permanece visible mientras la información sea relevante y no se puede cerrar. Para avisos que
 * desaparecen se usan las notificaciones (`useNotificaciones`).
 *
 * Accesibilidad: `role="alert"` para `error` y `alerta`; `role="status"` para el resto.
 * Sombra: usa `--snd-sombra-tenue` (definida en `index.css`).
 *
 * Color: texto e ícono en el tono 500 del color de validación de cada tipo (`snd.css`).
 *
 * @example
 * <SndMensaje tipo="exito">Se guardó correctamente.</SndMensaje>
 */
export function SndMensaje({ tipo = 'info', sinBorde = false, children }: SndMensajeProps) {
  return (
    <div
      className={cn('aviso', `aviso--${tipo}`, sinBorde && 'aviso--borde-no', 'snd-mensaje')}
      role={tipo === 'error' || tipo === 'alerta' ? 'alert' : 'status'}
    >
      <SndIcono nombre={ICONOS_MENSAJE[tipo]} tamano={24} />
      <div className="aviso__cont">{children}</div>
    </div>
  )
}
