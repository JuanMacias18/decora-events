import { createContext, useContext, useReducer, useEffect } from 'react'
import PRODUCTOS from '../data/productos.json'

const CartContext = createContext(null)

const STORAGE_KEY = 'decora-events-cart'

// Ids vigentes del catálogo: items guardados de productos que ya no existen se descartan
const CATALOG_IDS = new Set(PRODUCTOS.map((p) => p.id))

function isValidItem(i) {
  return (
    i !== null &&
    typeof i === 'object' &&
    typeof i.id === 'string' &&
    CATALOG_IDS.has(i.id) &&
    typeof i.nombre === 'string' &&
    typeof i.precio === 'number' &&
    Number.isFinite(i.precio) &&
    i.precio > 0 &&
    Number.isInteger(i.cantidad) &&
    i.cantidad > 0 &&
    typeof i._key === 'string'
  )
}

// Carga el carrito guardado; ante datos corruptos, vacíos o de productos
// eliminados del catálogo, inicia vacío sin romper la página.
function loadInitialCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isValidItem)
      .map((i) => ({ ...i, personalizacion: i.personalizacion ?? null }))
  } catch {
    return []
  }
}

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
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage lleno o bloqueado (modo privado): el carrito sigue
      // funcionando en memoria, solo no persiste entre visitas
    }
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
