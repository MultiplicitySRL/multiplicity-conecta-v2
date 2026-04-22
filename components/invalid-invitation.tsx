import Image from "next/image";
import Link from "next/link";

const MESSAGES: Record<string, string> = {
  missing: "No se proporcionó un enlace de invitación.",
  not_found: "Este enlace no es válido.",
  already_used: "Este enlace ya fue utilizado.",
  expired: "Este enlace ha expirado.",
  error: "Ocurrió un error al verificar el enlace.",
};

interface InvalidInvitationProps {
  reason: string;
}

export function InvalidInvitation({ reason }: InvalidInvitationProps) {
  const message = MESSAGES[reason] ?? MESSAGES.error;

  return (
    <div className="min-h-screen bg-[#EDEEF2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-5">
        <div className="flex justify-center">
          <Image
            src="/images/multiplicity-logo.png"
            alt="Multiplicity"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">Enlace no disponible</h1>
          <p className="text-gray-500 text-sm">{message}</p>
          <p className="text-gray-500 text-sm">
            Contacta a tu representante en Multiplicity para solicitar un nuevo enlace.
          </p>
        </div>
        <Link
          href="mailto:info@multiplicity.com.do"
          className="inline-block text-sm text-indigo-600 hover:underline"
        >
          info@multiplicity.com.do
        </Link>
      </div>
    </div>
  );
}
