import React from 'react'
import { SndBoton, SndPildoraFiltro } from '../../../components'
import { CATEGORIAS_OPERATIVAS } from '../../../lib/honorarios.service'

export const Informes = ({categoriasActivas, onAlternarCategoria, landingTextos}: {
  categoriasActivas: string[],
  onAlternarCategoria: (cat: string, nuevoEstado: boolean) => void,
  landingTextos: any
}) => {
  return (
    <>
          <div className="honorarios-encabezado-seccion" style={{ marginTop: 4 }}>
            <h2 className="h2b honorarios-encabezado-seccion__titulo">{landingTextos.seccionInformes}</h2>
          </div>
    
          <div className="honorarios-inferior-derecha">
            <article className="honorarios-tarjeta">
              <div className="honorarios-tarjeta__encabezado">
                <h3 className="sh0b honorarios-tarjeta__titulo">{landingTextos.tituloInformes}</h3>
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
                <SndBoton
                  style={{
                    fontSize: "0.8rem",
                    width: "100%",
                    maxWidth: "200px",
                    padding: "1rem 0.8rem"
                  }}
                  onClick={() => {}}
                >
                  Generar reporte dinamico
                </SndBoton>
              </div>
            </article>
          </div>
    
    </>
  )
}
