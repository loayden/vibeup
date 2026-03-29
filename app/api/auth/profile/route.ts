import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText, sanitizeText } from "@/lib/utils";

const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
  avatar_url: z.string().url().max(500).optional().nullable(),
  marketing_opt_in: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const payload = updateProfileSchema.parse(await request.json());
    const supabase = createAdminClient();

    const updatePayload = {
      ...(payload.full_name
        ? { full_name: sanitizeText(payload.full_name, 100) }
        : {}),
      ...(payload.phone !== undefined
        ? { phone: sanitizeOptionalText(payload.phone, 30) }
        : {}),
      ...(payload.avatar_url !== undefined
        ? { avatar_url: payload.avatar_url || null }
        : {}),
      ...(payload.marketing_opt_in !== undefined
        ? { marketing_opt_in: payload.marketing_opt_in }
        : {}),
    };

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", authResult.user.id)
      .select("*")
      .single();

    if (error || !profile) {
      return errorResponse(error?.message || "Profile update failed", 400, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      { profile },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Profile update failed");
  }
}
