import { SITE_CONFIG } from '../config/site'
import { formatPrice } from './formatPrice'

export function buildWhatsAppUrl({ items, clientName, eventDate, note }) {
  const lines = items.map(
    (item) =>
      `- ${item.cantidad}x ${item.nombre} (${item.categoria}) - ${formatPrice(item.precio)}${
        item.personalizacion ? `\n  Personalización: ${item.personalizacion}` : ''
      }`
  )

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)

  let message = `Hola, quiero cotizar las siguientes decoraciones:\n\n`
  message += lines.join('\n')
  message += `\n\n*Total estimado: ${formatPrice(total)}*`

  if (clientName || eventDate || note) {
    message += '\n\n'
    if (clientName) message += `Nombre: ${clientName}\n`
    if (eventDate) message += `Fecha del evento: ${eventDate}\n`
    if (note) message += `Nota: ${note}\n`
  }

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encoded}`
}
