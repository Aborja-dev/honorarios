import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSndConfig, type Tema } from './sndConfig'

const CLAVE = 'snd-tema'
const ID_LINK = 'snd-tema'

interface TemaContextValue {
  /** Gama activa. */
  tema: Tema
  /** Cambia la gama activa y la persiste. Ignora cualquier valor distinto de `guinda` o `verde`. */
  establecer: (tema: string) => void
}

const TemaContext = createContext<TemaContextValue | null>(null)

function leerTemaGuardado(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'guinda' || guardado === 'verde') return guardado
  } catch {
    // Almacenamiento no disponible: se usa el tema por defecto.
  }
  return 'guinda'
}

/**
 * Proveedor del tema de color (gama guinda o verde).
 *
 * Funcionamiento:
 * 1. El estado `tema` se inicializa desde `localStorage` (clave `snd-tema`); si no existe, `guinda`.
 * 2. Un efecto mantiene un único `<link id="snd-tema">` en `<head>` con la URL
 *    `<baseUrl>/snd-<tema>.css` y fija el atributo `data-tema` en `<html>`.
 * 3. Los estilos de `primereact/snd-prime.css` usan las variables `--gama*` y `--principal` de cada
 *    hoja, por lo que los componentes de PrimeReact siguen el cambio sin código adicional.
 *
 * Restricción del SND: no se combinan gamas, por lo que solo una está activa.
 */
export function TemaProvider({ children }: { children: ReactNode }) {
  const config = useSndConfig()
  const [tema, setTema] = useState<Tema>(leerTemaGuardado)

  useEffect(() => {
    const href = `${config.baseUrl}/snd-${tema}.css`
    let link = document.getElementById(ID_LINK) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = ID_LINK
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href)
    document.documentElement.setAttribute('data-tema', tema)
  }, [tema, config.baseUrl])

  const establecer = useCallback((nuevo: string) => {
    if (nuevo !== 'guinda' && nuevo !== 'verde') return
    setTema(nuevo)
    try {
      localStorage.setItem(CLAVE, nuevo)
    } catch {
      // Almacenamiento no disponible (modo privado o bloqueado): el tema dura solo la sesión.
    }
  }, [])

  const valor = useMemo(() => ({ tema, establecer }), [tema, establecer])
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>
}

/**
 * Accede al tema activo y a la función que lo cambia.
 *
 * @example
 * const { tema, establecer } = useTema()
 * establecer('verde')
 */
export function useTema(): TemaContextValue {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema debe usarse dentro de <TemaProvider>')
  return contexto
}
