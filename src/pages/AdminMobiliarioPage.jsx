import { useEffect, useMemo, useState } from 'react'
import { Search, Download, RotateCcw, Lock } from 'lucide-react'
import MOBILIARIO from '../data/mobiliario.json'
import MOBILIARIO_CATEGORIAS from '../data/mobiliarioCategorias.json'
import { formatPrice } from '../utils/formatPrice'

// ─── Panel interno: editar precios/nombres del catálogo de mobiliario ──
// NO es un CRM real: es una herramienta de edición local, sin backend ni
// base de datos (el sitio es 100% estático). Los cambios que se hacen
// aquí:
//   1. Se guardan como borrador en localStorage de ESTE navegador (para
//      no perder el trabajo si recargas), pero NO afectan lo que ven
//      los clientes en el sitio real.
//   2. Solo se publican cuando descargas el JSON actualizado y alguien
//      (Claude o Juan David) lo reemplaza en src/data/mobiliario.json y
//      se hace commit + deploy.
//
// La clave de acceso es un candado simple contra visitas casuales, NO
// seguridad real: cualquiera que abra las herramientas de desarrollador
// puede leerla en el código. No hay datos sensibles de clientes aquí,
// solo precios de catálogo, así que el riesgo es bajo — pero por eso
// esta ruta NO se prerenderiza, NO tiene SEO propio y NO está enlazada
// desde ningún menú del sitio (ver App.jsx y scripts/prerender.mjs).
const CLAVE_ACCESO = 'decovents2026'
const DRAFT_KEY = 'decora-events-admin-mobiliario-draft'
const SESSION_KEY = 'decora-events-admin-autenticado'

const CATEGORIAS_ORDENADAS = [...MOBILIARIO_CATEGORIAS.categorias].sort(
  (a, b) => a.orden - b.orden
)

function cargarBorrador() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export default function AdminMobiliarioPage() {
  // Esta página NUNCA se prerenderiza (no está en RUTAS_FIJAS de
  // scripts/prerender.mjs), así que solo se monta en el navegador: es
  // seguro leer sessionStorage/localStorage directo en el inicializador,
  // sin pasar por un efecto ni arriesgar un mismatch de hidratación.
  const [autenticado, setAutenticado] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [claveIngresada, setClaveIngresada] = useState('')
  const [error, setError] = useState('')

  const [items, setItems] = useState(() => cargarBorrador() ?? structuredClone(MOBILIARIO.items))
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    document.title = 'Admin — Precios de mobiliario | DecoVents'
    let meta = document.head.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow')
  }, [])

  // Autoguarda cada cambio como borrador local (no publica nada, solo
  // evita perder el trabajo si recargas o cierras la pestaña).
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(items))
    } catch {
      // localStorage lleno o bloqueado: los cambios siguen en memoria
    }
  }, [items])

  // Hay borrador si los datos en memoria difieren de los publicados
  // (evita sincronizar un segundo estado solo para reflejar esto).
  const hayBorrador = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(MOBILIARIO.items),
    [items]
  )

  function intentarAcceso(e) {
    e.preventDefault()
    if (claveIngresada === CLAVE_ACCESO) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAutenticado(true)
      setError('')
    } else {
      setError('Clave incorrecta.')
    }
  }

  function actualizarItem(id, campo, valor) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [campo]: valor } : it)))
  }

  function restablecer() {
    if (!confirm('¿Descartar los cambios de esta sesión y volver a los datos publicados?')) return
    localStorage.removeItem(DRAFT_KEY)
    setItems(structuredClone(MOBILIARIO.items))
  }

  function descargarJson() {
    const payload = {
      _nota:
        "Editado a mano en /admin/mobiliario. Reemplazar src/data/mobiliario.json con este archivo y hacer commit + deploy para publicar los precios.",
      items,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2) + '\n'], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mobiliario.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const itemsPorCategoria = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const porCategoria = new Map(CATEGORIAS_ORDENADAS.map((c) => [c.id, { ...c, items: [] }]))
    for (const item of items) {
      if (q && !item.nombre.toLowerCase().includes(q) && !item.id.includes(q)) continue
      porCategoria.get(item.categoria)?.items.push(item)
    }
    return [...porCategoria.values()].filter((c) => c.items.length > 0)
  }, [items, busqueda])

  const totalSinPrecio = items.filter((i) => i.precio <= 0).length

  if (!autenticado) {
    return (
      <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={intentarAcceso}
          className="max-w-sm w-full bg-white rounded-2xl border border-arena shadow-sm p-8 text-center"
        >
          <Lock size={32} className="text-dorado mx-auto mb-4" />
          <h1 className="font-cinzel text-xl text-bronce tracking-wide mb-2">Acceso interno</h1>
          <p className="font-inter text-xs text-dorado/70 mb-6">
            Panel de precios de mobiliario — solo para DecoVents.
          </p>
          <input
            type="password"
            value={claveIngresada}
            onChange={(e) => setClaveIngresada(e.target.value)}
            placeholder="Clave de acceso"
            autoFocus
            className="w-full bg-crema border border-arena rounded-lg px-3 py-2.5 font-inter text-sm text-bronce text-center focus:outline-none focus:border-dorado transition-colors mb-3"
          />
          {error && <p className="font-inter text-xs text-coral mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-coral hover:bg-[#c4614a] text-white font-inter text-sm tracking-widest uppercase py-3 rounded-full transition-colors"
          >
            Entrar
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-cinzel text-2xl md:text-3xl text-bronce tracking-wide mb-2">
            Precios de mobiliario y decoración
          </h1>
          <p className="font-inter text-sm text-dorado/80 leading-relaxed max-w-2xl">
            Edita precio, nombre y descripción de cada ítem. Esta página{' '}
            <strong>no publica los cambios sola</strong>: cuando termines, descarga el archivo y
            envíaselo a Claude (o reemplázalo tú mismo en <code>src/data/mobiliario.json</code>)
            para que se vea en el sitio real.
          </p>
          {totalSinPrecio > 0 && (
            <p className="font-inter text-xs text-coral mt-3">
              {totalSinPrecio} de {items.length} ítems siguen sin precio (muestran "Precio
              próximamente" en el sitio).
            </p>
          )}
        </div>

        {/* Barra de acciones */}
        <div className="sticky top-20 z-20 bg-crema/95 backdrop-blur-sm py-3 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-arena">
          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dorado/50" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o id…"
              className="w-full bg-white border border-arena rounded-full pl-9 pr-3 py-2 font-inter text-xs text-bronce focus:outline-none focus:border-dorado transition-colors"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {hayBorrador && (
              <button
                type="button"
                onClick={restablecer}
                className="flex items-center gap-1.5 border border-arena text-dorado hover:text-coral font-inter text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-colors"
              >
                <RotateCcw size={13} />
                Restablecer
              </button>
            )}
            <button
              type="button"
              onClick={descargarJson}
              className="flex items-center gap-1.5 bg-coral hover:bg-[#c4614a] text-white font-inter text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-colors"
            >
              <Download size={13} />
              Descargar mobiliario.json
            </button>
          </div>
        </div>

        {/* Tabla por categoría */}
        <div className="flex flex-col gap-10">
          {itemsPorCategoria.map((categoria) => (
            <div key={categoria.id}>
              <h2 className="font-cinzel text-lg text-bronce tracking-wide mb-3">
                {categoria.nombre}{' '}
                <span className="font-inter text-xs text-dorado/60 normal-case">
                  ({categoria.items.length})
                </span>
              </h2>
              <div className="bg-white rounded-2xl border border-arena shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-arena bg-crema/60">
                        <th className="font-inter text-[10px] tracking-widest uppercase text-dorado/70 px-4 py-3 w-20">
                          Foto
                        </th>
                        <th className="font-inter text-[10px] tracking-widest uppercase text-dorado/70 px-4 py-3">
                          Nombre
                        </th>
                        <th className="font-inter text-[10px] tracking-widest uppercase text-dorado/70 px-4 py-3">
                          Descripción
                        </th>
                        <th className="font-inter text-[10px] tracking-widest uppercase text-dorado/70 px-4 py-3 w-40">
                          Precio (COP)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoria.items.map((item) => (
                        <tr key={item.id} className="border-b border-arena/60 last:border-0">
                          <td className="px-4 py-2.5">
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              loading="lazy"
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="text"
                              value={item.nombre}
                              onChange={(e) => actualizarItem(item.id, 'nombre', e.target.value)}
                              className="w-full min-w-[160px] bg-crema border border-arena rounded-lg px-2.5 py-1.5 font-inter text-xs text-bronce focus:outline-none focus:border-dorado transition-colors"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="text"
                              value={item.descripcion}
                              onChange={(e) =>
                                actualizarItem(item.id, 'descripcion', e.target.value)
                              }
                              placeholder="Opcional"
                              className="w-full min-w-[200px] bg-crema border border-arena rounded-lg px-2.5 py-1.5 font-inter text-xs text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={item.precio || ''}
                              onChange={(e) =>
                                actualizarItem(item.id, 'precio', Number(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full bg-crema border border-arena rounded-lg px-2.5 py-1.5 font-inter text-xs text-bronce focus:outline-none focus:border-dorado transition-colors"
                            />
                            {item.precio > 0 && (
                              <p className="font-inter text-[10px] text-dorado/60 mt-1">
                                {formatPrice(item.precio)}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
