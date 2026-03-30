"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Sparkles, CheckCircle2, Loader2, Building2, Globe } from "lucide-react"
import ScenarioCard from "./scenario-card"
import ObservationsSection from "./observations-section"
import Image from "next/image"
import { useUser } from "@/lib/user-context"

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

  console.log(`[v0] Calculating tiered price for ${testType}, quantity: ${quantity}`)

  for (const tier of tiers) {
    if (remaining <= 0) break

    const tierCapacity = tier.limit - previousLimit
    const unitsInThisTier = Math.min(remaining, tierCapacity)

    const tierTotal = unitsInThisTier * tier.price
    total += tierTotal
    remaining -= unitsInThisTier

    console.log(
      `[v0]   Tier ${previousLimit}-${tier.limit}: ${unitsInThisTier} units × $${tier.price} = $${tierTotal.toFixed(2)}`,
    )

    previousLimit = tier.limit

    if (remaining <= 0) break
  }

  const avgPrice = quantity > 0 ? total / quantity : 0

  console.log(`[v0]   Total: $${total.toFixed(2)}, Avg Price: $${avgPrice.toFixed(4)}`)

  return { total, avgPrice }
}

function getPriceByVolume(testType: string, quantity: number): number {
  const { avgPrice } = calculateTieredPrice(testType, quantity)
  return avgPrice
}

const ITBIS_RATE = 0.18

function calculateVolumeDiscount(totalTests: number): number {
  if (totalTests >= 500) return 0.25
  if (totalTests >= 300) return 0.2
  if (totalTests >= 150) return 0.15
  if (totalTests >= 50) return 0.1
  return 0
}

export default function QuoteCalculator() {
  const user = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [directivos, setDirectivos] = useState("")
  const [profesionales, setProfesionales] = useState("")
  const [tecnicos, setTecnicos] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [exchangeRateUSD] = useState(61.0416)
  const [exchangeRateEUR] = useState(68.50)
  const [companyType, setCompanyType] = useState<"local" | "international" | null>(null)
  const [regenerationCount, setRegenerationCount] = useState(0)

  const step1Ref = useRef<HTMLDivElement>(null)
  const step2Ref = useRef<HTMLDivElement>(null)

  const scenarios = useMemo(() => {
    const dir = Number(directivos) || 0
    const prof = Number(profesionales) || 0
    const tec = Number(tecnicos) || 0

    return [
      {
        id: 1,
        title: "Escenario 1",
        subtitle: "Evaluación completa",
        icon: "💼",
        description:
          "Reportes Plus para profesionales y evaluación de competencias y aptitudes para todos los perfiles",
        tests: {
          competenciaPlus: dir + prof,
          pensamientoAnalitico: dir + prof,
          motivadores: 0,
          competenciasBasicas: tec,
          razonamientoGeneral: tec,
        },
      },
      {
        id: 2,
        title: "Escenario 2",
        subtitle: "Opción económica masiva",
        icon: "⚙️",
        description:
          "Reporte Básico para profesionales para ahorrar presupuesto en procesos masivos de reclutamiento y desarrollo y evaluación de aptitudes para todos los perfiles",
        tests: {
          competenciaPlus: dir,
          pensamientoAnalitico: dir + prof,
          motivadores: 0,
          competenciasBasicas: prof + tec,
          razonamientoGeneral: tec,
        },
      },
      {
        id: 3,
        title: "Escenario 3",
        subtitle: "Solo competencias avanzadas",
        icon: "🧠",
        description: "Evaluación de solo competencias sin aptitudes con Reportes Plus para profesionales",
        tests: {
          competenciaPlus: dir + prof,
          pensamientoAnalitico: 0,
          motivadores: 0,
          competenciasBasicas: tec,
          razonamientoGeneral: 0,
        },
      },
      {
        id: 4,
        title: "Escenario 4",
        subtitle: "Competencias básicas",
        icon: "🔍",
        description:
          "Evaluación de solo competencias sin aptitudes con Reportes Básicos para profesionales una opción para ahorrar presupuesto en procesos masivos de reclutamiento y desarrollo",
        tests: {
          competenciaPlus: dir,
          pensamientoAnalitico: 0,
          motivadores: 0,
          competenciasBasicas: prof + tec,
          razonamientoGeneral: 0,
        },
      },
    ]
  }, [directivos, profesionales, tecnicos])

  const totalPersonnel = (Number(directivos) || 0) + (Number(profesionales) || 0) + (Number(tecnicos) || 0)
  const hasData = totalPersonnel > 0

  useEffect(() => {
    if (currentStep === 2 && step2Ref.current && regenerationCount > 0) {
      console.log("[v0] Scrolling to step 2, regeneration count:", regenerationCount)
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [currentStep, regenerationCount])

  useEffect(() => {
    if (companyType === "local" && currency === "EUR") {
      console.log("[v0] Company type changed to local with EUR selected, switching to USD")
      setCurrency("USD")
    }
    if (companyType === "international" && currency === "DOP") {
      console.log("[v0] Company type changed to international with DOP selected, switching to USD")
      setCurrency("USD")
    }
  }, [companyType, currency])

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isSubmitted])

  const handleConsultQuote = async () => {
    if (!hasData || !companyType) return

    console.log("[v0] Clearing selected scenario, current value:", selectedScenario)
    setSelectedScenario(null)
    console.log("[v0] Selected scenario cleared")

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setCurrentStep(2)

    setRegenerationCount((prev) => prev + 1)
    console.log("[v0] Regeneration count incremented")
  }

  const handleSelectScenario = (scenarioId: number) => {
    setSelectedScenario(scenarioId)
    setIsSubmitted(true)
  }

  const WEBHOOK_URL = "https://n8n.srv1464241.hstgr.cloud/webhook/9a79886b-c75b-4fd1-a17a-99b88daf4c9c"

  const handleFormComplete = async (payload: Record<string, unknown>) => {
    const fullPayload = {
      ...payload,
      directivos: directivos || "0",
      profesionales: profesionales || "0",
      tecnicos: tecnicos || "0",
      companyType,
      currency,
      totalPersonnel,
      empresa_id: user?.empresa || "",
      responsable_id: user?.id || "",
      responsable_nombre: user?.nombre || "",
      responsable_email: user?.email || "",
    }
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
      })
    } catch (_e) {
      // Opcional: mostrar toast de error
    }
    const scenarioId = payload.scenarioId as number
    if (typeof scenarioId === "number") handleSelectScenario(scenarioId)
  }

  const StepIndicator = ({ step, isActive }: { step: number; isActive: boolean }) => (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
        isActive
          ? "bg-primary text-primary-foreground scale-110 shadow-lg"
          : currentStep > step
            ? "bg-green-500 text-white"
            : "bg-muted text-muted-foreground"
      }`}
    >
      {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
    </div>
  )

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-14 px-4">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500 text-white rounded-full p-6 shadow-xl">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">¡Solicitud procesada exitosamente!</h2>
        <div className="mx-auto max-w-xl">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Hemos recibido tu solicitud de cotización.
            <br className="hidden sm:block" />
            Te enviaremos una confirmación por email con todos los detalles.
          </p>
        </div>
        <Button
          onClick={() => {
            setCurrentStep(1)
            setIsSubmitted(false)
            setSelectedScenario(null)
            setDirectivos("")
            setProfesionales("")
            setTecnicos("")
            setCompanyType(null)
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
      {/* STEP 1: Input personnel data */}
      <div ref={step1Ref} className="relative">
        {currentStep >= 2 && (
          <div className="hidden md:block absolute left-5 top-14 bottom-0 w-0.5 bg-gradient-to-b from-green-500/50 via-primary/30 to-transparent" />
        )}

        <Card
          className={`shadow-md transition-all duration-300 ${currentStep === 1 ? "ring-2 ring-primary/50 shadow-xl" : "opacity-90"}`}
        >
          <CardHeader className="pb-3 pt-4 px-3 sm:px-5">
            <div className="flex items-start gap-3 md:gap-4">
              <StepIndicator step={1} isActive={currentStep === 1} />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="leading-tight">
                    Paso 1: Introduce la cantidad de personas de los grupos ocupacionales a evaluar
                  </span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5">
                  Ingrese el número de personas por cada grupo ocupacional para generar escenarios de acorde a tu
                  organización.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-5 pb-5 md:pl-[72px]">
            <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 lg:gap-8 items-center">
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
                  <Label htmlFor="directivos" className="text-sm sm:text-base font-semibold">
                    Directivos, Gerentes y Supervisores
                  </Label>
                  <Input
                    id="directivos"
                    type="number"
                    min="0"
                    placeholder="Ej: 36"
                    value={directivos}
                    onChange={(e) => setDirectivos(e.target.value)}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profesionales" className="text-sm sm:text-base font-semibold">
                    Profesionales
                  </Label>
                  <Input
                    id="profesionales"
                    type="number"
                    min="0"
                    placeholder="Ej: 78"
                    value={profesionales}
                    onChange={(e) => setProfesionales(e.target.value)}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tecnicos" className="text-sm sm:text-base font-semibold">
                    Técnicos y Apoyo
                  </Label>
                  <Input
                    id="tecnicos"
                    type="number"
                    min="0"
                    placeholder="Ej: 147"
                    value={tecnicos}
                    onChange={(e) => setTecnicos(e.target.value)}
                    className="text-sm sm:text-base h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="pt-3">
                  <Button
                    onClick={handleConsultQuote}
                    disabled={!hasData || !companyType || isLoading}
                    className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                        <span className="text-xs sm:text-base">Generando cotización...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="text-xs sm:text-base">
                          {currentStep === 1 ? "Generar cotización" : "Regenerar cotización"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Right column: Image */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-3 sm:p-4 shadow-inner">
                <Image
                  src="/images/grupo-ocupacionales.png"
                  alt="Grupos Ocupacionales - Clasificación de roles organizacionales"
                  width={1200}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-sm"
                  priority
                />
                <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2 sm:mt-3">
                  Referencia visual de la clasificación de pruebas por grupos ocupacionales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STEP 2: Choose scenario */}
      {currentStep >= 2 && companyType && (
        <div ref={step2Ref} className="relative">
          <Card
            className={`shadow-md transition-all duration-300 ${currentStep === 2 ? "ring-2 ring-primary/50 shadow-xl" : "opacity-90"}`}
          >
            <CardHeader className="pb-3 pt-4 px-3 sm:px-5">
              <div className="flex items-start gap-3 md:gap-4">
                <StepIndicator step={2} isActive={currentStep === 2} />
                <div className="flex-1 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg md:text-xl leading-tight">
                      Paso 2: Elige el escenario que más se adapta a tus necesidades
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1.5">
                      Hemos generado <span className="font-semibold text-primary">4 opciones optimizadas</span> para{" "}
                      <span className="font-semibold text-foreground">{totalPersonnel} personas</span>.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">Moneda:</span>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-[120px] sm:w-[140px] bg-background h-9 sm:h-10 text-xs sm:text-sm border-2 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {companyType === "international" ? (
                          <>
                            <SelectItem value="USD">💵 USD</SelectItem>
                            <SelectItem value="EUR">💶 EUR</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="USD">💵 USD</SelectItem>
                            <SelectItem value="DOP">🇩🇴 DOP</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-5 pb-5 md:pl-[72px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    basePrices={BASE_PRICES}
                    getPriceByVolume={getPriceByVolume}
                    itbisRate={ITBIS_RATE}
                    currency={currency}
                    exchangeRateUSD={exchangeRateUSD}
                    exchangeRateEUR={exchangeRateEUR}
                    companyType={companyType}
                    onSelect={handleSelectScenario}
                    onFormComplete={handleFormComplete}
                  />
                ))}
              </div>

              <ObservationsSection />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
