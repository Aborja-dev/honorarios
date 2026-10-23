import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, useNotificaciones } from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'

/**
 * Pantalla de inicio de sesión institucional (`Login.tsx`) para el Módulo de Honorarios.
 */
export default function Login() {
  useTitulo('Iniciar sesión · Módulo de Honorarios')
  const navegar = useNavigate()
  const notificar = useNotificaciones()

  const [rfc, setRfc] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  const ingresar = (e: FormEvent) => {
    e.preventDefault()
    if (!rfc.trim() || !clave.trim()) {
      setError(true)
      return
    }
    notificar.exito(`Sesión iniciada para ${rfc.toUpperCase()}.`, 'Acceso autorizado')
    navegar('/')
  }

  return (
    <div className="contenedor">
      <div className="reticulaGrid__12 gapy--16">
        <div className="columna__12">
          <h1 className="h1b patria">Acceso al Módulo de Honorarios</h1>
          <p className="sh0m color--principal">Servicio de Identidad Digital (SIDBG)</p>
        </div>

        <div className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Credenciales Institucionales</h2>
              <SndIcono nombre="snd-user--avatar" tamano={28} className="color--principal" />
            </div>

            <form className="formulario" onSubmit={ingresar} noValidate>
              <div className="campo">
                <label htmlFor="login-rfc" className="b1sb">
                  RFC o CURP{' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="login-rfc"
                  value={rfc}
                  invalid={error && !rfc.trim()}
                  onChange={(e) => setRfc(e.target.value)}
                  onFocus={() => setError(false)}
                  placeholder="Ej. LORM880412HDF"
                  autoComplete="username"
                />
              </div>

              <div className="campo">
                <label htmlFor="login-clave" className="b1sb">
                  Contraseña{' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="login-clave"
                  type="password"
                  value={clave}
                  invalid={error && !clave.trim()}
                  onChange={(e) => setClave(e.target.value)}
                  onFocus={() => setError(false)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <span className="campo__error" role="alert">
                  Captura tu RFC/CURP y contraseña para continuar.
                </span>
              )}

              <div className="fila">
                <SndBoton type="submit">Iniciar sesión</SndBoton>
                <SndBotonEnlace variante="secundario" to="/prueba-fiel">
                  Ingresar con e.firma
                </SndBotonEnlace>
              </div>
            </form>
          </article>
        </div>

        <div className="columna__6">
          <div className="pila">
            <SndMensaje tipo="info">
              <p>
                <strong>Personal administrativo y prestadores de servicios:</strong> Utiliza tu cuenta institucional o
                certificado vigente de <code>e.firma</code> para consultar contratos y entregables.
              </p>
            </SndMensaje>
          </div>
        </div>
      </div>
    </div>
  )
}
