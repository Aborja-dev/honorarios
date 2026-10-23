import type { MouseEvent, ReactNode } from 'react'
import { useMovil } from '../../hooks/useMovil'
import { SndIcono } from './SndIcono'

export interface SndEncabezadoProps {
  idContenido?: string
  children?: ReactNode
}

export function SndEncabezado({ idContenido = 'mainContent', children }: SndEncabezadoProps) {
  const movil = useMovil()

  const saltar = (e: MouseEvent) => {
    e.preventDefault()
    document.getElementById(idContenido)?.focus()
  }

  return (
    <header className="header">
      <a className="irContent" href={`#${idContenido}`} onClick={saltar}>
        Ir al contenido principal
      </a>
      <section className="mexico">
        <div className="mexico__contenedor">
          <div className="mexico__escudo">
            <a href="https://www.gob.mx/" className="mexico__aescudo">
              <SndIcono
                nombre="snd-gobierno-mexico"
                className="mexico__img"
                ajuste="alto"
                colorOriginal
                etiqueta="Ir a la página de inicio del Gobierno de México"
              />
            </a>
          </div>
          <div className="mexico__menu">
            <details className="mexico__details" open={!movil}>
              <summary className="mexico__summary">
                <span className="mexico__span">Menú</span>
              </summary>
              <div className="mexico__detailsCont">
                <a href="https://www.gob.mx/tramites" className="mexico__a">
                  Trámites
                </a>
                <a href="https://www.gob.mx/gobierno" className="mexico__a">
                  Gobierno
                </a>
              </div>
            </details>
          </div>
        </div>
      </section>
      {children}
    </header>
  )
}
