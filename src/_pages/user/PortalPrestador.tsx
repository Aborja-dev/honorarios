import { SndBotonEnlace, SndIcono, SndMensaje, SndPildora } from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../lib/hooks'

/**
 * Vista para la persona prestadora de servicios (`pages/user/PortalPrestador.tsx`).
 */
export default function PortalPrestador() {
  useTitulo('Portal del Prestador · Módulo de Honorarios')

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Portal del Prestador de Servicios
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Consulta de expediente activo, contrato vigente e informes de actividades
          </p>
        </div>
        <SndBotonEnlace variante="secundario" to="/">
          Ir al Tablero General
        </SndBotonEnlace>
      </div>

      <div className="reticulaGrid__12 gapy--16" style={{ marginTop: 16 }}>
        <div className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Mi Contrato Actual</h2>
              <SndPildora tipo="exito">Vigente</SndPildora>
            </div>
            <p className="b1sb">Folio: CTO-HON-2026-0841</p>
            <p className="b1r">
              Régimen: Prestación de Servicios Profesionales bajo Honorarios (Capítulo 1000) · Vigencia del 01/07/2026
              al 31/12/2026.
            </p>
            <div className="fila">
              <SndBotonEnlace to="/prueba-fiel">
                <SndIcono nombre="snd-edit" tamano={20} />
                Firmar anexo con e.firma
              </SndBotonEnlace>
              <SndBotonEnlace variante="secundario" to="/user/entregables">
                Ver mis entregables
              </SndBotonEnlace>
            </div>
          </article>
        </div>

        <div className="columna__6">
          <SndMensaje tipo="info">
            <p>
              <strong>Entrega de informe mensual:</strong> Recuerda cargar y firmar tu reporte de actividades antes del
              día 25 de cada mes para liberar el trámite de pago.
            </p>
          </SndMensaje>
        </div>
      </div>
    </div>
  )
}
