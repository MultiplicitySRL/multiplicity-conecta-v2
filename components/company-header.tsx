"use client"

import { useEffect, useState } from "react"
import { Building2, MapPin, FileText, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import type { CompanyResponse, CompanyError } from "@/lib/types/company"

interface CompanyHeaderProps {
  companyId: string | null
  accountId: string | null
}

type LoadingState = "loading" | "success" | "error" | "missing-params"

/**
 * Header que muestra información de la empresa
 * Hace fetch al API route /api/company/[id]
 */
export function CompanyHeader({ companyId, accountId }: CompanyHeaderProps) {
  const [state, setState] = useState<LoadingState>("loading")
  const [company, setCompany] = useState<CompanyResponse["data"] | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Verificar que tengamos company_id
    if (!companyId) {
      setState("missing-params")
      setError("Parámetro company_id requerido")
      return
    }

    // Hacer fetch a nuestro API route
    const fetchCompany = async () => {
      try {
        setState("loading")
        
        const response = await fetch(`/api/company/${companyId}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          const errorData: CompanyError = await response.json()
          setState("error")
          setError(errorData.message || "Error al cargar información de la empresa")
          return
        }

        const data: CompanyResponse = await response.json()
        setCompany(data.data)
        setState("success")
      } catch (err) {
        console.error("Error fetching company:", err)
        setState("error")
        setError("Error de conexión. Por favor, intenta nuevamente.")
      }
    }

    fetchCompany()
  }, [companyId])

  // Estado: Loading
  if (state === "loading") {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Cargando información de la empresa...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Estado: Missing Parameters
  if (state === "missing-params") {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Parámetros Faltantes
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Estado: Error
  if (state === "error") {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Error al Cargar Información
            </p>
            <p className="text-xs text-red-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Estado: Success
  if (state === "success" && company) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 justify-center flex-wrap">
          {/* Icono */}
          <div className="flex-shrink-0">
            <div className="bg-green-500 text-white rounded-full p-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          {/* Nombre de la empresa */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-700 flex-shrink-0" />
            <h3 className="text-base md:text-lg font-bold text-green-900">
              {company.name}
            </h3>
          </div>

          {/* Separador vertical */}
          {company.rnc && (
            <>
              <div className="hidden sm:block h-6 w-px bg-green-300"></div>
              
              {/* RNC */}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">
                  <span className="font-medium">RNC:</span> {company.rnc}
                </span>
              </div>
            </>
          )}

          {/* Separador vertical */}
          {company.territory && (
            <>
              <div className="hidden sm:block h-6 w-px bg-green-300"></div>
              
              {/* Territorio */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">
                  <span className="font-medium">Territorio:</span> {company.territory.name}
                </span>
              </div>
            </>
          )}

          {/* Account ID (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && accountId && (
            <>
              <div className="hidden sm:block h-6 w-px bg-green-300"></div>
              <span className="text-xs text-green-700 font-mono">
                Account: {accountId}
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}
