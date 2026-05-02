import { NextRequest } from "next/server";

import { handleRouteError, jsonResponse } from "@/lib/api";
import { getPublicEventsFeed } from "@/lib/public-events";

export async function GET(request: NextRequest) {
  try {
    const feed = await getPublicEventsFeed();

    return jsonResponse(feed, {
      origin: request.headers.get("origin"),
    });
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch public events feed");
  }
}
