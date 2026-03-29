import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse, noContentResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import {
  normalizeSlug,
  sanitizeMultilineText,
  sanitizeOptionalText,
  sanitizeText,
} from "@/lib/utils";
import type { TableInsert, TableUpdate } from "@/types/database";

const ticketTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().nonnegative(),
  original_price: z.number().nonnegative().optional().nullable(),
  currency: z.string().min(3).max(3).default("USD"),
  color: z.string().max(32).optional().nullable(),
  badge: z.string().max(60).optional().nullable(),
  max_quantity: z.number().int().positive().optional().nullable(),
  min_per_order: z.number().int().positive().default(1),
  max_per_order: z.number().int().positive().default(10),
  sale_starts_at: z.string().optional().nullable(),
  sale_ends_at: z.string().optional().nullable(),
  includes: z.array(z.string().max(140)).default([]),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

const updateEventSchema = z.object({
  slug: z.string().max(140).optional(),
  title: z.string().min(2).max(200).optional(),
  subtitle: z.string().max(200).optional().nullable(),
  description: z.string().max(12000).optional().nullable(),
  short_description: z.string().max(1000).optional().nullable(),
  venue_name: z.string().min(2).max(200).optional(),
  venue_address: z.string().max(300).optional().nullable(),
  venue_city: z.string().max(100).optional(),
  venue_state: z.string().max(100).optional(),
  venue_country: z.string().max(100).optional(),
  venue_lat: z.number().optional().nullable(),
  venue_lng: z.number().optional().nullable(),
  event_date: z.string().optional(),
  doors_open: z.string().optional().nullable(),
  event_end: z.string().optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
  gallery_urls: z.array(z.string().url()).optional(),
  video_url: z.string().url().optional().nullable(),
  category: z
    .enum([
      "gala",
      "concert",
      "cultural",
      "corporate",
      "private",
      "festival",
      "rooftop",
      "other",
    ])
    .optional(),
  status: z
    .enum(["draft", "published", "sold_out", "cancelled", "completed"])
    .optional(),
  featured: z.boolean().optional(),
  max_capacity: z.number().int().positive().optional().nullable(),
  age_restriction: z.number().int().min(0).optional(),
  dress_code: z.string().max(120).optional().nullable(),
  parking_info: z.string().max(500).optional().nullable(),
  additional_info: z.string().max(4000).optional().nullable(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(300).optional().nullable(),
  external_ticket_url: z.string().url().optional().nullable(),
  ticket_types: z.array(ticketTypeSchema).optional(),
});

function toIsoString(value: string) {
  return new Date(value).toISOString();
}

function toNullableIsoString(value: string | null | undefined) {
  return value ? toIsoString(value) : null;
}

function buildEventUpdatePayload(
  payload: z.infer<typeof updateEventSchema>,
): TableUpdate<"events"> {
  return {
    ...(payload.slug ? { slug: normalizeSlug(payload.slug) } : {}),
    ...(payload.title ? { title: sanitizeText(payload.title, 200) } : {}),
    ...(payload.subtitle !== undefined
      ? { subtitle: sanitizeOptionalText(payload.subtitle, 200) }
      : {}),
    ...(payload.description !== undefined
      ? {
          description: payload.description
            ? sanitizeMultilineText(payload.description, 12000)
            : null,
        }
      : {}),
    ...(payload.short_description !== undefined
      ? {
          short_description: sanitizeOptionalText(
            payload.short_description,
            1000,
          ),
        }
      : {}),
    ...(payload.venue_name
      ? { venue_name: sanitizeText(payload.venue_name, 200) }
      : {}),
    ...(payload.venue_address !== undefined
      ? { venue_address: sanitizeOptionalText(payload.venue_address, 300) }
      : {}),
    ...(payload.venue_city
      ? { venue_city: sanitizeText(payload.venue_city, 100) }
      : {}),
    ...(payload.venue_state
      ? { venue_state: sanitizeText(payload.venue_state, 100) }
      : {}),
    ...(payload.venue_country
      ? { venue_country: sanitizeText(payload.venue_country, 100) }
      : {}),
    ...(payload.venue_lat !== undefined ? { venue_lat: payload.venue_lat } : {}),
    ...(payload.venue_lng !== undefined ? { venue_lng: payload.venue_lng } : {}),
    ...(payload.event_date ? { event_date: toIsoString(payload.event_date) } : {}),
    ...(payload.doors_open !== undefined
      ? { doors_open: toNullableIsoString(payload.doors_open) }
      : {}),
    ...(payload.event_end !== undefined
      ? { event_end: toNullableIsoString(payload.event_end) }
      : {}),
    ...(payload.cover_image_url !== undefined
      ? { cover_image_url: payload.cover_image_url || null }
      : {}),
    ...(payload.gallery_urls ? { gallery_urls: payload.gallery_urls } : {}),
    ...(payload.video_url !== undefined
      ? { video_url: payload.video_url || null }
      : {}),
    ...(payload.category ? { category: payload.category } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.featured !== undefined ? { featured: payload.featured } : {}),
    ...(payload.max_capacity !== undefined
      ? { max_capacity: payload.max_capacity }
      : {}),
    ...(payload.age_restriction !== undefined
      ? { age_restriction: payload.age_restriction }
      : {}),
    ...(payload.dress_code !== undefined
      ? { dress_code: sanitizeOptionalText(payload.dress_code, 120) }
      : {}),
    ...(payload.parking_info !== undefined
      ? { parking_info: sanitizeOptionalText(payload.parking_info, 500) }
      : {}),
    ...(payload.additional_info !== undefined
      ? {
          additional_info: payload.additional_info
            ? sanitizeMultilineText(payload.additional_info, 4000)
            : null,
        }
      : {}),
    ...(payload.seo_title !== undefined
      ? { seo_title: sanitizeOptionalText(payload.seo_title, 200) }
      : {}),
    ...(payload.seo_description !== undefined
      ? { seo_description: sanitizeOptionalText(payload.seo_description, 300) }
      : {}),
    ...(payload.external_ticket_url !== undefined
      ? { external_ticket_url: payload.external_ticket_url || null }
      : {}),
  };
}

function buildTicketTypePayload(
  eventId: string,
  payload: z.infer<typeof ticketTypeSchema>,
): TableInsert<"ticket_types"> {
  return {
    ...(payload.id ? { id: payload.id } : {}),
    event_id: eventId,
    name: sanitizeText(payload.name, 120),
    description: payload.description
      ? sanitizeMultilineText(payload.description, 2000)
      : null,
    price: payload.price,
    original_price: payload.original_price || null,
    currency: sanitizeText(payload.currency, 3).toUpperCase(),
    color: sanitizeOptionalText(payload.color, 32),
    badge: sanitizeOptionalText(payload.badge, 60),
    max_quantity: payload.max_quantity || null,
    min_per_order: payload.min_per_order,
    max_per_order: payload.max_per_order,
    sale_starts_at: toNullableIsoString(payload.sale_starts_at),
    sale_ends_at: toNullableIsoString(payload.sale_ends_at),
    includes: payload.includes.map((item) => sanitizeText(item, 140)),
    is_visible: payload.is_visible,
    sort_order: payload.sort_order,
  };
}

export async function PUT(
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
    const payload = updateEventSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: existingEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingEvent) {
      return errorResponse("Event not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const updatePayload = buildEventUpdatePayload(payload);
    const { data: event, error } = await supabase
      .from("events")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !event) {
      return errorResponse(error?.message || "Failed to update event", 400, {
        origin: request.headers.get("origin"),
      });
    }

    if (payload.ticket_types) {
      const { data: currentTicketTypes, error: currentTicketTypesError } =
        await supabase.from("ticket_types").select("id").eq("event_id", id);

      if (currentTicketTypesError) {
        throw currentTicketTypesError;
      }

      const currentTicketTypeIds = new Set(
        (currentTicketTypes || []).map((ticketType) => ticketType.id),
      );

      const ticketPayload = payload.ticket_types.map((ticketType) =>
        buildTicketTypePayload(id, ticketType),
      );

      const persistedTicketPayload = ticketPayload.filter(
        (ticketType): ticketType is TableInsert<"ticket_types"> & { id: string } =>
          Boolean(ticketType.id),
      );
      const newTicketPayload = ticketPayload.filter((ticketType) => !ticketType.id);

      const invalidTicketTypeIds = persistedTicketPayload
        .map((ticketType) => ticketType.id)
        .filter((ticketTypeId) => !currentTicketTypeIds.has(ticketTypeId));

      if (invalidTicketTypeIds.length > 0) {
        return errorResponse("Invalid ticket type payload for this event", 400, {
          origin: request.headers.get("origin"),
        });
      }

      if (persistedTicketPayload.length > 0) {
        const { error: upsertError } = await supabase
          .from("ticket_types")
          .upsert(persistedTicketPayload, { onConflict: "id" });

        if (upsertError) {
          throw upsertError;
        }
      }

      if (newTicketPayload.length > 0) {
        const { error: insertError } = await supabase
          .from("ticket_types")
          .insert(newTicketPayload);

        if (insertError) {
          throw insertError;
        }
      }

      const retainedIds = persistedTicketPayload
        .map((ticketType) => ticketType.id)
        .filter((ticketTypeId): ticketTypeId is string => Boolean(ticketTypeId));

      const idsToDelete = (currentTicketTypes || [])
        .map((ticketType) => ticketType.id)
        .filter((ticketTypeId) => !retainedIds.includes(ticketTypeId));

      if (idsToDelete.length > 0) {
        await supabase.from("ticket_types").delete().in("id", idsToDelete);
      }
    }

    const { data: ticketTypes } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", id)
      .order("sort_order", { ascending: true });

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "update",
      resourceType: "event",
      resourceId: id,
      oldData: existingEvent,
      newData: { ...event, ticket_types: ticketTypes || [] },
    });

    return jsonResponse(
      {
        event: {
          ...event,
          ticket_types: ticketTypes || [],
        },
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to update event");
  }
}

export async function DELETE(
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
    const supabase = createAdminClient();

    const { data: existingEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingEvent) {
      return errorResponse("Event not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      return errorResponse(error.message, 400, {
        origin: request.headers.get("origin"),
      });
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "delete",
      resourceType: "event",
      resourceId: id,
      oldData: existingEvent,
    });

    return noContentResponse({
      origin: request.headers.get("origin"),
    });
  } catch (error) {
    return handleRouteError(request, error, "Unable to delete event");
  }
}
