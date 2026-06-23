import type { UserInfo } from "@/lib/user-context"

/**
 * Estado de "registrado" del visitante (client-side).
 *
 * Reutiliza el mecanismo del access token de leads: tras registrarse, el
 * usuario queda marcado aquí y eso desbloquea Reportes / Demo / Cotización.
 * El gate de entrada de la página fue eliminado (ver `access-gate.tsx`); este
 * estado ya NO bloquea el sitio, solo los puntos de valor.
 */

export const ACCESS_STORAGE_KEY = "multiplicity_access"

// Alineado con la expiración del token en el servidor (30 días) para no
// re-pedir el registro en cada visita.
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

export interface StoredAccess {
  token: string
  grantedAt: number
  user: UserInfo
}

export function getStoredAccess(): StoredAccess | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY)
    if (!raw) return null
    const parsed: StoredAccess = JSON.parse(raw)
    if (Date.now() - parsed.grantedAt > TOKEN_TTL_MS) {
      localStorage.removeItem(ACCESS_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveAccess(token: string, user: UserInfo): void {
  if (typeof window === "undefined") return
  const data: StoredAccess = { token, grantedAt: Date.now(), user }
  localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(data))
}

export function getAccessToken(): string {
  return getStoredAccess()?.token ?? ""
}

export function getStoredUser(): UserInfo | null {
  return getStoredAccess()?.user ?? null
}

/** ¿El visitante ya entregó sus datos (registro válido y no expirado)? */
export function isRegistered(): boolean {
  return getStoredAccess() !== null
}
