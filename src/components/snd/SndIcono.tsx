import { useEffect, useState } from 'react'
import { useSndConfig } from '../../lib/sndConfig'
import { cn } from '../../utils/cn'

/** Caché en memoria de SVG descargados, por carpetas y nombre. Evita peticiones repetidas. */
const cache = new Map<string, Promise<string | null>>()

/**
 * Sanea un SVG descargado antes de insertarlo en el DOM.
 */
function limpiarSvg(texto: string): string | null {
  const doc = new DOMParser().parseFromString(texto, 'image/svg+xml')
  const svg = doc.documentElement
  if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null

  svg.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((n) => n.remove())
  for (const el of [svg, ...Array.from(svg.querySelectorAll('*'))]) {
    for (const attr of Array.from(el.attributes)) {
      const nombre = attr.name.toLowerCase()
      const valor = attr.value.trim()
      const esEnlace = nombre === 'href' || nombre === 'xlink:href'
      if (nombre.startsWith('on') || (esEnlace && !valor.startsWith('#'))) {
        el.removeAttribute(attr.name)
      }
    }
  }
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  return svg.outerHTML
}

async function descargar(archivo: string, carpetas: string[]): Promise<string | null> {
  for (const carpeta of carpetas) {
    try {
      const resp = await fetch(`${carpeta}/${archivo}.svg`)
      if (resp.ok) {
        const svg = limpiarSvg(await resp.text())
        if (svg) return svg
      }
    } catch {
      // Error de red o CORS: se prueba la siguiente carpeta.
    }
  }
  return null
}

export interface SndIconoProps {
  /** Nombre del ícono, con prefijo `snd-` (`snd-home`, `snd-chevron--down`). */
  nombre: string
  /** Lado en px. Sin valor rige el de la clase `.snd__icono` (24 px). */
  tamano?: number
  /** Busca el archivo en la carpeta de pictogramas. */
  pictograma?: boolean
  /** Texto accesible. Sin valor, el ícono es decorativo (`aria-hidden`). */
  etiqueta?: string
  /** Conserva los colores propios del SVG en lugar de heredar `currentColor`. */
  colorOriginal?: boolean
  /** Criterio de dimensionado: `caja` (cuadrado), `alto` o `ancho` (logos no cuadrados). */
  ajuste?: 'caja' | 'alto' | 'ancho'
  /** Clases adicionales; sirven para colorear con las clases del SND (`color--azul500`). */
  className?: string
}

export function SndIcono({
  nombre,
  tamano,
  pictograma = false,
  etiqueta,
  colorOriginal = false,
  ajuste = 'caja',
  className,
}: SndIconoProps) {
  const config = useSndConfig()
  const [svg, setSvg] = useState<string | null>(null)
  const carpetas = config.iconosUrls.map((u) => (pictograma ? `${u}/pictogramas` : u))
  const archivo = nombre.startsWith('snd-') ? nombre.slice(4) : nombre
  const clave = `${carpetas.join('|')}::${archivo}`

  useEffect(() => {
    let activo = true
    let tarea = cache.get(clave)
    if (!tarea) {
      tarea = descargar(archivo, carpetas)
      cache.set(clave, tarea)
      void tarea.then((r) => {
        if (!r) cache.delete(clave)
      })
    }
    void tarea.then((texto) => {
      if (!activo) return
      if (!texto) console.warn(`[SndIcono] no se encontró el ícono "${nombre}"`)
      setSvg(texto)
    })
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  return (
    <span
      className={cn(
        ajuste === 'caja' && 'snd__icono',
        ajuste === 'alto' && 'snd-icono--alto',
        ajuste === 'ancho' && 'snd-icono--ancho',
        colorOriginal && 'snd-icono--original',
        'snd-icono',
        className,
      )}
      style={tamano ? { width: tamano, height: tamano } : undefined}
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta || undefined}
      aria-hidden={etiqueta ? undefined : true}
    >
      <span className="snd-icono__svg" dangerouslySetInnerHTML={{ __html: svg ?? '' }} />
    </span>
  )
}
