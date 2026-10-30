import React from 'react'
import type { DireccionItem } from './SeccionDireccion'
import { TablaAcciones } from './TablaAcciones'

/**
 * Tabla de direcciones registradas. Es un envoltorio delgado sobre
 * `TablaAcciones`: solo declara sus columnas y sus textos.
 *
 * Desde la refactorización de secciones, la sección de dirección pinta su
 * propia tabla (para no acoplar el grid al montaje de un componente suelto),
 * pero este archivo se conserva para quien necesite la tabla de forma aislada.
 */
export type { DireccionItem }

interface TablaDireccionProps {
  direcciones: readonly DireccionItem[]
  onEditar?: (direccion: DireccionItem, index: number) => void
  onEliminar?: (index: number) => void
}

export const TablaDireccion: React.FC<TablaDireccionProps> = ({
  direcciones,
  onEditar,
  onEliminar,
}) => (
  <TablaAcciones
    filas={direcciones}
    vacia="No hay direcciones registradas."
    onEditar={onEditar}
    onEliminar={onEliminar}
    textoEditar="Editar dirección"
    textoEliminar="Eliminar dirección"
  >
    <TablaAcciones.Columna encabezado="Alias">
      {(dir: DireccionItem, i) => dir.alias || `Dirección ${i + 1}`}
    </TablaAcciones.Columna>
    <TablaAcciones.Columna encabezado="Dirección">
      {(dir: DireccionItem) =>
        [dir.calle, dir.numeroExterior, dir.colonia, dir.municipioAlcaldia]
          .filter(Boolean)
          .join(', ') || '-'
      }
    </TablaAcciones.Columna>
    <TablaAcciones.Columna encabezado="Estado">
      {(dir: DireccionItem) => dir.entidadFederativa || '-'}
    </TablaAcciones.Columna>
  </TablaAcciones>
)

export default TablaDireccion
