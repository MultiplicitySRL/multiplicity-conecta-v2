"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, FileText, Video } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function UseCaseSection() {
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})

  const handleResourceClick = (url: string, id: string) => {
    setLoadingItem(id)
    window.open(url, "_blank")
    setTimeout(() => setLoadingItem(null), 1000)
  }

  const handleImageLoad = (id: string) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section id="use-case" className="py-20 px-4 md:px-8 lg:px-16 bg-background scroll-mt-20">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3 text-balance">Guías y Tutoriales</h2>
          <p className="text-gray-600 text-lg max-w-3xl text-pretty">
            Aprende a utilizar todas las funcionalidades de la plataforma con nuestros tutoriales paso a paso
          </p>
        </div>

        <div id="perfiles" className="mb-12 scroll-mt-20">
          <h3 className="text-2xl font-bold text-navy mb-6">Definición de Perfiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              onClick={() => handleResourceClick("/documentos/Guia para definir perfiles.pdf", "perfiles-1")}
              className={cn(
                "group relative overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300 border-0 h-64 cursor-pointer",
                loadingItem === "perfiles-1" && "scale-95 opacity-75",
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleResourceClick("/documentos/Guia para definir perfiles.pdf", "perfiles-1")
                }
              }}
              aria-label="Abrir guía para definir perfiles"
            >
              {!imageLoaded["perfiles-1"] && <Skeleton className="absolute inset-0 w-full h-full rounded-3xl" />}
              <img
                src="/professional-team-reviewing-candidate-profiles.jpg"
                alt="Guía para definir perfiles"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  imageLoaded["perfiles-1"] ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => handleImageLoad("perfiles-1")}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  <h4 className="text-lg font-bold">Guía para definir perfiles</h4>
                </div>
                <div
                  className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </Card>

            <Card
              onClick={() => handleResourceClick("/documentos/Perfiles predeterminados OIT.pdf", "perfiles-2")}
              className={cn(
                "group relative overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300 border-0 h-64 cursor-pointer",
                loadingItem === "perfiles-2" && "scale-95 opacity-75",
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleResourceClick("/documentos/Perfiles predeterminados OIT.pdf", "perfiles-2")
                }
              }}
              aria-label="Abrir perfiles predeterminados OIT"
            >
              {!imageLoaded["perfiles-2"] && <Skeleton className="absolute inset-0 w-full h-full rounded-3xl" />}
              <img
                src="/oit-standardized-job-profiles-documentation.jpg"
                alt="Perfiles OIT"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  imageLoaded["perfiles-2"] ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => handleImageLoad("perfiles-2")}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  <h4 className="text-lg font-bold">Perfiles predeterminados OIT</h4>
                </div>
                <div
                  className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div id="tour-general" className="mb-12 scroll-mt-20">
          <div className="bg-gradient-to-r from-primary/5 to-navy/5 rounded-3xl p-6 mb-4">
            <h3 className="text-2xl font-bold text-navy mb-2 flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              Tour General de la Plataforma
            </h3>
            <p className="text-gray-600">Video completo que te guiará por todas las funcionalidades principales</p>
          </div>
          <Card
            onClick={() => handleResourceClick("https://www.youtube.com/watch?v=tour-general", "tour-general-1")}
            className={cn(
              "group relative overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 h-80 cursor-pointer",
              loadingItem === "tour-general-1" && "scale-95 opacity-75",
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleResourceClick("https://www.youtube.com/watch?v=tour-general", "tour-general-1")
              }
            }}
            aria-label="Abrir tour general de la plataforma"
          >
            {!imageLoaded["tour-general-1"] && <Skeleton className="absolute inset-0 w-full h-full rounded-3xl" />}
            <img
              src="/modern-platform-dashboard-interface-overview.jpg"
              alt="Tour General"
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded["tour-general-1"] ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => handleImageLoad("tour-general-1")}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-navy text-navy-foreground p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">Tour General de la Plataforma</h3>
                <p className="text-sm text-navy-foreground/80">Conoce todas las funcionalidades en un video completo</p>
              </div>
              <div
                className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          <TutorialGroup
            id="creacion-procesos"
            title="Creación de Procesos"
            description="Aprende a crear y configurar procesos de evaluación"
            number={1}
            items={[
              { title: "Gestión de usuarios", url: "gestion-usuarios", type: "video" },
              { title: "Creación de perfiles", url: "creacion-perfiles", type: "video" },
              { title: "Comparativo", url: "comparativo", type: "video" },
              { title: "Índice y tendencias", url: "indice-tendencias", type: "video" },
              { title: "Configuración de pruebas", url: "configuracion-pruebas", type: "video" },
              { title: "Gestión de participantes", url: "gestion-participantes", type: "video" },
              { title: "Duplicar procesos", url: "duplicar-procesos", type: "video" },
            ]}
            loadingItem={loadingItem}
            onItemClick={handleResourceClick}
          />

          <TutorialGroup
            id="envio-invitaciones"
            title="Envío de Invitaciones y Seguimiento"
            description="Aprende a enviar invitaciones y seguir el progreso de las pruebas"
            number={2}
            items={[
              { title: "Envío por correo electrónico", url: "envio-correo", type: "video" },
              { title: "Envío por credenciales", url: "envio-credenciales", type: "video" },
              { title: "Estado de pruebas y reinicio", url: "estado-pruebas", type: "video" },
            ]}
            loadingItem={loadingItem}
            onItemClick={handleResourceClick}
          />

          <TutorialGroup
            id="reportes"
            title="Reportes e Interpretación"
            description="Genera y interpreta reportes detallados de tus evaluaciones"
            number={3}
            items={[
              { title: "Utilidad de los reportes", url: "utilidad-reportes", type: "video" },
              { title: "Reportes individuales", url: "reportes-individuales", type: "video" },
              { title: "Reportes grupales", url: "reportes-grupales", type: "video" },
              { title: "Interpretación de resultados", url: "interpretacion", type: "video" },
              { title: "Guía de interpretación individual", url: "Guia interpretacion individual.pdf", type: "doc" },
              { title: "Guía de interpretación grupal", url: "Guia interpretacion grupal.pdf", type: "doc" },
            ]}
            loadingItem={loadingItem}
            onItemClick={handleResourceClick}
          />
        </div>
      </div>
    </section>
  )
}

function TutorialGroup({
  id,
  title,
  description,
  items,
  loadingItem,
  onItemClick,
  number,
}: {
  id: string
  title: string
  description: string
  items: Array<{ title: string; url: string; type: "video" | "doc" }>
  loadingItem: string | null
  onItemClick: (url: string, id: string) => void
  number?: number
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy mb-2 flex items-center gap-3">
          {number && (
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-lg font-bold shrink-0">
              {number}
            </span>
          )}
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const itemId = `${id}-${index}`
          const isVideo = item.type === "video"
          const url = isVideo ? `https://www.youtube.com/watch?v=${item.url}` : `/documentos/${item.url}`

          return (
            <Card
              key={index}
              onClick={() => onItemClick(url, itemId)}
              className={cn(
                "group relative overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300 border-0 bg-white p-5 cursor-pointer hover:bg-gray-50",
                loadingItem === itemId && "scale-95 opacity-75",
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onItemClick(url, itemId)
                }
              }}
              aria-label={`Abrir ${item.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn("rounded-full p-2 shrink-0", isVideo ? "bg-red-50" : "bg-blue-50")}>
                    {isVideo ? (
                      <Video className="w-4 h-4 text-red-600" aria-hidden="true" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-navy leading-tight">{item.title}</h4>
                </div>
                <div className="bg-gray-100 rounded-full p-1.5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
