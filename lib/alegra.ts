const ALEGRA_BASE = "https://api.alegra.com/api/v1"
const ALEGRA_EMAIL = "ingcarlosoficial@gmail.com"
const ALEGRA_TOKEN = ""

import { buildInvoicePayload } from "./alegra-invoice-payload"
import type { CreateInvoiceInput } from "./alegra-invoice-payload"

const auth = "Basic " + Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")

async function http(path: string, init: RequestInit = {}) {
  const res = await fetch(`${ALEGRA_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Alegra ${init.method || "GET"} ${path} ${res.status}: ${body}`)
  }
  return res.json()
}

async function ensureContact(c: {
  name: string
  email?: string
  identification?: string
  phone?: string
}): Promise<number> {
  try {
    const created = await http("/contacts", {
      method: "POST",
      body: JSON.stringify({
        name: c.name,
        email: c.email,
        identification: c.identification,
        phonePrimary: c.phone,
      }),
    })
    return created.id
  } catch (e: any) {
    // If contact already exists, try to find it
    // For now, rethrow the error
    throw e
  }
}

export async function createAndEmailAlegraInvoice(input: CreateInvoiceInput) {
  const contactId = await ensureContact(input.customer)
  const payload = buildInvoicePayload(input, contactId)

  // 1) Create invoice
  const invoice = await http("/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  // 2) Send by email
  const toEmail = input.emailToSend || input.customer.email
  if (!toEmail) throw new Error("No email available to send the invoice.")

  await http(`/invoices/${invoice.id}/email`, {
    method: "POST",
    body: JSON.stringify({
      emails: [toEmail],
      message: "¡Hola! Te compartimos tu factura. Gracias por su compra.",
    }),
  })

  return {
    invoiceId: invoice.id,
    number: invoice.number,
    email: toEmail,
  }
}
