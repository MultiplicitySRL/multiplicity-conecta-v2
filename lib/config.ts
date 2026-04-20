// ── Negocio / fiscal ─────────────────────────────────────────────────────────

export const ITBIS_RATE = 0.18

export const EXCHANGE_RATE_USD_DOP = 60.6933
export const EXCHANGE_RATE_EUR_REF =  70.8278

export const BASE_PRICES = {
  competenciaPlus: 37.5,
  pensamientoAnalitico: 15.0,
  motivadores: 22.5,
  competenciasBasicas: 8.0,
  razonamientoGeneral: 1.0,
} as const

export const PRICING_TIERS = {
  razonamientoGeneral: [
    { limit: 1500, price: 1.0 },
    { limit: 99999, price: 0.5 },
  ],
  competenciasBasicas: [
    { limit: 500, price: 8.0 },
    { limit: 1000, price: 7.2 },
    { limit: 1500, price: 6.85 },
    { limit: 2000, price: 6.5 },
    { limit: 4000, price: 6.0 },
    { limit: 6000, price: 5.5 },
    { limit: 99999, price: 5.25 },
  ],
  motivadores: [
    { limit: 10, price: 22.5 },
    { limit: 20, price: 20.25 },
    { limit: 30, price: 19.13 },
    { limit: 50, price: 18.0 },
    { limit: 200, price: 16.88 },
    { limit: 500, price: 15.75 },
    { limit: 1000, price: 14.63 },
    { limit: 1500, price: 13.5 },
    { limit: 99999, price: 12.38 },
  ],
  pensamientoAnalitico: [
    { limit: 10, price: 15.0 },
    { limit: 20, price: 13.5 },
    { limit: 30, price: 12.75 },
    { limit: 50, price: 12.0 },
    { limit: 200, price: 11.25 },
    { limit: 500, price: 10.5 },
    { limit: 1000, price: 9.75 },
    { limit: 1500, price: 9.0 },
    { limit: 99999, price: 8.25 },
  ],
  competenciaPlus: [
    { limit: 10, price: 37.5 },
    { limit: 20, price: 33.75 },
    { limit: 30, price: 31.875 },
    { limit: 50, price: 30.0 },
    { limit: 200, price: 28.125 },
    { limit: 500, price: 26.25 },
    { limit: 1000, price: 24.375 },
    { limit: 1500, price: 22.5 },
    { limit: 99999, price: 20.625 },
  ],
} as const

// ── Alegra ────────────────────────────────────────────────────────────────────

export const ALEGRA_BASE_URL = "https://api.alegra.com/api/v1"

export const TEST_NAMES = {
  competenciaPlus: "Test Competencias Plus",
  pensamientoAnalitico: "Test Pens. Analítico y Sistémico",
  motivadores: "Test Motivadores",
  competenciasBasicas: "Test Competencias Básicas",
  razonamientoGeneral: "Test Razonamiento General",
} as const

export const ALEGRA_TEST_IDS: Record<string, number> = {
  "Test Competencias Plus": 140,
  "Test Pens. Analítico y Sistémico": 141,
  "Test Motivadores": 142,
  "Test Competencias Básicas": 143,
  "Test Razonamiento General": 144,
}

export const ALEGRA_ITBIS_TAX_ID = "1"
export const ALEGRA_DEFAULT_INVOICE_STATUS = "draft"
export const ALEGRA_DEFAULT_EMAIL_MESSAGE = "¡Hola! Te compartimos tu factura. Gracias por su compra."

export const NCF_TIPO_ID: Record<string, string> = {
  "Crédito Fiscal": "22",
  "Consumo": "17",
  "Régimen Especial de Tributación": "23",
  "Gubernamental": "24",
}

export const NCF_ALLOWED_LOCAL = ["Crédito Fiscal", "Gubernamental", "Régimen Especial de Tributación"] as const

// ── Empresa (datos fiscales Multiplicity) ─────────────────────────────────────

export const COMPANY = {
  name: "Multiplicity",
  rnc: "124-03034-1",
  address1: "Edif. La Isla Piso 1",
  address2: "Avenida Tiradentes #30",
  city: "Santo Domingo, Rep. Dominicana",
  phone: "809-565-0747",
  email: "info@multiplicity.com.do",
} as const

// ── Tipos derivados ───────────────────────────────────────────────────────────

export type TestKey = keyof typeof BASE_PRICES
export type TipoNCF = keyof typeof NCF_TIPO_ID
