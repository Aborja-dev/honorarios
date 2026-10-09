import { useTema } from '../core/tema'
import { SndIcono } from './SndIcono'

/**
 * Selector de gama de color (guinda o verde). Delega el cambio en `useTema`.
 *
 * Reutiliza la estructura visual del selector de idioma del navbar del SND (`.idioma`), diseñada
 * para el fondo oscuro del encabezado. Incluye las dos variantes responsivas (`--sm` y `--lg`).
 *
 * @example
 * <SndSelectorTema />
 */
export function SndSelectorTema() {
  const { tema, establecer } = useTema()

  const variante = (sufijo: 'sm' | 'lg') => (
    <div className={`idioma__cont idioma--${sufijo}`}>
      <label htmlFor={`snd-tema-${sufijo}`} className="oculto">
        Tema de color
      </label>
      <select
        id={`snd-tema-${sufijo}`}
        className="idioma__select"
        value={tema}
        onChange={(e) => establecer(e.target.value)}
      >
        <option value="guinda">Guinda</option>
        <option value="verde">Verde</option>
      </select>
      <div className="idioma__marker" aria-hidden="true">
        <SndIcono nombre="snd-chevron--down" className="color--blanco" />
      </div>
    </div>
  )

  return (
    <div className="idioma">
      {variante('sm')}
      {variante('lg')}
    </div>
  )
}
