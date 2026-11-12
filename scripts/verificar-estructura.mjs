#!/usr/bin/env node
/**
 * Script de verificación de estructura del proyecto del Módulo de Honorarios (SABG).
 * Comprueba que las carpetas de la arquitectura escalable existan antes de compilar o desplegar.
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const CARPETAS_REQUERIDAS = [
  'public',
  'scripts',
  'src/components',
  'src/lib',
  'src/pages',
  'src/utils',
]

let errores = 0
for (const carpeta of CARPETAS_REQUERIDAS) {
  const ruta = resolve(process.cwd(), carpeta)
  if (!existsSync(ruta)) {
    console.error(`[ERROR] Falta la carpeta requerida: ${carpeta}`)
    errores++
  }
}

if (errores > 0) {
  process.exit(1)
}
console.log('[OK] Estructura de carpetas del Módulo de Honorarios verificada correctamente.')
