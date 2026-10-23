import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'

// Orden de carga (importa): 1) tema y estructura de PrimeReact, 2) íconos de PrimeReact,
// 3) ajuste de PrimeReact a los tokens del SND, 4) estilos de los componentes del SND, 5) globales.
// La hoja oficial del SND se enlaza desde index.html.
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './lib/primereact/snd-prime.css'
import './components/snd/snd.css'
import './index.css'

import App from './App'
import { NotificacionesProvider } from './components/snd'
import { TemaProvider } from './hooks'
import { registrarLocaleEs } from './lib'

registrarLocaleEs()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ locale: 'es', ripple: false }}>
      <TemaProvider>
        <NotificacionesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificacionesProvider>
      </TemaProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
