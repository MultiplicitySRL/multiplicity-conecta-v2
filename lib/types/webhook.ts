/**
 * Tipos TypeScript para Webhook API
 */

export interface NewUserWebhookRequest {
  email: string
  name: string
  /**
   * Puede ser opcional en el webhook
   */
  username?: string
  company_id: number
}

/**
 * Datos mínimos de la cuenta que devolvemos
 * (ya no vienen de un API externo)
 */
export interface ClientAPIAccountData {
  email: string
  name: string
  username?: string
  company_id: number
}

export interface NewUserWebhookResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    account: ClientAPIAccountData
    temporary_password: string
  }
}
