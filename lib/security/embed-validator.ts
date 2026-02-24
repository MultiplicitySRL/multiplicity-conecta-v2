/**
 * Validador de dominios autorizados para embeds
 * Centraliza la configuración de seguridad para client y server
 */

export const ALLOWED_EMBED_ORIGINS = [
  'https://staging.multiplicityassess.com',
  // En desarrollo, permitir localhost
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:3000',
    'http://localhost:3001',
  ] : [])
]

/**
 * Verifica si un origen está en la lista de permitidos
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false
  
  try {
    const url = new URL(origin)
    const originWithoutPath = `${url.protocol}//${url.host}`
    
    return ALLOWED_EMBED_ORIGINS.some(allowed => {
      // Comparación exacta
      if (originWithoutPath === allowed) return true
      
      // Permitir subdominios en desarrollo
      if (process.env.NODE_ENV === 'development' && allowed.includes('localhost')) {
        return originWithoutPath.includes('localhost')
      }
      
      return false
    })
  } catch {
    return false
  }
}

/**
 * Verifica si un referer está en la lista de permitidos
 */
export function isAllowedReferer(referer: string | null | undefined): boolean {
  if (!referer) return false
  
  try {
    const url = new URL(referer)
    const origin = `${url.protocol}//${url.host}`
    return isAllowedOrigin(origin)
  } catch {
    return false
  }
}

/**
 * Verifica si la petición viene de un origen autorizado
 * Chequea tanto origin como referer headers
 */
export function isAuthorizedRequest(headers: Headers): boolean {
  const origin = headers.get('origin')
  const referer = headers.get('referer')
  
  // En desarrollo, permitir peticiones sin origin/referer (testing directo)
  if (process.env.NODE_ENV === 'development' && !origin && !referer) {
    return true
  }
  
  // Verificar origin primero (más confiable)
  if (origin && isAllowedOrigin(origin)) {
    return true
  }
  
  // Fallback a referer
  if (referer && isAllowedReferer(referer)) {
    return true
  }
  
  return false
}
