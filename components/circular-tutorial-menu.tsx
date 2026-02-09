"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

interface Tutorial {
  id: string
  label: string
  title: string
  youtubeId: string
  image: string
}

const tutorials: Tutorial[] = [
  {
    id: "tutorial-gestion-usuarios",
    label: "Gestión de Usuarios",
    title: "Vídeo: Gestión de Usuarios",
    youtubeId: "lTX96_VH7nY",
    image: "/clean-user-management-dashboard.jpg",
  },
  {
    id: "tutorial-comparativo",
    label: "Comparativo",
    title: "Vídeo: Comparativo",
    youtubeId: "pVzVMefVTJU",
    image: "/profile-comparison-dashboard.jpg",
  },
  {
    id: "tutorial-indice-tendencias",
    label: "Índice y Tendencias",
    title: "Vídeo: Índice y Tendencias",
    youtubeId: "dQw4w9WgXcQ",
    image: "/evaluation-workflow-builder.jpg",
  },
  {
    id: "tutorial-creacion-procesos",
    label: "Creación de Procesos de Evaluación y Configuración de Pruebas",
    title: "Vídeo: Creación de Procesos de Evaluación y Configuración de Pruebas",
    youtubeId: "tO1sRoO8Arc",
    image: "/evaluation-workflow-builder.jpg",
  },
  {
    id: "tutorial-gestion-participantes",
    label: "Gestión de Participantes",
    title: "Vídeo: Gestión de Participantes",
    youtubeId: "oTV_B7H1kD8",
    image: "/participant-management-interface.jpg",
  },
  {
    id: "tutorial-duplicar-procesos",
    label: "Duplicar Procesos",
    title: "Vídeo: Duplicar Procesos",
    youtubeId: "WGBNbEdzGlI",
    image: "/process-duplication-workflow.jpg",
  },
]

export function CircularTutorialMenu() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())

  const handleCardClick = (tutorialId: string) => {
    setPlayingVideos(new Set([...playingVideos, tutorialId]))
  }

  return (
    <div className="mx-auto w-full max-w-full px-6 py-8">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E11383] to-[#C01070] shadow-lg">
              <span className="text-4xl font-black text-white">2</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E11383] uppercase tracking-wider mb-1">Segundo Paso</div>
              <h2 className="text-3xl font-bold text-[#1B1733] leading-tight">Creación de Procesos de Evaluación</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            id={tutorial.id}
            className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64"
          >
            {playingVideos.has(tutorial.id) ? (
              <iframe
                src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1`}
                title={tutorial.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <>
                <img
                  src={tutorial.image || "/placeholder.svg"}
                  alt={tutorial.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-4">
                  <h4 className="text-base font-bold leading-tight line-clamp-2 mb-3">{tutorial.label}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(tutorial.id)
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-white text-navy px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Ver Tutorial</span>
                  </button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
