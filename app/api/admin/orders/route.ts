import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { clamp, parseInteger, sanitizeText } from "@/lib/utils";

const statusSchema = z.enum([
  "pending",
  "paid",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const email = searchParams.get("email");
    const eventId = searchParams.get("event_id");
    const orderNumber = searchParams.get("order_number");
    const limit = clamp(parseInteger(searchParams.get("limit"), 20), 1, 100);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const supabase = createAdminClient();

    let query = supabase
      .from("orders")
      .select(
        `
          *,
          events (
            id,
            title,
            event_date
          ),
          order_items (*),
          tickets (*)
        `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      const parsedStatus = statusSchema.safeParse(status);

      if (!parsedStatus.success) {
        return errorResponse("Invalid status filter", 400, {
          origin: request.headers.get("origin"),
        });
      }

      query = query.eq("status", parsedStatus.data);
    }

    if (email) {
      query = query.ilike("customer_email", `%${sanitizeText(email, 320)}%`);
    }

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    if (orderNumber) {
      query = query.eq("order_number", sanitizeText(orderNumber, 40));
    }

    const { data: orders, error, count } = await query;

    if (error) {
      throw error;
    }

    return jsonResponse(
      {
        orders: orders || [],
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch orders");
  }
}
