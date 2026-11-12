import React from 'react'
import { CifrasYEstadisticas } from '../../../components'
import { TRIMESTRES_HONORARIOS } from '../../../lib/honorarios.service'

export const Graficas = ({ datosTrimestre, indiceTrimestre, setIndiceTrimestre, ventanillaAbierta, setVentanillaAbierta, firmaActiva, setFirmaActiva }) => {
    return (
        <CifrasYEstadisticas
            datosTrimestre={datosTrimestre}
            indiceTrimestre={indiceTrimestre}
            totalTrimestres={TRIMESTRES_HONORARIOS.length}
            onCambiarTrimestre={setIndiceTrimestre}
            ventanillaAbierta={ventanillaAbierta}
            onCambiarVentanilla={setVentanillaAbierta}
            firmaActiva={firmaActiva}
            onCambiarFirma={setFirmaActiva}
        />
    )
}
