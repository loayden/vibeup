import { NextRequest } from "next/server";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { getPublicEventBySlug, getPublicEventsFeed } from "@/lib/public-events";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const [event, feed] = await Promise.all([getPublicEventBySlug(slug), getPublicEventsFeed()]);

    if (!event) {
      return errorResponse("Event not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      {
        event,
        source: feed.source,
        degraded: feed.degraded,
        degraded_message: feed.degraded_message,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch event");
  }
}
