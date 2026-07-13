import { Pencil, MessageCircle } from 'lucide-react'
import SectionHeading from '../shared/SectionHeading'
import CompletaEvento from './CompletaEvento'
import {
  nombreOpcion,
  nombresOpciones,
  itemsMobiliarioSeleccionados,
  itemsPasteleriaSeleccionados,
  formatFechaLarga,
} from '../../utils/cotizadorLabels'
import { estimarPaquete } from '../../utils/estimarPaquete'
import { formatPrice } from '../../utils/formatPrice'
import { buildCotizadorWhatsAppUrl } from '../../utils/buildCotizadorMessage'

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

export default function ResumenCotizacion({ estado, onModificar, onToggleComplemento }) {
  const estimado = estimarPaquete(estado)
  const whatsappUrl = buildCotizadorWhatsAppUrl(estado, estimado)
  const mobiliarioElegido = itemsMobiliarioSeleccionados(estado.mobiliario)
  const subtotalMobiliario = mobiliarioElegido.reduce((sum, i) => sum + i.precio, 0)
  const pasteleriaElegida = itemsPasteleriaSeleccionados(estado.pasteleria)
  const subtotalPasteleria = pasteleriaElegida.reduce((sum, i) => sum + i.precio, 0)

  return (
    <div className="animate-paso">
      <SectionHeading
        eyebrow="Tu diseño"
        title="Resumen de tu evento"
        subtitle="Revisa tus selecciones antes de cotizar"
        animate={false}
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
          etiqueta="Completa tu evento"
          chips={nombresOpciones('complementos', estado.complementos)}
        />
      </div>

      {/* Mi evento: mobiliario y decoración elegidos, con precio real
          por ítem (a diferencia de complementos/pastelería, aquí sí se
          muestra el precio exacto porque no es un "desde" estimado). */}
      {mobiliarioElegido.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-arena shadow-sm p-6 md:p-8">
          <p className="font-inter text-xs tracking-[0.15em] uppercase text-dorado/70 mb-4">
            Mi evento — Mobiliario y decoración
          </p>
          <div className="flex flex-col">
            {mobiliarioElegido.map((item) => (
              <div
                key={item.id}
                className="flex items-baseline justify-between gap-3 py-2 border-b border-arena/60 last:border-0"
              >
                <span className="font-inter text-sm text-bronce/85">{item.nombre}</span>
                <span className="font-cinzel text-sm text-bronce whitespace-nowrap">
                  {item.precio > 0 ? formatPrice(item.precio) : 'Por confirmar'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-arena">
            <span className="font-inter text-xs tracking-[0.15em] uppercase text-dorado">
              Subtotal mobiliario
            </span>
            <span className="font-cinzel text-base text-bronce">
              {formatPrice(subtotalMobiliario)}
            </span>
          </div>
        </div>
      )}

      {/* Mi evento: pastelería y regalos elegidos, con precio real por
          ítem (mismo tratamiento que mobiliario: no es un "desde"). */}
      {pasteleriaElegida.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-arena shadow-sm p-6 md:p-8">
          <p className="font-inter text-xs tracking-[0.15em] uppercase text-dorado/70 mb-4">
            Mi evento — Pastelería y regalos
          </p>
          <div className="flex flex-col">
            {pasteleriaElegida.map((item) => (
              <div
                key={item.id}
                className="flex items-baseline justify-between gap-3 py-2 border-b border-arena/60 last:border-0"
              >
                <span className="font-inter text-sm text-bronce/85">{item.nombre}</span>
                <span className="font-cinzel text-sm text-bronce whitespace-nowrap">
                  {item.precio > 0 ? formatPrice(item.precio) : 'Por confirmar'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-arena">
            <span className="font-inter text-xs tracking-[0.15em] uppercase text-dorado">
              Subtotal pastelería
            </span>
            <span className="font-cinzel text-base text-bronce">
              {formatPrice(subtotalPasteleria)}
            </span>
          </div>
        </div>
      )}

      {/* Completa tu evento: sugerencias curadas opcionales. Seleccionar
          un complemento recalcula el rango estimado de abajo en vivo. */}
      <CompletaEvento seleccionados={estado.complementos} onToggle={onToggleComplemento} />

      {/* Rango estimado (ya incluye el subtotal exacto de mobiliario) */}
      {estimado && (
        <div className="mt-6 bg-gradient-to-br from-durazno/50 to-arena/40 rounded-2xl border border-arena p-6 md:p-8 text-center">
          <p className="font-inter text-xs tracking-[0.2em] uppercase text-dorado mb-2">
            Tu evento estimado — Total
          </p>
          <p className="font-cinzel text-2xl md:text-3xl text-bronce tracking-wide">
            entre {formatPrice(estimado.min)} y {formatPrice(estimado.max)}
          </p>
          <p className="font-inter text-xs text-dorado/70 mt-4 leading-relaxed max-w-md mx-auto">
            Cotización final sujeta a confirmación según fecha, lugar y disponibilidad.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="mt-8 flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-cinzel text-sm tracking-widest uppercase py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
        >
          <MessageCircle size={18} />
          Recibir cotización por WhatsApp
        </a>
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
