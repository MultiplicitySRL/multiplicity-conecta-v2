"use client"

import { Plus, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { getCalApi } from "@calcom/embed-react"

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const openBookingModal = async () => {
    const cal = await getCalApi({ namespace: "30min" })
    cal("ui", {
      theme: "light",
      cssVarsPerTheme: { light: { "cal-brand": "#E7540E" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    })
    const bookingButton = document.querySelector('[data-cal-namespace="30min"]') as HTMLElement
    if (bookingButton) {
      bookingButton.click()
    }
  }

  return (
    <section className="py-6 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-6xl md:grid-rows-[140px_140px_280px]">
          {/* Column 1, Row 1: Logo */}
          <Card className="bg-background p-4 rounded-3xl flex items-center justify-center md:col-span-1 min-h-[100px] md:min-h-0 border-0 shadow-none">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity"
              width={270}
              height={110}
              className="h-auto w-full max-w-[270px]"
            />
          </Card>

          {/* Column 2, Row 1: Acerca de Multiplicity */}
          <Card
            onClick={() => scrollToSection("about")}
            className="group relative p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 md:row-span-2 min-h-[200px] md:min-h-0"
            style={{ backgroundColor: "#E11383", color: "white" }}
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" style={{ color: "#E11383" }} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Acerca de Multiplicity</h3>
          </Card>

          {/* Column 3, Row 1: Agenda una reunión con un asesor */}
          <Card
            onClick={openBookingModal}
            className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 md:row-span-2 min-h-[200px] md:min-h-0"
          >
            <div className="absolute inset-0">
              <Image src="/images/agendaunareu.jpg" alt="Agenda una reunión" fill className="object-cover" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
              <Plus className="w-5 h-5 text-[#00BCB4]" strokeWidth={2.5} />
            </div>
          </Card>

          {/* Column 4, Row 1: Preguntas Frecuentes */}
          <Card
            onClick={() => scrollToSection("faq")}
            className="group relative bg-pink text-pink-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 md:row-span-2 min-h-[200px] md:min-h-0"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-pink" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Preguntas frecuentes</h3>
          </Card>

          {/* Column 1, Row 2-3: ¿Qué quieres conocer? (tall card) */}
          <Card className="group bg-red text-red-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 md:row-span-2 min-h-[200px] md:min-h-0">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight">
              ¿QUÉ
              <br />
              QUIERES
              <br />
              CONOCER?
            </h3>
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </Card>

          {/* Column 2, Row 3: Nuestro Modelo de Negocios */}
          <Card
            onClick={() => scrollToSection("business-model")}
            className="group relative bg-navy text-navy-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 min-h-[200px] md:min-h-0"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-pink rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-navy" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Nuestro Modelo de Negocios</h3>
          </Card>

          {/* Column 3, Row 3: Reportes de Evaluación */}
          <Card
            onClick={() => scrollToSection("reports")}
            className="group relative bg-orange text-orange-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 min-h-[200px] md:min-h-0"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-orange" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Reportes de Evaluación</h3>
          </Card>

          {/* Column 4, Row 3: Agenda una reunión con un Asesor */}
          <Card
            onClick={openBookingModal}
            className="group relative p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 min-h-[200px] md:min-h-0"
            style={{ backgroundColor: "#00BCB4", color: "white" }}
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" style={{ color: "#00BCB4" }} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Agenda una reunión con un Asesor</h3>
          </Card>
        </div>
      </div>
    </section>
  )
}
