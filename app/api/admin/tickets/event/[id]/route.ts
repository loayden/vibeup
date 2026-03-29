import { NextRequest } from "next/server";

import { requireStaff } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireStaff(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data: tickets, error } = await supabase
      .from("tickets")
      .select(
        `
          *,
          orders (
            order_number,
            customer_name,
            customer_email
          )
        `,
      )
      .eq("event_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return jsonResponse(
      { tickets: tickets || [] },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch event tickets");
  }
}
