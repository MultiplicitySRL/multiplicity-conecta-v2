"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"
import DirectQuoteCalculator from "@/components/direct-quote-calculator"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useEmbedSecurity } from "@/hooks/use-embed-security"
import { BlockedAccessScreen } from "@/components/blocked-access-screen"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const EXCHANGE_RATE_USD_DOP = 60.4055
const EXCHANGE_RATE_EUR_REF = 70.305336

type AlegraClientInfo = {
  id: string
  name: string
  email?: string | null
  defaultInvoiceResolution?: string | null
  country?: string | null
}

type AlegraInvoice = {
  id: string
  date: string
  dueDate: string
  datetime?: string
  observations?: string
  termsConditions?: string
  status: string
  subtotal: number
  discount: number
  tax: number
  total: number
  totalPaid: number
  balance: number
  client: {
    id: string
    name: string
    identification?: string | null
    email?: string | null
  }
  numberTemplate?: {
    fullNumber?: string
    formattedNumber?: string
    prefix?: string
    number?: string
  }
  currency?: {
    code?: string
    symbol?: string | null
    exchangeRate?: string | number
  }
  items?: {
    name: string
    price: number
    quantity: number
    discount?: number
    total?: number
  }[]
}

/** Solo facturas con código USD se consideran en dólares; el resto se trata como DOP. */
function isInvoiceUsd(currency?: AlegraInvoice["currency"]): boolean {
  return (currency?.code ?? "").trim().toUpperCase() === "USD"
}

function getInvoiceCurrencySymbol(currency?: AlegraInvoice["currency"]): string {
  const raw = currency?.symbol?.trim()
  if (isInvoiceUsd(currency)) {
    if (raw && raw !== "$") return raw
    return "US$"
  }
  if (raw && raw !== "$") return raw
  return "RD$"
}

function formatInvoiceMoney(currency: AlegraInvoice["currency"] | undefined, amount: number) {
  const sym = getInvoiceCurrencySymbol(currency)
  const num = amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${sym} ${num}`
}

function CotizarPorPruebasContent() {
  const searchParams = useSearchParams()
  const embedSecurity = useEmbedSecurity()
  
  const companyId = searchParams.get("company_id")
  const accountId = searchParams.get("account_id")
  const invoiceClientId = companyId ?? accountId

  const [clientInfo, setClientInfo] = useState<AlegraClientInfo | null>(null)
  const [isLoadingClientInfo, setIsLoadingClientInfo] = useState(false)

  const [invoices, setInvoices] = useState<AlegraInvoice[] | null>(null)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
  const [invoicesError, setInvoicesError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<AlegraInvoice | null>(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [visiblePendingInvoicesCount, setVisiblePendingInvoicesCount] = useState(5)

  useEffect(() => {
    if (!companyId) return
    const controller = new AbortController()
    setIsLoadingClientInfo(true)
    const url = new URL("https://n8n.srv1464241.hstgr.cloud/webhook/22557e2d-6273-4070-9332-ab34dc412d86")
    url.searchParams.set("client_id", companyId)
    fetch(url.toString(), { method: "GET", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setClientInfo({
            id: data.id,
            name: data.name,
            email: data.email,
            defaultInvoiceResolution: data.defaultInvoiceResolution ?? null,
            country: data.address?.country ?? null,
          })
        }
      })
      .catch((err) => { if (err?.name !== "AbortError") setIsLoadingClientInfo(false) })
      .finally(() => setIsLoadingClientInfo(false))
    return () => controller.abort()
  }, [companyId])

  const fetchInvoices = useCallback(async (signal?: AbortSignal) => {
    if (!invoiceClientId) return
    try {
      setIsLoadingInvoices(true)
      setInvoicesError(null)

      const url = new URL(
        "https://n8n.srv1464241.hstgr.cloud/webhook/472160fc-1174-4f8e-98ac-dd6304bc7eed",
      )
      url.searchParams.set("client_id", invoiceClientId)

      const res = await fetch(url.toString(), {
        method: "GET",
        signal,
      })

      if (!res.ok) {
        throw new Error(`Error al obtener facturas: ${res.status}`)
      }

      const data = await res.json()

      const rawList: AlegraInvoice[] = Array.isArray(data)
        ? data
        : data
        ? [data]
        : []

      const list = rawList.filter(
        (inv) => (inv.status ?? "").toLowerCase() !== "draft",
      )

      setInvoices(list)
    } catch (error: any) {
      if (error?.name === "AbortError") return
      setInvoicesError("No pudimos cargar tus facturas. Intenta nuevamente más tarde.")
    } finally {
      setIsLoadingInvoices(false)
    }
  }, [invoiceClientId])

  useEffect(() => {
    if (!invoiceClientId) return
    const controller = new AbortController()
    void fetchInvoices(controller.signal)
    return () => { controller.abort() }
  }, [invoiceClientId, fetchInvoices])

  const pendingInvoices =
    invoices?.filter((invoice) => invoice.status === "open" || invoice.balance > 0) ?? []
  const paidInvoices =
    invoices?.filter((invoice) => invoice.status === "closed" || invoice.balance === 0) ?? []
  const hasAnyInvoices = !!invoices && invoices.length > 0
  const primaryClient = invoices?.[0]?.client

  const visiblePendingInvoices = pendingInvoices.slice(0, visiblePendingInvoicesCount)

  useEffect(() => {
    setVisiblePendingInvoicesCount(5)
  }, [pendingInvoices.length])

  // Mostrar loading mientras se valida la seguridad
  if (embedSecurity.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-[#00BCB4]/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-[#00BCB4] animate-spin" />
          <p className="text-muted-foreground font-medium">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si el embed no es válido, mostrar pantalla de bloqueo
  if (!embedSecurity.isValid) {
    return <BlockedAccessScreen error={embedSecurity.error} />
  }

  // Embed válido, mostrar la página
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-[#00BCB4]/10">
      <div className="bg-gradient-to-b from-[#00BCB4]/10 via-[#00BCB4]/5 to-transparent border-b border-border/50">
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 text-center">
          <div className="mb-4 md:mb-6">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity"
              width={400}
              height={120}
              className="h-12 md:h-16 lg:h-20 w-auto mx-auto"
              priority
            />
          </div>

          {/* <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-balance mb-4 md:mb-2 text-foreground">
            <span className="block">Cotiza tus pruebas en línea</span>
          </h1> */}
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(300px,1.55fr)] xl:grid-cols-[minmax(0,2.35fr)_minmax(340px,1.5fr)] items-start">
          <section className="space-y-3 min-w-0">
            {companyId && isLoadingClientInfo ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-[#00BCB4]" />
                <p className="text-sm font-medium">Cargando información del cliente...</p>
              </div>
            ) : (
              <DirectQuoteCalculator
                companyId={companyId}
                accountId={accountId}
                invoiceResolution={clientInfo?.defaultInvoiceResolution ?? null}
                clientCountry={clientInfo?.country ?? null}
                clientName={clientInfo?.name ?? null}
                onSuccess={() => void fetchInvoices()}
                exchangeRateUSD={EXCHANGE_RATE_USD_DOP}
                exchangeRateEUR={EXCHANGE_RATE_EUR_REF}
              />
            )}
          </section>

          {invoiceClientId && (
            <aside className="space-y-3 lg:space-y-4 w-full min-w-0 lg:max-w-none xl:min-w-[320px]">
              <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 sm:p-5 shadow-sm w-full min-w-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      Facturas pendientes
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      {primaryClient
                        ? primaryClient.name
                        : "Revisa tus documentos con saldo pendiente de pago."}
                    </p>
                  </div>
                </div>

                {isLoadingInvoices && (
                  <div className="flex items-center justify-center py-6 gap-3 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-[#00BCB4]" />
                    <span className="text-sm">Cargando tus facturas...</span>
                  </div>
                )}

                {!isLoadingInvoices && invoicesError && (
                  <div className="py-4 text-sm text-red-500">
                    {invoicesError}
                  </div>
                )}

                {!isLoadingInvoices && !invoicesError && !hasAnyInvoices && (
                  <div className="py-4 text-sm text-muted-foreground">
                    Aún no encontramos facturas registradas para esta cuenta.
                  </div>
                )}

                {!isLoadingInvoices &&
                  !invoicesError &&
                  hasAnyInvoices &&
                  pendingInvoices.length === 0 && (
                    <div className="py-4 text-sm text-emerald-600">
                      No tienes facturas pendientes de pago. ¡Todo al día!
                    </div>
                  )}

                {!isLoadingInvoices &&
                  !invoicesError &&
                  pendingInvoices.length > 0 && (
                    <div
                      className="space-y-2.5 max-h-96 overflow-y-auto pr-1"
                      onScroll={(e) => {
                        const target = e.currentTarget
                        const nearBottom =
                          target.scrollTop + target.clientHeight >= target.scrollHeight - 16

                        if (nearBottom && visiblePendingInvoicesCount < pendingInvoices.length) {
                          setVisiblePendingInvoicesCount((prev) =>
                            Math.min(prev + 5, pendingInvoices.length),
                          )
                        }
                      }}
                    >
                      {visiblePendingInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setIsInvoiceDialogOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              setSelectedInvoice(invoice)
                              setIsInvoiceDialogOpen(true)
                            }
                          }}
                          className="flex flex-col rounded-xl border border-border/60 bg-background/90 px-3.5 sm:px-4 py-3 cursor-pointer transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCB4]/60"
                        >
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-foreground">
                                  Factura{" "}
                                  {invoice.numberTemplate?.fullNumber ||
                                    invoice.numberTemplate?.formattedNumber ||
                                    invoice.id}
                                </span>
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-800">
                                  Pendiente
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                Emisión: {invoice.date} &middot; Vence:{" "}
                                <span className="font-medium text-amber-800">
                                  {invoice.dueDate}
                                </span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end text-xs sm:text-sm shrink-0 min-w-[9.5rem] sm:min-w-[10.5rem]">
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                Saldo pendiente
                              </span>
                              <span className="text-sm font-semibold text-foreground tabular-nums whitespace-nowrap leading-tight">
                                {formatInvoiceMoney(invoice.currency, invoice.balance)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Haz clic para ver la factura completa</span>
                            <span
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px]"
                              aria-hidden="true"
                            >
                              ❯
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {!isLoadingInvoices &&
                  !invoicesError &&
                  paidInvoices.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-xs sm:text-sm font-medium text-foreground list-none">
                          <span>Historial de facturas pagadas</span>
                          <span className="text-[10px] text-muted-foreground group-open:hidden">
                            Ver historial
                          </span>
                          <span className="text-[10px] text-muted-foreground hidden group-open:inline">
                            Ocultar historial
                          </span>
                        </summary>
                        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                          {paidInvoices.map((invoice) => (
                            <div
                              key={`paid-${invoice.id}`}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                setIsInvoiceDialogOpen(true)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  setSelectedInvoice(invoice)
                                  setIsInvoiceDialogOpen(true)
                                }
                              }}
                              className="flex flex-col rounded-xl border border-border/40 bg-background/80 px-3.5 sm:px-4 py-3 text-xs sm:text-sm cursor-pointer transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BCB4]/60"
                            >
                              <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-foreground">
                                      Factura{" "}
                                      {invoice.numberTemplate?.fullNumber ||
                                        invoice.numberTemplate?.formattedNumber ||
                                        invoice.id}
                                    </span>
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                      Pagada
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">
                                    Fecha: {invoice.date}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end text-xs sm:text-sm shrink-0 min-w-[9.5rem] sm:min-w-[10.5rem]">
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    Monto total
                                  </span>
                                  <span className="font-semibold text-foreground tabular-nums whitespace-nowrap leading-tight">
                                    {formatInvoiceMoney(invoice.currency, invoice.total)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>Haz clic para ver la factura completa</span>
                                <span
                                  className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px]"
                                  aria-hidden="true"
                                >
                                  ❯
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
              </div>
            </aside>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <Dialog
          open={isInvoiceDialogOpen}
          onOpenChange={(open) => {
            setIsInvoiceDialogOpen(open)
            if (!open) setSelectedInvoice(null)
          }}
        >
          <DialogContent className="max-w-3xl w-[95vw] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex flex-col gap-1">
                <span className="text-base sm:text-lg font-semibold">
                  Factura{" "}
                  {selectedInvoice.numberTemplate?.fullNumber ||
                    selectedInvoice.numberTemplate?.formattedNumber ||
                    selectedInvoice.id}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedInvoice.client.name}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 text-sm">
              <div className="flex flex-col gap-4 border-b border-border/60 pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Cliente
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedInvoice.client.name}
                    </p>
                    {selectedInvoice.client.email && (
                      <p className="text-xs text-muted-foreground">
                        {selectedInvoice.client.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-800">
                      <span>
                        {selectedInvoice.status === "open"
                          ? "Pendiente"
                          : selectedInvoice.status === "closed"
                          ? "Pagada"
                          : selectedInvoice.status}
                      </span>
                      <span className="text-amber-900/80">
                        &middot; Vence: {selectedInvoice.dueDate}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p>
                        <span className="font-medium text-foreground">Fecha:</span>{" "}
                        {selectedInvoice.date}
                      </p>
                      {selectedInvoice.datetime && (
                        <p>
                          <span className="font-medium text-foreground">Creada:</span>{" "}
                          {selectedInvoice.datetime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="rounded-xl bg-muted/70 px-4 py-3 text-right space-y-1 min-w-[200px]">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Saldo pendiente
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">
                      {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="space-y-2">
                  <div className="flex text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border/60 pb-1">
                    <div className="flex-1">Concepto</div>
                    <div className="w-16 text-right">Cant.</div>
                    <div className="w-20 text-right">Precio</div>
                    <div className="w-24 text-right">Importe</div>
                  </div>
                  <div className="space-y-1">
                    {selectedInvoice.items.map((item, idx) => {
                      const lineTotal =
                        item.total ?? item.price * item.quantity
                      return (
                        <div
                          key={`${selectedInvoice.id}-dialog-item-${idx}`}
                          className="flex items-baseline text-xs text-foreground"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                          </div>
                          <div className="w-16 text-right text-muted-foreground">
                            {item.quantity}
                          </div>
                          <div className="w-20 text-right text-muted-foreground tabular-nums text-[11px]">
                            {formatInvoiceMoney(selectedInvoice.currency, item.price ?? 0)}
                          </div>
                          <div className="w-24 text-right font-medium tabular-nums">
                            {formatInvoiceMoney(selectedInvoice.currency, lineTotal)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                  <span>Descuento</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.discount)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                  <span>ITBIS</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.tax)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs font-semibold text-foreground border-t border-border/60 pt-2 mt-1">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.total)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-xs text-muted-foreground">
                  <span>Pagado</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-xs font-medium text-foreground">
                  <span>Saldo pendiente</span>
                  <span className="tabular-nums">
                    {formatInvoiceMoney(selectedInvoice.currency, selectedInvoice.balance)}
                  </span>
                </div>
              </div>

              {selectedInvoice.observations && (
                <div className="pt-2 border-t border-border/40 mt-1 space-y-1">
                  <p className="text-xs font-medium text-foreground">Detalle</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {selectedInvoice.observations}
                  </p>
                </div>
              )}

              {selectedInvoice.termsConditions && (
                <div className="pt-2 border-t border-border/40 mt-1 space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    Términos y condiciones
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {selectedInvoice.termsConditions}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00BCB4] to-[#00BCB4]/80 p-6 md:p-8 lg:p-12 shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full -ml-16 md:-ml-24 -mb-16 md:-mb-24"></div>

            <div className="relative z-10 text-center space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">¿Quieres ser distribuidor?</h2>
              <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
                Únete a nuestra red de distribuidores y ofrece soluciones de evaluación psicométrica a tus clientes
              </p>
              <div className="pt-2 md:pt-4">
                <button
                  onClick={() => window.open("https://calendly.com/multiplicity-info/30min", "_blank")}
                  className="inline-flex items-center gap-2 bg-white text-[#00BCB4] px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-white/90 transition-colors shadow-lg"
                >
                  Contáctanos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function CotizarPorPruebasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-[#00BCB4]/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-[#00BCB4] animate-spin" />
          <p className="text-muted-foreground font-medium">Cargando...</p>
        </div>
      </div>
    }>
      <CotizarPorPruebasContent />
    </Suspense>
  )
}
