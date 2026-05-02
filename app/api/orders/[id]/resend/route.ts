import { NextRequest } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendTicketEmail } from "@/lib/email";
import { canAccessOrder, getOrderWithRelationsByNumber } from "@/lib/orders";
import { normalizeEmail } from "@/lib/utils";
import type { TableRow } from "@/types/database";

const resendSchema = z.object({
  email: z.string().email().optional().nullable(),
  session_id: z.string().max(255).optional().nullable(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = resendSchema.parse(await request.json().catch(() => ({})));
    const order = await getOrderWithRelationsByNumber(id);
    const authResult = await getAuthUser(request);
    const profile = authResult.ok ? authResult.profile : null;
    const email = payload.email ? normalizeEmail(payload.email) : null;
    const sessionId = payload.session_id?.trim() || null;

    if (!canAccessOrder(order, profile, email, sessionId)) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    if (order.status !== "paid") {
      return errorResponse("Tickets can only be resent after payment is confirmed.", 409, {
        origin: request.headers.get("origin"),
      });
    }

    if (!order.tickets?.length || !order.events) {
      return errorResponse("Tickets are not ready to resend yet.", 409, {
        origin: request.headers.get("origin"),
      });
    }

    await sendTicketEmail({
      to: email || normalizeEmail(order.customer_email),
      name: order.customer_name,
      orderNumber: order.order_number,
      eventTitle: order.events.title,
      eventDate: order.events.event_date,
      venue: order.events.venue_name,
      tickets: (order.tickets as TableRow<"tickets">[]).map((ticket) => ({
        ticket_number: ticket.ticket_number,
        ticket_type_name: ticket.ticket_type_name,
        qr_code_url: ticket.qr_code_url,
      })),
      total: order.total,
      currency: order.currency,
    });

    return jsonResponse(
      {
        message: "Ticket email sent successfully.",
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to resend ticket email");
  }
}
