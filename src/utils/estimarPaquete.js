import PAQUETES from '../data/paquetes.json'
import COMPLEMENTOS from '../data/complementos.json'
import MOBILIARIO from '../data/mobiliario.json'
import COTIZADOR from '../data/cotizador.json'

// ─── Lógica de estimación del cotizador ───────────────────────
// Regla (ajustada al sumar los catálogos reales de mobiliario y pastelería):
//  - El ESTILO DE GLOBOS (paso 3) determina el paquete base
//    (mapaGlobos en paquetes.json).
//  - MOBILIARIO (paso 4) y PASTELERÍA (paso 5) YA NO son "extras"
//    genéricos: ambos tienen catálogo real con precio individual por
//    ítem, así que su costo es EXACTO y conocido y se suma igual a piso
//    y tope (no se multiplica como los "desde" de complementos: no hay
//    incertidumbre que cubrir). Los ítems sin precio confirmado
//    (precio: 0, "Precio próximamente") simplemente no suman nada.
//  - Los COMPLEMENTOS ("Completa tu evento") suman por dentro su
//    precio_desde al piso, y al tope ese mismo monto × factorMaxComplemento.
//    Es un término APARTE, itemizado por dentro, pero el DISPLAY sigue
//    siendo un rango (nunca se muestra el precio de un complemento suelto
//    hasta tener precios reales); así, al llegar precios reales, el
//    estimado se autocorrige sin tocar esta lógica.
//  - Se devuelve SIEMPRE un rango { min, max } para el paquete/complementos
//    — mobiliario y pastelería SÍ se muestran itemizados aparte en
//    ResumenCotizacion (tienen precio real, no "desde").

const { paquetes, mapaGlobos, factorMaxComplemento } = PAQUETES

// Precio "desde" de cada complemento, por id (para la suma itemizada interna).
const PRECIO_COMPLEMENTO = Object.fromEntries(
  COMPLEMENTOS.complementos.map((c) => [c.id, c.precio_desde])
)

// Precio exacto de cada ítem de mobiliario, por id.
const PRECIO_MOBILIARIO = Object.fromEntries(MOBILIARIO.items.map((i) => [i.id, i.precio]))

// Precio exacto de cada producto de pastelería, por id.
const PRECIO_PASTELERIA = Object.fromEntries(
  COTIZADOR.pasos.find((p) => p.id === 'pasteleria').opciones.map((o) => [o.id, o.precio])
)

// Redondea a la decena de mil más cercana para mostrar cifras limpias
const redondear = (n) => Math.round(n / 10000) * 10000

/**
 * Estima el rango de precio según las respuestas del cotizador.
 * @param {{ globos?: string, mobiliario?: string[], pasteleria?: string[], complementos?: string[] }} respuestas
 * @returns {{ paquete: object, min: number, max: number, mobiliarioTotal: number, pasteleriaTotal: number } | null}
 *          null si aún no se ha elegido estilo de globos.
 */
export function estimarPaquete(respuestas = {}) {
  const nivelId = mapaGlobos[respuestas.globos]
  if (!nivelId) return null

  const paquete = paquetes.find((p) => p.id === nivelId) ?? paquetes[0]

  // Mobiliario y pastelería: suma exacta (precio real por ítem), igual en piso y tope.
  const mobiliarioTotal = (respuestas.mobiliario ?? []).reduce(
    (sum, id) => sum + (PRECIO_MOBILIARIO[id] ?? 0),
    0
  )
  const pasteleriaTotal = (respuestas.pasteleria ?? []).reduce(
    (sum, id) => sum + (PRECIO_PASTELERIA[id] ?? 0),
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
    min: redondear(paquete.desde + complementosMin + mobiliarioTotal + pasteleriaTotal),
    max: redondear(paquete.hasta + complementosMax + mobiliarioTotal + pasteleriaTotal),
    mobiliarioTotal,
    pasteleriaTotal,
  }
}
