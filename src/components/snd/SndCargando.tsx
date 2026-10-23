import { SndIcono } from './SndIcono'

export interface SndCargandoProps {
  tamano?: 'md' | 'lg'
  texto?: string
}

export function SndCargando({ tamano = 'md', texto = 'Cargando…' }: SndCargandoProps) {
  return (
    <div className="snd-cargando" role="status" aria-live="polite">
      <SndIcono
        nombre="snd-snd-loading2"
        className="icono__spin color--principal"
        tamano={tamano === 'lg' ? 88 : 48}
      />
      <span className={tamano === 'lg' ? 'sh0b' : 'b1sb'}>{texto}</span>
    </div>
  )
}
