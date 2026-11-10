// ---------------------------------------------------------------------------
// Estado de la página. El reducer SOLO aplica el estado recibido: no calcula,
// no interpreta índices ni decide qué tabs abrir. Ese procesamiento vive en
// `Page.tsx`, que es quien arma las actions con los datos ya resueltos.
// ---------------------------------------------------------------------------

export interface UITab {
  id: number
  collapse: boolean
  complete: boolean
}

export interface UIState {
  tabs: UITab[]
  openModal: boolean
  modal: string
  allowed: {
    save: boolean
  }
  folioGenerado: string | null
  intentoEnvio: boolean
}

export const initialState: UIState = {
  tabs: [
    { id: 1, collapse: false, complete: false },
    { id: 2, collapse: false, complete: false },
    { id: 3, collapse: false, complete: false },
    { id: 4, collapse: false, complete: false },
    { id: 5, collapse: false, complete: false },
  ],
  openModal: false,
  modal: 'carga masiva',
  allowed: {
    save: false,
  },
  folioGenerado: null,
  intentoEnvio: false,
}

// Actions puras: cada una trae el estado final ya resuelto por `Page.tsx`.
export type Action =
  | { type: 'ESTABLECER_TABS'; tabs: UITab[] }
  | { type: 'ESTABLECER_INTENTO_ENVIO'; intentoEnvio: boolean }
  | { type: 'ESTABLECER_FOLIO'; folio: string | null }
  | { type: 'ESTABLECER_MODAL_ABIERTO'; abierto: boolean }
  | { type: 'ESTABLECER_GUARDAR_PERMITIDO'; permitido: boolean }
  | { type: 'REEMPLAZAR_ESTADO'; state: UIState }

export function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case 'ESTABLECER_TABS':
      return { ...state, tabs: action.tabs }

    case 'ESTABLECER_INTENTO_ENVIO':
      return { ...state, intentoEnvio: action.intentoEnvio }

    case 'ESTABLECER_FOLIO':
      return { ...state, folioGenerado: action.folio }

    case 'ESTABLECER_MODAL_ABIERTO':
      return { ...state, openModal: action.abierto }

    case 'ESTABLECER_GUARDAR_PERMITIDO':
      return { ...state, allowed: { ...state.allowed, save: action.permitido } }

    case 'REEMPLAZAR_ESTADO':
      return action.state

    default:
      return state
  }
}
