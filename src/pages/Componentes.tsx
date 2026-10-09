import { useMemo, useState, type FormEvent } from 'react'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { useTitulo } from '../core/useTitulo'
import {
  SndBoton,
  SndBotonEnlace,
  SndBuscador,
  SndCargando,
  SndIcono,
  SndMensaje,
  SndMenuLateral,
  SndPildora,
  SndPildoraFiltro,
  SndTooltip,
  useNotificaciones,
  type ItemMenuLateral,
  type TipoPildora,
} from '../snd'
import './Componentes.css'
import { NOMBRE_BASE } from '../core/base'

interface Solicitud {
  folio: string
  dependencia: string
  estado: string
  fecha: string
}

const DEPENDENCIAS = ['Secretaría A', 'Secretaría B', 'Instituto C', 'Agencia D']
const ESTADOS = ['En revisión', 'Aprobada', 'Rechazada', 'Pendiente']
const TIPO_ESTADO: Record<string, TipoPildora> = {
  'En revisión': 'info',
  Aprobada: 'exito',
  Rechazada: 'error',
  Pendiente: 'alerta',
}

const ICONOS = ['snd-home', 'snd-search', 'snd-user', 'snd-edit', 'snd-trash-can', 'snd-download', 'snd-calendar', 'snd-filter']
const TIPOS_PILDORA: TipoPildora[] = ['exito', 'info', 'alerta', 'error', 'neutro', 'naranja', 'purple', 'inactivo']
const TAMANOS_PICTOGRAMA = [48, 64, 96, 128]

const MENU_LATERAL: ItemMenuLateral[] = [
  { texto: 'Inicio', icono: 'snd-home', ruta: '/', exacta: true },
  { texto: 'Componentes', icono: 'snd-document', ruta: '/componentes' },
  { texto: 'Mi perfil', icono: 'snd-user--avatar', ruta: '/perfil' },
]

const SOLICITUDES: Solicitud[] = Array.from({ length: 23 }, (_, i) => ({
  folio: `SOL-${String(i + 1).padStart(4, '0')}`,
  dependencia: DEPENDENCIAS[i % DEPENDENCIAS.length],
  estado: ESTADOS[i % ESTADOS.length],
  fecha: `${String((i % 28) + 1).padStart(2, '0')}/0${(i % 9) + 1}/2026`,
}))

const sinAcentos = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Contenido de un paso de ejemplo, con botones de navegación. */
function Paso({ texto, anterior, siguiente, etiquetaSiguiente = 'Siguiente' }: {
  texto: string
  anterior?: () => void
  siguiente: () => void
  etiquetaSiguiente?: string
}) {
  return (
    <div>
      <p className="b1r">{texto}</p>
      <div className="fila">
        {anterior && (
          <SndBoton variante="secundario" onClick={anterior}>
            Atrás
          </SndBoton>
        )}
        <SndBoton onClick={siguiente}>{etiquetaSiguiente}</SndBoton>
      </div>
    </div>
  )
}

/**
 * Página de catálogo: muestra cada componente en uso.
 *
 * Dos zonas con criterio distinto:
 * - Componentes del SND: HTML y clases del SND, mediante las piezas de `../snd`.
 * - Componentes complejos (formulario, pasos, tabla, diálogo): PrimeReact, con el ajuste
 *   `primereact/snd-prime.css`.
 *
 * Es una página de demostración y referencia. Puede conservarse como guía interna o retirarse
 * (junto con su ruta) en un sistema productivo.
 */
export default function Componentes() {
  useTitulo('Componentes')
  const notificar = useNotificaciones()

  // Botón en estado de carga (simulado).
  const [guardando, setGuardando] = useState(false)
  const simularGuardado = () => {
    setGuardando(true)
    setTimeout(() => setGuardando(false), 2000)
  }

  // Tabla: búsqueda al escribir (sin distinguir mayúsculas ni acentos) y filtro "solo pendientes".
  const [filtro, setFiltro] = useState('')
  const [soloPendientes, setSoloPendientes] = useState(false)
  const [pildoraDemo, setPildoraDemo] = useState(false)
  const [pildoraDemo2, setPildoraDemo2] = useState(false)
  const solicitudes = useMemo(() => {
    const texto = sinAcentos(filtro.trim())
    return SOLICITUDES.filter(
      (s) =>
        (!soloPendientes || s.estado === 'Pendiente') &&
        (!texto || sinAcentos(`${s.folio} ${s.dependencia} ${s.estado}`).includes(texto)),
    )
  }, [filtro, soloPendientes])

  // Formulario con campo requerido.
  const [nombre, setNombre] = useState('')
  /** `true` tras guardar con el nombre vacío; vuelve a `false` cuando el campo recibe el foco. */
  const [nombreConError, setNombreConError] = useState(false)
  const [dependencia, setDependencia] = useState<string | null>(null)
  const [fecha, setFecha] = useState<Date | null>(null)
  const guardar = (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setNombreConError(true)
      return
    }
    notificar.exito('El formulario se guardó correctamente.', 'Guardado')
  }

  // Pasos activos de las barras de pasos, diálogo y menú lateral.
  const [pasoH, setPasoH] = useState(0)
  const [pasoV, setPasoV] = useState(0)
  const [dialogo, setDialogo] = useState(false)
  const [menuColapsado, setMenuColapsado] = useState(false)

  return (
    <div className="contenedor">
      <h1 className="h1b patria">Componentes</h1>
      <p className="sh0m color--principal">{NOMBRE_BASE}</p>
      <p className="b1r">Catálogo de la base. Cambia el tema desde el encabezado para ver ambas gamas.</p>

      {/* ========== Componentes del SND (HTML y clases) ========== */}
      <section className="bloque">
        <h2 className="h2b">Componentes del SND</h2>

        <h3 className="sh0b">Tipografía</h3>
        <h1 className="h0b patria">H0 · Patria bold</h1>
        <h2 className="h1b">H1 · Noto Sans bold</h2>
        <h3 className="h2b">H2 · Título secundario</h3>
        <h4 className="sh0m">SH0 · Subtítulo medium</h4>
        <p className="b1r">
          B1 · Cuerpo de texto regular. <span className="b1sb">Con semibold.</span>
        </p>
        <p className="sdr">SD · Detalle regular</p>

        <h3 className="sh0b">Botones</h3>
        <div className="fila">
          <SndBoton>Primario</SndBoton>
          <SndBoton variante="secundario">Secundario</SndBoton>
          <SndBoton variante="fantasma">Fantasma</SndBoton>
          <SndBoton disabled>Deshabilitado</SndBoton>
          <SndBotonEnlace variante="secundario" href="#" deshabilitado>
            Enlace deshabilitado
          </SndBotonEnlace>
        </div>

        <h3 className="sh0b">Botón cargando</h3>
        <p className="sdr">Pulsa para simular una acción de 2 segundos.</p>
        <div className="fila">
          <SndBoton cargando={guardando} etiquetaCargando="Guardando" onClick={simularGuardado}>
            Guardar
          </SndBoton>
          <SndBoton variante="secundario" cargando={guardando} etiquetaCargando="Guardando" onClick={simularGuardado}>
            Guardar
          </SndBoton>
        </div>

        <h3 className="sh0b">Íconos</h3>
        <div className="fila">
          {ICONOS.map((i) => (
            <SndIcono key={i} nombre={i} tamano={32} className="color--principal" etiqueta={i.slice(4)} />
          ))}
        </div>

        <h3 className="sh0b">Pictogramas</h3>
        <p className="sdr">
          El pictograma es una ilustración de mayor tamaño que el ícono; se carga de la carpeta <code>pictogramas</code>{' '}
          del SND.
        </p>
        <div className="fila">
          {TAMANOS_PICTOGRAMA.map((t) => (
            <SndIcono key={t} nombre="snd-gobierno-mexico" pictograma tamano={t} className="color--principal" />
          ))}
          <SndIcono
            nombre="snd-gobierno-mexico"
            pictograma
            tamano={96}
            colorOriginal
            etiqueta="Gobierno de México, a color original"
          />
        </div>

        <h3 className="sh0b">Mensajes informativos</h3>
        <div className="pila">
          <SndMensaje tipo="info"><p>Mensaje informativo.</p></SndMensaje>
          <SndMensaje tipo="exito"><p>La acción se realizó correctamente.</p></SndMensaje>
          <SndMensaje tipo="alerta"><p>Revisa la información antes de continuar.</p></SndMensaje>
          <SndMensaje tipo="error"><p>No se pudo completar la operación.</p></SndMensaje>
          <SndMensaje tipo="neutro"><p>Mensaje neutro.</p></SndMensaje>
        </div>

        <h3 className="sh0b">Notificaciones flotantes (toast)</h3>
        <p className="sdr">
          Aparecen fijas debajo del encabezado, a la derecha; se pueden cerrar y desaparecen solas a los 5 segundos.
        </p>
        <div className="fila">
          <SndBoton variante="secundario" onClick={() => notificar.exito('La operación se realizó correctamente.', 'Éxito')}>
            Éxito
          </SndBoton>
          <SndBoton variante="secundario" onClick={() => notificar.info('Hay información nueva disponible.', 'Información')}>
            Informativo
          </SndBoton>
          <SndBoton variante="secundario" onClick={() => notificar.alerta('Revisa los datos antes de continuar.', 'Atención')}>
            Alerta
          </SndBoton>
          <SndBoton variante="secundario" onClick={() => notificar.error('No se pudo completar la operación.', 'Error')}>
            Error
          </SndBoton>
        </div>

        <h3 className="sh0b">Píldoras (chips)</h3>
        <div className="fila">
          {TIPOS_PILDORA.map((t) => (
            <SndPildora key={t} tipo={t}>
              {t}
            </SndPildora>
          ))}
        </div>
        <p className="sdr">Píldoras de filtro (se activan y desactivan):</p>
        <div className="fila">
          <SndPildoraFiltro activo={soloPendientes} onCambio={setSoloPendientes}>
            Solo pendientes
          </SndPildoraFiltro>
          <SndPildoraFiltro activo={pildoraDemo} onCambio={setPildoraDemo}>
            Mi dependencia
          </SndPildoraFiltro>
          <SndPildoraFiltro activo={pildoraDemo2} onCambio={setPildoraDemo2}>
            Este mes
          </SndPildoraFiltro>
        </div>

        <h3 className="sh0b">Tooltip</h3>
        <p className="sdr">Pasa el cursor, enfoca con el teclado o haz clic. Escape lo cierra.</p>
        <div className="fila tooltips">
          <SndTooltip texto="Folio asignado al registrar la solicitud." posicion="arriba-derecha" />
          <SndTooltip texto="Aparece centrado debajo del ícono." posicion="abajo-centro" />
          <SndTooltip
            texto="Texto más largo para mostrar el tamaño mediano del mensaje emergente."
            posicion="abajo-derecha"
            tamano="mediano"
          />
        </div>

        <h3 className="sh0b">Barras de búsqueda</h3>
        <p className="sdr">Variante principal (lupa a la derecha):</p>
        <SndBuscador
          variante="principal"
          etiqueta="Buscar trámites"
          placeholder="Ejemplo: actividades turístico recreativas"
          valor=""
          onValor={() => {}}
        />
        <p className="sdr">Variante general (lupa a la izquierda):</p>
        <SndBuscador
          variante="general"
          etiqueta="Buscar actividades"
          placeholder="Ejemplo: actividades turístico recreativas"
          ancho="28rem"
          valor=""
          onValor={() => {}}
        />

        <h3 className="sh0b">Indicador de carga</h3>
        <div className="fila">
          <SndCargando tamano="md" />
          <SndCargando tamano="lg" texto="Procesando…" />
        </div>

        <h3 className="sh0b">Retícula</h3>
        <div className="reticulaGrid__12 gapy--16">
          <div className="columna__12"><div className="caja">columna__12</div></div>
          <div className="columna__6"><div className="caja">columna__6</div></div>
          <div className="columna__6"><div className="caja">columna__6</div></div>
          <div className="columna__4"><div className="caja">columna__4</div></div>
          <div className="columna__4"><div className="caja">columna__4</div></div>
          <div className="columna__4"><div className="caja">columna__4</div></div>
        </div>

        <h3 className="sh0b">Menú lateral</h3>
        <p className="sdr">
          Con el botón de la orilla se colapsa a solo íconos. En una aplicación va en el área <code>aside</code> del
          layout <code>wrapper--aside</code>.
        </p>
        <div className="demo-lateral">
          <SndMenuLateral
            items={MENU_LATERAL}
            titulo="Mi sistema"
            etiqueta="Menú de ejemplo"
            colapsado={menuColapsado}
            onColapsar={setMenuColapsado}
          />
          <div className="demo-lateral__contenido">
            <p className="b1r">Aquí va el contenido de la página.</p>
          </div>
        </div>

        <h3 className="sh0b">Textura de fondo</h3>
        <p className="sdr">
          Es el fondo de esta página: la textura oficial de Gobierno de México 2024-2030 en su versión blanca, atenuada.
          El SND pide usarla como elemento complementario y sin que reste legibilidad; la opacidad se ajusta en{' '}
          <code>index.css</code> (<code>--textura-opacidad</code>).
        </p>
      </section>

      {/* ========== Componentes complejos (PrimeReact con el ajuste del SND) ========== */}
      <section className="bloque">
        <h2 className="h2b">Componentes complejos (PrimeReact)</h2>

        <h3 className="sh0b">Formulario</h3>
        <form className="formulario" onSubmit={guardar} noValidate>
          <div className="campo">
            <label htmlFor="nombre" className="b1sb">
              Nombre{' '}
              <span className="requerido" aria-hidden="true">
                *
              </span>
            </label>
            <InputText
              id="nombre"
              name="nombre"
              required
              autoComplete="off"
              value={nombre}
              invalid={nombreConError}
              aria-invalid={nombreConError}
              aria-describedby={nombreConError ? 'nombre-error' : undefined}
              onChange={(e) => setNombre(e.target.value)}
              onFocus={() => setNombreConError(false)}
            />
            {nombreConError && (
              <span id="nombre-error" className="campo__error" role="alert">
                El nombre es obligatorio.
              </span>
            )}
          </div>
          <div className="campo">
            <label htmlFor="dependencia" className="b1sb">
              Dependencia
            </label>
            <Dropdown
              inputId="dependencia"
              ariaLabel="Dependencia"
              pt={{ select: { "aria-label": "Dependencia" } }}
              options={DEPENDENCIAS.map((d) => ({ label: d, value: d }))}
              value={dependencia}
              onChange={(e) => setDependencia(e.value)}
              placeholder="Selecciona"
              showClear
              appendTo="self"
            />
          </div>
          <div className="campo">
            <label htmlFor="fecha" className="b1sb">
              Fecha
            </label>
            <Calendar
              inputId="fecha"
              value={fecha}
              onChange={(e) => setFecha((e.value as Date | null) ?? null)}
              dateFormat="dd/mm/yy"
              showIcon
              appendTo="self"
            />
          </div>
          <div className="fila">
            <SndBoton type="submit">Guardar</SndBoton>
            <SndBoton variante="secundario" onClick={() => setDialogo(true)}>
              Abrir diálogo
            </SndBoton>
          </div>
        </form>

        <h3 className="sh0b">Barra de pasos horizontal</h3>
        <Stepper activeStep={pasoH} onChangeStep={(e) => setPasoH(e.index)}>
          <StepperPanel header="Datos">
            <Paso texto="Captura los datos generales de la solicitud." siguiente={() => setPasoH(1)} />
          </StepperPanel>
          <StepperPanel header="Documentos">
            <Paso
              texto="Adjunta los documentos requeridos."
              anterior={() => setPasoH(0)}
              siguiente={() => setPasoH(2)}
            />
          </StepperPanel>
          <StepperPanel header="Confirmación">
            <Paso
              texto="Revisa la información y confirma el envío."
              anterior={() => setPasoH(1)}
              siguiente={() => setPasoH(0)}
              etiquetaSiguiente="Reiniciar"
            />
          </StepperPanel>
        </Stepper>

        <h3 className="sh0b">Barra de pasos vertical</h3>
        <Stepper activeStep={pasoV} onChangeStep={(e) => setPasoV(e.index)} orientation="vertical">
          <StepperPanel header="Datos">
            <Paso texto="Captura los datos generales de la solicitud." siguiente={() => setPasoV(1)} />
          </StepperPanel>
          <StepperPanel header="Documentos">
            <Paso
              texto="Adjunta los documentos requeridos."
              anterior={() => setPasoV(0)}
              siguiente={() => setPasoV(2)}
            />
          </StepperPanel>
          <StepperPanel header="Confirmación">
            <Paso
              texto="Revisa la información y confirma el envío."
              anterior={() => setPasoV(1)}
              siguiente={() => setPasoV(0)}
              etiquetaSiguiente="Reiniciar"
            />
          </StepperPanel>
        </Stepper>

        <h3 className="sh0b">Tabla con buscador, orden y paginación</h3>
        <div className="barra-tabla">
          <SndBuscador
            variante="general"
            valor={filtro}
            onValor={setFiltro}
            etiqueta="Buscar solicitudes"
            placeholder="Buscar folio, dependencia o estado…"
            ancho="26rem"
          />
          <div className="fila">
            <SndPildoraFiltro activo={soloPendientes} onCambio={setSoloPendientes}>
              Solo pendientes
            </SndPildoraFiltro>
            <SndBoton variante="secundario" disabled={solicitudes.length === 0}>
              Descargar
            </SndBoton>
            <SndBoton>Nuevo</SndBoton>
          </div>
        </div>
        <div className="contenedor-tabla">
          <DataTable
            value={solicitudes}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            tableStyle={{ minWidth: '40rem' }}
            stripedRows
            emptyMessage={`Sin resultados para «${filtro}».`}
          >
            <Column field="folio" header="Folio" sortable />
            <Column field="dependencia" header="Dependencia" sortable />
            <Column
              field="estado"
              header="Estado"
              sortable
              body={(fila: Solicitud) => (
                <SndPildora tipo={TIPO_ESTADO[fila.estado] ?? 'neutro'}>{fila.estado}</SndPildora>
              )}
            />
            <Column field="fecha" header="Fecha" />
          </DataTable>
        </div>
      </section>

      <Dialog
        header="Confirmar acción"
        visible={dialogo}
        onHide={() => setDialogo(false)}
        modal
        style={{ width: '28rem' }}
        footer={
          <div className="fila fila--derecha">
            <SndBoton variante="secundario" onClick={() => setDialogo(false)}>
              Cancelar
            </SndBoton>
            <SndBoton onClick={() => setDialogo(false)}>Aceptar</SndBoton>
          </div>
        }
      >
        <p className="b1r">Este diálogo es de PrimeReact con los tokens del SND.</p>
      </Dialog>
    </div>
  )
}
