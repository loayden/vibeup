import { NextRequest } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { isMissingServerEnvError } from "@/lib/env";
import { validatePromoCode } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import {
  absoluteUrl,
  formatCurrency,
  generateOrderNumber,
  normalizeEmail,
  sanitizeOptionalText,
  sanitizeText,
} from "@/lib/utils";
import type { TableInsert } from "@/types/database";

const orderSchema = z.object({
  event_id: z.string().uuid(),
  customer_name: z.string().min(2).max(100),
  customer_email: z.string().email(),
  customer_phone: z.string().max(30).optional().nullable(),
  items: z
    .array(
      z.object({
        ticket_type_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
  promo_code: z.string().max(20).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = orderSchema.parse(await request.json());
    const supabase = createAdminClient();
    let stripe: ReturnType<typeof getStripeClient>;

    try {
      stripe = getStripeClient();
    } catch (error) {
      if (isMissingServerEnvError(error, "STRIPE_SECRET_KEY")) {
        return errorResponse(
          "Secure payment is temporarily unavailable. Contact support before trying again.",
          503,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      throw error;
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", payload.event_id)
      .eq("status", "published")
      .single();

    if (eventError || !event) {
      return errorResponse("Event not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const ticketTypeIds = payload.items.map((item) => item.ticket_type_id);
    const { data: ticketTypes, error: ticketError } = await supabase
      .from("ticket_types")
      .select("*")
      .in("id", ticketTypeIds)
      .eq("event_id", payload.event_id)
      .eq("is_visible", true);

    if (ticketError || !ticketTypes || ticketTypes.length !== ticketTypeIds.length) {
      return errorResponse("Invalid ticket selection", 400, {
        origin: request.headers.get("origin"),
      });
    }

    let subtotal = 0;
    const orderItems: TableInsert<"order_items">[] = [];
    const itemSummary: string[] = [];

    for (const item of payload.items) {
      const ticketType = ticketTypes.find(
        (candidate) => candidate.id === item.ticket_type_id,
      );

      if (!ticketType) {
        return errorResponse("Ticket type not found", 404, {
          origin: request.headers.get("origin"),
        });
      }

      if (
        ticketType.sale_starts_at &&
        new Date(ticketType.sale_starts_at) > new Date()
      ) {
        return errorResponse(`${ticketType.name} is not on sale yet`, 400, {
          origin: request.headers.get("origin"),
        });
      }

      if (ticketType.sale_ends_at && new Date(ticketType.sale_ends_at) < new Date()) {
        return errorResponse(`${ticketType.name} is no longer available`, 400, {
          origin: request.headers.get("origin"),
        });
      }

      if (item.quantity < ticketType.min_per_order) {
        return errorResponse(
          `Minimum quantity for ${ticketType.name} is ${ticketType.min_per_order}`,
          400,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      if (item.quantity > ticketType.max_per_order) {
        return errorResponse(
          `Maximum quantity for ${ticketType.name} is ${ticketType.max_per_order}`,
          400,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      if (
        ticketType.max_quantity &&
        ticketType.sold_quantity + item.quantity > ticketType.max_quantity
      ) {
        return errorResponse(`Not enough tickets available for ${ticketType.name}`, 400, {
          origin: request.headers.get("origin"),
        });
      }

      const totalPrice = Number((ticketType.price * item.quantity).toFixed(2));
      subtotal += totalPrice;
      itemSummary.push(`${ticketType.name} x${item.quantity}`);
      orderItems.push({
        ticket_type_id: ticketType.id,
        ticket_type_name: ticketType.name,
        quantity: item.quantity,
        unit_price: ticketType.price,
        total_price: totalPrice,
      } as TableInsert<"order_items">);
    }

    subtotal = Number(subtotal.toFixed(2));
    let discountAmount = 0;

    if (payload.promo_code) {
      const promoValidation = await validatePromoCode({
        code: payload.promo_code,
        eventId: payload.event_id,
        subtotal,
        ticketTypeIds,
      });

      if (!promoValidation.valid) {
        return errorResponse(promoValidation.message, 400, {
          origin: request.headers.get("origin"),
        });
      }

      discountAmount = promoValidation.discountAmount ?? 0;
    }

    const feeAmount = Number(((subtotal - discountAmount) * 0.03).toFixed(2));
    const total = Number((subtotal - discountAmount + feeAmount).toFixed(2));
    const orderNumber = generateOrderNumber();
    const authResult = await getAuthUser(request);
    const normalizedCustomerEmail = normalizeEmail(payload.customer_email);
    const linkedUserId =
      authResult.ok &&
      normalizeEmail(authResult.profile.email) === normalizedCustomerEmail
        ? authResult.user.id
        : null;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: linkedUserId,
        event_id: payload.event_id,
        customer_name: sanitizeText(payload.customer_name, 100),
        customer_email: normalizedCustomerEmail,
        customer_phone: sanitizeOptionalText(payload.customer_phone, 30),
        status: "pending",
        subtotal,
        discount_amount: discountAmount,
        fee_amount: feeAmount,
        total,
        currency: "USD",
        promo_code: payload.promo_code?.trim().toUpperCase() || null,
        metadata: {
          items: orderItems.map((item) => ({
            ticket_type_id: item.ticket_type_id,
            ticket_type_name: item.ticket_type_name,
            quantity: item.quantity,
          })),
        },
      })
      .select("*")
      .single();

    if (orderError || !order) {
      return errorResponse(orderError?.message || "Failed to create order", 400, {
        origin: request.headers.get("origin"),
      });
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return errorResponse("Failed to persist order items", 500, {
        origin: request.headers.get("origin"),
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: normalizedCustomerEmail,
        success_url: absoluteUrl(
          `/orders/${orderNumber}/success?session_id={CHECKOUT_SESSION_ID}`,
        ),
        cancel_url: absoluteUrl(`/checkout?cancelled=true&event=${event.slug}`),
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${event.title} - Order ${orderNumber}`,
                description: `${itemSummary.join(", ")}. Total ${formatCurrency(total)}`,
              },
              unit_amount: Math.round(total * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          order_id: order.id,
          order_number: orderNumber,
          event_id: payload.event_id,
          customer_name: sanitizeText(payload.customer_name, 100),
        },
      });

      await supabase
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);

      return jsonResponse(
        {
          order_number: orderNumber,
          checkout_url: session.url,
          session_id: session.id,
        },
        {
          status: 201,
          origin: request.headers.get("origin"),
        },
      );
    } catch (stripeError) {
      console.error("Failed to create Stripe checkout session", stripeError);
      await supabase.from("order_items").delete().eq("order_id", order.id);
      await supabase.from("orders").delete().eq("id", order.id);

      return errorResponse("Failed to create checkout session", 500, {
        origin: request.headers.get("origin"),
      });
    }
  } catch (error) {
    return handleRouteError(request, error, "Failed to create order");
  }
}
