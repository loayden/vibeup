import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const supabase = createAdminClient();
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
          *,
          events (
            id,
            title,
            event_date,
            venue_name
          ),
          order_items (*),
          tickets (*)
        `,
      )
      .or(
        `user_id.eq.${authResult.user.id},customer_email.eq.${authResult.profile.email}`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return jsonResponse(
      { orders: orders || [] },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch order history");
  }
}
