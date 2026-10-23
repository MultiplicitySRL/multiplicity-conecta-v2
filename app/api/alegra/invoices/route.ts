import { NextRequest, NextResponse } from "next/server"
import { verifyAssessLink } from "@/lib/assess-link"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Solo los campos que muestra /cotizar-por-pruebas: nada de ítems, observaciones ni datos del contacto.
type AlegraInvoice = {
  id?: string | number
  date?: string
  dueDate?: string
  status?: string
  subtotal?: number
  discount?: number
  tax?: number
  total?: number
  totalPaid?: number
  balance?: number
  client?: { id?: string | number; name?: string } | null
  numberTemplate?: { fullNumber?: string; formattedNumber?: string; prefix?: string; number?: string } | null
  currency?: { code?: string; symbol?: string | null; exchangeRate?: string | number } | null
}

function slim(inv: AlegraInvoice) {
  return {
    id: inv.id,
    date: inv.date,
    dueDate: inv.dueDate,
    status: inv.status,
    subtotal: inv.subtotal,
    discount: inv.discount,
    tax: inv.tax,
    total: inv.total,
    totalPaid: inv.totalPaid,
    balance: inv.balance,
    client: { id: inv.client?.id, name: inv.client?.name },
    numberTemplate: inv.numberTemplate
      ? {
          fullNumber: inv.numberTemplate.fullNumber,
          formattedNumber: inv.numberTemplate.formattedNumber,
          prefix: inv.numberTemplate.prefix,
          number: inv.numberTemplate.number,
        }
      : undefined,
    currency: inv.currency
      ? { code: inv.currency.code, symbol: inv.currency.symbol ?? null, exchangeRate: inv.currency.exchangeRate }
      : undefined,
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const clientId = params.get("client_id")
  if (!clientId) {
    return NextResponse.json([], { status: 200 })
  }
  if (!verifyAssessLink(clientId, params.get("exp"), params.get("sig"))) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 403 })
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

  const data = (await upstream.json().catch(() => null)) as AlegraInvoice | AlegraInvoice[] | null
  const list = Array.isArray(data) ? data : data ? [data] : []
  return NextResponse.json(list.map(slim))
}
