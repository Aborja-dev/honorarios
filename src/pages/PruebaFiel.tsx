import { useState, type FormEvent } from 'react'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, useNotificaciones } from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'
import { fielService, type ResultadoValidacionFiel } from '../services'

/**
 * Pantalla de verificación y firmado con e.firma (`PruebaFiel.tsx`) para Contratos de Honorarios.
 */
export default function PruebaFiel() {
  useTitulo('Firma Electrónica (e.firma) · Módulo de Honorarios')
  const notificar = useNotificaciones()

  const [rfc, setRfc] = useState('LORM880412HDF')
  const [archivoCer, setArchivoCer] = useState('lorm880412hdf.cer')
  const [archivoKey, setArchivoKey] = useState('lorm880412hdf.key')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(false)
  const [resultado, setResultado] = useState<ResultadoValidacionFiel | null>(null)

  const validarFirma = (e: FormEvent) => {
    e.preventDefault()
    if (!contrasena.trim()) {
      setError(true)
      return
    }
    const res = fielService.validarCertificadoSimulado(archivoCer, rfc)
    setResultado(res)
    notificar.exito('Certificado de e.firma verificado correctamente.', 'Firma válida')
  }

  return (
    <div className="contenedor">
      <h1 className="h1b patria">Firma Electrónica Avanzada (e.firma)</h1>
      <p className="sh0m color--principal">Validación criptográfica para Contratos de Honorarios y Entregables</p>

      <div className="reticulaGrid__12 gapy--16" style={{ marginTop: 16 }}>
        <div className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Certificado y Llave Privada</h2>
              <SndPildora tipo="info">SAT · e.firma</SndPildora>
            </div>

            <form className="formulario" onSubmit={validarFirma} noValidate>
              <div className="campo">
                <label htmlFor="fiel-rfc" className="b1sb">
                  RFC del firmante
                </label>
                <InputText id="fiel-rfc" value={rfc} onChange={(e) => setRfc(e.target.value)} />
              </div>

              <div className="campo">
                <label htmlFor="fiel-cer" className="b1sb">
                  Certificado (.cer)
                </label>
                <InputText id="fiel-cer" value={archivoCer} onChange={(e) => setArchivoCer(e.target.value)} />
              </div>

              <div className="campo">
                <label htmlFor="fiel-key" className="b1sb">
                  Clave privada (.key)
                </label>
                <InputText id="fiel-key" value={archivoKey} onChange={(e) => setArchivoKey(e.target.value)} />
              </div>

              <div className="campo">
                <label htmlFor="fiel-pass" className="b1sb">
                  Contraseña de clave privada{' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="fiel-pass"
                  type="password"
                  value={contrasena}
                  invalid={error}
                  onChange={(e) => setContrasena(e.target.value)}
                  onFocus={() => setError(false)}
                  placeholder="Contraseña de la llave privada"
                />
                {error && (
                  <span className="campo__error" role="alert">
                    Ingresa la contraseña de tu llave privada para validar el certificado.
                  </span>
                )}
              </div>

              <div className="fila">
                <SndBoton type="submit">
                  <SndIcono nombre="snd-checkmark--filled" tamano={20} />
                  Verificar y Firmar
                </SndBoton>
                <SndBotonEnlace variante="secundario" to="/">
                  Volver al tablero
                </SndBotonEnlace>
              </div>
            </form>
          </article>
        </div>

        <div className="columna__6">
          <div className="pila">
            {resultado ? (
              <SndMensaje tipo="exito">
                <p>
                  <strong>{resultado.mensaje}</strong>
                </p>
                <p className="sdr">
                  RFC: {resultado.rfc} · Serie: {resultado.serieCertificado} · Vigencia: {resultado.vigenciaHasta}
                </p>
              </SndMensaje>
            ) : (
              <SndMensaje tipo="info">
                <p>
                  La validación de <code>e.firma</code> se realiza para suscribir contratos de prestación de servicios
                  profesionales bajo el régimen de honorarios y autorizar informes mensuales.
                </p>
              </SndMensaje>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
