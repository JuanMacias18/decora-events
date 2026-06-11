import { buildWhatsAppHref } from '../../utils/buildWhatsAppMessage'

// Enlace a WhatsApp reutilizable. `message` es opcional: si se pasa,
// abre el chat con el texto prellenado. El estilo lo define quien lo usa.
export default function WhatsAppButton({ message, className, children, ...rest }) {
  return (
    <a
      href={buildWhatsAppHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}
