import type { MouseEvent, ReactNode } from 'react'
import { useMovil } from '../core/useMovil'
import { SndIcono } from './SndIcono'

export interface SndEncabezadoProps {
  /**
   * `id` del elemento al que salta el enlace "Ir al contenido principal" (por defecto `mainContent`).
   * Ese elemento debe tener `tabindex="-1"`.
   */
  idContenido?: string
  /** Normalmente `<SndNavbar />`. */
  children?: ReactNode
}

/**
 * Encabezado institucional del SND (`<header class="header">`).
 *
 * Contenido: enlace "Ir al contenido principal", franja `.mexico` con el escudo de Gobierno de México
 * y el menú Trámites / Gobierno. La barra de navegación (`SndNavbar`) se coloca como hijo.
 *
 * Requisito de layout: la franja `.mexico` es `position: fixed` y no ocupa espacio. Ese espacio lo
 * reserva el contenedor `.wrapper` del SND con `padding-top: var(--bodyTop)` (75 px en escritorio,
 * 56 px en móvil). Por eso el encabezado debe ir siempre dentro de un `.wrapper`.
 *
 * @example
 * <div className="wrapper">
 *   <SndEncabezado>
 *     <SndNavbar items={menu} />
 *   </SndEncabezado>
 *   <main id="mainContent" tabIndex={-1}>…</main>
 *   <SndPie />
 * </div>
 */
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
