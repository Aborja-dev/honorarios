import { useMemo, useState } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import {
  ModalRegistroHonorarios,
  SndBoton,
  SndBotonEnlace,
  SndBuscador,
  SndIcono,
  SndMensaje,
  SndPildora,
  SndPildoraFiltro,
  useNotificaciones,
} from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'
import { SUBMODULOS_HONORARIOS, honorariosService, type RegistroSubmodulo } from '../../services'
import { sinAcentos } from '../../utils'

const OPCIONES_RAMO = [
  { label: '27 - Anticorrupcíon y Buen Gobierno', value: '27' },
  { label: '06 - Hacienda y Crédito Público', value: '06' },
  { label: '04 - Gobernación', value: '04' },
  { label: '11 - Educación Pública', value: '11' },
  { label: '12 - Salud', value: '12' },
]

const OPCIONES_UR = [
  { label: '027 - Secretaria Anticorrupcíon  y Buen Gobierno', value: '27' },
  { label: '006 - Secretaria Hacienda y Crédito Público', value: '06' },
  { label: '004 - Secretaria Gobernación', value: '04' },
]

/**
 * Vista dedicada del submódulo "Contratos de honorarios" (`pages/admin/ContratosHonorarios.tsx`).
 */
export default function ContratosHonorarios() {
  useTitulo('Contratos de Honorarios · SABG')
  const notificar = useNotificaciones()
  const [busqueda, setBusqueda] = useState('')
  const [soloVigentes, setSoloVigentes] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  // Estados de la sección de búsqueda
  const [ramoBusqueda, setRamoBusqueda] = useState<string | null>(null)
  const [institucionBusqueda, setInstitucionBusqueda] = useState<string | null>(null)
  const [idContratoBusqueda, setIdContratoBusqueda] = useState('')
  const [curpBusqueda, setCurpBusqueda] = useState('')
  const [rfcBusqueda, setRfcBusqueda] = useState('')

  const info = SUBMODULOS_HONORARIOS[1]
  const registros = useMemo(() => {
    const base = honorariosService.obtenerRegistrosPorSubmodulo('contratos')
    const q = sinAcentos(busqueda.trim())
    return base.filter(
      (r) =>
        (!soloVigentes || r.estado === 'Vigente') &&
        (!q || sinAcentos(`${r.folio} ${r.nombre} ${r.unidad} ${r.concepto}`).includes(q)),
    )
  }, [busqueda, soloVigentes])

  return (
    <div className="contenedor">
      <div className="honorarios-encabezado-seccion">
        <div>
          <h1 className="h1b patria" style={{ margin: 0 }}>
            Contratos de Honorarios
          </h1>
          <p className="sh0m color--principal" style={{ margin: '4px 0 0' }}>
            Seguimiento de elaboración de contratos por honorarios
          </p>
        </div>
        <div className="fila">
          <SndBotonEnlace variante="primario" to="/formalizacion-contratos">
            Formalización de contratos
          </SndBotonEnlace>

          <SndBotonEnlace variante="secundario" to="/">
            Volver al tablero
          </SndBotonEnlace>
        </div>
      </div>

      {/* sección de busqueda  */}
      <section className="honorarios-detalle-panel" aria-label="Búsqueda de contratos">
        <div>
          <h2 className="h2b" style={{ margin: 0 }}>
            Búsqueda de Contratos
          </h2>
          <p className="sdr" style={{ margin: '4px 0 0' }}>
            Ingresa los criterios para consultar contratos en el sistema
          </p>
        </div>

        {/* Fila 1: Ramo e Institución */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px 20px',
          }}
        >
          <div className="campo">
            <label htmlFor="busq-cto-ramo" className="b1sb">
              Ramo
            </label>
            <Dropdown
              inputId="busq-cto-ramo"
              options={OPCIONES_RAMO}
              value={ramoBusqueda}
              onChange={(e) => setRamoBusqueda(e.value)}
              placeholder="Selecciona el ramo"
              appendTo="self"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-cto-institucion" className="b1sb">
              Institución
            </label>
            <Dropdown
              inputId="busq-cto-institucion"
              options={OPCIONES_UR}
              value={institucionBusqueda}
              onChange={(e) => setInstitucionBusqueda(e.value)}
              placeholder="Selecciona la institución"
              appendTo="self"
            />
          </div>
        </div>

        {/* Fila 2: Id Contrato, CURP y RFC */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px 20px',
          }}
        >
          <div className="campo">
            <label htmlFor="busq-cto-id" className="b1sb">
              Id Contrato
            </label>
            <InputText
              id="busq-cto-id"
              value={idContratoBusqueda}
              onChange={(e) => setIdContratoBusqueda(e.target.value)}
              placeholder="Ej. 0000000841"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-cto-curp" className="b1sb">
              CURP
            </label>
            <InputText
              id="busq-cto-curp"
              maxLength={18}
              value={curpBusqueda}
              onChange={(e) => setCurpBusqueda(e.target.value.toUpperCase())}
              placeholder="Ej. LORM990228MDFPSR05"
            />
          </div>

          <div className="campo">
            <label htmlFor="busq-cto-rfc" className="b1sb">
              RFC
            </label>
            <InputText
              id="busq-cto-rfc"
              maxLength={13}
              value={rfcBusqueda}
              onChange={(e) => setRfcBusqueda(e.target.value.toUpperCase())}
              placeholder="Ej. LORM880412HDF"
            />
          </div>
        </div>

        <div className="fila">
          <SndBoton type="button">
            <SndIcono nombre="snd-search" tamano={18} />
            Buscar
          </SndBoton>
          <SndBoton variante="fantasma" type="button">
            Limpiar formulario
          </SndBoton>
        </div>
      </section>

      <div className="fila" style={{ marginTop: 16 }}>
        <SndPildoraFiltro activo={soloVigentes} onCambio={setSoloVigentes}>
          Solo contratos vigentes
        </SndPildoraFiltro>
      </div>

      {/* Tabla independiente de Contratos de Honorarios */}
      <section className="honorarios-detalle-panel" aria-label={`Registros de ${info.titulo}`}>
        <div className="honorarios-detalle-barra">
          <div>
            <h2 className="h2b" style={{ margin: 0 }}>
              Resultado
            </h2>
            <p className="sdr" style={{ margin: '4px 0 0' }}>
              Mostrando {registros.length} registros
            </p>
          </div>
          <div className="fila">
            <SndBuscador
              variante="general"
              valor={busqueda}
              onValor={setBusqueda}
              etiqueta="Filtrar tabla de contratos"
              placeholder="Filtrar por Id Contrato, nombre o unidad…"
              ancho="22rem"
            />
            <SndBoton
              variante="secundario"
              onClick={() => notificar.info(`Descargando reporte de «${info.titulo}» en formato CSV.`)}
            >
              <SndIcono nombre="snd-download" tamano={20} />
              Exportar
            </SndBoton>
            <SndBoton onClick={() => setModalAbierto(true)}>Nuevo registro</SndBoton>
          </div>
        </div>

        <div className="contenedor-tabla">
          <DataTable
            value={registros}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            tableStyle={{ minWidth: '48rem' }}
            stripedRows
            emptyMessage={`No se encontraron registros para «${busqueda}».`}
          >
            <Column field="folio" header="Id Contrato" sortable />
            <Column field="nombre" header="Nombre" sortable />
            <Column field="unidad" header="CURP" sortable />
            <Column
              field="concepto"
              header="Acciones"
              headerStyle={{ textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center' }}
              body={(fila: RegistroSubmodulo) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: '1px solid var(--neutro400, #cccccc)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: 'var(--neutro800, #333)',
                    }}
                    title="Modificar registro"
                    onClick={() => notificar.info(`Editando registro ${fila.folio}: ${fila.nombre}`)}
                  >
                    Modificar
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: '1px solid var(--principal, #9B2247)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: 'var(--principal, #9B2247)',
                    }}
                    title="Eliminar registro"
                    onClick={() => notificar.info(`Eliminar registro ${fila.folio}: ${fila.nombre}`)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            />

            <Column
              field="estado"
              header="Estatus"
              sortable
              body={(fila: RegistroSubmodulo) => <SndPildora tipo={fila.tipoPildora}>{fila.estado}</SndPildora>}
            />
          </DataTable>
        </div>
      </section>

      <div style={{ marginTop: 20 }}>
        <SndMensaje tipo="alerta">
          <p>
            Recuerda verificar que los datos correspndan al periodo en curso.
          </p>
        </SndMensaje>
      </div>

      <ModalRegistroHonorarios
        modalTipo={modalAbierto ? 'contratos' : null}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  )
}
