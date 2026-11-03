import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { estadoInicial, sectionReducer, type Action, type SectionUIState } from './Section'

/**
 * Contexto del estado de una sección maestro-detalle.
 *
 * El provider **posee** el reducer y lo sirve por contexto: la tabla, el
 * formulario y el contenedor leen el mismo estado sin pasarse props entre tres
 * niveles.
 *
 * ```tsx
 * <SectionProvider<ExperienciaItem> itemsIniciales={[]}>
 *   <Experiencia />
 * </SectionProvider>
 * ```
 *
 * El tipo del contexto es `unknown` a propósito: el provider no conoce el
 * dominio, y quien consume pide su modelo con `useSection<MiModelo>()`. Eso
 * permite usar el mismo provider para dirección, escolaridad y experiencia.
 */
export interface SectionContextType<T = unknown> {
  state: SectionUIState<T>
  dispatch: Dispatch<Action<T>>
}

const SectionContext = createContext<SectionContextType<unknown> | undefined>(undefined)

export interface SectionProviderProps<T = unknown> {
  children: ReactNode
  /** Renglones con los que arranca la sección. */
  itemsIniciales?: T[]
  /** Valores de ejemplo para pintar el formulario, si se quieren precargados. */
  valoresIniciales?: T | null
}

export function SectionProvider<T = unknown>({
  children,
  itemsIniciales = [],
  valoresIniciales = null,
}: SectionProviderProps<T>) {
  const [state, dispatch] = useReducer(
    sectionReducer<T>,
    undefined,
    () => estadoInicial<T>([...itemsIniciales], valoresIniciales),
  )

  return (
    <SectionContext.Provider value={{ state, dispatch } as SectionContextType<unknown>}>
      {children}
    </SectionContext.Provider>
  )
}

/**
 * Hook de consumo del contexto.
 *
 * **No recibe valores iniciales**: el estado arranca en el `SectionProvider`.
 * Antes recibía un `INITIAL_VALUES: undefined` y despachaba `LOAD` en un
 * `useEffect` con `[]`; cada consumidor sobrescribía el estado de los demás.
 *
 * Se tipa con el modelo de quien consume: `useSection<ExperienciaItem>()`.
 */
export function useSection<T = unknown>(): SectionContextType<T> {
  const context = useContext(SectionContext)
  if (!context) {
    throw new Error('useSection debe usarse dentro de un SectionProvider')
  }
  return context as SectionContextType<T>
}

export default SectionProvider
