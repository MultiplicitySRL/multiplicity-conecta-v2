export interface RegisterLeadInput {
  nombre: string;
  email: string;
  cargo: string;
  empresa: string;
  mensaje: string;
}

export interface LeadUserInfo {
  id: string;
  nombreCompleto: string;
  cargo: string;
  email: string;
  empresa: string;
}

export interface RegisterLeadResult {
  leadId: string | null;
  accessToken: string | null;
}

export async function registerLead(input: RegisterLeadInput): Promise<RegisterLeadResult> {
  const res = await fetch("/api/leads/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "register_failed");
  }
  const data = await res.json().catch(() => ({}));
  return { leadId: data.leadId ?? null, accessToken: data.accessToken ?? null };
}

export async function verifyAccessToken(token: string): Promise<LeadUserInfo> {
  const res = await fetch(`/api/leads/verify-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "invalid_token");
  }
  return res.json();
}
