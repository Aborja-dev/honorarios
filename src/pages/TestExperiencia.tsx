import { Button } from 'primereact/button'
import { Experiencia } from './PadronPrestadores/sections/Experiencia'
// Estilos `.padron-*` de los contenedores de sección del padrón.
import './PadronPrestadoresServicio.css'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'

/**
 * Página aislada para revisar la sección "Experiencia laboral" ya conectada al
 * reducer (`SectionProvider` → `Section` → tabla / formulario).
 *
 * No está en el menú: se entra solo escribiendo la URL.
 *
 *   http://localhost:4300/test/experiencia
 */
export default function TestExperiencia() {
  useTitulo('Sección · Experiencia laboral')

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Sección · Experiencia laboral
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Conectada al reducer: "Experiencia nueva" abre el formulario y cada campo despacha
            CAMBIAR.
          </p>
        </div>
      </div>

      <article className="honorarios-tarjeta" style={{ marginTop: 20 }}>
        <div className="honorarios-detalle-barra">
          <span className="sdr" style={{ color: 'var(--neutro600)' }}>
            Prueba: pulsa "Experiencia nueva", captura y observa cómo cambia el estado del
            contenedor.
          </span>
          <div className="fila" style={{ marginLeft: 'auto' }}>
            <Button
              type="button"
              label="Recargar"
              size="small"
              outlined
              className="boton__secundario"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </article>

      <div style={{ marginTop: 20 }}>
        <Experiencia
          itemsIniciales={[
            {
              id: 1,
              institucionLaboral: 'Secretaría Anticorrupción y Buen Gobierno',
              sectorLaboral: 'PUBLICO_FEDERAL',
              puestoDesempenado: 'Especialista en Análisis Normativo',
              areaAdscripcion: 'Dirección General',
              aniosExperiencia: '6',
              funcionesPrincipales:
                'Revisión técnico-jurídica de expedientes de prestadores de servicios profesionales por honorarios.',
            },
          ]}
        />
      </div>
    </div>
  )
}
