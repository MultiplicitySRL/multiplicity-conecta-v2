import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("client_id")
  if (!clientId) {
    return NextResponse.json({ error: "missing_client_id" }, { status: 400 })
  }

  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL
  const token = process.env.WEBHOOK_TOKEN
  if (!crmUrl || !token) {
    console.error("/api/alegra/client: CRM env vars not configured")
    return NextResponse.json({ error: "server_misconfigured" }, { status: 503 })
  }

  const upstream = await fetch(
    `${crmUrl}/api/public/alegra/contact?client_id=${encodeURIComponent(clientId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  ).catch((err) => {
    console.error("/api/alegra/client fetch error:", err)
    return null
  })

  if (!upstream) {
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 503 })
  }

  const body = await upstream.text()
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  })
}
