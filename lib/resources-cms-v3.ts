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
}

const GOOGLE_SHEET_CSV_URL =
  "https://werhxhxexqboowzutevv.supabase.co/functions/v1/resources-csv"

/**
 * Parse CSV V3 a array de objetos
 */
function parseCSVv3(csv: string): ResourceV3[] {
  const lines = csv.split("\n")
  
  // Encontrar la línea de headers (después de las instrucciones)
  let headerIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("MOSTRAR") && lines[i].includes("ORDEN")) {
      headerIndex = i
      break
    }
  }

  if (headerIndex === -1) {
    console.error("No se encontraron los headers en el CSV")
    return []
  }

  const resources: ResourceV3[] = []

  // Procesar filas de datos (después del header)
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Parse CSV considerando comillas
    const values: string[] = []
    let currentValue = ""
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const nextChar = line[j + 1]

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentValue += '"'
          j++
        } else {
          insideQuotes = !insideQuotes
        }
      } else if (char === "," && !insideQuotes) {
        values.push(currentValue.trim())
        currentValue = ""
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    // Mapear a ResourceV3
    // MOSTRAR,ORDEN,SECCIÓN,PASO,SUBSECCIÓN,TÍTULO,DESCRIPCIÓN,TEXTO BOTÓN,TIPO,URL VIDEO,URL ARCHIVO,IMAGEN,NOTAS
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
    }

    // Solo agregar recursos activos y con título
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
