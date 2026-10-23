/**
 * Cliente HTTP base para las llamadas a servicios REST del Módulo de Honorarios.
 * Centraliza cabeceras, serialización JSON y manejo de errores HTTP.
 */
export interface OpcionesPeticion extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function peticionHttp<T>(url: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { body, headers, ...resto } = opciones
  const respuesta = await fetch(url, {
    ...resto,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`)
  }

  return (await respuesta.json()) as T
}
