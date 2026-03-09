import { NextRequest, NextResponse } from "next/server"
import type { 
  NewUserWebhookRequest, 
  NewUserWebhookResponse,
  ClientAPIAccountData
} from "@/lib/types/webhook"

export const dynamic = "force-dynamic"
export const revalidate = 0

const N8N_WEBHOOK_URL = "https://n8n.srv1464241.hstgr.cloud/webhook/3a375aba-16cf-4aba-a252-2332c633fa32"
const REQUEST_TIMEOUT = 15000

const TEMPORARY_PASSWORD_LENGTH = 12

function generateTemporaryPassword(length: number = TEMPORARY_PASSWORD_LENGTH): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charsLength = chars.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength)
    result += chars[randomIndex]
  }

  return result
}

/**
 * POST /api/accounts/new
 * 
 * Webhook para crear usuarios nuevos en el sistema del cliente
 * Requiere: Bearer token en Authorization header
 * Body: { email, name, username?, company_id? }
 * 
 * Flujo:
 * 1. Valida el webhook token
 * 2. Llama al API del cliente para crear el usuario
 * 3. Recibe el temporary_password
 * 4. Envía email de bienvenida (TODO)
 * 5. Retorna los datos del usuario creado
 */
export async function POST(request: NextRequest) {
  try {
    // Validación de autenticación: verificar Bearer token
    const authHeader = request.headers.get("authorization")
    const webhookToken = process.env.WEBHOOK_TOKEN

    if (!webhookToken) {
      console.error("WEBHOOK_TOKEN no configurado en variables de entorno")
      return NextResponse.json(
        { 
          success: false,
          error: "Server Error", 
          message: "Error de configuración del servidor"
        } as NewUserWebhookResponse,
        { status: 500 }
      )
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized", 
          message: "Token de autenticación requerido. Use: Authorization: Bearer <token>"
        } as NewUserWebhookResponse,
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remover "Bearer "
    
    if (token !== webhookToken) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized", 
          message: "Token de autenticación inválido"
        } as NewUserWebhookResponse,
        { status: 401 }
      )
    }

    // Parsear el body
    let body: NewUserWebhookRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "Body de la petición inválido. Debe ser JSON válido."
        } as NewUserWebhookResponse,
        { status: 400 }
      )
    }

    // Validar campos requeridos
    const { email, name, username, company_id } = body

    // Validar email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "El campo 'email' es requerido y debe ser un string no vacío"
        } as NewUserWebhookResponse,
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "El campo 'email' debe tener un formato válido"
        } as NewUserWebhookResponse,
        { status: 400 }
      )
    }

    // Validar name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "El campo 'name' es requerido y debe ser un string no vacío"
        } as NewUserWebhookResponse,
        { status: 400 }
      )
    }

    // Validar username (opcional, pero si viene debe ser string no vacío)
    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim() === '') {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request", 
            message: "El campo 'username', si se envía, debe ser un string no vacío"
          } as NewUserWebhookResponse,
          { status: 400 }
        )
      }
    }

    // Validar company_id (opcional, pero si viene debe ser número positivo)
    if (company_id !== undefined) {
      if (typeof company_id !== 'number' || isNaN(company_id) || company_id <= 0) {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request", 
            message: "El campo 'company_id', si se envía, debe ser un número positivo"
          } as NewUserWebhookResponse,
          { status: 400 }
        )
      }
    }

    // Log de usuario nuevo recibido
    console.log("Creando nuevo usuario:", {
      email,
      name,
      username,
      company_id,
      timestamp: new Date().toISOString()
    })

    // Generar temporary_password
    const temporaryPassword = generateTemporaryPassword()

    // Preparar datos de la cuenta para enviar y devolver
    const account: ClientAPIAccountData = {
      email,
      name,
      ...(username ? { username } : {}),
      ...(company_id !== undefined ? { company_id } : {}),
    }

    // Preparar el payload para el webhook de n8n
    const payload = {
      ...account,
      temporary_password: temporaryPassword,
    }

    // Llamar al webhook de n8n
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(
        N8N_WEBHOOK_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Error al llamar al webhook de n8n: ${response.status}`, errorData)
        return NextResponse.json(
          { 
            success: false,
            error: "External Workflow Error", 
            message: errorData.message || errorData.error || "Error al ejecutar el flujo externo de creación de usuario"
          } as NewUserWebhookResponse,
          { status: response.status }
        )
      }

      console.log("Webhook de n8n ejecutado exitosamente para usuario:", {
        email: account.email,
        timestamp: new Date().toISOString()
      })

      // Respuesta exitosa con el formato solicitado
      return NextResponse.json(
        {
          success: true,
          message: "success",
          data: {
            account,
            temporary_password: temporaryPassword,
          }
        } as NewUserWebhookResponse,
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
        console.error("Timeout al conectar con el API del cliente")
        return NextResponse.json(
          { 
            success: false,
            error: "Timeout", 
            message: "Tiempo de espera agotado al conectar con el servidor del cliente"
          } as NewUserWebhookResponse,
          { status: 504 }
        )
      }

      throw fetchError
    }

  } catch (error) {
    console.error("Error en API route /api/accounts/new:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error", 
        message: "Error interno del servidor"
      } as NewUserWebhookResponse,
      { status: 500 }
    )
  }
}
