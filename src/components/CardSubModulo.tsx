import { SndBotonEnlace, SndIcono } from "./snd"

export const CardSubModulo = ({titulo, detalle, descripcion, ruta, icono, id}:{
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
                <h3 className="honorarios-tarjeta__titulo">{titulo}</h3>
            </div>
            <div className="honorarios-submodulo__ilustracion">
                <div>
                    <span className="b1sb color--principal" style={{ display: 'block' }}>
                        {detalle}
                    </span>
                    <span className="sdr">{descripcion}</span>
                </div>
                <SndIcono nombre={icono} tamano={36} className="color--principal" />
            </div>
            <div className="honorarios-submodulo__pie">
                <div className="fila" style={{ gap: 8, width: '100%' }}>
                    <SndBotonEnlace
                        style={{ fontSize: '0.8rem', padding: '1rem 0.8rem', width: '100%' }}
                        variante="primario"
                        to={ruta}
                    >
                        Ingresar
                    </SndBotonEnlace>
                </div>
            </div>
        </article>
    )
}