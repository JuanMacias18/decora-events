import SectionHeading from '../shared/SectionHeading'

const PORTFOLIO_ITEMS = [
  { id: 1, label: 'Montaje Safari', url: 'https://placehold.co/600x400/95744E/FBF6F0/webp?text=Montaje+1' },
  { id: 2, label: 'Baby Shower Celeste', url: 'https://placehold.co/600x800/D9755B/FBF6F0/webp?text=Montaje+2' },
  { id: 3, label: 'Quinceañera Rosa', url: 'https://placehold.co/600x400/C98A7D/FBF6F0/webp?text=Montaje+3' },
  { id: 4, label: 'Grado Premium', url: 'https://placehold.co/600x600/BA9972/FBF6F0/webp?text=Montaje+4' },
  { id: 5, label: 'Cumpleaños Boho', url: 'https://placehold.co/600x400/7A5934/FBF6F0/webp?text=Montaje+5' },
  { id: 6, label: 'Revelación Género', url: 'https://placehold.co/600x800/E3D6C7/7A5934/webp?text=Montaje+6' },
]

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
          {PORTFOLIO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={item.url}
                alt={`${item.label} — montaje real de Decora Events`}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-bronce/0 group-hover:bg-bronce/40 transition-colors duration-300 flex items-end">
                <p className="font-cinzel text-xs text-crema tracking-wider p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/finomontaje"
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
