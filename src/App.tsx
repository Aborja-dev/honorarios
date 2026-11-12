import { lazy, Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  MENU_LATERAL_HONORARIOS,
  MENU_SUPERIOR_HONORARIOS,
  OPCIONES_MENU_USUARIO,
  USUARIO_INICIAL,
} from './lib/app'
import {
  SndCargando,
  SndEncabezado,
  SndMenuLateral,
  SndNavbar,
  SndPie,
  useNotificaciones,
  type UsuarioNavbar,
} from './components/snd'
const NotFound = lazy(() => import('./_pages/NotFound'))

// Submódulos administrativos de Honorarios
const Inicio = lazy(() => import('./pages/Inicio'))
const PadronPage = lazy(() => import('./pages/PadronPage'))
const PrestadoresPage = lazy(() => import('./_pages/PrestadoresPage'))
const ContratosHonorarios = lazy(() => import('./pages/ContratosHonorarios'))
const ModeloContrato = lazy(() => import('./pages/ModeloContrato'))
const AltaModelosContratos = lazy(() => import('./pages/AltaModelosContratos'))
const FormalizacionContratos = lazy(() => import('./pages/FormalizacionContratos'))
const ValidarIdentidad = lazy(() => import('./_pages/validacion/Page'))

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
              <Route path="/" element={<Inicio />} />

              {/* Submódulos administrativos de Honorarios */}
              <Route path="/admin/padron" element={<PadronPage />} />
              <Route path="/padron-prestadores-servicio" element={<PrestadoresPage />} />
              <Route path="/admin/contratos" element={<ContratosHonorarios />} />
              <Route path="/admin/modelo-contrato" element={<ModeloContrato />} />
              <Route path="/alta-modelos-contratos" element={<AltaModelosContratos />} />
              <Route path="/formalizacion-contratos" element={<FormalizacionContratos />} />

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
