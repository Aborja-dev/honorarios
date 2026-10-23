/**
 * Cliente GraphQL ligero (`apollo/`) basado en `fetch` nativo.
 * Mantiene el proyecto libre de dependencias adicionales no contempladas en la matriz de licencias,
 * y ofrece una interfaz lista para conectar con un gateway GraphQL o reemplazar por `@apollo/client`.
 */

export interface RespuestaGraphQL<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export interface ConfiguracionGraphQL {
  endpoint: string
  headers?: Record<string, string>
}

export const CONFIG_GRAPHQL_DEFECTO: ConfiguracionGraphQL = {
  endpoint: '/api/graphql',
}

export async function ejecutarQueryGraphQL<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  config: ConfiguracionGraphQL = CONFIG_GRAPHQL_DEFECTO,
): Promise<TData> {
  const respuesta = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!respuesta.ok) {
    throw new Error(`Error de red GraphQL: ${respuesta.status}`)
  }

  const resultado = (await respuesta.json()) as RespuestaGraphQL<TData>
  if (resultado.errors?.length) {
    throw new Error(resultado.errors.map((e) => e.message).join('; '))
  }
  if (!resultado.data) {
    throw new Error('La consulta GraphQL no devolvió datos.')
  }
  return resultado.data
}
