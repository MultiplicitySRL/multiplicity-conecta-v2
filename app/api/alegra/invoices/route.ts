import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("client_id")
  if (!clientId) {
    return NextResponse.json([], { status: 200 })
  }

  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL
  const token = process.env.WEBHOOK_TOKEN
  if (!crmUrl || !token) {
    console.error("/api/alegra/invoices: CRM env vars not configured")
    return NextResponse.json([], { status: 200 })
  }

  const upstream = await fetch(
    `${crmUrl}/api/public/alegra/invoices?client_id=${encodeURIComponent(clientId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  ).catch((err) => {
    console.error("/api/alegra/invoices fetch error:", err)
    return null
  })

  if (!upstream || !upstream.ok) {
    return NextResponse.json([], { status: 200 })
  }

  const body = await upstream.text()
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
