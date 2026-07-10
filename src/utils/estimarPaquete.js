import PAQUETES from '../data/paquetes.json'
import COMPLEMENTOS from '../data/complementos.json'
import MOBILIARIO from '../data/mobiliario.json'

// ─── Lógica de estimación del cotizador ───────────────────────
// Regla (definida en MISIÓN 3.2, ajustada al sumar el catálogo real de
// mobiliario):
//  - El ESTILO DE GLOBOS (paso 3) determina el paquete base
//    (mapaGlobos en paquetes.json).
//  - Cada ítem elegido en PASTELERÍA (paso 5) es un extra que amplía
//    el rango: sube el piso y, más aún, el tope.
//  - MOBILIARIO (paso 4) ya NO es un "extra" genérico: desde que tiene
//    catálogo real con precio individual por ítem (mobiliario.json,
//    generado por scripts/importar-mobiliario.mjs), su costo es EXACTO
//    y conocido, así que se suma igual a piso y tope (no se multiplica
//    como los "desde" de complementos: no hay incertidumbre que cubrir).
//  - Los COMPLEMENTOS ("Completa tu evento") suman por dentro su
//    precio_desde al piso, y al tope ese mismo monto × factorMaxComplemento.
//    Son un término APARTE: NO entran en el conteo de `extras` (sin doble
//    conteo). El cálculo es itemizado por dentro, pero el DISPLAY sigue
//    siendo un rango (nunca se muestra el precio de un complemento suelto
//    hasta tener precios reales); así, al llegar precios reales, el
//    estimado se autocorrige sin tocar esta lógica.
//  - Se devuelve SIEMPRE un rango { min, max }, nunca precios por ítem
//    de paquete/pastelería/complementos — el mobiliario SÍ se muestra
//    itemizado aparte en ResumenCotizacion (tiene precio real, no "desde").

const {
  paquetes,
  mapaGlobos,
  incrementoMinPorExtra,
  incrementoMaxPorExtra,
  factorMaxComplemento,
} = PAQUETES

// Precio "desde" de cada complemento, por id (para la suma itemizada interna).
const PRECIO_COMPLEMENTO = Object.fromEntries(
  COMPLEMENTOS.complementos.map((c) => [c.id, c.precio_desde])
)

// Precio exacto de cada ítem de mobiliario, por id.
const PRECIO_MOBILIARIO = Object.fromEntries(MOBILIARIO.items.map((i) => [i.id, i.precio]))

// Redondea a la decena de mil más cercana para mostrar cifras limpias
const redondear = (n) => Math.round(n / 10000) * 10000

/**
 * Estima el rango de precio según las respuestas del cotizador.
 * @param {{ globos?: string, mobiliario?: string[], pasteleria?: string[], complementos?: string[] }} respuestas
 * @returns {{ paquete: object, min: number, max: number, extras: number, mobiliarioTotal: number } | null}
 *          null si aún no se ha elegido estilo de globos.
 */
export function estimarPaquete(respuestas = {}) {
  const nivelId = mapaGlobos[respuestas.globos]
  if (!nivelId) return null

  const paquete = paquetes.find((p) => p.id === nivelId) ?? paquetes[0]
  const extras = respuestas.pasteleria?.length ?? 0

  // Mobiliario: suma exacta (precio real por ítem), igual en piso y tope.
  const mobiliarioTotal = (respuestas.mobiliario ?? []).reduce(
    (sum, id) => sum + (PRECIO_MOBILIARIO[id] ?? 0),
    0
  )

  // Complementos: suma itemizada de precio_desde (término independiente).
  const complementosMin = (respuestas.complementos ?? []).reduce(
    (sum, id) => sum + (PRECIO_COMPLEMENTO[id] ?? 0),
    0
  )
  const complementosMax = complementosMin * factorMaxComplemento

  return {
    paquete,
    min: redondear(paquete.desde + extras * incrementoMinPorExtra + complementosMin + mobiliarioTotal),
    max: redondear(paquete.hasta + extras * incrementoMaxPorExtra + complementosMax + mobiliarioTotal),
    extras,
    mobiliarioTotal,
  }
}
