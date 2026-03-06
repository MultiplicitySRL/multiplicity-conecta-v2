import Image from "next/image"
import { AccessRequestForm } from "@/components/access-request-form"

export default function ExternalFormPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Multiplicity Conecta logo.png"
            alt="Multiplicity Logo"
            width={220}
            height={66}
            className="object-contain"
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-navy px-6 py-6 text-white">
            <h1 className="text-2xl font-bold mb-1">
              Solicita tu <span className="text-[#E11383]">acceso</span>
            </h1>
            <p className="text-white/80 text-sm">
              Completa el formulario y te enviaremos un enlace personalizado para acceder a la
              plataforma.
            </p>
          </div>

          <div className="px-6 py-6">
            <AccessRequestForm />
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Multiplicity © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}
