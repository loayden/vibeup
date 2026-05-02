import { NextRequest } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { canAccessOrder, getOrderWithRelationsByNumber } from "@/lib/orders";
import { normalizeEmail } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const order = await getOrderWithRelationsByNumber(id);
    const authResult = await getAuthUser(request);
    const email = request.nextUrl.searchParams.get("email");
    const sessionId = request.nextUrl.searchParams.get("session_id");

    const profile = authResult.ok ? authResult.profile : null;
    const hasAccess = canAccessOrder(order, profile, email, sessionId);

    if (!hasAccess) {
      return errorResponse("Order not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      {
        order: {
          ...order,
          customer_email:
            profile && normalizeEmail(profile.email) === normalizeEmail(order.customer_email)
              ? order.customer_email
              : undefined,
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch order");
  }
}
