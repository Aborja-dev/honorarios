import { BienvenidaHonorarios, SndBuscador } from "../../../components"

export const Hero = ({busqueda, setBusqueda, notificar, submoduloInfoActual, datosTrimestre}:{
    busqueda: string,
    setBusqueda: (valor: string) => void,
    notificar: any,
    submoduloInfoActual: any,
    datosTrimestre: any
}) => {
    return (
        <>
            <SndBuscador
                variante="principal"
                etiqueta="Buscar en el módulo de Honorarios"
                placeholder="Buscar prestador, RFC, folio de contrato o modelo…"
                valor={busqueda}
                onValor={setBusqueda}
                onBuscar={(valor) => {
                    if (valor.trim()) {
                        notificar.info(`Mostrando coincidencias para «${valor}» en ${submoduloInfoActual.titulo}.`)
                    }
                }}
            />

            <BienvenidaHonorarios etiquetaPeriodo={datosTrimestre.etiqueta} />
        </>
    )
}
