import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { tryCreateAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        {
          stats: {
            orders_this_month: 0,
            active_tickets: 0,
            new_enquiries: 0,
            total_subscribers: 0,
            published_events: 0,
            revenue_this_month: 0,
          },
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      paidOrdersResult,
      activeTicketsResult,
      newEnquiriesResult,
      backupEnquiriesResult,
      subscriptionsResult,
      revenueResult,
      publishedEventsResult,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid")
        .gte("created_at", monthAgo),
      supabase
        .from("tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "valid"),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .in("status", ["backup_enquiry", "backup_application"]),
      supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("orders")
        .select("total")
        .eq("status", "paid")
        .gte("created_at", monthAgo),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    const revenue = (revenueResult.data || []).reduce(
      (sum, order) => sum + order.total,
      0,
    );

    const degradedResults = [
      paidOrdersResult,
      activeTicketsResult,
      newEnquiriesResult,
      backupEnquiriesResult,
      subscriptionsResult,
      revenueResult,
      publishedEventsResult,
    ].filter((result) => result.error);

    if (degradedResults.length > 0) {
      console.warn(
        "Admin dashboard is running in degraded data mode",
        degradedResults.map((result) => ({
          status: result.status,
          statusText: result.statusText,
          error: result.error,
        })),
      );
    }

    return jsonResponse(
      {
        stats: {
          orders_this_month: paidOrdersResult.count || 0,
          active_tickets: activeTicketsResult.count || 0,
          new_enquiries:
            newEnquiriesResult.count ||
            backupEnquiriesResult.count ||
            0,
          total_subscribers: subscriptionsResult.count || 0,
          published_events: publishedEventsResult.count || 0,
          revenue_this_month: Number(revenue.toFixed(2)),
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch dashboard stats");
  }
}
