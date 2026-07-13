import { buildWhatsAppHref } from './buildWhatsAppMessage'
import { formatPrice } from './formatPrice'
import {
  nombreOpcion,
  nombresOpciones,
  itemsMobiliarioSeleccionados,
  itemsPasteleriaSeleccionados,
  formatFechaLarga,
} from './cotizadorLabels'

// Construye el enlace de WhatsApp con la cotización estructurada del
// cotizador "Diseña Tu Evento" (formato definido en MISIÓN 3.4).
export function buildCotizadorWhatsAppUrl(estado, estimado) {
  const fecha = formatFechaLarga(estado.fecha)
  const mobiliario = itemsMobiliarioSeleccionados(estado.mobiliario)
  const pasteleria = itemsPasteleriaSeleccionados(estado.pasteleria)
  const complementos = nombresOpciones('complementos', estado.complementos)

  let m = `🎨 *Cotización — Diseña Tu Evento*\n\n`
  m += `*Tipo:* ${nombreOpcion('tipo', estado.tipo)}${fecha ? ` — ${fecha}` : ''}\n`
  m += `*Fondo:* ${nombreOpcion('fondo', estado.fondo)}\n`
  m += `*Globos:* ${nombreOpcion('globos', estado.globos)}\n`

  if (mobiliario.length) {
    const subtotal = mobiliario.reduce((sum, i) => sum + i.precio, 0)
    m += `*Mobiliario y decoración:*\n`
    for (const item of mobiliario) {
      m += `  • ${item.nombre} — ${item.precio > 0 ? formatPrice(item.precio) : 'por confirmar'}\n`
    }
    m += `  *Subtotal mobiliario:* ${formatPrice(subtotal)}\n`
  } else {
    m += `*Mobiliario y decoración:* Ninguno\n`
  }

  if (pasteleria.length) {
    const subtotal = pasteleria.reduce((sum, i) => sum + i.precio, 0)
    m += `*Pastelería y regalos:*\n`
    for (const item of pasteleria) {
      m += `  • ${item.nombre} — ${item.precio > 0 ? formatPrice(item.precio) : 'por confirmar'}\n`
    }
    m += `  *Subtotal pastelería:* ${formatPrice(subtotal)}\n`
  } else {
    m += `*Pastelería y regalos:* Ninguno\n`
  }

  m += `*Complementos:* ${complementos.length ? complementos.join(', ') : 'Ninguno'}\n`

  if (estimado) {
    m += `\n*Rango estimado total:* ${formatPrice(estimado.min)} — ${formatPrice(estimado.max)}\n`
  }

  m += `\nQuiero confirmar disponibilidad y agendar mi evento.`

  return buildWhatsAppHref(m)
}
