import { useState } from 'react'
import { Button } from 'primereact/button'
import { ExperienciaMaqueta } from '../components/personalizados/ExperienciaMaqueta'
// Los estilos `.padron-*` viven en su propia hoja; la maqueta los reutiliza.
import './PadronPrestadoresServicio.css'
import '../components/honorarios/Honorarios.css'
import { useTitulo } from '../hooks'

/**
 * Página aislada para revisar la maqueta de "Experiencia laboral".
 *
 * Vive fuera de la navegación de Honorarios (no está en el menú lateral ni en
 * la barra superior): se entra solo escribiendo la URL.
 *
 *   http://localhost:4300/test/experiencia
 *
 * El interruptor solo decide **qué maqueta se pinta**: tabla o formulario. No
 * hay estado de la maqueta, ni validación, ni guardado; los campos no cambian.
 */
export default function TestExperiencia() {
  useTitulo('Maqueta · Experiencia laboral')
  const [vista, setVista] = useState<'tabla' | 'formulario'>('tabla')

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Maqueta · Experiencia laboral
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Página de prueba aislada: solo diseño, sin lógica ni guardado.
          </p>
        </div>
      </div>

      <article className="honorarios-tarjeta" style={{ marginTop: 20 }}>
        <div className="honorarios-detalle-barra">
          <span className="b1sb color--principal">Vista de la maqueta:</span>
          <div className="fila" style={{ marginLeft: 'auto' }}>
            <Button
              type="button"
              label="Tabla"
              size="small"
              outlined={vista !== 'tabla'}
              className={vista === 'tabla' ? 'boton__primario' : 'boton__secundario'}
              onClick={() => setVista('tabla')}
            />
            <Button
              type="button"
              label="Formulario"
              size="small"
              outlined={vista !== 'formulario'}
              className={vista === 'formulario' ? 'boton__primario' : 'boton__secundario'}
              onClick={() => setVista('formulario')}
            />
          </div>
        </div>
      </article>

      <div style={{ marginTop: 20 }}>
        <ExperienciaMaqueta vista={vista} />
      </div>
    </div>
  )
}
