import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { SndIcono } from './SndIcono'
import { cn } from '../../utils/cn'

/** Variantes de botón del SND. */
export type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'limpio'

interface PropiedadesComunes {
  variante?: VarianteBoton
  cargando?: boolean
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
  deshabilitado?: boolean
}

export type SndBotonEnlaceProps =
  | (PropiedadesEnlaceBase & Omit<LinkProps, 'children'> & { to: LinkProps['to'] })
  | (PropiedadesEnlaceBase & AnchorHTMLAttributes<HTMLAnchorElement> & { to?: undefined })

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
