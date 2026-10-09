import { addLocale, locale } from 'primereact/api'

/**
 * Textos de PrimeReact en español (calendario, tabla, filtros y diálogos).
 * `registrarLocaleEs()` se invoca una vez al iniciar (ver `main.tsx`) y activa el idioma `es`.
 */
export const PRIMEREACT_ES = {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  weekHeader: 'Sem',
  dateFormat: 'dd/mm/yy',
  accept: 'Aceptar',
  reject: 'Cancelar',
  emptyMessage: 'Sin resultados',
  emptyFilterMessage: 'Sin resultados',
  apply: 'Aplicar',
  matchAll: 'Cumple todas',
  matchAny: 'Cumple alguna',
  addRule: 'Agregar regla',
  removeRule: 'Quitar regla',
  startsWith: 'Empieza con',
  contains: 'Contiene',
  notContains: 'No contiene',
  endsWith: 'Termina con',
  equals: 'Igual a',
  notEquals: 'Distinto de',
  noFilter: 'Sin filtro',
}

/** Registra los textos en español y los activa como idioma de PrimeReact. */
export function registrarLocaleEs(): void {
  addLocale('es', PRIMEREACT_ES)
  locale('es')
}
