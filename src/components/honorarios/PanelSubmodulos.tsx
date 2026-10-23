import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, SndPildoraFiltro } from '../snd'
import { CATEGORIAS_OPERATIVAS, type ClaveSubmodulo, type SubmoduloInfo } from '../../services'

export interface PanelSubmodulosProps {
  submodulos: SubmoduloInfo[]
  submoduloActivo: ClaveSubmodulo
  onSeleccionarSubmodulo: (id: ClaveSubmodulo) => void
  onAbrirModal: (tipo: 'padron' | 'contratos' | 'modelo') => void
  categoriasActivas: string[]
  onAlternarCategoria: (categoria: string, activo: boolean) => void
  cumplimiento: number
  onCambiarCumplimiento: (nuevoValor: number) => void
}

/**
 * Columna derecha del tablero: opciones de submódulos (Padrón, Contratos, Modelo de contrato),
 * accesos rápidos de captura, categorías operativas e indicador de validación jurídica.
 */
export function PanelSubmodulos({
  submodulos,
  submoduloActivo,
  onSeleccionarSubmodulo,
  onAbrirModal,
  categoriasActivas,
  onAlternarCategoria,
  cumplimiento,
  onCambiarCumplimiento,
}: PanelSubmodulosProps) {
  const submoduloActual = submodulos.find((s) => s.id === submoduloActivo) ?? submodulos[0]

  return (
    <div className="honorarios-columna">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h2 className="h2b honorarios-encabezado-seccion__titulo">Submódulos de Honorarios</h2>
          <p className="sdr" style={{ margin: 0 }}>
            Selecciona un submódulo para consultar su padrón o abre su vista dedicada.
          </p>
        </div>
        <SndPildora tipo="info">{submoduloActual.titulo}</SndPildora>
      </div>

      <div className="honorarios-submodulos-layout">
        <div className="honorarios-submodulos-grid">
          {submodulos.map((sub) => {
            const esActivo = submoduloActivo === sub.id
            return (
              <article
                key={sub.id}
                className={`honorarios-submodulo ${esActivo ? 'honorarios-submodulo--activo' : ''}`}
                onClick={() => onSeleccionarSubmodulo(sub.id)}
              >
                <div>
                  <div className="honorarios-tarjeta__encabezado">
                    <h3 className="sh0b honorarios-tarjeta__titulo">{sub.titulo}</h3>
                  </div>
                  <p className="sdr" style={{ margin: '4px 0 0' }}>
                    {sub.subtitulo}
                  </p>
                </div>

                <div className="honorarios-submodulo__ilustracion">
                  <div>
                    <span className="b1sb color--principal" style={{ display: 'block' }}>
                      {sub.metrica}
                    </span>
                    <span className="sdr">{sub.detalle}</span>
                  </div>
                  <SndIcono nombre={sub.icono} tamano={36} className="color--principal" />
                </div>

                <div className="honorarios-submodulo__pie">
                  <SndPildora tipo={sub.estadoTipo}>{sub.estadoTexto}</SndPildora>
                  <div className="fila" style={{ gap: 8 }}>
                    <SndBoton
                      variante={esActivo ? 'primario' : 'secundario'}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSeleccionarSubmodulo(sub.id)
                      }}
                    >
                      {esActivo ? 'Activo' : 'Previsualizar'}
                    </SndBoton>
                    <SndBotonEnlace
                      variante="fantasma"
                      to={sub.rutaDedicada}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ir a módulo
                    </SndBotonEnlace>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Columna vertical de acciones rápidas */}
        <div className="honorarios-acciones-vertical" aria-label="Acciones rápidas de captura">
          <button type="button" className="honorarios-boton-add" onClick={() => onAbrirModal('padron')}>
            <span className="honorarios-boton-add__mas" aria-hidden="true">+</span>
            <span className="sdr b1sb">Alta Prestador</span>
          </button>
          <button type="button" className="honorarios-boton-add" onClick={() => onAbrirModal('contratos')}>
            <span className="honorarios-boton-add__mas" aria-hidden="true">+</span>
            <span className="sdr b1sb">Nuevo Contrato</span>
          </button>
          <button type="button" className="honorarios-boton-add" onClick={() => onAbrirModal('modelo')}>
            <span className="honorarios-boton-add__mas" aria-hidden="true">+</span>
            <span className="sdr b1sb">Nuevo Modelo</span>
          </button>
        </div>
      </div>

      {/* Sección Inferior Derecha: Categorías Operativas + Validación Jurídica */}
      <div className="honorarios-encabezado-seccion" style={{ marginTop: 4 }}>
        <h2 className="h2b honorarios-encabezado-seccion__titulo">Filtros y Cumplimiento</h2>
      </div>

      <div className="honorarios-inferior-derecha">
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h3 className="sh0b honorarios-tarjeta__titulo">Categorías Operativas</h3>
            <span className="sdr">{categoriasActivas.length} activas</span>
          </div>
          <div className="honorarios-pildoras-grid">
            {CATEGORIAS_OPERATIVAS.map((cat) => (
              <SndPildoraFiltro
                key={cat}
                activo={categoriasActivas.includes(cat)}
                onCambio={(activo) => onAlternarCategoria(cat, activo)}
              >
                {cat}
              </SndPildoraFiltro>
            ))}
          </div>
        </article>

        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h3 className="sh0b honorarios-tarjeta__titulo">Validación Jurídica</h3>
          </div>

          <div className="honorarios-arco-contenedor">
            <div className="honorarios-arco">
              <span className="b1sb honorarios-arco__valor">{cumplimiento}%</span>
            </div>
            <span className="sdr">Expedientes dictaminados</span>
          </div>

          <div className="honorarios-control-rango">
            <SndBoton
              variante="secundario"
              aria-label="Disminuir meta de revisión"
              onClick={() => onCambiarCumplimiento(Math.max(50, cumplimiento - 4))}
            >
              −
            </SndBoton>
            <SndPildora tipo={cumplimiento >= 85 ? 'exito' : 'alerta'} punto={false}>
              Meta {cumplimiento}%
            </SndPildora>
            <SndBoton
              variante="secundario"
              aria-label="Aumentar meta de revisión"
              onClick={() => onCambiarCumplimiento(Math.min(100, cumplimiento + 4))}
            >
              +
            </SndBoton>
          </div>
        </article>
      </div>

      <SndMensaje tipo="info">
        <p>
          <strong>Submódulo activo: {submoduloActual.titulo}.</strong> {submoduloActual.detalle}
        </p>
      </SndMensaje>
    </div>
  )
}
