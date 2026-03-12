import { unstable_noStore } from "next/cache"
import { fetchLandingData } from "@/lib/landing-cms"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"

export async function GET() {
  unstable_noStore()

  try {
    const items = await fetchLandingData()
    const res = NextResponse.json(items)
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    res.headers.set("Vary", "*")
    return res
  } catch (error) {
    console.error("API landing:", error)
    return NextResponse.json([], { status: 500 })
  }
}
