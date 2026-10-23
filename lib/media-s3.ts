// Archivos del contenido en S3 (Misión Admin Único).
// El bucket es privado: el sitio los sirve por /media/<clave> leyendo S3 desde el servidor.
// Credenciales SIEMPRE explícitas (S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY,
// solo servidor). Solo se sirven claves bajo cms/; nunca archivo/ (respaldos).
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"

const PUBLIC_PREFIX = "cms/"
const CACHE = "public, max-age=31536000, s-maxage=31536000, immutable"

let client: S3Client | null = null

function getClient(): { client: S3Client; bucket: string } | null {
  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  if (!bucket || !region || !accessKeyId || !secretAccessKey) return null
  client ??= new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
  return { client, bucket }
}

/** Clave S3 a partir de los segmentos de /media/[...key]; null si sale de cms/ o es sospechosa. */
export function keyFromSegments(segments: string[]): string | null {
  if (!segments?.length) return null
  const parts = segments.map((s) => {
    try {
      return decodeURIComponent(s)
    } catch {
      return ""
    }
  })
  if (parts.some((p) => !p || p === "." || p === ".." || p.includes("/") || p.includes("\\"))) return null
  const key = parts.join("/")
  return key.startsWith(PUBLIC_PREFIX) ? key : null
}

export async function serveMedia(request: Request, segments: string[]): Promise<Response> {
  const key = keyFromSegments(segments)
  if (!key) return new Response("No encontrado", { status: 404 })
  const s3 = getClient()
  if (!s3) return new Response("Almacenamiento no configurado", { status: 503 })

  try {
    const range = request.headers.get("range") ?? undefined
    const obj = await s3.client.send(new GetObjectCommand({ Bucket: s3.bucket, Key: key, Range: range }))
    const headers = new Headers({
      "Content-Type": obj.ContentType ?? "application/octet-stream",
      "Cache-Control": CACHE,
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
    })
    if (obj.ContentLength != null) headers.set("Content-Length", String(obj.ContentLength))
    if (obj.ETag) headers.set("ETag", obj.ETag)
    if (obj.LastModified) headers.set("Last-Modified", obj.LastModified.toUTCString())
    if (obj.ContentDisposition) headers.set("Content-Disposition", obj.ContentDisposition)
    if (obj.ContentRange) headers.set("Content-Range", obj.ContentRange)
    return new Response(obj.Body?.transformToWebStream() ?? null, { status: obj.ContentRange ? 206 : 200, headers })
  } catch (err) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
    if (status === 404 || status === 403) return new Response("No encontrado", { status: 404 })
    if (status === 416) return new Response("Rango no válido", { status: 416 })
    console.error("[media] error leyendo S3", key, err)
    return new Response("Error leyendo el archivo", { status: 502 })
  }
}
