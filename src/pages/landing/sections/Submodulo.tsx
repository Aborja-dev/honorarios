import React from 'react'
import { SndBoton, SndBotonEnlace, SndIcono } from '../../../components'
import type { ClaveSubmodulo } from '../../../services'

export const Submodulo = ({submoduloActivo, landingTextos, submodulos, onSeleccionarSubmodulo }:{
  submodulos: any[],
  submoduloActivo: string,
  onSeleccionarSubmodulo: (id: ClaveSubmodulo) => void
  categoriasActivas: string[],
  onAlternarCategoria: (cat: string, nuevoEstado: boolean) => void
  landingTextos: any
}) => {
  return (
    <>
      <div className="honorarios-encabezado-seccion">
        <div>
          <h2 className="h2b honorarios-encabezado-seccion__titulo">{landingTextos.seccionHonorarios}</h2>
        </div>

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

                  <div className="fila" style={{ gap: 8 }}>
                    <SndBotonEnlace
                      style={{
                        fontSize: "0.8rem",
                        padding: "1rem 0.8rem"
                      }}
                      variante="primario"
                      to={sub.rutaDedicada}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {landingTextos.botonCargaIndividual}
                    </SndBotonEnlace>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Columna vertical de acciones rápidas */}

      </div>
    </>
  )
}
