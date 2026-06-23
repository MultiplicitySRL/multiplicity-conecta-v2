"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { UserContext, type UserInfo } from "@/lib/user-context"
import { verifyAccessToken, type LeadUserInfo } from "@/lib/services/leads"
import { trackProposalOpened } from "@/lib/services/tracking"
import { getStoredAccess, saveAccess } from "@/lib/access"

function parseUserFromResponse(data: LeadUserInfo): UserInfo {
  return {
    id: data.id ?? "",
    nombre: data.nombreCompleto ?? "",
    email: data.email ?? "",
    cargo: data.cargo ?? "",
    empresa: data.empresa ?? "",
  }
}

interface AccessGateProps {
  children: React.ReactNode
}

/**
 * Proveedor de identidad NO bloqueante.
 *
 * El contenido de la página es público: este componente NUNCA bloquea ni
 * difumina el contenido. Su única responsabilidad es:
 *  - Hidratar `UserContext` desde el registro guardado (`lib/access`) si existe.
 *  - Si llega `?token=` (enlace del correo de bienvenida), verificarlo,
 *    guardarlo y limpiar la URL — sin sacar al usuario de la página actual.
 *
 * El estado "registrado" (ver `lib/access`) lo consumen los gates de
 * Reportes / Demo / Cotización.
 */
export function AccessGate({ children }: AccessGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const urlToken = searchParams.get("token")

    if (urlToken) {
      verifyAccessToken(urlToken)
        .then((data) => {
          const userInfo = parseUserFromResponse(data)
          saveAccess(urlToken, userInfo)
          trackProposalOpened(urlToken).catch(console.error)
          setUser(userInfo)
          // Limpia el token de la URL conservando la ruta actual (/ o /cotizar)
          router.replace(pathname)
        })
        .catch(() => {
          // Token inválido/expirado: el contenido sigue siendo público.
        })
      return
    }

    // Sin token en la URL: hidratar identidad desde el registro guardado.
    const stored = getStoredAccess()
    if (stored) {
      setUser(stored.user)
      // Refrescar datos en segundo plano sin bloquear la UI.
      verifyAccessToken(stored.token)
        .then((data) => {
          const freshUser = parseUserFromResponse(data)
          saveAccess(stored.token, freshUser)
          setUser(freshUser)
        })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
