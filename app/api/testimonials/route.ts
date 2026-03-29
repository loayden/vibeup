import { NextRequest } from "next/server";

import { handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { clamp, parseBoolean, parseInteger } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const featured = parseBoolean(request.nextUrl.searchParams.get("featured"));
    const limit = clamp(
      parseInteger(request.nextUrl.searchParams.get("limit"), 12),
      1,
      50,
    );
    const supabase = createAdminClient();
    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (featured) {
      query = query.eq("featured", true);
    }

    const { data: testimonials, error } = await query;

    if (error) {
      throw error;
    }

    return jsonResponse(
      { testimonials: testimonials || [] },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch testimonials");
  }
}
