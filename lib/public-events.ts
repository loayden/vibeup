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
  dressCode: string | null;
  parkingInfo: string | null;
  ageRestriction: number;
  additionalInfo: string | null;
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
  degraded: boolean;
  degraded_message: string | null;
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

function isPastIsoDate(value: string) {
  return new Date(value).getTime() < Date.now();
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
      "A premium ZOYA experience shaped around hospitality, entertainment, and room energy.",
    shortDescription:
      event.short_description ||
      event.description ||
      "A premium ZOYA experience shaped around hospitality, entertainment, and room energy.",
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
    dressCode: event.dress_code,
    parkingInfo: event.parking_info,
    ageRestriction: event.age_restriction || 0,
    additionalInfo: event.additional_info,
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
  const eventState = isPastIsoDate(event.isoDate)
    ? ("past" as const)
    : event.status === "limited"
      ? ("limited" as const)
      : ("upcoming" as const);

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
    eventState,
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
    dressCode: "Formal evening wear",
    parkingInfo: "Guest parking details are shared before arrival.",
    ageRestriction: 0,
    additionalInfo: null,
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
    dressCode: null,
    parkingInfo: null,
    ageRestriction: 0,
    additionalInfo: null,
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
    throw new Error("Live event inventory is unavailable because Supabase admin access is not configured.");
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
    throw error || new Error("Live event inventory is currently unavailable.");
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
    degraded: false,
    degraded_message: null,
  };
}

export const getPublicEventsFeed = cache(async (): Promise<PublicEventsFeed> => {
  let degradedMessage: string | null = null;

  try {
    const databaseFeed = await fetchDatabaseEvents();

    if (databaseFeed) {
      return databaseFeed;
    }
  } catch (error) {
    console.warn("Falling back to static public event data", error);
    degradedMessage =
      error instanceof Error && error.message
        ? `${error.message} Public pages are showing a curated fallback schedule instead of the live event catalog.`
        : "Live event inventory is unavailable, so public pages are showing a curated fallback schedule instead of the real-time catalog.";
  }

  const fallbackEvents = UPCOMING_EVENTS.map((event, index) =>
    buildFallbackEventFromUpcoming(event, { featured: index === 0 }),
  );
  const upcoming = fallbackEvents.filter((event) => event.eventState !== "past");
  const past = buildFallbackPastEvents();
  const featured =
    upcoming.find((event) => event.featured) ||
    upcoming[0] ||
    fallbackEvents.find((event) => event.featured) ||
    fallbackEvents[0] ||
    null;
  const nextEvent = upcoming[0] || null;

  return {
    upcoming,
    past: [...fallbackEvents.filter((event) => event.eventState === "past"), ...past],
    featured,
    nextEvent,
    source: "fallback",
    degraded: true,
    degraded_message:
      degradedMessage ||
      "Live event inventory is unavailable, so public pages are showing a curated fallback schedule instead of the real-time catalog.",
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
  const feed = await getPublicEventsFeed();
  const catalog = [...feed.upcoming, ...feed.past];
  return catalog.find((event) => event.slug === slug) || null;
});

export async function getCheckoutPageContext(slug?: string | null) {
  const feed = await getPublicEventsFeed();
  const catalog = [...feed.upcoming, ...feed.past];
  const availableEvents = feed.upcoming.filter(
    (event) => event.eventState !== "cancelled" && event.eventState !== "past",
  );
  const selectedEvent =
    (slug ? catalog.find((event) => event.slug === slug) : null) ||
    availableEvents.find((event) => event.ticketsAvailable) ||
    availableEvents[0] ||
    feed.featured ||
    null;

  return {
    feed,
    event: selectedEvent,
    availableEvents,
    requestedSlug: slug || null,
    selectionMissing: Boolean(slug) && !catalog.some((event) => event.slug === slug),
  };
}

export function getTrustMessagingForEvent(
  event: PublicEvent | null,
  options?: { degraded?: boolean; degradedMessage?: string | null },
) {
  if (options?.degraded) {
    return [
      options.degradedMessage ||
        "Live event inventory is unavailable, so the public experience is operating in a clearly marked fallback mode.",
      "Ticket purchases are blocked when the live catalog is unavailable, so guests are not sent into an unreliable payment path.",
      "Use the contact and waitlist actions instead of directing guests into checkout until the live catalog is restored.",
    ];
  }

  if (!event || !event.ticketsAvailable || !event.id) {
    return [
      "Ticketing is temporarily unavailable until live event inventory is restored.",
      "ZOYA only opens first-party Stripe checkout when the live event catalog is healthy and inventory is available.",
      "If the event is currently unavailable, use the waitlist or support actions instead of pushing guests into a broken payment flow.",
    ];
  }

  return [
    "Card payment is completed through Stripe Checkout while the order stays inside the ZOYA system.",
    "Confirmation email and QR tickets are issued only after Stripe confirms a successful payment.",
    "Ticket availability, sold-out states, and order totals are calculated from live event inventory.",
  ];
}

export function getCheckoutUnavailableMessage(options?: {
  degraded?: boolean;
  eventTitle?: string | null;
}) {
  if (options?.degraded) {
    return `Live ticket inventory is unavailable right now. ${options.eventTitle ? `${options.eventTitle} is being shown from fallback schedule data,` : "The event catalog"} so checkout stays closed until the database or payment environment is restored. Contact ${SITE.email} for concierge help.`;
  }

  return `Live ticket inventory is unavailable right now. Contact ${SITE.email} while the event database or payment environment is being restored.`;
}
