import { SndBotonEnlace, SndIcono } from "./snd"

export const CardSubModulo = ({ titulo, detalle, descripcion, ruta, icono, id }: {
    id: string,
    titulo: string,
    detalle?: string,
    descripcion: string,
    ruta: string,
    icono: string
}) => {
    return (
        <article
            key={id}
            className={`honorarios-submodulo`}
        >
            <div className="honorarios-tarjeta__encabezado">
            </div>
                <h3 className="honorarios-tarjeta__titulo">{titulo}</h3>
                                {detalle && (
                    <span className="b1sb color--principal" style={{ display: 'block', fontWeight: 'bold', margin: 0 }}>
                        {detalle}
                    </span>
                )}
            <span className="sdr">{descripcion}</span>
            <div className="honorarios-submodulo__ilustracion" style={{display: 'flex', justifyContent: 'center'}}>
                <SndIcono nombre={icono} tamano={72} className="color--principal" />
            </div>
            <div>

            </div>
            <div className="honorarios-submodulo__pie">
                <div className="fila" style={{ gap: 8, width: '100%',  }}>
                    <SndBotonEnlace
                        style={{ fontSize: '1rem', padding: '1rem 0.8rem', width: '100%' }}
                        variante="primario"
                        to={ruta}
                    >
                        Ir al modulo
                    </SndBotonEnlace>
                </div>
            </div>
        </article>
    )
}