import type { Metadata } from "next";
import { InvalidInvitation } from "@/components/invalid-invitation";
import { RegistrationForm } from "@/components/registration-form";

export const metadata: Metadata = {
  title: "Registro – Multiplicity",
  description: "Completa el registro de tu empresa en la plataforma Multiplicity.",
};

async function verifyToken(token: string): Promise<
  | { ok: true; inviteeName: string | null; inviteeEmail: string | null }
  | { ok: false; reason: string }
> {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;

  if (!crmUrl || !webhookToken) {
    return { ok: false, reason: "error" };
  }

  try {
    const res = await fetch(
      `${crmUrl}/api/public/clients/verify-registration-token?token=${encodeURIComponent(token)}`,
      {
        headers: { Authorization: `Bearer ${webhookToken}` },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      return {
        ok: true,
        inviteeName: data.inviteeName ?? null,
        inviteeEmail: data.inviteeEmail ?? null,
      };
    }

    const data = await res.json().catch(() => ({}));
    const reason: string = data.error ?? "error";
    return { ok: false, reason };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <InvalidInvitation reason="missing" />;
  }

  const result = await verifyToken(token);

  if (!result.ok) {
    return <InvalidInvitation reason={result.reason} />;
  }

  return (
    <RegistrationForm
      token={token}
      inviteeName={result.inviteeName}
      inviteeEmail={result.inviteeEmail}
    />
  );
}
