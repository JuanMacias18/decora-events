import { SITE_CONFIG } from '../config/site'
import { formatPrice } from './formatPrice'

// Enlace base a WhatsApp; con `message` abre el chat con texto prellenado
export function buildWhatsAppHref(message) {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildWhatsAppUrl({ items, clientName, eventDate, note }) {
  const lines = items.map((item) => {
    let line = `• ${item.nombre} x${item.cantidad} — ${formatPrice(item.precio * item.cantidad)}`
    if (item.personalizacion) line += `\n   (${item.personalizacion})`
    return line
  })

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)

  let message = `🎉 *Nueva solicitud — DecoVents*\n\n`
  message += `*Productos:*\n`
  message += lines.join('\n')
  message += `\n\n*Total estimado:* ${formatPrice(total)}\n\n`
  message += `Quiero confirmar disponibilidad y agendar mi evento.`

  if (clientName || eventDate || note) {
    message += '\n'
    if (clientName) message += `\nNombre: ${clientName}`
    if (eventDate) message += `\nFecha del evento: ${eventDate}`
    if (note) message += `\nNota: ${note}`
  }

  return buildWhatsAppHref(message)
}
