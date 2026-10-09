import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SndIcono } from './SndIcono'
import { ICONOS_MENSAJE, type TipoMensaje } from './SndMensaje'

/** Tipos de notificación disponibles. */
export type TipoNotificacion = Exclude<TipoMensaje, 'neutro'>

interface Notificacion {
  id: number
  tipo: TipoNotificacion
  detalle: string
  titulo?: string
}

/** Acciones para disparar notificaciones flotantes. Cada una recibe el detalle y, opcionalmente, un título. */
export interface Notificaciones {
  exito: (detalle: string, titulo?: string) => void
  info: (detalle: string, titulo?: string) => void
  alerta: (detalle: string, titulo?: string) => void
  error: (detalle: string, titulo?: string) => void
}

const NotificacionesContext = createContext<Notificaciones | null>(null)

/** Milisegundos antes de que una notificación desaparezca. */
const VIDA_MS = 5000

interface ItemProps {
  notificacion: Notificacion
  onCerrar: (id: number) => void
}

/** Una notificación: marcado de `.aviso` del SND, botón de cerrar y temporizador que se pausa con el cursor encima. */
function Item({ notificacion, onCerrar }: ItemProps) {
  const [pausado, setPausado] = useState(false)
  const { id, tipo, titulo, detalle } = notificacion

  useEffect(() => {
    if (pausado) return
    const temporizador = setTimeout(() => onCerrar(id), VIDA_MS)
    return () => clearTimeout(temporizador)
  }, [pausado, id, onCerrar])

  return (
    <div
      className={`aviso aviso--${tipo} snd-notificacion`}
      role={tipo === 'error' || tipo === 'alerta' ? 'alert' : 'status'}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <SndIcono nombre={ICONOS_MENSAJE[tipo]} tamano={24} />
      <div className="aviso__cont">
        {titulo && <strong>{titulo}</strong>}
        <span>{detalle}</span>
      </div>
      <button type="button" className="aviso__cerrar" aria-label="Cerrar notificación" onClick={() => onCerrar(id)}>
        <SndIcono nombre="snd-close" tamano={24} />
      </button>
    </div>
  )
}

/**
 * Proveedor de notificaciones flotantes con la apariencia de `.aviso` del SND: color por tipo,
 * borde, sombra y botón de cerrar.
 *
 * Se coloca una sola vez en la raíz, dentro de `TemaProvider`. Renderiza un contenedor
 * `position: fixed` debajo del encabezado (ver `.snd-notificaciones` en `snd.css`), por lo que no
 * tapa el menú de usuario ni altera el flujo de la página. Cada notificación desaparece a los 5 s;
 * el temporizador se pausa mientras el cursor está encima.
 *
 * Implementación propia, sin dependencia de PrimeReact.
 *
 * @example
 * // main.tsx
 * <NotificacionesProvider><App /></NotificacionesProvider>
 * // en cualquier componente
 * const notificar = useNotificaciones()
 * notificar.exito('El registro se guardó.', 'Guardado')
 */
export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Notificacion[]>([])
  const contador = useRef(0)

  const cerrar = useCallback((id: number) => setLista((l) => l.filter((n) => n.id !== id)), [])
  const agregar = useCallback((tipo: TipoNotificacion, detalle: string, titulo?: string) => {
    contador.current += 1
    const id = contador.current
    setLista((l) => [...l, { id, tipo, detalle, titulo }])
  }, [])

  const acciones = useMemo<Notificaciones>(
    () => ({
      exito: (d, t) => agregar('exito', d, t),
      info: (d, t) => agregar('info', d, t),
      alerta: (d, t) => agregar('alerta', d, t),
      error: (d, t) => agregar('error', d, t),
    }),
    [agregar],
  )

  return (
    <NotificacionesContext.Provider value={acciones}>
      {children}
      <div className="snd-notificaciones" role="region" aria-label="Notificaciones">
        {lista.map((n) => (
          <Item key={n.id} notificacion={n} onCerrar={cerrar} />
        ))}
      </div>
    </NotificacionesContext.Provider>
  )
}

/** Devuelve las acciones para disparar notificaciones. Requiere `NotificacionesProvider`. */
export function useNotificaciones(): Notificaciones {
  const contexto = useContext(NotificacionesContext)
  if (!contexto) throw new Error('useNotificaciones debe usarse dentro de <NotificacionesProvider>')
  return contexto
}
