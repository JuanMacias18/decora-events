import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'decora-events-cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = action.item.id + (action.item.personalizacion || '')
      const existing = state.find((i) => i._key === key)
      if (existing) {
        return state.map((i) =>
          i._key === key ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...state, { ...action.item, cantidad: 1, _key: key }]
    }
    case 'REMOVE':
      return state.filter((i) => i._key !== action.key)
    case 'UPDATE_QTY':
      return state
        .map((i) => (i._key === action.key ? { ...i, cantidad: action.qty } : i))
        .filter((i) => i.cantidad > 0)
    case 'CLEAR':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const count = items.reduce((sum, i) => sum + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
