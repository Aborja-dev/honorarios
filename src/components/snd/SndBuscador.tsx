import { useState, type FormEvent } from 'react'
import { SndIcono } from './SndIcono'
import { nuevoId } from '../../utils/cn'

export interface SndBuscadorProps {
  variante?: 'principal' | 'general'
  etiqueta?: string
  placeholder?: string
  ancho?: string
  valor: string
  onValor: (valor: string) => void
  onBuscar?: (valor: string) => void
}

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
