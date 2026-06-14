import { ChevronDown } from 'lucide-react'
import { SITE_CONFIG } from '../../config/site'
import WhatsAppButton from '../shared/WhatsAppButton'

// Reemplaza HERO_IMAGE_URL con la URL de tu foto real o ponla en src/assets/hero.jpg
// y cambia el import: import heroImg from '../../assets/hero.jpg'
const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80&auto=format&fit=crop'

const STATS = [
  { value: '500+', label: 'Celebraciones realizadas' },
  { value: '5★',   label: 'Calificación promedio' },
  { value: '5',    label: 'Categorías de eventos' },
]

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={HERO_IMAGE_URL}
          srcSet={[480, 800, 1200, 1600]
            .map((w) => `${HERO_IMAGE_URL.replace('w=1600', `w=${w}`)} ${w}w`)
            .join(', ')}
          sizes="100vw"
          alt="Decoración de eventos Decora Events"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Multi-layer overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-bronce/85 via-bronce/40 to-bronce/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bronce/30 via-transparent to-bronce/20" />
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
