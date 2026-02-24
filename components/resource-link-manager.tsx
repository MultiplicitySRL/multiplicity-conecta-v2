"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Check, Search, Filter } from "lucide-react"
import type { ResourceV3 } from "@/lib/resources-cms-v3"
import { isSection } from "@/lib/resources-cms-v3"
import { toast } from "sonner"

interface ResourceLinkManagerProps {
  resources: ResourceV3[]
}

export function ResourceLinkManager({ resources }: ResourceLinkManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSection, setFilterSection] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  // Obtener secciones únicas
  const sections = useMemo(() => {
    const sectionSet = new Set<string>()
    resources.forEach((r) => {
      if (r.seccion) sectionSet.add(r.seccion)
    })
    return Array.from(sectionSet).sort()
  }, [resources])

  // Obtener tipos únicos
  const types = useMemo(() => {
    const typeSet = new Set<string>()
    resources.forEach((r) => {
      if (r.tipo) typeSet.add(r.tipo)
    })
    return Array.from(typeSet).sort()
  }, [resources])

  // Filtrar recursos
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchTerm === "" ||
        resource.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSection = filterSection === "all" || resource.seccion === filterSection

      const matchesType = filterType === "all" || resource.tipo === filterType

      return matchesSearch && matchesSection && matchesType
    })
  }, [resources, searchTerm, filterSection, filterType])

  // Mapear secciones a sus IDs estáticos en la página
  const getSectionStaticId = (resource: ResourceV3): string | null => {
    if (!isSection(resource)) return null
    
    const seccion = resource.seccion.toLowerCase()
    
    if (seccion.includes("introducción") || seccion.includes("caso de uso")) return "use-case"
    if (seccion.includes("interpretación")) return "interpretation"
    if (seccion.includes("tutorial administrativo")) return "tutorial-admin"
    if (seccion.includes("agendar")) return "agendar"
    if (seccion.includes("manuales")) return "platform"
    if (seccion.includes("bases conceptuales")) return "conceptual-bases"
    if (seccion.includes("valoración")) return "assessment-support"
    if (seccion.includes("investigaciones")) return "research"
    if (seccion.includes("paso 1")) return "paso-1"
    if (seccion.includes("paso 2")) return "paso-2"
    if (seccion.includes("paso 3")) return "paso-3"
    if (seccion.includes("paso 4")) return "paso-4"
    if (seccion.includes("paso 5")) return "paso-5"
    
    return null
  }

  const copyToClipboard = async (resourceId: string, resource: ResourceV3) => {
    let url: string
    
    if (isSection(resource)) {
      const staticId = getSectionStaticId(resource)
      if (staticId) {
        url = `${baseUrl}/clientes?section=${staticId}`
      } else {
        // Fallback a usar el ID del recurso
        url = `${baseUrl}/clientes?resource=${resourceId}`
      }
    } else {
      url = `${baseUrl}/clientes?resource=${resourceId}`
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(resourceId)
      toast.success("Link copiado al portapapeles", {
        description: url,
        duration: 3000,
      })
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error("Error al copiar el link")
      console.error("Error copying to clipboard:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por sección */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11383] focus:border-transparent"
            >
              <option value="all">Todas las secciones</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por tipo */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11383] focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredResources.length} de {resources.length} recursos
        </div>
      </Card>

      {/* Tabla de recursos */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Sección</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Título</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Link</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron recursos con los filtros aplicados
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => {
                  const isResourceSection = isSection(resource)
                  const isCopied = copiedId === resource.id
                  
                  // Calcular la URL correcta para mostrar
                  let displayUrl: string
                  if (isResourceSection) {
                    const staticId = getSectionStaticId(resource)
                    displayUrl = staticId 
                      ? `${baseUrl}/clientes?section=${staticId}`
                      : `${baseUrl}/clientes?resource=${resource.id}`
                  } else {
                    displayUrl = `${baseUrl}/clientes?resource=${resource.id}`
                  }

                  return (
                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="inline-flex items-center gap-2">
                          {resource.seccion}
                          {isResourceSection && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[#E11383] text-white rounded">
                              Sección
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="font-medium">{resource.titulo}</div>
                        {resource.descripcion && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.descripcion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            resource.tipo === "Video"
                              ? "bg-blue-100 text-blue-800"
                              : resource.tipo === "PDF"
                                ? "bg-red-100 text-red-800"
                                : resource.tipo === "Sección"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {resource.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">{displayUrl}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant={isCopied ? "default" : "outline"}
                          onClick={() => copyToClipboard(resource.id, resource)}
                          className={`${
                            isCopied
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "hover:bg-[#E11383] hover:text-white"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
