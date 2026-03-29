import { NextRequest } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { canAccessOrder, getOrderWithRelationsByNumber } from "@/lib/orders";
import { normalizeEmail } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const { orderNumber } = await context.params;
    const order = await getOrderWithRelationsByNumber(orderNumber);
    const authResult = await getAuthUser(request);
    const email = request.nextUrl.searchParams.get("email");

    const profile = authResult.ok ? authResult.profile : null;
    const hasAccess = canAccessOrder(order, profile, email);

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
