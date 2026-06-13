import COTIZADOR from '../data/cotizador.json'

// ─── Etiquetas legibles del cotizador ─────────────────────────
// Traduce los ids guardados (p. ej. "arco", "letras-gigantes") a sus
// nombres visibles. Lo usan la pantalla de resumen y el mensaje de
// WhatsApp para no depender de ids en el texto que ve el usuario.

const MAPA_NOMBRES = Object.fromEntries(
  COTIZADOR.pasos.map((p) => [p.id, Object.fromEntries(p.opciones.map((o) => [o.id, o.nombre]))])
)

export function nombreOpcion(pasoId, id) {
  return MAPA_NOMBRES[pasoId]?.[id] ?? id
}

export function nombresOpciones(pasoId, ids = []) {
  return ids.map((id) => nombreOpcion(pasoId, id))
}

// Formatea "2026-07-01" → "1 de julio de 2026" (hora local, sin desfase de zona)
export function formatFechaLarga(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
