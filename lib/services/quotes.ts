export async function submitProspectQuote(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch("/api/quotes/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "submit_failed");
  }
}
