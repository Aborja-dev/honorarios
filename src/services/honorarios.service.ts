import type { TipoPildora } from '../components/snd'
import { landingTextos } from '../pages/LandingTextos'

export type ClaveSubmodulo = 'padron' | 'contratos' | 'modelo' | 'suficiencia'

export interface SubmoduloInfo {
  id: ClaveSubmodulo
  titulo: string
  subtitulo: string
  rutaDedicada: string
  metrica: string
  detalle: string
  icono: string
  estadoTexto: string
  estadoTipo: TipoPildora
}

export interface RegistroSubmodulo {
  folio: string
  nombre: string
  rfc?: string
  unidad: string
  concepto: string
  vigencia: string
  montoMensual?: string
  estado: string
  tipoPildora: TipoPildora
}

export interface DatosTrimestre {
  etiqueta: string
  contratosActivos: number
  porcentajeAvance: number
  presupuestoEjercido: string
  estadisticas: {
    vigentes: number
    enFirma: number
    enRevision: number
    porVencer: number
  }
}

export const UNIDADES_ADMINISTRATIVAS: string[] = [
  'Unidad de Administración y Finanzas',
  'Dirección General de Recursos Humanos',
  'Unidad de Asuntos Jurídicos',
  'Dirección de Tecnologías de la Información',
]

export const CATEGORIAS_OPERATIVAS: string[] = [
  'Ingresado',
  'Autorizado',
  'Rechazado',
  'Cancelado anticipadamente',
  'Pendiente de Autorizar por SFP',
  'En proceso',
  'Cancelado por vencimiento',
  'Cancelado por peticion de la institucion'
]

export const TRIMESTRES_HONORARIOS: DatosTrimestre[] = [
  {
    etiqueta: 'Quincena 18/2026',
    contratosActivos: 980,
    porcentajeAvance: 68,
    presupuestoEjercido: '$42.8 M',
    estadisticas: { vigentes: 48, enFirma: 27, enRevision: 15, porVencer: 10 },
  },
  {
    etiqueta: 'Quincena 19/2026',
    contratosActivos: 1120,
    porcentajeAvance: 76,
    presupuestoEjercido: '$86.4 M',
    estadisticas: { vigentes: 52, enFirma: 23, enRevision: 15, porVencer: 10 },
  },
  {
    etiqueta: 'Quincena 20/2026',
    contratosActivos: 1248,
    porcentajeAvance: 84,
    presupuestoEjercido: '$129.6 M',
    estadisticas: { vigentes: 50, enFirma: 25, enRevision: 15, porVencer: 10 },
  },
  {
    etiqueta: 'Quincena 21/2026',
    contratosActivos: 1315,
    porcentajeAvance: 92,
    presupuestoEjercido: '$164.2 M',
    estadisticas: { vigentes: 58, enFirma: 18, enRevision: 14, porVencer: 10 },
  },
]

export const SUBMODULOS_HONORARIOS: SubmoduloInfo[] = [
  {
    id: 'padron',
    titulo: landingTextos.tituloPadron,
    subtitulo: 'Registro Único de Prestadores',
    rutaDedicada: '/admin/padron',
    metrica: '1,420',
    detalle: landingTextos.descPadron,
    icono: 'snd-user--avatar',
    estadoTexto: 'Habilitado',
    estadoTipo: 'exito',
  },
  {
    id: 'contratos',
    titulo: landingTextos.tituloContrato,
    subtitulo: 'Gestión y Ciclo Contractual',
    rutaDedicada: '/admin/contratos',
    metrica: '1,248 vigentes',
    detalle: landingTextos.descContrato,
    icono: 'snd-document',
    estadoTexto: 'En operación',
    estadoTipo: 'info',
  },
  {
    id: 'modelo',
    titulo: landingTextos.tituloModelo,
    subtitulo: 'Plantillas Jurídicas Autorizadas',
    rutaDedicada: '/admin/modelo-contrato',
    metrica: '6 plantillas',
    detalle: landingTextos.descValidarCurp,
    icono: 'snd-edit',
    estadoTexto: 'Dictaminado',
    estadoTipo: 'purple',
  },
  {
    id: 'suficiencia',
    titulo: landingTextos.tituloModelo,
    subtitulo: 'Plantillas Jurídicas Autorizadas',
    rutaDedicada: '/admin/modelo-contrato',
    metrica: '76%',
    detalle: landingTextos.descModelo,
    icono: 'snd-edit',
    estadoTexto: 'Dictaminado',
    estadoTipo: 'purple',
  }
]

export const REGISTROS_POR_SUBMODULO: Record<ClaveSubmodulo, RegistroSubmodulo[]> = {
  padron: [
    {
      folio: 'PAD-2026-0104',
      nombre: 'María Fernanda López Ríos',
      rfc: 'LORM880412Hdf',
      unidad: 'Unidad de Administración y Finanzas',
      concepto: 'Especialista en Control Presupuestal · Capítulo 1000',
      vigencia: '01/01/2026 - 31/12/2026',
      montoMensual: '$38,500.00',
      estado: 'Expediente validado',
      tipoPildora: 'exito',
    },
    {
      folio: 'PAD-2026-0108',
      nombre: 'Carlos Alberto Méndez Soto',
      rfc: 'MESC900921Mdf',
      unidad: 'Dirección de Tecnologías de la Información',
      concepto: 'Arquitecto de Sistemas Gubernamentales · Asimilados',
      vigencia: '16/01/2026 - 31/12/2026',
      montoMensual: '$44,200.00',
      estado: 'En revisión',
      tipoPildora: 'info',
    },
    {
      folio: 'PAD-2026-0115',
      nombre: 'Laura Patricia Gómez Vega',
      rfc: 'GOVL910214Mdf',
      unidad: 'Unidad de Asuntos Jurídicos',
      concepto: 'Analista de Normatividad Contractual · Capítulo 1000',
      vigencia: '01/02/2026 - 31/12/2026',
      montoMensual: '$34,000.00',
      estado: 'Expediente validado',
      tipoPildora: 'exito',
    },
    {
      folio: 'PAD-2026-0122',
      nombre: 'Jorge Eduardo Ramírez Cruz',
      rfc: 'RACJ850730Hdf',
      unidad: 'Dirección General de Recursos Humanos',
      concepto: 'Coordinador de Capacitación y Servicio Profesional',
      vigencia: '01/03/2026 - 30/11/2026',
      montoMensual: '$36,800.00',
      estado: 'Por actualizar constancia',
      tipoPildora: 'alerta',
    },
  ],
  contratos: [
    {
      folio: 'CTO-HON-2026-0841',
      nombre: 'María Fernanda López Ríos',
      unidad: 'Unidad de Administración y Finanzas',
      concepto: 'Contrato de Prestación de Servicios Profesionales Cap. 1000',
      vigencia: '01/07/2026 - 31/12/2026',
      montoMensual: '$38,500.00',
      estado: 'Vigente',
      tipoPildora: 'exito',
    },
    {
      folio: 'CTO-HON-2026-0849',
      nombre: 'Carlos Alberto Méndez Soto',
      unidad: 'Dirección de Tecnologías de la Información',
      concepto: 'Contrato de Honorarios Asimilados a Salarios',
      vigencia: '01/07/2026 - 31/12/2026',
      montoMensual: '$44,200.00',
      estado: 'En firma electrónica',
      tipoPildora: 'info',
    },
    {
      folio: 'CTO-HON-2026-0854',
      nombre: 'Roberto Hernández Villalobos',
      unidad: 'Unidad de Asuntos Jurídicos',
      concepto: 'Contrato de Asesoría Especializada en Dictaminación',
      vigencia: '16/07/2026 - 31/10/2026',
      montoMensual: '$41,000.00',
      estado: 'Por vencer',
      tipoPildora: 'alerta',
    },
    {
      folio: 'CTO-HON-2026-0860',
      nombre: 'Ana Sofía Domínguez Lara',
      unidad: 'Dirección General de Recursos Humanos',
      concepto: 'Contrato de Servicios Profesionales por Obra Determinada',
      vigencia: '01/08/2026 - 31/12/2026',
      montoMensual: '$32,500.00',
      estado: 'Observado',
      tipoPildora: 'error',
    },
  ],
  modelo: [
    {
      folio: 'MOD-JUR-2026-01',
      nombre: 'Modelo Estándar Capítulo 1000 (Persona Física)',
      unidad: 'Unidad de Asuntos Jurídicos',
      concepto: 'Plantilla oficial con 18 cláusulas y anexo técnico de actividades',
      vigencia: 'Ejercicio Fiscal 2026',
      estado: 'Autorizado',
      tipoPildora: 'exito',
    },
    {
      folio: 'MOD-JUR-2026-02',
      nombre: 'Modelo de Honorarios Asimilados a Salarios',
      unidad: 'Dirección General de Recursos Humanos',
      concepto: 'Plantilla con retención ISR Art. 94 LISR y entregables mensuales',
      vigencia: 'Ejercicio Fiscal 2026',
      estado: 'Autorizado',
      tipoPildora: 'exito',
    },
    {
      folio: 'MOD-JUR-2026-03',
      nombre: 'Modelo Convenio Modificatorio de Monto / Plazo',
      unidad: 'Unidad de Asuntos Jurídicos',
      concepto: 'Adendum para ampliación de vigencia o techo presupuestal',
      vigencia: 'Ejercicio Fiscal 2026',
      estado: 'En actualización',
      tipoPildora: 'info',
    },
  ],
  suficiencia: [
    {
      folio: 'SUF-2026-0312',
      nombre: 'Oficio de Suficiencia Presupuestal Partida 12101',
      unidad: 'Unidad de Administración y Finanzas',
      concepto: 'Autorización global 3.er Trimestre Honorarios Asimilados',
      vigencia: 'Julio - Septiembre 2026',
      estado: 'Liberado',
      tipoPildora: 'exito',
    },
    {
      folio: 'SUF-2026-0319',
      nombre: 'Entregables de Actividades Septiembre 2026',
      unidad: 'Dirección General de Recursos Humanos',
      concepto: 'Lote de 142 informes mensuales firmados con e.firma',
      vigencia: 'Octubre 2026',
      estado: 'En validación',
      tipoPildora: 'info',
    },
  ],
}

/**
 * Servicio de dominio del Módulo de Honorarios.
 * En una integración productiva puede delegar a `peticionHttp` o al cliente de `src/apollo/`.
 */
export const honorariosService = {
  obtenerSubmodulos(): SubmoduloInfo[] {
    return SUBMODULOS_HONORARIOS
  },
  obtenerTrimestres(): DatosTrimestre[] {
    return TRIMESTRES_HONORARIOS
  },
  obtenerRegistrosPorSubmodulo(submodulo: ClaveSubmodulo): RegistroSubmodulo[] {
    return REGISTROS_POR_SUBMODULO[submodulo] ?? []
  },
}
