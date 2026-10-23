import { useSyncExternalStore } from 'react'

/** Consulta de medios del punto de corte móvil; es la misma que usa la hoja del SND. */
const CONSULTA = '(max-width: 767.9px)'

function suscribir(avisar: () => void): () => void {
  if (typeof matchMedia === 'undefined') return () => {}
  const consulta = matchMedia(CONSULTA)
  consulta.addEventListener('change', avisar)
  return () => consulta.removeEventListener('change', avisar)
}

function leer(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia(CONSULTA).matches
}

/**
 * Indica si el ancho de la ventana es menor a 768 px.
 */
export function useMovil(): boolean {
  return useSyncExternalStore(suscribir, leer, () => false)
}
