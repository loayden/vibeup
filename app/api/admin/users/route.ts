import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { clamp, parseInteger, sanitizeText } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const limit = clamp(parseInteger(searchParams.get("limit"), 20), 1, 100);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const supabase = createAdminClient();

    let query = supabase
      .from("profiles")
      .select(
        "id, full_name, email, role, created_at, email_verified, marketing_opt_in",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) {
      query = query.eq("role", sanitizeText(role, 30));
    }

    if (search) {
      const term = sanitizeText(search, 120);
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw error;
    }

    return jsonResponse(
      {
        users: users || [],
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch users");
  }
}
