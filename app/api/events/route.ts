import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { getPublicEventsFeed } from "@/lib/public-events";
import { clamp, parseBoolean, parseInteger, sanitizeText } from "@/lib/utils";

const categorySchema = z.enum([
  "gala",
  "concert",
  "cultural",
  "corporate",
  "private",
  "festival",
  "rooftop",
  "other",
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const upcoming = parseBoolean(searchParams.get("upcoming"));
    const past = parseBoolean(searchParams.get("past"));
    const featuredOnly = parseBoolean(searchParams.get("featured"));
    const limit = clamp(parseInteger(searchParams.get("limit"), 12), 1, 50);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const search = searchParams.get("search");

    const feed = await getPublicEventsFeed();
    let events = [...feed.upcoming, ...feed.past];

    if (category) {
      const categoryResult = categorySchema.safeParse(category);

      if (!categoryResult.success) {
        return errorResponse("Invalid category filter", 400, {
          origin: request.headers.get("origin"),
        });
      }

      events = events.filter((event) => event.category === categoryResult.data);
    }

    if (featuredOnly) {
      events = events.filter((event) => event.featured);
    }

    if (upcoming && !past) {
      events = events.filter((event) => event.eventState !== "past");
    }

    if (past && !upcoming) {
      events = events.filter((event) => event.eventState === "past");
    }

    if (search) {
      const term = sanitizeText(search, 100).toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.shortDescription.toLowerCase().includes(term) ||
          event.shortVenue.toLowerCase().includes(term),
      );
    }

    const total = events.length;
    const payload = events.slice(offset, offset + limit);

    return jsonResponse(
      {
        events: payload,
        total,
        has_more: offset + limit < total,
        source: feed.source,
        degraded: feed.degraded,
        degraded_message: feed.degraded_message,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch events");
  }
}
