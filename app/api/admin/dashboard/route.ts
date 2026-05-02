import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { tryCreateAdminClient } from "@/lib/supabase-server";

type HealthCheck = {
  key: string;
  label: string;
  status: "healthy" | "degraded" | "offline";
  detail: string;
};

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const supabase = tryCreateAdminClient();
    const stripeConfigured = Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
    );
    const emailConfigured = Boolean(process.env.RESEND_API_KEY);

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
          degraded: true,
          degraded_message:
            "Supabase admin access is unavailable. Dashboard counts are offline and live catalog health cannot be verified from this environment.",
          health: [
            {
              key: "catalog",
              label: "Event Catalog",
              status: "offline",
              detail:
                "Supabase admin access is unavailable, so live event and inventory data cannot be verified.",
            },
            {
              key: "orders",
              label: "Orders & Tickets",
              status: "offline",
              detail:
                "Order, payment, and ticket records are unavailable because database access is offline.",
            },
            {
              key: "profiles",
              label: "Profiles & Leads",
              status: "offline",
              detail:
                "Profiles, reservations, and lead records cannot be queried until Supabase is restored.",
            },
            {
              key: "stripe",
              label: "Stripe",
              status: stripeConfigured ? "healthy" : "degraded",
              detail: stripeConfigured
                ? "Stripe server keys are present for first-party checkout."
                : "Stripe server keys are missing from this environment.",
            },
            {
              key: "email",
              label: "Email Delivery",
              status: emailConfigured ? "healthy" : "degraded",
              detail: emailConfigured
                ? "Transactional email credentials are configured."
                : "Resend is not configured, so email delivery is not fully live.",
            },
          ] satisfies HealthCheck[],
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
      profilesResult,
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
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true }),
    ]);

    const revenue = (revenueResult.data || []).reduce(
      (sum, order) => sum + order.total,
      0,
    );

    const health: HealthCheck[] = [
      {
        key: "catalog",
        label: "Event Catalog",
        status: publishedEventsResult.error ? "degraded" : "healthy",
        detail: publishedEventsResult.error
          ? "Published event inventory could not be verified from the database."
          : `${publishedEventsResult.count || 0} published events are currently visible to the platform.`,
      },
      {
        key: "orders",
        label: "Orders & Tickets",
        status:
          paidOrdersResult.error || activeTicketsResult.error ? "degraded" : "healthy",
        detail:
          paidOrdersResult.error || activeTicketsResult.error
            ? "Order or ticket queries are partially unavailable. Revenue and fulfillment counts may be incomplete."
            : `${paidOrdersResult.count || 0} paid orders and ${activeTicketsResult.count || 0} active tickets are currently visible.`,
      },
      {
        key: "profiles",
        label: "Profiles & Leads",
        status:
          profilesResult.error || newEnquiriesResult.error || backupEnquiriesResult.error
            ? "degraded"
            : "healthy",
        detail:
          profilesResult.error || newEnquiriesResult.error || backupEnquiriesResult.error
            ? "Profiles, enquiries, or backup lead records are partially unavailable."
            : `${profilesResult.count || 0} profiles and ${(newEnquiriesResult.count || 0) + (backupEnquiriesResult.count || 0)} open lead items are available.`,
      },
      {
        key: "stripe",
        label: "Stripe",
        status: stripeConfigured ? "healthy" : "degraded",
        detail: stripeConfigured
          ? "Stripe server keys are present for first-party checkout."
          : "Stripe server keys are missing from this environment.",
      },
      {
        key: "email",
        label: "Email Delivery",
        status: emailConfigured ? "healthy" : "degraded",
        detail: emailConfigured
          ? "Transactional email credentials are configured."
          : "Resend is not configured, so email delivery is not fully live.",
      },
    ];

    const degraded = health.some((item) => item.status !== "healthy");
    const degradedMessage = degraded
      ? `Dashboard is showing partial operational truth. ${health.filter((item) => item.status !== "healthy").length} health check${health.filter((item) => item.status !== "healthy").length > 1 ? "s are" : " is"} degraded.`
      : null;

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
        degraded,
        degraded_message: degradedMessage,
        health,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch dashboard stats");
  }
}
