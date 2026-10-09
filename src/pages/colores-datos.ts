/**
 * Datos de la paleta del SND v1.3.0 (misma fuente que la base Angular).
 * Los hexadecimales son los publicados en `snd-guinda.css` / `snd-verde.css`.
 */
export interface Color {
  /** Variable CSS del SND, sin `--`. */
  variable: string;
  /** Nombre según la documentación del SND. */
  nombre: string;
  hex: string;
}

export interface GrupoColores {
  titulo: string;
  descripcion: string;
  colores: Color[];
}

/** Gama de 10 tonos (100 a 950) de una paleta de Presidencia. */
function gama(prefijo: string, nombre: string, hex: string[]): Color[] {
  return [100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((t, i) => ({
    variable: `${prefijo}${t}`,
    nombre: `${nombre} - ${t}`,
    hex: hex[i],
  }));
}

/**
 * Paleta del SND v1.3.0. Los hexadecimales son los publicados en `snd-guinda.css` /
 * `snd-verde.css`; cada muestra pinta con la variable del SND y usa el hexadecimal solo como
 * respaldo, así que si el SND cambia un valor la muestra lo sigue.
 */
export const PRIMITIVOS: GrupoColores[] = [
  {
    titulo: 'Presidencia guinda',
    descripcion: 'Gama principal de proyectos federales. Prefijo pguinda.',
    colores: gama('pguinda', 'Presidencia guinda', ['#F3E4E9', '#E1BDC9', '#CE92A6', '#BA6783', '#A84565', '#9B2247', '#8E1D3F', '#781838', '#611232', '#4A0C26']),
  },
  {
    titulo: 'Presidencia verde',
    descripcion: 'Gama principal de proyectos transversales. Prefijo pverde.',
    colores: gama('pverde', 'Presidencia verde', ['#E0E9E8', '#B3C8C6', '#82A4A0', '#51807A', '#335955', '#004D40', '#004339', '#003931', '#002F2A', '#001D1A']),
  },
  {
    titulo: 'Presidencia dorado',
    descripcion: 'Acento. Prefijo dorado.',
    colores: gama('dorado', 'Presidencia dorado', ['#F6F2EA', '#E4D9C0', '#DBCCAB', '#C9B280', '#B79956', '#A57F2C', '#846623', '#634C1A', '#423312', '#32260D']),
  },
  {
    titulo: 'Neutros',
    descripcion: 'Base para equilibrar el diseño: fondos, bordes y texto.',
    colores: [
      { variable: 'neutro100', nombre: 'Neutro - 100', hex: '#FFFFFF' },
      { variable: 'neutro200', nombre: 'Neutro - 200', hex: '#F9F9F9' },
      { variable: 'neutro300', nombre: 'Neutro - 300', hex: '#F3F3F3' },
      { variable: 'neutro400', nombre: 'Neutro - 400', hex: '#DDDDDD' },
      { variable: 'neutro500', nombre: 'Neutro - 500', hex: '#AAAAAA' },
      { variable: 'neutro600', nombre: 'Neutro - 600', hex: '#767676' },
      { variable: 'neutro700', nombre: 'Neutro - 700', hex: '#434343' },
      { variable: 'neutro800', nombre: 'Neutro - 800', hex: '#161A1D' },
    ],
  },
];

export const SEMANTICOS: GrupoColores[] = [
  {
    titulo: 'Colores de validación',
    descripcion: 'Comunican estados del sistema: error, éxito, información y advertencia.',
    colores: [
      { variable: 'rojo100', nombre: 'Error - 100 (rojo 100)', hex: '#FAE5E5' },
      { variable: 'rojo500', nombre: 'Error - 500 (rojo 500)', hex: '#9B0F15' },
      { variable: 'verde100', nombre: 'Éxito - 100 (verde 100)', hex: '#F0FAF5' },
      { variable: 'verde500', nombre: 'Éxito - 500 (verde 500)', hex: '#086308' },
      { variable: 'azul100', nombre: 'Informativo - 100 (azul 100)', hex: '#EDF2FE' },
      { variable: 'azul500', nombre: 'Informativo - 500 (azul 500)', hex: '#224497' },
      { variable: 'amarillo100', nombre: 'Advertencia - 100 (amarillo 100)', hex: '#FFEB99' },
      { variable: 'amarillo500', nombre: 'Advertencia - 500 (amarillo 500)', hex: '#684700' },
    ],
  },
  {
    titulo: 'Colores adicionales',
    descripcion:
      'Solo para casos que requieren más variedad (estatus, categorías, mapas, gráficas) y que no deben asociarse con error, alerta o éxito. Uso controlado y justificado.',
    colores: [
      { variable: 'morado100', nombre: 'Morado - 100', hex: '#ECE2F5' },
      { variable: 'morado500', nombre: 'Morado - 500', hex: '#6708C1' },
      { variable: 'naranja100', nombre: 'Naranja - 100', hex: '#F9D9A9' },
      { variable: 'naranja500', nombre: 'Naranja - 500', hex: '#6E3700' },
    ],
  },
];

export interface Asignacion {
  uso: string;
  color: string;
  variable?: string;
  hex?: string;
}

export interface GrupoAsignaciones {
  titulo: string;
  filas: Asignacion[];
}

/** Qué color usar para cada elemento, según la sección "Diseño" de la página de colores. */
export const ASIGNACIONES: GrupoAsignaciones[] = [
  {
    titulo: 'Colores primarios',
    filas: [
      { uso: 'Botones principales y elementos de identidad', color: 'Presidencia guinda - 900', variable: 'pguinda900', hex: '#611232' },
      { uso: 'Alternativa transversal (no mezclar con guinda)', color: 'Presidencia verde - 900', variable: 'pverde900', hex: '#002F2A' },
      { uso: 'Alternativa dorada', color: 'Presidencia dorado - 600', variable: 'dorado600', hex: '#A57F2C' },
    ],
  },
  {
    titulo: 'Colores secundarios (acento)',
    filas: [
      { uso: 'Resaltar información o secciones', color: 'Presidencia verde - 500', variable: 'pverde500', hex: '#335955' },
      { uso: 'Resaltar información o secciones', color: 'Presidencia guinda - 600', variable: 'pguinda600', hex: '#9B2247' },
      { uso: 'Resaltar información o secciones', color: 'Presidencia morado - 500', variable: 'morado500', hex: '#6708C1' },
    ],
  },
  {
    titulo: 'Colores de íconos',
    filas: [
      { uso: 'Ícono guinda', color: 'Presidencia guinda - 900', variable: 'pguinda900', hex: '#611232' },
      { uso: 'Ícono verde', color: 'Presidencia verde - 600', variable: 'pverde600', hex: '#004D40' },
      { uso: 'Ícono dorado', color: 'Presidencia dorado - 600', variable: 'dorado600', hex: '#A57F2C' },
      { uso: 'Ícono negro', color: 'Neutro - 800', variable: 'neutro800', hex: '#161A1D' },
      { uso: 'Ícono blanco', color: 'Neutro - 100', variable: 'neutro100', hex: '#FFFFFF' },
    ],
  },
  {
    titulo: 'Colores de texto',
    filas: [
      { uso: 'Texto principal', color: 'Neutro - 800', variable: 'neutro800', hex: '#161A1D' },
      { uso: 'Texto deshabilitado', color: 'Neutro - 600', variable: 'neutro600', hex: '#767676' },
      { uso: 'Texto blanco', color: 'Neutro - 100', variable: 'neutro100', hex: '#FFFFFF' },
    ],
  },
  {
    titulo: 'Colores de borde',
    filas: [
      { uso: 'Alto contraste', color: 'Neutro - 600', variable: 'neutro600', hex: '#767676' },
      { uso: 'Bajo contraste', color: 'Neutro - 400', variable: 'neutro400', hex: '#DDDDDD' },
      { uso: 'Seleccionado', color: 'Azul - 500', variable: 'azul500', hex: '#224497' },
    ],
  },
  {
    titulo: 'Colores de fondo',
    filas: [
      { uso: 'Body (fondo de página)', color: 'Neutro - 200', variable: 'neutro200', hex: '#F9F9F9' },
      { uso: 'Tarjeta', color: 'Neutro - 100', variable: 'neutro100', hex: '#FFFFFF' },
    ],
  },
];
