import type { ReactNode } from 'react'
import { Download } from 'lucide-react'

/** Tipos de píldora de estatus. */
export type TipoPildora = 'exito' | 'error' | 'alerta' | 'info' | 'neutro' | 'naranja' | 'purple' | 'inactivo'

export interface SndPildoraProps {
  tipo?: TipoPildora
  punto?: boolean
  children: ReactNode
}

export function SndPildora({ tipo = 'neutro', punto = true, children }: SndPildoraProps) {
  return (
    <span className={`pildora pildora--${tipo} snd-pildora`}>
      {punto && <span className="pildora__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export interface SndPildoraFiltroProps {
  activo: boolean
  onCambio: (activo: boolean) => void
  children: ReactNode
}

export function SndPildoraFiltro({ activo, onCambio, children }: SndPildoraFiltroProps) {
  return (
    <span className="snd-pildora-filtro">
      <button type="button" className="pildoraFiltro" aria-pressed={activo} onClick={() => onCambio(!activo)}>
        {children}
       <Download size={24} />
      </button>
    </span>
  )
}
