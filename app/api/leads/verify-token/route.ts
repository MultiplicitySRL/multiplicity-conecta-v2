import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;
  if (!crmUrl || !webhookToken) {
    console.error("/api/leads/verify-token: CRM env vars not configured");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const upstream = await fetch(
    `${crmUrl}/api/public/leads/verify-token?token=${encodeURIComponent(token)}`,
    {
      headers: {
        Authorization: `Bearer ${webhookToken}`,
        Accept: "application/json",
      },
    },
  ).catch((err) => {
    console.error("/api/leads/verify-token fetch error:", err);
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
