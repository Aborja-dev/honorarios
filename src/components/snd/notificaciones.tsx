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

export type TipoNotificacion = Exclude<TipoMensaje, 'neutro'>

interface Notificacion {
  id: number
  tipo: TipoNotificacion
  detalle: string
  titulo?: string
  saliendo?: boolean
}

export interface Notificaciones {
  exito: (detalle: string, titulo?: string) => void
  info: (detalle: string, titulo?: string) => void
  alerta: (detalle: string, titulo?: string) => void
  error: (detalle: string, titulo?: string) => void
}

const NotificacionesContext = createContext<Notificaciones | null>(null)
const VIDA_MS = 5000
const SALIDA_MS = 200

interface ItemProps {
  notificacion: Notificacion
  onCerrar: (id: number) => void
}

function Item({ notificacion, onCerrar }: ItemProps) {
  const [pausado, setPausado] = useState(false)
  const { id, tipo, titulo, detalle, saliendo } = notificacion

  useEffect(() => {
    // Sin temporizador activo: el efecto no devuelve nada que limpiar.
    if (pausado || saliendo) return undefined
    const temporizador = setTimeout(() => onCerrar(id), VIDA_MS)
    return () => clearTimeout(temporizador)
  }, [pausado, saliendo, id, onCerrar])

  return (
    <div
      className={`aviso aviso--${tipo} snd-notificacion${saliendo ? ' snd-notificacion--sale' : ''}`}
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

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Notificacion[]>([])
  const contador = useRef(0)

  const cerrar = useCallback((id: number) => {
    setLista((l) => l.map((n) => (n.id === id ? { ...n, saliendo: true } : n)))
    setTimeout(() => setLista((l) => l.filter((n) => n.id !== id)), SALIDA_MS)
  }, [])
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

export function useNotificaciones(): Notificaciones {
  const contexto = useContext(NotificacionesContext)
  if (!contexto) throw new Error('useNotificaciones debe usarse dentro de <NotificacionesProvider>')
  return contexto
}
