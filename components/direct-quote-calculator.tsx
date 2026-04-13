"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Loader2, AlertCircle, Download, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buildInvoicePayload } from "@/lib/alegra-invoice-payload"
import type { CreateInvoiceInput } from "@/lib/alegra-invoice-payload"
import { buildDirectQuotePdfHtml } from "@/lib/direct-quote-pdf-html"

const ALEGRA_TEST_IDS: Record<string, number> = {
  "Test Competencias Plus": 1,
  "Test Pens. Analítico y Sistémico": 2,
  "Test Motivadores": 3,
  "Test Competencias Básicas": 4,
  "Test Razonamiento General": 5,
}

const BASE_PRICES = {
  competenciaPlus: 37.5,
  pensamientoAnalitico: 15.0,
  motivadores: 22.5,
  competenciasBasicas: 8.0,
  razonamientoGeneral: 1.0,
}

const PRICING_TIERS = {
  razonamientoGeneral: [
    { limit: 1500, price: 1.0 },
    { limit: 99999, price: 0.5 },
  ],
  competenciasBasicas: [
    { limit: 500, price: 8.0 },
    { limit: 1000, price: 7.2 },
    { limit: 1500, price: 6.85 },
    { limit: 2000, price: 6.5 },
    { limit: 4000, price: 6.0 },
    { limit: 6000, price: 5.5 },
    { limit: 99999, price: 5.25 },
  ],
  motivadores: [
    { limit: 10, price: 22.5 },
    { limit: 20, price: 20.25 },
    { limit: 30, price: 19.13 },
    { limit: 50, price: 18.0 },
    { limit: 200, price: 16.88 },
    { limit: 500, price: 15.75 },
    { limit: 1000, price: 14.63 },
    { limit: 1500, price: 13.5 },
    { limit: 99999, price: 12.38 },
  ],
  pensamientoAnalitico: [
    { limit: 10, price: 15.0 },
    { limit: 20, price: 13.5 },
    { limit: 30, price: 12.75 },
    { limit: 50, price: 12.0 },
    { limit: 200, price: 11.25 },
    { limit: 500, price: 10.5 },
    { limit: 1000, price: 9.75 },
    { limit: 1500, price: 9.0 },
    { limit: 99999, price: 8.25 },
  ],
  competenciaPlus: [
    { limit: 10, price: 37.5 },
    { limit: 20, price: 33.75 },
    { limit: 30, price: 31.875 },
    { limit: 50, price: 30.0 },
    { limit: 200, price: 28.125 },
    { limit: 500, price: 26.25 },
    { limit: 1000, price: 24.375 },
    { limit: 1500, price: 22.5 },
    { limit: 99999, price: 20.625 },
  ],
}

const TEST_NAMES = {
  competenciaPlus: "Test Competencias Plus",
  pensamientoAnalitico: "Test Pens. Analítico y Sistémico",
  motivadores: "Test Motivadores",
  competenciasBasicas: "Test Competencias Básicas",
  razonamientoGeneral: "Test Razonamiento General",
}

function calculateTieredPrice(testType: string, quantity: number): { total: number; avgPrice: number } {
  if (quantity === 0) return { total: 0, avgPrice: 0 }

  const tiers = PRICING_TIERS[testType as keyof typeof PRICING_TIERS]
  if (!tiers) return { total: 0, avgPrice: 0 }

  let remaining = quantity
  let total = 0
  let previousLimit = 0

  for (const tier of tiers) {
    if (remaining <= 0) break

    const tierCapacity = tier.limit - previousLimit
    const unitsInThisTier = Math.min(remaining, tierCapacity)

    const tierTotal = unitsInThisTier * tier.price
    total += tierTotal
    remaining -= unitsInThisTier

    previousLimit = tier.limit

    if (remaining <= 0) break
  }

  const avgPrice = quantity > 0 ? total / quantity : 0

  return { total, avgPrice }
}

const ITBIS_RATE = 0.18

interface DirectQuoteCalculatorProps {
  companyId: string | null
  accountId: string | null
  invoiceResolution?: string | null
  clientCountry?: string | null
  /** Nombre de la empresa en Alegra (misma línea que el correo de confirmación). */
  clientName?: string | null
  onSuccess?: () => void
}

/**
 * Resolución 4           → USD + DOP (factura en moneda seleccionada, sin importar el país)
 * País extranjero        → USD + EUR
 * País RD / null / vacío → USD + DOP
 */
function getCurrencyOptions(
  country: string | null | undefined,
  resolution: string | null | undefined,
): { value: string; label: string }[] {
  if (resolution === "4") {
    return [
      { value: "USD", label: "💵 USD" },
      { value: "DOP", label: "🇩🇴 DOP" },
    ]
  }
  const c = country?.trim() ?? null
  if (c && c !== "República Dominicana") {
    return [
      { value: "USD", label: "💵 USD" },
      { value: "EUR", label: "💶 EUR" },
    ]
  }
  return [
    { value: "USD", label: "💵 USD" },
    { value: "DOP", label: "🇩🇴 DOP" },
  ]
}

/** País RD, sin país o vacío → tratamiento local (DOP en UI puede facturarse en USD según resolución). */
function isLocalDominicanCountry(country: string | null | undefined): boolean {
  const c = country?.trim() ?? ""
  return c === "" || c === "República Dominicana"
}

export default function DirectQuoteCalculator({
  companyId,
  accountId,
  invoiceResolution,
  clientCountry,
  clientName,
  onSuccess,
}: DirectQuoteCalculatorProps) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [exchangeRateUSD] = useState(61.1933)
  const [exchangeRateEUR] = useState(68.8845)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)

  const [testQuantities, setTestQuantities] = useState({
    competenciaPlus: "",
    pensamientoAnalitico: "",
    motivadores: "",
    competenciasBasicas: "",
    razonamientoGeneral: "",
  })

  const getPriceByVolumeMemoized = useCallback((testType: string, quantity: number): number => {
    const { avgPrice } = calculateTieredPrice(testType, quantity)
    return avgPrice
  }, [])

  const calculations = useMemo(() => {
    const parseQuantity = (value: string) => {
      const num = Number(value)
      return isNaN(num) || num < 0 ? 0 : Math.floor(num)
    }

    const tests = {
      competenciaPlus: parseQuantity(testQuantities.competenciaPlus),
      pensamientoAnalitico: parseQuantity(testQuantities.pensamientoAnalitico),
      motivadores: parseQuantity(testQuantities.motivadores),
      competenciasBasicas: parseQuantity(testQuantities.competenciasBasicas),
      razonamientoGeneral: parseQuantity(testQuantities.razonamientoGeneral),
    }

    const testDetails = Object.entries(tests).map(([key, qty]) => {
      const basePrice = BASE_PRICES[key as keyof typeof BASE_PRICES]
      const priceWithDiscount = qty > 0 ? getPriceByVolumeMemoized(key, qty) : 0

      const totalWithoutDiscount = qty * basePrice
      const totalWithDiscount = qty * priceWithDiscount
      const discountAmount = totalWithoutDiscount - totalWithDiscount

      return {
        key,
        name: TEST_NAMES[key as keyof typeof TEST_NAMES],
        qty,
        price: basePrice,
        totalWithoutDiscount,
        discountAmount,
        priceWithDiscount,
        totalWithDiscount,
        hasDiscount: discountAmount > 0,
      }
    })

    const activeTests = testDetails.filter((test) => test.qty > 0)
    const subtotalWithoutDiscount = activeTests.reduce((sum, test) => sum + test.totalWithoutDiscount, 0)
    const totalDiscountAmount = activeTests.reduce((sum, test) => sum + test.discountAmount, 0)
    const subtotalWithDiscount = activeTests.reduce((sum, test) => sum + test.totalWithDiscount, 0)

    const country = clientCountry?.trim() ?? null
    const applyTax = !country || country === "República Dominicana"
    const itbisAmount = applyTax ? subtotalWithDiscount * ITBIS_RATE : 0
    const totalUSD = subtotalWithDiscount + itbisAmount

    let total = totalUSD
    let symbol = "$"
    if (currency === "DOP") {
      total = totalUSD * exchangeRateUSD
      symbol = "RD$"
    } else if (currency === "EUR") {
      total = totalUSD * (exchangeRateUSD / exchangeRateEUR)
      symbol = "€"
    }

    const totalTests = Object.values(tests).reduce((a, b) => a + b, 0)

    return {
      tests,
      testDetails,
      subtotalWithoutDiscount,
      totalDiscountAmount,
      subtotalWithDiscount,
      itbisAmount,
      applyTax,
      totalUSD,
      total,
      symbol,
      totalTests,
    }
  }, [testQuantities, currency, exchangeRateUSD, exchangeRateEUR, clientCountry, getPriceByVolumeMemoized])

  const formatCurrency = (amount: number, symbol = "$") => {
    return `${symbol} ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const convertCurrency = (amountUSD: number): number => {
    if (currency === "DOP") return amountUSD * exchangeRateUSD
    if (currency === "EUR") return amountUSD * (exchangeRateUSD / exchangeRateEUR)
    return amountUSD
  }

  const currencyOptions = getCurrencyOptions(clientCountry, invoiceResolution)

  const showDopUsdNote =
    currency === "DOP" &&
    (invoiceResolution === "1" ||
      (invoiceResolution === "2" && isLocalDominicanCountry(clientCountry)))

  const handleExportPDF = () => {
    if (typeof window === "undefined") return
    const html = buildDirectQuotePdfHtml({
      origin: window.location.origin,
      quoteDate: new Date(),
      clientName,
      companyId,
      currency,
      showDopUsdNote,
      calculations,
      formatCurrency,
      convertCurrency,
    })

    const win = window.open("", "_blank", "width=900,height=700")
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
    }, 400)
  }

  const clampQty = (value: string): string => {
    if (value === "") return ""
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return "0"
    if (num > 9999) return "9999"
    return String(num)
  }

  const hasPlusTests = calculations.testDetails.some((test) =>
    ["competenciaPlus", "pensamientoAnalitico", "motivadores"].includes(test.key),
  )
  const hasBasicTests = calculations.testDetails.some((test) =>
    ["competenciasBasicas", "razonamientoGeneral"].includes(test.key),
  )

  const handleContinue = () => {
    if (calculations.totalTests === 0) return
    setShowDetailsDialog(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const formatCurrencyForNotes = (amount: number, sym: string) =>
        `${sym} ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

      const today = new Date()
      const issueDate = today.toISOString().split("T")[0]
      const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      // Resolución 4: factura en moneda elegida (USD/DOP/EUR) con conversión desde catálogo USD.
      // País extranjero + EUR: misma factura en EUR (no forzar USD).
      const isRes4 = String(invoiceResolution ?? "") === "4"
      const isForeignClient = !isLocalDominicanCountry(clientCountry)
      const alegraExchangeRate =
        currency === "EUR" ? exchangeRateEUR : exchangeRateUSD

      const unitPriceUsdToInvoiceCurrency = (priceUsd: number): number => {
        if (isRes4) {
          if (currency === "DOP") return priceUsd * exchangeRateUSD
          if (currency === "EUR") return priceUsd * (exchangeRateUSD / exchangeRateEUR)
          return priceUsd
        }
        if (isForeignClient && currency === "EUR") {
          return priceUsd * (exchangeRateUSD / exchangeRateEUR)
        }
        return priceUsd
      }

      const alegraItems = calculations.testDetails
        .filter((test) => test.qty > 0)
        .map((test) => ({
          id: ALEGRA_TEST_IDS[test.name],
          name: test.name,
          price: Math.round(unitPriceUsdToInvoiceCurrency(test.price) * 100) / 100,
          quantity: test.qty,
          discount:
            test.hasDiscount && test.totalWithoutDiscount > 0
              ? Math.round((test.discountAmount / test.totalWithoutDiscount) * 100 * 100) / 100
              : 0,
        }))

      const notes = `Cotización directa por pruebas para ${calculations.totalTests} evaluaciones psicométricas.

Descuento por volumen aplicado: ${formatCurrencyForNotes(calculations.totalDiscountAmount, calculations.symbol)}${calculations.applyTax ? `\nITBIS (18%): ${formatCurrencyForNotes(calculations.itbisAmount, calculations.symbol)}` : ""}
Total: ${formatCurrencyForNotes(calculations.total, calculations.symbol)}`

      // Resolución 4 + DOP: no se envía objeto currency (moneda base en Alegra).
      // Resolución 4 + USD/EUR: moneda y tasa.
      // Cliente extranjero + EUR: factura en EUR con tasa euro.
      // Resto (local o extranjero en USD): factura en USD.
      let currencyOverride: Partial<CreateInvoiceInput> = {}
      if (isRes4) {
        if (currency === "DOP") {
          currencyOverride = { currency: "DOP" }
        } else {
          currencyOverride = { currency, exchangeRate: alegraExchangeRate }
        }
      } else if (isForeignClient && currency === "EUR") {
        currencyOverride = { currency: "EUR", exchangeRate: exchangeRateEUR }
      } else {
        currencyOverride = { currency: "USD", exchangeRate: exchangeRateUSD }
      }

      const alegraInput: CreateInvoiceInput = {
        customer: {
          name: companyId ? `Empresa ID: ${companyId}` : accountId ? `Cuenta ID: ${accountId}` : "Cliente directo",
        },
        items: alegraItems,
        ...currencyOverride,
        issueDate,
        dueDate,
        notes,
        companyType: calculations.applyTax ? "local" : "international",
        externalRef: `DIRECT-QUOTE-${companyId ?? accountId ?? "unknown"}-${Date.now()}`,
      }

      const alegraInvoicePayload = buildInvoicePayload(alegraInput, 0)

      const fullPayload = {
        currency,
        companyType: calculations.applyTax ? "local" : "international",
        calculations: {
          subtotalWithoutDiscount: calculations.subtotalWithoutDiscount,
          totalDiscountAmount: calculations.totalDiscountAmount,
          subtotalWithDiscount: calculations.subtotalWithDiscount,
          itbisAmount: calculations.itbisAmount,
          totalUSD: calculations.totalUSD,
          total: calculations.total,
          symbol: calculations.symbol,
          totalTests: calculations.totalTests,
        },
        scenarioTests: {
          competenciaPlus: calculations.tests.competenciaPlus,
          pensamientoAnalitico: calculations.tests.pensamientoAnalitico,
          motivadores: calculations.tests.motivadores,
          competenciasBasicas: calculations.tests.competenciasBasicas,
          razonamientoGeneral: calculations.tests.razonamientoGeneral,
        },
        companyId: companyId ?? null,
        accountId: accountId ?? null,
        alegraInvoicePayload,
      }

      const response = await fetch(
        "https://n8n.srv1464241.hstgr.cloud/webhook/286a3992-68a5-4ee7-a318-c25a6f4de689",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        },
      )

      if (!response.ok) {
        throw new Error(`Error al enviar la cotización: ${response.status}`)
      }

      setInvoiceData({
        message:
          "Solicitud recibida. Facturación en hasta 24 h; al recibir la factura, las evaluaciones quedan adjudicadas.",
        company_id: companyId ? parseInt(companyId, 10) : null,
      })
      setIsSuccess(true)
      setShowDetailsDialog(false)
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      onSuccess?.()
    } catch (error: any) {
      console.error("Error al enviar cotización:", error)
      setSubmitError(error.message || "Error al procesar la solicitud. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewQuote = () => {
    setIsSuccess(false)
    setInvoiceData(null)
    setTestQuantities({
      competenciaPlus: "",
      pensamientoAnalitico: "",
      motivadores: "",
      competenciasBasicas: "",
      razonamientoGeneral: "",
    })
    setSubmitError("")
  }

  // Pantalla de éxito: resumen corto (el correo lleva el detalle)
  if (isSuccess && invoiceData) {
    const selectedTests = calculations.testDetails.filter((t) => t.qty > 0)
    return (
      <div className="max-w-lg mx-auto py-10 px-4">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-sm text-center">
          <div className="h-1 w-14 rounded-full bg-[#00A99D] mx-auto mb-5" aria-hidden />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6">
            Solicitud recibida
          </h2>
          <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed text-left space-y-3 mb-5">
            <p className="text-balance">
              Procederemos con la facturación de las evaluaciones en un plazo máximo de{" "}
              <span className="font-medium text-foreground">24 horas</span>.
            </p>
            <p className="text-balance">
              Una vez recibas la factura, tus evaluaciones serán adjudicadas y estarán listas para su
              uso.
            </p>
          </div>
          {selectedTests.length > 0 && (
            <div className="rounded-lg border border-border/70 bg-muted/40 text-left p-4 mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Pruebas en tu solicitud
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                {selectedTests.map((t) => (
                  <li key={t.key} className="flex justify-between gap-3 items-baseline">
                    <span className="text-muted-foreground leading-snug min-w-0">{t.name}</span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {t.qty} {t.qty === 1 ? "evaluación" : "evaluaciones"}
                    </span>
                  </li>
                ))}
              </ul>
              {calculations.totalTests > 0 && (
                <p className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {calculations.totalTests}
                  </span>{" "}
                  evaluaciones
                </p>
              )}
            </div>
          )}
          <Button variant="outline" onClick={handleNewQuote} className="mt-6 w-full sm:w-auto">
            Hacer otra cotización
          </Button>
        </div>
      </div>
    )
  }

  // Paso 1: Ingreso de cantidades con preview a la derecha
  return (
    <>
      <div className="space-y-4 max-w-[1600px] mx-auto">
        <Card className="shadow-md ring-2 ring-primary/50 shadow-xl">
          <CardHeader className="pb-3 pt-4 px-3 sm:px-5">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="leading-tight">Cotiza nuevas pruebas</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5">
                  Ingresa las cantidades que necesitas y genera tu cotización personalizada.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-5 pb-5 md:pl-[72px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Left column: Inputs */}
              <div className="space-y-3 w-full max-w-xl">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-start">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">Moneda:</span>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-[120px] sm:w-[140px] bg-background h-9 sm:h-10 text-xs sm:text-sm border-2 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {showDopUsdNote && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
                      <span>Los precios se muestran en DOP como referencia. La factura será emitida en USD.</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competenciaPlus" className="text-sm sm:text-base font-semibold">
                    Test Competencias Plus
                  </Label>
                  <Input
                    id="competenciaPlus"
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ej: 50"
                    value={testQuantities.competenciaPlus}
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, competenciaPlus: clampQty(e.target.value) }))}
                    className="text-sm h-9 sm:h-10 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pensamientoAnalitico" className="text-sm sm:text-base font-semibold">
                    Test Pensamiento Analítico y Sistémico
                  </Label>
                  <Input
                    id="pensamientoAnalitico"
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ej: 50"
                    value={testQuantities.pensamientoAnalitico}
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, pensamientoAnalitico: clampQty(e.target.value) }))}
                    className="text-sm h-9 sm:h-10 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivadores" className="text-sm sm:text-base font-semibold">
                    Test Motivadores
                  </Label>
                  <Input
                    id="motivadores"
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ej: 30"
                    value={testQuantities.motivadores}
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, motivadores: clampQty(e.target.value) }))}
                    className="text-sm h-9 sm:h-10 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competenciasBasicas" className="text-sm sm:text-base font-semibold">
                    Test Competencias Básicas
                  </Label>
                  <Input
                    id="competenciasBasicas"
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ej: 100"
                    value={testQuantities.competenciasBasicas}
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, competenciasBasicas: clampQty(e.target.value) }))}
                    className="text-sm h-9 sm:h-10 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razonamientoGeneral" className="text-sm sm:text-base font-semibold">
                    Test Razonamiento General
                  </Label>
                  <Input
                    id="razonamientoGeneral"
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ej: 100"
                    value={testQuantities.razonamientoGeneral}
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, razonamientoGeneral: clampQty(e.target.value) }))}
                    className="text-sm h-9 sm:h-10 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Right column: summary */}
              <div className="space-y-4">
                <div className="overflow-x-auto -mx-1">
                  <div className="min-w-full text-xs border-2 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-[#2d1b69] to-[#3d2b79] text-white grid grid-cols-2 gap-1 p-2.5 text-xs font-bold">
                      <div>Prueba</div>
                      <div className="text-center">Cantidad</div>
                    </div>

                    {calculations.totalTests === 0 ? (
                      <div className="px-2.5 py-4 text-xs text-muted-foreground">
                        Ingresa las cantidades de pruebas para ver el resumen de tu cotización.
                      </div>
                    ) : (
                      <>
                        {hasPlusTests && (
                          <>
                            <div className="bg-accent text-accent-foreground px-2.5 py-1.5 text-xs font-bold">Pruebas Plus</div>
                            {calculations.testDetails
                              .filter((test) => ["competenciaPlus", "pensamientoAnalitico", "motivadores"].includes(test.key))
                              .map((test) => (
                                <div
                                  key={test.key}
                                  className="grid grid-cols-2 gap-1 px-2.5 py-2 border-b hover:bg-primary/5 transition-colors"
                                >
                                  <div className="font-medium text-xs leading-tight">{test.name}</div>
                                  <div className="text-center text-xs font-semibold">{test.qty > 0 ? test.qty : "-"}</div>
                                </div>
                              ))}
                          </>
                        )}

                        {hasBasicTests && (
                          <>
                            <div className="bg-accent text-accent-foreground px-2.5 py-1.5 text-xs font-bold">
                              Pruebas Básicas
                            </div>
                            {calculations.testDetails
                              .filter((test) => ["competenciasBasicas", "razonamientoGeneral"].includes(test.key))
                              .map((test) => (
                                <div
                                  key={test.key}
                                  className="grid grid-cols-2 gap-1 px-2.5 py-2 border-b hover:bg-primary/5 transition-colors"
                                >
                                  <div className="font-medium text-xs leading-tight">{test.name}</div>
                                  <div className="text-center text-xs font-semibold">{test.qty > 0 ? test.qty : "-"}</div>
                                </div>
                              ))}
                          </>
                        )}

                        <div className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Descuento total aplicado:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(convertCurrency(calculations.totalDiscountAmount), calculations.symbol)}
                            </span>
                          </div>
                          {calculations.applyTax && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">ITBIS (18%):</span>
                              <span className="font-semibold">
                                {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 px-2.5 py-3 text-xs font-bold">
                          <div className="flex justify-between text-base text-white">
                            <span>Total Neto</span>
                            <span className="text-lg">{formatCurrency(calculations.total, calculations.symbol)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleContinue}
                    disabled={calculations.totalTests === 0}
                    className="w-full h-11 text-base font-semibold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    Continuar con esta cotización
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    disabled={calculations.totalTests === 0}
                    className="w-full h-10 text-sm font-medium gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    Exportar cotización (PDF)
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog con detalles completos */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="!max-w-[95vw] w-[95vw] !max-h-[95vh] overflow-hidden p-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-2">¡Ya casi estás listo!</DialogTitle>
              <p className="text-white/90 text-base">
                Revisa tu cotización y confirma para enviar tu solicitud de facturación.
              </p>
            </DialogHeader>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 px-6 py-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Columna izquierda: tabla de detalles */}
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-5 border">
                <div className="flex items-center gap-3 mb-5">
                  <Badge className="bg-primary text-primary-foreground text-base px-4 py-1">
                    Cotización Personalizada
                  </Badge>
                  <span className="text-base text-muted-foreground">- Resumen de tu selección</span>
                </div>

                {/* Desktop Table */}
                <div className="overflow-x-auto">
                  <div className="min-w-[800px] text-sm border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-[#2d1b69] to-[#3d2b79] text-white grid grid-cols-7 gap-3 p-3 text-[10px] leading-tight font-bold">
                      <div className="col-span-1">Descripción</div>
                      <div className="text-center">Cantidad</div>
                      <div className="text-right">Costo Por Evaluado Sin Descuento ({currency})</div>
                      <div className="text-right">Monto Total Sin Descuento ({currency})</div>
                      <div className="text-right">Descuento Por Volumen ({currency})</div>
                      <div className="text-right">Costo Por Evaluado con Descuento ({currency})</div>
                      <div className="text-right">Valor a Pagar Multiplicity ({currency})</div>
                    </div>

                    <div className="bg-gradient-to-r from-[#00a69c] to-[#00b8ac] text-white px-3 py-2 text-sm font-bold">
                      Por Uso
                    </div>

                    {hasPlusTests && (
                      <>
                        <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm font-bold">Pruebas Plus</div>
                        {calculations.testDetails
                          .filter((test) =>
                            ["competenciaPlus", "pensamientoAnalitico", "motivadores"].includes(test.key),
                          )
                          .map((test) => (
                            <div
                              key={test.key}
                              className="grid grid-cols-7 gap-3 px-3 py-2.5 border-b hover:bg-muted/30 text-xs"
                            >
                              <div className="col-span-1 font-medium leading-tight">{test.name}</div>
                              <div className="text-center">{test.qty > 0 ? test.qty : "-"}</div>
                              <div className="text-right">
                                {test.qty > 0 ? formatCurrency(convertCurrency(test.price), calculations.symbol) : "-"}
                              </div>
                              <div className="text-right">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.totalWithoutDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right text-green-600 dark:text-green-400 font-semibold">
                                {test.qty > 0 && test.hasDiscount
                                  ? formatCurrency(convertCurrency(test.discountAmount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.priceWithDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right font-semibold">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.totalWithDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                            </div>
                          ))}
                      </>
                    )}

                    {hasBasicTests && (
                      <>
                        <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm font-bold">Pruebas Básicas</div>
                        {calculations.testDetails
                          .filter((test) => ["competenciasBasicas", "razonamientoGeneral"].includes(test.key))
                          .map((test) => (
                            <div
                              key={test.key}
                              className="grid grid-cols-7 gap-3 px-3 py-2.5 border-b hover:bg-muted/30 text-xs"
                            >
                              <div className="col-span-1 font-medium leading-tight">{test.name}</div>
                              <div className="text-center">{test.qty > 0 ? test.qty : "-"}</div>
                              <div className="text-right">
                                {test.qty > 0 ? formatCurrency(convertCurrency(test.price), calculations.symbol) : "-"}
                              </div>
                              <div className="text-right">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.totalWithoutDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right text-green-600 dark:text-green-400 font-semibold">
                                {test.qty > 0 && test.hasDiscount
                                  ? formatCurrency(convertCurrency(test.discountAmount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.priceWithDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                              <div className="text-right font-semibold">
                                {test.qty > 0
                                  ? formatCurrency(convertCurrency(test.totalWithDiscount), calculations.symbol)
                                  : "-"}
                              </div>
                            </div>
                          ))}
                      </>
                    )}

                    {/* Subtotales */}
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-800 dark:text-white grid grid-cols-7 gap-3 px-3 py-3 text-sm font-bold">
                      <div className="col-span-1">Subtotales</div>
                      <div className="text-center">{calculations.totalTests}</div>
                      <div className="text-right">-</div>
                      <div className="text-right">
                        {formatCurrency(convertCurrency(calculations.subtotalWithoutDiscount), calculations.symbol)}
                      </div>
                      <div className="text-right text-green-600 dark:text-green-300">
                        {formatCurrency(convertCurrency(calculations.totalDiscountAmount), calculations.symbol)}
                      </div>
                      <div className="text-right">-</div>
                      <div className="text-right">
                        {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                      </div>
                    </div>

                    {/* Totales finales */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white">
                      <div className="grid grid-cols-7 gap-3 px-3 py-2.5 border-b">
                        <div className="col-span-5"></div>
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                          <div className="text-right font-bold text-sm">Subtotal</div>
                          <div className="text-right font-bold text-sm">
                            {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                          </div>
                        </div>
                      </div>

                      {calculations.applyTax && (
                        <div className="grid grid-cols-7 gap-3 px-3 py-2.5 border-b">
                          <div className="col-span-5"></div>
                          <div className="col-span-2 grid grid-cols-2 gap-3">
                            <div className="text-right font-bold text-sm">ITBIS (18%)</div>
                            <div className="text-right font-bold text-sm">
                              {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-7 gap-3 px-3 py-3">
                        <div className="col-span-5"></div>
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                          <div className="text-right font-bold text-lg">Total Neto</div>
                          <div className="text-right font-bold text-xl">
                            {formatCurrency(calculations.total, calculations.symbol)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: panel de acción */}
            <div className="space-y-4">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground">Confirmar solicitud</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Al confirmar enviaremos tu solicitud. Procederemos con la facturación en un plazo máximo de{" "}
                      <span className="font-medium text-foreground">24 horas</span>. Cuando recibas la factura, tus
                      evaluaciones quedarán adjudicadas y listas para su uso.
                    </p>
                  </div>

                  {showDopUsdNote && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
                      <span>Los precios se muestran en DOP como referencia. La factura será emitida en USD.</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    className="w-full gap-2 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Exportar PDF
                  </Button>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-800">Error al procesar</p>
                        <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Confirmar solicitud de facturación"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsDialog(false)}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Volver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
