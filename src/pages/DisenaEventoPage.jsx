import { useReducer, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, History, RotateCcw } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoCotizador } from '../config/seo'
import { useCotizador } from '../hooks/useCotizador'
import COTIZADOR from '../data/cotizador.json'
import StepProgress from '../components/cotizador/StepProgress'
import OptionCard from '../components/cotizador/OptionCard'
import MobiliarioStep from '../components/cotizador/MobiliarioStep'
import ResumenCotizacion from '../components/cotizador/ResumenCotizacion'

const PASOS = COTIZADOR.pasos
const MIN_DIAS = PASOS[0].minDiasAnticipacion ?? 3

// Fecha local en formato YYYY-MM-DD (sin desfase de zona horaria)
function fechaISO(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

export default function DisenaEventoPage() {
  usePageMeta(seoCotizador())
  const {
    estado,
    elegirUnica,
    alternarMultiple,
    setFecha,
    siguiente,
    anterior,
    completar,
    modificar,
    reanudarPendiente,
    continuar,
    empezarDeNuevo,
  } = useCotizador()

  // El `min` del input de fecha es un valor solo-cliente: empieza vacío
  // (igual al HTML prerenderizado) y se calcula tras montar. Se usa
  // useReducer en vez de useState para no incurrir en setState dentro de
  // useEffect (AJUSTE B); el reducer ignora la acción y deriva la fecha.
  const [minFecha, calcularMinFecha] = useReducer(() => {
    const d = new Date()
    d.setDate(d.getDate() + MIN_DIAS)
    return fechaISO(d)
  }, '')
  useEffect(() => {
    calcularMinFecha()
  }, [])

  // Scroll al inicio del flujo al cambiar de paso (mejor UX en móvil).
  // Se salta el primer render para no robar el scroll inicial de la ruta.
  const topRef = useRef(null)
  const primerRenderRef = useRef(true)
  useEffect(() => {
    if (primerRenderRef.current) {
      primerRenderRef.current = false
      return
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [estado.pasoActual, estado.completado])

  const paso = PASOS[estado.pasoActual]
  const esUltimo = estado.pasoActual === PASOS.length - 1

  const fechaValida = Boolean(estado.fecha) && (!minFecha || estado.fecha >= minFecha)
  const fechaConError = Boolean(estado.fecha) && Boolean(minFecha) && estado.fecha < minFecha

  function pasoValido() {
    if (paso.incluyeFecha) return Boolean(estado.tipo) && fechaValida
    if (paso.seleccion === 'unica' && paso.requerido) return Boolean(estado[paso.id])
    return true // pasos de selección múltiple u opcionales: siempre se puede avanzar
  }

  function seleccionada(opcionId) {
    if (paso.seleccion === 'multiple') return estado[paso.id].includes(opcionId)
    return estado[paso.id] === opcionId
  }

  function elegir(opcionId) {
    if (paso.seleccion === 'multiple') alternarMultiple(paso.id, opcionId)
    else elegirUnica(paso.id, opcionId)
  }

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-crema min-h-screen">
      <div ref={topRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        {/* Prompt para reanudar un diseño guardado */}
        {reanudarPendiente ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-arena shadow-sm p-8 text-center animate-paso">
            <History size={40} className="text-dorado mx-auto mb-4" />
            <h1 className="font-cinzel text-2xl text-bronce tracking-wide mb-2">
              Tienes un diseño en progreso
            </h1>
            <p className="font-inter text-sm text-dorado/80 mb-8">
              Guardamos lo que habías elegido. ¿Quieres continuar donde quedaste o empezar uno nuevo?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={continuar}
                className="w-full bg-coral hover:bg-[#c4614a] text-white font-inter text-sm tracking-widest uppercase py-3.5 rounded-full transition-colors"
              >
                Continuar donde quedé
              </button>
              <button
                type="button"
                onClick={empezarDeNuevo}
                className="w-full flex items-center justify-center gap-2 text-dorado hover:text-coral font-inter text-sm tracking-wider uppercase py-2 transition-colors"
              >
                <RotateCcw size={15} />
                Empezar de nuevo
              </button>
            </div>
          </div>
        ) : estado.completado ? (
          <ResumenCotizacion
            estado={estado}
            onModificar={modificar}
            onToggleComplemento={(id) => alternarMultiple('complementos', id)}
          />
        ) : (
          <>
            {/* Intro */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 font-inter text-xs tracking-[0.3em] uppercase text-coral mb-3">
                <Sparkles size={14} /> Diseña Tu Evento
              </span>
              <h1 className="font-cinzel text-3xl md:text-4xl text-bronce tracking-wider">
                Crea tu cotización a la medida
              </h1>
            </div>

            <StepProgress pasoActual={estado.pasoActual} total={PASOS.length} />

            {/* Contenido del paso (re-monta para reproducir la transición) */}
            <div key={estado.pasoActual} className="animate-paso">
              <div className="text-center mb-8">
                <span className="font-inter text-xs tracking-[0.3em] uppercase text-dorado">
                  {paso.eyebrow}
                </span>
                <h2 className="font-cinzel text-2xl md:text-3xl text-bronce tracking-wide mt-2">
                  {paso.titulo}
                </h2>
                {paso.subtitulo && (
                  <p className="font-editorial text-lg text-dorado mt-2">{paso.subtitulo}</p>
                )}
              </div>

              {/* Selector de fecha (solo paso 1) */}
              {paso.incluyeFecha && (
                <div className="max-w-md mx-auto mb-8 bg-white rounded-2xl border border-arena shadow-sm p-5">
                  <label
                    htmlFor="fecha-evento"
                    className="block font-inter text-sm text-bronce mb-2"
                  >
                    Fecha del evento
                  </label>
                  <input
                    id="fecha-evento"
                    type="date"
                    value={estado.fecha}
                    min={minFecha || undefined}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full bg-crema border border-arena rounded-lg px-3 py-2.5 font-inter text-sm text-bronce focus:outline-none focus:border-dorado transition-colors"
                  />
                  <p
                    className={`font-inter text-xs mt-2 ${
                      fechaConError ? 'text-coral' : 'text-dorado/60'
                    }`}
                  >
                    {fechaConError
                      ? `Elige una fecha con al menos ${MIN_DIAS} días de anticipación.`
                      : `Mínimo ${MIN_DIAS} días de anticipación.`}
                  </p>
                </div>
              )}

              {/* Catálogo real de mobiliario/decoración (paso "mobiliario"),
                  o la grilla genérica de tarjetas para el resto de pasos. */}
              {paso.tipoContenido === 'catalogo' ? (
                <MobiliarioStep
                  seleccionados={estado.mobiliario}
                  onToggle={(id) => alternarMultiple('mobiliario', id)}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paso.opciones.map((opcion) => (
                    <OptionCard
                      key={opcion.id}
                      opcion={opcion}
                      seleccionada={seleccionada(opcion.id)}
                      onClick={() => elegir(opcion.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Navegación */}
            <div className="flex items-center justify-between gap-4 mt-10">
              <button
                type="button"
                onClick={anterior}
                disabled={estado.pasoActual === 0}
                className="flex items-center gap-2 font-inter text-sm tracking-wider uppercase text-bronce hover:text-coral transition-colors disabled:opacity-0 disabled:pointer-events-none"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>

              <button
                type="button"
                onClick={esUltimo ? completar : siguiente}
                disabled={!pasoValido()}
                className="flex items-center gap-2 bg-coral hover:bg-[#c4614a] text-white font-inter text-sm tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {esUltimo ? 'Ver resumen' : 'Siguiente'}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
