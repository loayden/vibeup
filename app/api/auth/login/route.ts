import { NextRequest } from "next/server";
import { z } from "zod";

import {
  applySessionCookie,
  buildFallbackProfile,
  signInWithSupabase,
  signSessionToken,
} from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { isMissingServerEnvError } from "@/lib/env";
import { isMissingSupabaseTableError } from "@/lib/supabase-errors";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { normalizeEmail, sanitizeText } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json());
    const signInResult = await signInWithSupabase(payload.email, payload.password);

    if (signInResult.error || !signInResult.data.user) {
      return errorResponse("Invalid email or password", 401, {
        origin: request.headers.get("origin"),
      });
    }

    const authUser = signInResult.data.user;
    const fullName = sanitizeText(
      authUser.user_metadata?.full_name || authUser.email || "ZOYA Guest",
      100,
    );
    const supabase = tryCreateAdminClient();
    let profile = buildFallbackProfile({
      id: authUser.id,
      email: payload.email,
      fullName,
    });

    if (supabase) {
      const profileResult = await supabase
        .from("profiles")
        .upsert(
          {
            id: authUser.id,
            email: normalizeEmail(payload.email),
            full_name: fullName,
          },
          { onConflict: "id" },
        )
        .select("*")
        .single();

      if (profileResult.data) {
        profile = profileResult.data;
      } else if (profileResult.error && !isMissingSupabaseTableError(profileResult.error)) {
        throw profileResult.error;
      }
    }

    const sessionToken = await signSessionToken({
      sub: authUser.id,
      email: normalizeEmail(payload.email),
    });

    const response = jsonResponse(
      {
        user: {
          id: authUser.id,
          email: authUser.email,
        },
        profile,
        session: {
          created: true,
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );

    return applySessionCookie(response, sessionToken);
  } catch (error) {
    if (isMissingServerEnvError(error, "JWT_SECRET")) {
      return errorResponse(
        "Server configuration is incomplete. Set JWT_SECRET in Vercel before signing in.",
        500,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return handleRouteError(request, error, "Login failed");
  }
}
