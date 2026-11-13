import React, { useState, type FormEvent } from 'react'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { SndBoton, SndBotonEnlace, SndIcono, SndMensaje, SndPildora, useNotificaciones } from '../../components'
import '../../components/honorarios/Honorarios.css'
import { useTitulo } from '../../lib/hooks'
import { Dropdown } from 'primereact/dropdown'
import { OPCIONES_RAMO, OPCIONES_UR } from '../../lib/honorarios.service'

/**
 * Pantalla de validación de identidad (`ValidarIdentidad.tsx`) para prestadores de servicios.
 */
export default function ValidarIdentidad() {
  useTitulo('Validar Identidad · Módulo de Honorarios')
  const notificar = useNotificaciones()

  const [curp, setCurp] = useState('')
  const [ramoBusqueda, setRamoBusqueda] = useState<string | null>('27')
  const [institucionBusqueda, setInstitucionBusqueda] = useState('000')
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const [compatibilidad, setCompatibilidaed] = useState('')
  const tieneCompatibilidad = () => {
    setRamoBusqueda('27 - Anticorrupcíon y Buen Gobierno')
    setInstitucionBusqueda('')
  }
  const handleValidar = (e) => {
    e.preventDefault()
    const formValues = {
      ramo: ramoBusqueda,
      ur: institucionBusqueda,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      curp: curp
    }
    console.log(formValues)
  }
  const estados = {
    "TIENE_COMPATIBILIDAD": (curp: string) => `El prestador con CURP de ${curp} tiene compatibilidad y no presenta conflictos para el ejercicio de sus funciones`,
    "ACTIVO_RUSP": (curp: string) => `El prestador con CURP de ${curp} no tiene compatibilidad y se encuentra en RUSP`,
    "CON CONTRATO": (curp: string) => `El prestador con CURP de ${curp} tiene contrato `,
  }
  return (
    <div className="contenedor">
      <h1 className="h1b patria">Validar Compatibilidad del Prestador</h1>
      {/* <p className="sh0m color--principal">Verificación de CURP, RFC y No Inhabilitación</p> */}

      <div className="reticulaGrid__12 gapy--16" style={{ marginTop: 16 }}>
        <section className="columna__6">
          <article className="honorarios-tarjeta">
            <div className="honorarios-tarjeta__encabezado">
              <h2 className="sh0b honorarios-tarjeta__titulo">Consulta de Identidad</h2>

            </div>

            <form className="formulario" style={{ maxWidth: 700 }} onSubmit={handleValidar} noValidate>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >

                <div className="campo">
                  <label htmlFor="busq-ramo" className="b1sb">
                    Ramo
                  </label>
                  <Dropdown
                    inputId="busq-ramo"
                    options={OPCIONES_RAMO}
                    value={ramoBusqueda}
                    onChange={(e) => setRamoBusqueda(e.value)}
                    placeholder="27 - Anticorrupcíon y Buen Gobierno"
                    appendTo="self"
                    disabled
                  />
                </div>

                <div className="campo">
                  <label htmlFor="busq-institucion" className="b1sb">
                    Institución
                  </label>
                  <Dropdown
                    inputId="busq-institucion"
                    options={OPCIONES_UR}
                    value={institucionBusqueda}
                    onChange={(e) => setInstitucionBusqueda(e.value)}
                    placeholder="027 - Secretaria Anticorrupcíon  y Buen Gobierno"
                    appendTo="self"
                    disabled

                  />
                </div>

              </div>

              <article className="campo">
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
              </article>


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
          {message && (<SndMensaje tipo='alerta'>{message}</SndMensaje>)}
          <div className='fila'>
             <SndBoton type="button" onClick={()=>{setCompatibilidaed('si')}}>
                  Simular compatibilidad
                </SndBoton>
                 <SndBoton type="button" onClick={()=>{setCompatibilidaed('no')}}>
                  Simular no compatibilidad
                </SndBoton>
                 <SndBoton type="button" onClick={()=>{setCompatibilidaed('noEncontrado')}}>
                  Simular no encontrado en RUSP                
                  </SndBoton>
          </div>
          {compatibilidad === 'si' && <SndMensaje tipo='alerta'>El prestador de servicios tiene posible compatibilidad</SndMensaje>}
          {compatibilidad === 'noEncontrado' && <SndMensaje tipo='alerta'>La persona con CURP no esta registrada en RUSP </SndMensaje>}
          {compatibilidad === 'no' && <SndMensaje tipo='error'>El prestador de servicios labora en otra institucion y no es posible tener compatibilidad</SndMensaje>}
          
          
          
        </section>
        <div className="columna__6">
        </div>
      </div>
    </div>
  )
}
