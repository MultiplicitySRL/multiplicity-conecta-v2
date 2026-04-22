export type VerifyResult =
  | { ok: true; inviteeName: string | null; inviteeEmail: string | null }
  | { ok: false; reason: "not_found" | "already_used" | "expired" | "error" };

export async function verifyRegistrationToken(token: string): Promise<VerifyResult> {
  try {
    const res = await fetch(
      `/api/clients/verify-registration-token?token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      const data = await res.json();
      return { ok: true, inviteeName: data.inviteeName ?? null, inviteeEmail: data.inviteeEmail ?? null };
    }

    if (res.status === 410) {
      const data = await res.json().catch(() => ({}));
      const reason = data.error === "already_used" ? "already_used" : "expired";
      return { ok: false, reason };
    }

    return { ok: false, reason: "not_found" };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export interface RegistrationFormData {
  razonSocial: string;
  rnc?: string;
  direccion?: string;
  tipoNCF?: string;
  medioEntrega?: string;
  contactoFact1Nombre: string;
  contactoFact1Email: string;
  contactoFact1Posicion?: string;
  contactoFact1Telefono?: string;
  contactoFact2Nombre?: string;
  contactoFact2Email?: string;
  contactoFact2Posicion?: string;
  contactoFact2Telefono?: string;
  contactoAdmin1Nombre: string;
  contactoAdmin1Email: string;
  contactoAdmin1Posicion?: string;
  contactoAdmin1Telefono?: string;
  contactoAdmin2Nombre?: string;
  contactoAdmin2Email?: string;
  contactoAdmin2Posicion?: string;
  contactoAdmin2Telefono?: string;
}

export type SubmitResult =
  | { ok: true; companyId: string | null }
  | { ok: false; reason: "invalid_or_used_token" | "missing_fields" | "error" };

export async function submitRegistration(
  token: string,
  formData: RegistrationFormData,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/clients/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, formData }),
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, companyId: data.companyId ?? null };
    }

    if (res.status === 401) {
      return { ok: false, reason: "invalid_or_used_token" };
    }
    if (res.status === 400) {
      return { ok: false, reason: "missing_fields" };
    }

    return { ok: false, reason: "error" };
  } catch {
    return { ok: false, reason: "error" };
  }
}
