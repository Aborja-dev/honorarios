import { useState, type FormEvent } from 'react'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, useNotificaciones } from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../hooks'

/**
 * Pantalla de validación de identidad (`ValidarIdentidad.tsx`) para prestadores de servicios.
 */
export default function ValidarIdentidad() {
  useTitulo('Validar Identidad · Módulo de Honorarios')
  const notificar = useNotificaciones()

  const [curp, setCurp] = useState('')

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)
  const [validado, setValidado] = useState(false)
  const [error, setError] = useState(false)

  const verificar = (e: FormEvent) => {
    e.preventDefault()
    if (!curp.trim() ) {
      setError(true)
      return
    }
    setValidado(true)
    notificar.exito('Identidad verificada con RENAPO y padrón fiscal.', 'Validación exitosa')
  }
const estados = {
  "TIENE_COMPATIBILIDAD": (curp: string)=>`El prestador con CURP de ${curp} tiene compatibilidad y no presenta conflictos para el ejercicio de sus funciones`,
  "ACTIVO_RUSP": (curp: string)=>`El prestador con CURP de ${curp} no tiene compatibilidad y se encuentra en RUSP`,
  "CON CONTRATO": (curp: string)=>`El prestador con CURP de ${curp} tiene contrato `,
}
  return (
    <div className="contenedor">
      <h1 className="h1b patria">Validar Compatibilidad del Prestador</h1>
      {/* <p className="sh0m color--principal">Verificación de CURP, RFC y No Inhabilitación</p> */}

      <div className="reticulaGrid__12 gapy--16" style={{ marginTop: 16 }}>
        <div className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Consulta de Identidad</h2>

            </div>

            <form className="formulario" style={{maxWidth:700}} onSubmit={verificar} noValidate>
              <div className="campo">
                <label htmlFor="val-curp" className="b1sb">
                  CURP (18 caracteres){' '}
                  <span className="requerido" aria-hidden="true">
                    *
                  </span>
                </label>
                <InputText
                  id="val-curp"
                  value={curp}
                  invalid={error && !curp.trim()}
                  onChange={(e) => setCurp(e.target.value.toUpperCase())}
                  onFocus={() => setError(false)}
                  placeholder="Ej. LORM880412MDFRRL09"
                />
              </div>


              <div className="campo">
                <label htmlFor="fecha-inicio" className="b1sb">
                  Fecha de inicio
                </label>
                <Calendar
                  inputId="fecha-inicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  appendTo="self"
                />
              </div>

              <div className="campo">
                <label htmlFor="fecha-fin" className="b1sb">
                  Fecha de fin
                </label>
                <Calendar
                  inputId="fecha-fin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin((e.value as Date | null) ?? null)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  appendTo="self"
                />
              </div>

              {error && (
                <span className="campo__error" role="alert">
                  Debes capturar tanto la CURP las fechas de inicio y fin de tu contrato para validar la compatibilidad.
                </span>
              )}

              <div className="fila">
                <SndBoton type="submit">
                  <span><SndIcono nombre="snd-checkmark" tamano={20} /></span>
                  Validar compatibilidad
                  </SndBoton>
                <SndBotonEnlace variante="secundario" to="/admin/padron">
                <span><SndIcono nombre="snd-arrow--left" tamano={20} /></span>
                  Ir al padrón de prestadores
                </SndBotonEnlace>
                <SndBoton variante="fantasma">
                <span><SndIcono nombre="snd-document" tamano={18} /></span>
                  Carga masiva
                </SndBoton>
              </div>
            </form>
          </article>
          <SndMensaje tipo='alerta'>{`El prestador con CURP de ${curp} tiene compatibilidad y no presenta conflictos para el ejercicio de sus funciones`}</SndMensaje>
        </div>

        <div className="columna__6">
        </div>
      </div>
    </div>
  )
}
