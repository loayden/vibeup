import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const supabase = createAdminClient();
    const [ordersResult, eventsResult] = await Promise.all([
      supabase
        .from("orders")
        .select("id, event_id, total, status, created_at")
        .in("status", ["paid", "refunded", "partially_refunded"]),
      supabase
        .from("events")
        .select("id, title, event_date, current_attendees, max_capacity"),
    ]);

    if (ordersResult.error) {
      console.warn("Analytics orders query degraded", {
        status: ordersResult.status,
        statusText: ordersResult.statusText,
        error: ordersResult.error,
      });
    }

    if (eventsResult.error) {
      console.warn("Analytics events query degraded", {
        status: eventsResult.status,
        statusText: eventsResult.statusText,
        error: eventsResult.error,
      });
    }

    const orders = ordersResult.error ? [] : ordersResult.data || [];
    const events = eventsResult.error ? [] : eventsResult.data || [];
    const revenueByMonth = new Map<string, number>();
    const revenueByEvent = new Map<string, number>();

    for (const order of orders) {
      const monthKey = order.created_at.slice(0, 7);
      revenueByMonth.set(
        monthKey,
        Number(((revenueByMonth.get(monthKey) || 0) + order.total).toFixed(2)),
      );

      if (order.event_id) {
        revenueByEvent.set(
          order.event_id,
          Number(
            ((revenueByEvent.get(order.event_id) || 0) + order.total).toFixed(2),
          ),
        );
      }
    }

    const topEvents = events
      .map((event) => ({
        id: event.id,
        title: event.title,
        event_date: event.event_date,
        attendees: event.current_attendees,
        max_capacity: event.max_capacity,
        revenue: revenueByEvent.get(event.id) || 0,
      }))
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 10);

    return jsonResponse(
      {
        monthly_revenue: Array.from(revenueByMonth.entries())
          .map(([month, revenue]) => ({ month, revenue }))
          .sort((left, right) => left.month.localeCompare(right.month)),
        top_events: topEvents,
        totals: {
          revenue: Number(
            orders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
          ),
          paid_orders: orders.filter((order) => order.status === "paid").length,
          refunded_orders: orders.filter((order) =>
            ["refunded", "partially_refunded"].includes(order.status),
          ).length,
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch analytics");
  }
}
