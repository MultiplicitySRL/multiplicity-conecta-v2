"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FileDown, Play } from "lucide-react"

interface Report {
  id: string
  label: string
  title: string
  videoId: string
  image: string
  type: "video" | "tutorial"
}

export function TutorialStepThree() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())

  const handleCardClick = (reportId: string) => {
    setPlayingVideos(new Set([...playingVideos, reportId]))
  }

  const handleDownload = (documentId: string) => {
    window.open(`/documentos/${documentId}.pdf`, "_blank")
  }

  const reports: Report[] = [
    {
      id: "tutorial-reportes-individuales",
      label: "Descarga Reportes Individuales",
      title: "Descarga Reportes Individuales",
      videoId: "dQw4w9WgXcQ",
      image: "/individual-assessment-report-dashboard.jpg",
      type: "tutorial",
    },
    {
      id: "tutorial-reportes-grupales",
      label: "Descarga Reportes Grupales",
      title: "Descarga Reportes Grupales",
      videoId: "dQw4w9WgXcQ",
      image: "/group-performance-analytics-dashboard.jpg",
      type: "tutorial",
    },
    {
      id: "tutorial-utilidad-reportes",
      label: "Video de Utilidad de los Reportes",
      title: "Utilidad de los Reportes",
      videoId: "dQw4w9WgXcQ",
      image: "/individual-assessment-report-dashboard.jpg",
      type: "video",
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E11383] to-[#C0106E] shadow-lg">
              <span className="text-4xl font-black text-white">4</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E11383] uppercase tracking-wider mb-1">Cuarto Paso</div>
              <h2 className="text-3xl font-bold text-[#1B1733] leading-tight">Generación de Reportes</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.slice(0, 2).map((report) => (
            <Card
              key={report.id}
              id={report.id}
              className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64"
            >
              <img
                src={report.image || "/placeholder.svg"}
                alt={report.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-4">
                <h4 className="text-base font-bold leading-tight line-clamp-2 mb-3">{report.label}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(report.id)
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white text-navy px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Descargar Guía</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.slice(2).map((report) => (
            <Card
              key={report.id}
              id={report.id}
              className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64"
            >
              {playingVideos.has(report.id) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${report.videoId}?autoplay=1`}
                  title={report.label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={report.image || "/placeholder.svg"}
                    alt={report.label}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${report.id === "tutorial-utilidad-reportes" ? "bg-[#E11383] text-white" : "bg-navy text-navy-foreground"}`}>
                    <h4 className="text-base font-bold leading-tight line-clamp-2 mb-3">{report.label}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(report.id)
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        report.id === "tutorial-utilidad-reportes"
                          ? "bg-white text-[#E11383] hover:bg-gray-100"
                          : "bg-white text-navy hover:bg-gray-100"
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span>Ver Video</span>
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
