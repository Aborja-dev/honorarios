import React from 'react'
import { SndBotonEnlace, SndIcono } from '../components'

export const BotonHome = () => {
    return (
        <SndBotonEnlace variante="secundario" to="/">
            <span><SndIcono nombre="snd-home" tamano={18} /></span>Menu principal
        </SndBotonEnlace>
    )
}

