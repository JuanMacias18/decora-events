// ─── Importador del catálogo de "Diseña Tu Evento" (mobiliario) ──
// Herramienta de contenido, análoga a optimizar-imagenes.mjs pero para
// UNA carpeta con MÚLTIPLES subcarpetas (cada subcarpeta = una categoría).
// Lee de una carpeta de ORIGEN (fuera del repo), NO toca los originales.
//
// Qué hace:
//   1. Detecta automáticamente cada subcarpeta de primer nivel como
//      categoría (recorre subcarpetas anidadas dentro para recolectar
//      todas sus fotos, así no importa si alguien creó una carpeta
//      extra sin querer).
//   2. Ignora archivos que no son imagen (desktop.ini, Thumbs.db, etc).
//   3. Optimiza cada foto a WebP (800x600, 4:3, cover) con los mismos
//      parámetros que optimizar-imagenes.mjs, hacia
//      public/img/mobiliario/<categoria-slug>/<categoria-slug>-NN.webp
//   4. Genera/sobrescribe src/data/mobiliarioCategorias.json y
//      src/data/mobiliario.json con precio:0 y descripcion:'' (pendientes).
//
// Cómo agregar una categoría nueva en el futuro (sin tocar componentes
// de React): crear una subcarpeta nueva dentro de la carpeta de origen
// (ej. "Candelabros") con sus fotos, y volver a correr este script. La
// categoría aparece sola en "Diseña Tu Evento". Ojo: re-correr el script
// REGENERA por completo mobiliarioCategorias.json y mobiliario.json a
// partir de las carpetas de origen — si ya habías puesto precios/nombres
// reales a mano, haz respaldo antes o mergea manualmente.
//
// Uso:
//   node scripts/importar-mobiliario.mjs --src "<carpeta_origen>"
//
// Opciones:
//   --src <ruta>   Carpeta de origen con las subcarpetas-categoría (obligatoria).
//   --dry-run      Solo muestra qué haría, no escribe nada.

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const REPO_ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DEST_ROOT = path.join(REPO_ROOT, 'public/img/mobiliario')
const CATEGORIAS_JSON = path.join(REPO_ROOT, 'src/data/mobiliarioCategorias.json')
const MOBILIARIO_JSON = path.join(REPO_ROOT, 'src/data/mobiliario.json')

const EXT_VALIDAS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])
const IMG_OPTS = { width: 800, height: 600, fit: 'cover', quality: 82, maxKb: 200 }

// Etiquetas curadas para las categorías conocidas hoy (corrige tildes y
// mayúsculas del nombre de carpeta). Una categoría NUEVA que no esté en
// este mapa igual funciona: se usa un Title Case automático del nombre
// de carpeta como respaldo — por eso no hace falta tocar código para
// que aparezca, solo para que el título se vea más pulido.
const ETIQUETAS_CONOCIDAS = {
  'Base tortas-pasabocas': 'Bases de Torta y Pasabocas',
  'Centro de mesa': 'Centros de Mesa',
  'Estructura de hierro': 'Estructuras de Hierro',
  'Letras y numeros': 'Letras y Números',
  'Mesas de acrilico': 'Mesas de Acrílico',
  'Mesas de Hierro': 'Mesas de Hierro',
  'Mesas de madera': 'Mesas de Madera',
  'Mesas y sillas niños': 'Mesas y Sillas para Niños',
  Paneles: 'Paneles',
  'Paneles 3D': 'Paneles 3D',
  Recibidores: 'Recibidores',
  Tarimas: 'Tarimas',
  Tronos: 'Tronos y Sillones',
}

// Corrección puntual de datos: estas 4 fotos quedaron dentro de la
// carpeta "Mesas y sillas niños" pero por su nombre pertenecen a
// "Centro de mesa" (que llegó vacía). Confirmado con Juan David.
const REMAPS = [
  {
    carpeta: 'Mesas y sillas niños',
    patron: /^centros-de-mesa-/i,
    categoria: 'Centro de mesa',
  },
]

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--src') args.src = argv[++i]
    else if (a === '--dry-run') args.dryRun = true
  }
  return args
}

function slugify(str) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tituloAutomatico(nombreCarpeta) {
  return nombreCarpeta
    .split(/\s+/)
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

// Recolecta imágenes recursivamente dentro de una carpeta-categoría,
// aplanando cualquier subcarpeta anidada (p. ej. una carpeta duplicada
// creada sin querer al arrastrar archivos).
function listarImagenes(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      out.push(...listarImagenes(full))
    } else if (EXT_VALIDAS.has(path.extname(ent.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out.sort((a, b) => a.localeCompare(b, 'es'))
}

async function optimizar(srcFile, destFile) {
  let quality = IMG_OPTS.quality
  let buffer
  let intentos = 0
  do {
    buffer = await sharp(srcFile)
      .rotate()
      .resize({
        width: IMG_OPTS.width,
        height: IMG_OPTS.height,
        fit: IMG_OPTS.fit,
        position: 'centre',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer()
    intentos++
    if (buffer.length / 1024 <= IMG_OPTS.maxKb || quality <= 45) break
    quality -= 6
  } while (intentos < 8)

  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.writeFileSync(destFile, buffer)
  return { kb: Math.round(buffer.length / 1024), quality }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.src) {
    console.error('Falta --src. Ver instrucciones en la cabecera del script.')
    process.exit(1)
  }
  if (!fs.existsSync(opts.src)) {
    console.error(`La carpeta de origen no existe: ${opts.src}`)
    process.exit(1)
  }

  const carpetasCategoria = fs
    .readdirSync(opts.src, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'es'))

  // categoria-slug -> { nombre, archivos: [rutas absolutas] }
  const porCategoria = new Map()
  function bucket(nombreCarpeta) {
    const nombre = ETIQUETAS_CONOCIDAS[nombreCarpeta] ?? tituloAutomatico(nombreCarpeta)
    const id = slugify(nombreCarpeta)
    if (!porCategoria.has(id)) porCategoria.set(id, { nombre, archivos: [] })
    return porCategoria.get(id)
  }

  for (const nombreCarpeta of carpetasCategoria) {
    const dirAbs = path.join(opts.src, nombreCarpeta)
    const remap = REMAPS.find((r) => r.carpeta === nombreCarpeta)
    const imagenes = listarImagenes(dirAbs)

    if (!remap) {
      if (imagenes.length) bucket(nombreCarpeta).archivos.push(...imagenes)
      continue
    }

    // Carpeta con remap: separa los archivos que coinciden del patrón
    // hacia la categoría destino; el resto se queda en su categoría normal.
    const remapeados = imagenes.filter((f) => remap.patron.test(path.basename(f)))
    const resto = imagenes.filter((f) => !remap.patron.test(path.basename(f)))
    if (resto.length) bucket(nombreCarpeta).archivos.push(...resto)
    if (remapeados.length) bucket(remap.categoria).archivos.push(...remapeados)
  }

  const categoriasVacias = [...porCategoria.entries()].filter(([, v]) => v.archivos.length === 0)
  for (const [, v] of categoriasVacias) porCategoria.delete(v)

  const totalFotos = [...porCategoria.values()].reduce((s, v) => s + v.archivos.length, 0)
  console.log(`Categorías detectadas: ${porCategoria.size}`)
  for (const [id, v] of porCategoria) {
    console.log(`  - ${v.nombre} (${id}): ${v.archivos.length} fotos`)
  }
  console.log(`Total: ${totalFotos} fotos\n`)

  if (opts.dryRun) {
    console.log('(dry-run: no se optimizó ni escribió nada)')
    return
  }

  const categoriasOut = []
  const itemsOut = []
  let orden = 0
  let procesadas = 0
  let maxKb = 0

  for (const [id, v] of porCategoria) {
    categoriasOut.push({ id, nombre: v.nombre, orden: orden++ })
    let i = 0
    for (const srcFile of v.archivos) {
      i++
      const numero = String(i).padStart(2, '0')
      const destFile = path.join(IMG_DEST_ROOT, id, `${id}-${numero}.webp`)
      const r = await optimizar(srcFile, destFile)
      maxKb = Math.max(maxKb, r.kb)
      procesadas++
      itemsOut.push({
        id: `${id}-${numero}`,
        nombre: `${v.nombre} ${numero}`,
        categoria: id,
        imagen: `/img/mobiliario/${id}/${id}-${numero}.webp`,
        precio: 0,
        descripcion: '',
      })
    }
    console.log(`  ✓ ${v.nombre}: ${i} fotos optimizadas`)
  }

  const categoriasJson = {
    _nota:
      'Generado por scripts/importar-mobiliario.mjs a partir de las subcarpetas del origen. Volver a correr el script regenera este archivo completo.',
    categorias: categoriasOut,
  }
  const mobiliarioJson = {
    _nota:
      "PRECIOS PLACEHOLDER (precio:0) y NOMBRES AUTOGENERADOS. Reemplazar 'precio' y 'nombre'/'descripcion' de cada ítem con los valores reales que confirme Juan David antes de producción. Generado por scripts/importar-mobiliario.mjs.",
    items: itemsOut,
  }

  fs.mkdirSync(path.dirname(CATEGORIAS_JSON), { recursive: true })
  fs.writeFileSync(CATEGORIAS_JSON, JSON.stringify(categoriasJson, null, 2) + '\n')
  fs.writeFileSync(MOBILIARIO_JSON, JSON.stringify(mobiliarioJson, null, 2) + '\n')

  console.log(`\nListo: ${procesadas} fotos optimizadas. Peso máximo: ${maxKb}KB.`)
  console.log(`Escrito: ${path.relative(REPO_ROOT, CATEGORIAS_JSON)}`)
  console.log(`Escrito: ${path.relative(REPO_ROOT, MOBILIARIO_JSON)}`)
}

main()
