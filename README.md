# Módulo de Honorarios · SABG — Documentación Técnica

Aplicación frontend en **React 19 + TypeScript + Vite 8** para el **Módulo de Honorarios**, construida sobre la base oficial del **Sistema Nacional de Diseño (SND v1.3.0)** del Gobierno de México y **PrimeReact 10.9.9**.

---

## Tabla de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Stack Tecnológico y Versiones](#2-stack-tecnológico-y-versiones)
3. [Instalación y Comandos de Desarrollo](#3-instalación-y-comandos-de-desarrollo)
4. [Arquitectura y Estructura de Carpetas](#4-arquitectura-y-estructura-de-carpetas)
5. [Descripción Detallada por Capa](#5-descripción-detallada-por-capa)
6. [Rutas y Navegación del Módulo de Honorarios](#6-rutas-y-navegación-del-módulo-de-honorarios)
7. [Sistema de Diseño (SND + PrimeReact)](#7-sistema-de-diseño-snd--primereact)
8. [Guía de Escalabilidad para Desarrolladores](#8-guía-de-escalabilidad-para-desarrolladores)
9. [Despliegue (Docker y Nginx)](#9-despliegue-docker-y-nginx)

---

## 1. Resumen del Proyecto

El **Módulo de Honorarios** centraliza la operación administrativa y normativa de los contratos de prestación de servicios profesionales bajo el régimen de honorarios:

* **Tablero Principal (`Landing.tsx`):** Vista dividida con buscador global, bloque de bienvenida (*"Bienvenido al módulo de Honorarios"*), indicadores circulares de avance presupuestal por trimestre, gráfica semántica de estatus contractual, controles de ventanilla/firma y panel derecho de submódulos y cumplimiento jurídico.
* **Submódulos Operativos (`pages/admin/`):**
  1. **Padrón del prestador de servicios (`PadronPrestadores.tsx`):** Registro único de prestadores, validación de expediente digital y constancias fiscales.
  2. **Contratos de honorarios (`ContratosHonorarios.tsx`):** Ciclo contractual, suficiencia presupuestal (Partida 12101), anexos y estatus de firma.
  3. **Modelo de contrato (`ModeloContrato.tsx`):** Catálogo de plantillas jurídicas dictaminadas para Capítulo 1000, Capítulo 3000 y honorarios asimilados a salarios.
* **Portal del Prestador y Entregables (`pages/user/`):** Consulta de contrato vigente y seguimiento de informes mensuales de actividades.
* **Identidad y Firma Electrónica (`PruebaFiel.tsx`, `ValidarIdentidad.tsx`, `Login.tsx`):** Validación criptográfica de `e.firma` (`.cer`, `.key`) y verificación de CURP/RFC.

---

## 2. Stack Tecnológico y Versiones

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | `>= 22.12.0` | Entorno de ejecución requerido por Vite 8 y Vitest |
| **React / React DOM** | `19.3.0` | Librería de interfaz de usuario |
| **TypeScript** | `~5.9.3` | Tipado estático estricto (`strict: true`) |
| **Vite** | `^8.3.4` | Empaquetador y servidor de desarrollo (puerto `4300`) |
| **React Router DOM** | `7.18.4` | Enrutamiento SPA con carga diferida (`React.lazy`) |
| **PrimeReact** | `10.9.9` (fija) | Componentes complejos (`DataTable`, `Dialog`, `Stepper`, `Dropdown`, `Calendar`, `InputText`) bajo licencia MIT |
| **PrimeIcons** | `7.0.0` (fija) | Iconografía base de soporte para PrimeReact (licencia MIT) |
| **SND v1.3.0** | CDN Oficial | Hojas de estilo (`snd-guinda.css`, `snd-verde.css`), fuentes (`Patria`, `Noto Sans`) e íconos SVG oficiales |

> **Nota sobre licencias:** Las versiones de `primereact` (`10.9.9`) y `primeicons` (`7.0.0`) deben mantenerse fijas sin el prefijo `^`, ya que son las últimas versiones publicadas bajo licencia **MIT** antes del cambio a licencia comercial en PrimeReact 11+ / PrimeIcons 8+.

---

## 3. Instalación y Comandos de Desarrollo

```bash
# 1. Instalar dependencias respetando el lockfile
yarn install --frozen-lockfile
# (o con npm en Windows PowerShell: npm.cmd install)

# 2. Iniciar servidor de desarrollo en http://localhost:4300
yarn dev
# (o npm.cmd run dev)

# 3. Verificar tipos de TypeScript
yarn typecheck
# (o npm.cmd run typecheck)

# 4. Generar build de producción en dist/
yarn build
# (o npm.cmd run build)

# 5. Previsualizar build de producción localmente
yarn preview

# 6. Verificar integridad de la estructura de carpetas
node scripts/verificar-estructura.mjs
```

---

## 4. Arquitectura y Estructura de Carpetas

El proyecto está segmentado por responsabilidades para facilitar el mantenimiento y crecimiento modular:

```text
├── public/
│   ├── favicon.ico
│   └── texturas/
│       └── textura-blanca.svg          # Textura oficial de fondo del Gobierno de México 2024-2030
├── scripts/
│   └── verificar-estructura.mjs        # Script de validación de arquitectura de directorios
├── src/
│   ├── apollo/                         # Cliente y consultas GraphQL para integración con backend
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   ├── app/                            # Configuración global de aplicación y navegación de Honorarios
│   │   ├── config.ts
│   │   ├── navigation.ts
│   │   └── index.ts
│   ├── components/                     # Componentes reutilizables (SND oficial + Dominio Honorarios)
│   │   ├── snd/                        # Componentes base del Sistema Nacional de Diseño
│   │   │   ├── SndBoton.tsx
│   │   │   ├── SndBuscador.tsx
│   │   │   ├── SndCargando.tsx
│   │   │   ├── SndEncabezado.tsx
│   │   │   ├── SndIcono.tsx
│   │   │   ├── SndMensaje.tsx
│   │   │   ├── SndMenuLateral.tsx
│   │   │   ├── SndMenuUsuario.tsx
│   │   │   ├── SndNavbar.tsx
│   │   │   ├── SndPie.tsx
│   │   │   ├── SndPildora.tsx
│   │   │   ├── SndSelectorTema.tsx
│   │   │   ├── SndTooltip.tsx
│   │   │   ├── notificaciones.tsx
│   │   │   ├── snd.css
│   │   │   └── index.ts
│   │   ├── honorarios/                 # Bloques modulares del dominio de Honorarios
│   │   │   ├── BandejaSubmodulo.tsx
│   │   │   ├── BienvenidaHonorarios.tsx
│   │   │   ├── CifrasYEstadisticas.tsx
│   │   │   ├── Honorarios.css
│   │   │   ├── ModalRegistroHonorarios.tsx
│   │   │   └── PanelSubmodulos.tsx
│   │   └── index.ts                    # Punto único de exportación de componentes
│   ├── hooks/                          # Hooks personalizados de React
│   │   ├── useMovil.ts                 # Detección de viewport móvil (< 768px)
│   │   ├── useTema.tsx                 # Proveedor y hook de cambio de gama (Guinda / Verde)
│   │   ├── useTitulo.ts                # Actualización declarativa de document.title
│   │   └── index.ts
│   ├── lib/                            # Adaptadores y configuración de librerías externas
│   │   ├── primereact/
│   │   │   ├── localeEs.ts             # Traducción al español de PrimeReact
│   │   │   └── snd-prime.css           # Mapeo de componentes PrimeReact a tokens CSS del SND
│   │   ├── sndConfig.ts                # Contexto de URLs del CDN de estilos e íconos del SND
│   │   ├── testSetup.ts                # Configuración de entorno jsdom para Vitest
│   │   └── index.ts
│   ├── pages/                          # Vistas enrutables de la aplicación
│   │   ├── admin/                      # Vistas de gestión de los submódulos de Honorarios
│   │   │   ├── PadronPrestadores.tsx
│   │   │   ├── ContratosHonorarios.tsx
│   │   │   ├── ModeloContrato.tsx
│   │   │   └── index.ts
│   │   ├── user/                       # Vistas orientadas al prestador de servicios
│   │   │   ├── PortalPrestador.tsx
│   │   │   ├── MisEntregables.tsx
│   │   │   └── index.ts
│   │   ├── Landing.tsx                 # Pantalla principal dividida del Módulo de Honorarios
│   │   ├── Login.tsx                   # Inicio de sesión institucional
│   │   ├── NotFound.tsx                # Página 404
│   │   ├── PruebaFiel.tsx              # Validación y firma electrónica con e.firma (FIEL)
│   │   └── ValidarIdentidad.tsx        # Verificación de CURP y RFC del prestador
│   ├── services/                       # Capa de negocio, tipos de dominio y clientes HTTP
│   │   ├── fiel.service.ts
│   │   ├── honorarios.service.ts
│   │   ├── http.client.ts
│   │   └── index.ts
│   ├── utils/                          # Funciones utilitarias puras
│   │   ├── cn.ts                       # Unión condicional de clases CSS y generador de IDs ARIA
│   │   ├── texto.ts                    # Normalización sin acentos, formato numérico y folios
│   │   └── index.ts
│   ├── App.tsx                         # Layout maestro (.wrapper--aside), sidebar y enrutador
│   ├── index.css                       # Variables globales, ajuste de .wrapper y textura de fondo
│   └── main.tsx                        # Punto de entrada y orden estricto de hojas CSS
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Descripción Detallada por Capa

### `src/app/` — Configuración de Aplicación y Navegación
* **`navigation.ts`:** Define `MENU_LATERAL_HONORARIOS` y `MENU_SUPERIOR_HONORARIOS`. El menú lateral (`SndMenuLateral`) muestra exclusivamente las secciones del Módulo de Honorarios.
* **`config.ts`:** Define constantes institucionales (`NOMBRE_SISTEMA`, `VERSION_SISTEMA`, `EJERCICIO_FISCAL`) y las opciones del menú de perfil de usuario.

### `src/components/` — Componentes UI y de Dominio
Se divide en dos subcarpetas exportadas desde `src/components/index.ts`:
1. **`components/snd/`:** Envuelve el HTML y clases del SND v1.3.0 en componentes React controlados y accesibles (`SndBoton`, `SndBuscador`, `SndMenuLateral`, `SndPildora`, `SndPildoraFiltro`, `SndMensaje`, `SndTooltip`, `SndIcono`, `useNotificaciones`).
2. **`components/honorarios/`:** Componentes específicos del negocio de Honorarios:
   * `BienvenidaHonorarios`: Banner institucional *"Bienvenido al módulo de Honorarios"*.
   * `CifrasYEstadisticas`: Tarjeta de avance presupuestal trimestral con controles `−`/`+`, gráfica circular semántica de estatus (`Vigentes`, `En firma`, `En revisión`, `Por vencer`) y tarjetas operativas de Ventanilla de Padrón y Firma Electrónica.
   * `PanelSubmodulos`: Cuadrícula interactiva con los submódulos (*Padrón del prestador de servicios*, *Contratos de honorarios*, *Modelo de contrato*, *Suficiencia y entregables*), columna vertical de botones de alta rápida (`+ Alta Prestador`, `+ Nuevo Contrato`, `+ Nuevo Modelo`), filtros por categoría y arco de validación jurídica.
   * `BandejaSubmodulo`: Tabla `DataTable` de PrimeReact con paginación, ordenamiento, búsqueda instantánea y exportación.
   * `ModalRegistroHonorarios`: Diálogo modal con barra de pasos (`Stepper`), `InputText`, `Dropdown` y `Calendar`.

### `src/services/` y `src/apollo/` — Acceso a Datos
* **`services/honorarios.service.ts`:** Define los contratos de datos (`SubmoduloInfo`, `RegistroSubmodulo`, `DatosTrimestre`) y expone los métodos de consulta para el tablero y las vistas de administración.
* **`services/http.client.ts`:** Wrapper tipado sobre `fetch` para llamadas REST.
* **`apollo/client.ts` y `apollo/queries.ts`:** Cliente ligero y definiciones de consultas GraphQL (`QUERY_RESUMEN_HONORARIOS`, `QUERY_PADRON_PRESTADORES`, `QUERY_CONTRATOS_HONORARIOS`, `QUERY_MODELOS_CONTRATO`).

---

## 6. Rutas y Navegación del Módulo de Honorarios

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `pages/Landing.tsx` | Tablero principal dividido del Módulo de Honorarios |
| `/admin/padron` | `pages/admin/PadronPrestadores.tsx` | Submódulo: Padrón del prestador de servicios |
| `/admin/contratos` | `pages/admin/ContratosHonorarios.tsx` | Submódulo: Contratos de honorarios |
| `/admin/modelo-contrato` | `pages/admin/ModeloContrato.tsx` | Submódulo: Modelo de contrato |
| `/user/portal` | `pages/user/PortalPrestador.tsx` | Portal de consulta para la persona prestadora |
| `/user/entregables` | `pages/user/MisEntregables.tsx` | Seguimiento de suficiencia e informes mensuales |
| `/prueba-fiel` | `pages/PruebaFiel.tsx` | Validación y firmado con `e.firma` (`.cer` / `.key`) |
| `/validar-identidad` | `pages/ValidarIdentidad.tsx` | Verificación de CURP y RFC del prestador |
| `/login` | `pages/Login.tsx` | Inicio de sesión institucional |
| `*` | `pages/NotFound.tsx` | Página 404 con retorno al tablero |

---

## 7. Sistema de Diseño (SND + PrimeReact)

### Orden de Carga de Estilos (`src/main.tsx`)
El orden de importación en `src/main.tsx` es estricto y no debe alterarse:
1. `primereact/resources/themes/lara-light-blue/theme.css`
2. `primereact/resources/primereact.min.css`
3. `primeicons/primeicons.css`
4. `./lib/primereact/snd-prime.css` *(sobrescribe los colores fijos de PrimeReact con las variables del SND)*
5. `./components/snd/snd.css` *(ajustes propios de los componentes SND)*
6. `./index.css` *(layout `.wrapper` y textura institucional)*

### Cambio Dinámico de Tema (Guinda / Verde)
`TemaProvider` (`src/hooks/useTema.tsx`) actualiza el atributo `href` del `<link id="snd-tema">` en `index.html` entre `snd-guinda.css` y `snd-verde.css`, persistiendo la preferencia en `localStorage`. Todos los componentes propios y de PrimeReact utilizan variables CSS del SND:
* Identidad: `var(--principal)`, `var(--gama100)` a `var(--gama950)`
* Neutros: `var(--neutro100)` a `var(--neutro800)`
* Semánticos: `var(--verde500)`, `var(--azul500)`, `var(--amarillo500)`, `var(--rojo500)`, `var(--dorado500)`, `var(--morado500)`

---

## 8. Guía de Escalabilidad para Desarrolladores

### Cómo agregar un nuevo Submódulo o Pantalla Administrativa
1. **Servicio:** Añade los tipos y métodos de consulta en `src/services/honorarios.service.ts` (o la query GraphQL en `src/apollo/queries.ts`).
2. **Página:** Crea el componente de vista dentro de `src/pages/admin/NuevoSubmodulo.tsx` y expórtalo en `src/pages/admin/index.ts`.
3. **Ruta:** Registra la ruta con `lazy(() => import('./pages/admin/NuevoSubmodulo'))` en `src/App.tsx`.
4. **Sidebar:** Añade el ítem correspondiente en `MENU_LATERAL_HONORARIOS` dentro de `src/app/navigation.ts`.

### Cómo incorporar un nuevo componente de PrimeReact
Si necesitas utilizar un componente adicional de PrimeReact que no esté en `src/lib/primereact/snd-prime.css` (por ejemplo `TabView` o `MultiSelect`), busca sus selectores con color azul en `node_modules/primereact/resources/themes/lara-light-blue/theme.css` y vincúlalos a `var(--principal)` y `var(--gama100)` en `src/lib/primereact/snd-prime.css`.

---

## 9. Despliegue (Docker y Nginx)

El proyecto conserva la configuración lista para contenedores y GitLab Auto DevOps:

```bash
docker build -t honorarios-react-front .
docker run --rm -p 5000:5000 honorarios-react-front
```

* La imagen construye el bundle estático con Node 24 y lo sirve en el puerto `5000` mediante `nginxinc/nginx-unprivileged` con soporte SPA (`try_files $uri $uri/ /index.html`) y cabeceras de seguridad CSP preconfiguradas en `nginx/security-headers.conf`.
