import Reveal from './Reveal'

// Encabezado de sección reutilizable: eyebrow con líneas + título + subtítulo.
// Por defecto el título usa la firma "emerge desde una máscara" (Reveal
// variant="title") y el eyebrow/subtítulo un reveal simple (up), así todas
// las secciones que usan SectionHeading heredan la firma sin repetir código.
// Pasa `animate={false}` para renderizar el encabezado plano, sin scroll-reveal
// (p. ej. dentro del cotizador, donde ya existe la transición animate-paso).
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  lineClass = 'bg-arena',
  className = 'mb-14',
  animate = true,
}) {
  const eyebrowEl = (
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className={`h-px w-12 ${lineClass}`} />
      <span className="font-inter text-xs tracking-[0.3em] uppercase text-dorado">
        {eyebrow}
      </span>
      <div className={`h-px w-12 ${lineClass}`} />
    </div>
  )
  const titleEl = (
    <h2 className="font-cinzel text-3xl md:text-4xl text-bronce tracking-wider">
      {title}
    </h2>
  )
  const subtitleEl = subtitle ? (
    <p className="font-editorial text-xl text-dorado mt-3">{subtitle}</p>
  ) : null

  if (!animate) {
    return (
      <div className={`text-center ${className}`}>
        {eyebrowEl}
        {titleEl}
        {subtitleEl}
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <Reveal>{eyebrowEl}</Reveal>
      <Reveal variant="title">{titleEl}</Reveal>
      {subtitleEl && <Reveal>{subtitleEl}</Reveal>}
    </div>
  )
}
