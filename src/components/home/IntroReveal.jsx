import { useEffect, useState, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────
// Reveal cinemático de entrada (solo primera visita por sesión).
//
// Overlay que se monta SOLO en cliente (nunca en el prerender), para
// no tocar el HTML estático ni el LCP: la foto real del hero pinta
// primero, y este overlay entra un frame después ya en negro.
//
// Secuencia:  negro → haz de luz recorre → revela la foto (wipe) →
//             partículas doradas → texto → el overlay se desvanece
//             y entrega el hero real (interactivo).
//
// - No se ejecuta con prefers-reduced-motion.
// - Se muestra una sola vez por pestaña (sessionStorage).
// - Saltable: click, tecla Esc, botón "Saltar", o timeout de seguridad.
//
// Ruta sugerida: src/components/home/IntroReveal.jsx
// Reutiliza el mismo srcSet del hero → el navegador NO descarga la
// imagen dos veces (misma URL ya precargada).
// ─────────────────────────────────────────────────────────────

const HERO_WIDTHS = [640, 960, 1280, 1600, 1920, 2400]
const heroSrcSet = (ext) =>
  HERO_WIDTHS.map((w) => `/img/hero/hero-${w}.${ext} ${w}w`).join(', ')

const DURATION = 3200 // ms — debe cubrir toda la timeline del CSS
const PARTICLES = 22

// Posiciones/delays deterministas (no random en cada render → SSR-safe)
const particles = Array.from({ length: PARTICLES }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const r = seed / 233280
  const r2 = ((i * 4177 + 1) % 100) / 100
  return {
    left: 6 + r * 88,
    bottom: 2 + r2 * 38,
    size: 3 + ((i * 7) % 5),
    delay: 1.15 + r * 0.9,
    dur: 2 + r2 * 1.4,
    drift: (r - 0.5) * 60,
  }
})

export default function IntroReveal() {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timers = useRef([])

  // useCallback ([] estable): permite incluirla en las deps de los efectos
  // sin re-ejecutarlos y evita el "usada antes de declararse".
  const finish = useCallback(() => {
    setLeaving(true) // dispara el fade-out del overlay
    timers.current.push(setTimeout(() => setShow(false), 650))
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    if (sessionStorage.getItem('deco_intro_seen')) return

    sessionStorage.setItem('deco_intro_seen', '1')
    // El intro es intencionalmente client-only y post-hidratación: el servidor
    // y el primer render pintan null (nada en el HTML estático) y solo aquí,
    // tras verificar sessionStorage/reduced-motion, se activa. Evita el
    // mismatch de hidratación; por eso el setState va en el efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true)

    const t = timers.current
    t.push(setTimeout(() => finish(), DURATION))
    return () => t.forEach(clearTimeout)
  }, [finish])

  useEffect(() => {
    if (!show) return
    const onKey = (e) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show, finish])

  if (!show) return null

  return (
    <div
      className={`intro-root ${leaving ? 'intro-leaving' : ''}`}
      role="presentation"
      onClick={finish}
    >
      {/* Foto revelada (mismo srcSet del hero → sin doble descarga) */}
      <picture>
        <source type="image/avif" srcSet={heroSrcSet('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="100vw" />
        <img
          src="/img/hero/hero-1280.jpg"
          srcSet={heroSrcSet('jpg')}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="intro-photo"
          decoding="async"
        />
      </picture>

      <div className="intro-tint" aria-hidden="true" />
      <div className="intro-mask" aria-hidden="true" />
      <div className="intro-beam" aria-hidden="true" />

      <div className="intro-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="intro-p"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              filter: p.size >= 6 ? 'blur(1px)' : 'none',
              '--d': `${p.delay}s`,
              '--dur': `${p.dur}s`,
              '--drift': `${p.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="intro-copy">
        <span className="intro-eyebrow">Decoración · Eventos · Colombia</span>
        <h2 className="intro-h">
          <span className="intro-line intro-l1"><span>Creamos momentos</span></span>
          <span className="intro-line intro-l2"><span>inolvidables.</span></span>
        </h2>
        <span className="intro-rule" />
      </div>

      <button
        type="button"
        className="intro-skip"
        onClick={(e) => { e.stopPropagation(); finish() }}
      >
        Saltar
      </button>
    </div>
  )
}
