import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText } from "@/lib/utils";

const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "paid", "cancelled", "refunded", "partially_refunded"])
    .optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function PUT(
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
    const payload = updateOrderSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingOrder) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({
        ...(payload.status ? { status: payload.status } : {}),
        ...(payload.notes !== undefined
          ? { notes: sanitizeOptionalText(payload.notes, 2000) }
          : {}),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !updatedOrder) {
      return errorResponse("Failed to update order", 400, {
        origin: request.headers.get("origin"),
      });
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "update",
      resourceType: "order",
      resourceId: id,
      oldData: existingOrder,
      newData: updatedOrder,
    });

    return jsonResponse(
      { order: updatedOrder },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to update order");
  }
}
