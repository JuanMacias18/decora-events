// ─── SEO centralizado ─────────────────────────────────────────
// Títulos y descripciones por ruta. Lo usan el hook usePageMeta
// (en el navegador) y el prerendering del build (HTML estático).

import CATEGORIAS from '../data/categorias.json'
import PRODUCTOS from '../data/productos.json'

export const SEO_BASE = {
  dominio: 'https://decora-events.vercel.app',
  imagen: 'https://decora-events.vercel.app/og-image.jpg',
  title: 'DecoVents — Decoración de Eventos en Colombia',
  description:
    'Decoración profesional de eventos en Colombia: cumpleaños, quince años, baby shower, bautizos y grados. Arcos de globos, montajes temáticos y más. Cotiza por WhatsApp.',
}

// SEO por categoría con keywords locales
const CATEGORIA_SEO = {
  cumpleanos: {
    title: 'Decoración de Cumpleaños en Colombia | DecoVents',
    description:
      'Decoración de cumpleaños en Colombia para todas las edades: montajes elegantes, arcos orgánicos de globos y ambientación premium. Cotiza tu celebración por WhatsApp.',
  },
  babyshower: {
    title: 'Decoración de Baby Shower y Revelación de Género en Colombia | DecoVents',
    description:
      'Decoración de baby shower y revelación de género en Colombia: montajes tiernos y elegantes, globos, backdrops y mesas de dulces. Cotiza por WhatsApp.',
  },
  quince: {
    title: 'Decoración de Quince Años en Colombia | DecoVents',
    description:
      'Decoración de quince años en Colombia: montajes de ensueño, arcos florales, photocall y ambientación premium para una noche inolvidable. Cotiza por WhatsApp.',
  },
  grado: {
    title: 'Decoración de Grados en Colombia | DecoVents',
    description:
      'Decoración de grados en Colombia: celebra tu logro con montajes elegantes, globos personalizados y photocall. Cotiza tu fiesta de grado por WhatsApp.',
  },
  bautizo: {
    title: 'Decoración de Bautizo en Colombia | DecoVents',
    description:
      'Decoración de bautizo en Colombia: arcos de globos, backdrops elegantes y montajes en tonos cálidos y neutros. Mesas de postres y detalles con cruz personalizados. Cotiza por WhatsApp.',
  },
}

export function seoHome() {
  return {
    title: SEO_BASE.title,
    description: SEO_BASE.description,
    url: `${SEO_BASE.dominio}/`,
  }
}

export function seoCategoria(categoria) {
  const seo = CATEGORIA_SEO[categoria.id]
  return {
    title: seo?.title ?? `${categoria.nombre} | DecoVents`,
    description: seo?.description ?? SEO_BASE.description,
    url: `${SEO_BASE.dominio}/categoria/${categoria.slug}`,
  }
}

export function seoProducto(producto, categoria) {
  return {
    title: `${producto.nombre} — ${categoria?.nombre ?? 'Decoración'} | DecoVents`,
    description: `${producto.descripcion} Decoración de eventos en Colombia. Cotiza por WhatsApp.`,
    url: `${SEO_BASE.dominio}/producto/${producto.slug}`,
  }
}

export function seoCotizador() {
  return {
    title: 'Diseña Tu Evento — Cotizador Online | DecoVents',
    description:
      'Diseña tu evento paso a paso —cumpleaños, quince años, baby shower, matrimonio y más— y recibe una cotización estimada al instante por WhatsApp. Decoración de eventos en Colombia.',
    url: `${SEO_BASE.dominio}/disena-tu-evento`,
  }
}

export function seoEventosPremium() {
  return {
    title: 'Eventos Premium en Colombia — Asesoría y Diseño | DecoVents',
    description:
      'Servicio integral de eventos premium en Colombia: quince años, matrimonios, eventos empresariales, graduaciones y lanzamientos de marca. Asesoría personalizada y diseño profesional. Agenda tu cita.',
    url: `${SEO_BASE.dominio}/eventos-premium`,
  }
}

export function seoCarrito() {
  return {
    title: 'Tu Carrito de Decoraciones | DecoVents',
    description:
      'Revisa tu selección de decoraciones y cotiza tu evento por WhatsApp con DecoVents, decoración de eventos en Colombia.',
    url: `${SEO_BASE.dominio}/carrito`,
  }
}

// Resuelve el SEO de cualquier ruta (lo usa el prerendering del build)
export function seoPorRuta(pathname) {
  if (pathname === '/') return seoHome()
  if (pathname === '/carrito') return seoCarrito()
  if (pathname === '/disena-tu-evento') return seoCotizador()
  if (pathname === '/eventos-premium') return seoEventosPremium()

  const matchCategoria = pathname.match(/^\/categoria\/([^/]+)$/)
  if (matchCategoria) {
    const cat = CATEGORIAS.find((c) => c.slug === matchCategoria[1])
    if (cat) return seoCategoria(cat)
  }

  const matchProducto = pathname.match(/^\/producto\/([^/]+)$/)
  if (matchProducto) {
    const prod = PRODUCTOS.find((p) => p.slug === matchProducto[1])
    if (prod) {
      const cat = CATEGORIAS.find((c) => c.id === prod.categoria)
      return seoProducto(prod, cat)
    }
  }

  return seoHome()
}
