// Entrada SSR para el prerendering del build (scripts/prerender.mjs).
// Renderiza la app con StaticRouter en la URL pedida. Aquí no existen
// window ni localStorage: el código del cliente debe estar protegido
// (ver CartContext) y los efectos no se ejecutan en renderToString.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppShell } from './App'

export { seoPorRuta } from './config/seo'

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>
  )
}
