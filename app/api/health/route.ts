// GET /api/health — estado del sitio para el monitoreo (Misión EC2). Público y sin datos.
//   ?live=1    → solo «el proceso responde» (lo usa el vigilante local antes de reiniciar).
//   (sin nada) → el contenido del CMS se puede leer (sin usar el respaldo en memoria), con tope de 3 s.
// 200 si todo está bien; 503 si algo falla.
import { readCmsCsv } from "@/lib/cms-source"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" }
  if (new URL(request.url).searchParams.get("live") === "1") return Response.json({ ok: true }, { headers })
  const start = Date.now()
  let ok = false
  try {
    const csv = await readCmsCsv("prospecto-csv", 3000)
    ok = csv.startsWith("ID,MOSTRAR,ORDEN") && csv.split("\n").length > 1
  } catch {
    ok = false
  }
  return Response.json({ ok, checks: { content: { ok, ms: Date.now() - start } } }, { status: ok ? 200 : 503, headers })
}
