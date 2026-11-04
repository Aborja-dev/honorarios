import React from 'react'
import type { DireccionItem } from './SeccionDireccion'
import { TablaAcciones, type ColumnaTabla } from '../../../components/TablaAcciones'

/**
 * Tabla de direcciones registradas, para quien necesite la tabla de forma
 * aislada. Es un envoltorio delgado sobre `TablaAcciones`: solo declara sus
 * columnas y sus textos.
 */

export type { DireccionItem }

/** Columnas de la tabla de direcciones, en un solo lugar reutilizable. */
export const COLUMNAS_DIRECCION: ColumnaTabla<DireccionItem>[] = [
  {
    encabezado: 'Alias',
    celda: (dir, i) => dir.alias || `Dirección ${i + 1}`,
  },
  {
    encabezado: 'Dirección',
    celda: (dir) =>
      [dir.calle, dir.numeroExterior, dir.colonia, dir.municipioAlcaldia]
        .filter(Boolean)
        .join(', ') || '-',
  },
  {
    encabezado: 'Estado',
    celda: (dir) => dir.entidadFederativa || '-',
  },
]

interface TablaDireccionProps {
  direcciones: readonly DireccionItem[]
  /** Recibe el índice del renglón dentro de `direcciones`. */
  onEditar?: (index: number) => void
  onEliminar?: (index: number) => void
}

export const TablaDireccion: React.FC<TablaDireccionProps> = ({
  direcciones,
  onEditar,
  onEliminar,
}) => (
  <TablaAcciones
    filas={direcciones}
    columnas={COLUMNAS_DIRECCION}
    vacia="No hay direcciones registradas."
    onEditar={onEditar}
    onEliminar={onEliminar}
    textoEditar="Editar dirección"
    textoEliminar="Eliminar dirección"
  />
)

export default TablaDireccion
