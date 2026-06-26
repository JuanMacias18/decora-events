import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoHome } from '../config/seo'
import Hero from '../components/home/Hero'
import CategoriesGrid from '../components/home/CategoriesGrid'
import DisenaEventoBanner from '../components/home/DisenaEventoBanner'
import CatalogSection from '../components/catalog/CatalogSection'
import CategoryModal from '../components/catalog/CategoryModal'
import Portfolio from '../components/home/Portfolio'
import Testimonials from '../components/home/Testimonials'
import AboutUs from '../components/home/AboutUs'

export default function HomePage() {
  usePageMeta(seoHome())
  // Categoría abierta en el modal (null = cerrado). El modal NO se monta
  // hasta que se selecciona una categoría, para no afectar el LCP/CLS inicial.
  const [modalCategoria, setModalCategoria] = useState(null)

  return (
    <>
      <Hero />
      {/* "Diseña Tu Evento" va primero; "Nuestras Categorías" después. */}
      <DisenaEventoBanner />
      <CategoriesGrid onCategorySelect={setModalCategoria} />
      <CatalogSection />
      <Portfolio />
      <Testimonials />
      <AboutUs />

      {modalCategoria && (
        <CategoryModal
          categoriaId={modalCategoria}
          onClose={() => setModalCategoria(null)}
        />
      )}
    </>
  )
}
