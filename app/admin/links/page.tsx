"use client"

import { useState, useEffect } from "react"
import { ResourceLinkManager } from "@/components/resource-link-manager"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { ResourceV3 } from "@/lib/resources-cms-v3"
import { Toaster } from "sonner"

export default function LinksPage() {
  const [resources, setResources] = useState<ResourceV3[] | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        setError("Error al cargar los recursos. Por favor, intenta de nuevo.")
        setResources([])
      }
    }
    load()
  }, [])

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
    <main className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/clientes"
              className="inline-flex items-center gap-2 text-white hover:text-[#E11383] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Recursos</span>
            </Link>
            <Image
              src="/images/Multiplicity Conecta logo.png"
              alt="Multiplicity Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-3">
              <span className="text-[#E11383]">Gestión de </span>
              <span className="text-white">Enlaces</span>
            </h1>
            <p className="text-lg text-white/90">
              Copia enlaces directos a recursos específicos para compartir con tus usuarios
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        ) : (
          <ResourceLinkManager resources={resources} />
        )}
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 max-w-[1400px] py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-navy mb-3">ℹ️ Cómo usar los enlaces</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#E11383] font-bold">•</span>
              <span>
                <strong>Enlaces a recursos:</strong> Abren el recurso específico (video o PDF) y hacen scroll
                automático a su ubicación
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E11383] font-bold">•</span>
              <span>
                <strong>Enlaces a secciones:</strong> Hacen scroll a la sección completa para ver todos sus recursos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E11383] font-bold">•</span>
              <span>
                <strong>Videos:</strong> Se reproducen automáticamente al abrir el enlace
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E11383] font-bold">•</span>
              <span>
                <strong>PDFs y archivos:</strong> Se abren automáticamente en una nueva pestaña
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
