import { createContext, useContext } from 'react'

/** Gama de color primaria del SND. Solo se usa una a la vez. */
export type Tema = 'guinda' | 'verde'

/** Ubicación de los recursos publicados del SND. */
export interface SndConfig {
  /** URL de la carpeta que contiene `snd-guinda.css` y `snd-verde.css`, sin "/" final. */
  baseUrl: string
  /**
   * URLs de carpetas con los SVG de íconos, sin "/" final. Se prueban en orden y se usa la
   * primera que responda. Los pictogramas se buscan en `<carpeta>/pictogramas`.
   */
  iconosUrls: string[]
}

/**
 * Configuración por defecto: CDN oficial del SND, versión `v1`. Las fuentes (Noto Sans, Patria)
 * no se configuran aquí: las resuelve la propia hoja CSS con rutas relativas a su carpeta.
 */
export const CONFIG_POR_DEFECTO: SndConfig = {
  baseUrl: 'https://www.snd.gob.mx/snd/v1',
  iconosUrls: [
    'https://www.snd.gob.mx/snd/v1/iconos',
    'https://framework-gb.cdn.gob.mx/snd/v1/assets/iconos',
  ],
}

/**
 * Contexto de configuración de los recursos del SND (hojas de estilo e íconos).
 *
 * Para usar una copia interna o trabajar sin red, se envuelve la aplicación en el proveedor.
 *
 * @example
 * <SndConfigContext.Provider
 *   value={{ baseUrl: 'https://host/snd/v1', iconosUrls: ['https://host/snd/v1/iconos'] }}
 * >
 *   <App />
 * </SndConfigContext.Provider>
 */
export const SndConfigContext = createContext<SndConfig>(CONFIG_POR_DEFECTO)

/** Devuelve la configuración vigente de los recursos del SND. */
export function useSndConfig(): SndConfig {
  return useContext(SndConfigContext)
}
