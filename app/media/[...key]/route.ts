// GET /media/<clave> — imágenes y documentos del contenido, guardados en S3 (bucket privado).
// Las claves llevan el hash del archivo: el contenido de una URL nunca cambia y se cachea un año.
import { serveMedia } from "@/lib/media-s3"

export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  return serveMedia(request, key)
}
