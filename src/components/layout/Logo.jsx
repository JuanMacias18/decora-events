// Logo real de Decora Events (vectorial, escalable). El archivo .png
// (logo-decora-events.png) queda como respaldo para usos donde el SVG
// no sirva (redes, og-image, email).
import logoUrl from '../../assets/logo-decora-events.svg'

export default function Logo({ className = 'h-10 w-auto', invertOnDark = false, lazy = false }) {
  return (
    <img
      src={logoUrl}
      alt="Logo de Decora Events — decoración de eventos en Colombia"
      loading={lazy ? 'lazy' : undefined}
      className={`${className} object-contain ${invertOnDark ? 'brightness-0 invert opacity-90' : ''}`}
    />
  )
}
