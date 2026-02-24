/**
 * Tipos TypeScript para Company API y Invoice API
 */

// ============= COMPANY API TYPES =============

export interface TerritoryData {
  id: number
  name: string
}

export interface AccountData {
  id: number
  username: string
  email: string
  name: string
  created_at: string
}

export interface CompanyData {
  id: number
  name: string
  slug: string
  rnc: string
  phone: string
  address: string
  invoice_email: string
  prepaid: boolean
  client_since: string | null
  territory: TerritoryData
  created_at: string
  updated_at: string
  accounts: AccountData[]
}

export interface CompanyResponse {
  data: CompanyData
}

export interface CompanyError {
  error: string
  message?: string
  status: number
}

// ============= INVOICE API TYPES =============

/**
 * Tipos de encuesta según el API
 * 
 * ID | Nombre        | is_plus | Balance Afectado
 * ---|---------------|---------|------------------
 * 1  | Competencias  | true    | competences_plus_balance
 * 1  | Competencias  | false   | competences_basic_balance
 * 2  | Habilidades   | n/a     | skills_balance
 * 3  | Motivacional  | n/a     | motivational_balance
 * 4  | Operacional   | n/a     | operational_balance
 */
export type SurveyTypeId = 1 | 2 | 3 | 4

export interface InvoiceDetail {
  survey_type_id: SurveyTypeId
  amount: number
  is_plus?: boolean // Requerido solo para survey_type_id: 1 (Competencias)
}

export interface CreateInvoiceRequest {
  comment?: string
  invoice_details: InvoiceDetail[]
}

export interface CreateInvoiceResponse {
  success: boolean
  invoice_id?: number
  message?: string
  error?: string
}

// ============= MAPEO DE PRUEBAS =============

/**
 * Mapeo de las pruebas del calculador a survey_type_id del API
 */
export const TEST_TO_SURVEY_TYPE_MAP = {
  competenciaPlus: { survey_type_id: 1 as SurveyTypeId, is_plus: true },
  pensamientoAnalitico: { survey_type_id: 2 as SurveyTypeId, is_plus: false },
  motivadores: { survey_type_id: 3 as SurveyTypeId },
  competenciasBasicas: { survey_type_id: 1 as SurveyTypeId, is_plus: false },
  razonamientoGeneral: { survey_type_id: 4 as SurveyTypeId },
} as const

export type TestKey = keyof typeof TEST_TO_SURVEY_TYPE_MAP
