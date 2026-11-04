import { useReducer, type ReactNode } from 'react'
import { estadoInicial, sectionReducer, type SectionUIState } from '../../lib/reducer'
import { SectionContext, type SectionContextType } from '../../lib/context'

/**
 * Provider del estado de una sección maestro-detalle.
 *
 * Es el único dueño del reducer: lo monta y lo sirve por contexto para que la
 * tabla, el formulario y el contenedor lean el mismo estado sin pasarse props.
 *
 * ```tsx
 * <SectionProvider<ExperienciaItem> itemsIniciales={[]}>
 *   <SectionContainer ... />
 * </SectionProvider>
 * ```
 *
 * La lógica del reducer vive en `lib/reducer` y el contexto en `lib/context`;
 * este archivo solo los conecta a React.
 */
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
    (): SectionUIState<T> => estadoInicial<T>([...itemsIniciales], valoresIniciales),
  )

  return (
    <SectionContext.Provider value={{ state, dispatch } as SectionContextType<unknown>}>
      {children}
    </SectionContext.Provider>
  )
}

export default SectionProvider
