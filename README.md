# snd-react-base — Manual técnico

Base de aplicación React que implementa el **Sistema Nacional de Diseño (SND)** del Gobierno de
México, versión de hojas de estilo **v1.3.0** (15-sep-2026). Es la contraparte en React de
`snd-angular-base`: mismos componentes, mismas páginas de referencia y la misma batería de
verificación. Sirve como punto de partida para construir sistemas con la identidad visual oficial.

> **Versión sin TypeScript.** Para equipos que trabajan en JavaScript existe `snd-react-js-base`, con el mismo
> código sin anotaciones de tipos (las props se documentan con JSDoc).

> **Estándar institucional.** El documento de arquitectura define Angular como frontend principal y
> React como alternativa validada. Usar esta base cuando el proyecto lo justifique.

## Contenido

1. [Alcance](#1-alcance)
2. [Requisitos, versiones y licencias](#2-requisitos-versiones-y-licencias)
3. [Instalación y comandos](#3-instalación-y-comandos)
4. [Arquitectura](#4-arquitectura)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [Replicar en otro proyecto](#6-replicar-en-otro-proyecto)
7. [Configuración](#7-configuración)
8. [Referencia de componentes](#8-referencia-de-componentes)
9. [Hooks, contextos y PrimeReact](#9-hooks-contextos-y-primereact)
10. [Decisiones de diseño](#10-decisiones-de-diseño)
11. [Desviaciones y defectos del SND v1.3.0](#11-desviaciones-y-defectos-del-snd-v130)
12. [Accesibilidad](#12-accesibilidad)
13. [Pruebas y verificación](#13-pruebas-y-verificación)
14. [Diferencias con la base Angular](#14-diferencias-con-la-base-angular)
15. [Limitaciones y pendientes](#15-limitaciones-y-pendientes)
16. [Solución de problemas](#16-solución-de-problemas)

17. [Despliegue (Docker, nginx y GitLab)](#17-despliegue-docker-nginx-y-gitlab)
---

## 1. Alcance

| Incluye | No incluye |
|---|---|
| Layout institucional: encabezado, barra de navegación, pie de página, menú lateral | Autenticación real (la sesión de la demostración es simulada) |
| Tema guinda y verde con selector | Modo oscuro (el SND no lo define) |
| Componentes del SND como componentes React (botón, mensaje, píldora, tooltip, buscador, notificaciones, íconos…) | Plantillas de páginas del SND (se distribuyen en Figma) |
| Ajuste de PrimeReact a los tokens del SND (tabla, diálogo, dropdown, calendario, pasos) | Botón de accesibilidad y menú de idioma del navbar (el SND los documenta como componente externo) |
| Páginas de referencia: `/componentes` y `/colores` | Versión móvil del menú lateral (barra inferior con «Más») |

Principio de diseño: **el SND define la apariencia y esta base define el comportamiento**. El SND
publica HTML y clases CSS sin JavaScript reutilizable para frameworks; los componentes de este
proyecto envuelven ese marcado y añaden estado, accesibilidad y eventos.

## 2. Requisitos, versiones y licencias

| Elemento | Versión | Licencia | Nota |
|---|---|---|---|
| Node.js | 22.22.2 o superior, o 24.15 o superior (la imagen de Docker usa 24.21.0) | — | Lo exige `jsdom` (pruebas); Vite 8 pide ≥ 22.12. Con una 22.x anterior a 22.22.2, `yarn install` falla. Estándar institucional: Node 22 o superior |
| React / React DOM | **19.3.0** | MIT | Fijadas sin rango |
| React Router | **7.18.4** | MIT | |
| PrimeReact | **10.9.9** | MIT | **Última línea libre.** Fijada sin rango (ver §2.1) |
| PrimeIcons | **7.0.0** | MIT | **Fijada sin rango:** la 8.x es comercial (ver §2.1) |
| Vite | 8.3 | MIT | |
| `@vitejs/plugin-react` | 6.1 | MIT | |
| TypeScript | 5.9 | Apache-2.0 | Existe la 7.0; no se usa porque su compatibilidad con Vite 8 no se ha verificado |
| Vitest + Testing Library + jsdom | 5.0 / 16 / 30 | MIT | Configurados, pero **la base no incluye pruebas** (ver §13) |
| Gestor de paquetes | **Yarn 1.22 (clásico)** | — | Lockfile `yarn.lock`. No mezclar con `npm install` |
| SND (hojas de estilo) | v1.3.0 | — | Cargadas desde `https://www.snd.gob.mx/snd/v1/` |

### 2.1 Licencias y restricción de versiones

Verificado el 2026-10-09 leyendo el `LICENSE.md` de cada versión publicada. Confirmar de nuevo en
https://primeui.dev/licenses antes de decidir cualquier actualización.

| Paquete | Líneas | Licencia |
|---|---|---|
| `primereact` | 8.x, 9.x, **10.x** | MIT |
| `primereact` | **11.x en adelante** | **PrimeUI License (comercial):** exige clave de licencia; gratuita solo para organizaciones que cumplan los criterios de su «Community License» (menos de 1 millón de USD de ingresos anuales, menos de 5 desarrolladores, menos de 10 empleados, entre otros) |
| `primeicons` | ≤ 7.x | MIT |
| `primeicons` | **8.x en adelante** | **PrimeUI License (comercial)** |
| `@primeuix/themes` | 3.x en adelante | PrimeUI License (comercial). **No se usa en este proyecto** (PrimeReact 10 no lo necesita) |

Por eso `primereact` y `primeicons` están **fijadas a versión exacta** en `package.json`: un
`yarn upgrade` o un rango con `^` no debe poder llevar el proyecto a una versión comercial. Antes de
subir a PrimeReact 11 hay que validar con el área jurídica y de compras si la institución puede usar
la licencia de PrimeUI, o sustituir PrimeReact por otra librería (ver §15).

Auditoría de las dependencias de producción (19 paquetes, árbol completo): 18 con licencia MIT y 1 con
BSD-3-Clause; ninguna requiere revisión. Se reproduce con `yarn licenses list --prod`.

## 3. Instalación y comandos

```sh
yarn install --frozen-lockfile   # instala las versiones exactas de yarn.lock
yarn dev                         # servidor de desarrollo en http://localhost:4300
yarn build                       # tipos + compilación de producción en dist/
yarn preview                     # sirve dist/ en http://localhost:4300
yarn typecheck                   # solo verificación de tipos
yarn test                        # no ejecuta pruebas: muestra «No tests configured» (ver §13)
yarn test:unit                   # pruebas unitarias reales (Vitest); sin archivos de prueba termina con código 1 (§13)
yarn test:watch                  # pruebas en modo observación
```

Las pruebas no requieren navegador (se ejecutan sobre jsdom). El servidor de desarrollo y el build
requieren acceso de red a `www.snd.gob.mx` para cargar hojas de estilo, fuentes e íconos (ver §7).

## 4. Arquitectura

```
┌──────────────────────────── Aplicación ────────────────────────────┐
│  App.tsx / index.css      estructura de página + menú + sesión     │
│  pages/                   páginas de la aplicación                 │
├─────────────────────────────────────────────────────────────────────┤
│  snd/        componentes del SND   │  primereact/  ajuste + idioma │
│  (HTML + clases del SND)           │  (componentes complejos)      │
├─────────────────────────────────────────────────────────────────────┤
│  core/       configuración, tema, ancho de pantalla, título         │
├─────────────────────────────────────────────────────────────────────┤
│  Hoja del SND (snd-guinda.css | snd-verde.css)  ← variables CSS     │
└─────────────────────────────────────────────────────────────────────┘
```

**Mecanismo del tema.** La hoja del SND declara variables CSS (`--gama100…950`, `--principal`,
`--neutro100…800`, `--rojo500`, etc.). La hoja guinda y la hoja verde definen las mismas variables con
valores distintos. Al reemplazar la hoja activa:

1. `TemaProvider` cambia el `href` del `<link id="snd-tema">`.
2. El navegador recalcula las variables.
3. Los componentes del SND **y** los de PrimeReact cambian de color, porque `primereact/snd-prime.css`
   los enlaza a esas variables.

**Dos capas de componentes.** Se aplica un criterio fijo:

| Capa | Cuándo se usa | Ejemplos |
|---|---|---|
| `snd/` | El SND publica el marcado y las clases del componente | botón, mensaje, píldora, tooltip, navbar, pie |
| `primereact/` | El componente requiere lógica compleja que el SND no define | tabla, diálogo, dropdown, calendario, pasos |

Un componente nuevo se resuelve primero con el marcado del SND; solo si el SND no lo cubre se usa
PrimeReact con el ajuste, y en último caso se escribe CSS propio tomando valores de las variables del SND.

## 5. Estructura del proyecto

```
public/
  favicon.ico                  favicon de gob.mx
  texturas/textura-blanca.svg  textura oficial 2024-2030 (fondo de página)
index.html                     enlaza la hoja del SND (<link id="snd-tema">)
vite.config.ts                 Vite + configuración de Vitest
src/
  main.tsx                     proveedores y orden de carga de CSS
  App.tsx                      estructura de página (.wrapper), rutas y sesión de demostración
  index.css                    ajustes globales, estructura de página y textura
  core/
    sndConfig.ts               contexto SndConfig (URLs de hojas e íconos)
    tema.tsx                   TemaProvider y useTema
    useMovil.ts                hook de ancho de pantalla (< 768 px)
    useTitulo.ts               hook del título de pestaña
    base.ts                    `NOMBRE_BASE`: subtítulo de las páginas de demostración
  snd/                         componentes del SND (ver §8), snd.css e index.ts (API pública)
  primereact/
    snd-prime.css              ajuste de PrimeReact a las variables del SND
    localeEs.ts                textos de PrimeReact en español
  pages/                       Inicio, Componentes (catálogo), Colores (paleta)
  test/setup.ts                configuración de las pruebas (sin archivos de prueba; ver §13)
```

`snd/index.ts` es la API pública de los componentes; las importaciones desde otras carpetas se hacen
siempre a través de él (`import { SndBoton } from './snd'`).

## 6. Replicar en otro proyecto

### 6.1 Proyecto nuevo (copia de la plantilla)

1. Crear el repositorio a partir de este (plantilla de GitLab o copia sin historial: clonar, borrar `.git`, `git init`).
2. Renombrar: `name` en `package.json`, `<title>` en `index.html` y este README.
3. `yarn install --frozen-lockfile` y `yarn build`. Deben pasar antes de modificar nada. (`yarn test:unit` no aplica hasta agregar pruebas propias; ver §13.)
4. Reemplazar la demostración:
   - `App.tsx`: el menú (`MENU`), las opciones de usuario y la sesión simulada (`USUARIO_DEMO`). Conectar con el Servicio de Identidad Digital.
   - `core/base.ts`: `NOMBRE_BASE` es el subtítulo (Angular TS, React TS o React JS) que las páginas de demostración muestran bajo el título. Sustituirlo por las siglas o el nombre del sistema, o retirar el subtítulo de las páginas.
   - Rutas y `pages/`: las páginas del sistema. `Componentes` y `Colores` pueden conservarse como referencia interna o retirarse.
   - `snd/SndPie.tsx`: sustituir los enlaces con destino `#` en `COLUMNA_2` (avisos de privacidad, política de seguridad, mapa de sitio, administraciones anteriores).
5. **No modificar** las versiones fijadas de `primereact` y `primeicons` (ver §2.1).
6. Verificar el pipeline de CI: debe ejecutar SAST, Secret Detection, Dependency Scanning y Code Quality.

### 6.2 Proyecto React existente (integración)

1. Instalar dependencias en las versiones indicadas (**sin rango**):
   ```sh
   yarn add primereact@10.9.9 primeicons@7.0.0 --exact
   yarn add react-router-dom   # si no existe
   ```
2. Copiar a `src/`: carpetas `core/`, `snd/` y `primereact/`.
3. Copiar `public/texturas/` y `public/favicon.ico` (si se usan).
4. En `index.html`, añadir el `<link id="snd-tema" rel="stylesheet" href="https://www.snd.gob.mx/snd/v1/snd-guinda.css">`.
5. Copiar de `src/index.css` las variables y reglas globales.
6. En `main.tsx`, respetar el **orden de carga de CSS** (ver §10) y envolver la aplicación con
   `PrimeReactProvider`, `TemaProvider`, `NotificacionesProvider` y el router, e invocar `registrarLocaleEs()`.
7. Adoptar la estructura de página de `App.tsx` (`.wrapper`, encabezado, `main#mainContent`, pie).

### 6.3 Proyecto con otra tecnología

Los componentes son de React. Para Angular existe `snd-angular-base`. Para JavaScript plano se
reaprovechan solo las hojas del SND y la paleta.

## 7. Configuración

### 7.1 Origen de los recursos del SND

Las hojas (`snd-guinda.css`, `snd-verde.css`), las **fuentes** (Noto Sans y Patria) y los **íconos** se
cargan desde la web; no se guardan en el repositorio.

| Recurso | Cómo se resuelve |
|---|---|
| Hojas de estilo | `<link>` en `index.html`; `TemaProvider` cambia el `href` al alternar gama |
| Fuentes | Rutas relativas dentro de la hoja (`./fuentes/…`), por lo que resuelven en la misma carpeta |
| Íconos y pictogramas | `<SndIcono>` descarga el SVG de `SndConfig.iconosUrls`, en orden, con caché en memoria |

La URL base de `index.html` debe coincidir con `SndConfig.baseUrl`. Para usar una copia interna,
envolver la aplicación en el contexto:

```tsx
<SndConfigContext.Provider value={{ baseUrl: 'https://host/snd/v1', iconosUrls: ['https://host/snd/v1/iconos'] }}>
  <App />
</SndConfigContext.Provider>
```

### 7.2 Política de seguridad de contenido (CSP)

El sitio que publique la aplicación debe permitir el origen del SND en:

| Directiva | Motivo |
|---|---|
| `style-src` | Hojas de estilo |
| `font-src` | Fuentes Noto Sans y Patria |
| `img-src` | Imágenes referenciadas por la hoja |
| `connect-src` | Los íconos se descargan con `fetch` |

Si se usa `framework-gb.cdn.gob.mx` como respaldo de íconos, también debe permitirse.

### 7.3 Textura de fondo

`index.css` define la capa `.fondo-textura`. Se ajusta con `--textura-opacidad` (0 a 1; por defecto
0.7). El SND pide usar la textura como elemento complementario y sin que reste legibilidad.

## 8. Referencia de componentes

Todos son componentes de función con TypeScript. Se importan desde `snd/index.ts`. El detalle
completo de props y ejemplos está en el comentario JSDoc de cada archivo.

### 8.1 Layout

| Componente | Props principales |
|---|---|
| `SndEncabezado` | `idContenido` (destino del enlace «Ir al contenido principal»), `children` (normalmente `SndNavbar`) |
| `SndNavbar` | `items`, `usuario`, `opcionesUsuario`, `mostrarSesion`, `etiqueta`, `onSesion`, `onCerrarSesion` |
| `SndMenuUsuario` | `nombre`, `rol`, `opciones`, `onCerrarSesion` |
| `SndMenuLateral` | `items`, `titulo`, `etiqueta`, `colapsado`, `onColapsar` (controlado) |
| `SndPie` | `lite`, `version` |
| `SndSelectorTema` | — |

**Estructura de página obligatoria.** El encabezado reserva su espacio mediante el contenedor
`.wrapper` del SND (`padding-top: var(--bodyTop)`):

```tsx
<div className="wrapper">
  <SndEncabezado>
    <SndNavbar items={menu} />
  </SndEncabezado>
  <main id="mainContent" tabIndex={-1}>…</main>
  <SndPie />
</div>
```

Para menú lateral, el contenedor es `<div className="wrapper wrapper--aside">` y `SndMenuLateral` se
coloca entre el encabezado y `<main>`.

### 8.2 Controles y retroalimentación

| Componente | Props principales |
|---|---|
| `SndBoton` | `variante` (`primario`\|`secundario`\|`fantasma`\|`limpio`), `cargando`, `etiquetaCargando`, y los atributos nativos de `<button>` (`disabled`, `onClick`…) |
| `SndBotonEnlace` | Como `SndBoton`, más `deshabilitado`; `to` (React Router) o `href` |
| `SndMensaje` | `tipo` (`info`\|`exito`\|`alerta`\|`error`\|`neutro`), `sinBorde` |
| `NotificacionesProvider` + `useNotificaciones` | métodos `exito()`, `info()`, `alerta()`, `error()` |
| `SndPildora` | `tipo`, `punto` |
| `SndPildoraFiltro` | `activo`, `onCambio` (controlado) |
| `SndTooltip` | `texto`, `posicion`, `tamano`, `icono`, `etiqueta` |
| `SndBuscador` | `variante` (`principal`\|`general`), `etiqueta`, `placeholder`, `ancho`, `valor`, `onValor`, `onBuscar` (controlado) |
| `SndCargando` | `tamano` (`md`\|`lg`), `texto` |
| `SndIcono` | `nombre`, `tamano`, `pictograma`, `etiqueta`, `colorOriginal`, `ajuste`, `className` |

Notas de uso:

- **Botón.** `SndBoton` es siempre un `<button>`; un enlace con aspecto de botón es `SndBotonEnlace`. Un enlace deshabilitado (`deshabilitado`) cancela el clic en la fase de captura: no navega ni dispara otros `onClick`. `aria-disabled` y `tabindex` solo informan; no impiden la activación por sí solos.
- **Notificaciones.** `NotificacionesProvider` se coloca una vez en la raíz y dibuja un contenedor fijo debajo del encabezado. Cada notificación desaparece a los 5 s; el temporizador se pausa mientras el cursor está encima. Es implementación propia, sin PrimeReact.
- **Ícono.** El nombre se escribe como en la documentación del SND, con prefijo `snd-` (`snd-home`). Hereda `currentColor`; se colorea con clases del SND (`color--azul500`).
- **Componentes controlados.** `SndBuscador`, `SndPildoraFiltro` y `SndMenuLateral` no guardan estado propio: quien los usa lo mantiene y lo pasa por props.

### 8.3 Componentes complejos (PrimeReact)

Se usan directamente: `DataTable` + `Column`, `Dialog`, `Dropdown`, `Calendar`, `InputText`,
`Stepper` + `StepperPanel`. `pages/Componentes.tsx` contiene un ejemplo de cada uno. Otro componente
de PrimeReact requiere antes añadir sus selectores a `snd-prime.css` (ver §9.3).

## 9. Hooks, contextos y PrimeReact

### 9.1 Hooks y contextos (`core/`)

| Elemento | Responsabilidad |
|---|---|
| `SndConfigContext` / `useSndConfig` | URLs de hojas e íconos (valor por defecto: CDN oficial) |
| `TemaProvider` / `useTema` | `{ tema, establecer('guinda'\|'verde') }`; persiste en `localStorage` (`snd-tema`); mantiene el `<link id="snd-tema">` |
| `useMovil` | `true` por debajo de 768 px; gobierna la apertura de los `<details>` |
| `useTitulo` | Fija `document.title` mientras la página está montada |
| `useNotificaciones` | Dispara notificaciones (requiere `NotificacionesProvider`) |

### 9.2 Proveedores obligatorios

```tsx
// main.tsx
<PrimeReactProvider value={{ locale: 'es', ripple: false }}>
  <TemaProvider>
    <NotificacionesProvider>
      <BrowserRouter><App /></BrowserRouter>
    </NotificacionesProvider>
  </TemaProvider>
</PrimeReactProvider>
```

### 9.3 Ajuste de PrimeReact

PrimeReact 10 **no tiene presets**: su tema (`lara-light-blue/theme.css`) escribe los colores como
valores fijos (por ejemplo `#3b82f6`), no como variables CSS. Por eso `primereact/snd-prime.css`
sobrescribe, selector por selector, los componentes que usa la aplicación, con referencias a las
variables del SND (`--principal`, `--gama*`, `--neutro*`, `--rojo500`). Alcance actual:

| Componente | Ajuste | Origen |
|---|---|---|
| `InputText`, `Dropdown`, `Calendar` | Borde neutro 600, radio 8, foco en `--principal` | Mismo criterio que los campos de la base Angular |
| Campos inválidos (`InputText`, `Dropdown`, `MultiSelect`, `Calendar`, `InputNumber`, `Password`, `AutoComplete`, `Chips`) | Borde en `--rojo500` reforzado a 2 px efectivos con un anillo (`box-shadow`), sin cambiar el tamaño de la caja | El tema de PrimeReact solo cambia el color del borde; el tono del SND es oscuro y se confunde con el guinda |
| `Dropdown`/`Calendar` (paneles) | Elemento seleccionado con `--gama100`/`--gama900` | Coherencia con la gama activa |
| `DataTable` | Encabezado con fondo `--principal` y texto blanco | Decisión de esta base: el SND define el color solo en Figma |
| `Paginator` | Página seleccionada con `--gama100`/`--gama900` | Coherencia con la gama activa |
| `Stepper` | Paso activo y tramos recorridos de la línea conectora con `--principal`; `min-width: 0` en encabezados para que puedan encogerse; títulos con salto de línea; en pantallas de hasta 480 px se compactan círculos y tipografía | PrimeReact no define `min-width: 0` y el stepper desborda con varios pasos o títulos largos |
| `.p-button` (interno) | Fondo `--principal`; evita el azul del botón del Calendar | Los botones de la aplicación son `SndBoton` |
| `Dialog` | El pie lleva `fila fila--derecha` (`justify-content: flex-end`) en la página de catálogo | El pie de PrimeReact alinea el texto a la derecha, pero un contenedor `flex` propio lo anula |

Componentes de PrimeReact con colores fijos en el tema que **aún no están cubiertos** (no se usan en la base): `Checkbox`, `RadioButton`, `InputSwitch`, `SelectButton`, `ToggleButton`, `MultiSelect` (panel), `TabView`, `Menubar`, `Slider`, `Rating`. Para incorporar cualquiera, buscar en `node_modules/primereact/resources/themes/lara-light-blue/theme.css`
los selectores con azul (`#3b82f6`, `#1d4ed8`, `#eff6ff`, `#bfdbfe`) y añadirlos al archivo.

## 10. Decisiones de diseño

| Decisión | Motivo |
|---|---|
| **No se usa `snd.js`** | Reemplaza cada `<i class="snd__icono">` por un SVG manipulando el DOM y busca IDs fijos del menú. Esa técnica entra en conflicto con el renderizado de React (nodos reemplazados fuera de su control). Sus funciones se cubren con `SndIcono` y `useMovil` |
| **Hojas cargadas de la web** | Evita copiar ~90 KB de CSS, fuentes e íconos al repositorio y recibe correcciones del SND. Costo: dependencia de red y de la CSP |
| **Orden de carga de CSS** | `main.tsx` importa: tema de PrimeReact → `primereact.min.css` → `primeicons.css` → `snd-prime.css` → `snd.css` → `index.css`. La hoja del SND (en `index.html`) va antes en el `<head>`; los estilos propios deben cargarse después para prevalecer a igual especificidad |
| **PrimeReact sin modo estilizado propio** | Se usa el tema Lara claro como base estructural y se sobrescriben los colores (ver §9.3) |
| **Notificaciones propias** | El `Toast` de PrimeReact ofrece una plantilla `content` que no se evaluó. Se optó por una implementación propia, corta, con el marcado exacto de `.aviso` y sin acoplarse a la API del Toast |
| **Color de página en `<html>`** | La hoja del SND pinta el fondo en `<body>`, lo que taparía la capa de textura |
| **Componentes controlados** | El estado vive en quien usa el componente; evita duplicar estado y facilita las pruebas |

## 11. Desviaciones y defectos del SND v1.3.0

Hallazgos al implementar (los mismos que en la base Angular). Si el SND publica una versión que los
corrige, retirar el parche correspondiente.

| # | Hallazgo | Tratamiento |
|---|---|---|
| 1 | La hoja de estilo **no incluye los estilos de campos de formulario** (`.form__inset` con borde, `input{flex}`, foco); solo existen en la hoja de la documentación | `SndBuscador` define borde, ancho y foco en `snd.css`. Los campos de PrimeReact los cubre `snd-prime.css` |
| 2 | Las **píldoras** usan variables sin definir (`--info`, `--alerta`, `--purple`, `--orange`): bordes y puntos sin color; `inactivo` sin regla de punto | `snd.css` los completa con colores de la paleta |
| 3 | La documentación describe un **loader** (`spin__*`) y una **barra de progreso** cuyas clases no existen en la hoja | `SndCargando` usa `.icono__spin` (publicada). Progreso: barra de PrimeReact |
| 4 | El **ícono de carga** trae `fill` fijo oscuro en cada trazo | `SndIcono` fuerza `currentColor` en `fill` y `stroke` |
| 5 | La documentación solo muestra cuatro píldoras (éxito, error, alerta, info), con punto y **sin borde** | `SndPildora` añade borde de 1 px. Retirarlo con la clase `borde--no` para ajustarse al SND |
| 6 | El `.mexico` (franja superior) es `position: fixed` | El espacio lo reserva `.wrapper` con `--bodyTop` |
| 7 | El ítem activo del menú lateral (blanco sobre `--gama400`) tiene contraste **3.92:1**; WCAG AA exige 4.5:1 | Sin cambio (es el diseño del SND). Ver §12 |
| 8 | El título `.h1b.patria` (3.5 rem) se corta en pantallas de ~390 px | Regla en `index.css` que lo reduce a 2 rem por debajo de 480 px |
| 9 | `.aviso--borde-no` quita también la sombra | `SndMensaje` solo lo aplica con `sinBorde` |
| 10 | El texto de `aviso--exito`, `aviso--alerta` y `aviso--error` queda en negro (neutro 800), mientras `aviso--info` usa azul 500 | Decisión de esta base: texto e ícono en el tono 500 de cada color de validación (verde 500, amarillo 500, rojo 500), con contraste de 7.0 o más sobre el fondo 100. Regla global en `snd.css`, común a mensajes y notificaciones. Las píldoras conservan neutro 700 (contraste de 7.3 a 9.3) |

## 12. Accesibilidad

Verificación automática con axe-core (WCAG 2.1 A y AA) sobre las tres rutas del build de producción:

| Ruta | Resultado |
|---|---|
| `/` | Sin violaciones |
| `/colores` | Sin violaciones |
| `/componentes` | 6 hallazgos, ninguno en código propio salvo el contraste heredado del SND (abajo) |

| Hallazgo | Severidad | Causa | Estado |
|---|---|---|---|
| `aria-required-children`, `aria-required-parent` y `aria-valid-attr-value` en `Stepper` | Crítica | PrimeReact 10.9 construye el stepper con roles `tablist`/`tab`/`tabpanel` mal anidados y referencias `aria-controls` inválidas. Es peor que en PrimeNG | Limitación de PrimeReact. Alternativa: stepper propio |
| `list` en `Stepper` | Seria | La lista `ul.p-stepper-nav` contiene elementos no permitidos | Igual que el anterior |
| `select-name` en el paginador | Crítica | El `<select>` oculto del selector de filas por página no tiene nombre. En el `Dropdown` del formulario se resolvió con `pt={{ select: { 'aria-label': … } }}`; el del paginador es interno | Limitación de PrimeReact |
| Contraste 3.92:1 en el ítem activo del menú lateral | Seria | Diseño del SND (blanco sobre `--gama400`) | Decisión pendiente (ver §11, #7) |

Implementado: enlace «Ir al contenido principal»; `aria-current` en navegación (lo aporta
`NavLink`); `aria-expanded`, `aria-controls` y `aria-describedby` en el tooltip, descartable con
Escape (WCAG 1.4.13); `role="alert"`/`"status"` en mensajes y notificaciones; región `role="region"`
para las notificaciones; `aria-busy` en el botón de carga; `aria-invalid` y mensaje asociado en campos
requeridos; etiquetas visibles en el nombre accesible del menú de usuario (WCAG 2.5.3); foco visible
en controles.

Fuera de alcance de la verificación automática: lectores de pantalla reales, navegación completa por
teclado y contraste de los íconos del CDN.

## 13. Pruebas y verificación

| Tipo | Cobertura | Comando |
|---|---|---|
| Unitarias | **Ninguna incluida.** Se eliminaron a propósito de la base; cada proyecto real agrega las suyas (§13.1) | `yarn test:unit` |
| Extremo a extremo y accesibilidad | Se ejecutaron con Playwright y axe-core contra el build de producción: 66 comprobaciones (rutas, tema, menús, notificaciones, formulario, tabla, pasos, diálogo, móvil). **Los scripts no forman parte del repositorio** | — |

Las comprobaciones de extremo a extremo se hicieron con las hojas del SND servidas localmente y
marcadores en lugar de los íconos que no estaban disponibles; deben repetirse con el CDN real.

Navegador probado: Microsoft Edge (Chromium). Pendientes: Firefox y Safari.

### 13.1 Pruebas unitarias: cómo agregarlas en un proyecto real

La base **no contiene archivos de prueba**. La infraestructura sigue completa: Vitest, Testing Library y
jsdom están instalados y configurados en `vite.config.ts`, y `src/test/setup.ts` ya incluye el
`matchMedia` que jsdom no implementa y la limpieza entre pruebas. Agregar pruebas no requiere configurar nada.

| Tema | Detalle |
|---|---|
| Dónde van | `src/**/*.test.tsx` (o `.test.ts`), junto al archivo que prueban o en `src/test/` |
| Generador | React no tiene uno: los archivos se escriben a mano, por lo que nada los crea solos |
| Script `test` | `yarn test` solo imprime «No tests configured» y termina con código 0, porque Auto DevOps de GitLab puede ejecutarlo y una suite vacía haría fallar el pipeline. Las pruebas reales se ejecutan con `yarn test:unit`; **sin archivos de prueba termina con código 1** (Vitest falla con una suite vacía). Cuando un proyecto agregue pruebas y quiera que el pipeline las ejecute, `test` debe apuntar a `test:unit` |
| Ejecución | No requiere navegador (jsdom) |

Se retiraron de la base las pruebas de: `TemaProvider` (guinda por defecto, cambio a verde con persistencia
y con restauración al iniciar, rechazo de valores inválidos), `SndBoton` (variante, `disabled`, estado de carga
con `aria-busy`), `SndBotonEnlace` (enlace deshabilitado sin navegación ni `onClick`, enlace habilitado, enlace de
React Router), `SndMensaje` (`role` y `aviso--borde-no`), `SndPildora`, `SndTooltip` (Escape lo descarta aunque el
foco siga en el botón) y `App` (estructura de página, `aria-current`, redirección de ruta desconocida). Son los
casos que fallaron durante el desarrollo y se recomienda cubrirlos de nuevo en proyectos reales. La versión
JavaScript (`snd-react-js-base`) conserva sus 16 pruebas en `src/test/` como referencia: son las mismas con la
sintaxis sin tipos.

## 14. Diferencias con la base Angular

| Tema | Angular (`snd-angular-base`) | React (`snd-react-base`) |
|---|---|---|
| Librería de componentes | PrimeNG 21.1 (MIT) | PrimeReact 10.9.9 (MIT, última línea libre) |
| Cambio de tema en la librería | Preset con tokens que leen las variables del SND | Sobrescritura de selectores en `snd-prime.css` (PrimeReact 10 no tiene presets) |
| Estado | Señales (`signal`, `input`, `model`) | `useState`, contextos y componentes controlados |
| Notificaciones | `p-toast` de PrimeNG con plantilla `headless` | Implementación propia |
| Accesibilidad en `/componentes` | 2 hallazgos (stepper, contraste) | 6 hallazgos (stepper con 4 reglas, paginador, contraste) |
| Salida de producción | Bundle inicial 575 kB | Chunk principal 348 kB + 472 kB de la página de catálogo (carga diferida) |
| Ruta de licencia futura | PrimeNG 22+ es comercial | PrimeReact 11+ es comercial |

## 15. Limitaciones y pendientes

- **PrimeReact 10 es la última línea libre.** No se verificó si seguirá recibiendo parches. Alternativas MIT si se necesita salir de ella: MUI, Mantine, Radix o React Aria, con TanStack Table para la tabla; implican reestilizar los componentes complejos con las clases del SND.
- **Stepper de PrimeReact:** defectos de accesibilidad (ver §12). Considerar un stepper propio.
- **Dependencia de red:** sin acceso a `www.snd.gob.mx` no cargan estilos, fuentes ni íconos (mitigable con `SndConfigContext`).
- **Pie de página:** enlaces con destino `#` por completar en cada proyecto.
- **Menú lateral:** falta la versión móvil.
- **CSS sin componente:** breadcrumb (`ruta__*`), acordeón, paginación propia del SND (se usa la de PrimeReact).
- **Fuentes del tema de PrimeReact:** el tema Lara incluye la fuente Inter (~700 KB en el build) que no se usa, porque la tipografía es Noto Sans del SND.
- **Registro institucional:** PrimeReact no figura en el documento de arquitectura; registrarlo en el documento del proyecto (§20).
- **Evolución:** con tres o más proyectos, extraer `snd/`, `core/` y `primereact/` como paquete versionado.

## 16. Solución de problemas

| Síntoma | Causa probable | Acción |
|---|---|---|
| Página sin estilos o con fuente genérica | La hoja o las fuentes no cargan (red, CSP) | Revisar la consola y la CSP ([§7.2](#72-política-de-seguridad-de-contenido-csp)) |
| Íconos ausentes | Los SVG no se descargan | Revisar `connect-src` y `SndConfig.iconosUrls`. El componente emite una advertencia `[SndIcono] no se encontró…` |
| El navbar aparece tapado bajo la franja superior | Falta el contenedor `.wrapper` | Envolver encabezado, `main` y pie en `<div className="wrapper">` |
| Línea gris entre franja y navbar | La franja mide menos que `--bodyTop` | La regla `.wrapper` de `index.css` la pinta; confirmar que está copiada |
| Componentes de PrimeReact en azul | `snd-prime.css` no se carga después del tema | Respetar el orden de importación de `main.tsx` ([§10](#10-decisiones-de-diseño)) |
| Un componente nuevo de PrimeReact sale en azul | Sus selectores no están en `snd-prime.css` | Añadirlos ([§9.3](#93-ajuste-de-primereact)) |
| La textura de fondo no se ve | `<body>` pinta su propio fondo | Color de página en `html` y `body{background:transparent}` (`index.css`) |
| Aparece `package-lock.json` | Se ejecutó `npm install` | Borrarlo y usar `yarn install`; está en `.gitignore` |
| Un `yarn upgrade` sube PrimeReact o PrimeIcons | Rango de versión en `package.json` | Mantener ambas fijas (`--exact`); ver [§2.1](#21-licencias-y-restricción-de-versiones) |
| Aviso de `outDir`/`rootDir` en el editor | Editor con TypeScript 6 | Este proyecto no define `outDir` (usa `noEmit`); no debería aparecer. Reiniciar el servidor de TypeScript |

## 17. Despliegue (Docker, nginx y GitLab)

El proyecto incluye todo lo necesario para construir una imagen y desplegarla con Auto DevOps de GitLab.

### 17.1 Archivos

| Archivo | Función |
|---|---|
| `Dockerfile` | Imagen en dos etapas: compila con Node y sirve los archivos estáticos con nginx |
| `.dockerignore` | Excluye del contexto de construcción lo que no debe entrar a la imagen (dependencias, `dist`, `.git`, `.env`) |
| `nginx/default.conf` | Servidor: puerto 5000, ruta de respaldo para la aplicación de una sola página, caché y compresión |
| `nginx/security-headers.conf` | Cabeceras de seguridad, incluida la política de seguridad de contenido (CSP) |
| `.gitlab/auto-deploy-values.yaml` | Valores del despliegue: ingreso en `/` y servicio en el puerto 5000 |
| `.gitignore`, `.gitattributes` | Archivos que no se versionan y normalización de fines de línea (LF en `Dockerfile`, `.sh` y `nginx/*.conf`) |

### 17.2 Construir y ejecutar la imagen

```sh
docker build -t snd-react-base .
docker run --rm -p 5000:5000 snd-react-base      # http://localhost:5000
```

- **Etapa de compilación:** `node:24.21.0-slim` (versión fijada); instala con `yarn install --frozen-lockfile`, que falla si `yarn.lock` no coincide con `package.json` en lugar de resolver versiones nuevas, y ejecuta `yarn build`.
- **Etapa final:** `nginxinc/nginx-unprivileged:1.30-alpine`; el proceso corre como usuario **sin privilegios** (no root). Tamaño de la imagen: unos 92 MB.
- **Puerto:** 5000, el que declara `.gitlab/auto-deploy-values.yaml`.

### 17.3 nginx

| Tema | Comportamiento |
|---|---|
| Rutas de la aplicación | Cualquier ruta que no sea un archivo responde `index.html` (por ejemplo `/componentes`) |
| Caché | Archivos con hash en el nombre (`.js`, `.css`, fuentes): un año, `immutable`. Todo lo demás (`index.html`, favicon, texturas): `no-cache` |
| Compresión | gzip para texto, JavaScript, JSON y SVG |
| Cabeceras | CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y `Strict-Transport-Security` en **todas** las respuestas (el archivo se incluye en cada `location`, porque `add_header` no se hereda) |
| Versión | `server_tokens off`: no se anuncia la versión de nginx |

`Strict-Transport-Security` se envía sin la opción `preload` (compromiso difícil de revertir). Asume que el sitio se sirve con HTTPS en el ingreso.

### 17.4 Política de seguridad de contenido (CSP)

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://www.snd.gob.mx;
font-src 'self' https://www.snd.gob.mx; img-src 'self' data: https://www.snd.gob.mx https://framework-gb.cdn.gob.mx;
connect-src 'self' https://www.snd.gob.mx https://framework-gb.cdn.gob.mx; frame-ancestors 'self';
base-uri 'self'; form-action 'self'; object-src 'none'
```

- **Scripts:** solo del propio origen; no se permite código en línea ni `eval`.
- **Estilos:** `'unsafe-inline'` es necesario porque la librería de componentes inyecta etiquetas `<style>` en tiempo de ejecución. Es la parte débil de la política; eliminarla exige pasar un *nonce* a la librería y generarlo por petición en nginx.
- **Origen del SND:** permitido en estilos, fuentes, imágenes y conexiones (los íconos se piden con `fetch`). Si se usa otra ubicación para los recursos del SND, hay que actualizar la política.
- **Otras conexiones:** si la aplicación llama a una API, añadir su origen a `connect-src` en `nginx/security-headers.conf`.

### 17.5 Pipeline de GitLab (Auto DevOps)

El proyecto **no incluye `.gitlab-ci.yml`**: en el GitLab de la institución Auto DevOps está habilitado a nivel
de instancia y no se puede desactivar por proyecto. El proyecto solo aporta lo que Auto DevOps necesita:

| Aporte del proyecto | Uso |
|---|---|
| `Dockerfile` | Auto DevOps construye la imagen con él (no usa buildpacks) |
| `.gitlab/auto-deploy-values.yaml` | Valores del despliegue: ingreso en `/`, servicio en el puerto 5000 |
| `package.json` → script `test` | Imprime «No tests configured» y termina con código 0, para que un paso de pruebas de Auto DevOps que ejecute `yarn test` no falle (ver §17.7) |

El análisis de seguridad y de calidad lo define la configuración de Auto DevOps de la institución, no el proyecto
(sin `.gitlab-ci.yml` este repositorio no puede activarlo ni modificarlo por sí mismo):

| Análisis | Estado |
|---|---|
| SAST | **Configurado en GitLab** (confirmado por el equipo del proyecto) |
| Detección de secretos, análisis de dependencias, análisis de contenedores y calidad de código | **Sin confirmar.** El estándar institucional los exige antes de producción: confirmar con el equipo de DevOps que están activos |
| DAST | Lo realiza la Dirección de Seguridad de TICs |
| Licencias | Se auditan con `yarn licenses list --prod` (ver §2) |

### 17.6 Verificación realizada

| Comprobación | Resultado |
|---|---|
| `docker build` y arranque del contenedor | Correctos (Docker 29.8.1) |
| `nginx -t` dentro del contenedor | Sintaxis correcta |
| Usuario del proceso | `nginx` (no root) |
| Cabeceras, caché, gzip, rutas de la aplicación y archivos inexistentes (404) | Verificados con `curl` |
| Batería de 66 comprobaciones de punta a punta **contra el contenedor** (CSP real) | 66 de 66 |
| Violaciones de CSP en el navegador | 0 |

**No verificado:** la ejecución del pipeline de GitLab (no se tuvo acceso a `desarrollo/ci-cd`), el despliegue en Kubernetes ni el comportamiento de HSTS detrás del ingreso. La verificación de accesibilidad con axe se hizo con la CSP desactivada para ese paso, porque axe se inyecta como script en línea.

### 17.7 Qué no se incluye y por qué

- **Variables de entorno en tiempo de ejecución** (`env-config.js` generado al arrancar): no hacen falta; la configuración de los recursos del SND está en el código. Si un proyecto necesita configuración por ambiente, no debe incluir secretos: todo lo que llega al navegador es público.
- **CSP con *nonce*:** ver §17.4.
- **`.gitlab-ci.yml`:** Auto DevOps lo define la institución (ver §17.5).
- **Pruebas en `yarn test`:** el script `test` de `package.json` solo imprime «No tests configured» (código 0), porque Auto DevOps puede ejecutarlo y una suite vacía haría fallar el pipeline. Las pruebas reales se ejecutan con `yarn test:unit` (ver §13). Cuando un proyecto agregue pruebas y quiera que el pipeline las ejecute, basta con que `test` apunte a `test:unit`.

### 17.8 Solución de problemas del contenedor

| Síntoma | Causa probable | Acción |
|---|---|---|
| El contenedor termina al arrancar con `unknown directive "8}..."` | Una expresión regular con llaves sin comillas en `nginx/default.conf` | Entrecomillar la expresión del `location` |
| `docker build` falla en `yarn install` con «engine node is incompatible» | Imagen de Node demasiado antigua | Usar la versión fijada en el `Dockerfile` o una compatible (§2) |
| La página carga sin estilos de la aplicación | La CSP bloquea un manejador o script en línea | Revisar la consola del navegador; no usar scripts en línea |
| Faltan íconos o fuentes | Su origen no está en la CSP | Añadirlo a `nginx/security-headers.conf` |

