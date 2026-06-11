// Encabezado de sección reutilizable: eyebrow con líneas + título + subtítulo
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  lineClass = 'bg-arena',
  className = 'mb-14',
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className={`h-px w-12 ${lineClass}`} />
        <span className="font-inter text-xs tracking-[0.3em] uppercase text-dorado">
          {eyebrow}
        </span>
        <div className={`h-px w-12 ${lineClass}`} />
      </div>
      <h2 className="font-cinzel text-3xl md:text-4xl text-bronce tracking-wider">
        {title}
      </h2>
      {subtitle && (
        <p className="font-editorial text-xl text-dorado mt-3">{subtitle}</p>
      )}
    </div>
  )
}
