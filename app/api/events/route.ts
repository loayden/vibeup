import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import {
  clamp,
  parseBoolean,
  parseInteger,
  sanitizeText,
} from "@/lib/utils";

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

async function attachTicketTypes(eventIds: string[]) {
  if (eventIds.length === 0) {
    return new Map<string, unknown[]>();
  }

  const supabase = createAdminClient();
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select(
      "id, event_id, name, price, sold_quantity, max_quantity, is_visible, badge, color, currency",
    )
    .in("event_id", eventIds)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  const grouped = new Map<string, unknown[]>();

  for (const ticketType of ticketTypes || []) {
    const key = ticketType.event_id || "";
    const current = grouped.get(key) || [];
    current.push(ticketType);
    grouped.set(key, current);
  }

  return grouped;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const upcoming = parseBoolean(searchParams.get("upcoming"));
    const past = parseBoolean(searchParams.get("past"));
    const featured = parseBoolean(searchParams.get("featured"));
    const limit = clamp(parseInteger(searchParams.get("limit"), 12), 1, 50);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const search = searchParams.get("search");

    const supabase = createAdminClient();
    let query = supabase
      .from("events")
      .select(
        `
          id,
          slug,
          title,
          subtitle,
          short_description,
          venue_name,
          venue_city,
          event_date,
          doors_open,
          cover_image_url,
          category,
          status,
          featured,
          max_capacity,
          current_attendees,
          external_ticket_url
        `,
        { count: "exact" },
      )
      .eq("status", status)
      .order("event_date", { ascending: upcoming && !past })
      .range(offset, offset + limit - 1);

    if (category) {
      const categoryResult = categorySchema.safeParse(category);

      if (!categoryResult.success) {
        return errorResponse("Invalid category filter", 400, {
          origin: request.headers.get("origin"),
        });
      }

      query = query.eq("category", categoryResult.data);
    }

    if (upcoming) {
      query = query.gte("event_date", new Date().toISOString());
    }

    if (past) {
      query = query.lt("event_date", new Date().toISOString());
    }

    if (featured) {
      query = query.eq("featured", true);
    }

    if (search) {
      query = query.ilike("title", `%${sanitizeText(search, 100)}%`);
    }

    const { data: events, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500, {
        origin: request.headers.get("origin"),
      });
    }

    const ticketTypeMap = await attachTicketTypes((events || []).map((event) => event.id));
    const payload = (events || []).map((event) => ({
      ...event,
      ticket_types: ticketTypeMap.get(event.id) || [],
    }));

    return jsonResponse(
      {
        events: payload,
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch events");
  }
}
