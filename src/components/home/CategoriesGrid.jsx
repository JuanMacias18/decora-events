import { ArrowRight } from 'lucide-react'
import { CATEGORIAS } from '../../data/catalogo'

const CATEGORY_COLORS = {
  infantiles: 'from-[#F6D2B8] to-[#D9755B]',
  cumpleanos:  'from-[#BA9972] to-[#95744E]',
  babyshower:  'from-[#C98A7D] to-[#D9755B]',
  quince:      'from-[#95744E] to-[#7A5934]',
  grado:       'from-[#E3D6C7] to-[#BA9972]',
}

export default function CategoriesGrid({ onCategorySelect }) {
  return (
    <section id="categorias" className="py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-arena" />
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-dorado">
              Lo que hacemos
            </span>
            <div className="h-px w-12 bg-arena" />
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-bronce tracking-wider">
            Nuestras Categorías
          </h2>
          <p className="font-editorial text-xl text-dorado mt-3">
            Cada celebración merece su propio mundo
          </p>
        </div>

        {/* Grid — 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[cat.id]} transition-transform duration-500 group-hover:scale-105`}
              />

              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 30%, white 1.5px, transparent 1.5px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-bronce/0 group-hover:bg-bronce/20 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                <span className="text-4xl mb-3 drop-shadow" aria-hidden="true">
                  {cat.emoji}
                </span>
                <h3 className="font-cinzel text-sm sm:text-base text-crema tracking-wide text-center leading-snug mb-3 drop-shadow-md">
                  {cat.label}
                </h3>
                <span className="flex items-center gap-1.5 bg-white/20 group-hover:bg-coral text-crema text-xs font-inter tracking-wider uppercase px-4 py-1.5 rounded-full transition-all duration-300 backdrop-blur-sm">
                  Ver <ArrowRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
