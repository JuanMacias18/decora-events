import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { CATEGORIAS, DECORACIONES } from '../../data/catalogo'
import ProductCard from './ProductCard'

const PAGE_SIZE = 12

// Attach label to each item for display in cards
const ITEMS_WITH_LABELS = DECORACIONES.map((d) => ({
  ...d,
  categoriaLabel: CATEGORIAS.find((c) => c.id === d.categoria)?.label ?? d.categoria,
}))

export default function CatalogSection({ initialCategory }) {
  const [activeTab, setActiveTab] = useState(initialCategory || CATEGORIAS[0].id)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const tabsRef = useRef(null)

  // Reset page when tab or search changes
  useEffect(() => { setPage(1) }, [activeTab, search])

  // Sync active tab when parent changes initialCategory
  useEffect(() => {
    if (initialCategory) setActiveTab(initialCategory)
  }, [initialCategory])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ITEMS_WITH_LABELS.filter(
      (item) =>
        item.categoria === activeTab &&
        (!q ||
          item.nombre.toLowerCase().includes(q) ||
          item.descripcion.toLowerCase().includes(q))
    )
  }, [activeTab, search])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  function selectTab(id) {
    setActiveTab(id)
    setSearch('')
  }

  function scrollTabIntoView(id) {
    const el = tabsRef.current?.querySelector(`[data-tab="${id}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  function handleTabClick(id) {
    selectTab(id)
    scrollTabIntoView(id)
  }

  return (
    <section id="catalogo" className="py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-arena" />
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-dorado">
              Explora y elige
            </span>
            <div className="h-px w-12 bg-arena" />
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-bronce tracking-wider">
            Catálogo de Decoraciones
          </h2>
          <p className="font-editorial text-xl text-dorado mt-3">
            Encuentra la decoración perfecta para tu celebración
          </p>
        </div>

        {/* Category Tabs */}
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8 justify-start md:justify-center"
        >
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              data-tab={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`shrink-0 flex items-center gap-2 font-inter text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-coral border-coral text-white shadow-sm'
                  : 'bg-white border-arena text-bronce hover:border-dorado hover:text-dorado'
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dorado/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar decoración…"
            className="w-full bg-white border border-arena rounded-full pl-10 pr-10 py-2.5 font-inter text-sm text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dorado/50 hover:text-coral transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="font-inter text-xs text-dorado/60 text-center mb-6">
          {filtered.length} decoración{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          {search && ` para "${search}"`}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-editorial text-2xl text-dorado mb-2">
              No encontramos resultados
            </p>
            <p className="font-inter text-sm text-dorado/60">
              Intenta con otro término o explora otra categoría
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginated.map((item) => (
                <ProductCard key={item.id + (item.personalizacion?.[0] ?? '')} item={item} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="border border-dorado text-dorado hover:bg-dorado hover:text-crema font-inter text-sm tracking-widest uppercase px-10 py-3 rounded-full transition-all duration-300"
                >
                  Ver más decoraciones
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
