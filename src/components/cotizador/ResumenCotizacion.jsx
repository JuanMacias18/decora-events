import { Pencil } from 'lucide-react'
import SectionHeading from '../shared/SectionHeading'
import { nombreOpcion, nombresOpciones, formatFechaLarga } from '../../utils/cotizadorLabels'

// Fila del resumen: etiqueta + valor (texto o lista de chips).
function Fila({ etiqueta, valor, chips }) {
  return (
    <div className="flex flex-col gap-2 py-4 border-b border-arena last:border-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="font-inter text-xs tracking-[0.15em] uppercase text-dorado/70 sm:pt-1">
        {etiqueta}
      </span>
      {chips ? (
        <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[70%]">
          {chips.length > 0 ? (
            chips.map((c) => (
              <span
                key={c}
                className="bg-durazno/60 text-bronce font-inter text-xs px-3 py-1 rounded-full"
              >
                {c}
              </span>
            ))
          ) : (
            <span className="font-inter text-sm text-dorado/50 italic">Sin selección</span>
          )}
        </div>
      ) : (
        <span className="font-cinzel text-sm text-bronce sm:text-right">{valor}</span>
      )}
    </div>
  )
}

export default function ResumenCotizacion({ estado, onModificar }) {
  return (
    <div className="animate-paso">
      <SectionHeading
        eyebrow="Tu diseño"
        title="Resumen de tu evento"
        subtitle="Revisa tus selecciones antes de cotizar"
      />

      <div className="bg-white rounded-2xl border border-arena shadow-sm p-6 md:p-8">
        <Fila
          etiqueta="Tipo de evento"
          valor={`${nombreOpcion('tipo', estado.tipo)}${
            estado.fecha ? ` — ${formatFechaLarga(estado.fecha)}` : ''
          }`}
        />
        <Fila etiqueta="Fondo y estructura" valor={nombreOpcion('fondo', estado.fondo)} />
        <Fila etiqueta="Estilo de globos" valor={nombreOpcion('globos', estado.globos)} />
        <Fila
          etiqueta="Mobiliario y detalles"
          chips={nombresOpciones('mobiliario', estado.mobiliario)}
        />
        <Fila
          etiqueta="Pastelería y regalos"
          chips={nombresOpciones('pasteleria', estado.pasteleria)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={onModificar}
          className="w-full flex items-center justify-center gap-2 border border-dorado text-bronce font-inter text-sm tracking-widest uppercase py-3.5 rounded-full hover:bg-dorado hover:text-crema transition-colors duration-300"
        >
          <Pencil size={16} />
          Modificar mi diseño
        </button>
      </div>
    </div>
  )
}
