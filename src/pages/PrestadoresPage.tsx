import { useState } from 'react'
import PadronPrestadoresServicio from './PadronPrestadoresServicio'
import {
    MenuFlotante,
    type ItemMenuFlotante,
} from '../components/prestadoresServicios/MenuFlotante'
import './PrestadoresPage.css'

/**
 * Secciones del formulario de Padrón, en el mismo orden que los `AccordionTab`.
 * `ancla` coincide exactamente con el `id` del contenedor hijo inmediato de la sección
 * y con lo que `MenuFlotante` compara para marcar el renglón activo.
 */
const SECCIONES: ItemMenuFlotante[] = [
    {
        texto: 'Validación de CURP',
        descripcion: 'CURP y periodo del servicio',
        icono: 'snd-user--avatar',
        ancla: '#curp',
        tooltip: "Validación de CURP"
    },
    {
        texto: 'Datos personales',
        descripcion: 'Nombre, apellidos y RFC',
        icono: 'snd-user',
        ancla: '#',
        tooltip: "Datos personales"
    },
    {
        texto: 'Dirección',
        descripcion: 'Domicilio contractual',
        icono: 'snd-home',
        ancla: '#direccion',
        tooltip: "Dirección"
    },
    {
        texto: 'Escolaridad',
        descripcion: 'Grado máximo y cédula',
        icono: 'snd-document',
        ancla: '#escolaridad',
        tooltip: "Escolaridad"
    },
    {
        texto: 'Experiencia laboral',
        descripcion: 'Trayectoria comprobable',
        icono: 'snd-calendar',
        ancla: '#experiencia',
        tooltip: "Experiencia laboral"
    },
]

/** Índice de acordeón asociado a cada ancla; el orden de SECCIONES es el del Accordion. */
const INDICE_POR_ANCLA: Record<string, number> = Object.fromEntries(
    SECCIONES.map((seccion, indice) => [seccion.ancla, indice]),
)

/**
 * Pantalla del Padrón de Prestadores de Servicio con un menú lateral de secciones.
 *
 * Esta página posee el estado de los acordeones (modo controlado) para poder
 * resaltar en el menú la sección abierta y abrir la sección destino al navegar.
 */
export const PrestadoresPage = () => {
    const [menuColapsado, setMenuColapsado] = useState(false)

    // Estado de los acordeones, elevado aquí para compartirlo con el menú.
    const [acordeonesActivos, setAcordeonesActivos] = useState<number | number[]>([0])

    const indicesAbiertos = Array.isArray(acordeonesActivos)
        ? acordeonesActivos
        : [acordeonesActivos]

    /** Índice de la primera sección abierta; 0 si no hay ninguna. */
    const primerAbierto = indicesAbiertos.length ? Math.min(...indicesAbiertos) : 0

    /** Ancla activa: la del acordeón abierto con menor índice. */
    const anclaActiva: string | undefined = SECCIONES[primerAbierto]?.ancla

    /** Abre la sección indicada dejando las demás como estén. */
    const abrirSeccion = (ancla: string) => {
        const indice = INDICE_POR_ANCLA[ancla]
        if (indice === undefined) return
        setAcordeonesActivos((actuales) => {
            const lista = Array.isArray(actuales) ? actuales : [actuales]
            return lista.includes(indice) ? lista : [...lista, indice]
        })
    }

    return (
        <div className="prestadores-layout">
            <aside
                className="prestadores-layout__menu"
                onClick={(e) => {
                    const enlace = (e.target as HTMLElement).closest('a[href^="#padron-seccion-"]')
                    if (!enlace) return
                    // Se abre la sección antes de que el navegador procese el anchor.
                    abrirSeccion(enlace.getAttribute('href')!.slice(1))
                }}
            >
                <MenuFlotante
                    titulo="Secciones del expediente"
                    items={SECCIONES}
                    activa={anclaActiva}
                    colapsado={true}
                    onColapsar={setMenuColapsado}
                />
            </aside>

            <div className="prestadores-layout__contenido">
                <PadronPrestadoresServicio
                    acordeonesActivos={acordeonesActivos}
                    onAcordeonesChange={setAcordeonesActivos}
                />
            </div>
        </div>
    )
}

export default PrestadoresPage
