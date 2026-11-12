import { createContext, useContext, type Dispatch } from 'react'
import type { Action, SectionUIState } from './reducer'

/**
 * Contexto del estado de una sección maestro-detalle.
 *
 * Vive en `lib/` porque no pinta nada: solo transporta el estado del reducer y
 * su despachador. El provider que lo llena está en
 * `components/personalizados/SectionProvider.tsx`.
 *
 * El tipo es `unknown` a propósito: el contexto no conoce el dominio, y quien
 * consume pide su modelo con `useSection<MiModelo>()`.
 */
export interface SectionContextType<T = unknown> {
  state: SectionUIState<T>
  dispatch: Dispatch<Action<T>>
}

/**
 * `undefined` por defecto, no un objeto vacío: usar `useSection` fuera del
 * provider es un error de programación y debe lanzar, no renderizar sin datos.
 */
export const SectionContext = createContext<SectionContextType<unknown> | undefined>(undefined)

/**
 * Hook de consumo del contexto.
 *
 * **No recibe valores iniciales**: el estado arranca en el `SectionProvider`.
 * Antes recibía un `INITIAL_VALUES: undefined` y despachaba `LOAD` en un
 * `useEffect` con `[]`; cada consumidor sobrescribía el estado de los demás.
 */
export function useSection<T = unknown>(): SectionContextType<T> {
  const context = useContext(SectionContext)
  if (!context) {
    throw new Error('useSection debe usarse dentro de un SectionProvider')
  }
  return context as SectionContextType<T>
}
