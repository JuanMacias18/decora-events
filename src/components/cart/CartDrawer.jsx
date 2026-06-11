import { useState, useEffect } from 'react'
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { buildWhatsAppUrl } from '../../utils/buildWhatsAppMessage'

export default function CartDrawer({ open, onClose }) {
  const { items, dispatch, total, count } = useCart()
  const [name, setName]         = useState('')
  const [date, setDate]         = useState('')
  const [note, setNote]         = useState('')
  const [showForm, setShowForm] = useState(false)

  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleQty(key, delta) {
    const item = items.find((i) => i._key === key)
    if (!item) return
    dispatch({ type: 'UPDATE_QTY', key, qty: item.cantidad + delta })
  }

  function handleRemove(key) {
    dispatch({ type: 'REMOVE', key })
  }

  function handleWhatsApp() {
    const url = buildWhatsAppUrl({
      items,
      clientName: name.trim(),
      eventDate:  date.trim(),
      note:       note.trim(),
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-bronce/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Carrito de decoraciones"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-crema flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-arena">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-bronce" />
            <h2 className="font-cinzel text-bronce tracking-wider text-lg">
              Tu Selección
            </h2>
            {count > 0 && (
              <span className="bg-coral text-white font-inter text-xs font-bold px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-bronce/60 hover:text-coral transition-colors p-1"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-arena" />
              <p className="font-cinzel text-bronce tracking-wide text-lg">Tu carrito está vacío</p>
              <p className="font-inter text-sm text-dorado/70">
                Explora el catálogo y añade decoraciones para cotizar
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-coral text-white font-inter text-sm tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#c4614a] transition-colors"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
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
                      {/* Qty control */}
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
                        onClick={() => handleRemove(item._key)}
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
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-arena px-6 py-5 bg-crema">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-inter text-sm text-dorado">Total estimado</span>
              <span className="font-cinzel text-xl text-bronce">{formatPrice(total)}</span>
            </div>

            {/* Optional form toggle */}
            <button
              onClick={() => setShowForm((v) => !v)}
              className="w-full text-left font-inter text-xs text-dorado hover:text-coral transition-colors mb-3 flex items-center gap-1"
            >
              {showForm ? '▲' : '▼'} {showForm ? 'Ocultar' : 'Añadir'} datos opcionales (nombre, fecha, nota)
            </button>

            {showForm && (
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce focus:outline-none focus:border-dorado transition-colors"
                />
                <textarea
                  placeholder="Nota o detalles adicionales (opcional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="bg-white border border-arena rounded-lg px-3 py-2 font-inter text-xs text-bronce placeholder:text-dorado/40 focus:outline-none focus:border-dorado transition-colors resize-none"
                />
              </div>
            )}

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
        )}
      </div>
    </>
  )
}
