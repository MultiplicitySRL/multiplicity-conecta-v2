/**
 * Landing CMS - Contenido dinámico de la página principal
 * Mismo patrón que resources-cms-v3.ts
 */

export interface LandingItem {
  id: string
  mostrar: boolean
  orden: number
  seccion: string
  subseccion: string
  titulo: string
  descripcion: string
  texto_boton: string
  tipo: string // "Sección", "Link", "PDF", "Video", "Email", "Decorativo"
  url_video_youtube: string
  url_archivo: string
  imagen: string
  notas: string
  color: string
}

const LANDING_CSV_URL =
  "https://werhxhxexqboowzutevv.supabase.co/functions/v1/prospecto-csv"

/**
 * Parse CSV a array de LandingItem (RFC 4180: soporta campos entrecomillados con saltos de línea)
 */
function parseLandingCSV(csv: string): LandingItem[] {
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

  // Encontrar el índice de la fila de cabecera (ID, MOSTRAR, ORDEN)
  let headerIndex = -1
  for (let r = 0; r < rows.length; r++) {
    const firstCells = rows[r].slice(0, 3).join(" ")
    if (firstCells.includes("ID") && firstCells.includes("MOSTRAR") && firstCells.includes("ORDEN")) {
      headerIndex = r
      break
    }
  }

  if (headerIndex === -1) {
    console.error("No se encontraron los headers en el CSV de landing")
    return []
  }

  const items: LandingItem[] = []

  for (let r = headerIndex + 1; r < rows.length; r++) {
    const values = rows[r]
    if (values.length === 0) continue

    // ID,MOSTRAR,ORDEN,SECCIÓN,PASO,SUBSECCIÓN,TÍTULO,DESCRIPCIÓN,TEXTO BOTÓN,TIPO,URL VIDEO,URL ARCHIVO,IMAGEN,NOTAS,COLOR
    const item: LandingItem = {
      id: values[0] || "",
      mostrar: values[1] === "SÍ" || values[1] === "SI" || values[1] === "YES",
      orden: parseInt(values[2]) || 0,
      seccion: values[3] || "",
      subseccion: values[5] || "",
      titulo: values[6] || "",
      descripcion: values[7] || "",
      texto_boton: values[8] || "",
      tipo: values[9] || "",
      url_video_youtube: values[10] || "",
      url_archivo: values[11] || "",
      imagen: values[12] || "",
      notas: values[13] || "",
      color: values[14] || "",
    }

    if (item.mostrar && item.titulo) {
      items.push(item)
    }
  }

  return items
}

/**
 * Fetch ítems de landing desde el CSV
 * Sin caché - siempre carga datos frescos
 */
export async function fetchLandingData(): Promise<LandingItem[]> {
  const csvUrl = LANDING_CSV_URL

  if (!csvUrl) {
    console.error("LANDING_CSV_URL no configurada")
    return []
  }

  try {
    const separator = csvUrl.includes("?") ? "&" : "?"
    const url = `${csvUrl}${separator}_=${Date.now()}`

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching landing data: ${response.status}`)
    }

    const csv = await response.text()
    const items = parseLandingCSV(csv)

    return items.sort((a, b) => a.orden - b.orden)
  } catch (error) {
    console.error("Error fetching landing data:", error)
    return []
  }
}

/**
 * Verificar si un ítem es una sección (header)
 */
export function isLandingSection(item: LandingItem): boolean {
  return item.tipo === "Sección" || item.tipo === "Seccion"
}

/**
 * Obtener ítems por sección
 */
export function getItemsBySection(items: LandingItem[], seccion: string): LandingItem[] {
  return items.filter((i) => i.seccion.includes(seccion))
}

/**
 * Obtener el header (tipo Sección) de una sección
 */
export function getSectionHeader(items: LandingItem[], seccion: string): LandingItem | undefined {
  return items.find((i) => i.seccion.includes(seccion) && isLandingSection(i))
}

/**
 * Obtener los ítems (no-sección) de una sección
 */
export function getSectionItems(items: LandingItem[], seccion: string): LandingItem[] {
  return items.filter((i) => i.seccion.includes(seccion) && !isLandingSection(i))
}
