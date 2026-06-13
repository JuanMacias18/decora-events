// Barra de progreso del cotizador: "Paso X de N" + barra de avance.
export default function StepProgress({ pasoActual, total }) {
  const pct = Math.round(((pasoActual + 1) / total) * 100)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-inter text-xs tracking-[0.2em] uppercase text-dorado">
          Paso {pasoActual + 1} de {total}
        </span>
        <span className="font-inter text-xs text-dorado/60">{pct}%</span>
      </div>
      <div
        className="h-1.5 w-full bg-arena rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pasoActual + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Paso ${pasoActual + 1} de ${total}`}
      >
        <div
          className="h-full bg-coral rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
