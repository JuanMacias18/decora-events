// ─── Íconos + labels cortos de las categorías (#catalogo) ──────
// Set de 5 SVG inline de una misma familia visual (stroke 1.7, currentColor,
// caps/joins redondeados) para los tiles del filtro de catálogo. Usan
// currentColor para invertir a blanco en el tile activo (sobre coral).
// Las clases `tile-ico tile-ico--*` activan las micro-animaciones definidas
// en src/index.css (hover/focus + idle sutil en el activo; respetan
// prefers-reduced-motion).
//
// Los `label` son etiquetas CORTAS de DISPLAY. Los nombres reales de
// categoría (para filtrar y SEO) siguen en src/data/categorias.json y NO
// se tocan.

// Cumpleaños → globo con nudo y cuerdita.
function BalloonIcon() {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="tile-ico tile-ico--float w-7 h-7"
    >
      <ellipse cx="12" cy="8.5" rx="5" ry="6" />
      <path d="M10.6 13.9l1.4 1.7 1.4-1.7" />
      <path d="M12 15.6c0 1.3 1.3 1.6 1.3 2.9 0 1.1-1.3 1.4-1.3 2.5" />
    </svg>
  )
}

// 15 Años → corona (SVG) sobre el "15" en TEXTO real (escala nítido).
// Solo la corona lleva la animación (wiggle); el "15" queda estático.
function QuinceIcon() {
  return (
    <span className="flex w-7 h-7 flex-col items-center justify-center gap-0.5">
      <svg
        viewBox="0 0 24 13" fill="none" stroke="currentColor" strokeWidth="1.9"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        className="tile-ico tile-ico--wiggle h-[11px] w-auto"
      >
        <path d="M3.5 11 5 4.4l3.4 3.2L12 3l3.6 4.6L19 4.4 20.5 11Z" />
      </svg>
      <span className="font-cinzel text-[12px] font-bold leading-none">15</span>
    </span>
  )
}

// Baby Shower → biberón (tetina, anillo, cuerpo, marcas de nivel).
function BottleIcon() {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="tile-ico tile-ico--tilt w-7 h-7"
    >
      <path d="M10.7 3.2h2.6l-.3 1.5h-2z" />
      <rect x="9.3" y="5.5" width="5.4" height="2.2" rx="0.7" />
      <path d="M9.8 7.7h4.4v8.9a2.2 2.2 0 0 1-4.4 0z" />
      <path d="M10.4 11h1.8M10.4 13h1.8" />
    </svg>
  )
}

// Bautizo → gota de agua con una cruz pequeña dentro.
function DropletIcon() {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="tile-ico tile-ico--ripple w-7 h-7"
    >
      <path d="M12 3.3s-5.2 5.7-5.2 9.5a5.2 5.2 0 0 0 10.4 0C17.2 9 12 3.3 12 3.3Z" />
      <path d="M12 10.2v4.4M9.8 12.4h4.4" />
    </svg>
  )
}

// Grado → birrete (mortarboard) con borla + diploma (rollo).
function GradIcon() {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="tile-ico tile-ico--bob w-7 h-7"
    >
      <path d="M12 3.6 2.8 7.2 12 10.8l9.2-3.6L12 3.6Z" />
      <path d="M6.8 8.9v3.4c0 1.4 2.3 2.4 5.2 2.4s5.2-1 5.2-2.4V8.9" />
      <path d="M21.2 7.2v3.6" />
      <circle cx="21.2" cy="11.2" r="0.95" fill="currentColor" stroke="none" />
      <rect x="7.6" y="16.6" width="8.8" height="2.6" rx="1.3" />
      <path d="M9.4 17.9h5.2" />
    </svg>
  )
}

// Map id de categoría → { label corto, componente de ícono }.
export const CATEGORY_VISUALS = {
  cumpleanos: { label: 'Cumpleaños', Icon: BalloonIcon },
  quince: { label: '15 Años', Icon: QuinceIcon },
  babyshower: { label: 'Baby Shower', Icon: BottleIcon },
  bautizo: { label: 'Bautizo', Icon: DropletIcon },
  grado: { label: 'Grado', Icon: GradIcon },
}
