import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import WhatsAppButton from '../shared/WhatsAppButton'

// Botón flotante de WhatsApp — visible cuando no hay items en el carrito
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <WhatsAppButton
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-8 right-8 z-30 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg shadow-[#25D366]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle size={26} />
    </WhatsAppButton>
  )
}
