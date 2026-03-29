import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText } from "@/lib/utils";

const refundSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.string().max(500).optional().nullable(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { id } = await context.params;
    const payload = refundSchema.parse(await request.json());
    const supabase = createAdminClient();
    const stripe = getStripeClient();

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!order) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    if (!order.stripe_payment_intent_id) {
      return errorResponse("Order does not have a captured payment", 400, {
        origin: request.headers.get("origin"),
      });
    }

    const refundAmount = payload.amount
      ? Math.min(payload.amount, order.total)
      : order.total;

    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      amount: Math.round(refundAmount * 100),
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
    });

    const isFullRefund = Math.round(refundAmount * 100) >= Math.round(order.total * 100);

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({
        status: isFullRefund ? "refunded" : "partially_refunded",
        refund_reason: sanitizeOptionalText(payload.reason, 500),
        refunded_at: new Date().toISOString(),
        metadata: {
          ...(typeof order.metadata === "object" && order.metadata ? order.metadata : {}),
          stripe_refund_id: refund.id,
          refund_amount: refundAmount,
        },
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !updatedOrder) {
      return errorResponse("Failed to update refunded order", 400, {
        origin: request.headers.get("origin"),
      });
    }

    if (isFullRefund) {
      await supabase
        .from("tickets")
        .update({ status: "refunded" })
        .eq("order_id", id)
        .neq("status", "used");
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "refund",
      resourceType: "order",
      resourceId: id,
      oldData: order,
      newData: updatedOrder,
    });

    return jsonResponse(
      {
        order: updatedOrder,
        refund_id: refund.id,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to refund order");
  }
}
