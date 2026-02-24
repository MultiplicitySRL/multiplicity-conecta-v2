import { NextRequest, NextResponse } from "next/server"
import { isAuthorizedRequest } from "@/lib/security/embed-validator"
import type { CompanyResponse, CompanyError } from "@/lib/types/company"

export const dynamic = "force-dynamic"
export const revalidate = 0

const API_BASE_URL = "https://staging.multiplicityassess.com/api/admin"
const REQUEST_TIMEOUT = 10000 // 10 segundos

/**
 * GET /api/company/[id]
 * 
 * Obtiene información de una empresa desde el API de staging
 * Requiere validación de referer/origin para seguridad
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validación de seguridad: verificar origen de la petición
    if (!isAuthorizedRequest(request.headers)) {
      return NextResponse.json(
        { 
          error: "Forbidden", 
          message: "Acceso no autorizado. Esta API solo puede ser accedida desde dominios autorizados.",
          status: 403
        } as CompanyError,
        { status: 403 }
      )
    }

    // Validar que el ID sea un número válido
    const companyId = parseInt(params.id, 10)
    if (isNaN(companyId) || companyId <= 0) {
      return NextResponse.json(
        { 
          error: "Bad Request", 
          message: "ID de empresa inválido",
          status: 400
        } as CompanyError,
        { status: 400 }
      )
    }

    // Verificar que el API_KEY esté configurado
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      console.error("API_KEY no configurado en variables de entorno")
      return NextResponse.json(
        { 
          error: "Server Error", 
          message: "Error de configuración del servidor",
          status: 500
        } as CompanyError,
        { status: 500 }
      )
    }

    // Hacer la petición al API externo con timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      })

      clearTimeout(timeoutId)

      // Manejar diferentes códigos de respuesta
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: "Not Found", 
            message: "Empresa no encontrada",
            status: 404
          } as CompanyError,
          { status: 404 }
        )
      }

      if (response.status === 401) {
        console.error("API_KEY inválido o expirado")
        return NextResponse.json(
          { 
            error: "Unauthorized", 
            message: "Error de autenticación con el servidor",
            status: 401
          } as CompanyError,
          { status: 401 }
        )
      }

      if (!response.ok) {
        console.error(`Error del API externo: ${response.status}`)
        return NextResponse.json(
          { 
            error: "External API Error", 
            message: "Error al obtener información de la empresa",
            status: response.status
          } as CompanyError,
          { status: response.status }
        )
      }

      // Parsear y retornar la respuesta exitosa
      const data: CompanyResponse = await response.json()
      
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
        },
      })

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === "AbortError") {
        console.error("Timeout al conectar con el API externo")
        return NextResponse.json(
          { 
            error: "Timeout", 
            message: "Tiempo de espera agotado al conectar con el servidor",
            status: 504
          } as CompanyError,
          { status: 504 }
        )
      }

      throw fetchError
    }

  } catch (error) {
    console.error("Error en API route /api/company/[id]:", error)
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: "Error interno del servidor",
        status: 500
      } as CompanyError,
      { status: 500 }
    )
  }
}
