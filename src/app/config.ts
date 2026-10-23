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
]
