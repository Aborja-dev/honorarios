import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SndIcono } from './SndIcono'

export interface OpcionUsuario {
  texto: string
  icono: string
  ruta?: string
  url?: string
}

export interface SndMenuUsuarioProps {
  nombre: string
  rol?: string
  opciones?: OpcionUsuario[]
  onCerrarSesion: () => void
}

export function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

export function SndMenuUsuario({ nombre, rol, opciones = [], onCerrarSesion }: SndMenuUsuarioProps) {
  const detalles = useRef<HTMLDetailsElement>(null)
  const cerrar = () => {
    if (detalles.current) detalles.current.open = false
  }

  useEffect(() => {
    const alHacerClic = (e: MouseEvent) => {
      if (detalles.current && !detalles.current.contains(e.target as Node)) cerrar()
    }
    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('click', alHacerClic)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('click', alHacerClic)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [])

  const contenido = (o: OpcionUsuario) => (
    <>
      <SndIcono nombre={o.icono} className="usrperfil__icono" tamano={24} />
      <div className="usrperfil__opcionCol">{o.texto}</div>
    </>
  )

  return (
    <div className="snd-menu-usuario">
      <details ref={detalles} className="usrperfil__details detailsClickOut">
        <summary className="usrperfil__summary">
          <span className="usrperfil__summaryCol1">
            <span className="usrperfil__iniciales" aria-hidden="true">
              {iniciales(nombre)}
            </span>
            <span className="usrperfil__nombre">{nombre}</span>
          </span>
          <SndIcono nombre="snd-chevron--down" className="usrperfil__summaryIcon details__flecha" tamano={24} />
        </summary>
        <div className="usrperfil__cont">
          <ul className="usrperfil__ul">
            <li className="usrperfil__li usrperfil__li--perfil">
              <span className="usrperfil__iniciales">{iniciales(nombre)}</span>
              <div className="dflex--col">
                <span className="usrperfil__nombre2">{nombre}</span>
                {rol && <span className="usrperfil__rol">{rol}</span>}
              </div>
            </li>
            {opciones.map((o) => (
              <li key={o.texto} className="usrperfil__li">
                {o.ruta ? (
                  <Link className="usrperfil__opcion" to={o.ruta} onClick={cerrar}>
                    {contenido(o)}
                  </Link>
                ) : (
                  <a className="usrperfil__opcion" href={o.url ?? '#'} onClick={cerrar}>
                    {contenido(o)}
                  </a>
                )}
              </li>
            ))}
            <li className="usrperfil__li">
              <a
                href="#"
                className="usrperfil__opcion usrperfil__opcion--noborde"
                onClick={(e) => {
                  e.preventDefault()
                  cerrar()
                  onCerrarSesion()
                }}
              >
                Cerrar sesión
                <SndIcono nombre="snd-logout" className="usrperfil__icono" tamano={24} />
              </a>
            </li>
          </ul>
        </div>
      </details>
    </div>
  )
}
