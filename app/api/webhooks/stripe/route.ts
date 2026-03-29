import { NextRequest } from "next/server";
import Stripe from "stripe";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendTicketEmail } from "@/lib/email";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { generateTickets } from "@/lib/tickets";

async function incrementTicketSales(orderItems: Array<{ ticket_type_id: string | null; quantity: number }>) {
  const supabase = createAdminClient();
  const ticketTypeIds = orderItems
    .map((item) => item.ticket_type_id)
    .filter((ticketTypeId): ticketTypeId is string => Boolean(ticketTypeId));

  if (ticketTypeIds.length === 0) {
    return;
  }

  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("id, sold_quantity")
    .in("id", ticketTypeIds);

  const soldMap = new Map(
    (ticketTypes || []).map((ticketType) => [ticketType.id, ticketType.sold_quantity]),
  );

  for (const item of orderItems) {
    if (!item.ticket_type_id) {
      continue;
    }

    const currentSold = soldMap.get(item.ticket_type_id) || 0;

    await supabase
      .from("ticket_types")
      .update({
        sold_quantity: currentSold + item.quantity,
      })
      .eq("id", item.ticket_type_id);

    soldMap.set(item.ticket_type_id, currentSold + item.quantity);
  }
}

async function incrementPromoUsage(code: string | null) {
  if (!code) {
    return;
  }

  const supabase = createAdminClient();
  const { data: promo } = await supabase
    .from("promo_codes")
    .select("id, used_count")
    .eq("code", code)
    .single();

  if (!promo) {
    return;
  }

  await supabase
    .from("promo_codes")
    .update({
      used_count: promo.used_count + 1,
    })
    .eq("id", promo.id);
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return errorResponse("Missing Stripe signature", 400, {
        origin: request.headers.get("origin"),
      });
    }

    const stripe = getStripeClient();
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.order_number;

        if (!orderNumber) {
          break;
        }

        const { data: existingOrder } = await supabase
          .from("orders")
          .select(
            `
              *,
              order_items (*),
              events (
                title,
                event_date,
                venue_name
              )
            `,
          )
          .eq("order_number", orderNumber)
          .single();

        if (!existingOrder) {
          break;
        }

        if (existingOrder.status === "paid") {
          break;
        }

        const { data: paidOrder, error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : existingOrder.stripe_payment_intent_id,
            payment_method:
              session.payment_method_types?.[0] || existingOrder.payment_method,
          })
          .eq("id", existingOrder.id)
          .select(
            `
              *,
              order_items (*),
              events (
                title,
                event_date,
                venue_name
              )
            `,
          )
          .single();

        if (error || !paidOrder) {
          throw error || new Error("Failed to update paid order");
        }

        await incrementTicketSales(paidOrder.order_items);
        await incrementPromoUsage(paidOrder.promo_code);

        const tickets = await generateTickets({
          ...paidOrder,
          order_items: paidOrder.order_items,
        });

        try {
          await sendTicketEmail({
            to: paidOrder.customer_email,
            name: paidOrder.customer_name,
            orderNumber: paidOrder.order_number,
            eventTitle: paidOrder.events.title,
            eventDate: paidOrder.events.event_date,
            venue: paidOrder.events.venue_name,
            tickets: tickets.map((ticket) => ({
              ticket_number: ticket.ticket_number,
              ticket_type_name: ticket.ticket_type_name,
              qr_code_url: ticket.qr_code_url,
            })),
            total: paidOrder.total,
            currency: paidOrder.currency,
          });
        } catch (emailError) {
          console.error("Failed to send ticket email", emailError);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.order_number;

        if (!orderNumber) {
          break;
        }

        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("order_number", orderNumber)
          .eq("status", "pending");
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("stripe_payment_intent_id", intent.id)
          .eq("status", "pending");
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : null;

        if (!paymentIntentId) {
          break;
        }

        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_payment_intent_id", paymentIntentId)
          .single();

        if (!order) {
          break;
        }

        const fullRefund = charge.amount_refunded >= charge.amount;

        await supabase
          .from("orders")
          .update({
            status: fullRefund ? "refunded" : "partially_refunded",
            refunded_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (fullRefund) {
          await supabase
            .from("tickets")
            .update({ status: "refunded" })
            .eq("order_id", order.id)
            .neq("status", "used");
        }

        break;
      }

      default:
        break;
    }

    return jsonResponse(
      { received: true },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return errorResponse("Invalid webhook signature", 400, {
        origin: request.headers.get("origin"),
      });
    }

    return handleRouteError(request, error, "Webhook processing failed");
  }
}
