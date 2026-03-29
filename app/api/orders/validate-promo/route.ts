import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { validatePromoCode } from "@/lib/orders";

const schema = z.object({
  code: z.string().min(3).max(20),
  event_id: z.string().uuid(),
  subtotal: z.number().positive(),
  ticket_type_ids: z.array(z.string().uuid()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const result = await validatePromoCode({
      code: payload.code,
      eventId: payload.event_id,
      subtotal: payload.subtotal,
      ticketTypeIds: payload.ticket_type_ids,
    });

    if (!result.valid) {
      return errorResponse(result.message, 400, {
        origin: request.headers.get("origin"),
      });
    }

    const promo = result.promo;

    return jsonResponse(
      {
        valid: true,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
        discount_amount: result.discountAmount,
        description: promo.description,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Failed to validate promo code");
  }
}
