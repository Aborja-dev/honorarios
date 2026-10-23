import { SndIcono } from '../snd'

export interface BienvenidaHonorariosProps {
  etiquetaPeriodo: string
}

/**
 * Bloque de bienvenida institucional del Módulo de Honorarios.
 */
export function BienvenidaHonorarios({ etiquetaPeriodo }: BienvenidaHonorariosProps) {
  return (
    <section className="honorarios-bienvenida" aria-label="Bienvenida al módulo">
      <div className="honorarios-bienvenida__contenido">
        <span className="honorarios-bienvenida__etiqueta b1sb">
          <SndIcono nombre="snd-checkmark--filled" tamano={16} />
          Ejercicio Fiscal 2026 · SABG
        </span>
        <h1 className="h2b patria honorarios-bienvenida__titulo">
          Bienvenido al módulo de Honorarios
        </h1>
        <p className="b1r honorarios-bienvenida__texto">
          Administra el padrón de prestadores de servicios profesionales, el control presupuestal de contratos y los
          modelos jurídicos autorizados desde un solo lugar.
        </p>
        <div className="honorarios-bienvenida__meta">
          <span className="honorarios-bienvenida__chip sdr">
            <SndIcono nombre="snd-calendar" tamano={16} />
            Periodo activo: {etiquetaPeriodo}
          </span>
          <span className="honorarios-bienvenida__chip sdr">
            <SndIcono nombre="snd-document" tamano={16} />
            Partida 12101 · Honorarios
          </span>
        </div>
      </div>
      <div className="honorarios-bienvenida__ilustracion" aria-hidden="true">
        <SndIcono nombre="snd-user--avatar" tamano={72} />
      </div>
    </section>
  )
}
