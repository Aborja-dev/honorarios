import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

// ---------------------------------------------------------------------------
// Hook genérico de formulario: valida, guarda, limpia y genera los handlers
// de cambio (texto, calendarios y dropdowns) para cualquier forma de datos.
// Es independiente de PrimeReact y de la UI: solo maneja valores y validación.
// ---------------------------------------------------------------------------

export type CambioCampo<V> = string | ((anterior: V) => V)

export interface OpcionesUseForm<Forma extends object> {
  /** Valores iniciales del formulario (se copian al limpiar). */
  initialValues: Forma
  /** Regla de validación de todo el formulario. */
  validar: (valores: Forma) => boolean
  /** Se ejecuta con los valores ya validados al guardar. */
  guardar: (valores: Forma) => void
  /** Mensajes opcionales de respuesta de guardar/validar. */
  avisos?: {
    guardado?: string
    invalidado?: string
  }
  /** Notificaciones (opcional) para emitir los avisos. */
  notificar?: {
    exito: (mensaje: string) => void
    alerta: (mensaje: string) => void
  }
}

export function useForm<Forma extends object>({
  initialValues,
  validar,
  guardar,
  avisos,
  notificar,
}: OpcionesUseForm<Forma>) {
  const [valores, setValores] = useState<Forma>(initialValues)
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [esValido, setEsValido] = useState(false)

  /** Asigna un campo; acepta el valor directo o una función (previo) => nuevo. */
  const actualizar = useCallback(<K extends keyof Forma>(campo: K, valor: CambioCampo<Forma[K]>) => {
    setValores((actuales) => ({
      ...actuales,
      [campo]:
        typeof valor === 'function'
          ? (valor as (anterior: Forma[K]) => Forma[K])(actuales[campo])
          : valor,
    }))
  }, [])

  /** Valida el formulario completo y devuelve el resultado (no modifica estado). */
  const validarFormulario = useCallback(
    (candidatos: Forma = valores) => validar(candidatos),
    [validar, valores],
  )

  /** Valida, marca el intento de envío y solo llama a `guardar` si es válido. */
  const guardarFormulario = useCallback(
    (e?: FormEvent<HTMLFormElement>): boolean => {
      e?.preventDefault()
      const valido = validar(valores)
      setEsValido(valido)
      setIntentoEnvio(true)

      if (!valido) {
        if (avisos?.invalidado) notificar?.alerta(avisos.invalidado)
        return false
      }

      guardar(valores)
      if (avisos?.guardado) notificar?.exito(avisos.guardado)
      return true
    },
    [avisos, guardar, notificar, validar, valores],
  )

  /** Restaura los valores iniciales y reinicia las banderas del formulario. */
  const limpiarFormulario = useCallback(() => {
    setValores(initialValues)
    setIntentoEnvio(false)
    setEsValido(false)
  }, [initialValues])

  /** Copia de los valores con Date clonados (segura para enviar a servicios). */
  const valoresLimpios = useMemo(() => {
    const copia = Object.fromEntries(
      Object.entries(valores).map(([campo, valor]) => [
        campo,
        valor instanceof Date ? new Date(valor) : valor,
      ]),
    ) as Forma
    return copia
  }, [valores])

  // Handlers genéricos de cambio por forma de evento
  const cambiarTexto = useCallback(
    (campo: keyof Forma, transformar?: (texto: string) => string) => {
      return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const texto = e.target.value
        actualizar(campo, transformar ? transformar(texto) : texto)
      }
    },
    [actualizar],
  )

  const crearCambioValor = useCallback(
    <K extends keyof Forma>(campo: K, normalizar?: (valor: unknown) => Forma[K]) => {
      return (e: { value: unknown }) => {
        if (normalizar) {
          actualizar(campo, (previo) => normalizar(e.value) ?? previo)
          return
        }
        actualizar(campo, () => e.value as Forma[K])
      }
    },
    [actualizar],
  )

  return {
    valores,
    valoresLimpios,
    intentoEnvio,
    esValido,
    actualizar,
    validarFormulario,
    guardarFormulario,
    limpiarFormulario,
    cambiarTexto,
    crearCambioValor,
  }
}

// Normalizaciones de texto (solo dígitos, mayúsculas, etc.)
export const soloDigitos = (texto: string) => texto.replace(/\D/g, '')
export const aMayusculas = (texto: string) => texto.toUpperCase()

// Copia normalizada de los valores de un Calendar de PrimeReact (Date | Date[] | null)
export const comoFecha = (valor: unknown): Date | null =>
  valor instanceof Date ? valor : Array.isArray(valor) ? ((valor[0] as Date) ?? null) : null
