/* {
    "ramo": "27",
    "ur": "000",
    "fechaInicio": "2026-11-03T06:00:00.000Z",
    "fechaFin": "2026-11-04T06:00:00.000Z",
    "curp": "ADSADASD"
}*/

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

export const lengthValue = (val: string, len: number) => val.length == len 
export const maxLengthValue = (val: string, len: number) => val.length > len 

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
        if (lengthValue(this.value, 2)) { 
            this.error = 'El campo ramo debe de tener más de 2 caracteres' 
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
        if (lengthValue(this.value, 2)) { 
            this.error = 'El campo ramo debe de tener 18 caracteres' 
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
            this.error = 'El campo inicio es requerido'
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
        if (lengthValue(this.value, 2)) { 
            this.error = 'El campo inicio debe de tener más de 2 caracteres' 
            return false
        } 

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}

export class FechaFin {
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
        if (lengthValue(this.value, 2)) { 
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
        if (lengthValue(this.value, 3)) { 
            this.error = 'El campo ur debe de tener solo 3 caracteres' 
            return false
        } 

        this.error = null // Limpiamos errores previos si todo sale bien
        return true
    }
}

