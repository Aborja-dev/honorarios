import { useState } from 'react'

import TablaDireccion, { type DireccionItem } from './TablaDireccion'
import { ToggleTabla } from './ToogleTabla'
import { SndBoton } from '../snd'
import FormDireccion from './FormDireccion'

interface SeccionDireccionProps {
  intentoEnvio: boolean
  direcciones: DireccionItem[]
  onDireccionesChange: (direcciones: DireccionItem[]) => void
  seccionDireccionCompleta: boolean
  onGuardarDireccion?: () => void
  onSiguiente?: () => void
}

export default function SeccionDireccion({
  intentoEnvio,
  direcciones,
  onDireccionesChange,
  seccionDireccionCompleta,
  onGuardarDireccion,
  onSiguiente,
}: SeccionDireccionProps) {
  const [showDireccion, setShowDireccion] = useState(true)
  const [codigoPostal, setCodigoPostal] = useState('')
  const [calle, setCalle] = useState('')
  const [numeroExterior, setNumeroExterior] = useState('')
  const [numeroInterior, setNumeroInterior] = useState('')
  const [colonia, setColonia] = useState('')
  const [pais, setPais] = useState('México')
  const [municipioAlcaldia, setMunicipioAlcaldia] = useState('')
  const [entidadFederativa, setEntidadFederativa] = useState<string | null>('Ciudad de México')
  const [referenciasDomicilio, setReferenciasDomicilio] = useState('')
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null)

  const handleDireccionCompleto = (direccionValidada?: DireccionItem) => {
    const direccion: DireccionItem = direccionValidada
      ? {
          ...direccionValidada,
          id: indiceEdicion !== null ? direcciones[indiceEdicion]?.id : direccionValidada.id,
        }
      : {
          id: indiceEdicion !== null ? direcciones[indiceEdicion]?.id : undefined,
          calle,
          numeroExterior,
          numeroInterior,
          codigoPostal,
          colonia,
          municipioAlcaldia,
          entidadFederativa,
          pais,
          referenciasDomicilio,
        }

    if (indiceEdicion !== null) {
      const nuevasDirecciones = [...direcciones]
      nuevasDirecciones[indiceEdicion] = direccion
      onDireccionesChange(nuevasDirecciones)
      setIndiceEdicion(null)
    } else {
      onDireccionesChange([...direcciones, direccion])
    }

    setShowDireccion(true)
    if (onGuardarDireccion) {
      onGuardarDireccion()
    }
  }

  const clearDirecciones = () => {
    setCodigoPostal('')
    setCalle('')
    setNumeroExterior('')
    setNumeroInterior('')
    setColonia('')
    setPais('México')
    setMunicipioAlcaldia('')
    setEntidadFederativa('Ciudad de México')
    setReferenciasDomicilio('')
    setIndiceEdicion(null)
  }

  const handleEditar = (direccion: DireccionItem, index: number) => {
    setCalle(direccion.calle || '')
    setNumeroExterior(direccion.numeroExterior || '')
    setNumeroInterior(direccion.numeroInterior || '')
    setCodigoPostal(direccion.codigoPostal || '')
    setColonia(direccion.colonia || '')
    setMunicipioAlcaldia(direccion.municipioAlcaldia || '')
    setEntidadFederativa(direccion.entidadFederativa ?? 'Ciudad de México')
    setPais(direccion.pais || 'México')
    setReferenciasDomicilio(direccion.referenciasDomicilio || '')
    setIndiceEdicion(index)
    setShowDireccion(false)
  }

  const handleEliminar = (index: number) => {
    const nuevasDirecciones = direcciones.filter((_, i) => i !== index)
    onDireccionesChange(nuevasDirecciones)
    if (indiceEdicion === index) {
      clearDirecciones()
      setShowDireccion(true)
    } else if (indiceEdicion !== null && indiceEdicion > index) {
      setIndiceEdicion(indiceEdicion - 1)
    }
  }

  return (
    <>
      <ToggleTabla
        tabla={
          <TablaDireccion
            direcciones={direcciones}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        }
        showTable={showDireccion}
      >
        <FormDireccion
          calle={calle}
          onCalleChange={setCalle}
          numeroExterior={numeroExterior}
          onNumeroExteriorChange={setNumeroExterior}
          numeroInterior={numeroInterior}
          onNumeroInteriorChange={setNumeroInterior}
          codigoPostal={codigoPostal}
          onCodigoPostalChange={setCodigoPostal}
          colonia={colonia}
          onColoniaChange={setColonia}
          pais={pais}
          onPaisChange={setPais}
          entidadFederativa={entidadFederativa}
          onEntidadFederativaChange={setEntidadFederativa}
          municipioAlcaldia={municipioAlcaldia}
          onMunicipioAlcaldiaChange={setMunicipioAlcaldia}
          nuevo={false}
          onHandleSubmit={({ direccion }) => {
            handleDireccionCompleto(direccion)
          }}
          textoBoton={indiceEdicion !== null ? 'Actualizar dirección' : 'Guardar dirección'}
        />
      </ToggleTabla>
      {showDireccion && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SndBoton
            type="button"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              clearDirecciones()
              setShowDireccion(false)
            }}
          >
            Agregar otra dirección
          </SndBoton>
          {onSiguiente && (
            <SndBoton
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                if (seccionDireccionCompleta && onSiguiente) {
                  onSiguiente()
                }
              }}
            >
              Siguiente
            </SndBoton>
          )}
        </div>
      )}
    </>
  )
}
