import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { resolveCorsOrigin } from "@/lib/origins";

type JsonInit = ResponseInit & {
  origin?: string | null;
};

export function buildCorsHeaders(origin?: string | null) {
  const resolvedOrigin = resolveCorsOrigin(origin);

  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Admin-Secret",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    Vary: "Origin",
  };
}

export function jsonResponse<T>(data: T, init: JsonInit = {}) {
  const { origin, headers, ...rest } = init;

  return NextResponse.json(data, {
    ...rest,
    headers: {
      ...buildCorsHeaders(origin),
      ...headers,
    },
  });
}

export function errorResponse(
  message: string,
  status = 400,
  init: JsonInit & { details?: unknown } = {},
) {
  const payload = init.details
    ? { error: message, details: init.details }
    : { error: message };

  return jsonResponse(payload, {
    ...init,
    status,
  });
}

export function noContentResponse(init: JsonInit = {}) {
  const { origin, headers, ...rest } = init;

  return new NextResponse(null, {
    ...rest,
    status: init.status ?? 204,
    headers: {
      ...buildCorsHeaders(origin),
      ...headers,
    },
  });
}

export function handleRouteError(
  request: NextRequest,
  error: unknown,
  fallbackMessage = "Internal server error",
) {
  if (error instanceof ZodError) {
    return errorResponse("Validation failed", 422, {
      origin: request.headers.get("origin"),
      details: error.flatten(),
    });
  }

  if (error instanceof SyntaxError) {
    return errorResponse("Invalid JSON payload", 400, {
      origin: request.headers.get("origin"),
    });
  }

  const message =
    error instanceof Error && process.env.NODE_ENV !== "production"
      ? error.message
      : fallbackMessage;

  return errorResponse(message, 500, {
    origin: request.headers.get("origin"),
  });
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export function getUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") || "unknown";
}
