import { useEffect, useReducer, useState } from "react"
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

    table: React.ReactNode
    children: React.ReactNode
    onCompleted: (ok: boolean) => void
    addButtonLabel: string
    values: any[],
    collapsed: boolean
}

export function Section({ children, addButtonLabel, icon, onCompleted, subtitle, table, title, values, collapsed }: SectionProps) {
    const { state, dispatch } = useSection();
    const completeHandler = () => {
        if (values.length > 1) onCompleted(true)
    }
    const calculateCompleted = (): boolean=>{
        if (!state.values) return false
        return state.values > 0 ? true : false
    }
    useEffect(()=>{
        dispatch({type: "DEFAULT"})
    },[])
    
    const completo = calculateCompleted()

    return (
        <section className="padron-acordeon">
            <div className="padron-acordeon-tab" data-abierta={collapsed || undefined}>
                <div className="padron-acordeon__cabecera">
                    <div className="padron-acordeon__titulo-grupo">
                        <span className="padron-acordeon__icono">
                            {icon}
                        </span>
                        <div>
                            <span className="sh0b" style={{ display: 'block' }}>{title}</span>
                            <span className="sdr" style={{ color: 'var(--neutro600)' }}>{subtitle}</span>
                        </div>
                    </div>
                    <span className={`pildora pildora--${completo ? 'exito' : 'alerta'} snd-pildora`}>
                        <span className="pildora__dot" aria-hidden="true" />
                        {completo ? 'Completado' : 'Por capturar'}
                    </span>
                </div>

                <div className="padron-acordeon__contenido">
                    {state.activeView === 'table' && table}
                    {state.activeView === 'form' && children}
                </div>

                <div className="padron-acordeon__pie">
                    <button
                        type="button"
                        className="boton__secundario"
                        onClick={() => dispatch({ type: 'ADD_ITEM' })}
                    >
                        {addButtonLabel}
                    </button>
                    <button type="button" className="boton__primario" onClick={completeHandler}>
                        Siguiente
                    </button>
                </div>
            </div>
        </section>
    );
}

/*

  ---------------------------------------------------------------------------
*/
