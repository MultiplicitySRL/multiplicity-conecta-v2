interface Participant {
  nombre: string;
  apellido: string;
  email: string;
  posicion?: string;
}

export async function trackProposalOpened(token: string): Promise<void> {
  await fetch("/api/tracking/proposal-opened", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export async function trackDemoRequested(payload: {
  token: string;
  participants: Participant[];
}): Promise<{ demoId?: string }> {
  const res = await fetch("/api/tracking/demo-requested", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`demo-requested ${res.status}`);
  return res.json();
}

export async function trackProposalAccepted(token: string, quoteId?: string): Promise<void> {
  await fetch("/api/tracking/proposal-accepted", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...(quoteId ? { quoteId } : {}) }),
  });
}
