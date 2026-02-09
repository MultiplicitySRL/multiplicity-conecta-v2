"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Check, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import { createAndEmailAlegraInvoice } from "@/lib/alegra"
import { getCalApi } from "@calcom/embed-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface DirectScenarioCardProps {
  tests: {
    competenciaPlus: number
    pensamientoAnalitico: number
    motivadores: number
    competenciasBasicas: number
    razonamientoGeneral: number
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
  onSelect: () => void
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

export default function DirectScenarioCard({
  tests,
  basePrices,
  getPriceByVolume,
  itbisRate,
  currency,
  exchangeRateUSD,
  exchangeRateEUR,
  companyType,
  onSelect,
}: DirectScenarioCardProps) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [confirmationChecked, setConfirmationChecked] = useState(false)

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
    const testDetails = Object.entries(tests).map(([key, qty]) => {
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

    const totalTests = Object.values(tests).reduce((a, b) => a + b, 0)

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
  }, [tests, basePrices, getPriceByVolume, itbisRate, currency, exchangeRateUSD, exchangeRateEUR, companyType])

  const formatCurrency = (amount: number, symbol = "$") => {
    return `${symbol} ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const hasPlusTests = calculations.testDetails.some((test) =>
    ["competenciaPlus", "pensamientoAnalitico", "motivadores"].includes(test.key),
  )
  const hasBasicTests = calculations.testDetails.some((test) =>
    ["competenciasBasicas", "razonamientoGeneral"].includes(test.key),
  )

  const isStep1Valid = () => {
    return formData.razonSocial && formData.rnc && formData.direccion && formData.tipoNCF && formData.medioEntrega
  }

  const isStep2Valid = () => {
    return (
      formData.contactoFact1Nombre &&
      formData.contactoFact1Posicion &&
      formData.contactoFact1Email &&
      formData.contactoFact1Telefono &&
      isValidPhone(formData.contactoFact1Telefono)
    )
  }

  const isStep3Valid = () => {
    return (
      formData.contactoAdmin1Nombre &&
      formData.contactoAdmin1Posicion &&
      formData.contactoAdmin1Email &&
      formData.contactoAdmin1Telefono &&
      isValidPhone(formData.contactoAdmin1Telefono)
    )
  }

  const canProceedToNextStep = () => {
    if (currentStep === 0) return true
    if (currentStep === 1) return isStep1Valid()
    if (currentStep === 2) return isStep2Valid()
    if (currentStep === 3) return isStep3Valid()
    return false
  }

  const isFormValid = () => {
    return (
      formData.razonSocial &&
      formData.rnc &&
      formData.direccion &&
      formData.tipoNCF &&
      formData.medioEntrega &&
      formData.contactoFact1Nombre &&
      formData.contactoFact1Posicion &&
      formData.contactoFact1Email &&
      formData.contactoFact1Telefono &&
      isValidPhone(formData.contactoFact1Telefono) &&
      formData.contactoAdmin1Nombre &&
      formData.contactoAdmin1Posicion &&
      formData.contactoAdmin1Email &&
      formData.contactoAdmin1Telefono &&
      isValidPhone(formData.contactoAdmin1Telefono) &&
      confirmationChecked
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return
    setIsSubmitting(true)

    try {
      const items = calculations.testDetails
        .filter((test) => test.qty > 0)
        .map((test) => ({
          id: ALEGRA_TEST_IDS[test.name],
          name: test.name,
          price: Math.round(test.price * 100) / 100,
          quantity: test.qty,
          discount: test.hasDiscount
            ? Math.round((test.discountAmount / test.totalWithoutDiscount) * 100 * 100) / 100
            : 0,
        }))

      const today = new Date()
      const issueDate = today.toISOString().split("T")[0]
      const dueDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split("T")[0]

      const notes = `Cotización directa para ${calculations.totalTests} evaluaciones psicométricas.

Descuento por volumen aplicado: ${formatCurrency(calculations.totalDiscountAmount, calculations.symbol)}
ITBIS (18%): ${formatCurrency(calculations.itbisAmount, calculations.symbol)}
Total: ${formatCurrency(calculations.total, calculations.symbol)}`

      const terms = `Condiciones:
- Pago único
- Las licencias de evaluaciones por uso no tienen fecha de vencimiento
- Permitido canjear productos de evaluación

Responsabilidades de Multiplicity:
- Ofrecer entrenamientos iniciales virtuales
- Acompañamiento en definición de perfiles
- Otorgar claves de acceso a los administradores
- Soporte incidencias técnicas
- Asesoría en interpretación de resultados
- Manuales de Uso`

      await createAndEmailAlegraInvoice({
        customer: {
          name: formData.razonSocial,
          email: formData.contactoFact1Email,
          identification: formData.rnc,
          phone: formData.contactoFact1Telefono,
        },
        items,
        currency: "USD",
        exchangeRate: currency === "USD" ? exchangeRateUSD : currency === "EUR" ? exchangeRateEUR : undefined,
        issueDate,
        dueDate,
        notes,
        terms,
        externalRef: `DIRECT-QUOTE-${Date.now()}`,
        emailToSend: formData.contactoFact1Email,
        companyType,
      })

      const webhookPayload = {
        id: crypto.randomUUID(),
        descripcion: "Crea la empresa, los contactos de empresas y plataforma, y linkealos",
        empresa_razonsocial: formData.razonSocial,
        empresa_rnc: formData.rnc,
        empresa_direccion: formData.direccion,
        empresa_tipo_ncf: formData.tipoNCF,
        empresa_medio_entrega: formData.medioEntrega,
        contacto_empresa_1_nombre: formData.contactoFact1Nombre,
        contacto_empresa_1_posicion: formData.contactoFact1Posicion,
        contacto_empresa_1_email: formData.contactoFact1Email,
        contacto_empresa_1_telefono: formData.contactoFact1Telefono,
        contacto_empresa_2_nombre: formData.contactoFact2Nombre || "",
        contacto_empresa_2_posicion: formData.contactoFact2Posicion || "",
        contacto_empresa_2_email: formData.contactoFact2Email || "",
        contacto_empresa_2_telefono: formData.contactoFact2Telefono || "",
        contacto_plataforma_1_nombre: formData.contactoAdmin1Nombre,
        contacto_plataforma_1_posicion: formData.contactoAdmin1Posicion,
        contacto_plataforma_1_email: formData.contactoAdmin1Email,
        contacto_plataforma_1_telefono: formData.contactoAdmin1Telefono,
        contacto_plataforma_2_nombre: formData.contactoAdmin2Nombre || "",
        contacto_plataforma_2_posicion: formData.contactoAdmin2Posicion || "",
        contacto_plataforma_2_email: formData.contactoAdmin2Email || "",
        contacto_plataforma_2_telefono: formData.contactoAdmin2Telefono || "",
      }

      const webhookResponse = await fetch(
        "https://carlossantos147.app.n8n.cloud/webhook/300af3f6-c278-4934-b680-21591df7a825",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        },
      )

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status}`)
      }

      setIsSubmitting(false)
      setShowDetailsDialog(false)
      alert("¡Cotización enviada exitosamente! Recibirás la factura por correo electrónico.")
    } catch (error) {
      console.error("[v0] Error processing quote:", error)
      setIsSubmitting(false)
      alert("Hubo un error al procesar la cotización. Por favor, intenta nuevamente.")
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

  return (
    <>
      <Card className="shadow-lg border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary text-primary-foreground px-4 py-1.5">Cotización Directa</Badge>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculations.total, calculations.symbol)}
            </span>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de pruebas:</span>
              <span className="font-semibold">{calculations.totalTests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Descuento aplicado:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(convertCurrency(calculations.totalDiscountAmount), calculations.symbol)}
              </span>
            </div>
            {companyType === "local" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ITBIS (18%):</span>
                <span className="font-semibold">
                  {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              setShowDetailsDialog(true)
              // onSelect() removed as dialog should open first, onSelect happens after form submission
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Continuar con esta cotización
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="!max-w-[100vw] sm:!max-w-[90vw] w-full sm:w-[90vw] !max-h-[100vh] sm:!max-h-[96vh] overflow-hidden p-0">
          <div className="sticky top-0 z-10 bg-primary text-white px-3 sm:px-6 md:px-8 py-3 sm:py-5 shadow-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                {currentStep === 0 ? "Detalle de tu Cotización" : "¡Ya casi estás listo!"}
              </DialogTitle>
              <p className="text-white/90 text-xs sm:text-base mt-1">
                {currentStep === 0
                  ? "Revisa el detalle completo de tu cotización"
                  : currentStep === 1
                    ? "Elige cómo deseas continuar con tu cotización"
                    : "Completa el formulario para finalizar tu cotización"}
              </p>
            </DialogHeader>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-3 sm:gap-6 lg:gap-8 px-3 sm:px-6 md:px-8 pt-2 sm:pt-3 overflow-y-auto h-[calc(100vh-180px)] sm:h-[calc(96vh-220px)]">
            {currentStep === 0 ? (
              <div className="lg:col-span-2 space-y-3 sm:space-y-6">
                <div className="bg-muted/30 rounded-lg p-3 sm:p-5 border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-4">
                    <Badge className="bg-primary text-primary-foreground text-xs sm:text-base px-2 sm:px-4 py-1">
                      Cotización Directa
                    </Badge>
                    <span className="text-xs sm:text-base text-muted-foreground">- Resumen de tu selección</span>
                  </div>

                  {/* Mobile card view */}
                  <div className="block lg:hidden space-y-3">
                    {calculations.testDetails
                      .filter((test) => test.qty > 0)
                      .map((test) => (
                        <div key={test.key} className="bg-white dark:bg-gray-900 rounded-lg border p-3 space-y-2">
                          <div className="font-semibold text-sm text-foreground border-b pb-2">{test.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Cantidad:</span>
                              <div className="font-semibold">{test.qty}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Costo unitario:</span>
                              <div className="font-semibold">
                                {formatCurrency(convertCurrency(test.price), calculations.symbol)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total sin desc.:</span>
                              <div className="font-semibold">
                                {formatCurrency(convertCurrency(test.totalWithoutDiscount), calculations.symbol)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Descuento:</span>
                              <div className="font-semibold text-green-600">
                                {test.hasDiscount
                                  ? formatCurrency(convertCurrency(test.discountAmount), calculations.symbol)
                                  : "-"}
                              </div>
                            </div>
                            <div className="col-span-2 pt-2 border-t">
                              <span className="text-muted-foreground">Total a pagar:</span>
                              <div className="font-bold text-base text-primary">
                                {formatCurrency(convertCurrency(test.totalWithDiscount), calculations.symbol)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="font-semibold">Subtotal</span>
                        <span className="font-bold">
                          {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                        </span>
                      </div>
                      {companyType === "local" && (
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-semibold">ITBIS (18%)</span>
                          <span className="font-bold">
                            {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1">
                        <span className="font-bold text-base">Total Neto</span>
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(calculations.total, calculations.symbol)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop table view */}
                  <div className="hidden lg:block overflow-x-auto -mx-2 sm:mx-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Prueba</th>
                          <th className="text-center py-3 px-2 font-semibold">Cant.</th>
                          <th className="text-right py-3 px-2 font-semibold">Costo Unit.</th>
                          <th className="text-right py-3 px-2 font-semibold">Total sin Desc.</th>
                          <th className="text-right py-3 px-2 font-semibold">Descuento</th>
                          <th className="text-right py-3 px-2 font-semibold">Total a Pagar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculations.testDetails
                          .filter((test) => test.qty > 0)
                          .map((test) => (
                            <tr key={test.key} className="border-b hover:bg-muted/20">
                              <td className="py-3 px-2 font-medium">{test.name}</td>
                              <td className="py-3 px-2 text-center">{test.qty}</td>
                              <td className="py-3 px-2 text-right">
                                {formatCurrency(convertCurrency(test.price), calculations.symbol)}
                              </td>
                              <td className="py-3 px-2 text-right">
                                {formatCurrency(convertCurrency(test.totalWithoutDiscount), calculations.symbol)}
                              </td>
                              <td className="py-3 px-2 text-right text-green-600">
                                {test.hasDiscount
                                  ? formatCurrency(convertCurrency(test.discountAmount), calculations.symbol)
                                  : "-"}
                              </td>
                              <td className="py-3 px-2 text-right font-bold text-primary">
                                {formatCurrency(convertCurrency(test.totalWithDiscount), calculations.symbol)}
                              </td>
                            </tr>
                          ))}
                        <tr className="border-t-2">
                          <td colSpan={5} className="py-3 px-2 text-right font-semibold">
                            Subtotal
                          </td>
                          <td className="py-3 px-2 text-right font-bold">
                            {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                          </td>
                        </tr>
                        {companyType === "local" && (
                          <tr>
                            <td colSpan={5} className="py-3 px-2 text-right font-semibold">
                              ITBIS (18%)
                            </td>
                            <td className="py-3 px-2 text-right font-bold">
                              {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t-2 bg-primary/5">
                          <td colSpan={5} className="py-3 px-2 text-right font-bold text-lg">
                            Total Neto
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-lg text-primary">
                            {formatCurrency(calculations.total, calculations.symbol)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-6">
                  <div className="bg-muted/30 rounded-lg p-3 sm:p-5 border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-4">
                      <Badge className="bg-primary text-primary-foreground text-xs sm:text-base px-2 sm:px-4 py-1">
                        Cotización Directa
                      </Badge>
                      <span className="text-xs sm:text-base text-muted-foreground">- Resumen de tu selección</span>
                    </div>

                    <div className="block lg:hidden space-y-3">
                      {calculations.testDetails
                        .filter((test) => test.qty > 0)
                        .map((test) => (
                          <div key={test.key} className="bg-white dark:bg-gray-900 rounded-lg border p-3 space-y-2">
                            <div className="font-semibold text-sm text-foreground border-b pb-2">{test.name}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Cantidad:</span>
                                <div className="font-semibold">{test.qty}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Costo unitario:</span>
                                <div className="font-semibold">
                                  {formatCurrency(convertCurrency(test.price), calculations.symbol)}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total sin desc.:</span>
                                <div className="font-semibold">
                                  {formatCurrency(convertCurrency(test.totalWithoutDiscount), calculations.symbol)}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Descuento:</span>
                                <div className="font-semibold text-green-600">
                                  {test.hasDiscount
                                    ? formatCurrency(convertCurrency(test.discountAmount), calculations.symbol)
                                    : "-"}
                                </div>
                              </div>
                              <div className="col-span-2 pt-2 border-t">
                                <span className="text-muted-foreground">Total a pagar:</span>
                                <div className="font-bold text-base text-primary">
                                  {formatCurrency(convertCurrency(test.totalWithDiscount), calculations.symbol)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between pb-2 border-b">
                          <span className="font-semibold">Subtotal</span>
                          <span className="font-bold">
                            {formatCurrency(convertCurrency(calculations.subtotalWithDiscount), calculations.symbol)}
                          </span>
                        </div>
                        {companyType === "local" && (
                          <div className="flex justify-between pb-2 border-b">
                            <span className="font-semibold">ITBIS (18%)</span>
                            <span className="font-bold">
                              {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1">
                          <span className="font-bold text-base">Total Neto</span>
                          <span className="font-bold text-lg text-primary">
                            {formatCurrency(calculations.total, calculations.symbol)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6 lg:pr-4">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">¿Cómo deseas continuar?</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-primary">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">Continuar con esta cotización</div>
                              <div className="text-sm text-muted-foreground">
                                Avanza con los datos de tu empresa y confirma si deseas proceder con esta cotización.
                              </div>
                            </div>
                          </div>
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative bg-background px-4">
                            <span className="text-sm text-muted-foreground font-medium">O</span>
                          </div>
                        </div>

                        <button
                          onClick={handleScheduleMeeting}
                          className="w-full p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-primary">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">Agendar reunión con Multiplicity</div>
                              <div className="text-sm text-muted-foreground">
                                Conversa con un asesor antes de confirmar la cotización.
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información de la Empresa</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="razonSocial">Razón Social *</Label>
                          <Input
                            id="razonSocial"
                            value={formData.razonSocial}
                            onChange={(e) => updateFormData("razonSocial", e.target.value)}
                            placeholder="Nombre de la empresa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rnc">RNC *</Label>
                          <Input
                            id="rnc"
                            value={formData.rnc}
                            onChange={(e) => updateFormData("rnc", e.target.value)}
                            placeholder="000-0000000-0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="direccion">Dirección *</Label>
                          <Input
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) => updateFormData("direccion", e.target.value)}
                            placeholder="Dirección completa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tipoNCF">Tipo de NCF *</Label>
                          <Select value={formData.tipoNCF} onValueChange={(value) => updateFormData("tipoNCF", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de NCF" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credito-fiscal">Crédito Fiscal</SelectItem>
                              <SelectItem value="consumidor-final">Consumidor Final</SelectItem>
                              <SelectItem value="gubernamental">Gubernamental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="medioEntrega">Medio de Entrega *</Label>
                          <Select
                            value={formData.medioEntrega}
                            onValueChange={(value) => updateFormData("medioEntrega", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el medio de entrega" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="fisico">Físico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contactos de Facturación</h3>
                      <div className="space-y-4">
                        <div className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold text-sm">Contacto Principal *</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="contactoFact1Nombre">Nombre</Label>
                              <Input
                                id="contactoFact1Nombre"
                                value={formData.contactoFact1Nombre}
                                onChange={(e) => updateFormData("contactoFact1Nombre", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact1Posicion">Posición</Label>
                              <Input
                                id="contactoFact1Posicion"
                                value={formData.contactoFact1Posicion}
                                onChange={(e) => updateFormData("contactoFact1Posicion", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact1Email">Email</Label>
                              <Input
                                id="contactoFact1Email"
                                type="email"
                                value={formData.contactoFact1Email}
                                onChange={(e) => updateFormData("contactoFact1Email", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact1Telefono">Teléfono</Label>
                              <Input
                                id="contactoFact1Telefono"
                                value={formData.contactoFact1Telefono}
                                onChange={(e) => updateFormData("contactoFact1Telefono", e.target.value)}
                                placeholder="8091234567"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold text-sm">Contacto Secundario (Opcional)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="contactoFact2Nombre">Nombre</Label>
                              <Input
                                id="contactoFact2Nombre"
                                value={formData.contactoFact2Nombre}
                                onChange={(e) => updateFormData("contactoFact2Nombre", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact2Posicion">Posición</Label>
                              <Input
                                id="contactoFact2Posicion"
                                value={formData.contactoFact2Posicion}
                                onChange={(e) => updateFormData("contactoFact2Posicion", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact2Email">Email</Label>
                              <Input
                                id="contactoFact2Email"
                                type="email"
                                value={formData.contactoFact2Email}
                                onChange={(e) => updateFormData("contactoFact2Email", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoFact2Telefono">Teléfono</Label>
                              <Input
                                id="contactoFact2Telefono"
                                value={formData.contactoFact2Telefono}
                                onChange={(e) => updateFormData("contactoFact2Telefono", e.target.value)}
                                placeholder="8091234567"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contactos de Plataforma</h3>
                      <div className="space-y-4">
                        <div className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold text-sm">Administrador Principal *</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="contactoAdmin1Nombre">Nombre</Label>
                              <Input
                                id="contactoAdmin1Nombre"
                                value={formData.contactoAdmin1Nombre}
                                onChange={(e) => updateFormData("contactoAdmin1Nombre", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin1Posicion">Posición</Label>
                              <Input
                                id="contactoAdmin1Posicion"
                                value={formData.contactoAdmin1Posicion}
                                onChange={(e) => updateFormData("contactoAdmin1Posicion", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin1Email">Email</Label>
                              <Input
                                id="contactoAdmin1Email"
                                type="email"
                                value={formData.contactoAdmin1Email}
                                onChange={(e) => updateFormData("contactoAdmin1Email", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin1Telefono">Teléfono</Label>
                              <Input
                                id="contactoAdmin1Telefono"
                                value={formData.contactoAdmin1Telefono}
                                onChange={(e) => updateFormData("contactoAdmin1Telefono", e.target.value)}
                                placeholder="8091234567"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold text-sm">Administrador Secundario (Opcional)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="contactoAdmin2Nombre">Nombre</Label>
                              <Input
                                id="contactoAdmin2Nombre"
                                value={formData.contactoAdmin2Nombre}
                                onChange={(e) => updateFormData("contactoAdmin2Nombre", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin2Posicion">Posición</Label>
                              <Input
                                id="contactoAdmin2Posicion"
                                value={formData.contactoAdmin2Posicion}
                                onChange={(e) => updateFormData("contactoAdmin2Posicion", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin2Email">Email</Label>
                              <Input
                                id="contactoAdmin2Email"
                                type="email"
                                value={formData.contactoAdmin2Email}
                                onChange={(e) => updateFormData("contactoAdmin2Email", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactoAdmin2Telefono">Teléfono</Label>
                              <Input
                                id="contactoAdmin2Telefono"
                                value={formData.contactoAdmin2Telefono}
                                onChange={(e) => updateFormData("contactoAdmin2Telefono", e.target.value)}
                                placeholder="8091234567"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Confirmación</h3>
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                          <h4 className="font-semibold">Resumen de tu cotización</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total de pruebas:</span>
                              <span className="font-semibold">{calculations.totalTests}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  convertCurrency(calculations.subtotalWithDiscount),
                                  calculations.symbol,
                                )}
                              </span>
                            </div>
                            {companyType === "local" && (
                              <div className="flex justify-between">
                                <span>ITBIS (18%):</span>
                                <span className="font-semibold">
                                  {formatCurrency(convertCurrency(calculations.itbisAmount), calculations.symbol)}
                                </span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold text-primary">
                                {formatCurrency(calculations.total, calculations.symbol)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="confirmation"
                            checked={confirmationChecked}
                            onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
                          />
                          <label htmlFor="confirmation" className="text-sm leading-relaxed cursor-pointer">
                            Confirmo que la información proporcionada es correcta y deseo proceder con esta cotización.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t shadow-lg flex justify-between">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            )}
            <div className="flex-1" />
            {currentStep === 0 && (
              <Button onClick={() => setCurrentStep(1)}>
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep > 1 && currentStep < 5 && (
              <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceedToNextStep()}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep === 5 && (
              <Button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting} className="min-w-[150px]">
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <button
        data-cal-namespace="30min"
        data-cal-link="carlos-santos/30min"
        data-cal-config='{"layout":"month_view","theme":"light"}'
        style={{ display: "none" }}
      />
    </>
  )
}
