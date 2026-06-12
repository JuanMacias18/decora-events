import { createContext, useContext } from 'react'

// Contexto y hook del carrito viven aquí (sin componentes) para que
// CartContext.jsx solo exporte el Provider y fast refresh funcione.
export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}
