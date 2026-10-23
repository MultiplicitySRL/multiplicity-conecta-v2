// Copia de crm/supabase/functions/_shared/cms-csv.ts (probada con vitest en el CRM). Mantener iguales.
// Contrato CSV que lee el sitio público (frontend/lib/resources-cms-v3.ts y landing-cms.ts).
// Mismo formato que las funciones originales de blue-yachts2: 15 columnas, mismo orden de
// columnas, «SÍ»/«NO» en MOSTRAR, filas separadas por \n y sin salto final.
// Diferencias deliberadas (Misión Admin Único):
//   · NOTAS sale vacía: son notas internas y el sitio no las usa.
//   · También se citan los valores con \r (antes podían romper el parseo).
// Puro: sin Deno ni red, para poder probarlo con vitest desde el CRM.

export const CMS_CSV_HEADERS = [
  "ID", "MOSTRAR", "ORDEN", "SECCIÓN", "PASO", "SUBSECCIÓN", "TÍTULO",
  "DESCRIPCIÓN", "TEXTO BOTÓN", "TIPO", "URL VIDEO (ID YouTube)",
  "URL ARCHIVO", "IMAGEN", "NOTAS", "COLOR",
] as const;

export const CMS_CSV_COLUMNS = [
  "id", "mostrar", "orden", "seccion", "paso", "subseccion", "titulo", "descripcion",
  "texto_boton", "tipo", "url_video_youtube", "url_archivo", "imagen", "color",
] as const;

export interface CmsCsvRow {
  id: string;
  mostrar: boolean;
  orden: number | null;
  seccion: string | null;
  paso: string | null;
  subseccion: string | null;
  titulo: string | null;
  descripcion: string | null;
  texto_boton: string | null;
  tipo: string | null;
  url_video_youtube: string | null;
  url_archivo: string | null;
  imagen: string | null;
  color: string | null;
}

export function escapeCsv(val: string): string {
  if (!val) return "";
  if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function buildCmsCsv(rows: CmsCsvRow[]): string {
  const lines = rows.map((r) =>
    [
      r.id || "",
      r.mostrar ? "SÍ" : "NO",
      String(r.orden || 0),
      r.seccion || "",
      r.paso || "",
      r.subseccion || "",
      r.titulo || "",
      r.descripcion || "",
      r.texto_boton || "",
      r.tipo || "",
      r.url_video_youtube || "",
      r.url_archivo || "",
      r.imagen || "",
      "",
      r.color || "",
    ].map(escapeCsv).join(","),
  );
  return [CMS_CSV_HEADERS.join(","), ...lines].join("\n");
}
