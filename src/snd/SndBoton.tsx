import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { SndIcono } from './SndIcono'
import { cn } from './util'

/** Variantes de botón del SND. */
export type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'limpio'

interface PropiedadesComunes {
  /** Variante visual. */
  variante?: VarianteBoton
  /** Estado de proceso: deshabilita el botón y muestra el ícono giratorio. */
  cargando?: boolean
  /** Texto solo para lectores de pantalla durante `cargando`. */
  etiquetaCargando?: string
  children?: ReactNode
}

function clasesBoton(variante: VarianteBoton, deshabilitado: boolean, cargando: boolean, extra?: string) {
  const base = `boton__${variante}`
  return cn(base, deshabilitado && `${base}--disabled`, cargando && 'boton--cargando', extra)
}

function Contenido({ cargando, etiquetaCargando, children }: PropiedadesComunes) {
  if (!cargando) return <>{children}</>
  return (
    <>
      <span className="oculto">{etiquetaCargando}</span>
      <SndIcono nombre="snd-snd-loading2" className="icono__spin" tamano={24} />
    </>
  )
}

export type SndBotonProps = PropiedadesComunes & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Botón del SND (`.boton__primario`, `.boton__secundario`, `.boton__fantasma`, `.boton__limpio`).
 *
 * Props:
 * - `variante`: `primario` (por defecto), `secundario`, `fantasma` o `limpio`.
 * - `disabled`: atributo nativo; el SND aplica el estilo deshabilitado por sí solo.
 * - `cargando`: añade `boton--cargando` y `aria-busy`, deshabilita el botón y reemplaza el
 *   contenido por el ícono giratorio.
 * - `etiquetaCargando`: texto solo para lectores de pantalla mientras carga ("Procesando").
 *
 * Para enlaces con aspecto de botón usar `SndBotonEnlace`.
 *
 * @example
 * <SndBoton type="button">Guardar</SndBoton>
 * <SndBoton variante="secundario" cargando={guardando}>Guardar</SndBoton>
 */
export function SndBoton({
  variante = 'primario',
  cargando = false,
  etiquetaCargando = 'Procesando',
  disabled,
  className,
  children,
  type = 'button',
  ...resto
}: SndBotonProps) {
  return (
    <button
      {...resto}
      type={type}
      className={clasesBoton(variante, false, cargando, className)}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
    >
      <Contenido cargando={cargando} etiquetaCargando={etiquetaCargando}>
        {children}
      </Contenido>
    </button>
  )
}

type PropiedadesEnlaceBase = PropiedadesComunes & {
  /** Enlace deshabilitado: `<a>` no admite `disabled`. Cancela el clic y saca el enlace del tabulador. */
  deshabilitado?: boolean
}

export type SndBotonEnlaceProps =
  | (PropiedadesEnlaceBase & Omit<LinkProps, 'children'> & { to: LinkProps['to'] })
  | (PropiedadesEnlaceBase & AnchorHTMLAttributes<HTMLAnchorElement> & { to?: undefined })

/**
 * Enlace con aspecto de botón del SND. Usa `to` para navegar con React Router o `href` para un
 * enlace externo.
 *
 * `deshabilitado` añade la clase `<variante>--disabled`, `aria-disabled` y `tabindex="-1"`, y cancela
 * el clic en la fase de captura: no navega ni dispara otros `onClick`. `aria-disabled` y `tabindex`
 * solo informan; no impiden la activación por sí solos.
 *
 * @example
 * <SndBotonEnlace to="/componentes">Ver componentes</SndBotonEnlace>
 * <SndBotonEnlace href="#" variante="fantasma" deshabilitado>Ver más</SndBotonEnlace>
 */
export function SndBotonEnlace(props: SndBotonEnlaceProps) {
  const {
    variante = 'primario',
    cargando = false,
    etiquetaCargando = 'Procesando',
    deshabilitado = false,
    className,
    children,
    to,
    ...resto
  } = props as PropiedadesEnlaceBase & { to?: LinkProps['to']; className?: string } & Record<string, unknown>

  const comunes = {
    className: clasesBoton(variante, deshabilitado, cargando, className),
    'aria-disabled': deshabilitado || undefined,
    'aria-busy': cargando || undefined,
    tabIndex: deshabilitado ? -1 : undefined,
    // Fase de captura: corre antes que los `onClick` propios y que el de `Link`.
    onClickCapture: (evento: MouseEvent) => {
      if (!deshabilitado) return
      evento.preventDefault()
      evento.stopPropagation()
    },
  }
  const contenido = (
    <Contenido cargando={cargando} etiquetaCargando={etiquetaCargando}>
      {children}
    </Contenido>
  )

  if (to !== undefined) {
    return (
      <Link {...(resto as Omit<LinkProps, 'to'>)} {...comunes} to={to}>
        {contenido}
      </Link>
    )
  }
  return (
    <a {...(resto as AnchorHTMLAttributes<HTMLAnchorElement>)} {...comunes}>
      {contenido}
    </a>
  )
}
