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
export function BandejaSubmodulo({
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
            {submodulo.titulo}
          </h2>
          <p className="sdr" style={{ margin: '4px 0 0' }}>
            {submodulo.subtitulo} · Mostrando {registros.length} registros
          </p>
        </div>
        <div className="fila">
          <SndBuscador
            variante="general"
            valor={busqueda}
            onValor={onBusqueda}
            etiqueta="Filtrar tabla del submódulo"
            placeholder="Filtrar por folio, nombre o unidad…"
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
          <Column field="folio" header="Folio / Clave" sortable />
          <Column field="nombre" header="Prestador / Plantilla" sortable />
          <Column field="unidad" header="Unidad Administrativa" sortable />
          <Column field="concepto" header="Concepto / Régimen" />
          <Column field="vigencia" header="Vigencia" />
          <Column
            field="estado"
            header="Estatus"
            sortable
            body={(fila: RegistroSubmodulo) => <SndPildora tipo={fila.tipoPildora}>{fila.estado}</SndPildora>}
          />
        </DataTable>
      </div>
    </section>
  )
}
