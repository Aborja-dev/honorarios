/// <reference types="vite/client" />

/**
 * Variables de entorno de Vite usadas por la aplicación.
 *
 * Vite solo expone las variables con prefijo `VITE_`. Se declaran aquí para que
 * `import.meta.env.VITE_*` esté tipado y el valor por defecto quede documentado.
 */
interface ImportMetaEnv {
  /**
   * Scroll del panel del Padrón de Prestadores de Servicio.
   *
   * - `'on'`: el panel conserva altura fija y desplaza el formulario por dentro.
   * - `'off'`: el panel crece con el contenido y se desplaza la página completa.
   *
   * Sin definir equivale a `'on'`. Se define al levantar el servidor, por
   * ejemplo `$env:VITE_SCROLL='off'; npm run dev` en PowerShell.
   */
  readonly VITE_SCROLL?: 'on' | 'off'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
