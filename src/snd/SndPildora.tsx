import type { ReactNode } from 'react'
import { SndIcono } from './SndIcono'

/** Tipos de píldora de estatus. Los documentados por el SND son `exito`, `error`, `alerta` e `info`. */
export type TipoPildora = 'exito' | 'error' | 'alerta' | 'info' | 'neutro' | 'naranja' | 'purple' | 'inactivo'

export interface SndPildoraProps {
  /** Tipo de estatus; define colores de borde, fondo y punto. */
  tipo?: TipoPildora
  /** Muestra el círculo de color a la izquierda del texto. */
  punto?: boolean
  children: ReactNode
}

/**
 * Píldora de estatus del SND (`.pildora`): etiqueta informativa no interactiva (chip).
 *
 * Desviaciones respecto de la hoja del SND v1.3.0 (corregidas en `snd.css`):
 * - La hoja define solo el color del borde, no su grosor; se añade `border-width` y `border-style`.
 * - La hoja usa variables que no define (`--info`, `--alerta`, `--purple`, `--orange`), por lo que el
 *   borde de `info`, `alerta` y `purple` y el punto de `purple` quedan sin color; `inactivo` no tiene
 *   regla para el punto. Se completan con colores de la paleta.
 * - La documentación del SND solo ejemplifica `exito`, `error`, `alerta` e `info`, con punto y sin
 *   borde (clase `borde--no`). Los demás tipos existen en la hoja pero no están documentados.
 *
 * @example
 * <SndPildora tipo="exito">Aprobada</SndPildora>
 * <SndPildora tipo="alerta" punto={false}>En revisión</SndPildora>
 */
export function SndPildora({ tipo = 'neutro', punto = true, children }: SndPildoraProps) {
  return (
    <span className={`pildora pildora--${tipo} snd-pildora`}>
      {punto && <span className="pildora__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export interface SndPildoraFiltroProps {
  /** Estado del filtro; `true` cuando está aplicado. */
  activo: boolean
  /** Se invoca con el nuevo estado al pulsar. */
  onCambio: (activo: boolean) => void
  children: ReactNode
}

/**
 * Píldora de filtro del SND (`.pildoraFiltro`): botón de dos estados que muestra una "x" al activarse.
 *
 * Componente controlado: el estado vive en quien la usa (`activo` y `onCambio`). El estado se expone
 * con `aria-pressed`. El SND la colorea con `--btnColor*`; aquí se enlazan a la gama activa.
 *
 * @example
 * <SndPildoraFiltro activo={soloPendientes} onCambio={setSoloPendientes}>Solo pendientes</SndPildoraFiltro>
 */
export function SndPildoraFiltro({ activo, onCambio, children }: SndPildoraFiltroProps) {
  return (
    <span className="snd-pildora-filtro">
      <button type="button" className="pildoraFiltro" aria-pressed={activo} onClick={() => onCambio(!activo)}>
        {children}
        <SndIcono nombre="snd-close" className="pildoraFiltro__cerrar" tamano={24} />
      </button>
    </span>
  )
}
