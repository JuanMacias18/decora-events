import COTIZADOR from '../data/cotizador.json'
import COMPLEMENTOS from '../data/complementos.json'
import MOBILIARIO from '../data/mobiliario.json'

// ─── Etiquetas legibles del cotizador ─────────────────────────
// Traduce los ids guardados (p. ej. "arco", "letras-gigantes") a sus
// nombres visibles. Lo usan la pantalla de resumen y el mensaje de
// WhatsApp para no depender de ids en el texto que ve el usuario.
//
// El paso "mobiliario" ya no tiene `opciones` (ver cotizador.json): sus
// nombres salen del catálogo real de MobiliarioStep (mobiliario.json).

const MAPA_NOMBRES = {
  ...Object.fromEntries(
    COTIZADOR.pasos
      .filter((p) => p.id !== 'mobiliario')
      .map((p) => [p.id, Object.fromEntries(p.opciones.map((o) => [o.id, o.nombre]))])
  ),
  // Los complementos no son un paso del cotizador, pero se nombran igual.
  complementos: Object.fromEntries(COMPLEMENTOS.complementos.map((c) => [c.id, c.nombre])),
}

const MOBILIARIO_POR_ID = Object.fromEntries(MOBILIARIO.items.map((i) => [i.id, i]))

export function nombreOpcion(pasoId, id) {
  return MAPA_NOMBRES[pasoId]?.[id] ?? id
}

export function nombresOpciones(pasoId, ids = []) {
  return ids.map((id) => nombreOpcion(pasoId, id))
}

// Ítems de mobiliario elegidos, con su nombre y precio real (para el
// desglose del resumen y el mensaje de WhatsApp). Descarta ids que ya
// no existan en el catálogo (defensivo, igual que el resto del saneo).
export function itemsMobiliarioSeleccionados(ids = []) {
  return ids.map((id) => MOBILIARIO_POR_ID[id]).filter(Boolean)
}

// Formatea "2026-07-01" → "1 de julio de 2026" (hora local, sin desfase de zona)
export function formatFechaLarga(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
