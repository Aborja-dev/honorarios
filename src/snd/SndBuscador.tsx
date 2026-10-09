import { useState, type FormEvent } from 'react'
import { SndIcono } from './SndIcono'
import { nuevoId } from './util'

export interface SndBuscadorProps {
  /** `principal` (lupa a la derecha) o `general` (lupa a la izquierda). */
  variante?: 'principal' | 'general'
  /** Etiqueta del campo, visible solo para lectores de pantalla. */
  etiqueta?: string
  /** Texto de ayuda dentro del campo vacío. */
  placeholder?: string
  /** Ancho del formulario (valor CSS). Nunca excede al contenedor. */
  ancho?: string
  /** Texto del campo (componente controlado). */
  valor: string
  /** Se invoca con el texto en cada tecla. */
  onValor: (valor: string) => void
  /** Se invoca con el texto actual al enviar el formulario (Enter o botón de lupa). */
  onBuscar?: (valor: string) => void
}

/**
 * Barra de búsqueda del SND, en sus dos variantes documentadas.
 *
 * - `principal`: campo grande con botón de lupa a la derecha (portadas y búsquedas globales).
 * - `general`: campo compacto con la lupa a la izquierda (filtros dentro de una pantalla o tabla).
 *
 * `onValor` se invoca en cada tecla, por lo que sirve para filtrar mientras se escribe.
 *
 * Estilos propios: la hoja del SND v1.3.0 no incluye los estilos del campo (solo existen en la hoja
 * de la documentación), por lo que `snd.css` define borde, ancho del input y anillo de foco. Borde,
 * radio y foco coinciden con los de los inputs de PrimeReact.
 *
 * @example
 * <SndBuscador variante="general" valor={filtro} onValor={setFiltro} etiqueta="Buscar solicitudes"
 *   placeholder="Buscar folio…" ancho="26rem" />
 */
export function SndBuscador({
  variante = 'general',
  etiqueta = 'Buscar',
  placeholder = 'Buscar…',
  ancho = '100%',
  valor,
  onValor,
  onBuscar,
}: SndBuscadorProps) {
  const [id] = useState(() => nuevoId('snd-buscador'))
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    onBuscar?.(valor)
  }
  const campo = (
    <input
      type="search"
      id={id}
      placeholder={placeholder}
      className="sh0r js-input"
      autoComplete="off"
      value={valor}
      onChange={(e) => onValor(e.target.value)}
    />
  )

  return (
    <div className="snd-buscador">
      <form className="search-container" role="search" style={{ width: ancho, maxWidth: '100%' }} onSubmit={enviar}>
        <label htmlFor={id} className="oculto">
          {etiqueta}
        </label>
        {variante === 'principal' ? (
          <div className="form__inset main-search">
            {campo}
            <button className="search-button" type="submit">
              <span className="oculto">Buscar</span>
              <SndIcono nombre="snd-search" tamano={28} className="color--blanco" />
            </button>
          </div>
        ) : (
          <div className="form__inset general-search">
            <SndIcono nombre="snd-search" className="search-icon" tamano={24} />
            {campo}
          </div>
        )}
      </form>
    </div>
  )
}
