import { useEffect } from 'react'

/**
 * Fija el título de la pestaña (`document.title`) mientras el componente está montado.
 * Se usa en cada página, equivalente al `title` de las rutas en Angular.
 */
export function useTitulo(titulo: string): void {
  useEffect(() => {
    document.title = titulo
  }, [titulo])
}
