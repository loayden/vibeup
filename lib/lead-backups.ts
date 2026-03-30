import { createAdminClient } from "@/lib/supabase-server";
import { isSupabaseMissingColumnError } from "@/lib/supabase-errors";
import {
  normalizeEmail,
  normalizeSlug,
  sanitizeMultilineText,
  sanitizeText,
} from "@/lib/utils";

type LeadBackupInput = {
  category: "application" | "enquiry";
  email: string;
  fullName: string;
  title: string;
  details: string;
};

export async function saveLeadBackupToReservations(input: LeadBackupInput) {
  const supabase = createAdminClient();
  const ticketType = `${input.category}:${normalizeSlug(input.title || input.fullName) || input.category}`.slice(
    0,
    100,
  );
  const promo = sanitizeMultilineText(input.details, 2000);
  const status = `backup_${input.category}`.slice(0, 50);

  const candidateRows = [
    {
      email: normalizeEmail(input.email),
      full_name: sanitizeText(input.fullName, 100),
      name: sanitizeText(input.title, 120),
      ticket_type: ticketType,
      promo,
      status,
      quantity: 1,
    },
    {
      email: normalizeEmail(input.email),
      full_name: sanitizeText(input.fullName, 100),
      ticket_type: ticketType,
      promo,
      status,
      quantity: 1,
    },
    {
      email: normalizeEmail(input.email),
      full_name: sanitizeText(input.fullName, 100),
      ticket_type: ticketType,
      promo,
      status,
    },
    {
      email: normalizeEmail(input.email),
      ticket_type: ticketType,
      promo,
      status,
    },
  ];

  let lastError: unknown = null;

  for (const row of candidateRows) {
    const { error } = await supabase.from("reservations").insert(row);

    if (!error) {
      return { success: true as const };
    }

    lastError = error;

    if (!isSupabaseMissingColumnError(error)) {
      return { success: false as const, error };
    }
  }

  return { success: false as const, error: lastError };
}
