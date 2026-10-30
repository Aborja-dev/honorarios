import type { ItemMenuLateral, ItemNavegacion } from '../components/snd'

/**
 * Menú lateral (`SndMenuLateral`) exclusivo del Módulo de Honorarios.
 * Contiene únicamente las opciones operativas de Honorarios.
 */
export const MENU_LATERAL_HONORARIOS: ItemMenuLateral[] = [
  { texto: 'Tablero de Honorarios', icono: 'snd-home', ruta: '/', exacta: true },
  { texto: 'Padrón del Prestador', icono: 'snd-user--avatar', ruta: '/admin/padron' },
  /* { texto: 'Padrón de Prestadores de Servicio', icono: 'snd-document', ruta: '/padron-prestadores-servicio' }, */
  { texto: 'Contratos de Honorarios', icono: 'snd-document', ruta: '/admin/contratos' },
  /* { texto: 'Formalización de Contratos', icono: 'snd-document', ruta: '/formalizacion-contratos' }, */
  { texto: 'Modelo de Contrato', icono: 'snd-edit', ruta: '/admin/modelo-contrato' },
  /* { texto: 'Alta de Modelos de Contrato', icono: 'snd-edit', ruta: '/alta-modelos-contratos' }, */
  { texto: 'Validador de Compatibilidad', icono: 'snd-user', ruta: '/validar-identidad' },
]

/**
 * Barra de navegación superior (`SndNavbar`) enfocada al Módulo de Honorarios.
 */
export const MENU_SUPERIOR_HONORARIOS: ItemNavegacion[] = [
  { texto: 'Tablero Principal', ruta: '/', exacta: true },
  { texto: 'Validador de Compatibilidad', ruta: '/validar-identidad' },
  { texto: 'Padrón del Prestador', ruta: '/admin/padron' },
  { texto: 'Modelo de Contrato', ruta: '/admin/modelo-contrato' },
  { texto: 'Contratos de Honorarios', ruta: '/admin/contratos' },
/*   { texto: 'Formalización', ruta: '/formalizacion-contratos' },
  { texto: 'Portal Prestador', ruta: '/user/portal' }, */
]
