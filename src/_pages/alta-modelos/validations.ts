import { formInicial } from './data'
import type { useForm } from '../../lib/useForm'

type OpcionesValidacion<Forma extends object> = Pick<
  Parameters<typeof useForm<Forma>>[0],
  'validar' | 'avisos'
>

/**
 * Validadores y avisos por sección del formulario.
 *
 * Cada entrada se pasa tal cual a `useForm` (`validar` + `avisos`) y también se
 * usa para pintar el estado "Completado / Por capturar" de cada acordeón.
 */
export const FormValidators = {
  contrato: {
    validar: (v: typeof formInicial.contrato) =>
      Boolean(
        v.claveModelo.trim() &&
        v.nombreModelo.trim() &&
        v.tipoContrato &&
        v.unidadAdministrativa &&
        v.partidaPresupuestal &&
        v.montoBrutoMensual.trim() &&
        v.fechaInicioVigencia &&
        v.fechaFinVigencia &&
        v.objetoContrato.trim(),
      ),
    avisos: {
      guardado: 'Datos del contrato guardados correctamente.',
      invalidado: 'Por favor completa los datos obligatorios del contrato.',
    },
  } satisfies OpcionesValidacion<typeof formInicial.contrato>,
  actividades: {
    validar: (v: typeof formInicial.actividades) =>
      Boolean(
        v.funcionPrincipal.trim() &&
        v.periodicidadActividad &&
        v.areaSupervisora.trim() &&
        v.descripcionActividades.trim(),
      ),
    avisos: {
      guardado: 'Actividades del modelo guardadas temporalmente.',
      invalidado: 'Por favor completa los datos obligatorios de actividades.',
    },
  } satisfies OpcionesValidacion<typeof formInicial.actividades>,
  entregables: {
    validar: (v: typeof formInicial.entregables) =>
      Boolean(
        v.nombreEntregable.trim() &&
        v.tipoEntregable &&
        v.periodicidadEntregable &&
        v.diaCorteEntrega.trim() &&
        v.cargoReceptor.trim() &&
        v.criteriosAceptacion.trim(),
      ),
    avisos: {
      guardado: 'Entregables del modelo guardados temporalmente.',
      invalidado: 'Por favor completa los datos obligatorios de entregables.',
    },
  } satisfies OpcionesValidacion<typeof formInicial.entregables>,
  escolaridad: {
    validar: (v: typeof formInicial.escolarida) =>
      Boolean(v.nivelEstudios && v.carreraRequerida.trim() && v.estatusEstudios),
    avisos: {
      guardado: 'Datos de escolaridad guardados temporalmente.',
      invalidado: 'Por favor completa los datos de escolaridad obligatorios.',
    },
  } satisfies OpcionesValidacion<typeof formInicial.escolarida>,
  experiencia: {
    validar: (v: typeof formInicial.experiencia) =>
      Boolean(
        v.areaGeneralExperiencia &&
        v.areaEspecificaExperiencia &&
        v.aniosExperiencia.trim() &&
        v.comentariosExperiencia.trim(),
      ),
    avisos: {
      guardado: 'Datos de experiencia laboral guardados temporalmente.',
      invalidado: 'Por favor completa los datos de experiencia laboral obligatorios.',
    },
  } satisfies OpcionesValidacion<typeof formInicial.experiencia>,
}
