// Airtable API Integration for Gestión de Prospectos
// Creates records for Empresas, Contactos Administrativos, and Contactos de Plataforma

const AIRTABLE_TOKEN = ""
const AIRTABLE_BASE_ID = ""

interface AirtableRecord {
  id: string
  createdTime: string
  fields: Record<string, any>
}

interface AirtableResponse {
  records: AirtableRecord[]
}

interface CompanyData {
  razonSocial: string
  rnc: string
  direccion: string
  tipoNCF: string
  medioEntrega: string
}

interface ContactData {
  nombre: string
  posicion: string
  email: string
  telefono: string
}

interface AirtableInput {
  company: CompanyData
  adminContacts: ContactData[]
  platformContacts: ContactData[]
}

async function airtableRequest(tableName: string, payload: any): Promise<AirtableResponse> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Airtable ${tableName} ${response.status}: ${errorText}`)
  }

  return response.json()
}

async function createCompanyRecord(company: CompanyData): Promise<string> {
  console.log("[v0] Creating company record in Airtable:", company.razonSocial)

  const payload = {
    records: [
      {
        fields: {
          "Razón Social": company.razonSocial,
          "RNC / NIF": company.rnc,
          Dirección: company.direccion,
          "Tipo de NCF": company.tipoNCF,
          "Medio de Entrega de Factura": company.medioEntrega,
        },
      },
    ],
  }

  const response = await airtableRequest("tblICXUZeX38Bdswz", payload)
  const companyRecordId = response.records[0].id

  console.log("[v0] Company record created with ID:", companyRecordId)
  return companyRecordId
}

async function createAdminContacts(contacts: ContactData[], companyRecordId: string): Promise<void> {
  if (contacts.length === 0) return

  console.log("[v0] Creating admin contacts in Airtable:", contacts.length)

  const records = contacts.map((contact) => ({
    fields: {
      Nombre: contact.nombre,
      Posición: contact.posicion,
      Email: contact.email,
      Telefono: contact.telefono,
      Empresa: [companyRecordId],
    },
  }))

  const payload = { records }
  await airtableRequest("tbl70FEj6Eu5jTdBk", payload)

  console.log("[v0] Admin contacts created successfully")
}

async function createPlatformContacts(contacts: ContactData[], companyRecordId: string): Promise<void> {
  if (contacts.length === 0) return

  console.log("[v0] Creating platform contacts in Airtable:", contacts.length)

  const records = contacts.map((contact) => ({
    fields: {
      Nombre: contact.nombre,
      Posición: contact.posicion,
      Email: contact.email,
      Telefono: contact.telefono,
      Empresa: [companyRecordId],
    },
  }))

  const payload = { records }
  await airtableRequest("tblUofIul0mvj1brR", payload)

  console.log("[v0] Platform contacts created successfully")
}

export async function createAirtableRecords(input: AirtableInput): Promise<void> {
  console.log("[v0] Starting Airtable records creation")

  try {
    // Step 1: Create company record
    const companyRecordId = await createCompanyRecord(input.company)

    // Step 2: Create admin contacts (linked to company)
    await createAdminContacts(input.adminContacts, companyRecordId)

    // Step 3: Create platform contacts (linked to company)
    await createPlatformContacts(input.platformContacts, companyRecordId)

    console.log("[v0] All Airtable records created successfully")
  } catch (error) {
    console.error("[v0] Error creating Airtable records:", error)
    throw error
  }
}
