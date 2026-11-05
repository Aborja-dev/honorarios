import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { SndBoton, SndBuscador, SndIcono, SndPildora, useNotificaciones } from '../snd'
import type { RegistroSubmodulo, SubmoduloInfo } from '../../services'

export interface BandejaSubmoduloProps {
  submodulo: SubmoduloInfo
  registros: RegistroSubmodulo[]
  busqueda: string
  onBusqueda: (valor: string) => void
  onNuevoRegistro: () => void
}

/**
 * Tabla interactiva (`DataTable` de PrimeReact) para consultar y filtrar registros de un submódulo.
 */
export function BandejaSubmoduloModelo({
  submodulo,
  registros,
  busqueda,
  onBusqueda,
  onNuevoRegistro,
}: BandejaSubmoduloProps) {
  const notificar = useNotificaciones()

  return (
    <section className="honorarios-detalle-panel" aria-label={`Registros de ${submodulo.titulo}`}>
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
            onValor={onBusqueda}
            etiqueta="Filtrar tabla del submódulo"
            placeholder="Filtrar por Id Prestador, nombre o CURP"
            ancho="22rem"
          />
          <SndBoton
            variante="secundario"
            onClick={() => notificar.info(`Descargando reporte de «${submodulo.titulo}» en formato CSV.`)}
          >
            <SndIcono nombre="snd-download" tamano={20} />
            Exportar
          </SndBoton>
          <SndBoton onClick={onNuevoRegistro}>Nuevo registro</SndBoton>
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
          <Column field="folio" header="Id modelo" sortable />
          <Column field="nombre" header="Nombre del modelo" sortable />
          <Column
            field="concepto"
            header="Acciones"
            headerStyle={{ textAlign: 'left' }}
            bodyStyle={{ textAlign: 'center' }}
            body={(fila: RegistroSubmodulo) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: '1px solid var(--neutro400, #cccccc)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: ' #004D40',
                  }}
                  title="Modificar registro"
                  onClick={() => notificar.info(`Editando registro ${fila.folio}: ${fila.nombre}`)}
                >
                  <p style={{marginRight: 8, display: "inline-block"}}><SndIcono nombre="snd-edit" tamano={12} /></p>
                  Modificar
                </button>
                <button
                  type="button"
                 style={{
                    background: 'none',
                    border: '1px solid var(--neutro400, #cccccc)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: ' #846623',
                  }}
                  title="Eliminar registro"
                  onClick={() => notificar.info(`Eliminar registro ${fila.folio}: ${fila.nombre}`)}
                >
                  <p style={{marginRight: 8, display: "inline-block"}}><SndIcono nombre="snd-reading--glasses" tamano={12} /></p>
                  Revisar
                </button>
              </div>
            )}
          />

         
        <Column field="completadoTexto" header="Avance" sortable body={(fila: RegistroSubmodulo)=><SndPildora tipo={fila.completadoColor}>{fila.completadoTexto}</SndPildora>}/>
        </DataTable>
      </div>
    </section>
  )
}
