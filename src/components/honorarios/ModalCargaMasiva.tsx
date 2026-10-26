import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Dialog } from 'primereact/dialog'
import { SndBoton, SndIcono, SndMensaje, useNotificaciones } from '../snd'

export interface ModalCargaMasivaProps {
  visible: boolean
  onCerrar: () => void
  onImportacionExitosa?: (conteo: number) => void
}

/**
 * Encabezados y datos muestra para la plantilla oficial de carga masiva de prestadores.
 */
const ENCABEZADOS_PLANTILLA = [
  'CURP',
  'RFC',
  'Homoclave',
  'Nombre',
  'Primer Apellido',
  'Segundo Apellido',
  'Nacionalidad',
  'Correo Institucional',
  'Telefono Celular',
  'Telefono Fijo',
  'Codigo Postal',
  'Calle',
  'Numero Exterior',
  'Numero Interior',
  'Colonia',
  'Pais',
  'Municipio o Alcaldia',
  'Entidad Federativa',
  'Area de Estudio',
  'Grado de Avance',
  'Numero de Certificado o Cedula',
  'Area General',
  'Area Especifica',
  'Anios de Experiencia',
  'Comentarios',
]

const FILAS_EJEMPLO = [
  [
    'LORM880412MDFRRL09',
    'LORM880412',
    'HDF',
    'María Fernanda',
    'López',
    'Ríos',
    'MEXICANA',
    'mflopez.prestador@funcionpublica.gob.mx',
    '5541239876',
    '5520003000',
    '01020',
    'Av. Insurgentes Sur',
    '1735',
    'Piso 4',
    'Guadalupe Inn',
    'México',
    'Álvaro Obregón',
    'Ciudad de México',
    'Licenciatura en Derecho y Administración Pública',
    'TITULADO',
    '08945123',
    'PUBLICO_FEDERAL',
    'Administración Normativa',
    '6',
    'Expediente validado para contratación en el ejercicio fiscal vigente.',
  ],
  [
    'ROGJ920915HDFRRL02',
    'ROGJ920915',
    'AB3',
    'Jorge Alberto',
    'Rodríguez',
    'Gómez',
    'MEXICANA',
    'jrodriguez.prestador@funcionpublica.gob.mx',
    '5512345678',
    '5555554321',
    '03100',
    'Calle San Francisco',
    '450',
    '',
    'Del Valle Centro',
    'México',
    'Benito Juárez',
    'Ciudad de México',
    'Ingeniería en Sistemas Computacionales',
    'TITULADO',
    '11223344',
    'PUBLICO_FEDERAL',
    'Tecnologías de la Información',
    '4',
    'Especialista en sistemas de adquisiciones y contrataciones públicas.',
  ],
]

/**
 * Modal para la carga e importación masiva de expedientes al Padrón de Prestadores de Servicio.
 * Incluye la descarga de la plantilla oficial (.CSV) y zona de arrastre/selección de archivo.
 */
export function ModalCargaMasiva({ visible, onCerrar, onImportacionExitosa }: ModalCargaMasivaProps) {
  const notificar = useNotificaciones()
  const inputArchivoRef = useRef<HTMLInputElement | null>(null)

  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)

  const descargarPlantilla = () => {
    try {
      const lineasCsv = [
        ENCABEZADOS_PLANTILLA.join(','),
        ...FILAS_EJEMPLO.map((fila) =>
          fila.map((val) => (val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val)).join(','),
        ),
      ]

      const contenidoCsv = '\uFEFF' + lineasCsv.join('\r\n')
      const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const enlaceDescarga = document.createElement('a')
      enlaceDescarga.href = url
      enlaceDescarga.setAttribute('download', 'plantilla_carga_masiva_prestadores.csv')
      document.body.appendChild(enlaceDescarga)
      enlaceDescarga.click()
      document.body.removeChild(enlaceDescarga)
      URL.revokeObjectURL(url)

      notificar.exito(
        'La plantilla oficial "plantilla_carga_masiva_prestadores.csv" se descargó correctamente.',
        'Descarga completada',
      )
    } catch {
      notificar.error('Ocurrió un error al generar la plantilla de importación.', 'Error de descarga')
    }
  }

  const validarYAsignarArchivo = (archivo: File) => {
    setErrorValidacion(null)
    const extension = archivo.name.split('.').pop()?.toLowerCase()
    if (!extension || !['csv', 'xlsx', 'xls'].includes(extension)) {
      setErrorValidacion('Formato no admitido. Por favor selecciona un archivo con extensión .csv o .xlsx.')
      setArchivoSeleccionado(null)
      return
    }

    if (archivo.size > 15 * 1024 * 1024) {
      setErrorValidacion('El archivo supera el tamaño máximo permitido de 15 MB.')
      setArchivoSeleccionado(null)
      return
    }

    setArchivoSeleccionado(archivo)
  }

  const manejarArrastreSobre = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setArrastrando(true)
  }

  const manejarArrastreFuera = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setArrastrando(false)
  }

  const manejarSoltar = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setArrastrando(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validarYAsignarArchivo(e.dataTransfer.files[0])
    }
  }

  const manejarCambioArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validarYAsignarArchivo(e.target.files[0])
    }
  }

  const limpiarArchivo = () => {
    setArchivoSeleccionado(null)
    setErrorValidacion(null)
    if (inputArchivoRef.current) {
      inputArchivoRef.current.value = ''
    }
  }

  const procesarImportacion = () => {
    if (!archivoSeleccionado) {
      setErrorValidacion('Por favor selecciona o arrastra el archivo antes de iniciar la importación.')
      return
    }

    setProcesando(true)
    setErrorValidacion(null)

    // Simulación de procesamiento y validación de registros
    setTimeout(() => {
      setProcesando(false)
      const totalImportados = Math.floor(Math.random() * 15) + 5
      notificar.exito(
        `Se importaron satisfactoriamente ${totalImportados} expedientes al Padrón de Prestadores de Servicio.`,
        'Carga masiva completada',
      )
      onImportacionExitosa?.(totalImportados)
      limpiarArchivo()
      onCerrar()
    }, 1200)
  }

  const cerrarModal = () => {
    if (procesando) return
    limpiarArchivo()
    onCerrar()
  }

  return (
    <Dialog
      id="Carga-masiva"
      header="Carga Masiva de Prestadores de Servicio"
      visible={visible}
      onHide={cerrarModal}
      modal
      style={{ width: 'min(46rem, 95vw)' }}
      footer={
        <div className="fila fila--derecha" style={{ gap: 10 }}>
          <SndBoton variante="secundario" type="button" onClick={cerrarModal} disabled={procesando}>
            Cancelar
          </SndBoton>
          <SndBoton
            type="button"
            onClick={procesarImportacion}
            disabled={procesando || !archivoSeleccionado}
          >
            {procesando ? (
              <>Procesando importación...</>
            ) : (
              <>
                <SndIcono nombre="snd-checkmark--filled" tamano={18} />
                Iniciar importación masiva
              </>
            )}
          </SndBoton>
        </div>
      }
    >
      <div id="Carga-masiva-contenido" className="pila" style={{ gap: 20 }}>
        {/* PASO 1: DESCARGA DE LA PLANTILLA OFICIAL */}
        <section
          style={{
            padding: '16px 20px',
            border: '1px solid var(--neutro400, #CCCCCC)',
            borderRadius: 8,
            backgroundColor: 'var(--neutro100, #F8F9FA)',
          }}
        >
          <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="b1sb" style={{ margin: 0, color: 'var(--principal, #9B2247)' }}>
                1. Descarga la plantilla oficial
              </h3>
              <p className="sdr" style={{ margin: '4px 0 0', color: 'var(--neutro700, #555555)' }}>
                Contiene los encabezados obligatorios de Datos Personales, Domicilio, Escolaridad y Experiencia.
              </p>
            </div>
            <SndBoton
              variante="secundario"
              type="button"
              onClick={descargarPlantilla}
              aria-label="Descargar plantilla para importación masiva"
            >
              <SndIcono nombre="snd-document" tamano={18} />
              Descargar plantilla (.CSV)
            </SndBoton>
          </div>
        </section>

        {/* PASO 2: ZONA DE ARRASTRE Y SUBIDA DE ARCHIVO */}
        <section>
          <label className="b1sb" style={{ display: 'block', marginBottom: 8 }}>
            2. Cargar archivo cumplimentado <span className="requerido">*</span>
          </label>

          <input
            ref={inputArchivoRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
            onChange={manejarCambioArchivo}
          />

          <div
            onDragOver={manejarArrastreSobre}
            onDragLeave={manejarArrastreFuera}
            onDrop={manejarSoltar}
            onClick={() => inputArchivoRef.current?.click()}
            style={{
              padding: '28px 20px',
              border: `2px dashed ${arrastrando ? 'var(--principal, #9B2247)' : 'var(--neutro600, #767676)'}`,
              borderRadius: 8,
              backgroundColor: arrastrando ? 'rgba(155, 34, 71, 0.05)' : 'var(--neutro100, #ffffff)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'grid', placeItems: 'center', gap: 8 }}>
              <SndIcono nombre="snd-document" tamano={36} className="color--principal" />
              <div>
                <p className="b1sb" style={{ margin: 0 }}>
                  Arrastra tu archivo aquí o <span style={{ color: 'var(--principal, #9B2247)', textDecoration: 'underline' }}>haz clic para examinar</span>
                </p>
                <p className="sdr" style={{ margin: '4px 0 0', color: 'var(--neutro600, #767676)' }}>
                  Formatos admitidos: .CSV, .XLSX (Máximo 15 MB)
                </p>
              </div>
            </div>
          </div>

          {/* DETALLES DEL ARCHIVO SELECCIONADO */}
          {archivoSeleccionado && (
            <div
              className="fila"
              style={{
                marginTop: 12,
                padding: '10px 14px',
                background: 'var(--neutro200, #EEEEEE)',
                borderRadius: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className="fila" style={{ gap: 8, alignItems: 'center' }}>
                <SndIcono nombre="snd-document" tamano={20} className="color--principal" />
                <span className="b1sb">{archivoSeleccionado.name}</span>
                <span className="sdr" style={{ color: 'var(--neutro600)' }}>
                  ({(archivoSeleccionado.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <SndBoton
                variante="fantasma"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  limpiarArchivo()
                }}
                aria-label="Quitar archivo"
              >
                Quitar
              </SndBoton>
            </div>
          )}

          {errorValidacion && (
            <div style={{ marginTop: 8 }}>
              <span className="campo__error">{errorValidacion}</span>
            </div>
          )}
        </section>

        {/* NOTA INFORMATIVA INSTITUCIONAL */}
        <SndMensaje tipo="info">
          <p style={{ margin: 0 }}>
            Los expedientes contenidos en el archivo serán validados por el sistema contra la CURP y el RFC
            con homoclave. Aquellos registros válidos quedarán inscritos en el padrón con su respectivo folio.
          </p>
        </SndMensaje>
      </div>
    </Dialog>
  )
}
