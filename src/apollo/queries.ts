/**
 * Consultas y mutaciones GraphQL del Módulo de Honorarios.
 */

export const QUERY_RESUMEN_HONORARIOS = /* GraphQL */ `
  query ObtenerResumenHonorarios($trimestre: Int!) {
    resumenHonorarios(trimestre: $trimestre) {
      contratosActivos
      porcentajeAvance
      presupuestoEjercido
      estadisticas {
        vigentes
        enFirma
        enRevision
        porVencer
      }
    }
  }
`

export const QUERY_PADRON_PRESTADORES = /* GraphQL */ `
  query ObtenerPadronPrestadores($filtro: String) {
    padronPrestadores(filtro: $filtro) {
      folio
      nombre
      rfc
      unidad
      concepto
      vigencia
      estado
    }
  }
`

export const QUERY_CONTRATOS_HONORARIOS = /* GraphQL */ `
  query ObtenerContratosHonorarios($filtro: String) {
    contratosHonorarios(filtro: $filtro) {
      folio
      nombre
      unidad
      concepto
      vigencia
      montoMensual
      estado
    }
  }
`

export const QUERY_MODELOS_CONTRATO = /* GraphQL */ `
  query ObtenerModelosContrato {
    modelosContrato {
      folio
      nombre
      unidad
      concepto
      vigencia
      estado
    }
  }
`
