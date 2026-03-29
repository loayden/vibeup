import { NextRequest } from "next/server";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const supabase = createAdminClient();

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !event) {
      return errorResponse("Event not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const { data: ticketTypes, error: ticketError } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (ticketError) {
      throw ticketError;
    }

    return jsonResponse(
      {
        event: {
          ...event,
          ticket_types: ticketTypes || [],
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch event");
  }
}
