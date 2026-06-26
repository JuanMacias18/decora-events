import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import CATEGORIAS from '../../data/categorias.json'
import DECORACIONES from '../../data/productos.json'
import ProductCard from './ProductCard'

// Debe coincidir con duration-300 de las transiciones (para el cierre animado).
const DURACION_MS = 300

// Modal "estilo Rappi": bottom sheet en móvil, modal centrado en desktop.
// Muestra el catálogo FILTRADO de una categoría reutilizando ProductCard y
// la misma fuente de datos (productos.json), sin duplicar tarjeta ni datos.
export default function CategoryModal({ categoriaId, onClose }) {
  const categoria = CATEGORIAS.find((c) => c.id === categoriaId)
  const panelRef = useRef(null)
  const [visible, setVisible] = useState(false)

  // Productos de la categoría con la etiqueta que ProductCard espera.
  const productos = DECORACIONES.filter((d) => d.categoria === categoriaId).map((d) => ({
    ...d,
    categoriaLabel: categoria?.nombre ?? d.categoria,
  }))

  // Cierre animado: oculta, espera la transición y desmonta desde el padre.
  function requestClose() {
    setVisible(false)
    setTimeout(onClose, DURACION_MS)
  }

  // Entrada: monta oculto y pasa a visible en el siguiente frame (dispara la transición).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Foco al panel al abrir (a11y).
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  // Cierre con tecla Escape.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Bloquea el scroll del body y compensa el ancho del scrollbar para que
  // el contenido de fondo NO se desplace al abrir/cerrar (evita layout shift).
  useEffect(() => {
    const comp = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (comp > 0) document.body.style.paddingRight = `${comp}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      {/* Overlay: fade in/out, cierra al hacer clic */}
      <div
        onClick={requestClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel: bottom sheet (slide-up) en móvil / centrado (fade + scale) en desktop */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className={`relative flex w-full max-h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-crema shadow-2xl outline-none transition-all duration-300 ease-out sm:max-h-[90vh] sm:max-w-3xl sm:rounded-3xl ${
          visible
            ? 'translate-y-0 sm:scale-100 sm:opacity-100'
            : 'translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0'
        }`}
      >
        {/* Handle (solo móvil) */}
        <div
          className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-bronce/20 sm:hidden"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-arena px-5 pb-4 pt-4 sm:px-6">
          <h2
            id="category-modal-title"
            className="font-cinzel text-lg tracking-wide text-bronce sm:text-xl"
          >
            {categoria?.nombre ?? 'Categoría'}
          </h2>
          <button
            onClick={requestClose}
            aria-label="Cerrar"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bronce transition-colors hover:bg-arena/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo: scroll INTERNO del modal */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <p className="mb-5 font-inter text-xs text-dorado/60">
            {productos.length} {productos.length === 1 ? 'decoración' : 'decoraciones'}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((item) => (
              <ProductCard key={item.id + (item.personalizacion?.[0] ?? '')} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
