import { cn } from '../utils/cn'
import { SndIcono } from './snd'

/** Una sección del formulario a la que lleva el menú. */
export interface ItemMenuFlotante {
  /** Texto visible del renglón. */
  texto: string
  /** Nombre del ícono con prefijo `snd-`. */
  icono: string
  /** `id` del contenedor hijo inmediato de la sección; el menú genera `href="#<ancla>"`. */
  ancla: string
  /** Descripción opcional que se muestra bajo el texto. */
  descripcion?: string
  /** Marca de avance; pinta el punto de color del renglón. */
  estado?: 'completado' | 'pendiente'
  tooltip: string
  /** Forzar estado activo directamente en el ítem (opcional; si se omite, se compara con `activa`). */
  active?: boolean
}

export interface MenuFlotanteProps {
  items: ItemMenuFlotante[]
  titulo?: string
  etiqueta?: string
  /**
   * `ancla` de la sección marcada como activa. Obligatoria a propósito: si se omite,
   * ningún renglón coincide y el menú se vería todo en color neutro sin avisar.
   * Puede ser `undefined` explícito cuando no hay sección abierta.
   */
  activa: string | undefined
  colapsado: boolean
  onColapsar: (colapsado: boolean) => void
  /** Clases adicionales aplicadas al `nav`. */
  className?: string
}

/**
 * Menú flotante de navegación entre las secciones de un formulario largo.
 *
 * Funciona con anchors: cada renglón es un `<a href="#<ancla>">` que lleva al `id`
 * del contenedor hijo inmediato de la sección, por lo que no necesita rutas.
 */
export function MenuFlotante({
  items,
  titulo,
  etiqueta = 'Navegación entre secciones',
  activa,
  colapsado,
  className,
}: MenuFlotanteProps) {
  return (
    <nav
      className={cn('menuMain', colapsado && 'menuMain--colapsado', className)}
      aria-label={etiqueta}
    >


      {titulo && (
        <div className="menuMain__header">
          <div className="menuMain__headerCont">{titulo}</div>
        </div>
      )}

      <ul className="menuMain__lista">
        {items.map((item) => {
          const esActiva = item.active ?? (item.ancla === activa)
          return (
            <li key={item.ancla} className="menuMain__item" title={item.tooltip}>
              <a
                href={`#${item.ancla}`}
                className={cn('menuMain__link menuMain__linkSm', esActiva && 'menuMain__link--active')}
                aria-current={esActiva ? 'location' : undefined}
              >
                <SndIcono nombre={item.icono} className="menuMain__icono" tamano={22} />
                <span className="menuMain__txt">
                  {item.texto}
                  {item.descripcion && <span className="menuMain__desc">{item.descripcion}</span>}
                </span>
                {item.estado && (
                  <span className={cn('menuMain__estado', item.estado === 'completado' && 'menuMain__estado--ok')}>
                    <span className="oculto">{item.estado === 'completado' ? ': completada' : ': pendiente'}</span>
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MenuFlotante
