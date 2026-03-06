"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { AccessRequestForm } from "@/components/access-request-form"
import { UserContext, type UserInfo } from "@/lib/user-context"
import { Loader2 } from "lucide-react"

const VERIFY_TOKEN_WEBHOOK =
  "https://n8n.srv1464241.hstgr.cloud/webhook/15e34de7-47e2-4fb7-a74d-e79de1c95fa8"

const STORAGE_KEY = "multiplicity_access"
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000 // 2 días

interface StoredAccess {
  token: string
  grantedAt: number
  user: UserInfo
}

function getStoredAccess(): StoredAccess | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: StoredAccess = JSON.parse(raw)
    if (Date.now() - parsed.grantedAt > TOKEN_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

interface AirtableRecord {
  id: string
  createdTime: string
  "Nombre Completo": string
  Cargo: string
  Email: string
  Empresa: string[]
}

function parseUserFromResponse(data: AirtableRecord[]): UserInfo {
  const record = data[0]
  return {
    id: record.id ?? "",
    nombre: record["Nombre Completo"] ?? "",
    email: record["Email"] ?? "",
    cargo: record["Cargo"] ?? "",
    empresa: Array.isArray(record["Empresa"]) ? record["Empresa"][0] ?? "" : record["Empresa"] ?? "",
  }
}

function saveAccess(token: string, user: UserInfo) {
  const data: StoredAccess = { token, grantedAt: Date.now(), user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

type AccessState = "loading" | "granted" | "denied"

interface AccessGateProps {
  children: React.ReactNode
}

export function AccessGate({ children }: AccessGateProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accessState, setAccessState] = useState<AccessState>("loading")
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const urlToken = searchParams.get("token")

    const verify = async () => {
      if (urlToken) {
        try {
          const res = await fetch(VERIFY_TOKEN_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: urlToken }),
          })

          if (res.ok) {
            const raw = await res.json()
            // n8n puede devolver un objeto directo o un array
            const records: AirtableRecord[] = Array.isArray(raw) ? raw : [raw]
            if (records.length === 0 || !records[0]?.id) {
              setAccessState("denied")
              return
            }
            const userInfo = parseUserFromResponse(records)
            saveAccess(urlToken, userInfo)
            setUser(userInfo)
            router.replace("/")
            setAccessState("granted")
          } else {
            setAccessState("denied")
          }
        } catch {
          setAccessState("denied")
        }
        return
      }

      // Sin token en URL: revisar localStorage
      const stored = getStoredAccess()
      if (stored) {
        // Mostrar acceso inmediatamente con datos en caché
        setUser(stored.user)
        setAccessState("granted")

        // Refrescar datos en segundo plano sin bloquear la UI
        fetch(VERIFY_TOKEN_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: stored.token }),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((raw) => {
            if (!raw) return
            const records: AirtableRecord[] = Array.isArray(raw) ? raw : [raw]
            if (records.length === 0 || !records[0]?.id) return
            const freshUser = parseUserFromResponse(records)
            saveAccess(stored.token, freshUser)
            setUser(freshUser)
          })
          .catch(() => {})
      } else {
        setAccessState("denied")
      }
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (accessState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#E11383]" />
          <p className="text-sm text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (accessState === "granted") {
    return (
      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
    )
  }

  // Estado "denied": contenido borroso + overlay con formulario
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Contenido de fondo borroso */}
      <div
        className="pointer-events-none select-none"
        style={{ filter: "blur(8px)", userSelect: "none" }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay de acceso */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-7 pb-4 text-center">
            <div className="flex justify-center mb-5">
              <Image
                src="/images/multiplicity-logo.png"
                alt="Multiplicity Logo"
                width={200}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ¡Bienvenido a Multiplicity!
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Para continuar, déjanos tus datos y te enviaremos un{" "}
              <span className="text-[#E11383] font-semibold">enlace personalizado</span>{" "}
              a tu correo en minutos.
            </p>
          </div>

          <div className="h-px bg-gray-100 mx-6" />

          {/* Formulario */}
          <div className="px-6 py-5">
            <AccessRequestForm compact />
          </div>
        </div>
      </div>
    </div>
  )
}
