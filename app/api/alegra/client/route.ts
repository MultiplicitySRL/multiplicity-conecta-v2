import { NextRequest, NextResponse } from "next/server"
import { verifyAssessLink } from "@/lib/assess-link"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Solo lo que muestra /cotizar-por-pruebas: nunca el contacto completo de Alegra (RNC, dirección, teléfonos).
type AlegraContact = {
  id?: string | number
  name?: string
  email?: string | null
  defaultInvoiceResolution?: unknown
  address?: { country?: string | null } | null
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const clientId = params.get("client_id")
  if (!clientId) {
    return NextResponse.json({ error: "missing_client_id" }, { status: 400 })
  }
  if (!verifyAssessLink(clientId, params.get("exp"), params.get("sig"))) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 403 })
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
  if (!upstream.ok) {
    return NextResponse.json({ error: "upstream_error" }, { status: upstream.status })
  }

  const data = (await upstream.json().catch(() => null)) as AlegraContact | null
  if (!data) return NextResponse.json(null)
  return NextResponse.json({
    id: data.id,
    name: data.name,
    email: data.email ?? null,
    defaultInvoiceResolution: data.defaultInvoiceResolution ?? null,
    address: { country: data.address?.country ?? null },
  })
}
