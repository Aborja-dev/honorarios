import { lazy, Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  SndCargando,
  SndEncabezado,
  SndNavbar,
  SndPie,
  useNotificaciones,
  type ItemNavegacion,
  type OpcionUsuario,
  type UsuarioNavbar,
} from './snd'

const Inicio = lazy(() => import('./pages/Inicio'))
const Componentes = lazy(() => import('./pages/Componentes'))
const Colores = lazy(() => import('./pages/Colores'))

const MENU: ItemNavegacion[] = [
  { texto: 'Inicio', ruta: '/', exacta: true },
  { texto: 'Componentes', ruta: '/componentes' },
  { texto: 'Colores', ruta: '/colores' },
]

const OPCIONES_USUARIO: OpcionUsuario[] = [
  { texto: 'Mi perfil', icono: 'snd-user--avatar', ruta: '/' },
  { texto: 'Cambiar perfil', icono: 'snd-user--settings', ruta: '/' },
]

/**
 * Sesión de demostración, solo para mostrar el menú de usuario y el botón "Iniciar sesión".
 * Sustituir por la identidad que entregue el Servicio de Identidad Digital (SIDBG).
 */
const USUARIO_DEMO: UsuarioNavbar = { nombre: 'Regina Montenegro', rol: 'Perfil Ciudadano' }

/**
 * Estructura de página del SND.
 * - `.fondo-textura`: capa fija con la textura oficial, atenuada (ver index.css).
 * - `.wrapper`: contenedor del SND. Reserva el alto de la franja fija del encabezado
 *   (`padding-top: var(--bodyTop)`) y ordena encabezado, contenido y pie en una cuadrícula.
 * - Las notificaciones las dibuja `NotificacionesProvider` (ver main.tsx).
 */
export default function App() {
  const notificar = useNotificaciones()
  const [usuario, setUsuario] = useState<UsuarioNavbar | null>(USUARIO_DEMO)

  const entrar = () => {
    setUsuario(USUARIO_DEMO)
    notificar.exito('Sesión de demostración iniciada.')
  }
  const salir = () => {
    setUsuario(null)
    notificar.info('Sesión de demostración cerrada.')
  }

  return (
    <>
      <div className="fondo-textura" aria-hidden="true" />
      <div className="wrapper">
        <SndEncabezado>
          <SndNavbar
            items={MENU}
            usuario={usuario}
            opcionesUsuario={OPCIONES_USUARIO}
            mostrarSesion
            onSesion={entrar}
            onCerrarSesion={salir}
          />
        </SndEncabezado>

        <main id="mainContent" tabIndex={-1}>
          <Suspense fallback={<SndCargando />}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/componentes" element={<Componentes />} />
              <Route path="/colores" element={<Colores />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <SndPie />
      </div>
    </>
  )
}
