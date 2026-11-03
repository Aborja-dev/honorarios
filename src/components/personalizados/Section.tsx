import { useCallback, useEffect } from 'react'
import { useSection } from './SectionContext'

/**
 * Modelo de la sección y reducer genérico de la máquina tabla ↔ formulario.
 *
 * El tipo de los datos es el **parámetro `T`**: `SectionUIState<T>`, `Action<T>`
 * y `sectionReducer<T>`. Antes estaban fijados a `undefined` y por eso nadie
 * podía leer `state.values` sin obtener `never`.
 */

export interface SectionUIState<T> {
  activeView: 'form' | 'table'
  formState: 'valid' | 'invalid' | 'untouched'
  formMode: 'create' | 'edit'
  /** Borrador en captura, o los valores de ejemplo mientras se pinta la tabla. */
  values: T | null
  /** Índice del renglón en edición; solo tiene sentido cuando `formMode` es `edit`. */
  editIndex: number | null
  /** Lista de renglones guardados (la tabla pinta esto). */
  items: T[]
  errors: {
    field: keyof T
    message: string
  }[] | null
}

/* =========================================================================
 * Eventos
 * ========================================================================= */

export const SectionEvents = {
  DEFAULT: 'DEFAULT',
  /** Abre el formulario en blanco. */
  ADD_ITEM: 'ADD_ITEM',
  /** Abre el formulario cargado con `payload: T`. */
  EDIT_FORM: 'EDIT_FORM',
  /** Cambia campos del borrador: `payload: Partial<T>`. */
  CAMBIAR: 'CAMBIAR',
  /** Elimina un renglón: `payload: number` (índice). */
  DELETE_ITEM: 'DELETE_ITEM',
  /** Marca los campos en error: `payload: { field, message }[]`. */
  HAS_ERRORS: 'HAS_ERRORS',
  /** Valida y confirma los valores del borrador: `payload?: T`. */
  IS_VALID: 'IS_VALID',
  /** Vuelve a la tabla descartando la captura. */
  CANCEL: 'CANCEL',
  /** Carga valores sin cambiar de vista. */
  LOAD: 'LOAD',
} as const

export type SectionEventNames = (typeof SectionEvents)[keyof typeof SectionEvents]

export interface Action<T = unknown> {
  type: SectionEventNames
  payload?: T | Partial<T> | number | { field: keyof T; message: string }[]
}

/* =========================================================================
 * Estado inicial
 * ========================================================================= */

export function estadoInicial<T>(items: T[] = [], values: T | null = null): SectionUIState<T> {
  return {
    activeView: 'table',
    formState: 'untouched',
    formMode: 'create',
    values,
    editIndex: null,
    items,
    errors: null,
  }
}

/** @deprecated Usa `estadoInicial<T>()`; se conserva por los imports existentes. */
export const INITIAL_STATE = estadoInicial<unknown>()

/* =========================================================================
 * Reducer
 * ========================================================================= */

export function sectionReducer<T>(
  state: SectionUIState<T>,
  action: Action<T>,
): SectionUIState<T> {
  switch (action.type) {
    case 'DEFAULT':
      return { ...estadoInicial<T>(state.items), values: state.values }

    case 'LOAD':
      return { ...state, values: (action.payload as T | undefined) ?? state.values }

    case 'ADD_ITEM':
      return {
        ...state,
        activeView: 'form',
        formState: 'untouched',
        formMode: 'create',
        editIndex: null,
        errors: null,
      }

    case 'EDIT_FORM':
      return {
        ...state,
        activeView: 'form',
        formState: 'untouched',
        formMode: 'edit',
        values: action.payload as T,
        errors: null,
      }

    case 'CAMBIAR': {
      const cambios = action.payload as Partial<T> | undefined
      if (!cambios) return state
      return {
        ...state,
        // Si aún no hay borrador (tabla con valores de ejemplo), se parte de él.
        values: { ...((state.values ?? {}) as object), ...(cambios as object) } as T,
        // Al escribir se limpia la marca de error del intento anterior.
        errors: null,
        formState: state.formState === 'invalid' ? 'untouched' : state.formState,
      }
    }

    case 'DELETE_ITEM': {
      const indice = action.payload as number
      const items = state.items.filter((_, i) => i !== indice)
      if (state.editIndex === null) return { ...state, items }
      if (state.editIndex === indice) {
        // Se borró el renglón en edición: la captura se descarta.
        return { ...state, items, activeView: 'table', editIndex: null, values: null, errors: null }
      }
      // Se corrige el índice si se borró uno anterior al que se edita.
      return { ...state, items, editIndex: state.editIndex > indice ? state.editIndex - 1 : state.editIndex }
    }

    case 'HAS_ERRORS':
      return {
        ...state,
        errors: action.payload as { field: keyof T; message: string }[],
        formState: 'invalid',
      }

    case 'IS_VALID':
      return {
        ...state,
        values: (action.payload as T | undefined) ?? state.values,
        errors: null,
        formState: 'valid',
      }

    case 'CANCEL':
      return { ...state, activeView: 'table', formMode: 'create', editIndex: null, errors: null, formState: 'untouched' }

    default:
      return state
  }
}

/* =========================================================================
 * Contenedor
 * ========================================================================= */

export interface SectionProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  /** Tabla de la sección (se pinta en `activeView === 'table'`). */
  table: React.ReactNode
  /** Formulario de la sección (se pinta en `activeView === 'form'`). */
  children: React.ReactNode
  onCompleted?: (ok: boolean) => void
  addButtonLabel: string
  /** Renglones guardados; si se omite se usa `state.items`. */
  values?: unknown[]
  /** ¿Está abierta? Cambia la piel de la cabecera. */
  collapsed?: boolean
}

/**
 * Contenedor de sección: cabecera con ícono y píldora, cuerpo que alterna
 * tabla/formulario según el reducer, y pie con "Agregar" y "Siguiente".
 */
export function Section({
  children,
  addButtonLabel,
  icon,
  onCompleted,
  subtitle,
  table,
  title,
  values,
  collapsed = false,
}: SectionProps) {
  const { state, dispatch } = useSection<unknown>()

  const completo = (values ?? state.items).length > 0

  // Al montarse se respeta el estado del reducer; lo único que se normaliza es
  // la vista, por si el contenedor se remonta con una captura a medias.
  useEffect(() => {
    if (state.activeView === 'form' && state.values === null) {
      dispatch({ type: 'DEFAULT' })
    }
    // Solo al montar: el estado es del provider, no de este contenedor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completeHandler = useCallback(() => {
    if (completo) onCompleted?.(true)
  }, [completo, onCompleted])

  return (
    <section className="padron-acordeon">
      <div className="padron-acordeon-tab" data-abierta={collapsed || undefined}>
        <div className="padron-acordeon__cabecera">
          <div className="padron-acordeon__titulo-grupo">
            <span className="padron-acordeon__icono">{icon}</span>
            <div>
              <span className="sh0b" style={{ display: 'block' }}>
                {title}
              </span>
              <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                {subtitle}
              </span>
            </div>
          </div>
          <span className={`pildora pildora--${completo ? 'exito' : 'alerta'} snd-pildora`}>
            <span className="pildora__dot" aria-hidden="true" />
            {completo ? 'Completado' : 'Por capturar'}
          </span>
        </div>

        <div className="padron-acordeon__contenido">
          {state.activeView === 'table' && table}
          {state.activeView === 'form' && children}
        </div>

        <div className="padron-acordeon__pie">
          <button
            type="button"
            className="boton__secundario"
            onClick={() => dispatch({ type: 'ADD_ITEM' })}
          >
            {addButtonLabel}
          </button>
          <button type="button" className="boton__primario" onClick={completeHandler}>
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}

/*
  ---------------------------------------------------------------------------
  Maqueta de Experiencia laboral: `Table`, `Form` y `Experiencia` eran stubs
  vacíos. Se reexportan desde `./ExperienciaMaqueta`, que es solo diseño.
  ---------------------------------------------------------------------------
*/
export {
  ExperienciaMaqueta,
  ExperienciaMaqueta as Experiencia,
  TablaExperienciaMaqueta,
  TablaExperienciaMaqueta as Table,
  FormExperienciaMaqueta,
  FormExperienciaMaqueta as Form,
} from './ExperienciaMaqueta'
