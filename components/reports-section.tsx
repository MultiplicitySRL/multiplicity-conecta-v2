"use client"

import { Card } from "@/components/ui/card"
import { FileText, ArrowRight } from "lucide-react"
import Image from "next/image"

export function ReportsSection() {
  const plusReports = [
    {
      name: "Con Nivel Ideal",
      description: "Recomendado para selección con perfil definido",
      pdf: "/documentos/reportes/Informe con nivel ideal.pdf",
    },
    {
      name: "Sin Nivel Ideal",
      description: "Para evaluación general de talentos",
      pdf: "/documentos/reportes/Informe sin nivel ideal.pdf",
    },
    {
      name: "Resumen",
      description: "Resumen ejecutivo para decisiones rápidas",
      pdf: "/documentos/reportes/Informe resumen con nivel ideal.pdf",
    },
    {
      name: "Para el Participante",
      description: "Reporte personalizado para el candidato",
      pdf: "/documentos/reportes/Informe participante con nivel ideal.pdf",
    },
  ]

  const basicReport = {
    name: "Reporte Individual Básico",
    description: "Evaluación estándar con métricas esenciales",
    pdf: "/documentos/reportes/Informe básico de competencias y razonamiento general.pdf",
  }

  const groupReport = {
    name: "Reporte Grupal",
    description: "Análisis comparativo de múltiples candidatos (disponible para todas las versiones)",
    link: "https://docs.google.com/spreadsheets/d/12UhVE8B5bnvDgwFpxXSJ4HqIUx7ZWqig/edit?usp=sharing&ouid=116100766788526348199&rtpof=true&sd=true",
  }

  const handleVideoClick = () => {
    window.open("https://drive.google.com/file/d/1-wMmLfcbCymr6V0XfrfD9pIdFBJEOXw3/view", "_blank")
  }

  return (
    <section id="reports" className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Reportes de Evaluación</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Card */}
          <Card
            onClick={handleVideoClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer lg:row-span-2 flex flex-col p-0 gap-0"
          >
            <div className="relative w-full h-72 lg:h-[calc(100%-6rem)] overflow-hidden flex-shrink-0">
              <Image
                src="/global-education.jpeg"
                alt="Video Explicativo"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24 flex-shrink-0">
              <h3 className="text-lg font-bold">Vídeo explicativo acerca de la utilidad de cada reporte</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-5" style={{ color: "#00A99D" }}>
              Reportes Individuales Plus
            </h3>
            <div className="grid grid-cols-1 gap-5">
              {plusReports.map((report, index) => (
                <Card
                  key={index}
                  className="group bg-[#00A99D] text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                  style={{ borderRadius: "16px" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalles de ${report.name}`}
                  onClick={() => report.pdf && window.open(report.pdf, "_blank")}
                >
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div>
                        <h4 className="text-base font-semibold mb-2">{report.name}</h4>
                      </div>
                    </div>
                    <ArrowRight
                      className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Reporte Individual Básico */}
            <div>
              <h3 className="text-xl font-bold mb-5" style={{ color: "#F15A24" }}>
                Reporte Individual Básico
              </h3>
              <Card
                className="group bg-[#F15A24] text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                style={{ borderRadius: "16px" }}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${basicReport.name}`}
                onClick={() => basicReport.pdf && window.open(basicReport.pdf, "_blank")}
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                    <div>
                      <h4 className="text-base font-semibold mb-2">{basicReport.name}</h4>
                    </div>
                  </div>
                  <ArrowRight
                    className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2}
                  />
                </div>
              </Card>
            </div>

            {/* Reporte Grupal */}
            <div>
              <h3 className="text-xl font-bold mb-5" style={{ color: "#1E1A3C" }}>
                Reporte Grupal
              </h3>
              <Card
                className="group bg-[#1E1A3C] text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                style={{ borderRadius: "16px" }}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${groupReport.name}`}
                onClick={() => groupReport.link && window.open(groupReport.link, "_blank")}
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                    <div>
                      <h4 className="text-base font-semibold mb-2">{groupReport.name}</h4>
                    </div>
                  </div>
                  <ArrowRight
                    className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
