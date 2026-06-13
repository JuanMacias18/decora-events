import { buildWhatsAppHref } from './buildWhatsAppMessage'
import { formatPrice } from './formatPrice'
import { nombreOpcion, nombresOpciones, formatFechaLarga } from './cotizadorLabels'

// Construye el enlace de WhatsApp con la cotización estructurada del
// cotizador "Diseña Tu Evento" (formato definido en MISIÓN 3.4).
export function buildCotizadorWhatsAppUrl(estado, estimado) {
  const fecha = formatFechaLarga(estado.fecha)
  const mobiliario = nombresOpciones('mobiliario', estado.mobiliario)
  const pasteleria = nombresOpciones('pasteleria', estado.pasteleria)

  let m = `🎨 *Cotización — Diseña Tu Evento*\n\n`
  m += `*Tipo:* ${nombreOpcion('tipo', estado.tipo)}${fecha ? ` — ${fecha}` : ''}\n`
  m += `*Fondo:* ${nombreOpcion('fondo', estado.fondo)}\n`
  m += `*Globos:* ${nombreOpcion('globos', estado.globos)}\n`
  m += `*Mobiliario:* ${mobiliario.length ? mobiliario.join(', ') : 'Ninguno'}\n`
  m += `*Pastelería:* ${pasteleria.length ? pasteleria.join(', ') : 'Ninguno'}\n`

  if (estimado) {
    m += `\n*Rango estimado:* ${formatPrice(estimado.min)} — ${formatPrice(estimado.max)}\n`
  }

  m += `\nQuiero confirmar disponibilidad y agendar mi evento.`

  return buildWhatsAppHref(m)
}
