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
          users: [authResult.profile],
          total: 1,
          has_more: false,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

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
                  : user.email || "VibeUp User",
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
                  : user.email || "VibeUp User",
            }),
          );

        return jsonResponse(
          {
            users: fallbackUsers,
            total: fallbackUsers.length,
            has_more: false,
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
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch users");
  }
}
