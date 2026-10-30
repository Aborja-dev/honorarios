/**
 * Arranca, compila o previsualiza la app con `VITE_SCROLL` forzado.
 *
 * Existe para que `VITE_SCROLL=off` no dependa de cómo cada shell exporta
 * variables: el proyecto se usa desde PowerShell, CMD, Git Bash y Linux/macOS,
 * y cada uno tiene su propia sintaxis. Aquí se define la variable en el proceso
 * hijo y se llama al Vite **local** (el de `node_modules`), así el comando es
 * el mismo en todos los sistemas y no depende de que `vite` esté en el PATH.
 *
 * Uso interno (lo invocan los scripts de package.json):
 *   node scripts/con-scroll.mjs off dev
 *   node scripts/con-scroll.mjs off build
 *   node scripts/con-scroll.mjs on preview
 */
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const [valor, accion = 'dev'] = process.argv.slice(2)

const ACCIONES = {
  dev: [],
  build: ['build'],
  preview: ['preview'],
}

if (!['on', 'off'].includes(valor)) {
  console.error('Uso: node scripts/con-scroll.mjs <on|off> <dev|build|preview>')
  process.exit(1)
}

const argsVite = ACCIONES[accion]
if (!argsVite) {
  console.error(`Acción desconocida: ${accion}. Usa: ${Object.keys(ACCIONES).join(', ')}`)
  process.exit(1)
}

// Se resuelve el binario del Vite instalado, no el que haya en el PATH.
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const paqueteVite = require.resolve('vite/package.json', { paths: [raiz] })
const rutaBin = JSON.parse(
  require('node:fs').readFileSync(paqueteVite, 'utf8'),
).bin

const bin = join(dirname(paqueteVite), typeof rutaBin === 'string' ? rutaBin : rutaBin.vite)
if (!existsSync(bin)) {
  console.error(`No se encontró el binario de Vite en ${bin}. ¿Instalaste dependencias?`)
  process.exit(1)
}

console.log(`▶ VITE_SCROLL=${valor} → vite ${argsVite.join(' ')}`.trim())

/*
  Sin `shell: true`: se lanza `node <ruta-al-bin>` y así los argumentos no se
  concatenan en una línea de comandos (evita DEP0190 y funcionan las rutas con
  espacios, como C:\Users\Abraham\...). Stdio heredado para que el hot reload y
  los logs del dev server se vean igual que con `vite` directo.
*/
const hijo = spawn(process.execPath, [bin, ...argsVite], {
  stdio: 'inherit',
  env: { ...process.env, VITE_SCROLL: valor },
})

hijo.on('error', (error) => {
  console.error(`No se pudo iniciar Vite: ${error.message}`)
  process.exit(1)
})

hijo.on('exit', (codigo, senal) => {
  if (senal) process.kill(process.pid, senal)
  process.exit(codigo ?? 0)
})
