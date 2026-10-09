import { NavLink } from 'react-router-dom'
import { SndIcono } from './SndIcono'
import { cn } from './util'

/** Opción del menú lateral. */
export interface ItemMenuLateral {
  /** Texto visible. */
  texto: string
  /** Nombre del ícono del SND, por ejemplo `snd-home`. */
  icono: string
  /** Ruta de React Router a la que enlaza. */
  ruta: string
  /** Si es `true`, se marca como actual solo con coincidencia exacta de la ruta. */
  exacta?: boolean
}

export interface SndMenuLateralProps {
  /** Opciones del menú. */
  items: ItemMenuLateral[]
  /** Texto del encabezado del menú (opcional). */
  titulo?: string
  /** `aria-label` del elemento `<nav>`. */
  etiqueta?: string
  /** `true` cuando el menú está reducido a íconos. */
  colapsado: boolean
  /** Se invoca con el nuevo estado al pulsar el botón de colapsar. */
  onColapsar: (colapsado: boolean) => void
}

/**
 * Menú lateral del SND (`.menuMain`): columna de 256 px con el degradado de la gama activa, ítem
 * actual resaltado y botón para colapsarla a solo íconos.
 *
 * Componente controlado: el estado `colapsado` vive en quien lo usa.
 *
 * Layout: dentro de la aplicación se usa con `.wrapper--aside` del SND, que lo ubica en el área
 * `aside` junto a `<main>`.
 *
 * Alcance: no incluye la versión móvil (barra inferior con "Más"), que el SND documenta aparte.
 * Limitación: el botón de colapsar se ubica con la regla del SND (40 % de la altura de la ventana).
 *
 * @example
 * <div className="wrapper wrapper--aside">
 *   <SndEncabezado>…</SndEncabezado>
 *   <SndMenuLateral items={items} titulo="Mi sistema" colapsado={c} onColapsar={setC} />
 *   <main id="mainContent" tabIndex={-1}>…</main>
 *   <SndPie />
 * </div>
 */
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
