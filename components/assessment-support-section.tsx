"use client"

import { Card } from "@/components/ui/card"

export function AssessmentSupportSection() {
  return (
    <section id="assessment-support" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12 bg-navy rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-pink">Apoyándote En La</span>{" "}
              <span className="text-white">Valoración integral</span>
            </h2>
            <p className="text-lg md:text-xl italic">
              <span className="text-pink">Herramientas y guías </span>
              <span className="text-white">
                para maximizar el valor de tus procesos de evaluación y desarrollo de talento.
              </span>
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-3">
            <div className="w-4 h-4 rounded-full bg-orange" />
            <div className="w-4 h-4 rounded-full bg-pink" />
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div className="w-4 h-4 rounded-full bg-red" />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-navy mb-6">La Evaluación Contraste: La Entrevista</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              data-card-id="assessment-guia-entrevista"
              onClick={() => window.open("/documentos/Guia de Entrevista por Competencias.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/6.png"
                  alt="Guía de Entrevista por Competencias"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Guía de Entrevista por Competencias</h4>
              </div>
            </Card>

            <Card
              data-card-id="assessment-metodologia"
              onClick={() => window.open("/documentos/Metodologia de Aplicacion.xlsx", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/8.png"
                  alt="Metodología de Aplicación"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Metodología de Aplicación de la Entrevista</h4>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-navy mb-6">Compartiendo los Resultados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              data-card-id="assessment-retroalimentacion"
              onClick={() => window.open("/documentos/Guia de Retroalimentacion por Competencias.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/10.png"
                  alt="Guía de Retroalimentación por Competencias"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Guía de Retroalimentación por Competencias</h4>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-navy mb-6">Convirtiendo los Datos de Evaluación en Entendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              data-card-id="assessment-plan-sucesion"
              onClick={() => window.open("/documentos/Ideas para un Plan de Sucesion.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/11.png"
                  alt="Ideas para un Plan de Sucesión"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Ideas para un Plan de Sucesión</h4>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-navy mb-6">El Desarrollo de Competencias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              data-card-id="assessment-pautas-autodesarrollo"
              onClick={() => window.open("/documentos/Pautas para el autodesarrollo por Competencias.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/12.png"
                  alt="Pautas para el autodesarrollo por Competencias"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">
                  Pautas para el autodesarrollo por Competencias – Evaluados
                </h4>
              </div>
            </Card>

            <Card
              data-card-id="assessment-plan-accion"
              onClick={() => window.open("/documentos/Plan de Accion por Competencias.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/13.png"
                  alt="Plan de Acción por Competencias"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Plan de Acción por Competencias/Evaluados</h4>
              </div>
            </Card>

            <Card
              data-card-id="assessment-taller-ppt"
              onClick={() => window.open("/documentos/PPT Taller de Autodesarrollo por Competencias.pptx", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/2.png"
                  alt="PPT Taller de Autodesarrollo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">PPT Taller de Autodesarrollo por Competencias/Evaluados</h4>
              </div>
            </Card>

            <Card
              data-card-id="assessment-manual-autodesarrollo"
              onClick={() => window.open("/documentos/Manual de Autodesarrollo por Competencias.pdf", "_blank")}
              className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src="/clientes/9.png"
                  alt="Manual de Autodesarrollo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                <h4 className="text-lg font-bold text-left">Manual de Autodesarrollo por Competencias</h4>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
