
/* {
    "ramo": "27",
    "ur": "000",
    "fechaInicio": "2026-11-03T06:00:00.000Z",
    "fechaFin": "2026-11-04T06:00:00.000Z",
    "curp": "ADSADASD"
}*/

import { consulta } from "./validarService"

export interface ValidarForm {
    ramo: string
    ur: string
    fechaInicio: Date | string
    fechaFin: Date | string
    curp: string
}

export const requiredValue = (object: any, key: string): boolean => {
    return object.hasOwnProperty(key) && object[key] !== undefined && object[key] !== null && object[key] !== ''
}

export const stringValue = (value: any, type = 'string'): boolean => {
    return typeof value === type 
}

export const numberValue = (value: any, type = 'number'): boolean => {
    return typeof value === type 
}

export const matchValue = (value: string, regex: RegExp): boolean => {
    const result = value.match(regex)
    if (!result) return false
    return result.some((match) => match)
}

export const lengthValue = (val: string, len: number) => val.length === len 
export const maxLengthValue = (val: string, len: number) => val.length > len 

function fechaMayorA(fechaIngresada, fechaEstablecida) {
    // Transformar a timestamp (milisegundos desde el Epoch de Unix)
    const timestampIngresado = new Date(fechaIngresada).getTime();
    const timestampEstablecido = new Date(fechaEstablecida).getTime();

    // Validar que las fechas sean correctas
    if (Number.isNaN(timestampIngresado) || Number.isNaN(timestampEstablecido)) {
        throw new Error("Formato de fecha inválido.");
    }

    // Comprobar si es mayor
    return timestampIngresado > timestampEstablecido;
}
function fechaMenorA(fechaIngresada, fechaEstablecida) {
    // Transformar a timestamp (milisegundos desde el Epoch de Unix)
    const timestampIngresado = new Date(fechaIngresada).getTime();
    const timestampEstablecido = new Date(fechaEstablecida).getTime();

    // Validar que las fechas sean correctas
    if (Number.isNaN(timestampIngresado) || Number.isNaN(timestampEstablecido)) {
        throw new Error("Formato de fecha inválido.");
    }

    // Comprobar si es mayor
    return timestampIngresado < timestampEstablecido;
}

// Expresión regular de ejemplo para CURP en México (18 caracteres alfanuméricos)
const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$/

export class Ramo {
    value: string
    key: string = 'ramo'
    error: null | string = null

    constructor(_value: string) {
        this.value = _value
    } // <-- Eliminada la coma extra

    validar(form: ValidarForm) {
        // 1. Validar si es requerido (si NO existe o está vacío, hay error)
        if (!requiredValue(form, this.key)) {
            this.error = 'El campo ramo es requerido'
            return false
        }

        // 2. Validar que sea un string (si NO es string, hay error)
        if (!stringValue(this.value)) {
            this.error = 'El valor no es de tipo texto'
            return false
        }

        // 3. Validar longitud (dependiendo de tu función original)
        // Ojo: Si lengthValue es `val.length > len`, aquí estás validando que sea mayor a 2.
        // Si buscas longitud exacta de 2, te sugeriría cambiar la función auxiliar a `val.length !== 2`.
        if (!lengthValue(this.value, 2)) { 
            this.error = 'El campo ramo debe de tener más de 2 caracteres' 
            return false
        } 

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}
export class UR {
    value: string
    key: string = 'ur'
    error: null | string = null

    constructor(_value: string) {
        this.value = _value
    } // <-- Eliminada la coma extra

    validar(form: ValidarForm) {
        // 1. Validar si es requerido (si NO existe o está vacío, hay error)
        if (!requiredValue(form, this.key)) {
            this.error = 'El campo ur es requerido'
            return false
        }

        // 2. Validar que sea un string (si NO es string, hay error)
        if (!stringValue(this.value)) {
            this.error = 'El valor no es de tipo texto'
            return false
        }

        // 3. Validar longitud (dependiendo de tu función original)
        // Ojo: Si lengthValue es `val.length > len`, aquí estás validando que sea mayor a 2.
        // Si buscas longitud exacta de 2, te sugeriría cambiar la función auxiliar a `val.length !== 2`.
        if (!lengthValue(this.value, 3)) { 
            this.error = 'El campo ur debe de tener solo 3 caracteres' 
            return false
        } 

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}
export class CURP {
    value: string
    key: string = 'curp'
    error: null | string = null

    constructor(_value: string) {
        this.value = _value
    } // <-- Eliminada la coma extra

    validar(form: ValidarForm) {
        // 1. Validar si es requerido (si NO existe o está vacío, hay error)
        if (!requiredValue(form, this.key)) {
            this.error = 'El campo CURP es requerido'
            return false
        }

        // 2. Validar que sea un string (si NO es string, hay error)
        if (!stringValue(this.value)) {
            this.error = 'El valor no es de tipo texto'
            return false
        }

        // 3. Validar longitud (dependiendo de tu función original)
        // Ojo: Si lengthValue es `val.length > len`, aquí estás validando que sea mayor a 2.
        // Si buscas longitud exacta de 2, te sugeriría cambiar la función auxiliar a `val.length !== 2`.
        if (!lengthValue(this.value, 18)) {
            this.error = 'El campo CURP debe de tener 18 caracteres' 
            return false
        }
        if (!matchValue(this.value, /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$/)) {
            this.error = 'El CURP ingresado no es valido' 
            return false
        }

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}

export class FechaInicio {
    value: string
    key: string = 'fechaInicio'
    error: null | string = null

    constructor(_value: string) {
        this.value = _value
    } // <-- Eliminada la coma extra

    validar(form: ValidarForm) {
        // 1. Validar si es requerido (si NO existe o está vacío, hay error)
        if (!requiredValue(form, this.key)) {
            this.error = 'El campo fecha de inicio es requerido'
            return false
        }

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}

export class FechaFin {
    value: string
    key: string = 'fechaFin'
    error: null | string = null

    constructor(_value: string) {
        this.value = _value
    } // <-- Eliminada la coma extra

    validar(form: ValidarForm, fechaInicio: string) {
        // 1. Validar si es requerido (si NO existe o está vacío, hay error)
        if (!requiredValue(form, this.key)) {
            this.error = 'El campo fecha de termino es requerido'
            return false
        }

        if (fechaMenorA(this.value, fechaInicio)) {
            this.error = 'La fecha es menor a la fecha de inicio'
            return false
        }
        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}


export type ErrorValidation = {
    path: keyof ValidarForm
    error: null | string
}
export const validar = (formData: ValidarForm):ErrorValidation[] => {
    const {curp, fechaFin, fechaInicio,ramo,ur} = formData
    const values = {
        ramo: new Ramo(ramo),
        CURP: new CURP(curp),
        UR: new UR(ur),
        FechaFin: new FechaFin(String(fechaFin)),
        FechaInicio: new FechaInicio(String(fechaInicio))
    }
    values.ramo.validar(formData),
    values.FechaInicio.validar(formData)
    values.CURP.validar(formData),
    values.UR.validar(formData),
    values.FechaFin.validar(formData, values.FechaInicio.value)
    const valuesArray = Object.values(values)
    const errors = valuesArray.map((field)=>({
        path: field.key as keyof ValidarForm,
        error: field.error
    }))

    return errors
}
export type EstadoValidacion = 
    | 'NO_EXISTE'
    | 'NO_ENCONTRADO'
    | 'NO_REGISTRADO'
    | 'NORMALIZACION'
    | 'COMPATIBILIDAD'
    | 'ACTUALIZACION'
    | 'DESCONOCIDO';

// 2. Objeto constante congelado (as const) útil para enums o catálogos en frontend
export const ESTADOS_VALIDACION = {
    NO_EXISTE: 'NO_EXISTE',
    NO_ENCONTRADO: 'NO_ENCONTRADO',
    NO_REGISTRADO: 'NO_REGISTRADO',
    NORMALIZACION: 'NORMALIZACION',
    COMPATIBILIDAD: 'COMPATIBILIDAD',
    ACTUALIZACION: 'ACTUALIZACION',
    DESCONOCIDO: 'DESCONOCIDO'
} as const;

type responseValidate = {
    estado: EstadoValidacion,
    mensaje: string
    toast: string
    datos?: any
}

export const requestValidate = async (formData: ValidarForm): Promise<responseValidate> => {
    const response = await consulta(formData)
    let caso = ''

    if (response == null) {
        caso = 'noExiste'
    } else if (response.estatus == null) {
        caso = 'noEncontrado'
    } else if (response.estatus == 'compatibilidad' && response.estatusRegistrado === false) {
        caso = 'noRegistrado'
    } else if (response.estatus == 'normalizacion') {
        caso = 'normalizacion'
    } else if (response.estatus == 'compatibilidad') {
        caso = 'compatibilidad'
    }

    switch (caso) {
        case 'noExiste':
            return {
                estado: 'NO_EXISTE',
                mensaje: 'No se encontró información con los datos proporcionados',
                toast: 'error',
                datos: null
            }

        case 'noEncontrado':
            return {
                estado: 'NO_ENCONTRADO',
                mensaje: 'No se encontro registro en el padron ¿desea registrar?',
                toast: 'warning',
                datos: response
            }

        case 'noRegistrado':
            return {
                estado: 'NO_REGISTRADO',
                mensaje: 'El prestador de servicios no se encuentra registrado en el modulo pero si tiene compatibilidad',
                toast: 'info',
                datos: response
            }

        case 'normalizacion':
            return {
                estado: 'NORMALIZACION',
                mensaje: 'No se encuentra registro en el padron de prestadores, ¿Desea registrar?',
                toast: 'info',
                datos: response
            }

        case 'compatibilidad':
            return {
                estado: 'COMPATIBILIDAD',
                mensaje: 'Ya se encuentra registrado en el padron',
                toast: 'success',
                datos: response
            }
        case 'actualizacion':
            return {
                estado: 'ACTUALIZACION',
                mensaje: 'Si hay posible compatibilidad y se encuentra registrado',
                toast: 'success',
                datos: response
            }

        default:
            return {
                estado: 'DESCONOCIDO',
                mensaje: 'Ocurrió un error',
                toast: 'error',
                datos: response
            }
    }
}