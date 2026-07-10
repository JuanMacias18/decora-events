import { Check, Plus } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'

// Tarjeta de un ítem de mobiliario/decoración del catálogo de
// "Diseña Tu Evento". Igual que ProductCard/OptionCard en espíritu, pero
// con su propio botón Agregar/Agregado (toggle persistente, no un
// "Añadido" temporal) y precio destacado —o "Próximamente" mientras el
// catálogo tenga precios placeholder (precio: 0) sin confirmar.
function MobiliarioCard({ item, seleccionado, onToggle }) {
  const tienePrecio = item.precio > 0

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 ${
        seleccionado
          ? 'border-coral ring-2 ring-coral shadow-lg'
          : 'border-arena hover:border-dorado hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imagen}
          alt={item.nombre}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-200 ${
            seleccionado ? 'bg-coral text-white scale-100' : 'bg-white/70 text-transparent scale-90'
          }`}
          aria-hidden="true"
        >
          <Check size={16} />
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h4 className="font-cinzel text-sm text-bronce tracking-wide leading-snug mb-1">
          {item.nombre}
        </h4>
        {item.descripcion && (
          <p className="font-inter text-xs text-dorado/80 leading-relaxed flex-1 mb-2">
            {item.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <span
            className={`font-cinzel text-base ${tienePrecio ? 'text-bronce' : 'text-dorado/50 text-xs italic font-inter'}`}
          >
            {tienePrecio ? formatPrice(item.precio) : 'Precio próximamente'}
          </span>

          <button
            type="button"
            onClick={() => onToggle(item.id)}
            aria-pressed={seleccionado}
            className={`shrink-0 flex items-center gap-1.5 font-inter text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all duration-300 ${
              seleccionado
                ? 'bg-dorado text-crema'
                : 'bg-coral hover:bg-[#c4614a] text-white'
            }`}
          >
            {seleccionado ? (
              <>
                <Check size={13} />
                Agregado
              </>
            ) : (
              <>
                <Plus size={13} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export default MobiliarioCard
