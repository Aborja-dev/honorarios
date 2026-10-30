import { useState, type ReactNode } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { TablaAcciones } from './TablaAcciones'
import { SeccionLista } from './SeccionLista'
import { SndBoton } from '../snd'
import { nuevoId } from '../../utils/cn'

/**
 * Sección genérica de captura "maestra-detalle": un formulario plano (sin
 * registros anidados como las direcciones) que se guarda como un renglón de la
 * tabla de la sección.
 *
 * Su razón de existir es la regla de oro del proyecto: si dos secciones cambian
 * por la misma razón y tienen la misma forma, comparten *un* componente; lo que
 * cambia entre ellas se entrega como datos (`campos`, `columnas`, `inicial`).
 * Así, añadir un campo a escolaridad es una línea de configuración y no un
 * cambio en tres archivos.
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
  /** Solo admite dígitos al escribir (cédulas, años, años de experiencia). */
  soloDigitos?: boolean
  /** Mensaje cuando `requerido` no está lleno. */
  mensajeError?: string
}

export interface ColumnaDef {
  encabezado: string
  /**
   * Render de la celda. Recibe la fila y el índice. Si se omite, se pinta
   * `fila[clave]`.
   */
  valor?: (fila: Record<string, unknown>, indice: number) => ReactNode
  /** Propiedad de la fila a mostrar cuando no hay `valor`. */
  clave?: string
}

export interface SeccionGenericaProps {
  /**
   * Registros de la sección. Si no se entrega y sí `datosEjemplo`, se gestiona
   * una copia local (útil en pantallas todavía demostrativas).
   */
  registros?: Record<string, unknown>[]
  onRegistrosChange?: (registros: Record<string, unknown>[]) => void
  /** Datos de demostración. Se copian en el estado local inicial. */
  datosEjemplo?: Record<string, unknown>[]
  campos: CampoDef[]
  columnas: ColumnaDef[]
  /** Valores de un formulario en blanco. */
  inicial: Record<string, unknown>
  /** Texto cuando la tabla está vacía. */
  vacia: string
  /** Textos de los botones ("Guardar escolaridad", "Experiencia nueva"…). */
  textos?: { nuevo?: string; guardar?: string; actualizar?: string }
  /** Prefijo de los `id` de los campos para no colisionar entre secciones. */
  prefijoId: string
  /** Se dispara al pulsar "Siguiente" en el pie de la tabla. */
  onSiguiente?: () => void
  textoBotonSiguiente?: string
}

/** Valor textual de un campo, sea texto o selección. */
function texto(valor: unknown): string {
  return valor === null || valor === undefined ? '' : String(valor)
}

/**
 * Sección de configuración: el estado del modo y del borrador lo resuelve
 * `SeccionLista`; aquí solo se traduce `campos`/`columnas` a JSX.
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
  textoBotonSiguiente = 'Siguiente',
}: SeccionGenericaProps) {
  /* Copia local cuando el padre no controla la lista. */
  const [locales, setLocales] = useState<Record<string, unknown>[]>(() =>
    datosEjemplo.map((fila) => ({ ...fila })),
  )
  const controlada = registros !== undefined
  const filas = controlada ? registros : locales
  const cambiarFilas = controlada ? onRegistrosChange! : setLocales

  return (
    <SeccionLista<Record<string, unknown>>
      filas={filas}
      onCambio={cambiarFilas}
      inicial={() => ({ ...inicial })}
      entidad={textos?.nuevo ?? 'registro'}
      textos={textos}
      validar={(borrador) => {
        const faltante = campos.find(
          (campo) => campo.requerido && !texto(borrador[campo.clave]).trim(),
        )
        return faltante
          ? (faltante.mensajeError ?? `El campo “${faltante.etiqueta}” es obligatorio.`)
          : null
      }}
      asignarId={(borrador, filasActuales, indice) => {
        const limpio: Record<string, unknown> = {}
        for (const campo of campos) {
          const valor = borrador[campo.clave]
          limpio[campo.clave] = typeof valor === 'string' ? valor.trim() : valor
        }
        return {
          ...limpio,
          id: indice !== null ? filasActuales[indice]?.id : nuevoId(prefijoId),
        }
      }}
      renderTabla={({ filas: visibles, onEditar, onEliminar }) => (
        <TablaAcciones
          filas={visibles}
          columnas={columnas.map((columna) => ({
            encabezado: columna.encabezado,
            celda: (fila: Record<string, unknown>, indice: number) =>
              columna.valor
                ? columna.valor(fila, indice)
                : columna.clave
                  ? texto(fila[columna.clave]) || '-'
                  : '-',
          }))}
          vacia={vacia}
          anchoMinimo={`${Math.max(columnas.length * 10, 40)}rem`}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      )}
      renderFormulario={({ valores, onCambio, intentoEnvio }) => (
        <div className="padron-form-grid">
          {campos.map((campo) => {
            const id = `${prefijoId}-${campo.clave}`
            const valor = texto(valores[campo.clave])
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
                    value={valores[campo.clave] ?? null}
                    invalid={invalido}
                    onChange={(e) => onCambio({ [campo.clave]: e.value })}
                    placeholder={campo.placeholder}
                    appendTo="self"
                  />
                ) : campo.tipo === 'area' ? (
                  <textarea
                    id={id}
                    className={`padron-textarea ${invalido ? 'padron-textarea--invalido' : ''}`}
                    value={valor}
                    onChange={(e) => onCambio({ [campo.clave]: e.target.value })}
                    placeholder={campo.placeholder}
                  />
                ) : (
                  <InputText
                    id={id}
                    value={valor}
                    maxLength={campo.maxLength}
                    invalid={invalido}
                    onChange={(e) =>
                      onCambio({
                        [campo.clave]: campo.soloDigitos
                          ? e.target.value.replace(/\D/g, '')
                          : e.target.value,
                      })
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
      )}
      extraTabla={
        onSiguiente && (
          <SndBoton variante="secundario" type="button" onClick={onSiguiente}>
            {textoBotonSiguiente}
          </SndBoton>
        )
      }
    />
  )
}

export default SeccionGenerica
