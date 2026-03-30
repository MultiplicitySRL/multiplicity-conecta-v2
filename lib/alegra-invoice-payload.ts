/**
 * Lógica pura para armar el payload de factura de Alegra.
 * Sin llamadas HTTP ni dependencias de Node; usable en cliente y servidor.
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export type AlegraItem = {
  id?: number
  name?: string
  price: number
  quantity: number
  discount?: number
  taxIds?: number[]
}

export type CreateInvoiceInput = {
  customer: {
    name: string
    email?: string
    identification?: string
    phone?: string
  }
  items: AlegraItem[]
  currency?: string
  exchangeRate?: number
  issueDate?: string
  dueDate?: string
  notes?: string
  terms?: string
  externalRef?: string
  emailToSend?: string
  companyType?: "local" | "international"
}

const DEFAULT_EXCHANGE_RATE = 61.0416

/**
 * Construye el payload para crear una factura en Alegra.
 * @param contactId - ID del contacto en Alegra (en frontend puede ser 0; el backend lo sustituye tras crear el contacto)
 */
export function buildInvoicePayload(input: CreateInvoiceInput, contactId: number) {
  const currencyCode = input.currency ?? "USD"
  const includeCurrency = currencyCode !== "DOP"

  return {
    client: { id: contactId },
    date: input.issueDate,
    dueDate: input.dueDate,
    status: "draft",
    ...(includeCurrency
      ? { currency: { code: currencyCode, exchangeRate: input.exchangeRate ?? DEFAULT_EXCHANGE_RATE } }
      : {}),
    items: input.items.map((it) => ({
      ...(it.id != null ? { id: it.id } : { name: it.name }),
      price: round2(it.price),
      quantity: it.quantity,
      ...(it.discount != null ? { discount: round2(it.discount) } : {}),
      ...(input.companyType === "local"
        ? { tax: [{ id: "1" }] }
        : {}),
    })),
    ...(input.notes ? { observations: input.notes } : {}),
    ...(input.terms ? { termsConditions: input.terms } : {}),
    ...(input.externalRef ? { anotation: input.externalRef } : {}),
  }
}
