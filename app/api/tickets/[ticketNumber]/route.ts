import { NextRequest } from "next/server";

import { errorResponse, jsonResponse } from "@/lib/api";
import { validateTicket } from "@/lib/tickets";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticketNumber: string }> },
) {
  try {
    const { ticketNumber } = await context.params;
    const ticket = await validateTicket(ticketNumber);

    return jsonResponse(
      {
        ticket: {
          ticket_number: ticket.ticket_number,
          ticket_type_name: ticket.ticket_type_name,
          holder_name: ticket.holder_name,
          status: ticket.status,
          checked_in_at: ticket.checked_in_at,
          seat_number: ticket.seat_number,
          table_number: ticket.table_number,
          event: ticket.events,
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch {
    return errorResponse("Ticket not found", 404, {
      origin: request.headers.get("origin"),
    });
  }
}
