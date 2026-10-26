import React from 'react'
import { SndBoton, SndIcono, SndPildora } from '../snd'
import type { ClaveSubmodulo, SubmoduloInfo } from '../../services'

const CardRUSP = ({ sub, esActivo, onSeleccionarSubmodulo }: { sub: SubmoduloInfo, esActivo: boolean, onSeleccionarSubmodulo: (id: ClaveSubmodulo) => void }) => {
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
                        {true ? 'Cambiar ' : ''}
                    </SndBoton>
                </div>
            </div>
        </article>
    )
}

export default CardRUSP