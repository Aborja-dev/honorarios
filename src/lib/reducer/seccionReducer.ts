/**
 * Reducer de la máquina tabla ↔ formulario de una sección maestro-detalle.
 *
 * Vive en `lib/` y no en los componentes porque es **lógica pura**: no toca
 * React, no pinta nada y se puede probar con un `expect(sectionReducer(...))`.
 * Los componentes (`SectionProvider`, `SectionContainer`) solo lo conectan a
 * `useReducer` y al contexto.
 *
 * El tipo de los datos es el parámetro `T`: `SectionUIState<T>`, `Action<T>` y
 * `sectionReducer<T>` comparten el modelo, así ningún consumidor recibe `never`
 * al leer `state.values`.
 */

/* =========================================================================
 * Estado
 * ========================================================================= */

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
  /** Escribe el borrador en `items` y vuelve a la tabla. */
  SAVE_ITEM: 'SAVE_ITEM',
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
      return {
        ...state,
        items,
        editIndex: state.editIndex > indice ? state.editIndex - 1 : state.editIndex,
      }
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

    case 'SAVE_ITEM': {
      if (state.values === null) return state
      const guardado = state.values
      const items = [...state.items]
      if (state.editIndex !== null) items[state.editIndex] = guardado
      else items.push(guardado)
      return {
        ...state,
        items,
        activeView: 'table',
        formMode: 'create',
        editIndex: null,
        formState: 'valid',
        errors: null,
      }
    }

    case 'CANCEL':
      return {
        ...state,
        activeView: 'table',
        formMode: 'create',
        editIndex: null,
        errors: null,
        formState: 'untouched',
      }

    default:
      return state
  }
}
