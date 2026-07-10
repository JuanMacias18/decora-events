import { Sparkles } from 'lucide-react'
import OptionCard from './OptionCard'
import COMPLEMENTOS from '../../data/complementos.json'

// ─── "Completa tu evento" ─────────────────────────────────────
// Sugerencias curadas (opcionales) que el cliente puede sumar desde la
// pantalla de resumen antes de enviar la cotización. Reutiliza OptionCard
// y los mismos tokens del cotizador. Seleccionar un complemento lo agrega
// o quita del evento; el estimado de arriba se recalcula en vivo.
const ITEMS = COMPLEMENTOS.complementos

export default function CompletaEvento({ seleccionados = [], onToggle }) {
  return (
    <section className="mt-8" aria-label="Completa tu evento">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 font-inter text-xs tracking-[0.3em] uppercase text-coral">
          <Sparkles size={14} /> Completa tu evento
        </span>
        <p className="font-editorial text-lg text-dorado mt-2">
          Toques finales para redondear tu celebración
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {ITEMS.map((complemento) => (
          <OptionCard
            key={complemento.id}
            opcion={complemento}
            seleccionada={seleccionados.includes(complemento.id)}
            onClick={() => onToggle(complemento.id)}
          />
        ))}
      </div>
    </section>
  )
}
