import { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { useCart } from './hooks/useCart'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import CartButton from './components/cart/CartButton'
import WhatsAppFab from './components/cart/WhatsAppFab'
import ScrollManager from './components/shared/ScrollManager'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import DisenaEventoPage from './pages/DisenaEventoPage'
import EventosPremiumPage from './pages/EventosPremiumPage'

// Layout común: header, footer, carrito y botones flotantes en todas las rutas
function Layout() {
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()

  return (
    <div className="min-h-screen bg-crema overflow-x-hidden">
      <Header onCartOpen={() => setCartOpen(true)} />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Barra flotante del carrito — solo cuando hay items */}
      {count > 0 && <CartButton onClick={() => setCartOpen(true)} />}

      {/* FAB de WhatsApp — solo con carrito vacío (sin barra que lo tape) */}
      {count === 0 && <WhatsAppFab />}
    </div>
  )
}

// Árbol de la app sin router: lo comparten el cliente (BrowserRouter)
// y el prerendering del build (StaticRouter en src/entry-server.jsx)
export function AppShell() {
  return (
    <CartProvider>
      <ScrollManager />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/disena-tu-evento" element={<DisenaEventoPage />} />
          <Route path="/eventos-premium" element={<EventosPremiumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
