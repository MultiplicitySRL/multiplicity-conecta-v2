"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, CheckCircle2, Building2, Globe } from "lucide-react"
import DirectScenarioCard from "./direct-scenario-card"

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

export default function DirectQuoteCalculator() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [exchangeRateUSD] = useState(63.9204)
  const [exchangeRateEUR] = useState(74.3778)
  const [companyType, setCompanyType] = useState<"local" | "international">("local")

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

  const scenario = useMemo(() => {
    const parseQuantity = (value: string) => {
      const num = Number(value)
      return isNaN(num) || num < 0 ? 0 : Math.floor(num)
    }

    return {
      id: 1,
      title: "Cotización Personalizada",
      subtitle: "Cantidades directas",
      icon: "📋",
      description: "Cotización basada en las cantidades específicas de pruebas que necesitas",
      tests: {
        competenciaPlus: parseQuantity(testQuantities.competenciaPlus),
        pensamientoAnalitico: parseQuantity(testQuantities.pensamientoAnalitico),
        motivadores: parseQuantity(testQuantities.motivadores),
        competenciasBasicas: parseQuantity(testQuantities.competenciasBasicas),
        razonamientoGeneral: parseQuantity(testQuantities.razonamientoGeneral),
      },
    }
  }, [testQuantities])

  const totalTests = Object.values(scenario.tests).reduce((a, b) => a + b, 0)
  const hasData = totalTests > 0

  const handleSelectScenario = () => {
    setIsSubmitted(true)
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

  if (isSubmitted) {
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
        <h2 className="text-3xl font-bold text-foreground mb-3">¡Solicitud Procesada Exitosamente!</h2>
        <p className="text-muted-foreground text-lg mb-6">
          Hemos recibido tu solicitud de cotización. Te enviaremos una confirmación por email con todos los detalles.
        </p>
        <div className="bg-muted/50 rounded-lg p-6 text-left space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Total de pruebas:</span> {totalTests}
          </p>
        </div>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setTestQuantities({
              competenciaPlus: "",
              pensamientoAnalitico: "",
              motivadores: "",
              competenciasBasicas: "",
              razonamientoGeneral: "",
            })
            setCompanyType("local")
          }}
          className="mt-6"
        >
          Nueva Cotización
        </Button>
      </div>
    )
  }

  return (
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
                <Label className="text-sm sm:text-base font-semibold">Tipo de Empresa</Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setCompanyType("local")}
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      companyType === "local"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <Building2
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${companyType === "local" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-semibold text-center ${companyType === "local" ? "text-primary" : "text-foreground"}`}
                    >
                      Empresa Local
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyType("international")}
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      companyType === "international"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <Globe
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${companyType === "international" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-semibold text-center ${companyType === "international" ? "text-primary" : "text-foreground"}`}
                    >
                      Empresa Internacional
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competenciaPlus" className="text-sm sm:text-base font-semibold">
                  Test Competencias Plus
                </Label>
                <Input
                  id="competenciaPlus"
                  type="number"
                  min="0"
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
                  placeholder="Ej: 100"
                  value={testQuantities.razonamientoGeneral}
                  onChange={(e) => setTestQuantities((prev) => ({ ...prev, razonamientoGeneral: e.target.value }))}
                  className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Right column: Currency selector and scenario card */}
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
                    {companyType === "international" && <SelectItem value="EUR">💶 EUR</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              {hasData && (
                <DirectScenarioCard
                  tests={scenario.tests}
                  basePrices={BASE_PRICES}
                  getPriceByVolume={getPriceByVolumeMemoized}
                  itbisRate={ITBIS_RATE}
                  currency={currency}
                  exchangeRateUSD={exchangeRateUSD}
                  exchangeRateEUR={exchangeRateEUR}
                  companyType={companyType}
                  onSelect={handleSelectScenario}
                />
              )}

              {!hasData && (
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
  )
}
