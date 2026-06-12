import { useParams, Navigate } from 'react-router-dom'
import CATEGORIAS from '../data/categorias.json'
import PRODUCTOS from '../data/productos.json'
import ProductCard from '../components/catalog/ProductCard'
import SectionHeading from '../components/shared/SectionHeading'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoCategoria, seoHome } from '../config/seo'

export default function CategoryPage() {
  const { slug } = useParams()
  const categoria = CATEGORIAS.find((c) => c.slug === slug)

  // El hook debe llamarse siempre (antes del return condicional)
  usePageMeta(categoria ? seoCategoria(categoria) : seoHome())

  if (!categoria) return <Navigate to="/" replace />

  const items = PRODUCTOS.filter((p) => p.categoria === categoria.id).map((p) => ({
    ...p,
    categoriaLabel: categoria.nombre,
  }))

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`${categoria.emoji} Categoría`}
          title={categoria.nombre}
          subtitle="Encuentra la decoración perfecta para tu celebración"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
