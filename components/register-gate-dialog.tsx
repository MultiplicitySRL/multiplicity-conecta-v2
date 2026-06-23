"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AccessRequestForm } from "@/components/access-request-form"
import { saveAccess } from "@/lib/access"

interface RegisterGateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  /** Texto del botón que continúa la acción tras el registro. */
  ctaLabel?: string
  /**
   * Se llama cuando el usuario pulsa "continuar" tras registrarse (gesto del
   * usuario, por lo que `window.open` no es bloqueado por el navegador).
   */
  onRegistered: () => void
}

/**
 * Gate de registro reubicado: cuando el visitante intenta una acción de valor
 * (abrir un reporte, solicitar demo, generar cotización) y aún no se registró,
 * se muestra este diálogo. Al registrarse, guarda el acceso y, con un gesto
 * explícito ("continuar"), ejecuta la acción original.
 */
export function RegisterGateDialog({
  open,
  onOpenChange,
  title = "Regístrate para continuar",
  description = "Déjanos tus datos para acceder al contenido.",
  ctaLabel = "Continuar",
  onRegistered,
}: RegisterGateDialogProps) {
  const [done, setDone] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (!next) setDone(false)
    onOpenChange(next)
  }

  const handleProceed = () => {
    setDone(false)
    onOpenChange(false)
    onRegistered()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {done ? (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">¡Registro completado!</h3>
            <p className="text-gray-600 max-w-sm">
              Ya tienes acceso. Continúa para ver el contenido.
            </p>
            <Button
              onClick={handleProceed}
              className="w-full bg-[#E11383] hover:bg-[#c40f72] text-white"
            >
              {ctaLabel}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-7 pb-2 items-center text-center">
              <Image
                src="/images/multiplicity-logo.png"
                alt="Multiplicity"
                width={180}
                height={54}
                className="object-contain mb-3"
                priority
              />
              <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
              {description ? (
                <DialogDescription className="text-sm text-gray-600">{description}</DialogDescription>
              ) : null}
            </DialogHeader>
            <div className="px-6 py-5">
              <AccessRequestForm
                compact
                submitLabel="Registrarme"
                onSuccess={({ accessToken, user }) => {
                  if (accessToken) saveAccess(accessToken, user)
                  setDone(true)
                }}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
