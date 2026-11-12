import { useState, type FormEvent } from 'react'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { SndBoton, SndMensaje, useNotificaciones } from '../snd'
import { UNIDADES_ADMINISTRATIVAS } from '../../lib/honorarios.service'

export interface ModalRegistroHonorariosProps {
  modalTipo: 'padron' | 'contratos' | 'modelo' | null
  onCerrar: () => void
}

/**
 * Diálogo modal con barra de pasos (`Stepper`) para alta rápida de Prestadores, Contratos o Modelos.
 */
export function ModalRegistroHonorarios({ modalTipo, onCerrar }: ModalRegistroHonorariosProps) {
  const notificar = useNotificaciones()
  const [pasoModal, setPasoModal] = useState(0)
  const [nombreCaptura, setNombreCaptura] = useState('')
  const [nombreError, setNombreError] = useState(false)
  const [unidadCaptura, setUnidadCaptura] = useState<string | null>(UNIDADES_ADMINISTRATIVAS[0])
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date(2026, 9, 23))

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    if (!nombreCaptura.trim()) {
      setNombreError(true)
      return
    }
    const etiquetas = {
      padron: 'Prestador registrado en el padrón correctamente.',
      contratos: 'Borrador de contrato de honorarios generado.',
      modelo: 'Nueva versión de modelo de contrato guardada.',
    }
    notificar.exito(etiquetas[modalTipo ?? 'padron'], 'Operación exitosa')
    setNombreCaptura('')
    setNombreError(false)
    setPasoModal(0)
    onCerrar()
  }

  return (
    <Dialog
      header={
        modalTipo === 'padron'
          ? 'Alta en Padrón del Prestador de Servicios'
          : modalTipo === 'contratos'
            ? 'Nuevo Contrato de Honorarios'
            : 'Registro de Modelo de Contrato'
      }
      visible={modalTipo !== null}
      onHide={onCerrar}
      modal
      style={{ width: 'min(38rem, 94vw)' }}
      footer={
        <div className="fila fila--derecha">
          <SndBoton variante="secundario" onClick={onCerrar}>
            Cancelar
          </SndBoton>
          <SndBoton type="submit" form="form-honorarios-modal">
            Guardar registro
          </SndBoton>
        </div>
      }
    >
      <Stepper activeStep={pasoModal} onChangeStep={(e) => setPasoModal(e.index)}>
        <StepperPanel header="Datos generales">
          <form id="form-honorarios-modal" className="formulario" onSubmit={guardar} noValidate>
            <div className="campo">
              <label htmlFor="campo-nombre-modal" className="b1sb">
                {modalTipo === 'modelo' ? 'Nombre de la plantilla o modelo' : 'Nombre completo del prestador'}{' '}
                <span className="requerido" aria-hidden="true">
                  *
                </span>
              </label>
              <InputText
                id="campo-nombre-modal"
                value={nombreCaptura}
                invalid={nombreError}
                aria-invalid={nombreError}
                onChange={(e) => setNombreCaptura(e.target.value)}
                onFocus={() => setNombreError(false)}
                placeholder={
                  modalTipo === 'modelo'
                    ? 'Ej. Modelo Honorarios Capítulo 1000'
                    : 'Ej. María Fernanda López Ríos'
                }
              />
              {nombreError && (
                <span className="campo__error" role="alert">
                  Este campo es obligatorio para continuar.
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="campo-unidad-modal" className="b1sb">
                Unidad Administrativa
              </label>
              <Dropdown
                inputId="campo-unidad-modal"
                ariaLabel="Unidad Administrativa"
                pt={{ select: { 'aria-label': 'Unidad Administrativa' } }}
                options={UNIDADES_ADMINISTRATIVAS.map((u) => ({ label: u, value: u }))}
                value={unidadCaptura}
                onChange={(e) => setUnidadCaptura(e.value)}
                placeholder="Selecciona una unidad"
                appendTo="self"
              />
            </div>

            <div className="campo">
              <label htmlFor="campo-fecha-modal" className="b1sb">
                Fecha de inicio de vigencia
              </label>
              <Calendar
                inputId="campo-fecha-modal"
                value={fechaInicio}
                onChange={(e) => setFechaInicio((e.value as Date | null) ?? null)}
                dateFormat="dd/mm/yy"
                showIcon
                appendTo="self"
              />
            </div>
          </form>
        </StepperPanel>

        <StepperPanel header="Validación y Anexos">
          <div className="pila">
            <SndMensaje tipo="exito">
              <p>Suficiencia presupuestal y compatibilidad de empleo verificadas automáticamente.</p>
            </SndMensaje>
            <p className="b1r">
              Al confirmar el guardado se asignará el folio consecutivo del ejercicio 2026 y se notificará al área
              revisora.
            </p>
          </div>
        </StepperPanel>
      </Stepper>
    </Dialog>
  )
}
