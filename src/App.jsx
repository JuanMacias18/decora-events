import { useState } from 'react'
import { CartProvider, useCart } from './context/CartContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import CategoriesGrid from './components/home/CategoriesGrid'
import CatalogSection from './components/catalog/CatalogSection'
import Portfolio from './components/home/Portfolio'
import Testimonials from './components/home/Testimonials'
import AboutUs from './components/home/AboutUs'
import CartDrawer from './components/cart/CartDrawer'
import CartButton from './components/cart/CartButton'
import WhatsAppFab from './components/cart/WhatsAppFab'

// Inner component so it can consume CartContext
function AppInner() {
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const { count } = useCart()

  function handleCategorySelect(id) {
    setActiveCategory(id)
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-crema overflow-x-hidden">
      <Header onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero />
        <CategoriesGrid onCategorySelect={handleCategorySelect} />
        <CatalogSection initialCategory={activeCategory} />
        <Portfolio />
        <Testimonials />
        <AboutUs />
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Floating cart bar — only when there are items */}
      {count > 0 && <CartButton onClick={() => setCartOpen(true)} />}

      {/* WhatsApp FAB — only when cart is empty (no item bar covering it) */}
      {count === 0 && <WhatsAppFab />}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
