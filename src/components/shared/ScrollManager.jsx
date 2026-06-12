import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al cambiar de ruta: si la URL trae ancla (#seccion) hace scroll a ella;
// si no, sube al inicio de la página.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
