import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL;
  const token = process.env.WEBHOOK_TOKEN;
  if (!crmUrl || !token) {
    console.error("/api/quotes/submit: CRM env vars not configured");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const body = await request.text();

  const upstream = await fetch(`${crmUrl}/api/public/quotes/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  }).catch((err) => {
    console.error("/api/quotes/submit fetch error:", err);
    return null;
  });

  if (!upstream) {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  const responseBody = await upstream.text();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
