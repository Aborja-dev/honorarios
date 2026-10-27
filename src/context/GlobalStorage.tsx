import { create } from 'zustand'

interface UiStateI {
    isMenuOpen: boolean;
    isLoading: {
        scope: "global" | "local";
        idComp: string | null
    } | null
}

type Store = {
    uiState: UiStateI;
    setIsMenuOpen: (isMenuOpen: boolean) => void;
    setIsLoading: (isLoading: UiStateI['isLoading']) => void;
}

export const useStore = create<Store>()((set) => ({
    uiState: {
        isMenuOpen: false,
        isLoading: null
    },
    setIsMenuOpen: (isMenuOpen: boolean) => set((state) => ({ uiState: { ...state.uiState, isMenuOpen } })),
    setIsLoading: (isLoading: UiStateI['isLoading']) => set((state) => ({ uiState: { ...state.uiState, isLoading } })),
}))

