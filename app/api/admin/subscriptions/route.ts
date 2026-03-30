import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendBulkEmail } from "@/lib/email";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { clamp, parseInteger } from "@/lib/utils";

const blastSchema = z.object({
  subject: z.string().min(3).max(200),
  html: z.string().min(10).max(200000),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const limit = clamp(
      parseInteger(request.nextUrl.searchParams.get("limit"), 100),
      1,
      500,
    );
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        { subscriptions: [] },
        {
          origin: request.headers.get("origin"),
        },
      );
    }
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Subscriptions query degraded", {
        limit,
        status: error,
      });
      return jsonResponse(
        { subscriptions: [] },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return jsonResponse(
      { subscriptions: subscriptions || [] },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch subscriptions");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const payload = blastSchema.parse(await request.json());
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        {
          message: "No subscription list is configured for this project yet.",
          sent: 0,
          failed: 0,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }
    const { data: recipients, error } = await supabase
      .from("subscriptions")
      .select("email")
      .eq("status", "active");

    if (error) {
      console.warn("Subscriptions blast degraded", {
        error,
      });
      return jsonResponse(
        {
          message: "No subscription list is configured for this project yet.",
          sent: 0,
          failed: 0,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    const result = await sendBulkEmail({
      recipients: (recipients || []).map((recipient) => recipient.email),
      subject: payload.subject,
      html: payload.html,
    });

    return jsonResponse(
      {
        message: "Bulk email processed",
        ...result,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to send subscription email");
  }
}
