"use client"

import { Card } from "@/components/ui/card"
import { FileDown } from "lucide-react"

export function ResearchSection() {
  return (
    <section id="research" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12 bg-navy rounded-3xl p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-pink">Estudios e </span>
              <span className="text-white">Investigaciones</span>
            </h2>
            <p className="text-lg md:text-xl italic max-w-4xl">
              <span className="text-pink">Descubre </span>
              <span className="text-white">
                hallazgos y tendencias en gestión de talento, competencias profesionales y desarrollo organizacional.
              </span>
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-3">
            <div className="w-4 h-4 rounded-full bg-orange"></div>
            <div className="w-4 h-4 rounded-full bg-pink"></div>
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <div className="w-4 h-4 rounded-full bg-red"></div>
          </div>
        </div>

        <Card
          data-card-id="research-trends"
          onClick={() => window.open("/documentos/Trends by Multiplicity.pdf", "_blank")}
          className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
        >
          <div className="relative h-64 overflow-hidden flex-shrink-0">
            <img
              src="/clientes/Trends.png"
              alt="Trends by Multiplicity"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-pink/20 rounded-full p-2">
                <FileDown className="w-5 h-5 text-pink" />
              </div>
              <h3 className="text-lg font-bold text-left">Trends by Multiplicity</h3>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
