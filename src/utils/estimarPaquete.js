import PAQUETES from '../data/paquetes.json'

// ─── Lógica de estimación del cotizador ───────────────────────
// Regla (definida en MISIÓN 3.2):
//  - El ESTILO DE GLOBOS (paso 3) determina el paquete base
//    (mapaGlobos en paquetes.json).
//  - Cada ítem elegido en MOBILIARIO (paso 4) y PASTELERÍA (paso 5)
//    es un extra que amplía el rango: sube el piso y, más aún, el tope.
//  - Se devuelve SIEMPRE un rango { min, max }, nunca precios por ítem.
//
// Los números viven en paquetes.json para que se ajusten sin tocar código.

const { paquetes, mapaGlobos, incrementoMinPorExtra, incrementoMaxPorExtra } = PAQUETES

// Redondea a la decena de mil más cercana para mostrar cifras limpias
const redondear = (n) => Math.round(n / 10000) * 10000

/**
 * Estima el rango de precio según las respuestas del cotizador.
 * @param {{ globos?: string, mobiliario?: string[], pasteleria?: string[] }} respuestas
 * @returns {{ paquete: object, min: number, max: number, extras: number } | null}
 *          null si aún no se ha elegido estilo de globos.
 */
export function estimarPaquete(respuestas = {}) {
  const nivelId = mapaGlobos[respuestas.globos]
  if (!nivelId) return null

  const paquete = paquetes.find((p) => p.id === nivelId) ?? paquetes[0]
  const extras = (respuestas.mobiliario?.length ?? 0) + (respuestas.pasteleria?.length ?? 0)

  return {
    paquete,
    min: redondear(paquete.desde + extras * incrementoMinPorExtra),
    max: redondear(paquete.hasta + extras * incrementoMaxPorExtra),
    extras,
  }
}
