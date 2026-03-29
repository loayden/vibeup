import { NextRequest } from "next/server";

import { handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { data: events, error } = await supabase
      .from("events")
      .select(
        "id, slug, title, subtitle, short_description, venue_name, venue_city, event_date, cover_image_url, external_ticket_url",
      )
      .eq("status", "published")
      .eq("featured", true)
      .order("event_date", { ascending: true })
      .limit(6);

    if (error) {
      throw error;
    }

    return jsonResponse(
      { events: events || [] },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch featured events");
  }
}
