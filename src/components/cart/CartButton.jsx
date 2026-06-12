import { ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatPrice'

// Floating cart button — visible on mobile at bottom, on desktop as FAB
export default function CartButton({ onClick }) {
  const { count, total } = useCart()

  if (count === 0) return null

  return (
    <>
      {/* Desktop: compact FAB bottom-right */}
      <button
        onClick={onClick}
        className="hidden md:flex fixed bottom-8 right-8 z-30 items-center gap-3 bg-bronce text-crema font-inter text-sm px-6 py-3 rounded-full shadow-lg hover:bg-dorado transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Ver carrito"
      >
        <ShoppingBag size={17} />
        <span>{count} item{count !== 1 ? 's' : ''}</span>
        <span className="font-cinzel text-champan">{formatPrice(total)}</span>
      </button>

      {/* Mobile: sticky bottom bar */}
      <button
        onClick={onClick}
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-bronce text-crema px-6 py-4 shadow-2xl"
        aria-label="Ver carrito"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag size={20} />
          <span className="font-inter text-sm">
            {count} {count === 1 ? 'decoración' : 'decoraciones'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-champan">{formatPrice(total)}</span>
          <span className="flex items-center gap-1.5 bg-[#25D366] text-white font-inter text-xs tracking-wide px-4 py-1.5 rounded-full">
            <MessageCircle size={13} />
            WhatsApp
          </span>
        </div>
      </button>
    </>
  )
}
