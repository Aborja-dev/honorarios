import { createContext, useContext } from 'react'
import type { UIState } from './reducer'

export interface PageContextValue {
  // Estado
  state: UIState
  // Acciones sin dependencia del estado
  expandirTodo: () => void
  colapsarTodo: () => void
  abrirTabs: (indices: number | number[]) => void
  /** Handler listo para `onTabChange` del Accordion (recibe el evento). */
  handleCambiarAcordeon: (e: { index: number | number[] }) => void
  abrirModal: () => void
  cerrarModal: () => void
  marcarIntentoEnvio: () => void
  // Acciones atadas al estado
  reiniciar: () => void
  avanzar: (tabIndex: number, folio?: string | null) => void
  abrirPendientes: (pendientes: number[]) => void
  // Valores calculados / derivados del estado
  acordeonesActivos: number[]
  completed: number
  intentoEnvio: boolean
  folioGenerado: string | null
  modalAbierto: boolean
}

export const PageContext = createContext<PageContextValue | null>(null)

/** Acceso tipado al contexto de la página (lanza si se usa fuera del Provider). */
export function usePageContext(): PageContextValue {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext debe usarse dentro de <AltaModeloPage />')
  }
  return context
}
