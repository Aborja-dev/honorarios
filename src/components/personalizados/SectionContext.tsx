import React, { createContext, useContext, useReducer,  type Dispatch,  type ReactNode } from 'react';
import { INITIAL_STATE, sectionReducer, type Action, type SectionUIState } from './Section';

interface SectionContextType {
  state: SectionUIState<undefined>
  dispatch: Dispatch<Action>
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

interface SectionProviderProps {
  children: ReactNode;
}

export const SectionProvider: React.FC<SectionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(sectionReducer, INITIAL_STATE); 

  return (
    <SectionContext.Provider value={{state, dispatch}}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = (): SectionContextType => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSection debe usarse dentro de un SectionProvider');
  }
  return context;
};