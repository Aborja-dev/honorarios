import { useCallback, useState, type ReactNode } from 'react'
import { SndBoton } from '../snd'

/**
 * Núcleo maestro-detalle de las secciones del padrón.
 *
 * Problema que resuelve: cada sección (dirección, escolaridad, experiencia…)
 * repetía la misma danza de estado —"¿estoy en tabla o en formulario?", "¿qué
 * renglón estoy editando?", "¿qué tengo a medio capturar?"— y esa danza era lo
 * único que obligaba al padre a pasar props a través de todos los niveles.
 *
 * Con este componente el estado queda **encerrado aquí**:
 *
 *   tabla  ──"Nuevo"──►  formulario (modo insertar)  ──guardar──►  tabla
 *   tabla  ──"Editar"─►  formulario (modo editar)    ──guardar──►  tabla
 *
 * El padre solo entrega `filas` + `onCambio` y dos funciones de pintado
 * (`renderTabla`, `renderFormulario`). No necesita saber en qué modo está cada
 * sección ni quién se está editando: deja de haber *prop drilling*.
 *
 * Al ser genérico, la misma implementación sirve para cualquier dominio. Lo
 * específico de cada sección (columnas, campos, textos, validación) llega como
 * datos o como slots, no está quemado dentro.
 */

/**
 * Restricción deliberadamente laxa: acepta `DireccionItem`,
 * `EscolaridadItem`, etc. sin exigir una propiedad común, porque
 * `{ [clave: string]: unknown }` rechaza interfaces sin índice implícito.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fila = any

/** Qué está mostrando la sección. */
export type ModoSeccion = 'tabla' | 'formulario'

export interface BorradorDeSeccion<T> {
  /** Valores actuales del formulario. */
  valores: T
  /** Índice del renglón en edición, o `null` si se está capturando uno nuevo. */
  indice: number | null
  /** `true` cuando `indice` apunta a un renglón existente. */
  editar: boolean
}

export interface SeccionListaProps<T extends Fila = Fila> {
  /** Renglones que se muestran en la tabla. Es propiedad del padre. */
  filas: readonly T[]
  /** Notifica el nuevo arreglo completo cuando se guarda o se elimina. */
  onCambio: (filas: T[]) => void
  /** Valores de un formulario en blanco. Puede ser una función para copiar limpia. */
  inicial: T | (() => T)
  /** Nombre legible de la entidad, solo para los textos accesibles por defecto. */
  entidad?: string
  /** Textos de los botones. Todos opcionales: tienen comportamiento por defecto. */
  textos?: {
    /** Botón que abre el formulario en blanco. `null` lo oculta. */
    nuevo?: ReactNode
    /** Botón de guardar dentro del formulario. */
    guardar?: ReactNode
    /** Botón de guardar mientras se edita un renglón existente. */
    actualizar?: ReactNode
    /** Botón para salir del formulario sin guardar. */
    cancelar?: ReactNode
  }
  /**
   * Validación del borrador. Si devuelve un mensaje, no se guarda y se muestra
   * como error. El formulario recibe el mismo `intentoEnvio` para marcar campos.
   */
  validar?: (borrador: T, indice: number | null) => string | null
  /** Fuerza la creación de `id` para renglones nuevos (por ejemplo autoincremental). */
  asignarId?: (borrador: T, filas: readonly T[], indice: number | null) => T
  /** Se dispara después de cada guardado exitoso. */
  onGuardar?: (guardado: T, edicion: boolean) => void
  /** Se dispara después de eliminar un renglón. */
  onEliminar?: (indice: number, filas: readonly T[]) => void
  /** Se dispara al pulsar "Cancelar" o al terminar una edición. */
  onCancelar?: () => void
  /**
   * Índice inicial deseado para editar (útil en modo controlado). Si es `null`,
   * la sección arranca en tabla.
   */
  indiceInicial?: number | null
  /** Pinta la tabla. La sección solo la monta cuando el modo es `tabla`. */
  renderTabla: (props: {
    filas: readonly T[]
    onEditar: (indice: number) => void
    onEliminar: (indice: number) => void
  }) => ReactNode
  /**
   * Pinta el formulario. `onCambio` está tipado sobre el borrador completo; la
   * sección se encarga de fusionar cambios parciales.
   */
  renderFormulario: (props: {
    valores: T
    onCambio: (cambios: Partial<T>) => void
    onReemplazar: (valores: T) => void
    guardar: () => void
    cancelar: () => void
    editar: boolean
    indice: number | null
    intentoEnvio: boolean
    error: string | null
  }) => ReactNode
  /** Elementos que se pintan junto a la tabla (por ejemplo, botones de navegación). */
  extraTabla?: ReactNode
  /** Elementos que se pintan debajo del formulario (por ejemplo, "siguiente"). */
  extraFormulario?: ReactNode
}

/** Clona los valores para que el borrador nunca mute lo que vive en `filas`. */
function clonar<T>(valores: T): T {
  if (Array.isArray(valores)) return [...valores] as unknown as T
  if (valores && typeof valores === 'object') return { ...valores }
  return valores
}

function resolverInicial<T>(inicial: T | (() => T)): T {
  return clonar(typeof inicial === 'function' ? (inicial as () => T)() : inicial)
}

export function SeccionLista<T extends Fila = Fila>({
  filas,
  onCambio,
  inicial,
  entidad = 'registro',
  textos,
  validar,
  asignarId,
  onGuardar,
  onEliminar,
  onCancelar,
  indiceInicial = null,
  renderTabla,
  renderFormulario,
  extraTabla,
  extraFormulario,
}: SeccionListaProps<T>) {
  const [modo, setModo] = useState<ModoSeccion>(indiceInicial === null ? 'tabla' : 'formulario')
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(indiceInicial)
  const [borrador, setBorrador] = useState<T>(() => {
    if (indiceInicial !== null && indiceInicial < filas.length) return clonar(filas[indiceInicial])
    return resolverInicial(inicial)
  })
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Fusiona cambios parciales en el borrador (lo normal desde un formulario). */
  const onCambioBorrador = useCallback((cambios: Partial<T>) => {
    setBorrador((actual) => ({ ...(actual as object), ...(cambios as object) }) as T)
  }, [])

  /** Reemplaza el borrador completo (por ejemplo, al cargar datos de una API). */
  const onReemplazarBorrador = useCallback((valores: T) => {
    setBorrador(clonar(valores))
  }, [])

  /** Vuelve al modo tabla y limpia la edición pendiente. */
  const volverATabla = useCallback(() => {
    setModo('tabla')
    setIndiceEdicion(null)
    setError(null)
    setIntentoEnvio(false)
    setBorrador(resolverInicial(inicial))
  }, [inicial])

  /** Abre el formulario en blanco. */
  const abrirNuevo = useCallback(() => {
    setBorrador(resolverInicial(inicial))
    setIndiceEdicion(null)
    setError(null)
    setIntentoEnvio(false)
    setModo('formulario')
  }, [inicial])

  /** Abre el formulario cargado con el renglón `indice`. */
  const abrirEdicion = useCallback(
    (indice: number) => {
      const fila = filas[indice]
      if (fila === undefined) return
      setBorrador(clonar(fila))
      setIndiceEdicion(indice)
      setError(null)
      setIntentoEnvio(false)
      setModo('formulario')
    },
    [filas],
  )

  /** Cancela la captura en curso. */
  const cancelar = useCallback(() => {
    volverATabla()
    onCancelar?.()
  }, [volverATabla, onCancelar])

  /** Valida y aplica el borrador sobre `filas`. */
  const guardar = useCallback(() => {
    setIntentoEnvio(true)
    const mensaje = validar ? validar(borrador, indiceEdicion) : null
    if (mensaje) {
      setError(mensaje)
      return
    }

    const conId = asignarId ? asignarId(borrador, filas, indiceEdicion) : borrador
    const siguiente = [...filas]
    if (indiceEdicion !== null) {
      siguiente[indiceEdicion] = clonar(conId)
    } else {
      siguiente.push(clonar(conId))
    }

    onCambio(siguiente)
    onGuardar?.(clonar(conId), indiceEdicion !== null)
    volverATabla()
  }, [asignarId, borrador, filas, indiceEdicion, onCambio, onGuardar, validar, volverATabla])

  /** Elimina el renglón `indice` y corrige la edición en curso si apuntaba ahí. */
  const eliminar = useCallback(
    (indice: number) => {
      const siguiente = filas.filter((_, i) => i !== indice)
      onCambio(siguiente)
      onEliminar?.(indice, siguiente)

      if (indiceEdicion === null) return
      if (indiceEdicion === indice) {
        // El renglón editado desapareció: se descarta la captura.
        volverATabla()
      } else if (indiceEdicion > indice) {
        const nuevoIndice = indiceEdicion - 1
        setIndiceEdicion(nuevoIndice)
        setBorrador(clonar(siguiente[nuevoIndice]))
      }
    },
    [filas, indiceEdicion, onCambio, onEliminar, volverATabla],
  )

  if (modo === 'formulario') {
    return (
      <>
        {renderFormulario({
          valores: borrador,
          onCambio: onCambioBorrador,
          onReemplazar: onReemplazarBorrador,
          guardar,
          cancelar,
          editar: indiceEdicion !== null,
          indice: indiceEdicion,
          intentoEnvio,
          error,
        })}
        {error && <p className="campo__error">{error}</p>}
        <div className="fila" style={{ marginTop: '1rem' }}>
          <SndBoton
            type="button"
            onClick={guardar}
            aria-label={
              indiceEdicion !== null
                ? `Actualizar ${entidad}`
                : `Guardar ${entidad}`
            }
          >
            {indiceEdicion !== null
              ? (textos?.actualizar ?? 'Guardar cambios')
              : (textos?.guardar ?? 'Guardar')}
          </SndBoton>
          <SndBoton variante="secundario" type="button" onClick={cancelar}>
            {textos?.cancelar ?? 'Cancelar'}
          </SndBoton>
        </div>
        {extraFormulario}
      </>
    )
  }

  const botonNuevo = textos?.nuevo === null ? null : (
    <SndBoton type="button" onClick={abrirNuevo}>
      {textos?.nuevo ?? `Agregar ${entidad}`}
    </SndBoton>
  )

  return (
    <>
      {renderTabla({ filas, onEditar: abrirEdicion, onEliminar: eliminar })}
      {(botonNuevo || extraTabla) && (
        <div className="fila" style={{ marginTop: '1rem' }}>
          {botonNuevo}
          {extraTabla}
        </div>
      )}
    </>
  )
}

export default SeccionLista
