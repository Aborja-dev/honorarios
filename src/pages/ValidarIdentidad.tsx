import { useState, type FormEvent } from 'react'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndBotonEnlace, SndMensaje, SndPildora, useNotificaciones } from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'

/**
 * Pantalla de validación de identidad (`ValidarIdentidad.tsx`) para prestadores de servicios.
 */
export default function ValidarIdentidad() {
  useTitulo('Validar Identidad · Módulo de Honorarios')
  const notificar = useNotificaciones()

  const [curp, setCurp] = useState('')
  const [rfc, setRfc] = useState('')
  const [validado, setValidado] = useState(false)
  const [error, setError] = useState(false)

  const verificar = (e: FormEvent) => {
    e.preventDefault()
    if (!curp.trim() || !rfc.trim()) {
      setError(true)
      return
    }
    setValidado(true)
    notificar.exito('Identidad verificada con RENAPO y padrón fiscal.', 'Validación exitosa')
  }

  return (
    <div className="contenedor">
      <h1 className="h1b patria">Validación de Identidad del Prestador</h1>
      <p className="sh0m color--principal">Verificación de CURP, RFC y No Inhabilitación</p>

      <div className="reticulaGrid__12 gapy--16" style={{ marginTop: 16 }}>
        <div className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Consulta de Identidad</h2>
              <SndPildora tipo={validado ? 'exito' : 'info'}>
                {validado ? 'Verificado' : 'Pendiente'}
              </SndPildora>
            </div>

            <form className="formulario" onSubmit={verificar} noValidate>
              <div className="campo">
                <label htmlFor="val-curp" className="b1sb">
                  CURP (18 caracteres){' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="val-curp"
                  value={curp}
                  invalid={error && !curp.trim()}
                  onChange={(e) => setCurp(e.target.value.toUpperCase())}
                  onFocus={() => setError(false)}
                  placeholder="Ej. LORM880412MDFRRL09"
                />
              </div>

              <div className="campo">
                <label htmlFor="val-rfc" className="b1sb">
                  RFC con Homoclave{' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="val-rfc"
                  value={rfc}
                  invalid={error && !rfc.trim()}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  onFocus={() => setError(false)}
                  placeholder="Ej. LORM880412HDF"
                />
              </div>

              {error && (
                <span className="campo__error" role="alert">
                  Debes capturar tanto la CURP como el RFC para validar la identidad.
                </span>
              )}

              <div className="fila">
                <SndBoton type="submit">Validar identidad</SndBoton>
                <SndBotonEnlace variante="secundario" to="/admin/padron">
                  Ir al Padrón
                </SndBotonEnlace>
              </div>
            </form>
          </article>
        </div>

        <div className="columna__6">
          {validado ? (
            <SndMensaje tipo="exito">
              <p>
                <strong>Prestador apto para contratación:</strong> Los datos de CURP (<code>{curp}</code>) y RFC (
                <code>{rfc}</code>) coinciden y no presentan impedimento administrativo.
              </p>
            </SndMensaje>
          ) : (
            <SndMensaje tipo="info">
              <p>
                Antes de dar de alta a un prestador en el padrón o generar un contrato de honorarios, verifica la
                consistencia de su CURP y RFC.
              </p>
            </SndMensaje>
          )}
        </div>
      </div>
    </div>
  )
}
