import { NextRequest } from "next/server";

import { errorResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  return errorResponse(
    "This endpoint is deprecated. Use /api/orders/create instead.",
    410,
    {
      origin: request.headers.get("origin"),
    },
  );
}
