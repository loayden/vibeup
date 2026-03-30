import { NextRequest } from "next/server";

import { requireStaff } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { clamp, parseInteger, sanitizeText } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireStaff(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = clamp(parseInteger(searchParams.get("limit"), 20), 1, 100);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        {
          enquiries: [],
          total: 0,
          has_more: false,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    let query = supabase
      .from("enquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      const term = sanitizeText(search, 100);
      query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data: enquiries, error, count } = await query;

    if (error) {
      console.warn("Enquiries query degraded", {
        status,
        search,
        error,
      });
      return jsonResponse(
        {
          enquiries: [],
          total: 0,
          has_more: false,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return jsonResponse(
      {
        enquiries: enquiries || [],
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch enquiries");
  }
}
