import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import Logo from './Logo'

const NAV_LINKS = [
  { label: 'Catálogo', href: '/#catalogo' },
  { label: 'Montajes', href: '/#montajes' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#footer' },
]

export default function Header({ onCartOpen }) {
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-crema/95 backdrop-blur-md shadow-sm border-b border-arena'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-inter text-sm tracking-widest uppercase text-bronce hover:text-coral transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-bronce hover:text-coral transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-inter">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-bronce hover:text-coral transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-crema border-t border-arena shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-inter text-sm tracking-widest uppercase text-bronce hover:text-coral transition-colors py-1"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
