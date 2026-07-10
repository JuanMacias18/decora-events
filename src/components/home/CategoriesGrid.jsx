import { ArrowRight } from 'lucide-react'
import CATEGORIAS from '../../data/categorias.json'
import SectionHeading from '../shared/SectionHeading'
import Reveal from '../shared/Reveal'

// Color de respaldo por categoría: se ve detrás de la foto mientras carga
// (lazy) o si la imagen falla. Conserva el degradado de marca.
const CATEGORY_COLORS = {
  cumpleanos:  'from-[#BA9972] to-[#95744E]',
  quince:      'from-[#95744E] to-[#7A5934]',
  babyshower:  'from-[#C98A7D] to-[#D9755B]',
  bautizo:     'from-[#F6D2B8] to-[#BA9972]',
  grado:       'from-[#E3D6C7] to-[#BA9972]',
}

// Overlay oscuro para legibilidad: más fuerte abajo, donde van título y botón.
// Asegura contraste AA del texto blanco sobre cualquier foto.
const OVERLAY =
  'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.78))'

export default function CategoriesGrid({ onCategorySelect }) {
  return (
    <section id="categorias" className="[content-visibility:auto] [contain-intrinsic-size:auto_900px] py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Lo que hacemos"
          title="Nuestras Categorías"
          subtitle="Cada celebración merece su propio mundo"
        />

        {/* Grid — 5 cards. aspect-[3/4] fija la altura (mismas alturas y sin CLS).
            Reveal stagger: los tiles nativos suben escalonados al entrar. */}
        <Reveal stagger={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              {/* Respaldo: degradado de marca detrás de la foto */}
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[cat.id]}`} />

              {/* Foto real de la categoría (decorativa: el título da el significado) */}
              <img
                src={cat.imagenTarjeta}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay de legibilidad + leve oscurecimiento en hover */}
              <div className="absolute inset-0" style={{ backgroundImage: OVERLAY }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                {/* Emoji: acento pequeño sobre el overlay (quitar esta línea si se decide sacarlo) */}
                <span className="text-2xl mb-2 drop-shadow" aria-hidden="true">
                  {cat.emoji}
                </span>
                <h3 className="font-cinzel text-sm sm:text-base text-white tracking-wide text-center leading-snug mb-3 drop-shadow-md">
                  {cat.nombre}
                </h3>
                <span className="flex items-center gap-1.5 bg-white/20 group-hover:bg-coral text-white text-xs font-inter tracking-wider uppercase px-4 py-1.5 rounded-full transition-all duration-300 backdrop-blur-sm">
                  Ver <ArrowRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
