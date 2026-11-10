import { landingTextos } from '../../pages/LandingTextos'
import { SndIcono } from '../snd'

export interface BienvenidaHonorariosProps {
  etiquetaPeriodo?: string
}

/**
 * Bloque de bienvenida institucional del Módulo de Honorarios.
 */
export function BienvenidaHonorarios({ etiquetaPeriodo = 'Ejercicio Fiscal 2026' }: BienvenidaHonorariosProps) {
  return (
    <section className="honorarios-bienvenida" aria-label="Bienvenida al módulo">
      <div className="honorarios-bienvenida__contenido">
        <span className="honorarios-bienvenida__etiqueta b1sb">
          <SndIcono nombre="snd-checkmark--filled" tamano={16} />
          {etiquetaPeriodo} · SABG
        </span>
        <h1 className="h2b patria honorarios-bienvenida__titulo">
          {landingTextos.tituloPrincipal}
        </h1>
        <p className="b1r honorarios-bienvenida__texto">
        </p>
        <div className="honorarios-bienvenida__meta">
          {landingTextos.descripcionPrincipal}
        </div>
      </div>
      <div className="honorarios-bienvenida__ilustracion" aria-hidden="true">
        <SndIcono nombre="snd-user--avatar" tamano={72} />
      </div>
    </section>
  )
}
