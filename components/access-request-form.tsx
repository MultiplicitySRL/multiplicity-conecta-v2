"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

const LEAD_FORM_WEBHOOK =
  "https://n8n.srv1464241.hstgr.cloud/webhook/9cfe0b76-ed98-426a-86cf-35f110fa7ef5"

const BLOCKED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "outlook.com", "hotmail.com", "hotmail.es", "hotmail.co.uk",
  "live.com", "live.es", "live.co.uk",
  "yahoo.com", "yahoo.es", "yahoo.co.uk",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "msn.com", "protonmail.com", "proton.me",
  "yandex.com", "mail.com", "zoho.com",
]

function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase()
  return !!domain && BLOCKED_DOMAINS.includes(domain)
}

interface FormValues {
  nombre: string
  email: string
  cargo: string
  empresa: string
  mensaje: string
}

type FormState = "idle" | "submitting" | "success" | "error"

interface AccessRequestFormProps {
  compact?: boolean
}

export function AccessRequestForm({ compact = false }: AccessRequestFormProps) {
  const [formState, setFormState] = useState<FormState>("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    setFormState("submitting")
    try {
      await fetch(LEAD_FORM_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setFormState("success")
    } catch {
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="bg-green-100 rounded-full p-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">¡Solicitud enviada!</h3>
        <p className="text-gray-600 max-w-sm">
          Revisaremos tu información y te enviaremos un enlace de acceso a tu correo en breve.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "space-y-4"}>
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            placeholder="Tu nombre"
            {...register("nombre", { required: "Campo requerido" })}
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            {...register("email", {
              required: "Campo requerido",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
              validate: (v) => !isPersonalEmail(v) || "Ingresa tu correo corporativo, no uno personal",
            })}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            placeholder="Tu cargo en la empresa"
            {...register("cargo", { required: "Campo requerido" })}
            aria-invalid={!!errors.cargo}
          />
          {errors.cargo && (
            <p className="text-xs text-red-500">{errors.cargo.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            placeholder="Nombre de tu empresa"
            {...register("empresa", { required: "Campo requerido" })}
            aria-invalid={!!errors.empresa}
          />
          {errors.empresa && (
            <p className="text-xs text-red-500">{errors.empresa.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          placeholder="Cuéntanos sobre tu empresa y qué te interesa conocer..."
          rows={3}
          {...register("mensaje", { required: "Campo requerido" })}
          aria-invalid={!!errors.mensaje}
        />
        {errors.mensaje && (
          <p className="text-xs text-red-500">{errors.mensaje.message}</p>
        )}
      </div>

      {formState === "error" && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Ocurrió un error al enviar. Por favor intenta de nuevo.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full bg-[#E11383] hover:bg-[#c40f72] text-white"
      >
        {formState === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Solicitar acceso"
        )}
      </Button>
    </form>
  )
}
