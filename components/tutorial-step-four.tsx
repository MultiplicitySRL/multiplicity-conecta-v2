"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"

interface Resource {
  id: string
  label: string
  title: string
  type: "downloadable" | "video"
  videoId?: string
  image: string
}

export function TutorialStepFour() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())

  const handleCardClick = (resourceId: string, type: string) => {
    if (type === "video") {
      setPlayingVideos(new Set([...playingVideos, resourceId]))
    } else {
      // Handle downloadable documents
      window.open(`/documentos/${resourceId}.pdf`, "_blank")
    }
  }

  const resources: Resource[] = [
    {
      id: "tutorial-guia-interpretacion-individual",
      label: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
      title: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
      type: "downloadable",
      image: "/individual-assessment-report-dashboard.jpg",
    },
    {
      id: "tutorial-guia-interpretacion-grupal",
      label: "Guía de Interpretación de Resultados Grupales Empresa",
      title: "Guía de Interpretación de Resultados Grupales Empresa",
      type: "downloadable",
      image: "/group-performance-analytics-dashboard.jpg",
    },
    {
      id: "tutorial-interpretacion-resultados",
      label: "Interpretación de Resultados",
      title: "Interpretación de Resultados",
      type: "video",
      videoId: "dQw4w9WgXcQ",
      image: "/individual-assessment-report-dashboard.jpg",
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E11383] to-[#C0106E] shadow-lg">
              <span className="text-4xl font-black text-white">5</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E11383] uppercase tracking-wider mb-1">Quinto Paso</div>
              <h2 className="text-3xl font-bold text-[#1B1733] leading-tight">Interpretación de Resultados</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            id={resource.id}
            onClick={() => !playingVideos.has(resource.id) && handleCardClick(resource.id, resource.type)}
            className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64 cursor-pointer bg-white shadow-sm"
          >
            {playingVideos.has(resource.id) && resource.type === "video" ? (
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
                <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-4 h-20 flex items-center">
                  <div className="flex items-center justify-between w-full gap-2">
                    <h4 className="text-base font-bold leading-tight line-clamp-2 flex-1">{resource.label}</h4>
                    {resource.type === "downloadable" && <FileDown className="w-5 h-5 flex-shrink-0" />}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
