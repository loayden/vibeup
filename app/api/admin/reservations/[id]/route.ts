import { NextRequest } from "next/server";

import { buildFallbackProfile, requireAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import {
  isMissingSupabaseTableError,
  isSupabaseConnectionError,
} from "@/lib/supabase-errors";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { sanitizeText } from "@/lib/utils";

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

function buildAuthUserSnapshot(user: {
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
  identities?: Array<{ provider?: string | null }> | null;
}) {
  return {
    phone: user.phone || null,
    created_at: user.created_at || null,
    updated_at: user.updated_at || null,
    last_sign_in_at: user.last_sign_in_at || null,
    email_confirmed_at: user.email_confirmed_at || null,
    user_metadata: user.user_metadata || {},
    app_metadata: user.app_metadata || {},
    providers:
      user.identities
        ?.map((identity) => identity.provider || null)
        .filter((provider): provider is string => Boolean(provider)) || [],
  };
}

async function findLinkedUser(email: string) {
  const supabase = tryCreateAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error && !isMissingSupabaseTableError(error)) {
    throw error;
  }

  const authUsersResult = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (authUsersResult.error) {
    throw authUsersResult.error;
  }

  const authUser = authUsersResult.data.users.find(
    (user) => (user.email || "").toLowerCase() === email.toLowerCase(),
  );

  if (!authUser?.email) {
    return profile || null;
  }

  if (profile) {
    return {
      ...profile,
      auth_user: buildAuthUserSnapshot(authUser),
    };
  }

  return {
    ...buildFallbackProfile({
      id: authUser.id,
      email: authUser.email,
      fullName:
        typeof authUser.user_metadata?.full_name === "string"
          ? authUser.user_metadata.full_name
          : authUser.email,
    }),
    auth_user: buildAuthUserSnapshot(authUser),
  };
}

async function findRelatedOrders(email: string) {
  const supabase = tryCreateAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        events (
          id,
          title,
          event_date
        ),
        order_items (*),
        tickets (*)
      `,
    )
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return [];
    }

    throw error;
  }

  return data || [];
}

async function findRelatedReservations(email: string, reservationId: string) {
  const supabase = tryCreateAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("email", email)
    .neq("id", reservationId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return [];
  }

  return ((data || []) as ReservationRow[]).map((reservation) => ({
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
}

export async function GET(
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
    const reservationId = sanitizeText(id, 80);
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return errorResponse("Reservations are unavailable in the current environment.", 503, {
        origin: request.headers.get("origin"),
      });
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .maybeSingle();

    if (error) {
      if (isMissingSupabaseTableError(error) || isSupabaseConnectionError(error)) {
        return errorResponse("Reservation data is unavailable right now.", 503, {
          origin: request.headers.get("origin"),
        });
      }

      throw error;
    }

    if (!data) {
      return errorResponse("Reservation not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const reservation = data as ReservationRow;

    const [linkedUser, relatedOrders, relatedReservations] = await Promise.all([
      findLinkedUser(reservation.email),
      findRelatedOrders(reservation.email),
      findRelatedReservations(reservation.email, String(reservation.id)),
    ]);

    return jsonResponse(
      {
        reservation: {
          id: String(reservation.id),
          email: reservation.email,
          full_name: reservation.full_name || reservation.name || null,
          ticket_type: reservation.ticket_type || reservation.ticket_id || "Reservation",
          ticket_id: reservation.ticket_id || null,
          quantity: reservation.quantity || 1,
          promo: reservation.promo || null,
          status: reservation.status || "pending",
          created_at: reservation.created_at,
        },
        linked_user: linkedUser,
        related_orders: relatedOrders,
        related_reservations: relatedReservations,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch reservation details");
  }
}
