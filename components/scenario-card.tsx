"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, ChevronRight, ChevronLeft, Loader2, Calendar, FileText } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getCalApi } from "@calcom/embed-react"
import { AnimatePresence, motion, LayoutGroup } from "framer-motion"

interface ScenarioCardProps {
  scenario: {
    id: number
    title: string
    subtitle: string
    icon: string
    description: string
    tests: {
      competenciaPlus: number
      pensamientoAnalitico: number
      motivadores: number
      competenciasBasicas: number
      razonamientoGeneral: number
    }
  }
  basePrices: {
    competenciaPlus: number
    pensamientoAnalitico: number
    motivadores: number
    competenciasBasicas: number
    razonamientoGeneral: number
  }
  getPriceByVolume: (testType: string, quantity: number) => number
  itbisRate: number
  currency: string
  exchangeRateUSD: number
  exchangeRateEUR: number
  companyType: "local" | "international"
  onSelect?: (scenarioId: number) => void
}

const TEST_NAMES = {
  competenciaPlus: "Test Competencias Plus",
  pensamientoAnalitico: "Test Pens. Analítico y Sistémico",
  motivadores: "Test Motivadores",
  competenciasBasicas: "Test Competencias Básicas",
  razonamientoGeneral: "Test Razonamiento General",
}

const ALEGRA_TEST_IDS: Record<string, number> = {
  "Test Competencias Plus": 1,
  "Test Pens. Analítico y Sistémico": 2,
  "Test Motivadores": 3,
  "Test Competencias Básicas": 4,
  "Test Razonamiento General": 5,
}

export default function ScenarioCard({
  scenario,
  basePrices,
  getPriceByVolume,
  itbisRate,
  currency,
  exchangeRateUSD,
  exchangeRateEUR,
  companyType,
  onSelect,
}: ScenarioCardProps) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1-4 = steps, 5 = success
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    razonSocial: "",
    rnc: "",
    direccion: "",
    tipoNCF: "",
    medioEntrega: "",
    contactoFact1Nombre: "",
    contactoFact1Posicion: "",
    contactoFact1Email: "",
    contactoFact1Telefono: "",
    contactoFact2Nombre: "",
    contactoFact2Posicion: "",
    contactoFact2Email: "",
    contactoFact2Telefono: "",
    contactoAdmin1Nombre: "",
    contactoAdmin1Posicion: "",
    contactoAdmin1Email: "",
    contactoAdmin1Telefono: "",
    contactoAdmin2Nombre: "",
    contactoAdmin2Posicion: "",
    contactoAdmin2Email: "",
    contactoAdmin2Telefono: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [returnToReview, setReturnToReview] = useState(false)

  const isValidEmail = (email: string): boolean => {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhone = (phone: string): boolean => {
    if (!phone) return true
    const digitsOnly = phone.replace(/\D/g, "")
    return digitsOnly.length === 10
  }

  const convertCurrency = (amountUSD: number): number => {
    if (currency === "DOP") {
      return amountUSD * exchangeRateUSD
    } else if (currency === "EUR") {
      return amountUSD
    }
    return amountUSD
  }

  const calculations = useMemo(() => {
    const testDetails = Object.entries(scenario.tests).map(([key, qty]) => {
      const basePrice = basePrices[key as keyof typeof basePrices]
      const priceWithDiscount = qty > 0 ? getPriceByVolume(key, qty) : 0

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

    const itbisAmount = companyType === "local" ? subtotalWithDiscount * itbisRate : 0
    const totalUSD = subtotalWithDiscount + itbisAmount

    let total = totalUSD
    let symbol = "$"
    if (currency === "DOP") {
      total = totalUSD * exchangeRateUSD
      symbol = "RD$"
    } else if (currency === "EUR") {
      total = totalUSD
      symbol = "€"
    }

    const totalTests = Object.values(scenario.tests).reduce((a, b) => a + b, 0)

    return {
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
  }, [scenario.tests, basePrices, getPriceByVolume, itbisRate, currency, exchangeRateUSD, exchangeRateEUR, companyType])

  const formatCurrency = (amount: number, symbol = "$") => {
    return `${symbol} ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const hasPlusTests = calculations.testDetails.some((test) =>
    ["competenciaPlus", "pensamientoAnalitico", "motivadores"].includes(test.key),
  )
  const hasBasicTests = calculations.testDetails.some((test) =>
    ["competenciasBasicas", "razonamientoGeneral"].includes(test.key),
  )

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.razonSocial) newErrors.razonSocial = "Este campo es obligatorio."
    if (!formData.rnc) newErrors.rnc = "Este campo es obligatorio."
    if (!formData.direccion) newErrors.direccion = "Este campo es obligatorio."
    if (!formData.tipoNCF) newErrors.tipoNCF = "Selecciona una opción."
    if (!formData.medioEntrega) newErrors.medioEntrega = "Selecciona una opción."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.contactoFact1Nombre) newErrors.contactoFact1Nombre = "Este campo es obligatorio."
    if (!formData.contactoFact1Posicion) newErrors.contactoFact1Posicion = "Este campo es obligatorio."
    if (!formData.contactoFact1Email) {
      newErrors.contactoFact1Email = "Este campo es obligatorio."
    } else if (!isValidEmail(formData.contactoFact1Email)) {
      newErrors.contactoFact1Email = "Introduce un correo válido."
    }
    if (!formData.contactoFact1Telefono) {
      newErrors.contactoFact1Telefono = "Este campo es obligatorio."
    } else if (!isValidPhone(formData.contactoFact1Telefono)) {
      newErrors.contactoFact1Telefono = "Introduce un teléfono válido (10 dígitos)."
    }

    if (formData.contactoFact2Email && !isValidEmail(formData.contactoFact2Email)) {
      newErrors.contactoFact2Email = "Introduce un correo válido."
    }
    if (formData.contactoFact2Telefono && !isValidPhone(formData.contactoFact2Telefono)) {
      newErrors.contactoFact2Telefono = "Introduce un teléfono válido (10 dígitos)."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.contactoAdmin1Nombre) newErrors.contactoAdmin1Nombre = "Este campo es obligatorio."
    if (!formData.contactoAdmin1Posicion) newErrors.contactoAdmin1Posicion = "Este campo es obligatorio."
    if (!formData.contactoAdmin1Email) {
      newErrors.contactoAdmin1Email = "Este campo es obligatorio."
    } else if (!isValidEmail(formData.contactoAdmin1Email)) {
      newErrors.contactoAdmin1Email = "Introduce un correo válido."
    }
    if (!formData.contactoAdmin1Telefono) {
      newErrors.contactoAdmin1Telefono = "Este campo es obligatorio."
    } else if (!isValidPhone(formData.contactoAdmin1Telefono)) {
      newErrors.contactoAdmin1Telefono = "Introduce un teléfono válido (10 dígitos)."
    }

    if (formData.contactoAdmin2Email && !isValidEmail(formData.contactoAdmin2Email)) {
      newErrors.contactoAdmin2Email = "Introduce un correo válido."
    }
    if (formData.contactoAdmin2Telefono && !isValidPhone(formData.contactoAdmin2Telefono)) {
      newErrors.contactoAdmin2Telefono = "Introduce un teléfono válido (10 dígitos)."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      // Step 1 validation
      if (!formData.razonSocial) newErrors.razonSocial = "Campo requerido"
      if (!formData.rnc) newErrors.rnc = "Campo requerido"
      if (!formData.direccion) newErrors.direccion = "Campo requerido"
      if (!formData.tipoNCF) newErrors.tipoNCF = "Debe seleccionar un tipo de NCF"
      if (!formData.medioEntrega) newErrors.medioEntrega = "Debe seleccionar un medio de entrega"
    } else if (currentStep === 2) {
      // Step 2 validation
      if (!formData.contactoFact1Nombre) newErrors.contactoFact1Nombre = "Campo requerido"
      if (!formData.contactoFact1Posicion) newErrors.contactoFact1Posicion = "Campo requerido"
      if (!formData.contactoFact1Email) newErrors.contactoFact1Email = "Campo requerido"
      if (!formData.contactoFact1Telefono) newErrors.contactoFact1Telefono = "Campo requerido"
    } else if (currentStep === 3) {
      // Step 3 validation
      if (!formData.contactoAdmin1Nombre) newErrors.contactoAdmin1Nombre = "Campo requerido"
      if (!formData.contactoAdmin1Posicion) newErrors.contactoAdmin1Posicion = "Campo requerido"
      if (!formData.contactoAdmin1Email) newErrors.contactoAdmin1Email = "Campo requerido"
      if (!formData.contactoAdmin1Telefono) newErrors.contactoAdmin1Telefono = "Campo requerido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setDirection(1)
    if (returnToReview && currentStep < 4) {
      setCurrentStep(4)
      setReturnToReview(false)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      // Close dialog when going back from step 1
      setShowOnboardingDialog(false)
      setShowDetailsDialog(true)
      return
    }

    setDirection(-1)
    setCurrentStep((prev) => prev - 1)
    // Clear any errors when going back
    setErrors({})
  }

  const handleEditFromStep4 = (step: number) => {
    setReturnToReview(true)
    setDirection(-1)
    setCurrentStep(step)
  }

  const handleSubmit = async () => {
    if (!confirmationChecked) {
      setErrors({ confirmation: "Debe confirmar para continuar" })
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setCurrentStep(5) // Success screen
  }

  const sceneVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -24 : 24,
      opacity: 0,
      transition: {
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "30min" })
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#E7540E" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  const handleScheduleMeeting = () => {
    const button = document.createElement("button")
    button.setAttribute("data-cal-namespace", "30min")
    button.setAttribute("data-cal-link", "carlos-santos/30min")
    button.setAttribute("data-cal-config", '{"layout":"month_view","theme":"light"}')
    button.style.display = "none"
    document.body.appendChild(button)
    button.click()
    document.body.removeChild(button)
  }

  const handleContinueWithQuote = () => {
    setShowDetailsDialog(false)
    setTimeout(() => {
      setShowOnboardingDialog(true)
      setCurrentStep(1) // Start directly with step 1
    }, 100)
  }

  return (
    <>
      {/* Card Component - Keep exactly as is */}
      <Card className="shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50 flex flex-col h-full group">
        <CardHeader className="pb-2 pt-2 px-4">
          <div className="flex flex-col gap-2 h-full">
            <Badge className="w-fit text-xs font-semibold px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90">
              {scenario.title}
            </Badge>

            <div className="min-h-[140px] flex items-start pt-1">
              <p className="text-sm leading-relaxed text-foreground">{scenario.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4 flex-1 flex flex-col">
          <div className="overflow-x-auto -mx-1 flex-1">
            <div className="min-w-full text-xs border-2 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#2d1b69] to-[#3d2b79] text-white grid grid-cols-2 gap-1 p-2.5 text-xs font-bold">
                <div>Prueba</div>
                <div className="text-center">Cantidad</div>
              </div>

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
                {companyType === "local" && (
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
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs bg-transparent hover:bg-primary/10 hover:text-foreground border-2 transition-colors"
            onClick={() => setShowDetailsDialog(true)}
          >
            Ver detalles completos
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>

          <Separator />

          <Button
            className="w-full h-10 text-sm font-bold shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
            onClick={() => setShowDetailsDialog(true)}
          >
            <Check className="h-4 w-4 mr-2" />
            Seleccionar este escenario
          </Button>
        </CardContent>
      </Card>

      {/* Dialog 1: Scenario Details */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="!max-w-[95vw] w-[95vw] !max-h-[95vh] overflow-hidden p-0">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-2">¡Ya casi estás listo!</DialogTitle>
              <p className="text-white/90 text-base">Revisa tu escenario y elige cómo deseas continuar.</p>
            </DialogHeader>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 px-6 py-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Left Column: Scenario Table (unchanged) */}
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-5 border">
                <div className="flex items-center gap-3 mb-5">
                  <Badge className="bg-primary text-primary-foreground text-base px-4 py-1">{scenario.title}</Badge>
                  <span className="text-base text-muted-foreground">- Resumen de tu selección</span>
                </div>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">{scenario.description}</p>

                {/* Desktop Table View - Keep EXACTLY as is */}
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

                      {companyType === "local" && (
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

            {/* Right Column: Action Panel & Observations */}
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Primary Action */}
                <Card
                  className="border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-primary/5 to-transparent cursor-pointer group"
                  onClick={handleContinueWithQuote}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-base font-bold text-foreground">Continuar con esta cotización</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Completa tus datos para la facturación y la gestión de la plataforma.
                        </p>
                        <div className="pt-2">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm">
                            Empezar ahora
                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm font-medium text-muted-foreground px-2">O</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Secondary Action */}
                <Card
                  className="border-2 hover:border-muted-foreground/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={handleScheduleMeeting}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-base font-bold text-foreground">Agendar reunión con Multiplicity</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Habla con un asesor antes de confirmar.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold">Observaciones</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Conditions */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Condiciones</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Pago único</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Las licencias de evaluaciones por uso no tienen fecha de vencimiento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Permitido canjear productos de evaluación</span>
                      </li>
                    </ul>
                  </div>

                  {/* Modality */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Modalidad</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Autogestión
                    </p>
                  </div>

                  {/* Accordion for Responsibilities */}
                  <Accordion type="single" collapsible className="border rounded-lg">
                    <AccordionItem value="responsibilities" className="border-none">
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <span className="font-semibold text-sm">Ver responsabilidades</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 text-sm">
                          {/* Multiplicity Responsibilities */}
                          <div>
                            <h5 className="font-semibold mb-2">Responsabilidades de Multiplicity:</h5>
                            <ul className="space-y-1 text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>
                                  Ofrecer entrenamientos iniciales virtuales: Bases Conceptuales y Taller Gestión de la
                                  Plataforma
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Acompañamiento en definición de perfiles</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Otorgar claves de acceso a los administradores</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Soporte incidencias técnicas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Asesoría en interpretación de resultados</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Manuales de Uso</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">
                                    Talleres para Implementar un Proceso de Valoración Integral:
                                  </span>
                                  <ul className="ml-4 mt-1 space-y-1">
                                    <li>- Entrevista por Competencias</li>
                                    <li>- Convirtiendo los datos de evaluación en entendimiento</li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                          </div>

                          {/* Guides */}
                          <div>
                            <h5 className="font-semibold mb-2">
                              Guías (Disponibles a través del Repositorio de Contenido Multiplicity Conecta):
                            </h5>
                            <ul className="space-y-1 text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Interpretación de Resultados</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Retroalimentación</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Pautas de Autodesarrollo</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Entrevista por Competencias</span>
                              </li>
                            </ul>
                          </div>

                          {/* Client Responsibilities */}
                          <div>
                            <h5 className="font-semibold mb-2">Responsabilidades del Cliente:</h5>
                            <ul className="space-y-1 text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Administrar los perfiles ideales dentro de la plataforma</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>Enviar invitaciones y recordatorios a los evaluados</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>
                                  Generar reportes: Estatus de evaluaciones, resultados individuales, resumen,
                                  participante y grupales
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>
                                  Leer y hacer uso del Manual Funcional de la Plataforma y de los documentos de
                                  valoración integral para implementar buenas prácticas de evaluación
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                <span>
                                  Administrar (Crear/eliminar) usuarios para los administradores de la plataforma en su
                                  empresa
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Onboarding - Transformed into 2-panel entry console with fixed height */}
      <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
        <DialogContent className="!max-w-[1000px] w-[95vw] !max-h-[860px] h-[90vh] overflow-hidden p-0 border-0 rounded-3xl shadow-2xl">
          <LayoutGroup>
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === 5 ? (
                <motion.div
                  key="success"
                  custom={direction}
                  variants={sceneVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="p-8 text-center space-y-6 relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      duration: 0.6,
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto shadow-xl"
                  >
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                    >
                      <Check className="h-12 w-12 text-white stroke-[3]" />
                    </motion.div>
                  </motion.div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">¡Formulario enviado con éxito!</h2>
                    <p className="text-muted-foreground text-lg">Hemos recibido tu información correctamente.</p>
                  </div>

                  <Card className="border-2 border-[#4DB8B8]/20 bg-[#4DB8B8]/5">
                    <CardContent className="p-6 space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#4DB8B8] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          1
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Se generará una factura con los datos proporcionados que será enviada al correo electrónico
                            del contacto administrativo principal.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#4DB8B8] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          2
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                          Recibirás tus credenciales de acceso a la plataforma y a los contenidos 
                          que te permitirán la gestión de la misma.
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#4DB8B8] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          3
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Recibirás acceso a la plataforma una vez completado el pago y el proceso de entrada a la
                            plataforma.
                          </p>
                        </div>
                      </div> */}
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => {
                      setShowOnboardingDialog(false)
                      setCurrentStep(1)
                      // Reset form
                      setFormData({
                        razonSocial: "",
                        rnc: "",
                        direccion: "",
                        tipoNCF: "",
                        medioEntrega: "",
                        contactoFact1Nombre: "",
                        contactoFact1Posicion: "",
                        contactoFact1Email: "",
                        contactoFact1Telefono: "",
                        contactoFact2Nombre: "",
                        contactoFact2Posicion: "",
                        contactoFact2Email: "",
                        contactoFact2Telefono: "",
                        contactoAdmin1Nombre: "",
                        contactoAdmin1Posicion: "",
                        contactoAdmin1Email: "",
                        contactoAdmin1Telefono: "",
                        contactoAdmin2Nombre: "",
                        contactoAdmin2Posicion: "",
                        contactoAdmin2Email: "",
                        contactoAdmin2Telefono: "",
                      })
                      setConfirmationChecked(false)
                    }}
                    className="bg-gradient-to-r from-[#4DB8B8] to-[#3A9A9A] hover:opacity-90 text-white px-8"
                  >
                    Cerrar
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={`form-${currentStep}`}
                  custom={direction}
                  variants={sceneVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full flex min-h-0"
                >
                  {/* LEFT PANEL - Fixed, no scroll */}
                  <div className="w-[340px] bg-gradient-to-b from-[#4DB8B8]/5 via-[#4DB8B8]/3 to-white border-r flex flex-col">
                    {/* Top: Branding */}
                    <div className="p-6 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DB8B8] to-[#3A9A9A] flex items-center justify-center shadow-md">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Multiplicity</div>
                          <div className="text-xs text-muted-foreground">Formulario de conocimiento de Nuevos Clientes</div>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Vertical Stepper */}
                    <div className="flex-1 p-6 space-y-4">
                      {[
                        { num: 1, title: "Información de la empresa", desc: "Datos fiscales y facturación" },
                        { num: 2, title: "Contactos administrativos", desc: "Personas que gestionan las facturas." },
                        { num: 3, title: "Contactos Administradores de la plataforma", desc: "Personas que gestionarán la plataforma" },
                        { num: 4, title: "Confirmación", desc: "Revisa y confirma" },
                      ].map((step) => {
                        const isCompleted = step.num < currentStep
                        const isCurrent = step.num === currentStep
                        const isPending = step.num > currentStep

                        return (
                          <motion.div
                            key={step.num}
                            initial={false}
                            animate={{
                              scale: isCurrent ? 1 : 0.98,
                              opacity: isPending ? 0.5 : 1,
                            }}
                            className={`
                              relative pl-8 pb-4 border-l-2 transition-all
                              ${isCurrent ? "border-[#4DB8B8]" : isCompleted ? "border-[#4DB8B8]/40" : "border-gray-200"}
                              ${step.num === 4 ? "border-l-0" : ""}
                            `}
                          >
                            <motion.div
                              className={`
                                absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                ${isCurrent ? "bg-gradient-to-br from-[#4DB8B8] to-[#3A9A9A] text-white shadow-lg ring-4 ring-[#4DB8B8]/20" : ""}
                                ${isCompleted ? "bg-[#4DB8B8] text-white" : ""}
                                ${isPending ? "bg-white border-2 border-gray-300 text-gray-400" : ""}
                              `}
                              initial={false}
                              animate={isCompleted ? { scale: [1, 1.15, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.num}
                            </motion.div>

                            <div
                              className={`transition-colors ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              <div className={`font-semibold text-sm mb-1 ${isCurrent ? "text-[#4DB8B8]" : ""}`}>
                                {step.title}
                              </div>
                              <div className="text-xs">{step.desc}</div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* RIGHT PANEL - Scrollable content */}
                  <div className="flex-1 flex flex-col h-full min-h-0">
                    {/* Right Header - Sticky */}
                    <div className="flex-shrink-0 bg-white border-b px-8 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {currentStep === 1 && "Información de la empresa"}
                            {currentStep === 2 && "Contactos administrativos"}
                            {currentStep === 3 && "Contactos Administradores de la plataforma"}
                            {currentStep === 4 && "Confirmación final"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentStep === 1 && "Estos datos se usarán para generar tu factura"}
                            {currentStep === 2 && "Personas que gestionan las facturas"}
                            {currentStep === 3 && "Personas que gestionarán la plataforma"}
                            {currentStep === 4 && "Revisa toda la información antes de enviar"}
                          </p>
                        </div>
                        {/* <Badge className="bg-[#4DB8B8]/10 text-[#4DB8B8] hover:bg-[#4DB8B8]/20 border-0">
                          Paso {currentStep} de 4
                        </Badge> */}
                      </div>
                    </div>

                    {/* Right Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 pb-28 min-h-0">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={`form-${currentStep}`}
                          custom={direction}
                          initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {currentStep === 1 && (
                            <Card className="border-2 border-gray-100 shadow-sm">
                              <CardContent className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="razonSocial" className="text-sm font-medium">
                                      Razón Social <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="razonSocial"
                                      value={formData.razonSocial}
                                      onChange={(e) => updateFormData("razonSocial", e.target.value)}
                                      placeholder="Ej: Acme Corp"
                                      className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.razonSocial ? "border-red-500" : ""}`}
                                    />
                                    {errors.razonSocial && (
                                      <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-500"
                                      >
                                        {errors.razonSocial}
                                      </motion.p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="rnc" className="text-sm font-medium">
                                      RNC / NIF <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="rnc"
                                      value={formData.rnc}
                                      onChange={(e) => updateFormData("rnc", e.target.value)}
                                      placeholder="Ej: 123456789"
                                      className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.rnc ? "border-red-500" : ""}`}
                                    />
                                    {errors.rnc && (
                                      <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-500"
                                      >
                                        {errors.rnc}
                                      </motion.p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="direccion" className="text-sm font-medium">
                                    Dirección <span className="text-red-500">*</span>
                                  </Label>
                                  <textarea
                                    id="direccion"
                                    value={formData.direccion}
                                    onChange={(e) => updateFormData("direccion", e.target.value)}
                                    placeholder="Ingresa la dirección completa de la empresa"
                                    rows={3}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] focus:outline-none transition-all resize-none ${errors.direccion ? "border-red-500" : "border-input"}`}
                                  />
                                  {errors.direccion && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs text-red-500"
                                    >
                                      {errors.direccion}
                                    </motion.p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Tipo de NCF <span className="text-red-500">*</span>
                                  </Label>
                                  <RadioGroup
                                    value={formData.tipoNCF}
                                    onValueChange={(value) => updateFormData("tipoNCF", value)}
                                  >
                                    <div className="space-y-2">
                                      {[
                                        { value: "credito", label: "Crédito Fiscal", desc: "Para empresas con NCF" },
                                        { value: "consumo", label: "Consumo", desc: "Factura simplificada" },
                                      ].map((option) => (
                                        <label
                                          key={option.value}
                                          className={`
                                            flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                                            ${formData.tipoNCF === option.value ? "border-[#4DB8B8] bg-[#4DB8B8]/5 shadow-sm" : "border-gray-200 hover:border-[#4DB8B8]/40 hover:bg-gray-50"}
                                          `}
                                        >
                                          <RadioGroupItem value={option.value} id={option.value} className="border-2" />
                                          <div className="flex-1">
                                            <div className="font-medium text-sm">{option.label}</div>
                                            <div className="text-xs text-muted-foreground">{option.desc}</div>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                  {errors.tipoNCF && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs text-red-500"
                                    >
                                      {errors.tipoNCF}
                                    </motion.p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Medio de entrega de factura <span className="text-red-500">*</span>
                                  </Label>
                                  <RadioGroup
                                    value={formData.medioEntrega}
                                    onValueChange={(value) => updateFormData("medioEntrega", value)}
                                  >
                                    <div className="space-y-2">
                                      {[
                                        {
                                          value: "email",
                                          label: "Correo electrónico",
                                          desc: "Recibirás la factura por email",
                                        },
                                        { value: "fisica", label: "Entrega física", desc: "Recoger en oficina" },
                                      ].map((option) => (
                                        <label
                                          key={option.value}
                                          className={`
                                            flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                                            ${formData.medioEntrega === option.value ? "border-[#4DB8B8] bg-[#4DB8B8]/5 shadow-sm" : "border-gray-200 hover:border-[#4DB8B8]/40 hover:bg-gray-50"}
                                          `}
                                        >
                                          <RadioGroupItem
                                            value={option.value}
                                            id={`entrega-${option.value}`}
                                            className="border-2"
                                          />
                                          <div className="flex-1">
                                            <div className="font-medium text-sm">{option.label}</div>
                                            <div className="text-xs text-muted-foreground">{option.desc}</div>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                  {errors.medioEntrega && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs text-red-500"
                                    >
                                      {errors.medioEntrega}
                                    </motion.p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {currentStep === 2 && (
                            <Card className="border-2 border-gray-100 shadow-sm">
                              <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#4DB8B8]/10 flex items-center justify-center">
                                      <span className="text-sm font-bold text-[#4DB8B8]">1</span>
                                    </div>
                                    <h4 className="font-semibold">Contacto principal</h4>
                                    <Badge variant="secondary" className="text-xs">
                                      Obligatorio
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact1Nombre" className="text-sm font-medium">
                                        Nombre completo <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoFact1Nombre"
                                        value={formData.contactoFact1Nombre}
                                        onChange={(e) => updateFormData("contactoFact1Nombre", e.target.value)}
                                        placeholder="Ej: Juan Pérez"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact1Nombre ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact1Nombre && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact1Nombre}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact1Posicion" className="text-sm font-medium">
                                        Posición <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoFact1Posicion"
                                        value={formData.contactoFact1Posicion}
                                        onChange={(e) => updateFormData("contactoFact1Posicion", e.target.value)}
                                        placeholder="Ej: Director Financiero"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact1Posicion ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact1Posicion && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact1Posicion}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact1Email" className="text-sm font-medium">
                                        Correo electrónico <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoFact1Email"
                                        type="email"
                                        value={formData.contactoFact1Email}
                                        onChange={(e) => updateFormData("contactoFact1Email", e.target.value)}
                                        placeholder="ejemplo@empresa.com"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact1Email ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact1Email && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact1Email}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact1Telefono" className="text-sm font-medium">
                                        Teléfono <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoFact1Telefono"
                                        type="tel"
                                        value={formData.contactoFact1Telefono}
                                        onChange={(e) => updateFormData("contactoFact1Telefono", e.target.value)}
                                        placeholder="8091234567"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact1Telefono ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact1Telefono && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact1Telefono}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                      <span className="text-sm font-bold text-gray-500">2</span>
                                    </div>
                                    <h4 className="font-semibold">Contacto adicional</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Opcional
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact2Nombre" className="text-sm font-medium">
                                        Nombre completo
                                      </Label>
                                      <Input
                                        id="contactoFact2Nombre"
                                        value={formData.contactoFact2Nombre}
                                        onChange={(e) => updateFormData("contactoFact2Nombre", e.target.value)}
                                        placeholder="Ej: María García"
                                        className="h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact2Posicion" className="text-sm font-medium">
                                        Posición
                                      </Label>
                                      <Input
                                        id="contactoFact2Posicion"
                                        value={formData.contactoFact2Posicion}
                                        onChange={(e) => updateFormData("contactoFact2Posicion", e.target.value)}
                                        placeholder="Ej: Contador"
                                        className="h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact2Email" className="text-sm font-medium">
                                        Correo electrónico
                                      </Label>
                                      <Input
                                        id="contactoFact2Email"
                                        type="email"
                                        value={formData.contactoFact2Email}
                                        onChange={(e) => updateFormData("contactoFact2Email", e.target.value)}
                                        placeholder="ejemplo@empresa.com"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact2Email ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact2Email && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact2Email}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoFact2Telefono" className="text-sm font-medium">
                                        Teléfono
                                      </Label>
                                      <Input
                                        id="contactoFact2Telefono"
                                        type="tel"
                                        value={formData.contactoFact2Telefono}
                                        onChange={(e) => updateFormData("contactoFact2Telefono", e.target.value)}
                                        placeholder="8091234567"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoFact2Telefono ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoFact2Telefono && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoFact2Telefono}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {currentStep === 3 && (
                            <Card className="border-2 border-gray-100 shadow-sm">
                              <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#4DB8B8]/10 flex items-center justify-center">
                                      <span className="text-sm font-bold text-[#4DB8B8]">1</span>
                                    </div>
                                    <h4 className="font-semibold">Administrador principal</h4>
                                    <Badge variant="secondary" className="text-xs">
                                      Obligatorio
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin1Nombre" className="text-sm font-medium">
                                        Nombre completo <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoAdmin1Nombre"
                                        value={formData.contactoAdmin1Nombre}
                                        onChange={(e) => updateFormData("contactoAdmin1Nombre", e.target.value)}
                                        placeholder="Ej: Ana López"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin1Nombre ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin1Nombre && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin1Nombre}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin1Posicion" className="text-sm font-medium">
                                        Posición <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoAdmin1Posicion"
                                        value={formData.contactoAdmin1Posicion}
                                        onChange={(e) => updateFormData("contactoAdmin1Posicion", e.target.value)}
                                        placeholder="Ej: Gerente de RRHH"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin1Posicion ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin1Posicion && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin1Posicion}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin1Email" className="text-sm font-medium">
                                        Correo electrónico <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoAdmin1Email"
                                        type="email"
                                        value={formData.contactoAdmin1Email}
                                        onChange={(e) => updateFormData("contactoAdmin1Email", e.target.value)}
                                        placeholder="ejemplo@empresa.com"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin1Email ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin1Email && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin1Email}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin1Telefono" className="text-sm font-medium">
                                        Teléfono <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="contactoAdmin1Telefono"
                                        type="tel"
                                        value={formData.contactoAdmin1Telefono}
                                        onChange={(e) => updateFormData("contactoAdmin1Telefono", e.target.value)}
                                        placeholder="8091234567"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin1Telefono ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin1Telefono && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin1Telefono}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                      <span className="text-sm font-bold text-gray-500">2</span>
                                    </div>
                                    <h4 className="font-semibold">Administrador adicional</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Opcional
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin2Nombre" className="text-sm font-medium">
                                        Nombre completo
                                      </Label>
                                      <Input
                                        id="contactoAdmin2Nombre"
                                        value={formData.contactoAdmin2Nombre}
                                        onChange={(e) => updateFormData("contactoAdmin2Nombre", e.target.value)}
                                        placeholder="Ej: Carlos Martínez"
                                        className="h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin2Posicion" className="text-sm font-medium">
                                        Posición
                                      </Label>
                                      <Input
                                        id="contactoAdmin2Posicion"
                                        value={formData.contactoAdmin2Posicion}
                                        onChange={(e) => updateFormData("contactoAdmin2Posicion", e.target.value)}
                                        placeholder="Ej: Coordinador de Talento"
                                        className="h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin2Email" className="text-sm font-medium">
                                        Correo electrónico
                                      </Label>
                                      <Input
                                        id="contactoAdmin2Email"
                                        type="email"
                                        value={formData.contactoAdmin2Email}
                                        onChange={(e) => updateFormData("contactoAdmin2Email", e.target.value)}
                                        placeholder="ejemplo@empresa.com"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin2Email ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin2Email && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin2Email}
                                        </motion.p>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="contactoAdmin2Telefono" className="text-sm font-medium">
                                        Teléfono
                                      </Label>
                                      <Input
                                        id="contactoAdmin2Telefono"
                                        type="tel"
                                        value={formData.contactoAdmin2Telefono}
                                        onChange={(e) => updateFormData("contactoAdmin2Telefono", e.target.value)}
                                        placeholder="8091234567"
                                        className={`h-12 border-2 focus:ring-2 focus:ring-[#4DB8B8]/20 focus:border-[#4DB8B8] transition-all ${errors.contactoAdmin2Telefono ? "border-red-500" : ""}`}
                                      />
                                      {errors.contactoAdmin2Telefono && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="text-xs text-red-500"
                                        >
                                          {errors.contactoAdmin2Telefono}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {currentStep === 4 && (
                            <div className="space-y-4">
                              {/* Review sections with edit capability */}
                              <Card className="border-2 border-gray-100">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Información de la empresa</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditFromStep4(1)}
                                      className="text-[#4DB8B8] hover:text-[#4DB8B8] hover:bg-[#4DB8B8]/10"
                                    >
                                      Editar
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-muted-foreground">Razón Social:</span>
                                      <p className="font-medium">{formData.razonSocial}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">RNC / NIF:</span>
                                      <p className="font-medium">{formData.rnc}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Dirección:</span>
                                    <p className="font-medium">{formData.direccion}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-muted-foreground">Tipo de NCF:</span>
                                      <p className="font-medium capitalize">{formData.tipoNCF}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Medio de entrega:</span>
                                      <p className="font-medium capitalize">{formData.medioEntrega}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-2 border-gray-100">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Contactos administrativos</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditFromStep4(2)}
                                      className="text-[#4DB8B8] hover:text-[#4DB8B8] hover:bg-[#4DB8B8]/10"
                                    >
                                      Editar
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Contacto principal</p>
                                    <p className="font-medium">
                                      {formData.contactoFact1Nombre} - {formData.contactoFact1Posicion}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {formData.contactoFact1Email} | {formData.contactoFact1Telefono}
                                    </p>
                                  </div>
                                  {formData.contactoFact2Nombre && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Contacto adicional</p>
                                      <p className="font-medium">
                                        {formData.contactoFact2Nombre} - {formData.contactoFact2Posicion}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {formData.contactoFact2Email} | {formData.contactoFact2Telefono}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              <Card className="border-2 border-gray-100">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Administradores de plataforma</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditFromStep4(3)}
                                      className="text-[#4DB8B8] hover:text-[#4DB8B8] hover:bg-[#4DB8B8]/10"
                                    >
                                      Editar
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Administrador principal</p>
                                    <p className="font-medium">
                                      {formData.contactoAdmin1Nombre} - {formData.contactoAdmin1Posicion}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {formData.contactoAdmin1Email} | {formData.contactoAdmin1Telefono}
                                    </p>
                                  </div>
                                  {formData.contactoAdmin2Nombre && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Administrador adicional</p>
                                      <p className="font-medium">
                                        {formData.contactoAdmin2Nombre} - {formData.contactoAdmin2Posicion}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {formData.contactoAdmin2Email} | {formData.contactoAdmin2Telefono}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              <Card className="border-2 border-[#4DB8B8]/20 bg-[#4DB8B8]/5">
                                <CardContent className="p-5 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      id="confirmation"
                                      checked={confirmationChecked}
                                      onCheckedChange={(checked) => {
                                        setConfirmationChecked(checked as boolean)
                                        if (errors.confirmation) {
                                          setErrors((prev) => {
                                            const newErrors = { ...prev }
                                            delete newErrors.confirmation
                                            return newErrors
                                          })
                                        }
                                      }}
                                      className="mt-1 border-2"
                                    />
                                    <label
                                      htmlFor="confirmation"
                                      className="text-xs sm:text-sm leading-relaxed cursor-pointer select-none"
                                    >
                                      <span className="font-semibold text-foreground">
                                        Confirmo que he revisado toda la información proporcionada
                                      </span>{" "}
                                      y con la misma Multiplicity genera la factura y remitirá las credenciales de acceso a los administradores de la plataforma.
                                      {/* comenzara el proceso de entrada
                                      con los datos suministrados. Entiendo que recibiré la factura por correo
                                      electrónico y que el equipo de Multiplicity se pondrá en contacto para coordinar
                                      los siguientes pasos. */}
                                    </label>
                                  </div>
                                  {errors.confirmation && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs text-red-500 ml-7"
                                    >
                                      {errors.confirmation}
                                    </motion.p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right Footer - Navigation buttons */}
                    <div className="flex-shrink-0 sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t px-8 py-5 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.12)]">
                      <div className="flex items-center justify-between">
                        {currentStep === 1 ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowOnboardingDialog(false)
                              setShowDetailsDialog(true)
                            }}
                            size="lg"
                            className="px-6 bg-transparent"
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Volver
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={handleBack}
                            size="lg"
                            className="px-6 bg-transparent"
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                          </Button>
                        )}

                        {currentStep < 4 ? (
                          <Button
                            onClick={handleNext}
                            size="lg"
                            className="bg-gradient-to-r from-[#4DB8B8] to-[#3A9A9A] hover:opacity-90 text-white px-8 shadow-lg"
                          >
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !confirmationChecked}
                            size="lg"
                            className="bg-gradient-to-r from-[#4DB8B8] to-[#3A9A9A] hover:opacity-90 text-white px-10 shadow-xl disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                Enviar solicitud
                                <Check className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </DialogContent>
      </Dialog>
    </>
  )
}
