import { useMemo } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndMensaje } from '../snd'
import { SeccionLista } from './SeccionLista'
import { TablaAcciones } from './TablaAcciones'
import { COLUMNAS_DIRECCION } from './TablaDireccion'
import { nuevoId } from '../../utils/cn'

/**
 * Modelo de una dirección del prestador. Antes vivía en `TablaDireccion.tsx`
 * (la tabla no debería ser dueña del tipo de dominio); se re-exporta desde ahí
 * para no romper los imports existentes.
 */
export interface DireccionItem {
  id?: string | number
  alias?: string
  calle: string
  numeroExterior: string
  numeroInterior?: string
  codigoPostal: string
  colonia: string
  municipioAlcaldia: string
  entidadFederativa: string | null
  pais: string
  referenciasDomicilio?: string
}

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

/** Dirección en blanco: el "schema" de lo que captura el formulario. */
export const DIRECCION_VACIA: DireccionItem = {
  alias: '',
  calle: '',
  numeroExterior: '',
  numeroInterior: '',
  codigoPostal: '',
  colonia: '',
  municipioAlcaldia: '',
  entidadFederativa: 'Ciudad de México',
  pais: 'México',
  referenciasDomicilio: '',
}

/** Campos que deben venir llenos para considerar la dirección completa. */
function validarDireccion(direccion: DireccionItem): string | null {
  const faltantes = (
    [
      ['alias', direccion.alias],
      ['calle', direccion.calle],
      ['número exterior', direccion.numeroExterior],
      ['código postal', direccion.codigoPostal],
      ['colonia', direccion.colonia],
      ['municipio o alcaldía', direccion.municipioAlcaldia],
      ['país', direccion.pais],
      ['estado', direccion.entidadFederativa],
    ] as const
  )
    .filter(([, valor]) => !String(valor ?? '').trim())
    .map(([nombre]) => nombre)

  if (faltantes.length === 0) return null
  return `Completa los campos obligatorios: ${faltantes.join(', ')}.`
}

function normalizarDireccion(direccion: DireccionItem): DireccionItem {
  return {
    ...direccion,
    alias: (direccion.alias ?? '').trim(),
    calle: direccion.calle.trim(),
    numeroExterior: direccion.numeroExterior.trim(),
    numeroInterior: (direccion.numeroInterior ?? '').trim(),
    codigoPostal: direccion.codigoPostal.trim(),
    colonia: direccion.colonia.trim(),
    municipioAlcaldia: direccion.municipioAlcaldia.trim(),
    pais: direccion.pais.trim(),
    referenciasDomicilio: (direccion.referenciasDomicilio ?? '').trim(),
  }
}

interface FormDireccionCamposProps {
  valores: DireccionItem
  onCambio: (cambios: Partial<DireccionItem>) => void
  intentoEnvio: boolean
  editar?: boolean
}

/**
 * Campos del formulario de dirección. Solo recibe el borrador y un notificador
 * de cambios parciales: no administra estado propio ni se acopla a quién lo
 * monta, por lo que se puede reutilizar en cualquier contenedor.
 */
export function FormDireccion({
  valores,
  onCambio,
  intentoEnvio,
  editar = false,
}: FormDireccionCamposProps) {
  const invalido = (campo: keyof DireccionItem) =>
    intentoEnvio && !String(valores[campo] ?? '').trim()

  return (
    <>
      {editar ? <SndMensaje tipo="info">Estás modificando una dirección.</SndMensaje> : <SndMensaje tipo="exito">Se va a agregar una nueva direccion</SndMensaje>}
      <div className="padron-form-grid" style={{ marginTop: '12px' }}>
        <div className="campo">
          <label htmlFor="dir-alias" className="b1sb">
            Alias <span className="requerido">*</span>
          </label>
          <InputText
            id="dir-alias"
            value={valores.alias ?? ''}
            invalid={invalido('alias')}
            onChange={(e) => onCambio({ alias: e.target.value })}
            placeholder="Ej. Casa, Oficina, Domicilio fiscal"
          />
          {invalido('alias') && (
            <span className="campo__error">
              El alias es obligatorio para identificar la dirección.
            </span>
          )}
        </div>

        <div className="campo">
          <label htmlFor="dir-calle" className="b1sb">
            Calle o Avenida <span className="requerido">*</span>
          </label>
          <InputText
            id="dir-calle"
            value={valores.calle}
            invalid={invalido('calle')}
            onChange={(e) => onCambio({ calle: e.target.value })}
            placeholder="Ej. Av. Insurgentes Sur"
          />
          {invalido('calle') && (
            <span className="campo__error">La calle o avenida es obligatoria.</span>
          )}
        </div>

        <div className="campo">
          <label htmlFor="dir-num-ext" className="b1sb">
            Número Exterior <span className="requerido">*</span>
          </label>
          <InputText
            id="dir-num-ext"
            value={valores.numeroExterior}
            invalid={invalido('numeroExterior')}
            onChange={(e) => onCambio({ numeroExterior: e.target.value })}
            placeholder="Ej. 1735"
          />
          {invalido('numeroExterior') && (
            <span className="campo__error">Indica el número exterior o S/N.</span>
          )}
        </div>

        <div className="campo">
          <label htmlFor="dir-num-int" className="b1sb">
            Número Interior / Depto.
          </label>
          <InputText
            id="dir-num-int"
            value={valores.numeroInterior ?? ''}
            onChange={(e) => onCambio({ numeroInterior: e.target.value })}
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
            value={valores.codigoPostal}
            invalid={invalido('codigoPostal')}
            onChange={(e) => onCambio({ codigoPostal: e.target.value.replace(/\D/g, '') })}
            placeholder="Ej. 01020"
          />
          {invalido('codigoPostal') && (
            <span className="campo__error">El código postal es obligatorio.</span>
          )}
        </div>

        <div className="campo">
          <label htmlFor="dir-colonia" className="b1sb">
            Colonia <span className="requerido">*</span>
          </label>
          <InputText
            id="dir-colonia"
            value={valores.colonia}
            invalid={invalido('colonia')}
            onChange={(e) => onCambio({ colonia: e.target.value })}
            placeholder="Ej. Guadalupe Inn"
          />
          {invalido('colonia') && (
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
            value={valores.pais}
            invalid={invalido('pais')}
            onChange={(e) => onCambio({ pais: e.value ?? '' })}
            placeholder="Selecciona país"
            appendTo="self"
          />
          {invalido('pais') && <span className="campo__error">El país es obligatorio.</span>}
        </div>

        <div className="campo">
          <label htmlFor="dir-entidad" className="b1sb">
            Estado <span className="requerido">*</span>
          </label>
          <Dropdown
            inputId="dir-entidad"
            options={ENTIDADES_FEDERATIVAS}
            value={valores.entidadFederativa}
            invalid={invalido('entidadFederativa')}
            onChange={(e) => onCambio({ entidadFederativa: e.value })}
            placeholder="Selecciona entidad"
            appendTo="self"
          />
          {invalido('entidadFederativa') && (
            <span className="campo__error">El estado es obligatorio.</span>
          )}
        </div>

        <div className="campo">
          <label htmlFor="dir-municipio" className="b1sb">
            Municipio o Alcaldía <span className="requerido">*</span>
          </label>
          <InputText
            id="dir-municipio"
            value={valores.municipioAlcaldia}
            invalid={invalido('municipioAlcaldia')}
            onChange={(e) => onCambio({ municipioAlcaldia: e.target.value })}
            placeholder="Ej. Álvaro Obregón"
          />
          {invalido('municipioAlcaldia') && (
            <span className="campo__error">El municipio o alcaldía es obligatorio.</span>
          )}
        </div>

        <div className="campo padron-form-grid__col-3">
          <label htmlFor="dir-referencias" className="b1sb">
            Referencias del domicilio
          </label>
          <InputText
            id="dir-referencias"
            value={valores.referenciasDomicilio ?? ''}
            onChange={(e) => onCambio({ referenciasDomicilio: e.target.value })}
            placeholder="Ej. Frente al parque, portón negro"
          />
        </div>
      </div>
    </>
  )
}

/** Tabla de direcciones registradas. */
function TablaDireccion({
  direcciones,
  onEditar,
  onEliminar,
}: {
  direcciones: readonly DireccionItem[]
  onEditar: (indice: number) => void
  onEliminar: (indice: number) => void
}) {
  return (
    <TablaAcciones
      filas={direcciones}
      columnas={COLUMNAS_DIRECCION}
      vacia="No hay direcciones registradas."
      onEditar={onEditar}
      onEliminar={onEliminar}
      textoEditar="Editar dirección"
      textoEliminar="Eliminar dirección"
    />
  )
}

export interface SeccionDireccionProps {
  direcciones: DireccionItem[]
  onDireccionesChange: (direcciones: DireccionItem[]) => void
  /** Se invoca cada vez que se guarda una dirección (alta o actualización). */
  onGuardarDireccion?: (direccion: DireccionItem) => void
  /** Si se entrega, aparece el botón "Siguiente" al pie de la tabla. */
  onSiguiente?: () => void
  /** Estado del botón "Siguiente"; por defecto, basta con tener direcciones. */
  seccionDireccionCompleta?: boolean
}

/**
 * Sección "Dirección" del padrón: maestro-detalle de direcciones.
 *
 * Antes tenía 11 `useState` sueltos que nadie de fuera podía consultar. Ahora el
 * estado de modo + borrador vive en `SeccionLista`, y aquí solo quedan las
 * piezas de dominio: tipo, validación y pintado.
 */
export function SeccionDireccion({
  direcciones,
  onDireccionesChange,
  onGuardarDireccion,
  onSiguiente,
  seccionDireccionCompleta = direcciones.length > 0,
}: SeccionDireccionProps) {
  const inicial = useMemo(() => () => ({ ...DIRECCION_VACIA }), [])

  return (
    <SeccionLista<DireccionItem>
      filas={direcciones}
      onCambio={onDireccionesChange}
      inicial={inicial}
      entidad="dirección"
      validar={(borrador) => validarDireccion(borrador)}
      asignarId={(borrador, filas, indice) => ({
        ...normalizarDireccion(borrador),
        id: indice !== null ? filas[indice]?.id : nuevoId('dir'),
      })}
      onGuardar={(direccion) => onGuardarDireccion?.(direccion)}
      textos={{
        nuevo: 'Agregar otra dirección',
        guardar: 'Guardar dirección',
        actualizar: 'Actualizar dirección',
      }}
      renderFormulario={({ valores, onCambio, editar, intentoEnvio }) => (
        <FormDireccion
          valores={valores}
          onCambio={onCambio}
          intentoEnvio={intentoEnvio}
          editar={editar}
        />
      )}
      renderTabla={({ filas, onEditar, onEliminar }) => (
        <TablaDireccion direcciones={filas} onEditar={onEditar} onEliminar={onEliminar} />
      )}
      extraTabla={
        onSiguiente && (
          <SndBoton
            type="button"
            variante="secundario"
            onClick={() => seccionDireccionCompleta && onSiguiente()}
            disabled={!seccionDireccionCompleta}
          >
            Siguiente
          </SndBoton>
        )
      }
    />
  )
}

export default SeccionDireccion
