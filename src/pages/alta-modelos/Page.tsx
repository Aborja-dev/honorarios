import { useMemo, useReducer } from 'react'
import AltaModelo from './AltaModelo'
import { initialState, reducer, type Action, type UITab, type UIState } from '../../lib/pageReducer'

// ---------------------------------------------------------------------------
// Procesamiento de la página: aquí se calcula QUÉ estado resulta de cada
// operación. El reducer solo lo aplica (ver `reducer.ts`).
// ---------------------------------------------------------------------------

/** Abre las posiciones indicadas y cierra el resto (`indices` = 0..n-1). */
const calcularTabsAbiertas = (tabs: UITab[], indices: number | number[]): UITab[] => {
  const abiertos = Array.isArray(indices) ? indices : [indices]
  return tabs.map((tab, index) => ({ ...tab, collapse: !abiertos.includes(index) }))
}

/**
 * Calcula las tabs tras avanzar desde `tabIndex`:
 * - fuera de rango: no cambia nada
 * - último índice (`tabs.length`): cierra y completa todas
 * - intermedio: cierra y completa la actual y abre la consecutiva
 */
const calcularAvance = (tabs: UITab[], tabIndex: number): UITab[] => {
  const len = tabs.length

  if (tabIndex < 0 || tabIndex > len) return tabs

  if (tabIndex === len) {
    return tabs.map((tab) => ({ ...tab, collapse: true, complete: true }))
  }

  return tabs.map((tab, index) => {
    if (index === tabIndex) return { ...tab, collapse: true, complete: true }
    if (index === tabIndex + 1) return { ...tab, collapse: false }
    return tab
  })
}

/** Posiciones de las tabs que están abiertas (activeIndex del acordeón). */
const calcularAcordeonesActivos = (tabs: UITab[]): number[] =>
  tabs.reduce<number[]>((abiertos, tab, index) => (tab.collapse ? abiertos : [...abiertos, index]), [0])

/** Estado base del reinicio (tabs nuevas para no compartir referencias). */
const estadoReiniciado = (): UIState => ({
  ...initialState,
  tabs: initialState.tabs.map((tab) => ({ ...tab })),
})

// ---------------------------------------------------------------------------
// Creadores de actions de la página: cada uno resuelve el estado final de las
// operaciones y devuelve una acción pura para el reducer.
// ---------------------------------------------------------------------------

export type PageHandler = {
  abrirTabs: (indices: number | number[]) => Action
  reiniciar: () => Action
  guardarFolio: (folio: string | null) => Action
  guardar: () => Action
  avanzar: (tabIndex: number, folio?: string | null) => Action
  abrirPendientes: (pendientes: number[]) => Action
}

/** Creadores de actions que dependen del estado actual del reducer. */
export const crearHandler = (state: UIState): PageHandler => ({
  abrirTabs: (indices) => ({
    type: 'ESTABLECER_TABS',
    tabs: calcularTabsAbiertas(state.tabs, indices),
  }),
  reiniciar: () => ({ type: 'REEMPLAZAR_ESTADO', state: estadoReiniciado() }),
  guardarFolio: (folio) => ({ type: 'ESTABLECER_FOLIO', folio }),
  guardar: () => ({ type: 'ESTABLECER_GUARDAR_PERMITIDO', permitido: true }),
  // Avanzar marca el intento de envío y, si viene, guarda el folio
  avanzar: (tabIndex, folio) => ({
    type: 'REEMPLAZAR_ESTADO',
    state: {
      ...state,
      tabs: calcularAvance(state.tabs, tabIndex),
      intentoEnvio: true,
      ...(folio !== undefined ? { folioGenerado: folio } : {}),
    },
  }),
  abrirPendientes: (pendientes) => ({
    type: 'REEMPLAZAR_ESTADO',
    state: {
      ...state,
      tabs: calcularTabsAbiertas(state.tabs, pendientes),
      intentoEnvio: true,
    },
  }),
})

const AltaModeloPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handler = useMemo(() => crearHandler(state), [state])

  const props = useMemo(() => {
    const { tabs, intentoEnvio, folioGenerado, openModal } = state

    // Despacha la lista de tabs ya calculada (mismo helper que usa el componente)
    const abrirTabs = (indices: number | number[]) =>
      dispatch(handler.abrirTabs(indices))

    return {
      // Estado
      state,
      // Acciones que no dependen del estado
      expandirTodo: () => abrirTabs(tabs.map((_, index) => index)),
      colapsarTodo: () => abrirTabs([]),
      abrirTabs,
      // Alias para `onTabChange` de PrimeReact (pasa un evento, no el índice)
      handleCambiarAcordeon: (e: { index: number | number[] }) => abrirTabs(e.index),
      abrirModal: () => dispatch({ type: 'ESTABLECER_MODAL_ABIERTO', abierto: true }),
      cerrarModal: () => dispatch({ type: 'ESTABLECER_MODAL_ABIERTO', abierto: false }),
      marcarIntentoEnvio: () => dispatch({ type: 'ESTABLECER_INTENTO_ENVIO', intentoEnvio: true }),
      // Acciones que dependen del estado
      reiniciar: () => dispatch(handler.reiniciar()),
      avanzar: (tabIndex: number, folio?: string | null) =>
        dispatch(handler.avanzar(tabIndex, folio)),
      abrirPendientes: (pendientes: number[]) => dispatch(handler.abrirPendientes(pendientes)),
      // Valores calculados / derivados del estado
      acordeonesActivos: calcularAcordeonesActivos(tabs),
      completed: tabs.filter((tab) => tab.complete).length,
      intentoEnvio,
      folioGenerado,
      modalAbierto: openModal,
    }
  }, [state, dispatch, handler])

  return <AltaModelo {...props} />
}

export default AltaModeloPage
