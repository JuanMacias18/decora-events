import {
  Sparkles,
  Palette,
  FileText,
  Crown,
  Heart,
  Briefcase,
  GraduationCap,
  Megaphone,
  Store,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoEventosPremium } from '../config/seo'
import { SITE_CONFIG } from '../config/site'
import SectionHeading from '../components/shared/SectionHeading'
import WhatsAppButton from '../components/shared/WhatsAppButton'
import Reveal from '../components/shared/Reveal'

const VALOR = [
  {
    icon: Sparkles,
    titulo: 'Asesoría personalizada',
    texto: 'Te acompañamos en cada decisión, desde la idea hasta el último detalle del montaje.',
  },
  {
    icon: Palette,
    titulo: 'Diseño profesional',
    texto: 'Montajes únicos creados a la medida por nuestro equipo de diseño.',
  },
  {
    icon: FileText,
    titulo: 'Cotizaciones detalladas',
    texto: 'Propuestas claras y completas, pensadas para tu presupuesto y sin sorpresas.',
  },
]

const SERVICIOS = [
  { icon: Crown, nombre: 'Quince años', texto: 'Montajes de ensueño para una noche inolvidable.' },
  { icon: Heart, nombre: 'Matrimonios', texto: 'Ambientación elegante para el gran día.' },
  {
    icon: Briefcase,
    nombre: 'Eventos empresariales',
    texto: 'Celebraciones corporativas con sello profesional.',
  },
  { icon: GraduationCap, nombre: 'Graduaciones', texto: 'Honra el logro con un montaje memorable.' },
  {
    icon: Megaphone,
    nombre: 'Lanzamientos de marca',
    texto: 'Activaciones y branding que dejan huella.',
  },
  { icon: Store, nombre: 'Ferias', texto: 'Stands y espacios que destacan entre la multitud.' },
]

const CALENDLY_CONFIGURADO =
  Boolean(SITE_CONFIG.calendly) && !SITE_CONFIG.calendly.includes('PLACEHOLDER')

const MENSAJE_WA =
  'Hola DecoVents, quiero agendar una asesoría para un evento premium.'

export default function EventosPremiumPage() {
  usePageMeta(seoEventosPremium())

  return (
    <div className="bg-crema min-h-screen">
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 font-inter text-xs tracking-[0.3em] uppercase text-coral mb-4">
            <Sparkles size={14} /> Eventos Premium
          </span>
          <h1 className="font-cinzel text-3xl md:text-5xl text-bronce tracking-wider leading-tight">
            Diseñamos celebraciones a otro nivel
          </h1>
          <p className="font-editorial text-xl md:text-2xl text-dorado mt-4">
            Asesoría personalizada, diseño profesional y cotizaciones a la medida
          </p>
          <p className="font-inter text-sm md:text-base text-dorado/80 leading-relaxed mt-6 max-w-2xl mx-auto">
            Para eventos que merecen una experiencia completa, te acompañamos paso a paso con un
            servicio integral de diseño y montaje. Agenda una asesoría y construyamos juntos tu
            celebración perfecta.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href="#agenda"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-coral hover:bg-[#c4614a] text-white font-inter text-sm tracking-widest uppercase px-8 py-3.5 rounded-full transition-colors"
            >
              <CalendarCheck size={16} />
              Agenda tu asesoría
            </a>
            <WhatsAppButton
              message={MENSAJE_WA}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-dorado text-bronce font-inter text-sm tracking-widest uppercase px-8 py-3.5 rounded-full hover:bg-dorado hover:text-crema transition-colors"
            >
              <MessageCircle size={16} />
              Escríbenos por WhatsApp
            </WhatsAppButton>
          </div>
        </Reveal>
      </section>

      {/* Propuesta de valor */}
      <section className="py-12 bg-crema">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal stagger={0.07} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALOR.map(({ icon: Icon, titulo, texto }) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl border border-arena shadow-sm p-6 text-center"
              >
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-durazno/50 text-bronce mb-4">
                  <Icon size={22} />
                </span>
                <h3 className="font-cinzel text-base text-bronce tracking-wide mb-2">{titulo}</h3>
                <p className="font-inter text-sm text-dorado/80 leading-relaxed">{texto}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Lo que diseñamos"
            title="Nuestros servicios"
            subtitle="Cada ocasión, con la atención que merece"
          />
          <Reveal stagger={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICIOS.map(({ icon: Icon, nombre, texto }) => (
              <div
                key={nombre}
                className="flex items-start gap-4 bg-white rounded-2xl border border-arena shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <span className="shrink-0 inline-flex w-11 h-11 items-center justify-center rounded-full bg-durazno/50 text-bronce">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-cinzel text-sm text-bronce tracking-wide leading-snug">
                    {nombre}
                  </h3>
                  <p className="font-inter text-xs text-dorado/80 leading-relaxed mt-1">{texto}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Agenda (Calendly) */}
      <section id="agenda" className="py-16 bg-arena/30 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Agenda en línea"
            title="Reserva tu asesoría"
            subtitle="Elige el día y la hora que mejor te queden"
          />

          {CALENDLY_CONFIGURADO ? (
            <iframe
              src={SITE_CONFIG.calendly}
              title="Agenda tu asesoría con DecoVents"
              loading="lazy"
              className="w-full h-[680px] rounded-2xl border border-arena bg-white"
            />
          ) : (
            <div className="bg-white rounded-2xl border border-arena shadow-sm p-8 md:p-10 text-center">
              <CalendarCheck size={40} className="text-dorado mx-auto mb-4" />
              <p className="font-cinzel text-lg text-bronce tracking-wide mb-2">
                Estamos habilitando la agenda en línea
              </p>
              <p className="font-inter text-sm text-dorado/80 leading-relaxed mb-8 max-w-md mx-auto">
                Mientras tanto, escríbenos por WhatsApp y coordinamos tu cita de asesoría a la
                medida de tu evento.
              </p>
              <WhatsAppButton
                message={MENSAJE_WA}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-cinzel text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                <MessageCircle size={18} />
                Agendar por WhatsApp
              </WhatsAppButton>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
