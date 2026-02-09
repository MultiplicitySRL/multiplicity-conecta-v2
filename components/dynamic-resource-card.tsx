"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { FileDown, Play } from "lucide-react"
import type { ResourceV3 } from "@/lib/resources-cms-v3"
import { getYouTubeEmbedUrl } from "@/lib/resources-cms-v3"

interface DynamicResourceCardProps {
  resource: ResourceV3
  onComplete?: (resourceId: string) => void
}

export function DynamicResourceCard({ resource, onComplete }: DynamicResourceCardProps) {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Si tiene valor en URL VIDEO (ID YouTube) → tiene video
  const hasVideo = !!resource.url_video_youtube?.trim()
  // Si tiene valor en URL Archivo → tiene archivo (PDF, Excel, etc.)
  const hasFile = !!resource.url_archivo?.trim()

  const handlePlayVideo = () => {
    if (hasVideo) {
      setVideoDialogOpen(true)
      if (onComplete) onComplete(`${resource.seccion}-${resource.orden}`)
    }
  }

  const handleOpenFile = () => {
    if (hasFile) {
      window.open(resource.url_archivo, "_blank")
      if (onComplete) onComplete(`${resource.seccion}-${resource.orden}`)
    }
  }

  // Determinar color del footer según el tipo
  const getFooterColor = () => {
    if (resource.seccion.includes("Interpretación")) return "bg-[#E11383]"
    if (resource.paso === "1") return "bg-[#E11383]"
    return "bg-navy"
  }

  const getButtonColor = () => {
    if (resource.seccion.includes("Interpretación") || resource.paso === "1") {
      return "bg-white text-[#E11383] hover:bg-gray-100"
    }
    return "bg-white text-navy hover:bg-gray-100"
  }

  // Determinar si la imagen es externa o local
  const isExternalImage = resource.imagen?.startsWith("http")
  
  // Agregar cache-busting para imágenes externas
  const imageSrc = (() => {
    const baseUrl = resource.imagen || "/placeholder.svg"
    if (!isExternalImage) return baseUrl
    
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}v=${resource.orden}`
  })()

  return (
    <>
      <Card
        id={`resource-${resource.orden}`}
        className="group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 h-64"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={resource.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (!imageError) {
              console.error(`Error loading image for orden ${resource.orden}:`, imageSrc)
              setImageError(true)
              e.currentTarget.src = "/placeholder.svg"
            }
          }}
          crossOrigin={isExternalImage ? "anonymous" : undefined}
        />
        <div className={`absolute bottom-0 left-0 right-0 ${getFooterColor()} text-white p-4`}>
          <h4 className="text-base font-bold leading-tight line-clamp-2 mb-3">{resource.titulo}</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            {hasVideo && (
              <button
                onClick={handlePlayVideo}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${getButtonColor()}`}
              >
                <Play className="w-4 h-4 shrink-0" />
                <span>{resource.texto_boton?.trim() || "Ver Video"}</span>
              </button>
            )}
            {hasFile && (
              <button
                onClick={handleOpenFile}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${getButtonColor()}`}
              >
                <FileDown className="w-4 h-4 shrink-0" />
                <span>{hasVideo ? "Descargar Guía" : (resource.texto_boton?.trim() || "Descargar Guía")}</span>
              </button>
            )}
            {!hasVideo && !hasFile && resource.texto_boton && (
              <span className="text-sm text-white/90 py-1">{resource.texto_boton}</span>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent
          className="max-w-[90vw] w-full sm:max-w-4xl p-0 gap-0 overflow-hidden rounded-xl border-0 bg-black [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:text-white/90"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">{resource.titulo}</DialogTitle>
          <div className="relative w-full aspect-video">
            <iframe
              src={`${getYouTubeEmbedUrl(resource.url_video_youtube)}?autoplay=1`}
              title={resource.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="px-4 py-3 text-sm text-white/90 bg-black">{resource.titulo}</p>
        </DialogContent>
      </Dialog>
    </>
  )
}
