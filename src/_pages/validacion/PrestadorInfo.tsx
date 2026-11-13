import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, type TipoPildora } from '../../components'
import '../../components/honorarios/Honorarios.css'
import type { EstadoValidacion } from '../../lib/service/ValidarCompatibilidad'

export interface Prestador {
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    ramo: string
    institucion: string
    CURP: string
    denominacion: string
    fechaIngreso: string
    estatus: string
    estatusRegistrado: boolean
    tipoContratacion: string
}

const PRESTADOR_DEMO: Prestador = {
    nombre: 'Abraham Ankahara',
    apellidoPaterno: 'Borja',
    apellidoMaterno: 'Organista',
    ramo: '27',
    institucion: '000',
    CURP: 'BOOA950211HDFRRB03',
    denominacion: 'apoyo administrativo en salud A2',
    fechaIngreso: '16/11/2021',
    estatus: 'normalizacion',
    estatusRegistrado: false,
    tipoContratacion: 'formalizado',
}

const ESTATUS: Partial<Record<EstadoValidacion, { etiqueta: string; tipo: string }>> = {
    NO_EXISTE: { etiqueta: 'Nuevo', tipo: 'exito' },
    NORMALIZACION: { etiqueta: 'Existe en RUSP', tipo: 'exito' },
    ACTUALIZACION: { etiqueta: 'Actualización', tipo: 'info' },
}




const capitalizar = (texto: string) => `${texto.charAt(0).toUpperCase()}${texto.slice(1)}`

export interface PrestadorInfoProps {
    prestador?: Prestador,
    mensaje: string
    estado: EstadoValidacion
}

export const PrestadorInfo = ({ prestador = PRESTADOR_DEMO, mensaje, estado }: PrestadorInfoProps) => {
    const estatus = ESTATUS[estado] ?? { etiqueta: prestador.estatus, tipo: 'neutro' }
    const nombreCompleto = [prestador.nombre, prestador.apellidoPaterno, prestador.apellidoMaterno]
        .filter(Boolean)
        .join(' ')

    const datos = [
        { etiqueta: 'CURP', valor: prestador.CURP },
        { etiqueta: 'Denominación', valor: prestador.denominacion },
        { etiqueta: 'Ramo', valor: prestador.ramo },
        { etiqueta: 'Institución', valor: prestador.institucion },
        { etiqueta: 'Fecha de ingreso', valor: prestador.fechaIngreso },
        { etiqueta: 'Tipo de contratación', valor: capitalizar(prestador.tipoContratacion) },
    ]

    return (
        <article className="honorarios-tarjeta honorarios-prestador" style={{ height: '100%' }}>
            <div>
                <div>
                    {estado == 'NO_REGISTRADO' && <SndMensaje tipo='alerta'>{mensaje}</SndMensaje>}
                    {
                        (estado == 'COMPATIBILIDAD' ||
                            estado == 'NORMALIZACION' ||
                            estado == 'NO_EXISTE') &&
                        <SndMensaje tipo='exito'>{mensaje}</SndMensaje>}
                </div>
                <div className="honorarios-tarjeta__encabezado">

                    <div>
                        <h2 className="sh0b honorarios-tarjeta__titulo">Información del prestador</h2>
                        <div style={{ gap: 8 }}>
                            <SndPildora tipo={estatus.tipo}>{estatus.etiqueta}</SndPildora>
                            {/*    <SndPildora tipo={prestador.estatusRegistrado ? 'exito' : 'inactivo'}>
            {prestador.estatusRegistrado ? 'Registrado' : 'No registrado'}
          </SndPildora> */}
                        </div>
                    </div>
                    <h3 className="honorarios-prestador__nombre">{nombreCompleto}</h3>
                </div>
            </div>


            <dl className="honorarios-prestador__datos">
                {datos.map(({ etiqueta, valor }) => (
                    <div className="honorarios-prestador__dato" key={etiqueta}>
                        <dt className="honorarios-prestador__etiqueta">{etiqueta}</dt>
                        <dd className="honorarios-prestador__valor">{valor}</dd>
                    </div>
                ))}
            </dl>
            {
                (
                    estado == 'NORMALIZACION' ||
                    estado == 'ACTUALIZACION'
                ) &&
                (
                    <div style={{display: 'flex', justifyContent:'end'}}>
                        <SndBotonEnlace  to={'/padron-prestadores-servicio'} >
                            Ir al padron
                            <span><SndIcono nombre="snd-arrow--right" tamano={20} /></span>
                            </SndBotonEnlace>
                    </div>
                )
            }
        </article>
    )
}


