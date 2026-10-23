import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// La calculadora de /cotizar-por-pruebas envía aquí la solicitud de factura; el servidor del sitio la reenvía al CRM
// con su token. Antes el navegador llamaba al CRM directo y el token iba dentro del JS público.
const MAX_BODY_BYTES = 512 * 1024

export async function POST(request: NextRequest) {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL
  const token = process.env.WEBHOOK_TOKEN
  if (!crmUrl || !token) {
    console.error("/api/invoice-requests: CRM env vars not configured")
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  const body = await request.text()
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  const upstream = await fetch(`${crmUrl}/api/invoice-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  }).catch((err) => {
    console.error("/api/invoice-requests fetch error:", err)
    return null
  })

  if (!upstream) {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 })
  }

  const responseBody = await upstream.text()
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  })
}
