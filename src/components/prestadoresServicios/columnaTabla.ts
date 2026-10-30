import type { ReactNode } from 'react'

/**
 * Columna declarativa de `TablaAcciones`.
 *
 * Las columnas no son un componente que se monte: son una **descripción**
 * (encabezado + cómo pintar cada celda) que la tabla recorre. Escribirlas como
 * un arreglo evita tener que recordar el orden y hace que añadir una columna
 * sea una línea, no una estructura anidada.
 */
export interface TablaAccionesColumna<T = unknown> {
  encabezado: ReactNode
  celda: (fila: T, indice: number) => ReactNode
}
