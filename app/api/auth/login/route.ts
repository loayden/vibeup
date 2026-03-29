import { NextRequest } from "next/server";
import { z } from "zod";

import {
  applySessionCookie,
  signInWithSupabase,
  signSessionToken,
} from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
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
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from("profiles")
      .upsert(
        {
          id: authUser.id,
          email: normalizeEmail(payload.email),
          full_name: sanitizeText(
            authUser.user_metadata?.full_name || authUser.email || "VibeUp Guest",
            100,
          ),
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    const sessionToken = await signSessionToken({
      sub: authUser.id,
      email: normalizeEmail(payload.email),
    });

    const response = jsonResponse(
      {
        token: sessionToken,
        user: {
          id: authUser.id,
          email: authUser.email,
        },
        profile,
      },
      {
        origin: request.headers.get("origin"),
      },
    );

    return applySessionCookie(response, sessionToken);
  } catch (error) {
    return handleRouteError(request, error, "Login failed");
  }
}
