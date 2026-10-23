// De dónde lee el sitio el contenido del CMS (Misión Admin Único → Misión EC2).
//
// Dos orígenes, el mismo CSV y el mismo parser:
//   · EC2: CMS_REST_URL (PostgREST local, p. ej. http://127.0.0.1:3002) + CMS_REST_KEY (JWT del rol
//     site_reader: solo lee los bloques visibles, sin notas internas). Tiene prioridad si está configurado.
//   · Funciones CSV: CMS_FUNCTIONS_BASE_URL; sin variable, las de siempre (blue-yachts2).
// Todas las variables son solo de servidor (nunca NEXT_PUBLIC_).
//
// Si el origen falla o tarda más de 8 s, se usa el último CSV bueno que este servidor recibió,
// en vez de dejar la página vacía.
import { buildCmsCsv, CMS_CSV_COLUMNS, type CmsCsvRow } from "./cms-csv"

const DEFAULT_BASE = "https://werhxhxexqboowzutevv.supabase.co/functions/v1"
const TIMEOUT_MS = 8000

type CmsFunction = "resources-csv" | "prospecto-csv"

const TABLE: Record<CmsFunction, string> = {
  "resources-csv": "cms_resources",
  "prospecto-csv": "cms_prospecto_resources",
}

const lastGood = new Map<CmsFunction, string>()

export function cmsFunctionUrl(name: CmsFunction): string {
  const base = (process.env.CMS_FUNCTIONS_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "")
  return `${base}/${name}`
}

/** Lee el contenido del origen configurado, sin caché ni respaldo (lo usan fetchCmsCsv y /api/health). */
export async function readCmsCsv(name: CmsFunction, timeoutMs = TIMEOUT_MS): Promise<string> {
  const restUrl = process.env.CMS_REST_URL
  const restKey = process.env.CMS_REST_KEY
  if (restUrl && restKey) {
    const select = CMS_CSV_COLUMNS.join(",")
    const url = `${restUrl.replace(/\/+$/, "")}/${TABLE[name]}?select=${select}&mostrar=eq.true&deleted_at=is.null&order=orden.asc,created_at.asc,id.asc`
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${restKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!response.ok) throw new Error(`Error fetching ${name} from PostgREST: ${response.status}`)
    return buildCmsCsv((await response.json()) as CmsCsvRow[])
  }

  const base = cmsFunctionUrl(name)
  const separator = base.includes("?") ? "&" : "?"
  // URL con cache-busting: cada petición es única (Next.js no puede cachear por URL)
  const url = `${base}${separator}_=${Date.now()}`
  const response = await fetch(url, {
    cache: "no-store",
    next: { revalidate: 0 },
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw new Error(`Error fetching ${name}: ${response.status}`)
  return response.text()
}

export async function fetchCmsCsv(name: CmsFunction): Promise<string> {
  try {
    const csv = await readCmsCsv(name)
    lastGood.set(name, csv)
    return csv
  } catch (error) {
    const fallback = lastGood.get(name)
    if (fallback) {
      console.error(`${name} falló; se usa el último contenido bueno:`, error)
      return fallback
    }
    throw error
  }
}
