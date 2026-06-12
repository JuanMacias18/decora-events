import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import { buildWhatsAppUrl } from '../utils/buildWhatsAppMessage'
import SectionHeading from '../components/shared/SectionHeading'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoCarrito } from '../config/seo'

export default function CartPage() {
  usePageMeta(seoCarrito())
  const { items, dispatch, total } = useCart()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  function handleQty(key, delta) {
    const item = items.find((i) => i._key === key)
    if (!item) return
    dispatch({ type: 'UPDATE_QTY', key, qty: item.cantidad + delta })
  }

  function handleWhatsApp() {
    const url = buildWhatsAppUrl({
      items,
      clientName: name.trim(),
      eventDate: date.trim(),
      note: note.trim(),
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tu selección"
          title="Carrito"
          subtitle="Revisa tu pedido y cotiza por WhatsApp"
        />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="text-arena mx-auto mb-4" />
            <p className="font-cinzel text-bronce tracking-wide text-lg mb-2">
              Tu carrito está vacío
            </p>
            <p className="font-inter text-sm text-dorado/70 mb-8">
              Explora el catálogo y añade decoraciones para cotizar
            </p>
            <Link
              to="/#catalogo"
              className="inline-block bg-coral text-white font-inter text-sm tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#c4614a] transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-4 mb-8">
              {items.map((item) => (
                <li
                  key={item._key}
                  className="flex gap-4 bg-white rounded-xl p-4 border border-arena shadow-sm"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-xs text-bronce tracking-wide truncate">
                      {item.nombre}
                    </p>
                    {item.personalizacion && (
                      <p className="font-inter text-[10px] text-dorado/70 mt-0.5 truncate">
                        {item.personalizacion}
                      </p>
                    )}
                    <p className="font-inter text-xs text-dorado mt-1">
                      {formatPrice(item.precio)} c/u
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-crema rounded-full border border-arena px-1">
                        <button
                          onClick={() => handleQty(item._key, -1)}
                          className="w-6 h-6 flex items-center justify-center text-bronce hover:text-coral transition-colors"
                          aria-label="Restar"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-inter text-xs font-medium text-bronce w-4 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleQty(item._key, 1)}
                          className="w-6 h-6 flex items-center justify-center text-bronce hover:text-coral transition-colors"
                          aria-label="Sumar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="font-cinzel text-sm text-bronce">
                        {formatPrice(item.precio * item.cantidad)}
                      </p>

                      <button
                        onClick={() => dispatch({ type: 'REMOVE', key: item._key })}
                        className="text-dorado/40 hover:text-coral transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-white rounded-xl border border-arena shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-inter text-sm text-dorado">Total estimado</span>
                <span className="font-cinzel text-xl text-bronce">{formatPrice(total)}</span>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-crema border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-crema border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce focus:outline-none focus:border-dorado transition-colors"
                />
                <textarea
                  placeholder="Nota o detalles adicionales (opcional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="bg-crema border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-cinzel text-sm tracking-widest uppercase py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                <MessageCircle size={18} />
                Pedir por WhatsApp
              </button>

              <p className="font-inter text-[10px] text-dorado/50 text-center mt-3">
                Se abrirá WhatsApp con tu pedido listo para enviar
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
