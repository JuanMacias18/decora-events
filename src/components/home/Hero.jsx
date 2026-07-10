import { ChevronDown } from 'lucide-react'
import { SITE_CONFIG } from '../../config/site'
import WhatsAppButton from '../shared/WhatsAppButton'
import IntroReveal from './IntroReveal'

// Fondo del hero (LCP). Variantes responsive generadas por
// scripts/optimizar-hero.mjs en /public/img/hero (AVIF/WebP/JPEG, 640→2400).
// El <link rel="preload"> de la variante AVIF se inyecta solo en la home
// desde scripts/prerender.mjs. Aspect-ratio del original: 2400x1950.
const HERO_WIDTHS = [640, 960, 1280, 1600, 1920, 2400]
const heroSrcSet = (ext) =>
  HERO_WIDTHS.map((w) => `/img/hero/hero-${w}.${ext} ${w}w`).join(', ')

// TODO(contenido): verificar cifras reales con el cliente; si no hay respaldo,
// sustituir por prueba social real (reseñas Google). No animar como contadores.
const STATS = [
  { value: '500+', label: 'Celebraciones realizadas' },
  { value: '5★',   label: 'Calificación promedio' },
  { value: '5',    label: 'Categorías de eventos' },
]

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden">
      {/* Intro cinemático (solo 1ª visita por sesión; se monta solo en cliente
          y NO toca el LCP — ver IntroReveal.jsx). */}
      <IntroReveal />

      {/* Background photo (LCP) con efecto Ken Burns en CSS */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet={heroSrcSet('avif')} sizes="100vw" />
          <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="100vw" />
          <img
            src="/img/hero/hero-1280.jpg"
            srcSet={heroSrcSet('jpg')}
            sizes="100vw"
            width={2400}
            height={1950}
            alt=""
            className="hero-kenburns absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/* Multi-layer overlay para legibilidad del titular (foto clara) */}
        <div className="absolute inset-0 bg-gradient-to-t from-bronce/90 via-bronce/50 to-bronce/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bronce/40 via-transparent to-bronce/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(58,42,24,0.45)_0%,transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-14 bg-champan/50" />
          <span className="font-inter text-[10px] tracking-[0.35em] uppercase text-champan/80">
            Colombia · Desde 2026
          </span>
          <div className="h-px w-14 bg-champan/50" />
        </div>

        {/* Main title */}
        <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-crema leading-none tracking-widest mb-5 drop-shadow-lg">
          {SITE_CONFIG.nombre}
        </h1>

        {/* Tagline */}
        <p className="font-editorial text-2xl sm:text-3xl md:text-4xl text-champan mb-8 leading-relaxed drop-shadow max-w-2xl">
          {SITE_CONFIG.slogan}
        </p>

        {/* Sub-copy */}
        <p className="font-inter text-sm sm:text-base text-crema/75 mb-10 max-w-md leading-relaxed">
          Decoraciones únicas para cumpleaños, quinceañeras, baby shower,
          bautizos y grados. Cotiza por WhatsApp en segundos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#catalogo"
            className="group bg-coral hover:bg-[#c4614a] text-white font-cinzel text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-coral/30 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Ver Catálogo
            <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <WhatsAppButton className="border border-champan/50 text-champan hover:bg-champan/10 font-inter text-sm tracking-wider uppercase px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm">
            Cotizar Ahora
          </WhatsAppButton>
        </div>
      </div>

      {/* Stats bar at bottom */}
      <div className="relative z-10 w-full mt-auto">
        <div className="max-w-3xl mx-auto px-4 pb-14 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-cinzel text-2xl sm:text-3xl text-champan drop-shadow">{s.value}</p>
              <p className="font-inter text-[10px] sm:text-xs text-crema/60 mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#categorias"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-crema/40 hover:text-crema transition-colors animate-bounce"
        aria-label="Ir a categorías"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  )
}
