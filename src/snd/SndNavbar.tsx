import { NavLink } from 'react-router-dom'
import { useMovil } from '../core/useMovil'
import { SndMenuUsuario, type OpcionUsuario } from './SndMenuUsuario'
import { SndSelectorTema } from './SndSelectorTema'

/** Opción de la barra de navegación. */
export interface ItemNavegacion {
  /** Texto visible. */
  texto: string
  /** Ruta de React Router a la que enlaza. */
  ruta: string
  /** Si es `true`, la opción solo se marca como actual cuando la ruta coincide exactamente. */
  exacta?: boolean
}

/** Persona con sesión iniciada que muestra la barra de navegación. */
export interface UsuarioNavbar {
  /** Nombre completo. */
  nombre: string
  /** Perfil o rol. */
  rol?: string
}

export interface SndNavbarProps {
  /** Opciones de navegación. La opción activa recibe `aria-current="page"`. */
  items: ItemNavegacion[]
  /** `aria-label` del elemento `<nav>`. */
  etiqueta?: string
  /** Persona con sesión iniciada; `null` si no hay sesión. */
  usuario?: UsuarioNavbar | null
  /** Opciones del menú de usuario, sin contar "Cerrar sesión". */
  opcionesUsuario?: OpcionUsuario[]
  /** Muestra el botón "Iniciar sesión" cuando no hay `usuario`. */
  mostrarSesion?: boolean
  /** Se invoca al pulsar "Iniciar sesión". */
  onSesion?: () => void
  /** Se invoca al pulsar "Cerrar sesión" en el menú de usuario. */
  onCerrarSesion?: () => void
}

/**
 * Barra de navegación principal del SND (`.subheader`). Se coloca dentro de `<SndEncabezado>`.
 *
 * Contenido (de izquierda a derecha): menú de navegación, selector de tema y, según el estado de
 * sesión, el menú de la persona usuaria o el botón "Iniciar sesión".
 *
 * Alcance: no incluye el botón de opciones de accesibilidad ni el menú de idioma, que el SND
 * documenta como componente externo.
 */
export function SndNavbar({
  items,
  etiqueta = 'Navegación principal',
  usuario = null,
  opcionesUsuario = [],
  mostrarSesion = false,
  onSesion,
  onCerrarSesion,
}: SndNavbarProps) {
  const movil = useMovil()
  return (
    <section className="subheader">
      <div className="subheader__contenedor">
        <details className="mexico__details navHeader__details" open={!movil}>
          <summary className="mexico__summary">
            <span className="mexico__span">Menú</span>
          </summary>
          <nav className="navHeader" aria-label={etiqueta}>
            <ul className="navHeader__ul mexico__detailsCont">
              {items.map((item) => (
                <li key={item.ruta} className="navHeader__li">
                  <NavLink to={item.ruta} end={item.exacta} className="navHeader__a">
                    {item.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <SndSelectorTema />

        {usuario ? (
          <SndMenuUsuario
            nombre={usuario.nombre}
            rol={usuario.rol}
            opciones={opcionesUsuario}
            onCerrarSesion={() => onCerrarSesion?.()}
          />
        ) : (
          mostrarSesion && (
            <div className="iniciarSesion">
              <a
                href="#"
                className="iniciarSesion__a cta"
                onClick={(e) => {
                  e.preventDefault()
                  onSesion?.()
                }}
              >
                <span className="iniciarSesion__txt">Iniciar sesión</span>
              </a>
            </div>
          )
        )}
      </div>
    </section>
  )
}
