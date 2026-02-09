"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FileDown, Play } from "lucide-react"

interface Resource {
  id: string
  label: string
  title: string
  documentId: string
  videoId: string
  image: string
}

export function InterpretationSection() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())

  const handleDownload = (documentId: string) => {
    window.open(`/documentos/${documentId}.pdf`, "_blank")
  }

  const handleVideoClick = (resourceId: string) => {
    setPlayingVideos(new Set([...playingVideos, resourceId]))
  }

  const resources: Resource[] = [
    {
      id: "tutorial-guia-interpretacion-individual",
      label: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
      title: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
      documentId: "tutorial-guia-interpretacion-individual",
      videoId: "dQw4w9WgXcQ",
      image: "/individual-assessment-report-dashboard.jpg",
    },
    {
      id: "tutorial-guia-interpretacion-grupal",
      label: "Guía de Interpretación de Resultados Grupales Empresa",
      title: "Guía de Interpretación de Resultados Grupales Empresa",
      documentId: "tutorial-guia-interpretacion-grupal",
      videoId: "dQw4w9WgXcQ",
      image: "/group-performance-analytics-dashboard.jpg",
    },
  ]

  return (
    <section id="interpretation" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="relative bg-navy rounded-3xl p-12 mb-12 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-left mb-6">
              <span style={{ color: "#E11383" }}>Interpretación de </span>
              <span className="text-white">Resultados</span>
            </h2>
            <p className="text-xl text-white italic text-left">
              <span style={{ color: "#E11383" }}>Guías y videos </span>
              <span className="text-white">
                para interpretar los resultados de las evaluaciones de manera efectiva.
              </span>
            </p>
          </div>

          {/* Colorful dots decoration */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange" />
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#E11383" }} />
            <div className="w-6 h-6 rounded-full bg-primary" />
            <div className="w-6 h-6 rounded-full bg-red" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              id={resource.id}
              className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64 bg-white shadow-sm"
            >
              {playingVideos.has(resource.id) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${resource.videoId}?autoplay=1`}
                  title={resource.label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={resource.image || "/placeholder.svg"}
                    alt={resource.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#E11383] text-white p-4">
                    <h4 className="text-base font-bold leading-tight line-clamp-2 mb-3">{resource.label}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(resource.documentId)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-[#E11383] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Descargar Guía</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVideoClick(resource.id)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Ver Video</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
