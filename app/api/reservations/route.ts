import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendAdminNotification } from "@/lib/email";
import {
  isBackupEligibleSupabaseError,
  isMissingSupabaseTableError,
  isSupabaseConnectionError,
  isSupabaseMissingColumnError,
} from "@/lib/supabase-errors";
import { createAdminClient } from "@/lib/supabase-server";
import { normalizeEmail, sanitizeOptionalText, sanitizeText } from "@/lib/utils";

const reservationItemSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(10),
});

const modernReservationSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  promo: z.string().max(40).optional().nullable(),
  items: z.array(reservationItemSchema).min(1).max(10),
});

const legacyReservationSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  promo: z.string().max(40).optional().nullable(),
  ticketId: z.string().min(1).max(100).optional(),
  ticketName: z.string().min(1).max(120).optional(),
  ticket_type: z.string().min(1).max(100).optional(),
  quantity: z.coerce.number().int().min(1).max(10).optional(),
});

const reservationSchema = z.union([
  modernReservationSchema,
  legacyReservationSchema,
]);

type ReservationPayload = z.infer<typeof reservationSchema>;

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

function normalizeReservationInput(payload: ReservationPayload): ReservationInput {
  if ("items" in payload) {
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

  const fallbackName = sanitizeText(
    payload.full_name || payload.name || payload.email.split("@")[0] || "Guest",
    100,
  );
  const fallbackTicketId = sanitizeText(
    payload.ticketId || payload.ticket_type || "general-admission",
    100,
  );
  const fallbackTicketName = sanitizeText(
    payload.ticketName || payload.ticketId || payload.ticket_type || "Ticket Reservation",
    120,
  );

  return {
    fullName: fallbackName,
    email: normalizeEmail(payload.email),
    phone: sanitizeOptionalText(payload.phone, 30),
    promo: sanitizeOptionalText(payload.promo, 40),
    items: [
      {
        id: fallbackTicketId,
        name: fallbackTicketName,
        quantity: payload.quantity || 1,
      },
    ],
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

async function insertReservationRows(
  input: ReservationInput,
  origin: string | null,
) {
  const supabase = createAdminClient();

  const standardRows = input.items.map((item) => ({
    email: input.email,
    full_name: input.fullName,
    ticket_type: item.id,
    quantity: item.quantity,
    promo: input.promo,
    status: "pending",
  }));

  const standardResult = await supabase.from("reservations").insert(standardRows);

  if (!standardResult.error) {
    return standardResult;
  }

  if (!isSupabaseMissingColumnError(standardResult.error)) {
    return standardResult;
  }

  const minimalRows = input.items.map((item) => ({
    email: input.email,
    ticket_type: item.id,
    promo: input.promo,
    status: "pending",
  }));

  const fallbackResult = await supabase.from("reservations").insert(minimalRows);

  if (fallbackResult.error) {
    console.error("Reservation compatibility insert failed", {
      origin,
      standardError: standardResult.error,
      fallbackError: fallbackResult.error,
    });
  }

  return fallbackResult;
}

export async function POST(request: NextRequest) {
  try {
    const payload = reservationSchema.parse(await request.json());
    const reservationInput = normalizeReservationInput(payload);
    const origin = request.headers.get("origin");
    const { error } = await insertReservationRows(reservationInput, origin);

    if (error) {
      if (isBackupEligibleSupabaseError(error)) {
        const backupSent = await sendReservationBackup(reservationInput);

        if (backupSent) {
          return jsonResponse(
            {
              message:
                "Reservation received through the backup channel. Continue to the official ticket page to complete purchase.",
            },
            {
              status: 201,
              origin,
            },
          );
        }

        if (isMissingSupabaseTableError(error)) {
          return errorResponse(
            "Reservations table is missing. Run the latest Supabase schema before saving reservations.",
            500,
            {
              origin,
            },
          );
        }

        return errorResponse(
          "Supabase connection failed. Check NEXT_PUBLIC_SUPABASE_URL and confirm the project is active.",
          500,
          {
            origin,
          },
        );
      }

      if (isMissingSupabaseTableError(error)) {
        return errorResponse(
          "Reservations table is missing. Run the latest Supabase schema before saving reservations.",
          500,
          {
            origin,
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
        origin,
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
