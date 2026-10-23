/**
 * Servicio de validación de Firma Electrónica Avanzada (e.firma / FIEL) e Identidad Digital.
 */
export interface ResultadoValidacionFiel {
  valido: boolean
  rfc: string
  serieCertificado: string
  vigenciaHasta: string
  mensaje: string
}

export const fielService = {
  validarCertificadoSimulado(nombreArchivoCer: string, rfcCapturado: string): ResultadoValidacionFiel {
    const rfcLimpio = rfcCapturado.trim().toUpperCase() || 'LORM880412HDF'
    return {
      valido: Boolean(nombreArchivoCer),
      rfc: rfcLimpio,
      serieCertificado: '00001000000514892301',
      vigenciaHasta: '15/10/2028',
      mensaje: 'Certificado .cer y llave privada .key verificados correctamente ante el servicio criptográfico.',
    }
  },
}
