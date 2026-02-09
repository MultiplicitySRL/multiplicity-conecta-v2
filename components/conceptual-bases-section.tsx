"use client"

import { Card } from "@/components/ui/card"

export function ConceptualBasesSection() {
  return (
    <section id="conceptual-bases" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12 bg-navy rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-pink">Nuestras bases</span>
            <br />
            <span className="text-white">conceptuales</span>
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-4xl italic">
            <span className="text-pink">Fundamentos teóricos</span> que sustentan las evaluaciones y metodologías
            aplicadas en la plataforma.
          </p>
          {/* Decorative dots */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-orange"></div>
            <div className="w-3 h-3 rounded-full bg-pink"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-red"></div>
          </div>
        </div>

        <div className="mb-12">
          <Card
            data-card-id="conceptual-diccionario"
            onClick={() => window.open("/documentos/Diccionario de Comportamientos.pdf", "_blank")}
            className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
          >
            <div className="relative h-64 overflow-hidden flex-shrink-0">
              <img
                src="/nuevo-clientes/Diccionario de Comportamientos portada.png"
                alt="Diccionario de Comportamientos"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
              <h3 className="text-xl font-bold text-left">Diccionario de Comportamientos</h3>
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Competencias",
                doc: "Competencias.pdf",
                image: "/clientes/Diccionario de Competencias Multiplicity 1.png",
                id: "conceptual-competencias",
              },
              {
                title: "Pensamiento Analítico y Sistémico",
                doc: "Pensamiento Analitico y Sistemico.pdf",
                image: "/clientes/Diccionario de pensamiento anaco y sistémico - Multiplicity 1.png",
                id: "conceptual-pensamiento",
              },
              {
                title: "Motivadores",
                doc: "Motivadores.pdf",
                image: "/clientes/Diccionario-de-motivadores-Multiplicity 1.png",
                id: "conceptual-motivadores",
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
                <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                  <h4 className="text-lg font-bold text-left">{item.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card
            data-card-id="conceptual-fichas-tecnicas"
            onClick={() => window.open("/documentos/Fichas Tecnicas de las Pruebas.pdf", "_blank")}
            className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
          >
            <div className="relative h-64 overflow-hidden flex-shrink-0">
              <img
                src="/clientes/6.png"
                alt="Fichas Técnicas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
              <h3 className="text-xl font-bold text-left">Fichas Técnicas de las Pruebas</h3>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
