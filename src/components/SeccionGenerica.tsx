import { useCallback, useState, type ReactNode } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { TablaAcciones } from './TablaAcciones'
import { SndBoton, SndIcono, SndMensaje } from './snd'
import { nuevoId } from '../utils/cn'

/**
 * Sección genérica de captura maestro-detalle, **autocontenida**.
 *
 * Mismo comportamiento que la sección de Dirección —tabla con Editar/Eliminar,
 * botón "nuevo", formulario que sustituye a la tabla, validación y borrado con
 * corrección de índices— pero sin reutilizar `SeccionLista` ni el resto de la
 * lógica nueva: el estado vive aquí, en 4 `useState`, y lo que cambia entre
 * secciones se entrega como datos (`campos` + `columnas`).
 *
 * Se usa para Escolaridad y para cualquier otra sección plana.
 */

export type TipoCampo = 'texto' | 'area' | 'opcion'

export interface CampoDef {
  /** Propiedad del modelo que edita el campo. */
  clave: string
  etiqueta: string
  tipo?: TipoCampo
  /** Para `tipo: 'opcion'`: valores seleccionables. */
  opciones?: { label: string; value: string }[]
  /** Ancho en la rejilla de 3 columnas (`.padron-form-grid`). */
  ancho?: 1 | 2 | 3
  /** Exige un valor para guardar y muestra el asterisco. */
  requerido?: boolean
  placeholder?: string
  maxLength?: number
  /** Solo admite dígitos al escribir (cédulas, años). */
  soloDigitos?: boolean
  /** Mensaje cuando `requerido` no está lleno. */
  mensajeError?: string
}

export interface ColumnaDef {
  encabezado: string
  /** Render de la celda. Si se omite, se pinta `String(fila[clave])`. */
  valor?: (fila: Fila, indice: number) => ReactNode
  /** Propiedad de la fila a mostrar cuando no hay `valor`. */
  clave?: string
}

/** Renglón genérico: una sección puede tener las claves que quiera. */
export type Fila = Record<string, unknown>

/** Renglón de escolaridad, para tipar la lista que controla la página. */
export type FilaEscolaridad = Fila

export interface SeccionGenericaProps {
  /** Registros controlados desde el padre. Si se omite, la sección es dueña. */
  registros?: Fila[]
  onRegistrosChange?: (registros: Fila[]) => void
  /** Datos con los que arranca cuando no está controlada. */
  datosEjemplo?: Fila[]
  campos: CampoDef[]
  columnas: ColumnaDef[]
  /** Valores de un formulario en blanco. */
  inicial: Fila
  /** Texto cuando la tabla está vacía. */
  vacia: string
  /** Textos de los botones ("Guardar escolaridad", "Escolaridad nueva"…). */
  textos?: { nuevo?: string; guardar?: string; actualizar?: string }
  /** Prefijo de los `id` de los campos para no colisionar entre secciones. */
  prefijoId: string
  /** Se dispara al pulsar "Siguiente" en el pie de la tabla. */
  onSiguiente?: () => void
  /** Se dispara al guardar (alta o actualización), con el renglón resultante. */
  onGuardar?: (fila: Fila, edicion: boolean) => void
}

/** Valor textual de un campo, sea texto o selección. */
function texto(valor: unknown): string {
  return valor === null || valor === undefined ? '' : String(valor)
}

/**
 * Deduce el nombre de la entidad a partir de la etiqueta del botón "nuevo":
 * "Escolaridad nueva" → `escolaridad`; "Agregar registro" → `registro`.
 */
function entidadDeSeccion(botonNuevo?: string): string {
  if (!botonNuevo) return 'registro'
  return botonNuevo
    .replace(/^agregar\s+/i, '')
    .replace(/\s+nuev[ao]$/i, '')
    .trim()
    .toLowerCase()
}

/**
 * Sección de configuración con estado propio.
 *
 * Estado que mantiene (el mismo que necesita el maestro-detalle):
 * - `registrosLocales`: los renglones cuando el padre no los controla.
 * - `enFormulario`: qué vista se pinta.
 * - `indiceEdicion`: `null` = alta; número = actualización.
 * - `borrador`: valores a medio capturar.
 * - `intentoEnvio`: para marcar los obligatorios vacíos.
 */
export function SeccionGenerica({
  registros,
  onRegistrosChange,
  datosEjemplo = [],
  campos,
  columnas,
  inicial,
  vacia,
  textos,
  prefijoId,
  onSiguiente,
  onGuardar,
}: SeccionGenericaProps) {
  /* ---------------------------------- estado ---------------------------------- */

  const controlada = registros !== undefined

  const [locales, setLocales] = useState<Fila[]>(() =>
    datosEjemplo.map((fila) => ({ ...fila })),
  )
  const [enFormulario, setEnFormulario] = useState(false)
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null)
  const [borrador, setBorrador] = useState<Fila>(() => ({ ...inicial }))
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filas = controlada ? registros : locales
  const cambiarFilas = useCallback(
    (nuevas: Fila[]) => {
      if (controlada) onRegistrosChange?.(nuevas)
      else setLocales(nuevas)
    },
    [controlada, onRegistrosChange],
  )

  /* -------------------------------- acciones -------------------------------- */

  /** Abre el formulario en blanco. */
  const abrirNuevo = () => {
    setBorrador({ ...inicial })
    setIndiceEdicion(null)
    setIntentoEnvio(false)
    setError(null)
    setEnFormulario(true)
  }

  /** Abre el formulario con los datos del renglón `indice`. */
  const abrirEdicion = (indice: number) => {
    const fila = filas[indice]
    if (!fila) return
    setBorrador({ ...fila })
    setIndiceEdicion(indice)
    setIntentoEnvio(false)
    setError(null)
    setEnFormulario(true)
  }

  /** Vuelve a la tabla descartando la captura. */
  const cancelar = () => {
    setBorrador({ ...inicial })
    setIndiceEdicion(null)
    setIntentoEnvio(false)
    setError(null)
    setEnFormulario(false)
  }

  /** Valida y aplica el borrador (alta o actualización). */
  const guardar = () => {
    setIntentoEnvio(true)

    const faltante = campos.find(
      (campo) => campo.requerido && !texto(borrador[campo.clave]).trim(),
    )
    if (faltante) {
      setError(faltante.mensajeError ?? `El campo “${faltante.etiqueta}” es obligatorio.`)
      return
    }

    // Se recortan los textos y se conserva el id del renglón editado.
    const limpio: Fila = { ...borrador }
    for (const campo of campos) {
      const valor = limpio[campo.clave]
      if (typeof valor === 'string') limpio[campo.clave] = valor.trim()
    }
    if (indiceEdicion === null) {
      if (limpio.id === undefined) limpio.id = nuevoId(prefijoId)
      cambiarFilas([...filas, limpio])
    } else {
      limpio.id = filas[indiceEdicion]?.id ?? limpio.id
      const nuevas = [...filas]
      nuevas[indiceEdicion] = limpio
      cambiarFilas(nuevas)
    }

    onGuardar?.(limpio, indiceEdicion !== null)
    cancelar()
  }

  /** Elimina el renglón y corrige el índice de la edición en curso. */
  const eliminar = (indice: number) => {
    const nuevas = filas.filter((_, i) => i !== indice)
    cambiarFilas(nuevas)
    if (indiceEdicion === null) return
    if (indiceEdicion === indice) {
      cancelar()
    } else if (indiceEdicion > indice) {
      const nuevoIndice = indiceEdicion - 1
      setIndiceEdicion(nuevoIndice)
      setBorrador({ ...nuevas[nuevoIndice] })
    }
  }

  /** Cambio de un campo del borrador. */
  const cambiar = (clave: string, valor: unknown) => {
    setBorrador((actual) => ({ ...actual, [clave]: valor }))
    setError(null)
  }

  /* --------------------------------- render --------------------------------- */

  if (enFormulario) {
    const editando = indiceEdicion !== null
    /* Nombre de la entidad para el aviso: se deduce del botón "nuevo"
       ("Escolaridad nueva" → "escolaridad") para no pedir otra prop. */
    const entidad = entidadDeSeccion(textos?.nuevo)
    return (
      <>
        {/* Aviso de alta/edición: el texto sale de `textos.guardar` para que
            cada sección diga lo suyo (escolaridad, idiomas…) y no "experiencia". */}
        {editando ? (
          <SndMensaje tipo="info">Estás modificando una {entidad}.</SndMensaje>
        ) : (
          <SndMensaje tipo="exito">Se va a agregar una nueva {entidad}.</SndMensaje>
        )}
        <div className="padron-form-grid">
          {campos.map((campo) => {
            const id = `${prefijoId}-${campo.clave}`
            const valor = texto(borrador[campo.clave])
            const invalido = intentoEnvio && campo.requerido && !valor.trim()
            const ancho =
              campo.ancho === 2
                ? 'campo padron-form-grid__col-2'
                : campo.ancho === 3
                  ? 'campo padron-form-grid__col-3'
                  : 'campo'
            return (
              <div className={ancho} key={campo.clave}>
                <label htmlFor={id} className="b1sb">
                  {campo.etiqueta} {campo.requerido && <span className="requerido">*</span>}
                </label>
                {campo.tipo === 'opcion' ? (
                  <Dropdown
                    inputId={id}
                    options={campo.opciones ?? []}
                    value={borrador[campo.clave] ?? null}
                    invalid={invalido}
                    onChange={(e) => cambiar(campo.clave, e.value)}
                    placeholder={campo.placeholder}
                    appendTo="self"
                  />
                ) : campo.tipo === 'area' ? (
                  <textarea
                    id={id}
                    className={`padron-textarea ${invalido ? 'padron-textarea--invalido' : ''}`}
                    value={valor}
                    onChange={(e) => cambiar(campo.clave, e.target.value)}
                    placeholder={campo.placeholder}
                  />
                ) : (
                  <InputText
                    id={id}
                    value={valor}
                    maxLength={campo.maxLength}
                    invalid={invalido}
                    onChange={(e) =>
                      cambiar(
                        campo.clave,
                        campo.soloDigitos ? e.target.value.replace(/\D/g, '') : e.target.value,
                      )
                    }
                    placeholder={campo.placeholder}
                  />
                )}
                {invalido && (
                  <span className="campo__error">
                    {campo.mensajeError ?? `El campo “${campo.etiqueta}” es obligatorio.`}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {error && <p className="campo__error">{error}</p>}

        <div className="fila" style={{ marginTop: '1rem' }}>
          <SndBoton type="button" onClick={guardar}>
            {editando
              ? (textos?.actualizar ?? 'Guardar cambios')
              : (textos?.guardar ?? 'Guardar')}
          </SndBoton>
          <SndBoton variante="secundario" type="button" onClick={cancelar}>
            Cancelar
          </SndBoton>
        </div>
      </>
    )
  }

  return (
    <>
      <TablaAcciones
        filas={filas}
        columnas={columnas.map((columna) => ({
          encabezado: columna.encabezado,
          celda: (fila: Fila, indice: number) =>
            columna.valor
              ? columna.valor(fila, indice)
              : columna.clave
                ? texto(fila[columna.clave]) || '-'
                : '-',
        }))}
        vacia={vacia}
        anchoMinimo={`${Math.max(columnas.length * 10, 40)}rem`}
        onEditar={abrirEdicion}
        onEliminar={eliminar}
      />

      <div className="fila" style={{ marginTop: '1rem' }}>
        <SndBoton type="button" onClick={abrirNuevo}>
          {textos?.nuevo ?? 'Agregar registro'}
        </SndBoton>
        {onSiguiente && (
          <SndBoton variante="secundario" type="button" onClick={onSiguiente}>
            <SndIcono nombre="snd-save" tamano={18} />
            Guardar
          </SndBoton>
        )}
      </div>
    </>
  )
}

export default SeccionGenerica
