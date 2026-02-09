"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Mail, CreditCard, ClipboardCheck, Play } from "lucide-react"

interface Tutorial {
  id: string
  label: string
  title: string
  icon?: React.ReactNode
  videoId: string
  image: string
}

export function TutorialStepTwo() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())

  const handleCardClick = (tutorialId: string) => {
    setPlayingVideos(new Set([...playingVideos, tutorialId]))
  }

  const tutorials: Tutorial[] = [
    {
      id: "tutorial-invitaciones-correo",
      label: "Envío de Invitaciones por Correo Electrónico",
      title: "Envío de Invitaciones por Correo Electrónico",
      icon: <Mail className="w-12 h-12" />,
      videoId: "dQw4w9WgXcQ",
      image: "/email-invitation-workflow-dashboard.jpg",
    },
    {
      id: "tutorial-invitaciones-credenciales",
      label: "Envío de Invitaciones por Credenciales de Acceso",
      title: "Envío de Invitaciones por Credenciales de Acceso",
      icon: <CreditCard className="w-12 h-12" />,
      videoId: "dQw4w9WgXcQ",
      image: "/credential-invitation-interface.jpg",
    },
    {
      id: "tutorial-estado-pruebas",
      label: "Estado de las Pruebas y Reinicio",
      title: "Estado de las Pruebas y Reinicio",
      icon: <ClipboardCheck className="w-12 h-12" />,
      videoId: "dQw4w9WgXcQ",
      image: "/evaluation-progress-status-dashboard.jpg",
    },
  ]

  return (
    <div className="w-full max-w-full mx-auto px-6 py-8">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E11383] to-[#C01070] shadow-lg">
              <span className="text-4xl font-black text-white">3</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E11383] uppercase tracking-wider mb-1">Tercer Paso</div>
              <h2 className="text-3xl font-bold text-[#1B1733] leading-tight">Envío de Invitaciones a candidatos</h2>
            </div>
          </div>  
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            id={tutorial.id}
            className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64"
          >
            {playingVideos.has(tutorial.id) ? (
              <iframe
                src={`https://www.youtube.com/embed/${tutorial.videoId}?autoplay=1`}
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
