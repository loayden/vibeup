import "server-only";

import { createAdminClient } from "@/lib/supabase-server";
import { normalizeEmail } from "@/lib/utils";
import type { AuthProfile } from "@/lib/auth";
import type { TableRow } from "@/types/database";

type PromoValidationInput = {
  code: string;
  eventId: string;
  subtotal: number;
  ticketTypeIds?: string[];
};

export async function validatePromoCode(input: PromoValidationInput) {
  const supabase = createAdminClient();
  const code = input.code.trim().toUpperCase();

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error || !promo) {
    return { valid: false, message: "Invalid promo code" as const };
  }

  if (promo.valid_from && new Date(promo.valid_from) > new Date()) {
    return { valid: false, message: "Promo code is not active yet" as const };
  }

  if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
    return { valid: false, message: "Promo code expired" as const };
  }

  if (promo.max_uses && promo.used_count >= promo.max_uses) {
    return { valid: false, message: "Promo code limit reached" as const };
  }

  if (input.subtotal < promo.min_order_amount) {
    return {
      valid: false,
      message: `Minimum order amount is ${promo.min_order_amount}`,
    } as const;
  }

  if (
    promo.applicable_event_ids.length > 0 &&
    !promo.applicable_event_ids.includes(input.eventId)
  ) {
    return { valid: false, message: "Code is not valid for this event" as const };
  }

  if (
    input.ticketTypeIds &&
    input.ticketTypeIds.length > 0 &&
    promo.applicable_ticket_type_ids.length > 0 &&
    !input.ticketTypeIds.some((ticketTypeId) =>
      promo.applicable_ticket_type_ids.includes(ticketTypeId),
    )
  ) {
    return {
      valid: false,
      message: "Code is not valid for the selected tickets",
    } as const;
  }

  const discountAmount =
    promo.discount_type === "percentage"
      ? Number((input.subtotal * (promo.discount_value / 100)).toFixed(2))
      : Number(Math.min(promo.discount_value, input.subtotal).toFixed(2));

  return {
    valid: true,
    promo,
    discountAmount,
  } as const;
}

export async function getOrderWithRelationsByNumber(orderNumber: string) {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        events (
          id,
          title,
          event_date,
          venue_name,
          venue_address
        ),
        order_items (*),
        tickets (*)
      `,
    )
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    throw error;
  }

  return order;
}

export function canAccessOrder(
  order: TableRow<"orders">,
  profile: AuthProfile | null,
  email?: string | null,
) {
  if (profile && ["admin", "super_admin"].includes(profile.role)) {
    return true;
  }

  if (profile?.id && order.user_id && order.user_id === profile.id) {
    return true;
  }

  if (profile?.email && normalizeEmail(profile.email) === normalizeEmail(order.customer_email)) {
    return true;
  }

  if (email && normalizeEmail(email) === normalizeEmail(order.customer_email)) {
    return true;
  }

  return false;
}
