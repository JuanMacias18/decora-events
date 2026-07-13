import { Check } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'

// Tarjeta visual seleccionable (imagen + nombre + descripción).
// Sirve tanto para selección única como múltiple; el estado visual
// "seleccionada" lo controla quien la usa. El precio es opcional: solo
// las opciones que lo traen (pastelería) lo muestran, igual que
// MobiliarioCard ("Precio próximamente" mientras no esté confirmado).
export default function OptionCard({ opcion, seleccionada, onClick }) {
  const conPrecio = opcion.precio !== undefined
  const tienePrecio = opcion.precio > 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionada}
      className={`group relative flex flex-col text-left bg-white rounded-2xl overflow-hidden border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
        seleccionada
          ? 'border-coral ring-2 ring-coral shadow-lg'
          : 'border-arena hover:border-dorado hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={opcion.imagen}
          alt={opcion.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-200 ${
            seleccionada ? 'bg-coral text-white scale-100' : 'bg-white/70 text-transparent scale-90'
          }`}
          aria-hidden="true"
        >
          <Check size={16} />
        </span>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-cinzel text-sm text-bronce tracking-wide leading-snug">
          {opcion.nombre}
        </h3>
        <p className="font-inter text-xs text-dorado/80 leading-relaxed mt-1">
          {opcion.descripcion}
        </p>
        {conPrecio && (
          <p
            className={`mt-2 ${
              tienePrecio
                ? 'font-cinzel text-sm text-bronce'
                : 'font-inter text-xs text-dorado/50 italic'
            }`}
          >
            {tienePrecio ? formatPrice(opcion.precio) : 'Precio próximamente'}
          </p>
        )}
      </div>
    </button>
  )
}
