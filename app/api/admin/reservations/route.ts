import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { clamp, parseInteger, sanitizeText } from "@/lib/utils";

type ReservationRow = {
  id: string | number;
  email: string;
  full_name?: string | null;
  name?: string | null;
  ticket_type?: string | null;
  ticket_id?: string | null;
  quantity?: number | null;
  promo?: string | null;
  status?: string | null;
  created_at: string;
};

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const limit = clamp(parseInteger(searchParams.get("limit"), 12), 1, 100);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return jsonResponse(
        {
          reservations: [],
          total: 0,
          has_more: false,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    let query = supabase
      .from("reservations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", sanitizeText(status, 50));
    }

    if (search) {
      const term = sanitizeText(search, 120);
      query = query.or(
        `email.ilike.%${term}%,full_name.ilike.%${term}%,name.ilike.%${term}%,ticket_type.ilike.%${term}%`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.warn("Reservations query degraded", {
        search,
        status,
        error,
      });

      return jsonResponse(
        {
          reservations: [],
          total: 0,
          has_more: false,
        },
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    const reservations = ((data || []) as ReservationRow[]).map((reservation) => ({
      id: String(reservation.id),
      email: reservation.email,
      full_name: reservation.full_name || reservation.name || null,
      ticket_type: reservation.ticket_type || reservation.ticket_id || "Reservation",
      ticket_id: reservation.ticket_id || null,
      quantity: reservation.quantity || 1,
      promo: reservation.promo || null,
      status: reservation.status || "pending",
      created_at: reservation.created_at,
    }));

    return jsonResponse(
      {
        reservations,
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch reservations");
  }
}
