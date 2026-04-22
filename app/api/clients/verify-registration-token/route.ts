import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL;
  const token = process.env.WEBHOOK_TOKEN;
  if (!crmUrl || !token) {
    console.error("/api/clients/verify-registration-token: CRM env vars not configured");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const registrationToken = request.nextUrl.searchParams.get("token") ?? "";

  const upstream = await fetch(
    `${crmUrl}/api/public/clients/verify-registration-token?token=${encodeURIComponent(registrationToken)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  ).catch((err) => {
    console.error("/api/clients/verify-registration-token fetch error:", err);
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
