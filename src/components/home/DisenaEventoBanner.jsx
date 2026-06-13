import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

// Banner destacado en la home que lleva al cotizador (funcionalidad estrella).
export default function DisenaEventoBanner() {
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_500px] py-16 bg-crema">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bronce to-dorado px-6 py-12 md:px-12 md:py-16 text-center">
          {/* Patrón sutil de puntos */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 30%, white 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 font-inter text-xs tracking-[0.3em] uppercase text-durazno mb-4">
              <Sparkles size={14} /> Diseña Tu Evento
            </span>
            <h2 className="font-cinzel text-2xl md:text-4xl text-crema tracking-wide leading-tight max-w-2xl mx-auto">
              Crea tu celebración a la medida y recibe tu cotización al instante
            </h2>
            <p className="font-inter text-sm md:text-base text-crema/80 leading-relaxed mt-4 max-w-xl mx-auto">
              Elige el estilo, el fondo, los detalles y la fecha. Nuestro cotizador guiado arma tu
              propuesta en minutos.
            </p>
            <Link
              to="/disena-tu-evento"
              className="inline-flex items-center gap-2 bg-coral hover:bg-[#c4614a] text-white font-inter text-sm tracking-widest uppercase px-8 py-3.5 rounded-full transition-colors mt-8"
            >
              Comenzar mi diseño <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
