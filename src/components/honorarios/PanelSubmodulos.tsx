import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, SndPildoraFiltro } from '../snd'
import { CATEGORIAS_OPERATIVAS, type ClaveSubmodulo, type SubmoduloInfo } from '../../services'
import CardRUSP from './CardRUSP'
import { landingTextos } from '../../pages/LandingTextos'

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
  categoriasActivas,
  onAlternarCategoria,
}: PanelSubmodulosProps) {
  const submoduloActual = submodulos.find((s) => s.id === submoduloActivo) ?? submodulos[0]

  return (
    <div className="honorarios-columna">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h2 className="h2b honorarios-encabezado-seccion__titulo">{landingTextos.seccionHonorarios}</h2>
        </div>
        <SndPildora tipo="info">{submoduloActual.titulo}</SndPildora>
      </div>

      <div className="honorarios-submodulos-layout">
        <div className="honorarios-submodulos-grid">
          {submodulos.map((sub, index) => {
            const esActivo = submoduloActivo === sub.id
            
            return (
              <article
                key={sub.id}
                className={`honorarios-submodulo ${esActivo ? 'honorarios-submodulo--activo' : ''}`}
                onClick={() => onSeleccionarSubmodulo(sub.id)}
              >
                <div>
                  <div className="honorarios-tarjeta__encabezado">
                    <h3 className="honorarios-tarjeta__titulo">{sub.titulo}</h3>
                  </div>
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
                      variante={true ? 'primario' : 'secundario'}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSeleccionarSubmodulo(sub.id)
                      }}
                    >
                      {true ? landingTextos.botonCargaMasiva: ''}
                    </SndBoton>
                    <SndBoton
                      variante="secundario"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {landingTextos.botonCargaIndividual}
                    </SndBoton>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Columna vertical de acciones rápidas */}

      </div>

      {/* Sección Inferior Derecha: Categorías Operativas + Validación Jurídica */}
      <div className="honorarios-encabezado-seccion" style={{ marginTop: 4 }}>
        <h2 className="h2b honorarios-encabezado-seccion__titulo">{landingTextos.seccionInformes}</h2>
      </div>

      <div className="honorarios-inferior-derecha">
        <article className="honorarios-tarjeta">
          <div className="honorarios-tarjeta__encabezado">
            <h3 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloInformes}</h3>
            <span className="sdr">{categoriasActivas.length} activas</span>
          </div>
          <div className="honorarios-pildoras-grid">
            {CATEGORIAS_OPERATIVAS.map((cat) => (
              <SndPildoraFiltro
                key={cat}
                activo={categoriasActivas.includes(cat)}
                onCambio={(activo) => onAlternarCategoria(cat, activo)}
              >
                <span>{cat}</span>
              </SndPildoraFiltro>
            ))}
          </div>
        </article>
      </div>

    </div>
  )
}
