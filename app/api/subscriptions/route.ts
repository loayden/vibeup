import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse, noContentResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { normalizeEmail, sanitizeOptionalText, sanitizeText } from "@/lib/utils";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional().nullable(),
  source: z.string().max(50).default("website"),
});

const unsubscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = subscribeSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { error } = await supabase.from("subscriptions").upsert(
      {
        email: normalizeEmail(payload.email),
        name: sanitizeOptionalText(payload.name, 100),
        source: sanitizeText(payload.source, 50),
        status: "active",
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    );

    if (error) {
      return errorResponse("Subscription failed", 500, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      { message: "Subscribed successfully" },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to subscribe");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = unsubscribeSchema.parse(
      request.nextUrl.searchParams.get("email")
        ? { email: request.nextUrl.searchParams.get("email") }
        : await request.json(),
    );
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", normalizeEmail(payload.email));

    if (error) {
      return errorResponse("Unable to unsubscribe", 500, {
        origin: request.headers.get("origin"),
      });
    }

    return noContentResponse({
      origin: request.headers.get("origin"),
    });
  } catch (error) {
    return handleRouteError(request, error, "Unable to unsubscribe");
  }
}
