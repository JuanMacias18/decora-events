import { useEffect } from 'react'
import { SEO_BASE } from '../config/seo'

function setMetaTag(selector, attrName, attrValue, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Actualiza title y metadatos OG/Twitter al navegar entre rutas
export function usePageMeta({ title, description, url }) {
  useEffect(() => {
    document.title = title
    setMetaTag('meta[name="description"]', 'name', 'description', description)
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', url)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', SEO_BASE.imagen)
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  }, [title, description, url])
}
