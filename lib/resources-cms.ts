/**
 * Cliente para consumir recursos desde Google Sheets CMS
 */

export interface Resource {
  id: string
  orden: number
  activo: boolean
  paso: string
  titulo_paso: string
  seccion: string
  subseccion: string
  titulo: string
  descripcion: string
  texto_boton: string
  tipo_accion: string
  url_documento: string
  id_video_youtube: string
  imagen_miniatura: string
  etiquetas: string
  notas_internas: string
}

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYTQk9CmMLb0pEsjAot6shaKOXi_XcRUTTfb7j_msgGy1L9zREuU70KDBhtaLk1CQfZkXeKYLFI0IH/pub?gid=512848521&single=true&output=csv"

/**
 * Parse CSV a array de objetos
 */
function parseCSV(csv: string): Resource[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  const resources: Resource[] = []

  for (let i = 1; i < lines.length; i++) {
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
          // Comilla escapada
          currentValue += '"'
          j++ // Skip next quote
        } else {
          // Toggle quote mode
          insideQuotes = !insideQuotes
        }
      } else if (char === "," && !insideQuotes) {
        // End of field
        values.push(currentValue.trim())
        currentValue = ""
      } else {
        currentValue += char
      }
    }
    // Push last value
    values.push(currentValue.trim())

    // Mapear a Resource
    const resource: Resource = {
      id: values[0] || "",
      orden: parseInt(values[1]) || 0,
      activo: values[2] === "SÍ" || values[2] === "SI" || values[2] === "TRUE",
      paso: values[3] || "",
      titulo_paso: values[4] || "",
      seccion: values[5] || "",
      subseccion: values[6] || "",
      titulo: values[7] || "",
      descripcion: values[8] || "",
      texto_boton: values[9] || "",
      tipo_accion: values[10] || "",
      url_documento: values[11] || "",
      id_video_youtube: values[12] || "",
      imagen_miniatura: values[13] || "",
      etiquetas: values[14] || "",
      notas_internas: values[15] || "",
    }

    // Solo agregar recursos activos
    if (resource.activo && resource.id) {
      resources.push(resource)
    }
  }

  return resources
}

/**
 * Fetch recursos desde Google Sheets
 * Sin caché - siempre carga datos frescos
 */
export async function fetchResources(): Promise<Resource[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store", // No cachear, siempre fetch fresco
    })

    if (!response.ok) {
      throw new Error(`Error fetching resources: ${response.status}`)
    }

    const csv = await response.text()
    const resources = parseCSV(csv)

    // Ordenar por campo orden
    return resources.sort((a, b) => a.orden - b.orden)
  } catch (error) {
    console.error("Error fetching resources from Google Sheets:", error)
    // Retornar array vacío en caso de error
    return []
  }
}

/**
 * Obtener recursos por paso
 */
export async function getResourcesByStep(step: string): Promise<Resource[]> {
  const resources = await fetchResources()
  return resources.filter((r) => r.paso === step)
}

/**
 * Obtener recursos por sección
 */
export async function getResourcesBySection(section: string): Promise<Resource[]> {
  const resources = await fetchResources()
  return resources.filter((r) => r.seccion.includes(section))
}

/**
 * Obtener un recurso por ID
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  const resources = await fetchResources()
  return resources.find((r) => r.id === id) || null
}

/**
 * Obtener URL completa de video de YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  if (!videoId) return ""
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Verificar si un recurso es de tipo video
 */
export function isVideoResource(resource: Resource): boolean {
  return resource.tipo_accion === "Video Tutorial" && !!resource.id_video_youtube
}

/**
 * Verificar si un recurso es de tipo descarga
 */
export function isDownloadResource(resource: Resource): boolean {
  return (
    resource.tipo_accion.includes("Descargar") ||
    resource.tipo_accion === "Ver Documento"
  )
}
