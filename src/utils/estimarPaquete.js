import PAQUETES from '../data/paquetes.json'
import COMPLEMENTOS from '../data/complementos.json'

// ─── Lógica de estimación del cotizador ───────────────────────
// Regla (definida en MISIÓN 3.2):
//  - El ESTILO DE GLOBOS (paso 3) determina el paquete base
//    (mapaGlobos en paquetes.json).
//  - Cada ítem elegido en MOBILIARIO (paso 4) y PASTELERÍA (paso 5)
//    es un extra que amplía el rango: sube el piso y, más aún, el tope.
//  - Los COMPLEMENTOS ("Completa tu evento") suman por dentro su
//    precio_desde al piso, y al tope ese mismo monto × factorMaxComplemento.
//    Son un término APARTE: NO entran en el conteo de `extras` (sin doble
//    conteo). El cálculo es itemizado por dentro, pero el DISPLAY sigue
//    siendo un rango (nunca se muestra el precio de un complemento suelto);
//    así, al llegar precios reales, el estimado se autocorrige sin tocar
//    esta lógica.
//  - Se devuelve SIEMPRE un rango { min, max }, nunca precios por ítem.
//
// Los números viven en paquetes.json/complementos.json para ajustarlos
// sin tocar código.

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

// Redondea a la decena de mil más cercana para mostrar cifras limpias
const redondear = (n) => Math.round(n / 10000) * 10000

/**
 * Estima el rango de precio según las respuestas del cotizador.
 * @param {{ globos?: string, mobiliario?: string[], pasteleria?: string[], complementos?: string[] }} respuestas
 * @returns {{ paquete: object, min: number, max: number, extras: number } | null}
 *          null si aún no se ha elegido estilo de globos.
 */
export function estimarPaquete(respuestas = {}) {
  const nivelId = mapaGlobos[respuestas.globos]
  if (!nivelId) return null

  const paquete = paquetes.find((p) => p.id === nivelId) ?? paquetes[0]
  const extras = (respuestas.mobiliario?.length ?? 0) + (respuestas.pasteleria?.length ?? 0)

  // Complementos: suma itemizada de precio_desde (término independiente).
  const complementosMin = (respuestas.complementos ?? []).reduce(
    (sum, id) => sum + (PRECIO_COMPLEMENTO[id] ?? 0),
    0
  )
  const complementosMax = complementosMin * factorMaxComplemento

  return {
    paquete,
    min: redondear(paquete.desde + extras * incrementoMinPorExtra + complementosMin),
    max: redondear(paquete.hasta + extras * incrementoMaxPorExtra + complementosMax),
    extras,
  }
}
