import type { OpcionUsuario, UsuarioNavbar } from '../components/snd'

export const NOMBRE_SISTEMA = 'Módulo de Honorarios · SABG'
export const VERSION_SISTEMA = '1.0.0'
export const EJERCICIO_FISCAL = 2026

/**
 * Sesión inicial de demostración; sustituir por la identidad que entregue el
 * Servicio de Identidad Digital (SIDBG).
 */
export const USUARIO_INICIAL: UsuarioNavbar = {
  nombre: 'Regina Montenegro',
  rol: 'Dirección de Honorarios',
}

export const OPCIONES_MENU_USUARIO: OpcionUsuario[] = [
  { texto: 'Portal del Prestador', icono: 'snd-user--avatar', ruta: '/user/portal' },
  { texto: 'Validar Identidad', icono: 'snd-user', ruta: '/validar-identidad' },
  { texto: 'Prueba e.firma (FIEL)', icono: 'snd-edit', ruta: '/prueba-fiel' },
  { texto: 'Cambiar tema', icono: 'snd-color-palette', ruta: '' }
]

/**
 * Bandera `VITE_SCROLL` para el panel del Padrón de Prestadores.
 *
 * ¿Qué controla? El scroll **interno** de `.prestadores-layout__contenido`
 * (el panel con altura fija `100vh − encabezado` en `PrestadoresPage.css`):
 *
 * - `VITE_SCROLL=on`  → el panel conserva su altura fija y desplaza el
 *   formulario dentro de él; la página no se desplaza.
 * - `VITE_SCROLL=off` → el panel toma la altura de su contenido y el scroll
 *   pasa a la página completa (ventana), sin barra interna.
 *
 * Se lee una sola vez al cargar el módulo. Cualquier valor distinto de `off`
 * (incluido ausente) deja el comportamiento actual, así que no rompe entornos
 * que no la definan. Se define al levantar el servidor, por ejemplo en
 * PowerShell: `$env:VITE_SCROLL='off'; npm run dev`.
 */
export const SCROLL_INTERNO_PADRON: boolean = import.meta.env.VITE_SCROLL !== 'off'

/** Clase (BEM) que se añade a `.prestadores-layout` cuando el scroll interno está activo. */
export const CLASE_SCROLL_INTERNO_PADRON = 'prestadores-layout--scroll-interno'