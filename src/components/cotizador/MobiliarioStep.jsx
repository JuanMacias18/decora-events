import { useMemo, memo } from 'react'
import { ShoppingBag } from 'lucide-react'
import MOBILIARIO_CATEGORIAS from '../../data/mobiliarioCategorias.json'
import MOBILIARIO from '../../data/mobiliario.json'
import MobiliarioCard from './MobiliarioCard'
import Reveal from '../shared/Reveal'
import { formatPrice } from '../../utils/formatPrice'

const CATEGORIAS = MOBILIARIO_CATEGORIAS.categorias
const ITEMS = MOBILIARIO.items

const MobiliarioCardMemo = memo(MobiliarioCard)

// Paso "Mobiliario y detalles" de Diseña Tu Evento: catálogo real de
// mobiliario/decoración organizado automáticamente por categoría (una
// sección por categoría detectada por scripts/importar-mobiliario.mjs).
// Selección múltiple e independiente por ítem; la barra de subtotal
// flotante da la sensación de configurador en tiempo real.
export default function MobiliarioStep({ seleccionados, onToggle }) {
  // Agrupa los items por categoría una sola vez (no en cada render).
  const categoriasConItems = useMemo(() => {
    const porCategoria = new Map(CATEGORIAS.map((c) => [c.id, { ...c, items: [] }]))
    for (const item of ITEMS) {
      porCategoria.get(item.categoria)?.items.push(item)
    }
    return [...porCategoria.values()]
      .filter((c) => c.items.length > 0)
      .sort((a, b) => a.orden - b.orden)
  }, [])

  const seleccionadosSet = useMemo(() => new Set(seleccionados), [seleccionados])

  const subtotal = useMemo(
    () => ITEMS.filter((i) => seleccionadosSet.has(i.id)).reduce((sum, i) => sum + i.precio, 0),
    [seleccionadosSet]
  )

  return (
    <div className="relative">
      {categoriasConItems.map((categoria) => (
        <section
          key={categoria.id}
          className="mb-14 [content-visibility:auto] [contain-intrinsic-size:auto_700px]"
        >
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-cinzel text-xl md:text-2xl text-bronce tracking-wide">
              {categoria.nombre}
            </h3>
            <div className="h-px flex-1 bg-arena" />
          </div>

          <Reveal
            stagger={0.04}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {categoria.items.map((item) => (
              <div key={item.id} className="h-full">
                <MobiliarioCardMemo
                  item={item}
                  seleccionado={seleccionadosSet.has(item.id)}
                  onToggle={onToggle}
                />
              </div>
            ))}
          </Reveal>
        </section>
      ))}

      {/* Barra de subtotal en vivo: sidebar flotante en desktop, barra
          inferior pegajosa en móvil. Solo visible con algo seleccionado. */}
      {seleccionadosSet.size > 0 && (
        <div
          className="fixed bottom-0 inset-x-0 lg:inset-x-auto lg:right-6 lg:bottom-auto lg:top-32 lg:w-64 z-30 animate-paso"
          role="status"
        >
          <div className="bg-white border-t lg:border border-arena shadow-lg lg:rounded-2xl px-5 py-3.5 lg:p-5 flex lg:flex-col items-center lg:items-stretch justify-between gap-2">
            <div className="flex items-center gap-2 lg:mb-2">
              <ShoppingBag size={16} className="text-coral shrink-0" />
              <span className="font-inter text-xs text-dorado/80">
                {seleccionadosSet.size === 1
                  ? '1 ítem elegido'
                  : `${seleccionadosSet.size} ítems elegidos`}
              </span>
            </div>
            <p className="font-cinzel text-base lg:text-lg text-bronce whitespace-nowrap">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
