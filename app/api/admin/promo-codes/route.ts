import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText, sanitizeText } from "@/lib/utils";

const promoCodeSchema = z.object({
  code: z.string().min(3).max(20),
  description: z.string().max(200).optional().nullable(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive(),
  min_order_amount: z.number().nonnegative().default(0),
  max_uses: z.number().int().positive().optional().nullable(),
  applicable_event_ids: z.array(z.string().uuid()).default([]),
  applicable_ticket_type_ids: z.array(z.string().uuid()).default([]),
  valid_from: z.string().optional(),
  valid_until: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const payload = promoCodeSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: promoCode, error } = await supabase
      .from("promo_codes")
      .insert({
        code: sanitizeText(payload.code, 20).toUpperCase(),
        description: sanitizeOptionalText(payload.description, 200),
        discount_type: payload.discount_type,
        discount_value: payload.discount_value,
        min_order_amount: payload.min_order_amount,
        max_uses: payload.max_uses || null,
        applicable_event_ids: payload.applicable_event_ids,
        applicable_ticket_type_ids: payload.applicable_ticket_type_ids,
        valid_from: payload.valid_from
          ? new Date(payload.valid_from).toISOString()
          : new Date().toISOString(),
        valid_until: payload.valid_until
          ? new Date(payload.valid_until).toISOString()
          : null,
        is_active: payload.is_active,
      })
      .select("*")
      .single();

    if (error || !promoCode) {
      return errorResponse(error?.message || "Failed to create promo code", 400, {
        origin: request.headers.get("origin"),
      });
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "create",
      resourceType: "promo_code",
      resourceId: promoCode.id,
      newData: promoCode,
    });

    return jsonResponse(
      { promo_code: promoCode },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to create promo code");
  }
}
