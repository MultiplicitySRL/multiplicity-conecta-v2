"use client"

import { ShieldAlert } from "lucide-react"

interface BlockedAccessScreenProps {
  error?: string
}

/**
 * Pantalla que se muestra cuando el embed no es desde un dominio autorizado
 */
export function BlockedAccessScreen({ error }: BlockedAccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icono */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
              <div className="relative bg-red-500 text-white rounded-full p-6">
                <ShieldAlert className="h-16 w-16" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Acceso Restringido
          </h1>

          {/* Descripción */}
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Esta página solo puede ser accedida desde la plataforma autorizada de Multiplicity.
          </p>

          {/* Detalles técnicos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-sm text-red-800 font-mono break-all">
                {error}
              </p>
            </div>
          )}

          {/* Mensaje adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </div>
        </div>

        {/* Footer con branding */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Multiplicity © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
