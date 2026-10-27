import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { SndBoton } from '../snd'
import type { DireccionItem } from './TablaDireccion'

const OPCIONES_PAIS = [
  'México',
  'Estados Unidos',
  'Canadá',
  'Guatemala',
  'Belice',
  'Colombia',
  'Argentina',
  'Chile',
  'España',
  'Otro',
]

const ENTIDADES_FEDERATIVAS = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
].map((e) => ({ label: e, value: e }))

interface FormDireccionProps {
  calle: string
  onCalleChange: (value: string) => void
  numeroExterior: string
  onNumeroExteriorChange: (value: string) => void
  numeroInterior: string
  onNumeroInteriorChange: (value: string) => void
  codigoPostal: string
  onCodigoPostalChange: (value: string) => void
  colonia: string
  onColoniaChange: (value: string) => void
  pais: string
  onPaisChange: (value: string) => void
  entidadFederativa: string | null
  onEntidadFederativaChange: (value: string | null) => void
  municipioAlcaldia: string
  onMunicipioAlcaldiaChange: (value: string) => void
  nuevo?: boolean
  onSubmit?: (newDireccion: DireccionItem) => void
  onHandleSubmit?: (datos: { direccion: DireccionItem; seccionDireccionCompleta: boolean }) => void
  textoBoton?: string
  onSeccionCompletaChange?: (completa: boolean) => void
  onDatosChange?: (datos: DireccionItem) => void
}

export default function FormDireccion({
  calle,
  onCalleChange,
  numeroExterior,
  onNumeroExteriorChange,
  numeroInterior,
  onNumeroInteriorChange,
  codigoPostal,
  onCodigoPostalChange,
  colonia,
  onColoniaChange,
  pais,
  onPaisChange,
  entidadFederativa,
  onEntidadFederativaChange,
  municipioAlcaldia,
  onMunicipioAlcaldiaChange,
  nuevo,
  onSubmit,
  onHandleSubmit,
  textoBoton = 'Guardar dirección',
  onSeccionCompletaChange,
  onDatosChange,
}: FormDireccionProps) {
  const [intentoEnvio, setIntentoEnvio] = useState(false)

  const seccionDireccionCompleta = Boolean(
    codigoPostal.trim() &&
      calle.trim() &&
      numeroExterior.trim() &&
      colonia.trim() &&
      pais.trim() &&
      municipioAlcaldia.trim() &&
      entidadFederativa
  )

  useEffect(() => {
    if (onSeccionCompletaChange) {
      onSeccionCompletaChange(seccionDireccionCompleta)
    }
  }, [seccionDireccionCompleta, onSeccionCompletaChange])

  useEffect(() => {
    if (onDatosChange) {
      onDatosChange({
        calle: calle.trim(),
        numeroExterior: numeroExterior.trim(),
        numeroInterior: numeroInterior.trim(),
        codigoPostal: codigoPostal.trim(),
        colonia: colonia.trim(),
        municipioAlcaldia: municipioAlcaldia.trim(),
        entidadFederativa: entidadFederativa,
        pais: pais.trim(),
        referenciasDomicilio: '',
      })
    }
  }, [
    calle,
    numeroExterior,
    numeroInterior,
    codigoPostal,
    colonia,
    municipioAlcaldia,
    entidadFederativa,
    pais,
    onDatosChange,
  ])
  const validarForm = (): boolean => {
    return (
      calle.trim() !== '' &&
      numeroExterior.trim() !== '' &&
      codigoPostal.trim() !== '' &&
      colonia.trim() !== '' &&
      pais.trim() !== '' &&
      entidadFederativa !== null &&
      municipioAlcaldia.trim() !== ''
    )
  }

  // No auto-limpiar al render; la lógica de nuevo se maneja desde el padre

  const handleSubmit = () => {
    setIntentoEnvio(true)
    if (!seccionDireccionCompleta) {
      return
    }
    const newDireccion: DireccionItem = {
      calle: calle.trim(),
      numeroExterior: numeroExterior.trim(),
      numeroInterior: numeroInterior.trim(),
      codigoPostal: codigoPostal.trim(),
      colonia: colonia.trim(),
      pais: pais.trim(),
      entidadFederativa: entidadFederativa,
      municipioAlcaldia: municipioAlcaldia.trim(),
      referenciasDomicilio: '',
    }
    if (onHandleSubmit) {
      onHandleSubmit({ direccion: newDireccion, seccionDireccionCompleta: true })
      return
    }
    if (onSubmit) {
      onSubmit(newDireccion)
    }
  }
  return (
    <>
      <div className="padron-form-grid">
      <div className="campo padron-form-grid__col-2">
        <label htmlFor="dir-calle" className="b1sb">
          Calle o Avenida <span className="requerido">*</span>
        </label>
        <InputText
          id="dir-calle"
          value={calle}
          invalid={intentoEnvio && !calle.trim()}
          onChange={(e) => onCalleChange(e.target.value)}
          placeholder="Ej. Av. Insurgentes Sur"
        />
        {intentoEnvio && !calle.trim() && (
          <span className="campo__error">La calle o avenida es obligatoria.</span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="dir-num-ext" className="b1sb">
          Número Exterior <span className="requerido">*</span>
        </label>
        <InputText
          id="dir-num-ext"
          value={numeroExterior}
          invalid={intentoEnvio && !numeroExterior.trim()}
          onChange={(e) => onNumeroExteriorChange(e.target.value)}
          placeholder="Ej. 1735"
        />
        {intentoEnvio && !numeroExterior.trim() && (
          <span className="campo__error">Indica el número exterior o S/N.</span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="dir-num-int" className="b1sb">
          Número Interior / Depto.
        </label>
        <InputText
          id="dir-num-int"
          value={numeroInterior}
          onChange={(e) => onNumeroInteriorChange(e.target.value)}
          placeholder="Ej. Piso 4, Int. 402"
        />
      </div>

      <div className="campo">
        <label htmlFor="dir-cp" className="b1sb">
          Código Postal <span className="requerido">*</span>
        </label>
        <InputText
          id="dir-cp"
          maxLength={5}
          value={codigoPostal}
          invalid={intentoEnvio && !codigoPostal.trim()}
          onChange={(e) => onCodigoPostalChange(e.target.value.replace(/\D/g, ''))}
          placeholder="Ej. 01020"
        />
        {intentoEnvio && !codigoPostal.trim() && (
          <span className="campo__error">El código postal es obligatorio.</span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="dir-colonia" className="b1sb">
          Colonia<span className="requerido">*</span>
        </label>
        <InputText
          id="dir-colonia"
          value={colonia}
          invalid={intentoEnvio && !colonia.trim()}
          onChange={(e) => onColoniaChange(e.target.value)}
          placeholder="Ej. Guadalupe Inn"
        />
        {intentoEnvio && !colonia.trim() && (
          <span className="campo__error">La colonia es obligatoria.</span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="dir-pais" className="b1sb">
          País <span className="requerido">*</span>
        </label>
        <Dropdown
          inputId="dir-pais"
          options={OPCIONES_PAIS}
          value={pais}
          invalid={intentoEnvio && !pais.trim()}
          onChange={(e) => onPaisChange(e.value ?? '')}
          placeholder="Selecciona país"
          appendTo="self"
        />
        {intentoEnvio && !pais.trim() && (
          <span className="campo__error">El país es obligatorio.</span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="dir-entidad" className="b1sb">
          Estado<span className="requerido">*</span>
        </label>
        <Dropdown
          inputId="dir-entidad"
          options={ENTIDADES_FEDERATIVAS}
          value={entidadFederativa}
          onChange={(e) => onEntidadFederativaChange(e.value)}
          placeholder="Selecciona entidad"
          appendTo="self"
        />
      </div>

      <div className="campo">
        <label htmlFor="dir-municipio" className="b1sb">
          Municipio o Alcaldía <span className="requerido">*</span>
        </label>
        <InputText
          id="dir-municipio"
          value={municipioAlcaldia}
          invalid={intentoEnvio && !municipioAlcaldia.trim()}
          onChange={(e) => onMunicipioAlcaldiaChange(e.target.value)}
          placeholder="Ej. Álvaro Obregón"
        />
        {intentoEnvio && !municipioAlcaldia.trim() && (
          <span className="campo__error">El municipio o alcaldía es obligatorio.</span>
        )}
      </div>
      </div>
      <SndBoton type="button" onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        {textoBoton}
      </SndBoton>
    </>
  )
}
