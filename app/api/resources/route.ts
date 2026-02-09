import { unstable_noStore } from "next/cache"
import { fetchResourcesV3 } from "@/lib/resources-cms-v3"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"

export async function GET() {
  unstable_noStore()

  try {
    const resources = await fetchResourcesV3()
    const res = NextResponse.json(resources)
    // Evitar que navegador, CDN o proxy cacheen esta respuesta
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    res.headers.set("Vary", "*")
    return res
  } catch (error) {
    console.error("API resources:", error)
    return NextResponse.json([], { status: 500 })
  }
}
