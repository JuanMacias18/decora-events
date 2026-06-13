import { useReducer, useEffect, useRef, useMemo } from 'react'
import COTIZADOR from '../data/cotizador.json'

// ─── Estado del cotizador "Diseña Tu Evento" ──────────────────
// Maneja las respuestas de los 5 pasos y su persistencia en
// localStorage para "continuar donde quedó".
//
// Hidratación (AJUSTE B): la ruta /disena-tu-evento se prerenderiza,
// así que el estado inicial es SIEMPRE el vacío (igual al HTML del
// servidor). Lo guardado se carga en un efecto tras montar, sin pisar
// localStorage con el estado vacío — mismo patrón que CartContext.

const STORAGE_KEY = 'decora-events-cotizador'
const PASOS = COTIZADOR.pasos

// IDs vigentes por paso: descarta del localStorage opciones corruptas
// o de versiones anteriores del catálogo de opciones.
const IDS_POR_PASO = Object.fromEntries(
  PASOS.map((p) => [p.id, new Set(p.opciones.map((o) => o.id))])
)

const ESTADO_VACIO = {
  pasoActual: 0,
  completado: false,
  tipo: null,
  fecha: '',
  fondo: null,
  globos: null,
  mobiliario: [],
  pasteleria: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...ESTADO_VACIO, ...action.estado }
    case 'SET_UNICA': // tipo / fondo / globos
      return { ...state, [action.paso]: action.id }
    case 'SET_FECHA':
      return { ...state, fecha: action.fecha }
    case 'TOGGLE_MULTIPLE': {
      // mobiliario / pasteleria
      const actuales = state[action.paso]
      const next = actuales.includes(action.id)
        ? actuales.filter((x) => x !== action.id)
        : [...actuales, action.id]
      return { ...state, [action.paso]: next }
    }
    case 'SIGUIENTE':
      return { ...state, pasoActual: Math.min(state.pasoActual + 1, PASOS.length - 1) }
    case 'ANTERIOR':
      return { ...state, completado: false, pasoActual: Math.max(state.pasoActual - 1, 0) }
    case 'COMPLETAR':
      return { ...state, completado: true }
    case 'MODIFICAR':
      return { ...state, completado: false, pasoActual: 0 }
    case 'REINICIAR':
      return { ...ESTADO_VACIO }
    default:
      return state
  }
}

// Limpia un estado parseado del localStorage: solo conserva ids válidos.
function sanear(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  return {
    pasoActual: Number.isInteger(parsed.pasoActual)
      ? Math.min(Math.max(parsed.pasoActual, 0), PASOS.length - 1)
      : 0,
    completado: parsed.completado === true,
    tipo: IDS_POR_PASO.tipo.has(parsed.tipo) ? parsed.tipo : null,
    fecha: typeof parsed.fecha === 'string' ? parsed.fecha : '',
    fondo: IDS_POR_PASO.fondo.has(parsed.fondo) ? parsed.fondo : null,
    globos: IDS_POR_PASO.globos.has(parsed.globos) ? parsed.globos : null,
    mobiliario: Array.isArray(parsed.mobiliario)
      ? parsed.mobiliario.filter((id) => IDS_POR_PASO.mobiliario.has(id))
      : [],
    pasteleria: Array.isArray(parsed.pasteleria)
      ? parsed.pasteleria.filter((id) => IDS_POR_PASO.pasteleria.has(id))
      : [],
  }
}

function hayProgreso(s) {
  return Boolean(
    s.tipo || s.fondo || s.globos || s.mobiliario.length || s.pasteleria.length || s.completado
  )
}

// Devuelve el estado guardado solo si tiene progreso real; si no, null.
function cargarGuardado() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saneado = sanear(JSON.parse(raw))
    return saneado && hayProgreso(saneado) ? saneado : null
  } catch {
    return null
  }
}

export function useCotizador() {
  const [estado, dispatch] = useReducer(reducer, ESTADO_VACIO)
  const hidratadoRef = useRef(false)
  const guardadoRef = useRef(null)
  // Cuando hay un diseño guardado, se ofrece reanudar antes de mostrar el flujo.
  // Se usa useReducer (no useState) para poder fijarlo desde el efecto de
  // hidratación sin caer en setState-dentro-de-useEffect (AJUSTE B).
  const [reanudarPendiente, marcarReanudar] = useReducer((_, valor) => valor, false)

  useEffect(() => {
    // Primera ejecución tras montar: cargar lo guardado. Si hay progreso,
    // NO escribir todavía (no pisar lo guardado con el estado vacío);
    // se ofrece reanudar y se espera la decisión del usuario.
    if (!hidratadoRef.current) {
      hidratadoRef.current = true
      const saved = cargarGuardado()
      if (saved) {
        guardadoRef.current = saved
        marcarReanudar(true)
        return
      }
    }
    if (reanudarPendiente) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
    } catch {
      // modo privado o almacenamiento lleno: el cotizador sigue en memoria
    }
  }, [estado, reanudarPendiente])

  const acciones = useMemo(
    () => ({
      elegirUnica: (paso, id) => dispatch({ type: 'SET_UNICA', paso, id }),
      alternarMultiple: (paso, id) => dispatch({ type: 'TOGGLE_MULTIPLE', paso, id }),
      setFecha: (fecha) => dispatch({ type: 'SET_FECHA', fecha }),
      siguiente: () => dispatch({ type: 'SIGUIENTE' }),
      anterior: () => dispatch({ type: 'ANTERIOR' }),
      completar: () => dispatch({ type: 'COMPLETAR' }),
      modificar: () => dispatch({ type: 'MODIFICAR' }),
    }),
    []
  )

  function continuar() {
    if (guardadoRef.current) dispatch({ type: 'LOAD', estado: guardadoRef.current })
    marcarReanudar(false)
  }

  function empezarDeNuevo() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* sin acceso a localStorage: el estado en memoria ya está vacío */
    }
    dispatch({ type: 'REINICIAR' })
    marcarReanudar(false)
  }

  return { estado, ...acciones, reanudarPendiente, continuar, empezarDeNuevo }
}
