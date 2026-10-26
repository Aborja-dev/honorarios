import { SndBoton, SndIcono, SndPildora } from '../snd'

const CardRUSP = () => {
    return (
        <article className="honorarios-submodulo honorarios-submodulo--activo">
            <div>
                <div className="honorarios-tarjeta__encabezado">
                    <h3 className="honorarios-tarjeta__titulo">Cifras RUSP vs Honorario</h3>
                </div>
            </div>

            <div className="honorarios-submodulo__ilustracion">
                <div>
                    <span className="b1sb color--principal" style={{ display: 'block' }}>
                        76%
                    </span>
                    <span className="sdr">Porcentaje de coincidencias</span>
                    <p className="sdr">Quincena actual</p>
                </div>
                <SndIcono nombre="snd-user--avatar" tamano={36} className="color--principal" />
            </div>

            <div className="honorarios-submodulo__pie">
                <SndPildora tipo="exito">Habilitado</SndPildora>
                <div className="fila" style={{ gap: 8 }}>
                    <SndBoton variante="primario">
                        Cambiar Quincena
                    </SndBoton>
                </div>
            </div>
        </article>
    )
}

export default CardRUSP
