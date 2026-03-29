import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);

  if (!authResult.ok) {
    return errorResponse(authResult.error, authResult.status, {
      origin: request.headers.get("origin"),
    });
  }

  return jsonResponse(
    {
      user: authResult.user,
      profile: authResult.profile,
    },
    {
      origin: request.headers.get("origin"),
    },
  );
}
