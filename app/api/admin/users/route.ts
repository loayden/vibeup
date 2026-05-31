import { NextRequest } from "next/server";

import { buildFallbackProfile, requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { isMissingSupabaseTableError } from "@/lib/supabase-errors";
import { tryCreateAdminClient } from "@/lib/supabase-server";
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
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        {
          users: [],
          total: 0,
          has_more: false,
          source: "unavailable",
          degraded: true,
          degraded_message:
            "Supabase admin access is unavailable, so user profiles cannot be loaded.",
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    let query = supabase
      .from("profiles")
      .select(
        "id, full_name, email, phone, avatar_url, role, created_at, updated_at, email_verified, marketing_opt_in",
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
      if (isMissingSupabaseTableError(error)) {
        const authUsersResult = await supabase.auth.admin.listUsers({
          page: Math.floor(offset / limit) + 1,
          perPage: limit,
        });

        if (authUsersResult.error) {
          throw authUsersResult.error;
        }

        const term = search ? sanitizeText(search, 120).toLowerCase() : null;
        const fallbackUsers = authUsersResult.data.users
          .filter((user) => {
            if (role && role !== "super_admin" && role !== "customer") {
              return false;
            }

            const profile = buildFallbackProfile({
              id: user.id,
              email: user.email || "",
              fullName:
                typeof user.user_metadata?.full_name === "string"
                  ? user.user_metadata.full_name
                  : user.email || "ZOYA User",
            });

            if (role && profile.role !== sanitizeText(role, 30)) {
              return false;
            }

            if (!term) {
              return true;
            }

            return (
              profile.email.toLowerCase().includes(term) ||
              (profile.full_name || "").toLowerCase().includes(term)
            );
          })
          .map((user) =>
            buildFallbackProfile({
              id: user.id,
              email: user.email || "",
              fullName:
                typeof user.user_metadata?.full_name === "string"
                  ? user.user_metadata.full_name
                  : user.email || "ZOYA User",
            }),
          );

        return jsonResponse(
          {
            users: fallbackUsers,
            total: fallbackUsers.length,
            has_more: false,
            source: "auth_fallback",
            degraded: true,
            degraded_message:
              "Profiles table is unavailable. Showing auth-directory users without full profile records.",
          },
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      throw error;
    }

    return jsonResponse(
      {
        users: users || [],
        total: count || 0,
        has_more: count ? offset + limit < count : false,
        source: "profiles",
        degraded: false,
        degraded_message: null,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch users");
  }
}
