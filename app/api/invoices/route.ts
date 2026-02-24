import { NextRequest, NextResponse } from "next/server"
import { isAuthorizedRequest } from "@/lib/security/embed-validator"
import type { CreateInvoiceRequest, CreateInvoiceResponse } from "@/lib/types/company"

export const dynamic = "force-dynamic"
export const revalidate = 0

const API_BASE_URL = "https://staging.multiplicityassess.com/api/admin"
const REQUEST_TIMEOUT = 15000 // 15 segundos

/**
 * POST /api/invoices
 * 
 * Crea una factura en el API de staging
 * Requiere: company_id en el body y validación de referer/origin
 */
export async function POST(request: NextRequest) {
  try {
    // Validación de seguridad: verificar origen de la petición
    if (!isAuthorizedRequest(request.headers)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Forbidden", 
          message: "Acceso no autorizado. Esta API solo puede ser accedida desde dominios autorizados."
        } as CreateInvoiceResponse,
        { status: 403 }
      )
    }

    // Parsear el body
    let body: CreateInvoiceRequest & { company_id: number }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "Body de la petición inválido"
        } as CreateInvoiceResponse,
        { status: 400 }
      )
    }

    // Validar company_id
    const { company_id, invoice_details, comment } = body
    if (!company_id || isNaN(company_id) || company_id <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "company_id es requerido y debe ser un número válido"
        } as CreateInvoiceResponse,
        { status: 400 }
      )
    }

    // Validar invoice_details
    if (!invoice_details || !Array.isArray(invoice_details) || invoice_details.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "invoice_details es requerido y debe contener al menos un item"
        } as CreateInvoiceResponse,
        { status: 400 }
      )
    }

    // Validar cada item de invoice_details
    for (const detail of invoice_details) {
      if (!detail.survey_type_id || ![1, 2, 3, 4].includes(detail.survey_type_id)) {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request", 
            message: "survey_type_id debe ser 1, 2, 3 o 4"
          } as CreateInvoiceResponse,
          { status: 400 }
        )
      }

      if (!detail.amount || detail.amount <= 0) {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request", 
            message: "amount debe ser un número positivo"
          } as CreateInvoiceResponse,
          { status: 400 }
        )
      }

      // Validar is_plus para Competencias (survey_type_id: 1)
      if (detail.survey_type_id === 1 && typeof detail.is_plus !== 'boolean') {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request", 
            message: "is_plus es requerido para survey_type_id: 1 (Competencias)"
          } as CreateInvoiceResponse,
          { status: 400 }
        )
      }
    }

    // Verificar que el API_KEY esté configurado
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      console.error("API_KEY no configurado en variables de entorno")
      return NextResponse.json(
        { 
          success: false,
          error: "Server Error", 
          message: "Error de configuración del servidor"
        } as CreateInvoiceResponse,
        { status: 500 }
      )
    }

    // Preparar el payload para el API externo
    const payload: CreateInvoiceRequest = {
      comment: comment || `Cotización directa desde embed - ${new Date().toLocaleDateString('es-DO')}`,
      invoice_details: invoice_details
    }

    // Hacer la petición al API externo con timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}/companies/${company_id}/invoices`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Manejar diferentes códigos de respuesta
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false,
            error: "Not Found", 
            message: "Empresa no encontrada"
          } as CreateInvoiceResponse,
          { status: 404 }
        )
      }

      if (response.status === 401) {
        console.error("API_KEY inválido o expirado")
        return NextResponse.json(
          { 
            success: false,
            error: "Unauthorized", 
            message: "Error de autenticación con el servidor"
          } as CreateInvoiceResponse,
          { status: 401 }
        )
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Error del API externo: ${response.status}`, errorData)
        return NextResponse.json(
          { 
            success: false,
            error: "External API Error", 
            message: errorData.message || "Error al crear la factura"
          } as CreateInvoiceResponse,
          { status: response.status }
        )
      }

      // Parsear y retornar la respuesta exitosa
      const data = await response.json()
      
      return NextResponse.json(
        {
          success: true,
          invoice_id: data.id || data.invoice_id,
          message: "Factura creada exitosamente"
        } as CreateInvoiceResponse,
        { 
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          }
        }
      )

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === "AbortError") {
        console.error("Timeout al conectar con el API externo")
        return NextResponse.json(
          { 
            success: false,
            error: "Timeout", 
            message: "Tiempo de espera agotado al conectar con el servidor"
          } as CreateInvoiceResponse,
          { status: 504 }
        )
      }

      throw fetchError
    }

  } catch (error) {
    console.error("Error en API route /api/invoices:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error", 
        message: "Error interno del servidor"
      } as CreateInvoiceResponse,
      { status: 500 }
    )
  }
}
