/**
 * Tipos TypeScript para Webhook API
 */

export interface NewUserWebhookRequest {
  email: string
  name: string
  username: string
  company_id: number
}

export interface ClientAPIAccountData {
  id: number
  username: string
  email: string
  name: string
  companies_count: number
  created_at: string
}

export interface ClientAPICreateAccountResponse {
  message: string
  data: {
    account: ClientAPIAccountData
    temporary_password: string
  }
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
