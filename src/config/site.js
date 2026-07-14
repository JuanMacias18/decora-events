// ─── Configuración del negocio ────────────────────────────────
// Edita este archivo para cambiar datos de contacto y redes sociales.

// Único lugar donde vive el número de WhatsApp del negocio (con
// indicativo, sin espacios ni signos: Colombia 57 + celular). Todo el
// resto de la app lo consume desde aquí (vía SITE_CONFIG.whatsapp o
// este export) — nunca hardcodear el número en otro archivo.
export const WHATSAPP_NUMBER = '573123802307'

export const SITE_CONFIG = {
  nombre: 'DecoVents',
  dueno: 'Juan David Villalobos',
  whatsapp: WHATSAPP_NUMBER,
  // URL de Calendly para agendar asesorías (sección Eventos Premium).
  // Reemplazar PLACEHOLDER por la URL real; mientras tanto la página
  // muestra un aviso y el CTA de WhatsApp en lugar del calendario.
  calendly: 'https://calendly.com/PLACEHOLDER',
  instagram: 'https://www.instagram.com/decoraeventsoficial',
  instagramHandle: '@decoraeventsoficial',
  facebook: 'https://www.facebook.com/share/1B7eTf2eMu/',
  email: '',
  slogan: 'Hacemos de tu celebración un momento inolvidable',
  descripcion:
    'Somos una empresa colombiana especializada en decoración de eventos y celebraciones. Transformamos tus momentos especiales con montajes únicos, llenos de color, elegancia y amor por los detalles.',
}
