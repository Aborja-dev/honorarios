import type { ItemMenuLateral, ItemNavegacion } from '../components/snd'

/**
 * Menú lateral (`SndMenuLateral`) exclusivo del Módulo de Honorarios.
 * Contiene únicamente las opciones operativas de Honorarios.
 */
export const MENU_LATERAL_HONORARIOS: ItemMenuLateral[] = [
  { texto: 'Tablero de Honorarios', icono: 'snd-home', ruta: '/', exacta: true },
  { texto: 'Padrón del Prestador', icono: 'snd-user--avatar', ruta: '/admin/padron' },
  { texto: 'Padrón de Prestadores de Servicio', icono: 'snd-document', ruta: '/padron-prestadores-servicio' },
  { texto: 'Contratos de Honorarios', icono: 'snd-document', ruta: '/admin/contratos' },
  { texto: 'Modelo de Contrato', icono: 'snd-edit', ruta: '/admin/modelo-contrato' },
  { texto: 'Alta de Modelos de Contratos', icono: 'snd-edit', ruta: '/alta-modelos-contratos' },
  { texto: 'Mis Entregables', icono: 'snd-calendar', ruta: '/user/entregables' },
  { texto: 'Firma e.firma (FIEL)', icono: 'snd-checkmark--filled', ruta: '/prueba-fiel' },
  { texto: 'Validar Identidad', icono: 'snd-user', ruta: '/validar-identidad' },
]

/**
 * Barra de navegación superior (`SndNavbar`) enfocada al Módulo de Honorarios.
 */
export const MENU_SUPERIOR_HONORARIOS: ItemNavegacion[] = [
  { texto: 'Tablero Principal', ruta: '/', exacta: true },
  { texto: 'Padrón', ruta: '/admin/padron' },
  { texto: 'Contratos', ruta: '/admin/contratos' },
  { texto: 'Modelo de Contrato', ruta: '/admin/modelo-contrato' },
  { texto: 'Portal Prestador', ruta: '/user/portal' },
]
