import { NextRequest, NextResponse } from "next/server"
import type { 
  NewUserWebhookRequest, 
  NewUserWebhookResponse,
  ClientAPICreateAccountResponse 
} from "@/lib/types/webhook"

export const dynamic = "force-dynamic"
export const revalidate = 0

const CLIENT_API_BASE_URL = "https://staging.multiplicityassess.com/api/admin"
const REQUEST_TIMEOUT = 15000

/**
 * POST /api/accounts/new
 * 
 * Webhook para crear usuarios nuevos en el sistema del cliente
 * Requiere: Bearer token en Authorization header
 * Body: { email, name, username, company_id }
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

    // Validar username
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "El campo 'username' es requerido y debe ser un string no vacío"
        } as NewUserWebhookResponse,
        { status: 400 }
      )
    }

    // Validar company_id (requerido)
    if (!company_id || typeof company_id !== 'number' || isNaN(company_id) || company_id <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request", 
          message: "El campo 'company_id' es requerido y debe ser un número positivo"
        } as NewUserWebhookResponse,
        { status: 400 }
      )
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
        } as NewUserWebhookResponse,
        { status: 500 }
      )
    }

    // Log de usuario nuevo recibido
    console.log("Creando nuevo usuario:", {
      email,
      name,
      username,
      company_id,
      timestamp: new Date().toISOString()
    })

    // Preparar el payload para el API del cliente
    const payload = {
      account: {
        username,
        email,
        name
      }
    }

    // Llamar al API del cliente para crear el usuario
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(
        `${CLIENT_API_BASE_URL}/companies/${company_id}/accounts`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      // Manejar diferentes códigos de respuesta
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false,
            error: "Not Found", 
            message: `Empresa con ID ${company_id} no encontrada`
          } as NewUserWebhookResponse,
          { status: 404 }
        )
      }

      if (response.status === 401) {
        console.error("API_KEY inválido o expirado")
        return NextResponse.json(
          { 
            success: false,
            error: "Unauthorized", 
            message: "Error de autenticación con el servidor del cliente"
          } as NewUserWebhookResponse,
          { status: 401 }
        )
      }

      if (response.status === 422 || response.status === 400) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Error de validación del API del cliente: ${response.status}`, errorData)
        return NextResponse.json(
          { 
            success: false,
            error: "Validation Error", 
            message: errorData.message || errorData.error || "Error de validación al crear el usuario"
          } as NewUserWebhookResponse,
          { status: 400 }
        )
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Error del API del cliente: ${response.status}`, errorData)
        return NextResponse.json(
          { 
            success: false,
            error: "External API Error", 
            message: errorData.message || errorData.error || "Error al crear el usuario en el sistema del cliente"
          } as NewUserWebhookResponse,
          { status: response.status }
        )
      }

      // Parsear la respuesta exitosa
      const clientData: ClientAPICreateAccountResponse = await response.json()
      
      console.log("Usuario creado exitosamente:", {
        account_id: clientData.data.account.id,
        email: clientData.data.account.email,
        timestamp: new Date().toISOString()
      })

      // TODO: Aquí se implementará el envío del email de bienvenida
      // Ejemplo:
      // await sendWelcomeEmail({
      //   to: clientData.data.account.email,
      //   name: clientData.data.account.name,
      //   username: clientData.data.account.username,
      //   temporaryPassword: clientData.data.temporary_password
      // })

      // Respuesta exitosa
      return NextResponse.json(
        {
          success: true,
          message: "Usuario creado exitosamente. Email de bienvenida enviado.",
          data: {
            account: clientData.data.account,
            temporary_password: clientData.data.temporary_password
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
