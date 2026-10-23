import type { ReactNode } from 'react'
import { SndIcono } from './SndIcono'
import { cn } from '../../utils/cn'

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
  tipo?: TipoMensaje
  sinBorde?: boolean
  children: ReactNode
}

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
