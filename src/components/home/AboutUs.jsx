import { Sparkles, Award, Heart } from 'lucide-react'
import { SITE_CONFIG } from '../../config/site'
import { InstagramIcon, FacebookIcon } from '../shared/SocialIcons'
import Reveal from '../shared/Reveal'

const VALORES = [
  { icon: Sparkles, titulo: 'Creatividad', texto: 'Cada montaje es único y diseñado a medida para tu celebración.' },
  { icon: Award,    titulo: 'Calidad',     texto: 'Usamos materiales premium y cuidamos cada detalle del decorado.' },
  { icon: Heart,    titulo: 'Pasión',      texto: 'Amamos lo que hacemos; eso se refleja en cada entrega.' },
]

export default function AboutUs() {
  return (
    <section id="nosotros" className="[content-visibility:auto] [contain-intrinsic-size:auto_900px] py-20 bg-bronce text-crema overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-champan/40" />
                <span className="font-inter text-xs tracking-[0.3em] uppercase text-champan/70">
                  Quiénes somos
                </span>
              </div>

              <h2 className="font-cinzel text-3xl md:text-4xl text-crema tracking-wider mb-6 leading-tight">
                Sobre{' '}
                <span className="text-champan">{SITE_CONFIG.nombre}</span>
              </h2>

              <p className="font-editorial text-xl text-champan mb-6 leading-relaxed">
                Hacemos realidad los momentos que siempre soñaste celebrar.
              </p>

              <p className="font-inter text-sm text-crema/75 leading-relaxed mb-8">
                {SITE_CONFIG.descripcion}
              </p>

              <p className="font-inter text-sm text-crema/75 leading-relaxed mb-10">
                Fundada en 2026 por <strong className="text-champan">{SITE_CONFIG.dueno}</strong>,
                DecoVents nació del amor por los detalles y la convicción de que cada
                celebración merece brillar. Trabajamos en toda Colombia.
              </p>

              <div className="flex gap-4">
                <a
                  href={SITE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-champan/40 text-champan hover:bg-champan/10 font-inter text-sm tracking-wider px-6 py-2.5 rounded-full transition-all duration-300"
                >
                  <InstagramIcon size={16} />
                  Instagram
                </a>
                <a
                  href={SITE_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-champan/40 text-champan hover:bg-champan/10 font-inter text-sm tracking-wider px-6 py-2.5 rounded-full transition-all duration-300"
                >
                  <FacebookIcon size={16} />
                  Facebook
                </a>
              </div>
            </div>

            {/* Values */}
            <div className="flex flex-col gap-6">
              {VALORES.map(({ icon: Icon, titulo, texto }) => (
                <div
                  key={titulo}
                  className="flex gap-5 p-6 rounded-2xl bg-crema/5 border border-crema/10 hover:bg-crema/10 transition-colors duration-300"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-champan/20 flex items-center justify-center">
                    <Icon size={18} className="text-champan" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm text-champan tracking-widest uppercase mb-1">
                      {titulo}
                    </h3>
                    <p className="font-inter text-sm text-crema/70 leading-relaxed">
                      {texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
