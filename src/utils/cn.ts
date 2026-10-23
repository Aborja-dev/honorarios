/** Une nombres de clase omitiendo los valores vacíos. */
export function cn(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(' ')
}

let secuencia = 0

/** Genera un `id` único con prefijo, para vincular atributos `aria-*` y etiquetas. */
export function nuevoId(prefijo: string): string {
  secuencia += 1
  return `${prefijo}-${secuencia}`
}
