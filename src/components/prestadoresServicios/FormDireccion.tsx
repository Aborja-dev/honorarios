import { FormDireccion } from './SeccionDireccion'

/**
 * Re-export del formulario de dirección. Vivía en su propio archivo, pero el
 * formulario, la validación y el modelo son una sola unidad de dominio:
 * separarlos obligaba a abrir tres archivos para cambiar un campo.
 *
 * @deprecated Importa `FormDireccion` desde `./SeccionDireccion`.
 */
export { FormDireccion }

export default FormDireccion
