import { FormDireccion } from './SeccionDireccion'

/**
 * Re-export del formulario de dirección. Se movió a `SeccionDireccion.tsx`
 * porque el formulario, la validación y el modelo son una sola unidad de
 * dominio: separarlos en tres archivos obligaba a abrirlos todos para cambiar
 * un campo.
 *
 * @deprecated Importa `FormDireccion` desde `./SeccionDireccion`.
 */
export { FormDireccion }

export default FormDireccion
