import { Star } from 'lucide-react'
import SectionHeading from '../shared/SectionHeading'

const TESTIMONIALS = [
  {
    id: 1,
    nombre: 'Valentina Gómez',
    ciudad: 'Bogotá',
    texto:
      'Decora Events transformó la fiesta de mi hija en algo de cuento. El montaje de Unicornio quedó perfecto, igual o mejor que las fotos del catálogo. ¡Todos los invitados preguntaron por el contacto!',
    stars: 5,
    evento: 'Cumpleaños Infantil',
  },
  {
    id: 2,
    nombre: 'Mariana Ospina',
    ciudad: 'Medellín',
    texto:
      'Para el baby shower de mi bebé pedí el paquete floral premium y superó todas mis expectativas. Juan David es muy profesional, puntual y creativo. Sin duda los recomiendo.',
    stars: 5,
    evento: 'Baby Shower',
  },
  {
    id: 3,
    nombre: 'Paola Rodríguez',
    ciudad: 'Cali',
    texto:
      'Mi quinceañera fue un sueño gracias a Decora Events. El montaje Princesa de Cuento estuvo increíble. Muchas gracias por hacer de mi día algo tan especial e inolvidable.',
    stars: 5,
    evento: '15 Años',
  },
  {
    id: 4,
    nombre: 'Santiago Morales',
    ciudad: 'Bucaramanga',
    texto:
      'Contratamos el paquete de grado completo y la decoración quedó espectacular. Los globos con el nombre de mi hermano y el photocall fueron el hit de la noche. Precio justo, excelente calidad.',
    stars: 5,
    evento: 'Decoración de Grado',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="[content-visibility:auto] [contain-intrinsic-size:auto_900px] py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Qué dicen de nosotros"
          title="Testimonios"
          subtitle="Momentos reales de familias felices"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-8 border border-arena shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-champan fill-champan"
                  />
                ))}
              </div>

              <p className="font-inter text-bronce/80 text-sm leading-relaxed mb-6 italic">
                "{t.texto}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-sm text-bronce tracking-wider">
                    {t.nombre}
                  </p>
                  <p className="font-inter text-xs text-dorado mt-0.5">
                    {t.ciudad}
                  </p>
                </div>
                <span className="bg-durazno text-bronce font-inter text-xs px-3 py-1 rounded-full">
                  {t.evento}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
