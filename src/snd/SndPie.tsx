import { useMovil } from '../core/useMovil'
import { SndIcono } from './SndIcono'

/** Enlace del pie de página. */
interface Enlace {
  texto: string
  url: string
}

const COLUMNA_1: Enlace[] = [
  { texto: 'Datos', url: 'https://datos.gob.mx/' },
  {
    texto: 'Portal de Obligaciones de Transparencia',
    url: 'https://www.gob.mx/inafed/acciones-y-programas/portal-de-obligaciones-de-transparencia-pot',
  },
  { texto: 'Plataforma Nacional de Transparencia', url: 'https://www.plataformadetransparencia.org.mx/Inicio' },
  { texto: 'Alerta', url: 'https://alertadores.buengobierno.gob.mx/' },
]

/** Los enlaces con destino `#` son los que el SND deja sin destino en su ejemplo. */
const COLUMNA_2: Enlace[] = [
  { texto: 'Administraciones anteriores', url: '#' },
  { texto: 'Declaración de accesibilidad', url: 'https://www.gob.mx/accesibilidad' },
  { texto: 'Marco jurídico', url: 'http://www.ordenjuridico.gob.mx/' },
  { texto: 'Política de seguridad', url: '#' },
  { texto: 'Términos y condiciones', url: 'https://www.gob.mx/terminos' },
  { texto: 'Aviso de privacidad', url: '#' },
  { texto: 'Aviso de privacidad simplificado', url: '#' },
  { texto: 'Mapa de sitio', url: '#' },
]

const REDES = [
  { etiqueta: 'Facebook de Presidencia', url: 'https://www.facebook.com/gobmexico', icono: 'snd-snd-facebook' },
  { etiqueta: 'Twitter de Presidencia', url: 'https://twitter.com/GobiernoMX', icono: 'snd-snd-x' },
  { etiqueta: 'Instagram de Presidencia', url: 'https://www.instagram.com/gobmexico/', icono: 'snd-snd-instagram' },
  { etiqueta: 'Youtube de Presidencia', url: 'https://www.youtube.com/@gobiernodemexico', icono: 'snd-snd-youtube' },
]

const ENLACE_EXTERNO = { target: '_blank', rel: 'noopener', title: 'El enlace abre en ventana nueva' }

function ListaEnlaces({ enlaces, clase }: { enlaces: Enlace[]; clase: string }) {
  return (
    <div className={clase}>
      {enlaces.map((e) => (
        <a key={e.texto} className="footer__enlacesLink" href={e.url} {...ENLACE_EXTERNO}>
          {e.texto}
        </a>
      ))}
    </div>
  )
}

export interface SndPieProps {
  /** Versión reducida del pie, con escudo y versión del sistema. */
  lite?: boolean
  /** Versión del sistema; solo se muestra en la versión lite. */
  version?: string
}

/**
 * Pie de página del SND (`<footer class="footer">`), en versión completa y versión lite.
 *
 * Acción requerida antes de publicar: los enlaces con destino `#` (avisos de privacidad,
 * política de seguridad, mapa de sitio y administraciones anteriores) son los que el SND deja
 * sin destino en su ejemplo. Cada proyecto debe sustituirlos por los propios en `COLUMNA_2`.
 *
 * @example
 * <SndPie />
 * <SndPie lite version="1.2" />
 */
export function SndPie({ lite = false, version = '1.0' }: SndPieProps) {
  const movil = useMovil()
  const escudo = (
    <div className="footer__mexico">
      <SndIcono
        nombre="snd-gobierno-mexico"
        className="footer__escudo"
        ajuste="ancho"
        colorOriginal
        etiqueta="Gobierno de México"
      />
    </div>
  )

  if (lite) {
    return (
      <footer className="footer">
        <div className="footer__contenedor footer--lite">
          {escudo}
          <div className="footer__version">Versión {version}</div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="footer">
      <div className="footer__contenedor">
        {escudo}

        <div className="footer__colCentral">
          <div className="footer__gobmx">
            <details className="mexico__details" open={!movil}>
              <summary className="footer__summary footer__summary--gobmx">
                <span className="footer__tit">¿Qué es gob.mx?</span>
              </summary>
              <p className="mexico__detailsp">
                Es el portal único de trámites, información y participación ciudadana.{' '}
                <a href="https://www.gob.mx/que-es-gobmx" {...ENLACE_EXTERNO}>
                  <b>Leer más</b>
                </a>
              </p>
            </details>
          </div>

          <div className="footer__enlaces">
            <details className="mexico__details" open={!movil}>
              <summary className="footer__summary footer__summary--enlaces">
                <span className="footer__tit">Enlaces</span>
              </summary>
              <div className="footer__enlacesList">
                <ListaEnlaces enlaces={COLUMNA_1} clase="footer__enlacesCol1" />
                <ListaEnlaces enlaces={COLUMNA_2} clase="footer__enlacesCol2" />
              </div>
            </details>
          </div>
        </div>

        <div className="footer__redes">
          <p className="footer__denuncia">
            <a href="https://sidec.buengobierno.gob.mx/#!/" {...ENLACE_EXTERNO}>
              Denuncia contra servidores públicos
            </a>
          </p>
          <div className="footer__siguenosCont">
            <p className="footer__siguenosTit">Síguenos en</p>
            <ul className="footer__redes__ul">
              {REDES.map((r) => (
                <li key={r.etiqueta}>
                  <a href={r.url} aria-label={r.etiqueta} {...ENLACE_EXTERNO}>
                    <SndIcono nombre={r.icono} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__079">
            <div className="footer__079col1">
              <SndIcono nombre="snd-snd-079" className="footer__079img" />
              <span className="footer__079num">079</span>
            </div>
            <div className="footer__079info">
              <span className="footer__079txt">
                Comunícate, <br />
                estamos para ayudarte
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
