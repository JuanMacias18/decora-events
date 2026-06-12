import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoHome } from '../config/seo'
import Hero from '../components/home/Hero'
import CategoriesGrid from '../components/home/CategoriesGrid'
import CatalogSection from '../components/catalog/CatalogSection'
import Portfolio from '../components/home/Portfolio'
import Testimonials from '../components/home/Testimonials'
import AboutUs from '../components/home/AboutUs'

export default function HomePage() {
  usePageMeta(seoHome())
  const [activeCategory, setActiveCategory] = useState(null)

  function handleCategorySelect(id) {
    setActiveCategory(id)
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      <Hero />
      <CategoriesGrid onCategorySelect={handleCategorySelect} />
      <CatalogSection initialCategory={activeCategory} />
      <Portfolio />
      <Testimonials />
      <AboutUs />
    </>
  )
}
