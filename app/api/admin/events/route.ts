import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import {
  clamp,
  normalizeSlug,
  parseInteger,
  sanitizeMultilineText,
  sanitizeOptionalText,
  sanitizeText,
} from "@/lib/utils";
import type { TableInsert, TableUpdate } from "@/types/database";

const eventStatusSchema = z.enum([
  "draft",
  "published",
  "sold_out",
  "cancelled",
  "completed",
]);

const eventCategorySchema = z.enum([
  "gala",
  "concert",
  "cultural",
  "corporate",
  "private",
  "festival",
  "rooftop",
  "other",
]);

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

const eventSchema = z.object({
  slug: z.string().max(140).optional(),
  title: z.string().min(2).max(200),
  subtitle: z.string().max(200).optional().nullable(),
  description: z.string().max(12000).optional().nullable(),
  short_description: z.string().max(1000).optional().nullable(),
  venue_name: z.string().min(2).max(200),
  venue_address: z.string().max(300).optional().nullable(),
  venue_city: z.string().max(100).default("Los Angeles"),
  venue_state: z.string().max(100).default("CA"),
  venue_country: z.string().max(100).default("US"),
  venue_lat: z.number().optional().nullable(),
  venue_lng: z.number().optional().nullable(),
  event_date: z.string().min(1),
  doors_open: z.string().optional().nullable(),
  event_end: z.string().optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
  gallery_urls: z.array(z.string().url()).default([]),
  video_url: z.string().url().optional().nullable(),
  category: eventCategorySchema.default("other"),
  status: eventStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  max_capacity: z.number().int().positive().optional().nullable(),
  age_restriction: z.number().int().min(0).default(0),
  dress_code: z.string().max(120).optional().nullable(),
  parking_info: z.string().max(500).optional().nullable(),
  additional_info: z.string().max(4000).optional().nullable(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(300).optional().nullable(),
  external_ticket_url: z.string().url().optional().nullable(),
  ticket_types: z.array(ticketTypeSchema).default([]),
});

function toIsoString(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function buildEventInsertPayload(
  payload: z.infer<typeof eventSchema>,
  createdBy: string,
): TableInsert<"events"> {
  return {
    slug: normalizeSlug(payload.slug || payload.title),
    title: sanitizeText(payload.title, 200),
    subtitle: sanitizeOptionalText(payload.subtitle, 200),
    description: payload.description
      ? sanitizeMultilineText(payload.description, 12000)
      : null,
    short_description: sanitizeOptionalText(payload.short_description, 1000),
    venue_name: sanitizeText(payload.venue_name, 200),
    venue_address: sanitizeOptionalText(payload.venue_address, 300),
    venue_city: sanitizeText(payload.venue_city, 100),
    venue_state: sanitizeText(payload.venue_state, 100),
    venue_country: sanitizeText(payload.venue_country, 100),
    venue_lat: payload.venue_lat || null,
    venue_lng: payload.venue_lng || null,
    event_date: toIsoString(payload.event_date) || new Date().toISOString(),
    doors_open: toIsoString(payload.doors_open),
    event_end: toIsoString(payload.event_end),
    cover_image_url: payload.cover_image_url || null,
    gallery_urls: payload.gallery_urls,
    video_url: payload.video_url || null,
    category: payload.category,
    status: payload.status,
    featured: payload.featured,
    max_capacity: payload.max_capacity || null,
    age_restriction: payload.age_restriction,
    dress_code: sanitizeOptionalText(payload.dress_code, 120),
    parking_info: sanitizeOptionalText(payload.parking_info, 500),
    additional_info: payload.additional_info
      ? sanitizeMultilineText(payload.additional_info, 4000)
      : null,
    seo_title: sanitizeOptionalText(payload.seo_title, 200),
    seo_description: sanitizeOptionalText(payload.seo_description, 300),
    external_ticket_url: payload.external_ticket_url || null,
    created_by: createdBy,
  };
}

function buildTicketTypePayload(
  eventId: string,
  payload: z.infer<typeof ticketTypeSchema>,
): TableInsert<"ticket_types"> | TableUpdate<"ticket_types"> {
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
    sale_starts_at: toIsoString(payload.sale_starts_at),
    sale_ends_at: toIsoString(payload.sale_ends_at),
    includes: payload.includes.map((item) => sanitizeText(item, 140)),
    is_visible: payload.is_visible,
    sort_order: payload.sort_order,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = clamp(parseInteger(searchParams.get("limit"), 20), 1, 100);
    const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
    const supabase = createAdminClient();

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("event_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      const parsedStatus = eventStatusSchema.safeParse(status);

      if (!parsedStatus.success) {
        return errorResponse("Invalid status filter", 400, {
          origin: request.headers.get("origin"),
        });
      }

      query = query.eq("status", parsedStatus.data);
    }

    if (search) {
      query = query.ilike("title", `%${sanitizeText(search, 100)}%`);
    }

    const { data: events, error, count } = await query;

    if (error) {
      throw error;
    }

    return jsonResponse(
      {
        events: events || [],
        total: count || 0,
        has_more: count ? offset + limit < count : false,
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to fetch admin events");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const payload = eventSchema.parse(await request.json());
    const supabase = createAdminClient();
    const eventInsert = buildEventInsertPayload(payload, authResult.user.id);

    const { data: event, error } = await supabase
      .from("events")
      .insert(eventInsert)
      .select("*")
      .single();

    if (error || !event) {
      return errorResponse(error?.message || "Failed to create event", 400, {
        origin: request.headers.get("origin"),
      });
    }

    if (payload.ticket_types.length > 0) {
      const ticketPayload = payload.ticket_types.map((ticketType) =>
        buildTicketTypePayload(event.id, ticketType),
      );

      const { error: ticketError } = await supabase
        .from("ticket_types")
        .insert(ticketPayload as TableInsert<"ticket_types">[]);

      if (ticketError) {
        throw ticketError;
      }
    }

    const { data: ticketTypes } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order", { ascending: true });

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "create",
      resourceType: "event",
      resourceId: event.id,
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
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to create event");
  }
}
