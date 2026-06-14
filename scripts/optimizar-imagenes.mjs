// ─── Optimizador de imágenes (WebP) ───────────────────────────
// Herramienta REUTILIZABLE de build/contenido. Lee imágenes de una
// carpeta de ORIGEN (normalmente fuera del repo) y escribe versiones
// optimizadas en WebP dentro del proyecto. NO toca los originales.
//
// Se usa para: catálogo, portfolio, og-image y las fotos del cotizador
// (cada caso con su tamaño y carpeta destino). Ver ejemplos en CLAUDE.md.
//
// Uso:
//   node scripts/optimizar-imagenes.mjs --src "<carpeta_origen>" --dest "<carpeta_destino>" [opciones]
//
// Opciones:
//   --src <ruta>        Carpeta de origen (obligatoria).
//   --dest <ruta>       Carpeta destino dentro del proyecto (obligatoria).
//   --width <px>        Ancho objetivo (def. 800).
//   --height <px>       Alto objetivo (def. 600). Usar 0 para no fijar alto.
//   --fit <modo>        cover | inside | contain (def. cover).
//   --quality <0-100>   Calidad WebP inicial (def. 82).
//   --max-kb <kb>       Peso máximo por imagen; baja calidad hasta lograrlo (def. 200).
//   --recursive         Procesa subcarpetas conservando su estructura.
//   --skip-existing     No reprocesa si el destino ya existe.
//
// Ejemplo (catálogo, una categoría):
//   node scripts/optimizar-imagenes.mjs --src "C:/.../02-CATALOGO/Cumpleanos" --dest "public/img/catalogo/cumpleanos"

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

// ── Parseo simple de argumentos ────────────────────────────────
function parseArgs(argv) {
  const args = { width: 800, height: 600, fit: 'cover', quality: 82, maxKb: 200 }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    switch (a) {
      case '--src': args.src = argv[++i]; break
      case '--dest': args.dest = argv[++i]; break
      case '--width': args.width = Number(argv[++i]); break
      case '--height': args.height = Number(argv[++i]); break
      case '--fit': args.fit = argv[++i]; break
      case '--quality': args.quality = Number(argv[++i]); break
      case '--max-kb': args.maxKb = Number(argv[++i]); break
      case '--recursive': args.recursive = true; break
      case '--skip-existing': args.skipExisting = true; break
      default:
        console.warn(`Opción desconocida ignorada: ${a}`)
    }
  }
  return args
}

const EXT_VALIDAS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])

// Normaliza el nombre de archivo a una ruta URL-segura: minúsculas,
// espacios y caracteres raros → guiones, sin tildes. Extensión .webp.
function nombreWebp(nombre) {
  const base = path.basename(nombre, path.extname(nombre))
  const limpio = base
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${limpio}.webp`
}

// Recolecta archivos de imagen (recursivo opcional).
function listarImagenes(dir, recursive) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      // Ignora carpetas de trabajo/originales por convención.
      if (recursive && !ent.name.startsWith('_')) out.push(...listarImagenes(full, recursive))
    } else if (EXT_VALIDAS.has(path.extname(ent.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

async function optimizar(srcFile, destFile, opts) {
  // Baja la calidad en escalones hasta cumplir el peso máximo.
  let quality = opts.quality
  let buffer
  let intentos = 0
  do {
    const pipe = sharp(srcFile)
      .rotate() // respeta la orientación EXIF (fotos de celular)
      .resize({
        width: opts.width,
        height: opts.height || null,
        fit: opts.fit,
        position: 'centre',
        withoutEnlargement: true,
      })
      .webp({ quality })
    buffer = await pipe.toBuffer()
    intentos++
    if (buffer.length / 1024 <= opts.maxKb || quality <= 45) break
    quality -= 6
  } while (intentos < 8)

  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.writeFileSync(destFile, buffer)
  const meta = await sharp(buffer).metadata()
  return { kb: Math.round(buffer.length / 1024), quality, w: meta.width, h: meta.height }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.src || !opts.dest) {
    console.error('Faltan --src y/o --dest. Ver instrucciones en la cabecera del script.')
    process.exit(1)
  }
  if (!fs.existsSync(opts.src)) {
    console.error(`La carpeta de origen no existe: ${opts.src}`)
    process.exit(1)
  }

  const archivos = listarImagenes(opts.src, opts.recursive)
  if (archivos.length === 0) {
    console.error(`No se encontraron imágenes en: ${opts.src}`)
    process.exit(1)
  }

  console.log(`Optimizando ${archivos.length} imágenes`)
  console.log(`  origen : ${opts.src}`)
  console.log(`  destino: ${opts.dest}`)
  console.log(`  config : ${opts.width}x${opts.height || 'auto'} fit=${opts.fit} q≤${opts.quality} ≤${opts.maxKb}KB\n`)

  let ok = 0, saltados = 0, maxKb = 0
  for (const srcFile of archivos) {
    const rel = opts.recursive ? path.relative(opts.src, srcFile) : path.basename(srcFile)
    const destRel = path.join(path.dirname(rel), nombreWebp(path.basename(rel)))
    const destFile = path.join(opts.dest, destRel)

    if (opts.skipExisting && fs.existsSync(destFile)) {
      saltados++
      continue
    }
    try {
      const r = await optimizar(srcFile, destFile, opts)
      maxKb = Math.max(maxKb, r.kb)
      const aviso = r.kb > opts.maxKb ? '  ⚠ sobre el límite' : ''
      console.log(`  ✓ ${destRel}  →  ${r.w}x${r.h}  ${r.kb}KB  (q${r.quality})${aviso}`)
      ok++
    } catch (err) {
      console.error(`  ✗ Error con ${srcFile}: ${err.message}`)
    }
  }

  console.log(`\nListo: ${ok} optimizadas${saltados ? `, ${saltados} saltadas` : ''}. Peso máximo: ${maxKb}KB.`)
}

main()
