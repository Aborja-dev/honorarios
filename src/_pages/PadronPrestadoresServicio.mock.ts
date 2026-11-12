import type { DireccionItem } from './PadronPrestadores/sections/TablaDireccion'

export const DATOS_EJEMPLO_DIRECCIONES: DireccionItem[] = [
  {
    id: 1,
    alias: "casa",
    calle: 'Av. Insurgentes Sur',
    numeroExterior: '1735',
    numeroInterior: 'Piso 4, Int. 402',
    codigoPostal: '01020',
    colonia: 'Guadalupe Inn',
    municipioAlcaldia: 'Álvaro Obregón',
    entidadFederativa: 'Ciudad de México',
    pais: 'México',
    referenciasDomicilio: 'Frente al parque',
  },
  {
    id: 1,
    calle: 'Av. Insurgentes Sur',
    numeroExterior: '1735',
    numeroInterior: 'Piso 4, Int. 402',
    codigoPostal: '01020',
    colonia: 'Guadalupe Inn',
    municipioAlcaldia: 'Álvaro Obregón',
    entidadFederativa: 'Ciudad de México',
    pais: 'México',
    referenciasDomicilio: 'Frente al parque',
  }
]

export const DATOS_PERSONALES_PRUEBA = {
  nombre: 'Abraham',
  primerApellido: 'Borja',
  segundoApellido: 'Organista',
  curp: 'DDFR235689HDFRRB01',
  rfc: 'DDFR235689VF6',
  nacionalidad: 'MEXICANA',
}
