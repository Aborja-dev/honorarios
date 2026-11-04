import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useSection } from '../../lib/context'

/**
 * Contenedor visual de una sección maestro-detalle.
 *
 * Pinta la cabecera (ícono, título, subtítulo y píldora de estado), alterna
 * tabla/formulario según el reducer y pone el pie con "Agregar" y "Siguiente".
 * Requiere estar dentro de `<SectionProvider>`.
 *
 * No confundir con `SectionProvider`: este componente **pinta**, el provider
 * **guarda el estado**.
 */
export interface SectionContainerProps<T = unknown> {
  title: string
  subtitle: string
  icon: ReactNode
  /** Tabla de la sección (se pinta en `activeView === 'table'`). */
  table: ReactNode
  /** Formulario de la sección (se pinta en `activeView === 'form'`). */
  children: ReactNode
  /** Etiqueta del botón que abre el formulario en blanco. */
  addButtonLabel: string
  onCompleted?: (ok: boolean) => void
  /** Renglones guardados; si se omite se usa `state.items`. */
  values?: T[]
  /** ¿Está abierta? Cambia la piel de la cabecera. */
  collapsed?: boolean
  /**
   * Se avisa después de cada guardado exitoso (alta o actualización). El
   * formulario despacha `SAVE_ITEM` y el reducer vuelve a la tabla; este
   * contenedor detecta esa transición y notifica.
   */
  onGuardarSeccion?: (fila: T, edicion: boolean) => void
}

export function SectionContainer<T = unknown>({
  children,
  addButtonLabel,
  icon,
  onCompleted,
  subtitle,
  table,
  title,
  values,
  collapsed = false,
  onGuardarSeccion,
}: SectionContainerProps<T>) {
  const { state, dispatch } = useSection<T>()

  /** Vista anterior, para detectar la transición form → table al guardar. */
  const anterior = useRef(state.activeView)

  const lista = (values ?? state.items) as unknown[]
  const completo = lista.length > 0

  /*
    El aviso de guardado se dispara aquí, observando la transición
    `form → table`: el formulario despacha `SAVE_ITEM` y el reducer vuelve a
    la tabla, así que este contenedor es el lugar único donde notificar sin
    que el formulario conozca al padre.
  */
  useEffect(() => {
    if (anterior.current === 'form' && state.activeView === 'table' && state.formState === 'valid') {
      if (state.values !== null) onGuardarSeccion?.(state.values, state.formMode === 'edit')
    }
    anterior.current = state.activeView
  }, [state.activeView, state.formState, state.formMode, state.values, onGuardarSeccion])

  // Al montarse se respeta el estado del reducer; lo único que se normaliza es
  // la vista, por si el contenedor se remonta con una captura a medias.
  useEffect(() => {
    if (state.activeView === 'form' && state.values === null) {
      dispatch({ type: 'DEFAULT' })
    }
    // Solo al montar: el estado es del provider, no de este contenedor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completeHandler = useCallback(() => {
    if (completo) onCompleted?.(true)
  }, [completo, onCompleted])

  return (
    <section className="padron-acordeon">
      <div className="padron-acordeon-tab" data-abierta={collapsed || undefined}>
        <div className="padron-acordeon__cabecera">
          <div className="padron-acordeon__titulo-grupo">
            <span className="padron-acordeon__icono">{icon}</span>
            <div>
              <span className="sh0b" style={{ display: 'block' }}>
                {title}
              </span>
              <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                {subtitle}
              </span>
            </div>
          </div>
          <span className={`pildora pildora--${completo ? 'exito' : 'alerta'} snd-pildora`}>
            <span className="pildora__dot" aria-hidden="true" />
            {completo ? 'Completado' : 'Por capturar'}
          </span>
        </div>

        <div className="padron-acordeon__contenido">
          {state.activeView === 'table' && table}
          {state.activeView === 'form' && children}
        </div>

        <div className="padron-acordeon__pie">
          {state.activeView === 'table' && (
            <>
              <button
                type="button"
                className="boton__secundario"
                onClick={() => dispatch({ type: 'ADD_ITEM' })}
              >
                {addButtonLabel}
              </button>
              <button type="button" className="boton__primario" onClick={completeHandler}>
                Siguiente
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default SectionContainer
