import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SeccionLista } from './SeccionLista'

/**
 * Pruebas del núcleo maestro-detalle.
 *
 * Se sustituyen `renderTabla` / `renderFormulario` por versiones mínimas (sin
 * PrimeReact ni CSS) para que un fallo señale a la lógica del núcleo y no a un
 * dropdown o a un estilo. Lo que se prueba es exactamente lo que el botón
 * Editar debe hacer: abrir el formulario con los datos del renglón correcto,
 * actualizarlo en sitio y mantener los índices coherentes al eliminar.
 */

interface Item {
  id?: string | number
  nombre: string
}

const INICIAL: Item = { nombre: '' }

/** Envoltura controlada: el padre es dueño de `filas`, igual que en la página. */
function Seccion({ filasIniciales }: { filasIniciales: Item[] }) {
  const [filas, setFilas] = useState<Item[]>(filasIniciales)
  return (
    <SeccionLista<Item>
      filas={filas}
      onCambio={setFilas}
      inicial={INICIAL}
      entidad="item"
      validar={(borrador) => (borrador.nombre.trim() ? null : 'Falta el nombre')}
      asignarId={(borrador, actuales, indice) => ({
        ...borrador,
        id: indice !== null ? actuales[indice]?.id : `nuevo-${actuales.length + 1}`,
      })}
      renderTabla={({ filas: visibles, onEditar, onEliminar }) => (
        <table>
          <tbody>
            {visibles.map((fila, indice) => (
              <tr key={fila.id ?? indice} data-testid={`fila-${indice}`}>
                <td>{fila.nombre}</td>
                <td>
                  <button type="button" onClick={() => onEditar(indice)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => onEliminar(indice)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      renderFormulario={({ valores, onCambio, editar, indice }) => (
        <div>
          <input
            aria-label="nombre"
            value={valores.nombre}
            onChange={(e) => onCambio({ nombre: e.target.value })}
          />
          <span data-testid="modo">{editar ? `editando:${indice}` : 'nuevo'}</span>
        </div>
      )}
    />
  )
}

describe('SeccionLista', () => {
  it('Editar abre el formulario con los datos del renglón pulsado', async () => {
    const user = userEvent.setup()
    render(<Seccion filasIniciales={[{ id: 'a', nombre: 'Uno' }, { id: 'b', nombre: 'Dos' }]} />)

    await user.click(screen.getAllByRole('button', { name: 'Editar' })[1])

    expect(screen.getByTestId('modo')).toHaveTextContent('editando:1')
    expect(screen.getByLabelText('nombre')).toHaveValue('Dos')
  })

  it('Actualizar modifica el renglón en sitio sin alterar a los demás', async () => {
    const user = userEvent.setup()
    render(<Seccion filasIniciales={[{ id: 'a', nombre: 'Uno' }, { id: 'b', nombre: 'Dos' }]} />)

    await user.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    const campo = screen.getByLabelText('nombre')
    await user.clear(campo)
    await user.type(campo, 'Uno editado')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getAllByTestId(/^fila-/)).toHaveLength(2)
    expect(screen.getByTestId('fila-0')).toHaveTextContent('Uno editado')
    expect(screen.getByTestId('fila-1')).toHaveTextContent('Dos')
  })

  it('Cancele vuelve a la tabla descartando los cambios', async () => {
    const user = userEvent.setup()
    render(<Seccion filasIniciales={[{ id: 'a', nombre: 'Uno' }]} />)

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    await user.type(screen.getByLabelText('nombre'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByLabelText('nombre')).not.toBeInTheDocument()
    expect(screen.getByTestId('fila-0')).toHaveTextContent('Uno')
  })

  it('la validación impide guardar y muestra el error', async () => {
    const user = userEvent.setup()
    render(<Seccion filasIniciales={[{ id: 'a', nombre: 'Uno' }]} />)

    await user.click(screen.getByRole('button', { name: 'Agregar item' }))
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Falta el nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('nombre')).toBeInTheDocument()
  })

  it('eliminar un renglón anterior mantiene el índice de edición coherente', async () => {
    const user = userEvent.setup()
    render(
      <Seccion
        filasIniciales={[
          { id: 'a', nombre: 'Uno' },
          { id: 'b', nombre: 'Dos' },
          { id: 'c', nombre: 'Tres' },
        ]}
      />,
    )

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Editar' })[1])

    expect(screen.getByTestId('modo')).toHaveTextContent('editando:1')
    expect(screen.getByLabelText('nombre')).toHaveValue('Tres')
  })

  it('eliminar el renglón borra la fila de la tabla', async () => {
    const user = userEvent.setup()
    render(<Seccion filasIniciales={[{ id: 'a', nombre: 'Uno' }]} />)

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(screen.queryByTestId('fila-0')).not.toBeInTheDocument()
  })
})
