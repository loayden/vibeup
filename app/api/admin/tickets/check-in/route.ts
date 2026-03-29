import { NextRequest } from "next/server";
import { z } from "zod";

import { requireStaff } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

const schema = z.object({
  ticket_number: z.string().min(3).max(100),
  event_id: z.string().uuid(),
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

    const { data: ticket } = await supabase
      .from("tickets")
      .select(
        `
          *,
          events (
            title
          )
        `,
      )
      .eq("ticket_number", payload.ticket_number)
      .eq("event_id", payload.event_id)
      .single();

    if (!ticket) {
      return errorResponse("Ticket not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    if (ticket.status === "used") {
      return errorResponse("Ticket already used", 409, {
        origin: request.headers.get("origin"),
        details: {
          checked_in_at: ticket.checked_in_at,
        },
      });
    }

    if (ticket.status === "cancelled" || ticket.status === "refunded") {
      return errorResponse(`Ticket is ${ticket.status}`, 400, {
        origin: request.headers.get("origin"),
      });
    }

    const { data: updatedTicket, error } = await supabase
      .from("tickets")
      .update({
        status: "used",
        checked_in_at: new Date().toISOString(),
        checked_in_by: authResult.user.id,
      })
      .eq("id", ticket.id)
      .select("*")
      .single();

    if (error || !updatedTicket) {
      return errorResponse("Check-in failed", 400, {
        origin: request.headers.get("origin"),
      });
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "check_in",
      resourceType: "ticket",
      resourceId: ticket.id,
      oldData: ticket,
      newData: updatedTicket,
    });

    return jsonResponse(
      {
        success: true,
        message: "Check-in successful",
        ticket_type: ticket.ticket_type_name,
        holder: ticket.holder_name,
        event: ticket.events,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to check in ticket");
  }
}
