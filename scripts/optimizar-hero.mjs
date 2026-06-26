// ─── Optimizador de imagen HERO (LCP) ─────────────────────────
// Herramienta de build/contenido para la imagen GRANDE del hero, que
// es el LCP de la home. A diferencia de optimizar-imagenes.mjs (que
// recorta cada foto a un tamaño fijo del catálogo), aquí:
//   • Se procesa UNA imagen original de máxima resolución.
//   • Se generan variantes RESPONSIVE a varios anchos.
//   • Se emiten 3 formatos por ancho: AVIF, WebP y JPEG (fallback).
//   • Se preserva el aspect-ratio (ancho fijo, alto automático); el
//     recorte por viewport lo hace el CSS con object-cover.
// NO toca el original: lee de --src (fuera del repo) y escribe en --dest.
//
// Uso:
//   node scripts/optimizar-hero.mjs --src "<imagen_origen>" [opciones]
//
// Opciones:
//   --src <ruta>       Imagen original (obligatoria).
//   --dest <carpeta>   Carpeta destino (def. public/img/hero).
//   --name <base>      Prefijo de los archivos (def. hero).
//   --widths <lista>   Anchos separados por coma (def. 640,960,1280,1600,1920,2560).
//                      Se descartan los mayores que el original (sin ampliar).
//   --q-avif <0-100>   Calidad AVIF (def. 52).
//   --q-webp <0-100>   Calidad WebP (def. 80).
//   --q-jpeg <0-100>   Calidad JPEG (def. 80).
//
// Al terminar imprime las cadenas srcset listas para pegar en <picture>
// y las dimensiones recomendadas (width/height) para evitar CLS.
//
// Ejemplo:
//   node scripts/optimizar-hero.mjs --src "C:/Users/juanc/Downloads/hero-decora.jpg"

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

function parseArgs(argv) {
  const args = {
    dest: 'public/img/hero',
    name: 'hero',
    widths: [640, 960, 1280, 1600, 1920, 2560],
    qAvif: 52,
    qWebp: 80,
    qJpeg: 80,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    switch (a) {
      case '--src': args.src = argv[++i]; break
      case '--dest': args.dest = argv[++i]; break
      case '--name': args.name = argv[++i]; break
      case '--widths':
        args.widths = argv[++i].split(',').map((n) => Number(n.trim())).filter(Boolean)
        break
      case '--q-avif': args.qAvif = Number(argv[++i]); break
      case '--q-webp': args.qWebp = Number(argv[++i]); break
      case '--q-jpeg': args.qJpeg = Number(argv[++i]); break
      default:
        console.warn(`Opción desconocida ignorada: ${a}`)
    }
  }
  return args
}

// Define los codificadores por formato (mismo input, distinta salida).
// `q` es la clave de calidad en opts que aplica a cada formato.
const FORMATOS = [
  { ext: 'avif', q: 'qAvif', encode: (p, q) => p.avif({ quality: q, effort: 5 }) },
  { ext: 'webp', q: 'qWebp', encode: (p, q) => p.webp({ quality: q }) },
  { ext: 'jpg', q: 'qJpeg', encode: (p, q) => p.jpeg({ quality: q, mozjpeg: true, progressive: true }) },
]

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.src) {
    console.error('Falta --src (imagen original). Ver cabecera del script.')
    process.exit(1)
  }
  if (!fs.existsSync(opts.src)) {
    console.error(`La imagen de origen no existe: ${opts.src}`)
    process.exit(1)
  }

  // Lee metadatos del original (respetando orientación EXIF).
  const base = sharp(opts.src).rotate()
  const meta = await base.metadata()
  const srcW = meta.width
  const srcH = meta.height
  const ratio = srcW / srcH

  // Descarta anchos mayores que el original (no ampliar). Si todos los
  // anchos pedidos superan al original, usa el ancho del original.
  let widths = opts.widths.filter((w) => w <= srcW).sort((a, b) => a - b)
  if (widths.length === 0) widths = [srcW]
  const maxW = widths[widths.length - 1]

  fs.mkdirSync(opts.dest, { recursive: true })

  console.log(`Optimizando hero desde: ${opts.src}`)
  console.log(`  original: ${srcW}x${srcH} (ratio ${ratio.toFixed(3)})`)
  console.log(`  destino : ${opts.dest}`)
  console.log(`  anchos  : ${widths.join(', ')}\n`)

  // srcset por formato, para imprimirlo al final.
  const srcsets = { avif: [], webp: [], jpg: [] }

  for (const w of widths) {
    // Reusa el buffer redimensionado como entrada de cada codificador.
    const redimensionada = await sharp(opts.src)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .toBuffer()

    for (const fmt of FORMATOS) {
      const buffer = await fmt.encode(sharp(redimensionada), opts[fmt.q]).toBuffer()
      const file = path.join(opts.dest, `${opts.name}-${w}.${fmt.ext}`)
      fs.writeFileSync(file, buffer)
      const kb = Math.round(buffer.length / 1024)
      srcsets[fmt.ext].push(`/${path.posix.join(opts.dest.replace(/\\/g, '/').replace(/^public\//, ''), `${opts.name}-${w}.${fmt.ext}`)} ${w}w`)
      console.log(`  ✓ ${opts.name}-${w}.${fmt.ext}  ${kb}KB`)
    }
  }

  const altMax = Math.round(maxW / ratio)
  console.log(`\n── Para <picture> en Hero.jsx ──────────────────────────`)
  console.log(`width={${maxW}} height={${altMax}}   // aspect-ratio del original\n`)
  for (const ext of ['avif', 'webp', 'jpg']) {
    console.log(`${ext} srcset:\n  ${srcsets[ext].join(',\n  ')}\n`)
  }
  console.log('Listo.')
}

main()
