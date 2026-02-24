"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import DirectQuoteCalculator from "@/components/direct-quote-calculator"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useEmbedSecurity } from "@/hooks/use-embed-security"
import { BlockedAccessScreen } from "@/components/blocked-access-screen"
import { CompanyHeader } from "@/components/company-header"
import { Loader2 } from "lucide-react"

function CotizarPorPruebasContent() {
  const searchParams = useSearchParams()
  const embedSecurity = useEmbedSecurity()
  
  const companyId = searchParams.get("company_id")
  const accountId = searchParams.get("account_id")

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
          {/* Company Header - arriba de todo */}
          <div className="mb-4 md:mb-6">
            <CompanyHeader companyId={companyId} accountId={accountId} />
          </div>

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

          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-balance mb-4 md:mb-6 text-foreground">
            <span className="block">Cotización Directa por Pruebas</span>
          </h1>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00BCB4]/10 flex items-center justify-center text-[#00BCB4] font-bold">
                1
              </div>
              <span className="hidden sm:inline">Ingresa cantidades</span>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00BCB4]/10 flex items-center justify-center text-[#00BCB4] font-bold">
                2
              </div>
              <span className="hidden sm:inline">Revisa y confirma</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 lg:py-10">
        <DirectQuoteCalculator companyId={companyId} accountId={accountId} />
      </div>

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
                  onClick={() => {
                    const button = document.createElement("button")
                    button.setAttribute("data-cal-namespace", "30min")
                    button.setAttribute("data-cal-link", "carlos-santos/30min")
                    button.setAttribute("data-cal-config", '{"layout":"month_view","theme":"light"}')
                    button.style.display = "none"
                    document.body.appendChild(button)
                    button.click()
                    document.body.removeChild(button)
                  }}
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
