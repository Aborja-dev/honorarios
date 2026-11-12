import { NavLink } from 'react-router-dom'
import { useMovil } from '../../lib/useMovil'
import { SndMenuUsuario, type OpcionUsuario } from './SndMenuUsuario'
import { SndSelectorTema } from './SndSelectorTema'

export interface ItemNavegacion {
  texto: string
  ruta: string
  exacta?: boolean
}

export interface UsuarioNavbar {
  nombre: string
  rol?: string
}

export interface SndNavbarProps {
  items: ItemNavegacion[]
  etiqueta?: string
  usuario?: UsuarioNavbar | null
  opcionesUsuario?: OpcionUsuario[]
  mostrarSesion?: boolean
  onSesion?: () => void
  onCerrarSesion?: () => void
}

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

        {/* <SndSelectorTema /> */}

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
