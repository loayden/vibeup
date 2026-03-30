import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendAdminNotification } from "@/lib/email";
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

type ReservationInput = {
  fullName: string;
  email: string;
  phone: string | null;
  promo: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
};

function isSupabaseConnectionError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" &&
          error &&
          "message" in error &&
          typeof error.message === "string"
        ? error.message
        : null;

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("fetch failed") ||
    normalized.includes("enotfound") ||
    normalized.includes("getaddrinfo") ||
    normalized.includes("network") ||
    normalized.includes("supabase")
  );
}

function normalizeReservationInput(payload: z.infer<typeof reservationSchema>): ReservationInput {
  return {
    fullName: sanitizeText(payload.full_name, 100),
    email: normalizeEmail(payload.email),
    phone: sanitizeOptionalText(payload.phone, 30),
    promo: sanitizeOptionalText(payload.promo, 40),
    items: payload.items.map((item) => ({
      id: sanitizeText(item.id, 100),
      name: sanitizeText(item.name, 120),
      quantity: item.quantity,
    })),
  };
}

function buildBackupReservationHtml(input: ReservationInput) {
  const itemLines = input.items
    .map(
      (item) =>
        `<li style="margin:0 0 8px;">${item.quantity} x ${item.name}</li>`,
    )
    .join("");

  return `
    <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;padding:24px;">
      <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">
        Reservation backup received
      </h1>
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.72);">
        Supabase was unavailable, so this reservation was captured through the backup channel.
      </p>
      <p style="margin:16px 0 4px;color:rgba(255,255,255,0.72);"><strong>Name:</strong> ${input.fullName}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Email:</strong> ${input.email}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Phone:</strong> ${input.phone || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Promo:</strong> ${input.promo || "None"}</p>
      <div style="margin-top:18px;">
        <p style="margin:0 0 10px;color:#C6A962;"><strong>Tickets</strong></p>
        <ul style="margin:0;padding-left:18px;color:rgba(255,255,255,0.72);">
          ${itemLines}
        </ul>
      </div>
    </body>
  `;
}

async function sendReservationBackup(input: ReservationInput) {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  try {
    await sendAdminNotification(
      `Reservation backup: ${input.fullName}`,
      buildBackupReservationHtml(input),
    );
  } catch {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const payload = reservationSchema.parse(await request.json());
    const reservationInput = normalizeReservationInput(payload);
    const supabase = createAdminClient();

    const rows = reservationInput.items.map((item) => ({
      email: reservationInput.email,
      full_name: reservationInput.fullName,
      ticket_type: item.name,
      ticket_id: item.id,
      quantity: item.quantity,
      promo: reservationInput.promo,
      status: "pending",
    }));

    const { error } = await supabase.from("reservations").insert(rows);

    if (error) {
      if (isSupabaseConnectionError(error)) {
        const backupSent = await sendReservationBackup(reservationInput);

        if (backupSent) {
          return jsonResponse(
            {
              message:
                "Reservation received through the backup channel. Continue to the official ticket page to complete purchase.",
            },
            {
              status: 201,
              origin: request.headers.get("origin"),
            },
          );
        }

        return errorResponse(
          "Supabase connection failed. Check NEXT_PUBLIC_SUPABASE_URL and confirm the project is active.",
          500,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

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
