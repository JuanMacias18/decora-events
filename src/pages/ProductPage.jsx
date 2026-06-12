import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ShoppingBag, Check, ArrowLeft } from 'lucide-react'
import CATEGORIAS from '../data/categorias.json'
import PRODUCTOS from '../data/productos.json'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoProducto, seoHome } from '../config/seo'

export default function ProductPage() {
  const { slug } = useParams()
  const producto = PRODUCTOS.find((p) => p.slug === slug)
  const categoria = producto
    ? CATEGORIAS.find((c) => c.id === producto.categoria)
    : null

  const { dispatch, items } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    producto?.personalizacion ? producto.personalizacion[0] : null
  )

  // El hook debe llamarse siempre (antes del return condicional)
  usePageMeta(producto ? seoProducto(producto, categoria) : seoHome())

  if (!producto) return <Navigate to="/" replace />
  const inCart = items.some(
    (i) => i.id === producto.id && i.personalizacion === selectedOption
  )

  function handleAdd() {
    dispatch({
      type: 'ADD',
      item: {
        id: producto.id,
        nombre: producto.nombre,
        categoria: categoria?.nombre ?? producto.categoria,
        precio: producto.precio,
        imagen: producto.imagen,
        personalizacion: selectedOption,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={categoria ? `/categoria/${categoria.slug}` : '/'}
          className="inline-flex items-center gap-2 font-inter text-xs tracking-widest uppercase text-dorado hover:text-coral transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {categoria ? categoria.nombre : 'Inicio'}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Imagen */}
          <div className="rounded-2xl overflow-hidden border border-arena shadow-sm aspect-[4/3]">
            <img
              src={producto.imagen}
              alt={`${producto.nombre} — ${categoria?.nombre ?? 'decoración de eventos'} por Decora Events`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detalle */}
          <div>
            {categoria && (
              <span className="inline-block bg-durazno text-bronce font-inter text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full mb-4">
                {categoria.nombre}
              </span>
            )}
            <h1 className="font-cinzel text-2xl md:text-3xl text-bronce tracking-wide leading-snug mb-4">
              {producto.nombre}
            </h1>
            <p className="font-inter text-sm text-dorado/80 leading-relaxed mb-6">
              {producto.descripcion}
            </p>

            {producto.personalizacion && producto.personalizacion.length > 0 && (
              <div className="mb-8">
                <p className="font-inter text-xs tracking-widest uppercase text-dorado mb-3">
                  Personalización
                </p>
                <div className="flex flex-wrap gap-2">
                  {producto.personalizacion.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`font-inter text-xs px-4 py-2 rounded-full border transition-colors ${
                        opt === selectedOption
                          ? 'bg-durazno border-durazno text-bronce font-medium'
                          : 'bg-white border-arena text-bronce/80 hover:border-dorado'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="font-cinzel text-2xl text-bronce">
                {formatPrice(producto.precio)}
              </span>
              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 font-inter text-sm tracking-wider uppercase px-8 py-3 rounded-full transition-all duration-300 ${
                  added || inCart
                    ? 'bg-dorado text-crema'
                    : 'bg-coral hover:bg-[#c4614a] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    Añadido
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Añadir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
