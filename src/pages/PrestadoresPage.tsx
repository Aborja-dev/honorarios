import { useEffect, useState } from 'react'
import PadronPrestadoresServicio from './PadronPrestadoresServicio'
import {
  MenuFlotante,
  type ItemMenuFlotante,
} from '../components/prestadoresServicios/MenuFlotante'
import { SCROLL_INTERNO_PADRON, CLASE_SCROLL_INTERNO_PADRON } from '../app/config'
import './PrestadoresPage.css'

/**
 * Secciones del formulario de Padrón, en el mismo orden que los `AccordionTab`.
 * `ancla` coincide exactamente con el `id` del contenedor hijo inmediato de cada
 * sección: es el destino del anchor y lo que marca el renglón activo.
 */
const SECCIONES: ItemMenuFlotante[] = [
  {
    texto: 'Validación de CURP',
    descripcion: 'CURP y periodo del servicio',
    icono: 'snd-user--avatar',
    ancla: 'padron-seccion-curp',
    tooltip: 'Validación de CURP',
  },
  {
    texto: 'Datos personales',
    descripcion: 'Nombre, apellidos y RFC',
    icono: 'snd-user',
    ancla: 'padron-seccion-personal',
    tooltip: 'Datos personales',
  },
  {
    texto: 'Dirección',
    descripcion: 'Domicilio contractual',
    icono: 'snd-home',
    ancla: 'padron-seccion-direccion',
    tooltip: 'Dirección',
  },
  {
    texto: 'Escolaridad',
    descripcion: 'Grado máximo y cédula',
    icono: 'snd-document',
    ancla: 'padron-seccion-escolaridad',
    tooltip: 'Escolaridad',
  },
  {
    texto: 'Experiencia laboral',
    descripcion: 'Trayectoria comprobable',
    icono: 'snd-calendar',
    ancla: 'padron-seccion-experiencia',
    tooltip: 'Experiencia laboral',
  },
]

/** Índice de acordeón asociado a cada ancla; el orden de SECCIONES es el del Accordion. */
const INDICE_POR_ANCLA: Record<string, number> = Object.fromEntries(
  SECCIONES.map((seccion, indice) => [seccion.ancla, indice]),
)

/** Margen superior del desplazamiento, para no dejar el título pegado al borde. */
/**
 * Espacio libre entre el borde superior de la ventana y la sección al desplazarse.
 * El encabezado institucional del SND es fijo y mide ~100px: con menos margen la
 * sección queda tapada por él.
 */
const MARGEN_DESPLAZAMIENTO = 101

/**
 * Margen superior al desplazar dentro del panel del formulario. Aquí no hay
 * encabezado fijo encima, así que basta una separación pequeña.
 */
const MARGEN_DESPLAZAMIENTO_PANEL = 16

/**
 * Pantalla del Padrón de Prestadores de Servicio con un menú fijo de secciones.
 *
 * La página posee el estado de los acordeones (modo controlado) para poder
 * abrir la sección destino antes de desplazarse a ella.
 */
export const PrestadoresPage = () => {
  /*
    El menú arranca colapsado (solo íconos) para no robar ancho al formulario,
    pero el gatillo permite expandirlo si el usuario prefiere leer los títulos.
  */
  const [menuColapsado, setMenuColapsado] = useState(true)

  // Estado de los acordeones, elevado aquí para compartirlo con el menú.
  const [acordeonesActivos, setAcordeonesActivos] = useState<number | number[]>([0])

  const indicesAbiertos = Array.isArray(acordeonesActivos)
    ? acordeonesActivos
    : [acordeonesActivos]

  /** Índice de la primera sección abierta; 0 si no hay ninguna. */
  const primerAbierto = indicesAbiertos.length ? Math.min(...indicesAbiertos) : 0

  /** Ancla activa: la del acordeón abierto con menor índice. */
  const anclaActiva: string | undefined = SECCIONES[primerAbierto]?.ancla

  /**
   * Ancla a la que hay que desplazarse. Se guarda en estado (no se llama al
   * scroll de inmediato) porque React pinta la apertura del acordeón después:
   * en el instante del clic el `id` destino todavía no existe en el DOM.
   */
  const [anclaPendiente, setAnclaPendiente] = useState<string | null>(null)

  useEffect(() => {
    if (!anclaPendiente) return

    // Se espera un cuadro para que PrimeReact termine de montar/animar el panel
    // antes de medir posiciones; sin esto el cálculo de `top` queda desfasado.
    const cuadro = requestAnimationFrame(() => {
      const destino = document.getElementById(anclaPendiente)
      if (!destino) return
      /*
        El `id` está en el contenido del acordeón, pero lo que debe quedar
        visible es el tab completo, incluida su cabecera con el título. Se usa
        la cabecera del tab contenedor como referencia.
      */
      const tab = destino.closest('.p-accordion-tab') as HTMLElement | null
      const referencia = tab ?? destino
      /*
        Con `VITE_SCROLL=off` el panel ya no desplaza por dentro (crece con el
        formulario), así que el destino es la ventana. Con scroll interno se
        desplaza el contenedor, que es el que tiene altura fija.
      */
      const panel = SCROLL_INTERNO_PADRON
        ? (referencia.closest('.prestadores-layout__contenido') as HTMLElement | null)
        : null
      if (panel) {
        const desplazamiento =
          referencia.getBoundingClientRect().top -
          panel.getBoundingClientRect().top +
          panel.scrollTop -
          MARGEN_DESPLAZAMIENTO_PANEL
        panel.scrollTo({ top: Math.max(desplazamiento, 0), behavior: 'smooth' })
      } else {
        const arriba =
          referencia.getBoundingClientRect().top + window.scrollY - MARGEN_DESPLAZAMIENTO
        window.scrollTo({ top: Math.max(arriba, 0), behavior: 'smooth' })
      }
      // Se limpia para que un nuevo clic en la misma sección vuelva a desplazar.
      setAnclaPendiente(null)
    })

    return () => cancelAnimationFrame(cuadro)
  }, [anclaPendiente, acordeonesActivos])

  /**
   * Abre la sección y agenda el desplazamiento a ella. Devuelve `false` si el
   * ancla no corresponde a ninguna sección, para dejar actuar al anchor nativo.
   */
  const irASeccion = (ancla: string) => {
    const indice = INDICE_POR_ANCLA[ancla]
    if (indice === undefined) return false

    // Se abre el acordeón, dejando abiertas las demás.
    setAcordeonesActivos((actuales) => {
      const lista = Array.isArray(actuales) ? actuales : [actuales]
      return lista.includes(indice) ? lista : [...lista, indice]
    })

    setAnclaPendiente(ancla)
    return true
  }

  return (
    <>
      {/* El menú vive fuera de `.prestadores-layout`: ese contenedor recorta el
          desbordamiento (`overflow: hidden`) y anularía su `position: fixed`. */}
      <aside
        className="prestadores-layout__menu"
        onClick={(e) => {
          const enlace = (e.target as HTMLElement).closest('a[href^="#padron-seccion-"]')
          if (!enlace) return
          // Se evita el salto nativo para controlar el margen y el desplazamiento suave.
          if (irASeccion(enlace.getAttribute('href')!.slice(1))) {
            e.preventDefault()
          }
        }}
      >
        <MenuFlotante
          titulo="Secciones del expediente"
          items={SECCIONES}
          activa={anclaActiva}
          colapsado={menuColapsado}
          onColapsar={setMenuColapsado}
        />
      </aside>

      {/* Clase modificadora de la bandera `VITE_SCROLL`: activa el scroll interno
          del panel (`on`, por defecto) o deja que la página entera se desplace
          (`off`). Las reglas viven en PrestadoresPage.css. */}
      <div
        className={
          SCROLL_INTERNO_PADRON
            ? `prestadores-layout ${CLASE_SCROLL_INTERNO_PADRON}`
            : 'prestadores-layout'
        }
      >
        <div className="prestadores-layout__contenido">
          <PadronPrestadoresServicio
            acordeonesActivos={acordeonesActivos}
            onAcordeonesChange={setAcordeonesActivos}
          />
        </div>
      </div>
    </>
  )
}

export default PrestadoresPage
