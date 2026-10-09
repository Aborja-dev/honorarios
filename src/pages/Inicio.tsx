import { useTitulo } from '../core/useTitulo'
import { SndBotonEnlace, SndMensaje } from '../snd'
import { NOMBRE_BASE } from '../core/base'

/** Página de inicio de la base. */
export default function Inicio() {
  useTitulo('Inicio')
  return (
    <div className="contenedor">
      <div className="reticulaGrid__12 gapy--16">
        <div className="columna__12">
          <h1 className="h1b patria">Base React del Sistema Nacional de Diseño</h1>
      <p className="sh0m color--principal">{NOMBRE_BASE}</p>
          <p className="b1r">
            Esqueleto de aplicación con la identidad visual del SND: encabezado, navegación, pie de página y los
            componentes más comunes, con PrimeReact para los componentes complejos.
          </p>
        </div>
        <div className="columna__12">
          <SndMensaje tipo="info">
            <p>Usa el selector de tema del encabezado para alternar entre la gama guinda y la verde.</p>
          </SndMensaje>
        </div>
        <div className="columna__12">
          <SndBotonEnlace to="/componentes">Ver componentes</SndBotonEnlace>
        </div>
      </div>
    </div>
  )
}
