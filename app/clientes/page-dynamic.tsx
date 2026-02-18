"use client"

import { useState, useEffect, useMemo } from "react"
import { AboutSection } from "@/components/about-section"
import { BusinessModelSection } from "@/components/business-model-section"
import { ReportsSection } from "@/components/reports-section"
import { Footer } from "@/components/footer"
import { ClientSidebarNav, type NavItem, type Subsection, type SubSubsection } from "@/components/client-sidebar-nav"
import { BookingSection } from "@/components/booking-section"
import { HeroSection } from "@/components/hero-section"
import { OnboardingGuide } from "@/components/onboarding-guide"
import { DynamicStepSection } from "@/components/dynamic-step-section"
import { DynamicSection } from "@/components/dynamic-section"
import { DynamicResourceCard } from "@/components/dynamic-resource-card"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Image from "next/image"
import type { ResourceV3 } from "@/lib/resources-cms-v3"
import { isSection, getYouTubeEmbedUrl } from "@/lib/resources-cms-v3"

export default function ClientesPageDynamic() {
  const [resources, setResources] = useState<ResourceV3[] | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [completedResources, setCompletedResources] = useState<string[]>([])

  // Cargar recursos desde la API en el cliente (siempre datos frescos)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/resources?_=${Date.now()}&r=${Math.random()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        })
        if (!res.ok) throw new Error("Error al cargar recursos")
        const data = await res.json()
        setResources(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setResources([])
      }
    }
    load()
  }, [])

  useEffect(() => {
    const hasVisited = localStorage.getItem("multiplicity_visited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("multiplicity_visited", "true")
    }

    const saved = localStorage.getItem("multiplicity_completed")
    if (saved) {
      setCompletedResources(JSON.parse(saved))
    }
  }, [])

  const handleResourceComplete = (resourceId: string) => {
    const updated = [...completedResources, resourceId]
    setCompletedResources(updated)
    localStorage.setItem("multiplicity_completed", JSON.stringify(updated))
  }

  // Agrupar recursos por categoría (siempre ejecutar para mantener orden de Hooks; cuando resources es null usamos [])
  const res = resources ?? []
  const introSection = res.find((r) => r.seccion.includes("Introducción") && isSection(r))
  const tourGeneral = res.find((r) => r.seccion.includes("Introducción") && !isSection(r))
  const paso1Resources = res.filter((r) => r.paso === "1" && !isSection(r))
  const paso1Section = res.find((r) => r.paso === "1" && isSection(r))
  const paso2Resources = res.filter((r) => r.paso === "2" && !isSection(r))
  const paso2Section = res.find((r) => r.paso === "2" && isSection(r))
  const paso3Resources = res.filter((r) => r.paso === "3" && !isSection(r))
  const paso3Section = res.find((r) => r.paso === "3" && isSection(r))
  const paso4Resources = res.filter((r) => r.paso === "4" && !isSection(r))
  const paso4Section = res.find((r) => r.paso === "4" && isSection(r))
  const paso5Resources = res.filter((r) => r.paso === "5" && !isSection(r))
  const paso5Section = res.find((r) => r.paso === "5" && isSection(r))
  const interpretacionResources = res.filter((r) => r.seccion.includes("Interpretación") && !isSection(r))
  const interpretacionSection = res.find((r) => r.seccion.includes("Interpretación") && isSection(r))
  const agendarCita = res.find((r) => r.seccion.includes("Agendar"))
  const manualesResources = res.filter((r) => r.seccion.includes("Manuales") && !isSection(r))
  const manualesSection = res.find((r) => r.seccion.includes("Manuales") && isSection(r))
  const conceptualResources = res.filter((r) => r.seccion.includes("Bases Conceptuales") && !isSection(r))
  const conceptualSection = res.find((r) => r.seccion.includes("Bases Conceptuales") && isSection(r))
  const valoracionResources = res.filter((r) => r.seccion.includes("Valoración") && !isSection(r))
  const valoracionSection = res.find((r) => r.seccion.includes("Valoración") && isSection(r))
  const investigacionResources = res.filter((r) => r.seccion.includes("Investigaciones") && !isSection(r))
  const investigacionSection = res.find((r) => r.seccion.includes("Investigaciones") && isSection(r))

  // Navegación del sidebar generada desde el contenido dinámico (CMS) — useMemo debe ir antes de cualquier return
  const sidebarNavItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = []

    // 1. Caso de uso multiplicity (use-case)
    const useCaseSubs: Subsection[] = []
    if (tourGeneral) {
      useCaseSubs.push({ id: "tour-general", title: tourGeneral.titulo })
    }
    if (paso1Section && paso1Resources.length > 0) {
      useCaseSubs.push({
        id: "paso-1",
        title: paso1Section.titulo,
        subsections: paso1Resources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo })),
      })
    }
    if (paso2Section && paso2Resources.length > 0) {
      useCaseSubs.push({
        id: "paso-2",
        title: paso2Section.titulo,
        subsections: paso2Resources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo })),
      })
    }
    if (paso3Section && paso3Resources.length > 0) {
      useCaseSubs.push({
        id: "paso-3",
        title: paso3Section.titulo,
        subsections: paso3Resources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo })),
      })
    }
    if (paso4Section && paso4Resources.length > 0) {
      useCaseSubs.push({
        id: "paso-4",
        title: paso4Section.titulo,
        subsections: paso4Resources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo })),
      })
    }
    if (paso5Section && paso5Resources.length > 0) {
      useCaseSubs.push({
        id: "paso-5",
        title: paso5Section.titulo,
        subsections: paso5Resources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo })),
      })
    }
    if (introSection || useCaseSubs.length > 0) {
      items.push({
        id: "use-case",
        title: introSection?.titulo ?? "Caso de uso multiplicity",
        subsections: useCaseSubs.length > 0 ? useCaseSubs : undefined,
      })
    }

    // 2. Interpretación de Resultados
    if (interpretacionSection || interpretacionResources.length > 0) {
      items.push({
        id: "interpretation",
        title: interpretacionSection?.titulo ?? "Interpretación de Resultados",
        subsections:
          interpretacionResources.length > 0
            ? interpretacionResources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo }))
            : undefined,
      })
    }

    // 3. Agendar Cita
    if (agendarCita) {
      items.push({ id: "agendar", title: agendarCita.titulo })
    }

    // 4. Manuales (platform)
    if (manualesSection || manualesResources.length > 0) {
      items.push({
        id: "platform",
        title: manualesSection?.titulo ?? "Manuales",
        subsections:
          manualesResources.length > 0
            ? manualesResources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo }))
            : undefined,
      })
    }

    // 5. Bases Conceptuales
    if (conceptualSection || conceptualResources.length > 0) {
      items.push({
        id: "conceptual-bases",
        title: conceptualSection?.titulo ?? "Nuestras bases conceptuales",
        subsections:
          conceptualResources.length > 0
            ? conceptualResources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo }))
            : undefined,
      })
    }

    // 6. Valoración Integral
    if (valoracionSection || valoracionResources.length > 0) {
      items.push({
        id: "assessment-support",
        title: valoracionSection?.titulo ?? "Apoyándote En La Valoración integral",
        subsections:
          valoracionResources.length > 0
            ? valoracionResources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo }))
            : undefined,
      })
    }

    // 7. Estudios e Investigaciones
    if (investigacionSection || investigacionResources.length > 0) {
      items.push({
        id: "research",
        title: investigacionSection?.titulo ?? "Estudios e Investigaciones",
        subsections:
          investigacionResources.length > 0
            ? investigacionResources.map((r) => ({ id: `resource-${r.orden}`, title: r.titulo }))
            : undefined,
      })
    }

    // 8. Conoce más sobre Multiplicity (secciones estáticas)
    items.push({
      id: "multiplicity",
      title: "Conoce más sobre Multiplicity",
      subsections: [
        { id: "hero", title: "Inicio" },
        { id: "about", title: "Acerca de Multiplicity" },
        { id: "business-model", title: "Modelo de Negocios" },
        { id: "reports", title: "Reportes de Evaluación" },
        { id: "booking", title: "Agendar una Reunión" },
      ],
    })

    return items
  }, [
    introSection,
    tourGeneral,
    paso1Section,
    paso1Resources,
    paso2Section,
    paso2Resources,
    paso3Section,
    paso3Resources,
    paso4Section,
    paso4Resources,
    paso5Section,
    paso5Resources,
    interpretacionSection,
    interpretacionResources,
    agendarCita,
    manualesSection,
    manualesResources,
    conceptualSection,
    conceptualResources,
    valoracionSection,
    valoracionResources,
    investigacionSection,
    investigacionResources,
  ])

  // Loading: mostrar mientras se cargan los recursos (después de todos los Hooks)
  if (resources === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#E11383] border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-medium">Cargando recursos...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      <style jsx global>{`
        @keyframes highlightPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(225, 19, 131, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(225, 19, 131, 0);
            transform: scale(1.02);
          }
        }

        .highlight-card {
          animation: highlightPulse 0.6s ease-in-out 3;
        }
      `}</style>

      {/* {showOnboarding && <OnboardingGuide onComplete={() => setShowOnboarding(false)} />} */}

      <ClientSidebarNav navItems={sidebarNavItems} />

      <div className="lg:pl-72">
        <div className="pt-2">
          <div className="container mx-auto px-4 max-w-[1120px]">
            <div className="flex justify-center">
              <Image
                src="/images/Multiplicity Conecta logo.png"
                alt="Multiplicity Logo"
                width={300}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1120px] pt-4 pb-8">
          {/* Caso de Uso */}
          {introSection && (
            <div id="use-case" className="mb-20">
              <div className="relative bg-navy rounded-3xl p-12 mb-12 overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                  <h2 className="text-5xl font-bold mb-6 text-left">
                    <span style={{ color: "#E11383" }}>
                      {introSection.titulo.split(" ").slice(0, 2).join(" ")}{" "}
                    </span>
                    <span className="text-white">{introSection.titulo.split(" ").slice(2).join(" ")}</span>
                  </h2>
                  {introSection.descripcion && (
                    <p className="text-2xl text-left leading-relaxed">
                      <span className="italic" style={{ color: "#E11383" }}>
                        {introSection.descripcion.split(" ").slice(0, 2).join(" ")}{" "}
                      </span>
                      <span className="text-white italic font-semibold">
                        {introSection.descripcion.split(" ").slice(2).join(" ")}
                      </span>
                    </p>
                  )}
                </div>

                <div className="absolute bottom-8 right-8 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange" />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#E11383" }} />
                  <div className="w-6 h-6 rounded-full bg-primary" />
                  <div className="w-6 h-6 rounded-full bg-red" />
                </div>
              </div>

              {/* Tour General */}
              {tourGeneral && (
                <div id="tour-general" className="mb-6">
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-lg">
                    <div className="grid md:grid-cols-2">
                      <div className="p-4 flex flex-col justify-center bg-white">
                        <h3 className="text-2xl font-bold" style={{ color: "#E11383" }}>
                          {tourGeneral.titulo}
                        </h3>
                        {tourGeneral.descripcion && (
                          <p className="text-base text-gray-600 mt-2">{tourGeneral.descripcion}</p>
                        )}
                      </div>

                      <div className="relative aspect-[16/8] bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(tourGeneral.url_video_youtube)}
                          title={tourGeneral.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

            {/* Pasos */}
            <div className="pl-8 border-l-4 border-[#E11383]/20 space-y-20 mt-16">
              {/* Paso 1 */}
              {paso1Resources.length > 0 && paso1Section && (
                <div id="paso-1">
                  <DynamicStepSection
                    stepNumber="1"
                    stepTitle={paso1Section.titulo}
                    stepDescription={paso1Section.descripcion}
                    resources={paso1Resources}
                    onResourceComplete={handleResourceComplete}
                  />
                </div>
              )}

              {/* Paso 2 */}
              {paso2Resources.length > 0 && paso2Section && (
                <div id="paso-2">
                  <DynamicStepSection
                    stepNumber="2"
                    stepTitle={paso2Section.titulo}
                    stepDescription={paso2Section.descripcion}
                    resources={paso2Resources}
                    onResourceComplete={handleResourceComplete}
                  />
                </div>
              )}

              {/* Paso 3 */}
              {paso3Resources.length > 0 && paso3Section && (
                <div id="paso-3">
                  <DynamicStepSection
                    stepNumber="3"
                    stepTitle={paso3Section.titulo}
                    stepDescription={paso3Section.descripcion}
                    resources={paso3Resources}
                    onResourceComplete={handleResourceComplete}
                  />
                </div>
              )}

              {/* Paso 4 */}
              {paso4Resources.length > 0 && paso4Section && (
                <div id="paso-4">
                  <DynamicStepSection
                    stepNumber="4"
                    stepTitle={paso4Section.titulo}
                    stepDescription={paso4Section.descripcion}
                    resources={paso4Resources}
                    onResourceComplete={handleResourceComplete}
                  />
                </div>
              )}

              {/* Paso 5 */}
              {paso5Resources.length > 0 && paso5Section && (
                <div id="paso-5">
                  <DynamicStepSection
                    stepNumber="5"
                    stepTitle={paso5Section.titulo}
                    stepDescription={paso5Section.descripcion}
                    resources={paso5Resources}
                    onResourceComplete={handleResourceComplete}
                  />
                </div>
              )}
            </div>

          {/* Interpretación de Resultados */}
          {interpretacionResources.length > 0 && interpretacionSection && (
            <div id="interpretation" className="mb-20">
              <section className="py-16 px-4 md:px-8 lg:px-16 bg-background">
                <div className="max-w-[1120px] mx-auto">
                  <div className="relative bg-navy rounded-3xl p-12 mb-12 overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-5xl font-bold text-left mb-6">
                        <span style={{ color: "#E11383" }}>
                          {interpretacionSection.titulo.split(" ").slice(0, 2).join(" ")}{" "}
                        </span>
                        <span className="text-white">{interpretacionSection.titulo.split(" ").slice(2).join(" ")}</span>
                      </h2>
                      {interpretacionSection.descripcion && (
                        <p className="text-xl text-white italic text-left">
                          <span style={{ color: "#E11383" }}>
                            {interpretacionSection.descripcion.split(" ").slice(0, 3).join(" ")}{" "}
                          </span>
                          <span className="text-white">
                            {interpretacionSection.descripcion.split(" ").slice(3).join(" ")}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="absolute bottom-8 right-8 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange" />
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#E11383" }} />
                      <div className="w-6 h-6 rounded-full bg-primary" />
                      <div className="w-6 h-6 rounded-full bg-red" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interpretacionResources.map((resource, index) => (
                      <DynamicResourceCard
                        key={`${resource.seccion}-${index}`}
                        resource={resource}
                        onComplete={handleResourceComplete}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Agendar Cita */}
          {agendarCita && (
            <div id="agendar" className="mb-20">
              <Card className="relative overflow-hidden rounded-2xl border-0 bg-navy shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex-1 flex items-center gap-4 md:gap-6">
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight">
                          {agendarCita.titulo}
                        </h3>
                        <p className="text-sm md:text-base text-white/90">{agendarCita.descripcion}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(agendarCita.url_archivo, "_blank")}
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{agendarCita.texto_boton}</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Separador */}
          <div className="my-20">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
              <div className="px-4">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Otros Contenidos</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
            </div>
          </div>

          {/* Manuales */}
          {manualesResources.length > 0 && (
            <div id="platform" className="mb-20">
              <DynamicSection resources={manualesResources} sectionData={manualesSection} backgroundColor="bg-navy" />
            </div>
          )}

          {/* Bases Conceptuales */}
          {conceptualResources.length > 0 && (
            <div id="conceptual-bases" className="mb-20">
              <DynamicSection resources={conceptualResources} sectionData={conceptualSection} backgroundColor="bg-navy" layoutVariant="conceptual" />
            </div>
          )}

          {/* Valoración Integral */}
          {valoracionResources.length > 0 && (
            <div id="assessment-support" className="mb-20">
              <DynamicSection resources={valoracionResources} sectionData={valoracionSection} backgroundColor="bg-navy" />
            </div>
          )}

          {/* Estudios e Investigaciones */}
          {investigacionResources.length > 0 && (
            <div id="research" className="mb-20">
              <DynamicSection resources={investigacionResources} sectionData={investigacionSection} backgroundColor="bg-navy" />
            </div>
          )}

          {/* Separador */}
          <div className="my-20">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12" />
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span style={{ color: "#E11383" }}>Conoce más sobre </span>
                <span className="text-navy">Multiplicity</span>
              </h2>
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#E11383", animationDelay: "0.2s" }}
                />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                <div className="w-2 h-2 rounded-full bg-red animate-pulse" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </div>

          <div id="hero" className="mb-20">
            <HeroSection />
          </div>

          <div id="about" className="mb-20">
            <AboutSection />
          </div>
          <div id="business-model" className="mb-20">
            <BusinessModelSection hideCotizar={true} />
          </div>
          <div id="reports" className="mb-20">
            <ReportsSection />
          </div>
          <div id="booking" className="mb-20">
            <BookingSection />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}
