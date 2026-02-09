"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Menu, X, Search, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface SubSubsection {
  id: string
  title: string
}

export interface Subsection {
  id: string
  title: string
  subsections?: SubSubsection[]
}

export interface NavItem {
  id: string
  title: string
  subsections?: Subsection[]
}

const defaultNavItems: NavItem[] = [
  {
    id: "use-case",
    title: "Caso de uso multiplicity",
    subsections: [
      { id: "tour-general", title: "Tour General de la Plataforma" },
      {
        id: "paso-1",
        title: "Paso 1: Creación de los perfiles",
        subsections: [
          { id: "tutorial-creacion-perfiles", title: "Creación de Perfiles" },
        ],
      },
      {
        id: "paso-2",
        title: "Paso 2: Creación de Procesos de Evaluación",
        subsections: [
          { id: "tutorial-gestion-usuarios", title: "Gestión de Usuarios" },
          { id: "tutorial-comparativo", title: "Comparativo" },
          { id: "tutorial-indice-tendencias", title: "Índice y Tendencias" },
          { id: "tutorial-creacion-procesos", title: "Creación de Procesos de Evaluación" },
          { id: "tutorial-gestion-participantes", title: "Gestión de Participantes" },
          { id: "tutorial-duplicar-procesos", title: "Duplicar Procesos" },
        ],
      },
      {
        id: "paso-3",
        title: "Paso 3: Envío de Invitaciones a candidatos",
        subsections: [
          { id: "tutorial-invitaciones-correo", title: "Envío de Invitaciones por Correo Electrónico" },
          { id: "tutorial-invitaciones-credenciales", title: "Envío de Invitaciones por Credenciales" },
          { id: "tutorial-estado-pruebas", title: "Estado de las Pruebas y Reinicio" },
        ],
      },
      {
        id: "paso-4",
        title: "Paso 4: Generación de Reportes",
        subsections: [
          { id: "tutorial-utilidad-reportes", title: "Utilidad de los Reportes" },
          { id: "tutorial-reportes-individuales", title: "Descarga Reportes Individuales" },
          { id: "tutorial-reportes-grupales", title: "Descarga Reportes Grupales" },
        ],
      },
    ],
  },
  {
    id: "interpretation",
    title: "Interpretación de Resultados",
    subsections: [
      { id: "tutorial-guia-interpretacion-individual", title: "Guía de Interpretación Individual" },
      { id: "tutorial-guia-interpretacion-grupal", title: "Guía de Interpretación Grupal" },
      { id: "tutorial-interpretacion-resultados", title: "Interpretación de Resultados" },
    ],
  },
  {
    id: "platform",
    title: "Nuestra Plataforma",
    subsections: [
      { id: "documentos-gestion", title: "Documentos de Gestión de la Plataforma" },
      { id: "aplicacion-test", title: "Aplicación de los Test" },
    ],
  },
  {
    id: "conceptual-bases",
    title: "Nuestras Bases Conceptuales",
    subsections: [
      { id: "diccionario", title: "Diccionario de Comportamientos" },
      { id: "tres-documentos", title: "Competencias, Pensamiento y Motivadores" },
      { id: "fichas-tecnicas", title: "Fichas Técnicas de las Pruebas" },
    ],
  },
  {
    id: "assessment-support",
    title: "Apoyándote en la Valoración Integral",
    subsections: [
      { id: "entrevistas", title: "Guías de Entrevistas por Competencias" },
      { id: "retroalimentacion", title: "Retroalimentación de Competencias" },
      { id: "plan-sucesion", title: "Plan de Sucesión" },
      { id: "desarrollo", title: "Desarrollo de Competencias" },
    ],
  },
  { id: "research", title: "Estudios e Investigaciones" },
  {
    id: "multiplicity",
    title: "Conoce más sobre Multiplicity",
    subsections: [
      { id: "about", title: "Acerca de Multiplicity" },
      { id: "business-model", title: "Modelo de Negocios" },
      { id: "reports", title: "Reportes de Evaluación" },
      { id: "faq", title: "Preguntas Frecuentes" },
      { id: "booking", title: "Agendar una Reunión" },
    ],
  },
]

interface ClientSidebarNavProps {
  /** Si se pasa, el sidebar usa esta navegación (p. ej. generada desde CMS). Si no, usa la lista por defecto. */
  navItems?: NavItem[]
}

export function ClientSidebarNav(props: ClientSidebarNavProps) {
  const { navItems: navItemsProp } = props ?? {}
  const navItems = navItemsProp ?? defaultNavItems
  const [activeSection, setActiveSection] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return

      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      let currentTopLevelSection: string | null = null
      let currentPasoSection: string | null = null

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          currentTopLevelSection = navItems[i].id
          break
        }
      }

      if (currentTopLevelSection) {
        const currentItem = navItems.find((item) => item.id === currentTopLevelSection)
        if (currentItem?.subsections) {
          for (let i = currentItem.subsections.length - 1; i >= 0; i--) {
            const sub = currentItem.subsections[i]
            const subElement = document.getElementById(sub.id)
            if (subElement && subElement.offsetTop <= scrollPosition + 150) {
              if (sub.id.startsWith("paso-")) {
                currentPasoSection = sub.id
              }
              break
            }
          }
        }
      }

      setExpandedSections((prev) => {
        const newExpanded: string[] = []

        if (currentTopLevelSection) {
          newExpanded.push(currentTopLevelSection)
        }

        if (currentPasoSection) {
          newExpanded.push(currentPasoSection)
        }

        return newExpanded
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navItems])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      isScrolling.current = true
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: elementPosition, behavior: "smooth" })
      setIsOpen(false)

      element.classList.add("highlight-card")
      setTimeout(() => {
        element.classList.remove("highlight-card")
        isScrolling.current = false
      }, 2000)
    }
  }

  const toggleSection = (itemId: string) => {
    setExpandedSections((prev) => {
      if (itemId.startsWith("paso-")) {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId)
        } else {
          const withoutOtherPasos = prev.filter((id) => !id.startsWith("paso-"))
          return [...withoutOtherPasos, itemId]
        }
      }

      return prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    })
  }

  const filteredNavItems = navItems
    .map((item) => {
      if (searchQuery === "") return item

      const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase())

      const filteredSubsections = item.subsections
        ?.map((sub) => {
          const matchesSubTitle = sub.title.toLowerCase().includes(searchQuery.toLowerCase())

          const filteredSubSubsections = sub.subsections?.filter((subSub) =>
            subSub.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )

          if (matchesSubTitle || (filteredSubSubsections && filteredSubSubsections.length > 0)) {
            return {
              ...sub,
              subsections: filteredSubSubsections,
            }
          }
          return null
        })
        .filter(Boolean) as Subsection[] | undefined

      if (matchesTitle || (filteredSubsections && filteredSubsections.length > 0)) {
        return {
          ...item,
          subsections: filteredSubsections,
        }
      }
      return null
    })
    .filter(Boolean) as NavItem[]

  useEffect(() => {
    if (searchQuery !== "") {
      const sectionsToExpand: string[] = []
      filteredNavItems.forEach((item) => {
        if (item.subsections && item.subsections.length > 0) {
          sectionsToExpand.push(item.id)
          item.subsections.forEach((sub) => {
            if (sub.subsections && sub.subsections.length > 0) {
              sectionsToExpand.push(sub.id)
            }
          })
        }
      })
      setExpandedSections(sectionsToExpand)
    } else {
      setExpandedSections([])
    }
  }, [searchQuery])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-navy text-white p-4 rounded-full shadow-2xl hover:bg-navy/90 transition-all hover:scale-110"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú de navegación"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          "fixed top-20 left-0 h-[calc(100vh-5rem)] w-80 bg-white/98 backdrop-blur-md border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300 shadow-2xl lg:shadow-lg lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="navigation"
        aria-label="Navegación de recursos para clientes"
      >
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Navegación</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar sección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 text-sm border-gray-300 focus:border-primary focus:ring-primary rounded-lg"
                aria-label="Buscar en recursos"
              />
            </div>
          </div>

          <ul className="space-y-1" role="menu">
            {filteredNavItems.map((item) => {
              const isExpanded = expandedSections.includes(item.id)
              const isActive = activeSection === item.id
              const hasSubsections = item.subsections && item.subsections.length > 0

              return (
                <li key={item.id} role="none">
                  <div className="flex items-center gap-1">
                    {hasSubsections && (
                      <button
                        onClick={() => toggleSection(item.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label={isExpanded ? "Contraer" : "Expandir"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        scrollToSection(item.id)
                        if (hasSubsections && !isExpanded) {
                          toggleSection(item.id)
                        }
                      }}
                      className={cn(
                        "flex-1 text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
                        !hasSubsections && "ml-5",
                        isActive
                          ? "bg-[#E11383] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50 hover:text-navy",
                      )}
                      role="menuitem"
                      aria-current={isActive ? "true" : undefined}
                    >
                      {item.title}
                    </button>
                  </div>

                  {hasSubsections && isExpanded && (
                    <ul className="ml-9 mt-1 space-y-1 border-l-2 border-primary/20 pl-3" role="menu">
                      {item.subsections.map((sub) => {
                        const isSubExpanded = expandedSections.includes(sub.id)
                        const hasSubSubsections = sub.subsections && sub.subsections.length > 0

                        return (
                          <li key={sub.id} role="none">
                            <div className="flex items-center gap-1">
                              {hasSubSubsections && (
                                <button
                                  onClick={() => toggleSection(sub.id)}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  aria-label={isSubExpanded ? "Contraer" : "Expandir"}
                                >
                                  {isSubExpanded ? (
                                    <ChevronDown className="h-3 w-3 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-gray-400" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  scrollToSection(sub.id)
                                  if (hasSubSubsections && !isSubExpanded) {
                                    toggleSection(sub.id)
                                  }
                                }}
                                className={cn(
                                  "flex-1 text-left px-3 py-2 rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
                                  !hasSubSubsections && "ml-4",
                                  hasSubSubsections && "font-semibold",
                                  "text-gray-600 hover:text-navy hover:bg-primary/5",
                                )}
                                role="menuitem"
                              >
                                {sub.title}
                              </button>
                            </div>

                            {hasSubSubsections && isSubExpanded && (
                              <ul className="ml-7 mt-1 space-y-0.5 border-l-2 border-primary/10 pl-2" role="menu">
                                {sub.subsections.map((subSub) => (
                                  <li key={subSub.id} role="none">
                                    <button
                                      onClick={() => scrollToSection(subSub.id)}
                                      className={cn(
                                        "w-full text-left px-2 py-1.5 rounded text-sm text-gray-500 hover:text-primary hover:bg-primary/5 transition-all focus:outline-none focus:ring-1 focus:ring-primary/20",
                                      )}
                                      role="menuitem"
                                    >
                                      • {subSub.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
