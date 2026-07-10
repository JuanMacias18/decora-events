import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Children,
  cloneElement,
} from 'react'

// ─────────────────────────────────────────────────────────────
// <Reveal> — revela contenido al entrar en viewport (scroll).
//
// Por qué IntersectionObserver y no GSAP: son reveals de entrada
// (fade/rise/scale), no scrub ni parallax. IO + CSS = 0 KB extra,
// SSR-safe y 60fps. Si algún día quieres parallax atado al scroll
// en Portfolio, ahí sí entra GSAP ScrollTrigger (no antes).
//
// SSR / prerender: en el servidor NO se arma → el HTML prerenderizado
// sale VISIBLE (crawlers de Google/WhatsApp ven todo). El "armado"
// (estado oculto) se activa en cliente en useLayoutEffect, antes del
// primer paint, para no producir parpadeo.
//
// prefers-reduced-motion: no se arma → todo visible, sin animación.
//
// Ruta sugerida: src/components/shared/Reveal.jsx
//
// Uso:
//   <Reveal>...</Reveal>                       // bloque sube y aparece
//   <Reveal variant="title"><h2>…</h2></Reveal> // título emerge de máscara
//   <Reveal variant="image"><img …/></Reveal>   // imagen escala desde máscara
//   <Reveal stagger={0.08}>{items}</Reveal>     // hijos directos escalonados
// ─────────────────────────────────────────────────────────────

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function Reveal({
  as: Tag = 'div',
  variant = 'up', // 'up' | 'title' | 'image'
  stagger = 0, // segundos entre hijos directos (modo lista)
  delay = 0, // segundos de retraso inicial
  once = true,
  threshold = 0.15,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [armed, setArmed] = useState(false)
  const [inView, setInView] = useState(false)

  useIso(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true) // pre-paint: activa el estado oculto sin flash
  }, [])

  useEffect(() => {
    if (!armed) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed, once, threshold])

  const shown = inView || !armed // visible si ya entró, o si no se armó (SSR/reduced)

  // ── Modo lista: cada hijo directo se anima con su propio delay ──
  if (stagger > 0) {
    const kids = Children.map(children, (child, i) => {
      if (!child || typeof child !== 'object') return child
      const itemCls = [
        'reveal',
        'reveal-up',
        armed ? 'reveal--armed' : '',
        shown ? 'is-in' : '',
        child.props.className || '',
      ]
        .filter(Boolean)
        .join(' ')
      return cloneElement(child, {
        className: itemCls,
        style: {
          ...(child.props.style || {}),
          transitionDelay: armed && !inView ? '0s' : `${delay + i * stagger}s`,
        },
      })
    })
    return (
      <Tag ref={ref} className={className} {...rest}>
        {kids}
      </Tag>
    )
  }

  // ── Modo bloque: el contenedor es lo que se anima ──
  const cls = [
    'reveal',
    `reveal-${variant}`,
    armed ? 'reveal--armed' : '',
    shown ? 'is-in' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const style = delay ? { transitionDelay: `${delay}s` } : undefined

  return (
    <Tag ref={ref} className={cls} style={style} {...rest}>
      {children}
    </Tag>
  )
}
