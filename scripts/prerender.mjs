// ─── Prerendering de rutas estáticas ──────────────────────────
// Se ejecuta en `npm run build` (después de los builds de cliente y SSR).
// Genera un index.html estático por ruta dentro de dist/, con el HTML
// real de la página y sus metadatos SEO (title, description, og:*).
//
// IMPORTANTE para mantenimiento:
// - La lista de rutas se genera LEYENDO src/data/categorias.json y
//   src/data/productos.json: agregar productos o categorías nuevas NO
//   requiere tocar este script.
// - Si se agrega una RUTA NUEVA al router (src/App.jsx), hay que
//   añadirla aquí (en RUTAS_FIJAS o con su propia fuente de datos)
//   y darle SEO en src/config/seo.js. Ver nota en CLAUDE.md.
// - /carrito se prerenderiza como shell vacío (es 100% dinámica).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const leerJson = (p) => JSON.parse(fs.readFileSync(path.join(raiz, p), 'utf8'))

const categorias = leerJson('src/data/categorias.json')
const productos = leerJson('src/data/productos.json')

const RUTAS_FIJAS = ['/', '/carrito']
const rutas = [
  ...RUTAS_FIJAS,
  ...categorias.map((c) => `/categoria/${c.slug}`),
  ...productos.map((p) => `/producto/${p.slug}`),
]

const { render, seoPorRuta } = await import(
  new URL('../dist-ssr/entry-server.js', import.meta.url).href
)

const plantilla = fs.readFileSync(path.join(raiz, 'dist', 'index.html'), 'utf8')

const escaparHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function inyectarSeo(html, seo) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escaparHtml(seo.title)}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${escaparHtml(seo.description)}$2`
    )
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escaparHtml(seo.title)}$2`)
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${escaparHtml(seo.description)}$2`
    )
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${seo.url}$2`)
}

let generadas = 0
for (const ruta of rutas) {
  const appHtml = render(ruta)
  const seo = seoPorRuta(ruta)
  const html = inyectarSeo(plantilla, seo).replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  )

  const destino =
    ruta === '/'
      ? path.join(raiz, 'dist', 'index.html')
      : path.join(raiz, 'dist', ruta.slice(1), 'index.html')

  fs.mkdirSync(path.dirname(destino), { recursive: true })
  fs.writeFileSync(destino, html)
  generadas++
}

console.log(`Prerendering: ${generadas} rutas generadas en dist/`)
