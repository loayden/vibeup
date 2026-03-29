import { NextRequest } from "next/server";
import { z } from "zod";

import { requireStaff } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

const schema = z.object({
  ticket_numbers: z.array(z.string().min(3).max(100)).min(1).max(100),
  event_id: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireStaff(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const payload = schema.parse(await request.json());
    const supabase = createAdminClient();
    let query = supabase
      .from("tickets")
      .select(
        "id, ticket_number, event_id, ticket_type_name, holder_name, status, checked_in_at",
      )
      .in("ticket_number", payload.ticket_numbers);

    if (payload.event_id) {
      query = query.eq("event_id", payload.event_id);
    }

    const { data: tickets, error } = await query;

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
    return handleRouteError(request, error, "Unable to validate tickets");
  }
}
