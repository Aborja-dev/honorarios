import { useEffect } from 'react'

/**
 * Fija el título de la pestaña (`document.title`) mientras el componente está montado.
 */
export function useTitulo(titulo: string): void {
  useEffect(() => {
    document.title = titulo
  }, [titulo])
}
