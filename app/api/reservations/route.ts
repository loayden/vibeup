import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { normalizeEmail, sanitizeOptionalText, sanitizeText } from "@/lib/utils";

const reservationSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  promo: z.string().max(40).optional().nullable(),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        name: z.string().min(1).max(120),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(10),
});

function isSupabaseConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("enotfound") ||
    message.includes("getaddrinfo") ||
    message.includes("network") ||
    message.includes("supabase")
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = reservationSchema.parse(await request.json());
    const supabase = createAdminClient();

    const rows = payload.items.map((item) => ({
      email: normalizeEmail(payload.email),
      full_name: sanitizeText(payload.full_name, 100),
      ticket_type: sanitizeText(item.name, 120),
      ticket_id: sanitizeText(item.id, 100),
      quantity: item.quantity,
      promo: sanitizeOptionalText(payload.promo, 40),
      status: "pending",
    }));

    const { error } = await supabase.from("reservations").insert(rows);

    if (error) {
      if (
        error.code === "42P01" ||
        error.message.toLowerCase().includes("reservations")
      ) {
        return errorResponse(
          "Reservations table is missing. Run the latest Supabase schema before saving reservations.",
          500,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      throw error;
    }

    return jsonResponse(
      {
        message: "Reservation saved successfully.",
      },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    if (isSupabaseConnectionError(error)) {
      return errorResponse(
        "Supabase connection failed. Check NEXT_PUBLIC_SUPABASE_URL and confirm the project is active.",
        500,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return handleRouteError(request, error, "Unable to save your reservation right now.");
  }
}
