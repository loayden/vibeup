import "server-only";

import QRCode from "qrcode";

import { createAdminClient } from "@/lib/supabase-server";
import { generateTicketNumber } from "@/lib/utils";
import type { TableRow } from "@/types/database";

type OrderForTickets = TableRow<"orders"> & {
  order_items: Array<TableRow<"order_items">>;
};

export async function generateTickets(order: OrderForTickets) {
  const supabase = createAdminClient();
  const expectedTicketCount = order.order_items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const { data: existingTickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  const existing = existingTickets || [];

  if (existing.length >= expectedTicketCount) {
    return existing;
  }

  const existingByOrderItem = new Map<string, number>();

  for (const ticket of existing) {
    const key = ticket.order_item_id || "";
    existingByOrderItem.set(key, (existingByOrderItem.get(key) || 0) + 1);
  }

  for (const item of order.order_items) {
    const existingCount = existingByOrderItem.get(item.id) || 0;
    const missingCount = Math.max(item.quantity - existingCount, 0);

    for (let index = 0; index < missingCount; index += 1) {
      const ticketNumber = generateTicketNumber();
      const qrPayload = JSON.stringify({
        ticket: ticketNumber,
        order: order.order_number,
        event: order.event_id,
      });

      const qrCodeUrl = await QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: "#C6A962",
          light: "#080808",
        },
      });

      const { data: ticket, error } = await supabase
        .from("tickets")
        .insert({
          ticket_number: ticketNumber,
          order_id: order.id,
          order_item_id: item.id,
          event_id: order.event_id,
          ticket_type_id: item.ticket_type_id,
          ticket_type_name: item.ticket_type_name,
          holder_name: order.customer_name,
          holder_email: order.customer_email,
          qr_code: qrPayload,
          qr_code_url: qrCodeUrl,
          status: "valid",
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      existing.push(ticket);
    }
  }

  return existing.sort((left, right) =>
    left.created_at.localeCompare(right.created_at),
  );
}

export async function validateTicket(ticketNumber: string, eventId?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from("tickets")
    .select(
      `
        *,
        events (
          title,
          event_date,
          venue_name
        )
      `,
    )
    .eq("ticket_number", ticketNumber);

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  const { data, error } = await query.single();

  if (error) {
    throw error;
  }

  return data;
}
