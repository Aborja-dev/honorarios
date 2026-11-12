import type { ItemMenuLateral, ItemNavegacion } from '../components/snd'

/**
 * Menú lateral (`SndMenuLateral`) exclusivo del Módulo de Honorarios.
 * Contiene únicamente las opciones operativas de Honorarios.
 */
export const MENU_LATERAL_HONORARIOS: ItemMenuLateral[] = [
  { texto: 'Inicio', icono: 'snd-home', ruta: '/', exacta: true },
  { texto: 'Validador de Compatibilidad', icono: 'snd-user', ruta: '/validar-identidad' },
  { texto: 'Padrón del Prestador', icono: 'snd-user--avatar', ruta: '/admin/padron' },
  { texto: 'Modelo de Contrato', icono: 'snd-edit', ruta: '/admin/modelo-contrato' },
  { texto: 'Contratos de Honorarios', icono: 'snd-document', ruta: '/admin/contratos' },
  /* { texto: 'Padrón de Prestadores de Servicio', icono: 'snd-document', ruta: '/padron-prestadores-servicio' }, */
  /* { texto: 'Formalización de Contratos', icono: 'snd-document', ruta: '/formalizacion-contratos' }, */
  /* { texto: 'Alta de Modelos de Contrato', icono: 'snd-edit', ruta: '/alta-modelos-contratos' }, */
]

/**
 * Barra de navegación superior (`SndNavbar`) enfocada al Módulo de Honorarios.
 */
export const MENU_SUPERIOR_HONORARIOS: ItemNavegacion[] = [
 
]