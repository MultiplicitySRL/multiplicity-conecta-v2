
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const YOUTUBE_VIDEO_ID = "zaPCA2Ka6Pc"

export function AboutSection() {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)

  const handlePresentacionClick = () => {
    window.open("/documentos/Presentacion de Servicios Multiplicity.pdf", "_blank")
  }

  const handleVideoClick = () => {
    setVideoDialogOpen(true)
  }

  const handleCarteraClick = () => {
    window.open("/documentos/Cartera de Clientes Multiplicity.pdf", "_blank")
  }

  const handleTendenciasClick = () => {
    window.open("/indices-y-tendencias.jpg", "_blank")
  }

  return (
    <section id="about" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">Acerca de Multiplicity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Presentación de Servicios */}
          <Card
            onClick={handlePresentacionClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
          >
            <div className="h-72 overflow-hidden flex-shrink-0">
              <img
                src="/images/presentacion-20de-20servicios-20-281-29.jpeg"
                alt="Presentación de servicios"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24">
              <h3 className="text-lg font-bold">Nuestra Presentación de Servicios</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>

          {/* Vídeo Acerca de Multiplicity */}
          <Card
            onClick={handleVideoClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
          >
            <div className="h-72 overflow-hidden flex-shrink-0">
              <img
                src="/images/video-20acerca-20multiplicity-20-281-29.jpeg"
                alt="Vídeo Multiplicity"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24">
              <h3 className="text-lg font-bold">Vídeo Acerca de Multiplicity</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>

          <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
            <DialogContent
              className="max-w-6xl w-[95vw] p-0 gap-0 overflow-hidden rounded-2xl border bg-background shadow-xl lg:max-w-[min(92vw,1600px)] lg:w-[92vw]"
              showCloseButton={true}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b bg-background pr-14">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Vídeo Acerca de Multiplicity
                </DialogTitle>
              </div>
              <div className="relative w-full aspect-video bg-black rounded-b-2xl overflow-hidden lg:min-h-[70vh]">
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1`}
                  title="Vídeo Acerca de Multiplicity"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Índices y Tendencias */}
          <Card
            onClick={handleTendenciasClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
          >
            <div className="h-72 overflow-hidden flex-shrink-0">
              <img
                src="/indices-y-tendencias.jpg"
                alt="Índices y Tendencias"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24">
              <h3 className="text-lg font-bold">Índices y Tendencias</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>

          {/* Cartera de Clientes */}
          <Card
            onClick={handleCarteraClick}
            className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
          >
            <div className="h-72 overflow-hidden flex-shrink-0">
              <img
                src="/images/nuestra-cartera-de-clientes.jpg"
                alt="Cartera de clientes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24">
              <h3 className="text-lg font-bold">Nuestra Cartera de Clientes</h3>
              <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
