import { lazy, Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  MENU_LATERAL_HONORARIOS,
  MENU_SUPERIOR_HONORARIOS,
  OPCIONES_MENU_USUARIO,
  USUARIO_INICIAL,
} from './app/index'
import {
  SndCargando,
  SndEncabezado,
  SndMenuLateral,
  SndNavbar,
  SndPie,
  useNotificaciones,
  type UsuarioNavbar,
} from './components/snd'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PruebaFiel = lazy(() => import('./pages/PruebaFiel'))
const ValidarIdentidad = lazy(() => import('./pages/ValidarIdentidad'))

// Submódulos administrativos de Honorarios (pages/admin/)
const PadronPrestadores = lazy(() => import('./pages/admin/PadronPrestadores'))
const ContratosHonorarios = lazy(() => import('./pages/admin/ContratosHonorarios'))
const ModeloContrato = lazy(() => import('./pages/admin/ModeloContrato'))

// Vistas del prestador de servicios (pages/user/)
const PortalPrestador = lazy(() => import('./pages/user/PortalPrestador'))
const MisEntregables = lazy(() => import('./pages/user/MisEntregables'))

/**
 * Estructura principal de la aplicación del Módulo de Honorarios (`App.tsx`).
 * - Usa `.wrapper.wrapper--aside` del SND para integrar el menú lateral exclusivo de Honorarios.
 * - Conserva el encabezado institucional, barra superior con selector de tema (Guinda / Verde),
 *   menú de usuario y pie de página.
 */
export default function App() {
  const notificar = useNotificaciones()
  const [usuario, setUsuario] = useState<UsuarioNavbar | null>(USUARIO_INICIAL)
  const [menuColapsado, setMenuColapsado] = useState(false)

  const entrar = () => {
    setUsuario(USUARIO_INICIAL)
    notificar.exito('Sesión institucional iniciada.')
  }
  const salir = () => {
    setUsuario(null)
    notificar.info('Sesión institucional cerrada.')
  }

  return (
    <>
      <div className="fondo-textura" aria-hidden="true" />
      <div className="wrapper wrapper--aside">
        <SndEncabezado>
          <SndNavbar
            items={MENU_SUPERIOR_HONORARIOS}
            usuario={usuario}
            opcionesUsuario={OPCIONES_MENU_USUARIO}
            mostrarSesion
            onSesion={entrar}
            onCerrarSesion={salir}
          />
        </SndEncabezado>

        <SndMenuLateral
          items={MENU_LATERAL_HONORARIOS}
          titulo="Módulo de Honorarios"
          etiqueta="Navegación del Módulo de Honorarios"
          colapsado={menuColapsado}
          onColapsar={setMenuColapsado}
        />

        <main id="mainContent" tabIndex={-1}>
          <Suspense fallback={<SndCargando />}>
            <Routes>
              {/* Pantalla principal del Módulo de Honorarios */}
              <Route path="/" element={<Landing />} />

              {/* Submódulos administrativos de Honorarios */}
              <Route path="/admin/padron" element={<PadronPrestadores />} />
              <Route path="/admin/contratos" element={<ContratosHonorarios />} />
              <Route path="/admin/modelo-contrato" element={<ModeloContrato />} />

              {/* Vistas del prestador de servicios */}
              <Route path="/user/portal" element={<PortalPrestador />} />
              <Route path="/user/entregables" element={<MisEntregables />} />

              {/* Acceso, firma electrónica e identidad */}
              <Route path="/login" element={<Login />} />
              <Route path="/prueba-fiel" element={<PruebaFiel />} />
              <Route path="/validar-identidad" element={<ValidarIdentidad />} />

              {/* Ruta no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <SndPie />
      </div>
    </>
  )
}
