/**
 * Cliente CMS V3 - Simplificado
 * Lee el nuevo formato de CSV optimizado para usuarios
 */

export interface ResourceV3 {
  // Control
  mostrar: boolean
  orden: number

  // Organización
  seccion: string
  paso: string
  subseccion: string

  // Contenido
  titulo: string
  descripcion: string
  texto_boton: string

  // Tipo
  tipo: string // "Video", "PDF", "Excel", "PowerPoint", "Link", "Sección"

  // URLs
  url_video_youtube: string
  url_archivo: string
  imagen: string

  // Notas
  notas: string
  
  // Estilo
  color: string // "azul", "rosa", o vacío
}

const GOOGLE_SHEET_CSV_URL =
  "https://werhxhxexqboowzutevv.supabase.co/functions/v1/resources-csv"

/**
 * Parse CSV V3 a array de objetos (RFC 4180: soporta campos entrecomillados con saltos de línea)
 */
function parseCSVv3(csv: string): ResourceV3[] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentValue = ""
  let insideQuotes = false

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]
    const nextChar = csv[i + 1]

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentValue += '"'
        i++
      } else if (char === '"') {
        insideQuotes = false
      } else {
        currentValue += char
      }
      continue
    }

    // Fuera de comillas
    if (char === '"') {
      insideQuotes = true
    } else if (char === ",") {
      currentRow.push(currentValue.trim())
      currentValue = ""
    } else if (char === "\n") {
      currentRow.push(currentValue.trim())
      currentValue = ""
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow)
      }
      currentRow = []
    } else if (char === "\r") {
      if (nextChar === "\n") {
        i++
      }
      currentRow.push(currentValue.trim())
      currentValue = ""
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow)
      }
      currentRow = []
    } else {
      currentValue += char
    }
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue.trim())
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow)
    }
  }

  // Encontrar el índice de la fila de cabecera (MOSTRAR, ORDEN)
  let headerIndex = -1
  for (let r = 0; r < rows.length; r++) {
    const firstCells = rows[r].slice(0, 2).join(" ")
    if (firstCells.includes("MOSTRAR") && firstCells.includes("ORDEN")) {
      headerIndex = r
      break
    }
  }

  if (headerIndex === -1) {
    console.error("No se encontraron los headers en el CSV")
    return []
  }

  const resources: ResourceV3[] = []

  for (let r = headerIndex + 1; r < rows.length; r++) {
    const values = rows[r]
    if (values.length === 0) continue

    // MOSTRAR,ORDEN,SECCIÓN,PASO,SUBSECCIÓN,TÍTULO,DESCRIPCIÓN,TEXTO BOTÓN,TIPO,URL VIDEO,URL ARCHIVO,IMAGEN,NOTAS,COLOR
    const resource: ResourceV3 = {
      mostrar: values[0] === "SÍ" || values[0] === "SI" || values[0] === "YES",
      orden: parseInt(values[1]) || 0,
      seccion: values[2] || "",
      paso: values[3] || "",
      subseccion: values[4] || "",
      titulo: values[5] || "",
      descripcion: values[6] || "",
      texto_boton: values[7] || "",
      tipo: values[8] || "",
      url_video_youtube: values[9] || "",
      url_archivo: values[10] || "",
      imagen: values[11] || "",
      notas: values[12] || "",
      color: values[13] || "",
    }

    if (resource.mostrar && resource.titulo) {
      resources.push(resource)
    }
  }

  return resources
}

/**
 * Fetch recursos desde Google Sheets V3
 * Sin caché - siempre carga datos frescos
 */
export async function fetchResourcesV3(): Promise<ResourceV3[]> {
  try {
    // URL con cache-busting: cada petición es única (Next.js no puede cachear por URL)
    const separator = GOOGLE_SHEET_CSV_URL.includes("?") ? "&" : "?"
    const url = `${GOOGLE_SHEET_CSV_URL}${separator}_=${Date.now()}`

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching resources: ${response.status}`)
    }

    const csv = await response.text()
    const resources = parseCSVv3(csv)

    // Ordenar por campo orden
    return resources.sort((a, b) => a.orden - b.orden)
  } catch (error) {
    console.error("Error fetching resources from Google Sheets:", error)
    return []
  }
}

/**
 * Obtener recursos por sección
 */
export async function getResourcesBySection(section: string): Promise<ResourceV3[]> {
  const resources = await fetchResourcesV3()
  return resources.filter((r) => r.seccion.includes(section))
}

/**
 * Obtener recursos por paso
 */
export async function getResourcesByStep(step: string): Promise<ResourceV3[]> {
  const resources = await fetchResourcesV3()
  return resources.filter((r) => r.paso === step)
}

/**
 * Extrae el ID del video de YouTube desde una URL completa o devuelve el valor si ya es un ID.
 * Acepta: https://youtu.be/dQw4w9WgXcQ?si=..., https://www.youtube.com/watch?v=..., o "dQw4w9WgXcQ"
 */
export function getYouTubeVideoId(urlOrId: string): string {
  if (!urlOrId?.trim()) return ""
  const s = urlOrId.trim()
  // Ya es un ID (solo letras, números, guiones bajos; típicamente 11 caracteres)
  if (!s.includes("/") && !s.includes("?")) return s
  try {
    // youtu.be/VIDEO_ID
    const matchBe = s.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{10,12})(?:\?|$)/)
    if (matchBe) return matchBe[1]
    // youtube.com/watch?v=VIDEO_ID o youtube.com/embed/VIDEO_ID
    const url = new URL(s.startsWith("http") ? s : `https://${s}`)
    const v = url.searchParams.get("v")
    if (v) return v
    const pathId = url.pathname.split("/").filter(Boolean).pop()
    if (pathId && (url.hostname.includes("youtube") || url.hostname.includes("youtu.be"))) return pathId
  } catch {
    // Si falla el parse, devolver tal cual por si ya era un ID
  }
  return s
}

/**
 * Obtener URL de embed de YouTube desde URL completa o ID.
 */
export function getYouTubeEmbedUrl(urlOrId: string): string {
  const videoId = getYouTubeVideoId(urlOrId)
  if (!videoId) return ""
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Verificar si un recurso es una sección (header)
 */
export function isSection(resource: ResourceV3): boolean {
  return resource.tipo === "Sección" || resource.tipo === "Seccion"
}

/**
 * Verificar si un recurso es de tipo video
 */
export function isVideo(resource: ResourceV3): boolean {
  return resource.tipo === "Video" && !!resource.url_video_youtube
}

/**
 * Verificar si un recurso es descargable
 */
export function isDownloadable(resource: ResourceV3): boolean {
  const downloadTypes = ["PDF", "Excel", "PowerPoint"]
  return downloadTypes.includes(resource.tipo) && !!resource.url_archivo
}

/**
 * Verificar si un recurso es un link externo
 */
export function isExternalLink(resource: ResourceV3): boolean {
  return resource.tipo === "Link" && !!resource.url_archivo
}
