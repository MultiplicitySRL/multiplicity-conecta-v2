import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const N8N_RECEIVE_LEAD_URL =
  "https://n8n.srv1464241.hstgr.cloud/webhook/receive-lead"
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

/**
 * POST /api/leads
 * Recibe el body de un formulario externo y lo reenvía por POST al webhook de n8n.
 */
export async function POST(request: NextRequest) {
  const cors = corsHeaders(request)

  try {
    const incomingType =
      request.headers.get("content-type") ?? "application/json"
    const bodyBuffer = await request.arrayBuffer()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let upstream: Response
    try {
      upstream = await fetch(N8N_RECEIVE_LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": incomingType,
        },
        body: bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    const upstreamText = await upstream.text()
    const upstreamContentType = upstream.headers.get("content-type")

    return new NextResponse(upstreamText, {
      status: upstream.status,
      headers: {
        ...cors,
        ...(upstreamContentType
          ? { "Content-Type": upstreamContentType }
          : {}),
        "Cache-Control": "no-store",
      },
    })
  } catch (err: unknown) {
    const isAbort =
      err instanceof Error && err.name === "AbortError"
    console.error("/api/leads:", err)
    return NextResponse.json(
      {
        ok: false,
        error: isAbort ? "timeout" : "proxy_error",
        message: isAbort
          ? "Tiempo de espera agotado al contactar n8n"
          : "No se pudo reenviar el lead",
      },
      {
        status: isAbort ? 504 : 502,
        headers: { ...cors, "Cache-Control": "no-store" },
      },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}
