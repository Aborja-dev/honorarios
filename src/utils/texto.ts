/**
 * Normaliza una cadena eliminando diacríticos (acentos) y convirtiéndola a minúsculas
 * para búsquedas insensibles a mayúsculas y tildes.
 */
export function sinAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Formatea un número entero con separadores de miles para México (`es-MX`). */
export function formatearNumero(valor: number): string {
  return valor.toLocaleString('es-MX')
}

/** Genera un folio institucional consecutivo según el prefijo del submódulo y el ejercicio fiscal. */
export function generarFolio(prefijo: 'PAD' | 'CTO-HON' | 'MOD-JUR' | 'SUF', consecutivo: number, anio = 2026): string {
  return `${prefijo}-${anio}-${String(consecutivo).padStart(4, '0')}`
}
