import { NextRequest, NextResponse } from "next/server";

import {
  getDefaultOrigin,
  isAllowedOrigin,
  normalizeOrigin,
  resolveCorsOrigin,
} from "@/lib/origins";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function buildCorsHeaders(origin?: string | null, requestOrigin?: string) {
  const normalizedOrigin = normalizeOrigin(origin);
  const resolvedOrigin =
    normalizedOrigin && normalizedOrigin === requestOrigin
      ? normalizedOrigin
      : resolveCorsOrigin(origin) || getDefaultOrigin();

  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Admin-Secret",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    Vary: "Origin",
  };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");
  const requestOrigin = request.nextUrl.origin;
  const corsHeaders = buildCorsHeaders(origin, requestOrigin);
  const isWebhook = pathname.startsWith("/api/webhooks/stripe");
  const normalizedOrigin = normalizeOrigin(origin);
  const isSameOrigin = Boolean(normalizedOrigin && normalizedOrigin === requestOrigin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (origin && !isSameOrigin && !isAllowedOrigin(origin) && !isWebhook) {
    return NextResponse.json(
      { error: "Origin not allowed" },
      {
        status: 403,
        headers: corsHeaders,
      },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = pathname.includes("/auth/")
    ? 5
    : isWebhook
      ? 120
      : 60;
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
  } else if (existing.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(Math.ceil((existing.resetAt - now) / 1000)),
        },
      },
    );
  } else {
    existing.count += 1;
  }

  const response = NextResponse.next();

  for (const [header, value] of Object.entries(corsHeaders)) {
    response.headers.set(header, value);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
