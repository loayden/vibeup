import { NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  const response = jsonResponse(
    { message: "Logged out successfully" },
    {
      origin: request.headers.get("origin"),
    },
  );

  return clearSessionCookie(response);
}
