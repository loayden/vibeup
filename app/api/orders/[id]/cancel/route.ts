import { NextRequest } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { canAccessOrder } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText } from "@/lib/utils";

const cancelSchema = z.object({
  email: z.string().email().optional(),
  reason: z.string().max(500).optional().nullable(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = cancelSchema.parse(await request.json().catch(() => ({})));
    const authResult = await getAuthUser(request);
    const supabase = createAdminClient();
    const stripe = getStripeClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const hasAccess = canAccessOrder(
      order,
      authResult.ok ? authResult.profile : null,
      payload.email,
    );

    if (!hasAccess) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    if (order.status !== "pending") {
      return errorResponse("Only pending orders can be cancelled", 400, {
        origin: request.headers.get("origin"),
      });
    }

    if (order.stripe_session_id) {
      try {
        await stripe.checkout.sessions.expire(order.stripe_session_id);
      } catch (stripeError) {
        console.error("Failed to expire checkout session", stripeError);
      }
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        notes: sanitizeOptionalText(payload.reason, 500),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError || !updatedOrder) {
      return errorResponse("Failed to cancel order", 400, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      {
        order: updatedOrder,
        message: `Order ${updatedOrder.order_number} cancelled successfully`,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to cancel order");
  }
}
