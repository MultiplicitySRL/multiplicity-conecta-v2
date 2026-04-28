import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const REQUEST_TIMEOUT_MS = 20_000

function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get("origin")
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  }
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin
    headers["Vary"] = "Origin"
  } else {
    headers["Access-Control-Allow-Origin"] = "*"
  }
  return headers
}

function parseFields(data: Record<string, unknown>) {
  const str = (v: unknown) =>
    typeof v === "string" ? v.trim() : ""
  return {
    nombre: str(data["your-name"]),
    email: str(data["your-email"]),
    empresa: str(data["text-924"]),
    cargo: str(data["text-879"]),
    mensaje: str(data["your-message"]),
  }
}

export async function POST(request: NextRequest) {
  const cors = corsHeaders(request)

  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL
  const token = process.env.WEBHOOK_TOKEN
  if (!crmUrl || !token) {
    console.error("/api/leads: CRM env vars not configured")
    return NextResponse.json(
      { error: "server_error" },
      { status: 500, headers: { ...cors, "Cache-Control": "no-store" } },
    )
  }

  let raw: Record<string, unknown>
  try {
    const contentType = request.headers.get("content-type") ?? ""
    console.log("[/api/leads] content-type:", contentType)
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      raw = Object.fromEntries(params.entries())
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      raw = Object.fromEntries(formData.entries())
    } else {
      raw = await request.json()
    }
    console.log("[/api/leads] raw body keys:", Object.keys(raw))
  } catch (err) {
    console.error("[/api/leads] body parse error:", err)
    return NextResponse.json(
      { error: "invalid_body" },
      { status: 400, headers: { ...cors, "Cache-Control": "no-store" } },
    )
  }

  const { nombre, email, empresa, cargo, mensaje } = parseFields(raw)
  console.log("[/api/leads] mapped fields:", { nombre, email: email ? "[present]" : "[missing]", empresa, cargo, mensaje: mensaje ? "[present]" : "[missing]" })
  const missing = (
    [
      ["nombre", nombre],
      ["email", email],
      ["empresa", empresa],
      ["cargo", cargo],
      ["mensaje", mensaje],
    ] as [string, string][]
  )
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "missing_fields", required: missing },
      { status: 400, headers: { ...cors, "Cache-Control": "no-store" } },
    )
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  console.log("[/api/leads] forwarding to CRM:", `${crmUrl}/api/public/leads/register`)
  let upstream: Response
  try {
    upstream = await fetch(`${crmUrl}/api/public/leads/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, email, empresa, cargo, mensaje }),
      signal: controller.signal,
    })
  } catch (err) {
    console.error("/api/leads: upstream fetch error", err)
    return NextResponse.json(
      { error: "upstream_error" },
      { status: 502, headers: { ...cors, "Cache-Control": "no-store" } },
    )
  } finally {
    clearTimeout(timeoutId)
  }

  const responseBody = await upstream.text()
  console.log("[/api/leads] CRM response:", upstream.status, responseBody.slice(0, 200))
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}
