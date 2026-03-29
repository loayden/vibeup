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
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .or(
        `user_id.eq.${authResult.user.id},customer_email.eq.${authResult.profile.email}`,
      );

    const orderIds = (orders || []).map((order) => order.id);
    const ticketsByEmail = await supabase
      .from("tickets")
      .select(
        `
          *,
          events (
            id,
            title,
            event_date,
            venue_name
          )
        `,
      )
      .eq("holder_email", authResult.profile.email)
      .order("created_at", { ascending: false });

    let tickets = ticketsByEmail.data || [];

    if (orderIds.length > 0) {
      const ticketsByOrder = await supabase
        .from("tickets")
        .select(
          `
            *,
            events (
              id,
              title,
              event_date,
              venue_name
            )
          `,
        )
        .in("order_id", orderIds)
        .order("created_at", { ascending: false });

      const merged = new Map<string, (typeof tickets)[number]>();

      for (const ticket of tickets) {
        merged.set(ticket.id, ticket);
      }

      for (const ticket of ticketsByOrder.data || []) {
        merged.set(ticket.id, ticket);
      }

      tickets = Array.from(merged.values()).sort((left, right) =>
        right.created_at.localeCompare(left.created_at),
      );
    }

    return jsonResponse(
      { tickets },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch tickets");
  }
}
