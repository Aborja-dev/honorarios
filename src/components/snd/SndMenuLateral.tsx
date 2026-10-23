import { NavLink } from 'react-router-dom'
import { SndIcono } from './SndIcono'
import { cn } from '../../utils/cn'

export interface ItemMenuLateral {
  texto: string
  icono: string
  ruta: string
  exacta?: boolean
}

export interface SndMenuLateralProps {
  items: ItemMenuLateral[]
  titulo?: string
  etiqueta?: string
  colapsado: boolean
  onColapsar: (colapsado: boolean) => void
}

export function SndMenuLateral({
  items,
  titulo,
  etiqueta = 'Navegación principal',
  colapsado,
  onColapsar,
}: SndMenuLateralProps) {
  return (
    <nav className={cn('menuMain', colapsado && 'menuMain--colapsado')} aria-label={etiqueta}>
      <button
        type="button"
        className="menuMain__gatillo"
        aria-haspopup="menu"
        aria-expanded={!colapsado}
        onClick={() => onColapsar(!colapsado)}
      >
        <span className="oculto">{colapsado ? 'Mostrar menú' : 'Ocultar menú'}</span>
        <SndIcono nombre="snd-chevron--left" className="menuMain__gatilloIco" tamano={16} />
      </button>
      {titulo && (
        <div className="menuMain__header">
          <div className="menuMain__headerCont">{titulo}</div>
        </div>
      )}
      <ul className="menuMain__lista">
        {items.map((item) => (
          <li key={item.ruta} className="menuMain__item">
            <NavLink to={item.ruta} end={item.exacta} className="menuMain__link menuMain__linkSm">
              <SndIcono nombre={item.icono} className="menuMain__icono" tamano={24} />
              <span className="menuMain__txt">{item.texto}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
