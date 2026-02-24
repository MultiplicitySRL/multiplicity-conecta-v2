"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TEST_TO_SURVEY_TYPE_MAP, type TestKey } from "@/lib/types/company"

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
}

export default function DirectQuoteCalculator({ companyId, accountId }: DirectQuoteCalculatorProps) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [exchangeRateUSD] = useState(63.9204)
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

    const itbisAmount = subtotalWithDiscount * ITBIS_RATE
    const totalUSD = subtotalWithDiscount + itbisAmount

    let total = totalUSD
    let symbol = "$"
    if (currency === "DOP") {
      total = totalUSD * exchangeRateUSD
      symbol = "RD$"
    }

    const totalTests = Object.values(tests).reduce((a, b) => a + b, 0)

    return {
      tests,
      testDetails,
      subtotalWithoutDiscount,
      totalDiscountAmount,
      subtotalWithDiscount,
      itbisAmount,
      totalUSD,
      total,
      symbol,
      totalTests,
    }
  }, [testQuantities, currency, exchangeRateUSD, getPriceByVolumeMemoized])

  const formatCurrency = (amount: number, symbol = "$") => {
    return `${symbol} ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const convertCurrency = (amountUSD: number): number => {
    if (currency === "DOP") {
      return amountUSD * exchangeRateUSD
    }
    return amountUSD
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
    if (!companyId) {
      setSubmitError("No se pudo identificar la empresa. Por favor, recarga la página.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const invoice_details = Object.entries(calculations.tests)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
          const mapping = TEST_TO_SURVEY_TYPE_MAP[key as TestKey]
          return {
            survey_type_id: mapping.survey_type_id,
            amount: qty,
            ...(mapping.is_plus !== undefined ? { is_plus: mapping.is_plus } : {}),
          }
        })

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: parseInt(companyId, 10),
          invoice_details,
          comment: "",
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Error al crear la factura")
      }

      // Guardar información básica para mostrar en pantalla de éxito
      setInvoiceData({
        message: result.message,
        company_id: parseInt(companyId, 10),
      })
      setIsSuccess(true)
      setShowDetailsDialog(false)
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

  const StepIndicator = ({ step, isActive }: { step: number; isActive: boolean }) => (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
        isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg" : "bg-muted text-muted-foreground"
      }`}
    >
      {step}
    </div>
  )

  // Pantalla de éxito
  if (isSuccess && invoiceData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500 text-white rounded-full p-6">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">¡Factura Creada Exitosamente!</h2>
        <p className="text-muted-foreground text-lg mb-6">
          {invoiceData.message || "La factura ha sido procesada y los créditos han sido agregados a tu cuenta."}
        </p>
        <div className="bg-muted/50 rounded-lg p-6 text-left space-y-2 mb-6">
          <p className="text-sm">
            <span className="font-semibold">Total de pruebas:</span> {calculations.totalTests}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Monto total:</span> {formatCurrency(calculations.total, calculations.symbol)}
          </p>
        </div>
        <Button onClick={handleNewQuote} className="mt-6">
          Nueva Cotización
        </Button>
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
              <StepIndicator step={1} isActive={true} />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="leading-tight">Ingresa la cantidad de pruebas que necesitas</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5">
                  Especifica directamente cuántas pruebas de cada tipo requieres para tu organización.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-5 pb-5 md:pl-[72px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left column: Inputs */}
              <div className="space-y-4 mx-auto w-full max-w-md">
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
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, competenciaPlus: e.target.value }))}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
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
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, pensamientoAnalitico: e.target.value }))}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
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
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, motivadores: e.target.value }))}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
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
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, competenciasBasicas: e.target.value }))}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
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
                    onChange={(e) => setTestQuantities((prev) => ({ ...prev, razonamientoGeneral: e.target.value }))}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Right column: Currency selector and summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">Moneda:</span>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[120px] sm:w-[140px] bg-background h-9 sm:h-10 text-xs sm:text-sm border-2 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">💵 USD</SelectItem>
                      <SelectItem value="DOP">🇩🇴 DOP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {calculations.totalTests > 0 && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-5 border-2 border-primary/20">
                    <h3 className="text-lg font-bold mb-4 text-primary">Resumen de Cotización</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de pruebas:</span>
                        <span className="font-semibold">{calculations.totalTests}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Descuento aplicado:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(convertCurrency(calculations.totalDiscountAmount), calculations.symbol)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">
                          {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ITBIS (18%):</span>
                        <span className="font-semibold">
                          {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-3 border-t-2 border-primary/30">
                        <span className="font-bold text-base">TOTAL:</span>
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(calculations.total, calculations.symbol)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleContinue}
                      className="w-full mt-4 h-11 text-base font-semibold"
                    >
                      Continuar con esta cotización
                    </Button>
                  </div>
                )}

                {calculations.totalTests === 0 && (
                  <div className="bg-muted/30 rounded-lg p-6 text-center border-2 border-dashed">
                    <p className="text-muted-foreground text-sm">
                      Ingresa las cantidades de pruebas para ver tu cotización
                    </p>
                  </div>
                )}
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
              <p className="text-white/90 text-base">Revisa tu cotización y confirma para crear la factura.</p>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Tabla de detalles */}
            <div className="bg-muted/30 rounded-lg p-5 border mb-6">
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
                    <div className="text-right">Costo Por Evaluado Sin Descuento (USD)</div>
                    <div className="text-right">Monto Total Sin Descuento (USD)</div>
                    <div className="text-right">Descuento Por Volumen (USD)</div>
                    <div className="text-right">Costo Por Evaluado con Descuento (USD)</div>
                    <div className="text-right">Valor a Pagar Multiplicity (USD)</div>
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

                  {/* Totales */}
                  <div className="bg-gray-100 dark:bg-gray-900 grid grid-cols-7 gap-3 px-3 py-3 text-sm font-bold border-t-2">
                    <div className="col-span-5 text-right">Subtotal (con descuentos):</div>
                    <div></div>
                    <div className="text-right">
                      {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-900 grid grid-cols-7 gap-3 px-3 py-2 text-sm">
                    <div className="col-span-5 text-right">ITBIS (18%):</div>
                    <div></div>
                    <div className="text-right">
                      {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#2d1b69] to-[#3d2b79] text-white grid grid-cols-7 gap-3 px-3 py-4 text-base font-bold">
                    <div className="col-span-5 text-right">TOTAL A PAGAR:</div>
                    <div></div>
                    <div className="text-right text-lg">
                      {formatCurrency(calculations.total, calculations.symbol)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al procesar</p>
                  <p className="text-xs text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)} 
                disabled={isSubmitting}
              >
                Volver
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar y Crear Factura"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
