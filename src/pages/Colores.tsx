import { useRef, useState } from 'react'
import { useTitulo } from '../core/useTitulo'
import { ASIGNACIONES, PRIMITIVOS, SEMANTICOS, type Color, type GrupoColores } from './colores-datos'
import './Colores.css'
import { NOMBRE_BASE } from '../core/base'

/** Texto legible sobre la muestra (elección por luminancia del fondo). */
function textoSobre(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l > 0.6 ? 'var(--neutro800, #161A1D)' : '#fff'
}

interface MuestraProps {
  color: Color
  copiado: string | null
  onCopiar: (hex: string) => void
}

function Muestra({ color: c, copiado, onCopiar }: MuestraProps) {
  return (
    <button
      type="button"
      className="muestra"
      onClick={() => onCopiar(c.hex)}
      aria-label={`${c.nombre} ${c.hex} --${c.variable}, copiar hexadecimal`}
    >
      <span
        className="muestra__color"
        style={{ background: `var(--${c.variable}, ${c.hex})`, color: textoSobre(c.hex) }}
      >
        {copiado === c.hex && <span className="b1sb">Copiado</span>}
      </span>
      <span className="muestra__nombre b1sb">{c.nombre}</span>
      <span className="muestra__dato sdr">{c.hex}</span>
      <span className="muestra__dato sdr">--{c.variable}</span>
    </button>
  )
}

/**
 * Página de la paleta del SND: colores primitivos, semánticos, opacidad, degradados y la
 * asignación de color por elemento. Cada muestra se pinta con la variable CSS del SND y usa el
 * hexadecimal solo como respaldo, por lo que sigue cualquier cambio de la hoja.
 */
export default function Colores() {
  useTitulo('Colores')
  const [copiado, setCopiado] = useState<string | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined)

  const copiar = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiado(hex)
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => setCopiado((c) => (c === hex ? null : c)), 1500)
    } catch {
      // Sin permiso de portapapeles: el hexadecimal permanece visible para copiarlo manualmente.
    }
  }

  const grupo = (g: GrupoColores) => (
    <section className="grupo" key={g.titulo}>
      <h3 className="sh0b">{g.titulo}</h3>
      <p className="sdr">{g.descripcion}</p>
      <div className="muestras">
        {g.colores.map((c) => (
          <Muestra key={c.variable} color={c} copiado={copiado} onCopiar={copiar} />
        ))}
      </div>
    </section>
  )

  return (
    <div className="contenedor">
      <h1 className="h1b patria">Colores</h1>
      <p className="sh0m color--principal">{NOMBRE_BASE}</p>
      <p className="b1r">
        Paleta del Sistema Nacional de Diseño (v1.3.0). Haz clic en una muestra para copiar su hexadecimal. Cada
        muestra usa la variable CSS del SND, que se indica debajo del nombre.
      </p>
      <p className="sdr" aria-live="polite">
        {copiado ? `Copiado ${copiado}` : ''}
      </p>

      <h2 className="h2b">Colores primitivos</h2>
      <p className="b1r">
        Son la paleta base: valores puros sin significado propio, con los que se construyen la identidad y los
        colores de estado. Se elige <strong>una sola gama primaria</strong>: no se combinan guinda y verde o dorado.
      </p>
      {PRIMITIVOS.map(grupo)}

      <h2 className="h2b">Colores semánticos</h2>
      <p className="b1r">
        Transmiten un significado funcional: verde para éxito, rojo para error, amarillo para advertencia y azul para
        información. Se derivan de los primitivos.
      </p>
      {SEMANTICOS.map(grupo)}

      <section className="grupo">
        <h3 className="sh0b">Color con opacidad</h3>
        <p className="sdr">Permite superponer sin perder legibilidad; por ejemplo, el fondo detrás de un modal.</p>
        <div className="muestras">
          <div className="muestra muestra--estatica">
            <span className="muestra__color muestra__color--overlay">
              <span className="muestra__overlay" />
            </span>
            <span className="muestra__nombre b1sb">Overlay</span>
            <span className="muestra__dato sdr">Neutro - 800 al 56%</span>
            <span className="muestra__dato sdr">rgba(22, 26, 29, 0.56)</span>
          </div>
        </div>
      </section>

      <section className="grupo">
        <h3 className="sh0b">Degradados</h3>
        <p className="sdr">De la gama 900 a la 600 de cada paleta primaria.</p>
        <div className="muestras">
          <div className="muestra muestra--estatica">
            <span
              className="muestra__color"
              style={{ background: 'linear-gradient(to bottom, var(--pguinda900, #611232), var(--pguinda600, #9B2247))' }}
            />
            <span className="muestra__nombre b1sb">Degradado guinda</span>
            <span className="muestra__dato sdr">Guinda 900 → Guinda 600</span>
          </div>
          <div className="muestra muestra--estatica">
            <span
              className="muestra__color"
              style={{ background: 'linear-gradient(to bottom, var(--pverde900, #002F2A), var(--pverde600, #004D40))' }}
            />
            <span className="muestra__nombre b1sb">Degradado verde</span>
            <span className="muestra__dato sdr">Verde 900 → Verde 600</span>
          </div>
        </div>
      </section>

      <h2 className="h2b">Qué color usar en cada elemento</h2>
      <p className="b1r">Asignaciones documentadas por el SND.</p>
      {ASIGNACIONES.map((g) => (
        <section className="grupo" key={g.titulo}>
          <h3 className="sh0b">{g.titulo}</h3>
          <ul className="asignaciones">
            {g.filas.map((f) => (
              <li className="asignacion" key={f.uso + f.color}>
                <span className="asignacion__chip" style={{ background: `var(--${f.variable}, ${f.hex})` }} />
                <span className="b1r asignacion__uso">{f.uso}</span>
                <span className="b1sb">{f.color}</span>
                <span className="sdr">{f.hex}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
