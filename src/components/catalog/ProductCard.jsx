import { useState } from 'react'
import { ShoppingBag, Check, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductCard({ item }) {
  const { dispatch, items } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    item.personalizacion ? item.personalizacion[0] : null
  )
  const [showOptions, setShowOptions] = useState(false)

  const inCart = items.some(
    (i) => i.id === item.id && i.personalizacion === selectedOption
  )

  function handleAdd() {
    dispatch({
      type: 'ADD',
      item: {
        id: item.id,
        nombre: item.nombre,
        categoria: item.categoriaLabel,
        precio: item.precio,
        imagen: item.imagen,
        personalizacion: selectedOption,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-arena shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.imagen}
          alt={item.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-durazno text-bronce font-inter text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full">
          {item.categoriaLabel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-cinzel text-sm text-bronce tracking-wide leading-snug mb-1">
          {item.nombre}
        </h3>
        <p className="font-inter text-xs text-dorado/80 leading-relaxed flex-1 mb-4">
          {item.descripcion}
        </p>

        {/* Personalization selector */}
        {item.personalizacion && item.personalizacion.length > 0 && (
          <div className="relative mb-4">
            <button
              onClick={() => setShowOptions((v) => !v)}
              className="w-full flex items-center justify-between bg-crema border border-arena rounded-lg px-3 py-2 text-xs font-inter text-bronce hover:border-dorado transition-colors"
            >
              <span className="truncate">{selectedOption}</span>
              <ChevronDown
                size={14}
                className={`shrink-0 ml-2 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}
              />
            </button>

            {showOptions && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-arena rounded-lg shadow-lg overflow-hidden">
                {item.personalizacion.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedOption(opt)
                      setShowOptions(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-inter transition-colors hover:bg-durazno/50 ${
                      opt === selectedOption
                        ? 'bg-durazno text-bronce font-medium'
                        : 'text-bronce/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-cinzel text-base text-bronce">
            {formatPrice(item.precio)}
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 font-inter text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all duration-300 ${
              added || inCart
                ? 'bg-dorado text-crema'
                : 'bg-coral hover:bg-[#c4614a] text-white'
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                Añadido
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
