import SectionHeading from '../shared/SectionHeading'
import Reveal from '../shared/Reveal'
import MONTAJES from '../../data/montajes.json'
import { SITE_CONFIG } from '../../config/site'

export default function Portfolio() {
  return (
    <section id="montajes" className="[content-visibility:auto] [contain-intrinsic-size:auto_900px] py-20 bg-arena/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nuestro trabajo"
          title="Nuestros Montajes"
          subtitle="Cada foto cuenta una historia de alegría"
          lineClass="bg-dorado/40"
        />

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {MONTAJES.map((item) => (
            <div
              key={item.imagen}
              className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
            >
              {/* Firma 2: la imagen escala desde una máscara al entrar en viewport */}
              <Reveal variant="image">
                <img
                  src={item.imagen}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Reveal>
              <div className="absolute inset-0 bg-bronce/0 group-hover:bg-bronce/40 transition-colors duration-300 flex items-end">
                <p className="font-cinzel text-xs text-crema tracking-wider p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {item.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={SITE_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-dorado text-dorado hover:bg-dorado hover:text-crema font-inter text-sm tracking-widest uppercase px-8 py-3 rounded-full transition-all duration-300"
          >
            Ver más en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
