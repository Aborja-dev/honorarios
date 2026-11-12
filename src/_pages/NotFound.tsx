import { SndBotonEnlace, SndIcono, SndMensaje } from '../components'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../lib/hooks'

/**
 * Página de ruta no encontrada (`NotFound.tsx`) del Módulo de Honorarios.
 */
export default function NotFound() {
  useTitulo('Página no encontrada · Módulo de Honorarios')

  return (
    <div className="contenedor">
      <div className="reticulaGrid__12 gapy--16">
        <div className="columna__12">
          <div className="fila">
            <SndIcono nombre="snd-warning" tamano={48} className="color--principal" />
            <div>
              <h1 className="h1b patria" style={{ margin: 0 }}>
                404 · Ruta no encontrada
              </h1>
              <p className="sh0m color--principal" style={{ margin: 0 }}>
                Módulo de Honorarios · SABG
              </p>
            </div>
          </div>
        </div>

        <div className="columna__12">
          <SndMensaje tipo="alerta">
            <p>La dirección solicitada no existe o fue movida dentro del Módulo de Honorarios.</p>
          </SndMensaje>
        </div>

        <div className="columna__12">
          <SndBotonEnlace to="/">Volver al tablero de Honorarios</SndBotonEnlace>
        </div>
      </div>
    </div>
  )
}
