import { useReducer } from "react"
import { useSection } from "./SectionContext"

export interface SectionUIState<T> {
    activeView: "form" | "table"
    formState: "valid" | "invalid" | "untouched"
    formMode: "create" | "edit"
    values: T | null
    errors: {
        field: keyof T
        message: string
    }[] | null
}

export interface DireccionCampos {
    id?: string                 // string | number
    alias?: string                   // obligatoria para guardar
    calle: string                    // obligatoria
    numeroExterior: string           // obligatoria (admite "S/N")
    numeroInterior?: string          // opcional
    codigoPostal: string             // obligatoria, solo dígitos
    colonia: string                  // obligatoria
    municipioAlcaldia: string        // obligatoria
    entidadFederativa: string  // string | null
    pais: string                     // obligatoria
    referenciasDomicilio?: string    // opcional
}



export const SectionEvents = {
    DEFAULT: "DEFAULT",
    EDIT_FORM: "EDIT_FORM",
    ADD_ITEM: "ADD_ITEM",
    HAS_ERRORS: "HAS_ERRORS",
    IS_VALID: "IS_VALID"

} as const

type State = SectionUIState<DireccionCampos>

export type SectionEventNames = typeof SectionEvents[keyof typeof SectionEvents]
export interface Action {
    type: SectionEventNames
    payload?: any
}

export const INITIAL_STATE: SectionUIState<undefined> = {
    activeView: "table",
    errors: null,
    formState: "untouched",
    values: null,
    formMode: "create"
}

export const sectionReducer = (state: SectionUIState<undefined>, action: Action): SectionUIState<undefined> => {
    switch (action.type) {
        case "DEFAULT": {
            return {
                activeView: "table",
                errors: null,
                formState: "untouched",
                values: null,
                formMode: "create"
            }
        }
        case "ADD_ITEM":
            return {
                ...state,
                activeView: "form",
                formState: "untouched",
                formMode: "create"
            }
        case "EDIT_FORM":
            return {
                ...state,
                activeView: "form",
                formState: "untouched",
                formMode: "edit",
                values: action?.payload
            }
        case "HAS_ERRORS":
            return {
                ...state,
                errors: action?.payload,
                formState: "invalid"
            }
        case "IS_VALID":
            return {
                ...state,
                values: action?.payload,
                errors: null,
                formState: "valid"
            }
        default:
            return state
    }
}

export interface SectionProps {
    title: string
    subtitle: string
    icon: any
    completed: boolean
    table: React.ReactNode
    children: React.ReactNode
    onCompleted: (ok: boolean) => void
    addButtonLabel: string
    values: any[]
}

export function Section({ children, addButtonLabel, completed, icon, onCompleted, subtitle, table, title, values }: SectionProps) {
    const {state, dispatch} = useSection();
    const completeHandler = () => {
        if (values.length > 1) onCompleted(true)
    }
    return (
        <section>
            {children}
            <button onClick={()=>(dispatch({type: "ADD_ITEM"}))}>{addButtonLabel}</button>
            <button onClick={completeHandler}>Siguiente</button>
        </section>
    );
}

/*

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