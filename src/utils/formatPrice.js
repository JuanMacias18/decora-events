// Formatea número a pesos colombianos: 450000 → $450.000
export function formatPrice(number) {
  return '$' + number.toLocaleString('es-CO')
}
