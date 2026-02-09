import { Card } from "@/components/ui/card"
import type { ResourceV3 } from "@/lib/resources-cms-v3"

interface DynamicSectionProps {
  title?: string
  subtitle?: string
  resources: ResourceV3[]
  backgroundColor?: string
  sectionData?: ResourceV3 // Datos de la sección (tipo "Sección")
  /** Solo en "Nuestras bases conceptuales": layout 1 grande, 3 pequeñas, 1 grande, 3 pequeñas... */
  layoutVariant?: "default" | "conceptual"
}

export function DynamicSection({ title, subtitle, resources, backgroundColor = "bg-navy", sectionData, layoutVariant = "default" }: DynamicSectionProps) {
  if (resources.length === 0) return null

  // Usar datos de la sección si están disponibles, sino del primer recurso
  const firstResource = resources[0]
  const sectionTitle = title || sectionData?.titulo || firstResource.seccion.replace(/^[🎯📊📚🧠💼🔬📅⚙️]+\s*/, "")
  const sectionDescription = subtitle || sectionData?.descripcion || firstResource.descripcion

  // Si es layout conceptual: 1 grande, 3 pequeñas, 1 grande, 3 pequeñas (sin agrupar por subsección)
  const isConceptualLayout = layoutVariant === "conceptual"

  // Agrupar recursos por subsección (no se usa cuando layoutVariant === "conceptual")
  const groupedResources = resources.reduce(
    (acc, resource) => {
      const key = resource.subseccion || "_main"
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(resource)
      return acc
    },
    {} as Record<string, ResourceV3[]>,
  )

  // Si tiene valor en URL Archivo → abrir archivo (PDF, etc.)
  const handleResourceClick = (resource: ResourceV3) => {
    if (resource.url_archivo?.trim()) {
      window.open(resource.url_archivo, "_blank")
    }
  }

  // Helper para agregar cache-busting a imágenes externas
  const getImageSrc = (resource: ResourceV3) => {
    const baseUrl = resource.imagen || "/placeholder.svg"
    const isExternal = baseUrl.startsWith("http")
    
    if (!isExternal) return baseUrl
    
    // Usar el orden del recurso como versión para cache-busting
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}v=${resource.orden}`
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        {/* Header de la sección */}
        <div className={`mb-12 ${backgroundColor} rounded-3xl p-12 relative overflow-hidden`}>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-pink">{sectionTitle.split(" ").slice(0, 2).join(" ")} </span>
              <span className="text-white">{sectionTitle.split(" ").slice(2).join(" ")}</span>
            </h2>
            {sectionDescription && (
              <p className="text-lg md:text-xl italic max-w-4xl">
                <span className="text-pink">{sectionDescription.split(" ").slice(0, 3).join(" ")} </span>
                <span className="text-white">{sectionDescription.split(" ").slice(3).join(" ")}</span>
              </p>
            )}
          </div>

          {/* Decorative dots */}
          <div className="absolute bottom-6 right-6 flex gap-3">
            <div className="w-4 h-4 rounded-full bg-orange" />
            <div className="w-4 h-4 rounded-full bg-pink" />
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div className="w-4 h-4 rounded-full bg-red" />
          </div>
        </div>

        {/* Layout conceptual: 1 grande, 3 pequeñas, 1 grande, 3 pequeñas... */}
        {isConceptualLayout && (
          <div className="space-y-8">
            {(() => {
              const items: ResourceV3[] = resources
              const blocks: { large?: ResourceV3; small: ResourceV3[] }[] = []
              for (let i = 0; i < items.length; i += 4) {
                blocks.push({
                  large: items[i] ?? undefined,
                  small: [items[i + 1], items[i + 2], items[i + 3]].filter(Boolean),
                })
              }
              return blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="space-y-6">
                  {block.large && (
                    <Card
                      data-card-id={`resource-${block.large.orden}`}
                      onClick={() => handleResourceClick(block.large!)}
                      className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
                    >
                      <div className="relative h-72 md:h-80 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageSrc(block.large)}
                          alt={block.large.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                          crossOrigin={block.large.imagen?.startsWith("http") ? "anonymous" : undefined}
                        />
                      </div>
                      <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 shrink-0">
                        <h4 className="text-lg font-bold text-left">{block.large.titulo}</h4>
                      </div>
                    </Card>
                  )}
                  {block.small.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {block.small.map((resource, index) => (
                        <Card
                          key={`${resource.seccion}-${resource.orden}-${index}`}
                          data-card-id={`resource-${resource.orden}`}
                          onClick={() => handleResourceClick(resource)}
                          className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
                        >
                          <div className="relative h-52 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getImageSrc(resource)}
                              alt={resource.titulo}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                              crossOrigin={resource.imagen?.startsWith("http") ? "anonymous" : undefined}
                            />
                          </div>
                          <div className="bg-navy text-navy-foreground min-h-[4.5rem] flex items-center px-4 shrink-0">
                            <h4 className="text-base font-bold text-left leading-tight">{resource.titulo}</h4>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))
            })()}
          </div>
        )}

        {/* Recursos principales (sin subsección) — layout por defecto */}
        {!isConceptualLayout && groupedResources._main && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedResources._main.map((resource, index) => (
                <Card
                  key={`${resource.seccion}-${resource.orden}-${index}`}
                  data-card-id={`resource-${resource.orden}`}
                  onClick={() => handleResourceClick(resource)}
                  className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
                >
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageSrc(resource)}
                      alt={resource.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                      crossOrigin={resource.imagen?.startsWith("http") ? "anonymous" : undefined}
                    />
                  </div>
                  <div className="bg-navy text-navy-foreground h-20 flex items-center px-6 flex-shrink-0">
                    <h4 className="text-lg font-bold text-left">{resource.titulo}</h4>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subsecciones — layout por defecto */}
        {!isConceptualLayout &&
        Object.entries(groupedResources).map(([subsection, subsectionResources]) => {
          if (subsection === "_main") return null

          return (
            <div key={subsection} className="mb-12">
              <h3 className="text-2xl font-bold text-navy mb-6">{subsection}</h3>
              <div
                className={`grid grid-cols-1 ${subsectionResources.length > 2 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"} gap-6`}
              >
                {subsectionResources.map((resource, index) => (
                  <Card
                    key={`${resource.seccion}-${resource.orden}-${index}`}
                    data-card-id={`resource-${resource.orden}`}
                    onClick={() => handleResourceClick(resource)}
                    className="group flex flex-col overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer p-0 gap-0"
                  >
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/next/no-img-element */}
                      <img
                        src={getImageSrc(resource)}
                        alt={resource.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                        crossOrigin={resource.imagen?.startsWith("http") ? "anonymous" : undefined}
                      />
                    </div>
                    <div className="bg-navy text-navy-foreground h-32 flex items-center px-4 flex-shrink-0">
                      <h4 className="text-base font-bold text-left leading-tight">{resource.titulo}</h4>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
