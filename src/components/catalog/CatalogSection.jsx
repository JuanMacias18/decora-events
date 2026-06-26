import { useState, useMemo, useRef } from 'react'
import { Search, X } from 'lucide-react'
import CATEGORIAS from '../../data/categorias.json'
import DECORACIONES from '../../data/productos.json'
import ProductCard from './ProductCard'
import SectionHeading from '../shared/SectionHeading'
import { CATEGORY_VISUALS } from './CategoryIcons'

const PAGE_SIZE = 12

// Attach label to each item for display in cards
const ITEMS_WITH_LABELS = DECORACIONES.map((d) => ({
  ...d,
  categoriaLabel: CATEGORIAS.find((c) => c.id === d.categoria)?.nombre ?? d.categoria,
}))

export default function CatalogSection({ initialCategory }) {
  const [activeTab, setActiveTab] = useState(initialCategory || CATEGORIAS[0].id)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory)
  const tabsRef = useRef(null)

  // Sincroniza la pestaña cuando el padre cambia initialCategory.
  // Ajuste de estado durante el render (en vez de un efecto) para
  // evitar renders en cascada: https://react.dev/learn/you-might-not-need-an-effect
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory)
    if (initialCategory) {
      setActiveTab(initialCategory)
      setPage(1)
    }
  }

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
    setPage(1)
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
    <section id="catalogo" className="[content-visibility:auto] [contain-intrinsic-size:auto_900px] py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explora y elige"
          title="Catálogo de Decoraciones"
          subtitle="Encuentra la decoración perfecta para tu celebración"
          className="mb-12"
        />

        {/* Category Tabs — tiles verticales estilo Rappi (ícono + label corto) */}
        <div
          ref={tabsRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8 justify-start md:justify-center"
        >
          {CATEGORIAS.map((cat) => {
            const visual = CATEGORY_VISUALS[cat.id] ?? { label: cat.nombre, Icon: () => null }
            const { label, Icon } = visual
            const active = activeTab === cat.id
            return (
              <button
                key={cat.id}
                data-tab={cat.id}
                data-active={active}
                onClick={() => handleTabClick(cat.id)}
                aria-pressed={active}
                aria-label={cat.nombre}
                className={`group shrink-0 w-[84px] sm:w-24 flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral motion-safe:hover:-translate-y-1 ${
                  active
                    ? 'bg-coral border-coral text-white shadow-md'
                    : 'bg-white border-arena text-bronce hover:border-dorado hover:shadow-sm'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${
                    active ? 'bg-white/20' : 'bg-durazno/40 group-hover:bg-durazno/70'
                  }`}
                >
                  <Icon />
                </span>
                <span className="font-inter text-[11px] sm:text-xs font-medium tracking-wide text-center leading-tight">
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dorado/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar decoración…"
            className="w-full bg-white border border-arena rounded-full pl-10 pr-10 py-2.5 font-inter text-sm text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('')
                setPage(1)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dorado/50 hover:text-coral transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="font-inter text-xs text-dorado/60 text-center mb-6">
          {filtered.length} {filtered.length === 1 ? 'decoración encontrada' : 'decoraciones encontradas'}
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
