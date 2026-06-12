// Cambia este import por tu logodecoraevents.png real cuando lo tengas:
// import logoUrl from '../../assets/logodecoraevents.png'
import logoUrl from '../../assets/logo-placeholder.svg'

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
