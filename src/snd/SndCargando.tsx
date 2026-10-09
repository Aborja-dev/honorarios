import { SndIcono } from './SndIcono'

export interface SndCargandoProps {
  /** Tamaño del ícono: `md` (48 px) o `lg` (88 px). */
  tamano?: 'md' | 'lg'
  /** Texto bajo el ícono. */
  texto?: string
}

/**
 * Indicador de carga: ícono giratorio con texto.
 *
 * Desviación del SND: la documentación describe clases `spin__*` que no existen en la hoja v1.3.0.
 * El componente usa el ícono `snd-loading2` con la animación `.icono__spin` (sí publicada) y una
 * disposición mínima propia. Para avance medible usar la barra de progreso de PrimeReact.
 *
 * Accesibilidad: `role="status"` con `aria-live="polite"`.
 *
 * @example
 * <SndCargando tamano="lg" texto="Procesando…" />
 */
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
