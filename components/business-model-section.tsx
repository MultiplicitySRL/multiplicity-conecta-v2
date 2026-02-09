"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function BusinessModelSection( { hideCotizar }: { hideCotizar?: boolean } ) {
  const handleDocumentoClick = () => {
    window.open("/documentos/Modelo de Negocios Multiplicity.pdf", "_blank")
  }

  return (
    <section id="business-model" className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">Modelo de Negocios</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* Documento explicativo sobre modelo de negocio */}
          <Card
            onClick={handleDocumentoClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
          >
            <div className="h-72 overflow-hidden flex-shrink-0">
              <img
                src="/images/nuestro-modelo-de-negocios.jpeg"
                alt="Documento modelo de negocio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24 flex-shrink-0">
              <h3 className="text-lg font-bold">Nuestro Modelo de Negocios</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>

          {/* Cotizador */}
          { !hideCotizar && <Link href="/cotizar" className="block">
            <Card className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0">
              <div className="h-72 overflow-hidden flex-shrink-0">
                <img src="/images/cotizador-calculadora.jpeg" alt="Cotizador-nosotros" className="w-full h-full object-cover" />
              </div>
              <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24 flex-shrink-0">
                <h3 className="text-lg font-bold">Cotiza con nosotros</h3>
                <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          </Link> }
        </div>
      </div>
    </section>
  )
}
