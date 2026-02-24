"use client"

import { useState, useEffect } from "react"
import { ALLOWED_EMBED_ORIGINS } from "@/lib/security/embed-validator"

interface EmbedSecurityState {
  isValid: boolean
  isLoading: boolean
  error?: string
  isEmbedded: boolean
}

/**
 * Hook para validar que la página solo sea embebida desde dominios autorizados
 * 
 * Verifica:
 * 1. Si la página está en un iframe
 * 2. Si el parent origin es un dominio autorizado
 * 3. Permite acceso directo en desarrollo para testing
 */
export function useEmbedSecurity(): EmbedSecurityState {
  const [state, setState] = useState<EmbedSecurityState>({
    isValid: false,
    isLoading: true,
    isEmbedded: false,
  })

  useEffect(() => {
    const checkEmbedSecurity = () => {
      try {
        // Verificar si estamos en un iframe
        const isEmbedded = window.self !== window.top

        // Si no está embebido, permitir acceso directo (para testing)
        if (!isEmbedded) {
          setState({
            isValid: true,
            isLoading: false,
            isEmbedded: false,
          })
          return
        }

        // Está embebido, verificar el origen del parent
        try {
          // Intentar acceder al parent location (fallará si es cross-origin)
          const parentOrigin = document.referrer
          
          if (!parentOrigin) {
            // No hay referrer, bloquear
            setState({
              isValid: false,
              isLoading: false,
              error: "No se pudo verificar el origen del embed",
              isEmbedded: true,
            })
            return
          }

          // Extraer el origin del referrer
          const url = new URL(parentOrigin)
          const origin = `${url.protocol}//${url.host}`

          // Verificar si está en la lista de permitidos
          const isAllowed = ALLOWED_EMBED_ORIGINS.some(allowed => {
            if (origin === allowed) return true
            
            // En desarrollo, permitir subdominios de localhost
            if (process.env.NODE_ENV === 'development' && allowed.includes('localhost')) {
              return origin.includes('localhost')
            }
            
            return false
          })

          if (isAllowed) {
            setState({
              isValid: true,
              isLoading: false,
              isEmbedded: true,
            })
          } else {
            setState({
              isValid: false,
              isLoading: false,
              error: `Origen no autorizado: ${origin}`,
              isEmbedded: true,
            })
          }
        } catch (error) {
          // Error al acceder al parent (cross-origin), usar referrer
          const referrer = document.referrer
          
          if (!referrer) {
            setState({
              isValid: false,
              isLoading: false,
              error: "No se pudo verificar el origen del embed",
              isEmbedded: true,
            })
            return
          }

          const url = new URL(referrer)
          const origin = `${url.protocol}//${url.host}`
          const isAllowed = ALLOWED_EMBED_ORIGINS.includes(origin)

          setState({
            isValid: isAllowed,
            isLoading: false,
            error: isAllowed ? undefined : `Origen no autorizado: ${origin}`,
            isEmbedded: true,
          })
        }
      } catch (error) {
        console.error("Error en validación de embed:", error)
        setState({
          isValid: false,
          isLoading: false,
          error: "Error al validar seguridad del embed",
          isEmbedded: false,
        })
      }
    }

    // Ejecutar la validación
    checkEmbedSecurity()
  }, [])

  return state
}
