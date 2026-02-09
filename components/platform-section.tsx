"use client"

import { Card } from "@/components/ui/card"

export function PlatformSection() {
  return (
    <section id="platform" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="relative bg-navy rounded-3xl p-12 mb-12 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-left mb-6">
              <span style={{ color: "#E11383" }}>Manuales </span>
            
            </h2>
            {/* <p className="text-xl text-white italic text-left">
              <span style={{ color: "#E11383" }}>Recursos y guías </span>
              <span className="text-white">
                para aprovechar al máximo las funcionalidades y capacidades de la herramienta de evaluación.
              </span>
            </p> */}
          </div>

          {/* Colorful dots decoration */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange" />
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#E11383" }} />
            <div className="w-6 h-6 rounded-full bg-primary" />
            <div className="w-6 h-6 rounded-full bg-red" />
          </div>
        </div>

        <div className="mb-8">
          {/* <h3 className="text-xl font-bold text-navy mb-4">Documentos de Gestión de la Plataforma</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              data-card-id="platform-requerimientos-tecnicos"
              onClick={() => window.open("/documentos/Requerimientos Tecnicos Plataforma Multiplicity.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/images/Requerimientos Tecnico de la plataforma.png"
                  alt="Requerimientos Técnicos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Requerimientos Técnicos</h4>
              </div>
            </Card>

            <Card
              data-card-id="platform-manual-funcional"
              onClick={() => window.open("/documentos/Manual Funcional de la Plataforma.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/images/Manual Funcional de la plataforma.png"
                  alt="Manual Funcional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Manual Funcional de la Plataforma</h4>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-navy mb-4">Orientaciones para la aplicación de los Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Recomendaciones antes de completar Multiplicity - Participante Básico",
                doc: "Recomendaciones antes de completar Multiplicity - Participante Basico.pdf",
                image: "/clientes/2.png",
                id: "platform-recomendaciones-basico",
              },
              {
                title: "Aplicación Presencial de Facilitadores – Proceso Básico",
                doc: "Aplicacion Presencial de Facilitadores - Proceso Basico.pdf",
                image: "/clientes/3.png",
                id: "platform-facilitadores-basico",
              },
              {
                title: "Recomendaciones antes de completar Multiplicity – Participante Plus",
                doc: "Recomendaciones antes de completar Multiplicity - Participante Plus.pdf",
                image: "/clientes/4.png",
                id: "platform-recomendaciones-plus",
              },
              {
                title: "Tutorial Aplicación Presencial de Facilitadores – Proceso Plus",
                doc: "Tutorial Aplicacion Presencial de Facilitadores - Proceso Plus.pdf",
                image: "/clientes/5.png",
                id: "platform-facilitadores-plus",
              },
            ].map((item, index) => (
              <Card
                key={index}
                data-card-id={item.id}
                onClick={() => window.open(`/documentos/${item.doc}`, "_blank")}
                className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="bg-navy text-navy-foreground h-32 flex items-center px-4 flex-shrink-0">
                  <h4 className="text-base font-bold text-left leading-tight">{item.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
