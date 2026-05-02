import "server-only";

import { cache } from "react";
import { format } from "date-fns";

import { tryCreateAdminClient } from "@/lib/supabase-server";
import {
  FEATURED_EVENT,
  PAST_EVENTS,
  SITE,
  TICKET_TYPES,
  UPCOMING_EVENTS,
} from "@/lib/site-data";
import { toNumber } from "@/lib/utils";
import type { TableRow } from "@/types/database";

type EventRow = TableRow<"events">;
type TicketTypeRow = TableRow<"ticket_types">;

export type PublicTicketType = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  color: string;
  badge: string | null;
  maxQuantity: number | null;
  soldQuantity: number;
  remainingQuantity: number | null;
  minPerOrder: number;
  maxPerOrder: number;
  includes: string[];
  isSoldOut: boolean;
};

export type PublicEvent = {
  id: string | null;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  shortDescription: string;
  venueName: string;
  venueAddress: string | null;
  venueCity: string;
  venueState: string | null;
  venueCountry: string | null;
  eventDate: string;
  doorsOpen: string | null;
  eventEnd: string | null;
  coverImageUrl: string;
  category: EventRow["category"];
  dbStatus: EventRow["status"];
  eventState: "upcoming" | "limited" | "sold_out" | "past" | "cancelled";
  featured: boolean;
  maxCapacity: number | null;
  currentAttendees: number;
  priceFrom: number;
  priceTo: number;
  ticketTypes: PublicTicketType[];
  externalTicketUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  galleryUrls: string[];
  formattedDate: string;
  shortVenue: string;
  cityLine: string;
  countdownIso: string;
  ticketsAvailable: boolean;
};

export type PublicEventsFeed = {
  upcoming: PublicEvent[];
  past: PublicEvent[];
  featured: PublicEvent | null;
  nextEvent: PublicEvent | null;
  source: "database" | "fallback";
};

const fallbackTicketColors = [
  "rgba(214,75,75,0.72)",
  "rgba(77,121,214,0.72)",
  "rgba(74,177,112,0.72)",
  "rgba(211,183,75,0.72)",
  "rgba(136,91,214,0.72)",
  "rgba(77,192,182,0.72)",
];

function formatEventDate(value: string) {
  return format(new Date(value), "MMMM d, yyyy");
}

function formatEventState(event: EventRow, ticketTypes: PublicTicketType[]) {
  if (event.status === "cancelled") {
    return "cancelled" as const;
  }

  if (event.status === "sold_out") {
    return "sold_out" as const;
  }

  if (new Date(event.event_date) < new Date()) {
    return "past" as const;
  }

  const remainingAcrossVisibleTiers = ticketTypes.reduce((sum, ticketType) => {
    if (ticketType.remainingQuantity == null) {
      return sum;
    }

    return sum + ticketType.remainingQuantity;
  }, 0);

  if (ticketTypes.length > 0 && ticketTypes.every((ticketType) => ticketType.isSoldOut)) {
    return "sold_out" as const;
  }

  if (remainingAcrossVisibleTiers > 0 && remainingAcrossVisibleTiers <= 25) {
    return "limited" as const;
  }

  if (
    event.max_capacity &&
    event.current_attendees > 0 &&
    event.max_capacity - event.current_attendees <= 25
  ) {
    return "limited" as const;
  }

  return "upcoming" as const;
}

function mapTicketType(ticketType: TicketTypeRow, colorFallback: string): PublicTicketType {
  const remainingQuantity =
    ticketType.max_quantity != null
      ? Math.max(ticketType.max_quantity - ticketType.sold_quantity, 0)
      : null;

  return {
    id: ticketType.id,
    name: ticketType.name,
    description: ticketType.description || "Curated access to the evening.",
    price: toNumber(ticketType.price),
    originalPrice: ticketType.original_price ? toNumber(ticketType.original_price) : null,
    currency: ticketType.currency || "USD",
    color: ticketType.color || colorFallback,
    badge: ticketType.badge,
    maxQuantity: ticketType.max_quantity,
    soldQuantity: ticketType.sold_quantity,
    remainingQuantity,
    minPerOrder: ticketType.min_per_order,
    maxPerOrder: ticketType.max_per_order,
    includes: ticketType.includes || [],
    isSoldOut: remainingQuantity != null ? remainingQuantity <= 0 : false,
  };
}

function mapEvent(event: EventRow, ticketTypes: TicketTypeRow[]): PublicEvent {
  const publicTicketTypes = ticketTypes.map((ticketType, index) =>
    mapTicketType(ticketType, fallbackTicketColors[index % fallbackTicketColors.length]),
  );
  const pricePoints = publicTicketTypes.map((ticketType) => ticketType.price).filter(Boolean);
  const priceFrom = pricePoints.length ? Math.min(...pricePoints) : 0;
  const priceTo = pricePoints.length ? Math.max(...pricePoints) : 0;
  const venueCity = event.venue_city || "Los Angeles";
  const venueState = event.venue_state || "CA";
  const coverImageUrl = event.cover_image_url || FEATURED_EVENT.image;

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    description:
      event.description ||
      event.short_description ||
      "A premium VibeUp experience shaped around hospitality, entertainment, and room energy.",
    shortDescription:
      event.short_description ||
      event.description ||
      "A premium VibeUp experience shaped around hospitality, entertainment, and room energy.",
    venueName: event.venue_name,
    venueAddress: event.venue_address,
    venueCity,
    venueState,
    venueCountry: event.venue_country || "US",
    eventDate: event.event_date,
    doorsOpen: event.doors_open,
    eventEnd: event.event_end,
    coverImageUrl,
    category: event.category,
    dbStatus: event.status,
    eventState: formatEventState(event, publicTicketTypes),
    featured: event.featured,
    maxCapacity: event.max_capacity,
    currentAttendees: event.current_attendees,
    priceFrom,
    priceTo,
    ticketTypes: publicTicketTypes,
    externalTicketUrl: event.external_ticket_url,
    seoTitle: event.seo_title,
    seoDescription: event.seo_description,
    galleryUrls: event.gallery_urls || [],
    formattedDate: formatEventDate(event.event_date),
    shortVenue: event.venue_name,
    cityLine: `${venueCity}, ${venueState}`,
    countdownIso: event.event_date,
    ticketsAvailable:
      event.status === "published" &&
      publicTicketTypes.length > 0 &&
      publicTicketTypes.some((ticketType) => !ticketType.isSoldOut),
  };
}

function buildFallbackTicketTypes(): PublicTicketType[] {
  return TICKET_TYPES.map((ticketType) => ({
    id: ticketType.id,
    name: ticketType.name,
    description: ticketType.description,
    price: ticketType.price,
    originalPrice: null,
    currency: "USD",
    color: ticketType.color,
    badge: ticketType.badge,
    maxQuantity: null,
    soldQuantity: 0,
    remainingQuantity: null,
    minPerOrder: 1,
    maxPerOrder: 10,
    includes: [],
    isSoldOut: false,
  }));
}

function buildFallbackEventFromUpcoming(
  event: (typeof UPCOMING_EVENTS)[number],
  options?: { featured?: boolean },
): PublicEvent {
  const ticketTypes = buildFallbackTicketTypes();

  return {
    id: null,
    slug: event.slug,
    title: event.title,
    subtitle: null,
    description: event.summary,
    shortDescription: event.summary,
    venueName: event.venue,
    venueAddress: null,
    venueCity: event.city.split(",")[0]?.trim() || "Los Angeles",
    venueState: event.city.split(",")[1]?.trim() || "CA",
    venueCountry: "US",
    eventDate: event.isoDate,
    doorsOpen: null,
    eventEnd: null,
    coverImageUrl: event.image,
    category: "cultural",
    dbStatus: "published",
    eventState: event.status === "limited" ? "limited" : "upcoming",
    featured: options?.featured || false,
    maxCapacity: null,
    currentAttendees: 0,
    priceFrom: event.priceFrom,
    priceTo: Math.max(event.priceFrom, ...ticketTypes.map((ticketType) => ticketType.price)),
    ticketTypes,
    externalTicketUrl: null,
    seoTitle: null,
    seoDescription: null,
    galleryUrls: [],
    formattedDate: event.date,
    shortVenue: event.venue,
    cityLine: event.city,
    countdownIso: event.isoDate,
    ticketsAvailable: false,
  };
}

function buildFallbackPastEvents(): PublicEvent[] {
  return PAST_EVENTS.map((event) => ({
    id: null,
    slug: event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: event.title,
    subtitle: null,
    description: event.summary,
    shortDescription: event.summary,
    venueName: event.venue,
    venueAddress: null,
    venueCity: "Los Angeles",
    venueState: "CA",
    venueCountry: "US",
    eventDate: `${event.date} 20:00:00`,
    doorsOpen: null,
    eventEnd: null,
    coverImageUrl: event.image,
    category: "other",
    dbStatus: "completed",
    eventState: "past",
    featured: false,
    maxCapacity: null,
    currentAttendees: 0,
    priceFrom: 0,
    priceTo: 0,
    ticketTypes: [],
    externalTicketUrl: null,
    seoTitle: null,
    seoDescription: null,
    galleryUrls: [],
    formattedDate: event.date,
    shortVenue: event.venue,
    cityLine: "Los Angeles, CA",
    countdownIso: new Date().toISOString(),
    ticketsAvailable: false,
  }));
}

async function fetchDatabaseEvents(): Promise<PublicEventsFeed | null> {
  const supabase = tryCreateAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
        *,
        ticket_types (*)
      `,
    )
    .in("status", ["published", "sold_out", "completed"])
    .order("event_date", { ascending: true });

  if (error || !events) {
    return null;
  }

  const mappedEvents = events.map((event) =>
    mapEvent(
      event,
      ((event.ticket_types || []) as TicketTypeRow[])
        .filter((ticketType) => ticketType.is_visible)
        .sort((left, right) => left.sort_order - right.sort_order),
    ),
  );

  const upcoming = mappedEvents.filter((event) =>
    ["upcoming", "limited", "sold_out"].includes(event.eventState),
  );
  const past = mappedEvents.filter((event) => event.eventState === "past");
  const featured =
    upcoming.find((event) => event.featured) ||
    upcoming[0] ||
    mappedEvents.find((event) => event.featured) ||
    null;
  const nextEvent =
    upcoming.find((event) => event.eventState !== "sold_out") ||
    upcoming[0] ||
    null;

  return {
    upcoming,
    past,
    featured,
    nextEvent,
    source: "database",
  };
}

export const getPublicEventsFeed = cache(async (): Promise<PublicEventsFeed> => {
  try {
    const databaseFeed = await fetchDatabaseEvents();

    if (databaseFeed) {
      return databaseFeed;
    }
  } catch (error) {
    console.warn("Falling back to static public event data", error);
  }

  const upcoming = UPCOMING_EVENTS.map((event, index) =>
    buildFallbackEventFromUpcoming(event, { featured: index === 0 }),
  );
  const past = buildFallbackPastEvents();
  const featured = upcoming[0] || buildFallbackEventFromUpcoming(UPCOMING_EVENTS[0], { featured: true });

  return {
    upcoming,
    past,
    featured,
    nextEvent: upcoming[0] || null,
    source: "fallback",
  };
});

export const getPublicEventBySlug = cache(async (slug: string) => {
  const feed = await getPublicEventsFeed();
  const match =
    feed.upcoming.find((event) => event.slug === slug) ||
    feed.past.find((event) => event.slug === slug);

  return match || null;
});

export const getCheckoutEventContext = cache(async (slug = "arab-nights") => {
  const supabase = tryCreateAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
        *,
        ticket_types (*)
      `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !event) {
    return null;
  }

  const ticketTypes = ((event.ticket_types || []) as TicketTypeRow[])
    .filter((ticketType) => ticketType.is_visible)
    .sort((left, right) => left.sort_order - right.sort_order);

  return mapEvent(event, ticketTypes);
});

export function getTrustMessagingForEvent(event: PublicEvent | null) {
  if (!event || !event.ticketsAvailable || !event.id) {
    return [
      "Ticketing is temporarily unavailable until live event inventory is restored.",
      "The checkout is designed for first-party Stripe payment and internal order confirmation.",
      "If live inventory is offline, contact the VibeUp team before sending guests to purchase.",
    ];
  }

  return [
    "Card payment is completed through Stripe Checkout while the order stays inside the VibeUp system.",
    "Confirmation email and QR tickets are issued only after Stripe confirms a successful payment.",
    "Ticket availability, sold-out states, and order totals are calculated from live event inventory.",
  ];
}

export function getCheckoutUnavailableMessage() {
  return `Live ticket inventory is unavailable right now. Contact ${SITE.email} while the event database or payment environment is being restored.`;
}
