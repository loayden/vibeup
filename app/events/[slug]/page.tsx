import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import Image from "next/image";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { StickyBuyCTA } from "@/components/site/sticky-buy-cta";
import { getPublicEventBySlug, getPublicEventsFeed } from "@/lib/public-events";
import { SITE } from "@/lib/site-data";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const detailFallbacks: Record<
  string,
  {
    overview: string;
    flow: Array<{ title: string; body: string }>;
    highlights: string[];
    venueNotes: Array<{ label: string; value: string }>;
    faqs: Array<{ question: string; answer: string }>;
  }
> = {
  "arab-nights": {
    overview:
      "Arab Nights is one of ZOYA's signature cultural productions: a premium social evening where ceremony, hospitality, music, and room energy are paced deliberately to create a strong emotional build throughout the night.",
    flow: [
      {
        title: "Arrival",
        body: "Guest check-in, early hospitality, editorial photo moments, and a premium first impression from the moment doors open.",
      },
      {
        title: "Dining",
        body: "Guests settle into table service, social conversation, and a calmer opening atmosphere before the room shifts toward headline programming.",
      },
      {
        title: "Performance",
        body: "The live performance anchors the night with a cinematic emotional peak, supported by sound, lighting, and coordinated room flow.",
      },
      {
        title: "Finale",
        body: "The late-night sequence lifts energy again with DJ direction, premium social momentum, and a more open celebratory room tempo.",
      },
    ],
    highlights: [
      "Refined red-carpet arrival and guest reception",
      "Premium hospitality and luxury seating tiers",
      "Live headline performance with cinematic production support",
      "Elegant room styling and controlled atmosphere pacing",
    ],
    venueNotes: [
      { label: "Dress Code", value: "Formal evening wear or elevated cultural glamour" },
      { label: "Doors Open", value: "Guests are encouraged to arrive 45 minutes early" },
      { label: "Venue", value: SITE.venue },
      { label: "Parking", value: "Valet and hotel self-parking details are confirmed before show night" },
    ],
    faqs: [
      {
        question: "When should I arrive?",
        answer:
          "Plan to arrive 30 to 45 minutes before the headline program so check-in, seating, and hospitality flow feel relaxed.",
      },
      {
        question: "How do tickets arrive?",
        answer:
          "QR tickets are issued only after payment clears successfully. They are delivered by email and tied to the order record.",
      },
      {
        question: "What if I need help on the day of the event?",
        answer:
          "Use the ZOYA support contacts on your confirmation email or reach the team directly through the contact page or WhatsApp.",
      },
    ],
  },
};

function buildDefaultDetail(event: NonNullable<Awaited<ReturnType<typeof getPublicEventBySlug>>>) {
  return {
    overview: event.description,
    flow: [
      {
        title: "Arrival",
        body:
          "Guest check-in, welcome support, and early hospitality are paced to make the first impression feel calm, premium, and deliberate.",
      },
      {
        title: "Dining",
        body:
          "Table service and guest seating are structured around comfort, visibility, and a clean transition into the headline portion of the event.",
      },
      {
        title: "Performance",
        body:
          "The main program is timed to lift the room, keep sightlines clear, and protect the emotional peak of the night.",
      },
      {
        title: "Close",
        body:
          "The final sequence keeps energy high while exit flow, guest movement, and event close remain controlled.",
      },
    ],
    highlights: [
      event.shortDescription,
      event.ticketTypes.length
        ? `${event.ticketTypes.length} ticket tiers currently published for this event`
        : "Ticket tier information will appear when inventory is published",
      event.ticketsAvailable
        ? "Live ticket inventory is currently available through ZOYA checkout"
        : "The team is holding or refreshing ticket inventory right now",
      event.venueAddress || `${event.shortVenue}, ${event.cityLine}`,
    ],
    venueNotes: [
      { label: "Venue", value: `${event.shortVenue}, ${event.cityLine}` },
      { label: "Event Date", value: event.formattedDate },
      {
        label: "Doors Open",
        value: event.doorsOpen
          ? new Date(event.doorsOpen).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : "Timing shared in your confirmation email",
      },
      {
        label: "Dress Code",
        value: event.dressCode || "Shared in your pre-event confirmation",
      },
      {
        label: "Parking",
        value: event.parkingInfo || "Arrival and parking notes are shared before the event",
      },
    ],
    faqs: [
      {
        question: "How does payment work?",
        answer:
          "Checkout creates the order inside ZOYA first, then moves into secure Stripe payment so totals, customer details, and ticket status remain consistent.",
      },
      {
        question: "When do I receive my QR tickets?",
        answer:
          "Confirmation email and QR ticket delivery happen after Stripe confirms a successful payment through the webhook flow.",
      },
      {
        question: "Is there an age or dress-code policy?",
        answer:
          event.ageRestriction > 0
            ? `Guests should plan for an age policy of ${event.ageRestriction}+ and review dress guidance before arrival.`
            : "Dress guidance and guest notes are included in the order confirmation and support emails before the event.",
      },
    ],
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: event.seoTitle || event.title,
    description: event.seoDescription || event.shortDescription,
    alternates: {
      canonical: `/events/${event.slug}`,
    },
    openGraph: {
      title: event.seoTitle || event.title,
      description: event.seoDescription || event.shortDescription,
      images: [event.coverImageUrl],
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const [event, feed] = await Promise.all([getPublicEventBySlug(slug), getPublicEventsFeed()]);

  if (!event) {
    notFound();
  }

  const detail = detailFallbacks[slug] || buildDefaultDetail(event);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://vibeup-event.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription,
    startDate: event.eventDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      event.eventState === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    image: [event.coverImageUrl],
    location: {
      "@type": "Place",
      name: event.shortVenue,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venueAddress || undefined,
        addressLocality: event.venueCity,
        addressRegion: event.venueState || undefined,
        addressCountry: event.venueCountry || "US",
      },
    },
    offers: event.ticketTypes.map((ticketType) => ({
      "@type": "Offer",
      price: ticketType.price,
      priceCurrency: ticketType.currency,
      availability: ticketType.isSoldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: `${appUrl}/checkout?event=${event.slug}`,
    })),
    organizer: {
      "@type": "Organization",
      name: SITE.name,
      email: SITE.email,
    },
  };

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Event Detail"
        title={event.title.split(" ").slice(0, -1).join(" ") || event.title}
        goldWord={event.title.split(" ").slice(-1).join(" ")}
        description={detail.overview}
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[340px] sm:min-h-[520px] overflow-hidden rounded-[18px]">
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </GlassCard>
        }
        actions={
          <>
            <LiquidLinkButton
              href={
                event.ticketsAvailable && event.eventState !== "past"
                  ? `/checkout?event=${event.slug}`
                  : "/contact-us"
              }
              gold
            >
              {event.ticketsAvailable && event.eventState !== "past" ? "Buy Tickets" : "Contact Support"}
            </LiquidLinkButton>
            <LiquidLinkButton href="/events">Back To Events</LiquidLinkButton>
          </>
        }
      />

      {feed.degraded || !event.ticketsAvailable ? (
        <section className="px-5 py-4 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <GlassCard warm className="px-5 py-5">
              <p className="eyebrow mb-3">
                {feed.degraded ? "Live Catalog Status" : "Ticketing Status"}
              </p>
              <p className="body-copy text-white/68">
                {feed.degraded
                  ? feed.degraded_message ||
                    "This event page is running on fallback schedule data. Logistics remain visible, but checkout stays honest about live inventory availability."
                  : event.eventState === "past"
                    ? "This event is now part of the archive. Use the contact flow if you need private-event support or want updates about the next release."
                    : "Ticket inventory is currently unavailable for this event, so ZOYA is keeping checkout closed instead of risking a broken purchase flow."}
              </p>
            </GlassCard>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: CalendarDays, label: "Date", value: event.formattedDate },
            { icon: MapPin, label: "Venue", value: `${event.shortVenue}, ${event.cityLine}` },
            {
              icon: Clock3,
              label: "Pricing",
              value: event.priceFrom > 0 ? `From $${event.priceFrom}` : "Available on request",
            },
            {
              icon: Ticket,
              label: "Status",
              value:
                event.eventState === "sold_out"
                  ? "Sold out"
                  : event.ticketsAvailable
                    ? "Live checkout"
                    : "Inventory offline",
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="px-5 py-5">
              <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="body-copy text-white/68">{item.value}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Event Journey"
            title="How the evening is"
            goldWord="built"
            subtitle="The strongest nights are shaped intentionally. This event is paced to balance premium hospitality, emotional energy, and memorable social movement."
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {detail.flow.map((item) => (
              <GlassCard key={item.title} hover className="h-full px-5 py-6">
                <p className="eyebrow mb-3">{item.title}</p>
                <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                  {item.title}
                </h3>
                <div className="gold-divider-left mt-4 h-px w-16" />
                <p className="body-copy mt-5">{item.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.84fr_1.16fr]">
          <GlassCard className="px-6 py-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow">Guest Highlights</p>
            </div>
            <div className="mt-5 space-y-4">
              {detail.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <p className="body-copy text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="px-6 py-6">
            <p className="eyebrow mb-4">Ticket Access</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {event.ticketTypes.length ? (
                event.ticketTypes.map((ticketType) => (
                  <GlassCard key={ticketType.id} dark className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow mb-2">{ticketType.badge || "Access Tier"}</p>
                        <h3 className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                          {ticketType.name}
                        </h3>
                      </div>
                      <span className="eyebrow whitespace-nowrap text-white/34">
                        {ticketType.isSoldOut
                          ? "Sold out"
                          : ticketType.remainingQuantity != null
                            ? `${ticketType.remainingQuantity} left`
                            : `Max ${ticketType.maxPerOrder}`}
                      </span>
                    </div>
                    <p className="mt-3 font-serif text-[1.8rem] font-light tracking-[0.05em] text-[var(--gold)]">
                      ${ticketType.price}
                    </p>
                    <p className="body-copy mt-4">{ticketType.description}</p>
                    <div className="mt-4 space-y-2">
                      {(ticketType.includes.length
                        ? ticketType.includes
                        : [
                            "Access synced to your paid ZOYA order",
                            "QR ticket delivery after payment confirmation",
                            ticketType.isSoldOut
                              ? "Waitlist support available through the team"
                              : `Up to ${ticketType.maxPerOrder} per order`,
                          ]
                      ).map((item) => (
                        <div
                          key={item}
                          className="rounded-[14px] border border-white/8 bg-white/[0.02] px-3 py-3"
                        >
                          <p className="body-copy text-[0.79rem] text-white/64">{item}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))
              ) : (
                <GlassCard dark className="px-5 py-5 md:col-span-2 xl:col-span-3">
                  <p className="body-copy text-white/68">
                    Ticket tiers are not published for this event yet. Contact the team if you
                    need access.
                  </p>
                </GlassCard>
              )}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard warm className="px-6 py-7 md:px-8">
            <p className="eyebrow mb-4">Guest Logistics</p>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {detail.venueNotes.map((note) => (
                <GlassCard key={note.label} dark className="px-5 py-5">
                  <p className="eyebrow mb-2">{note.label}</p>
                  <p className="body-copy text-white/68">{note.value}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <GlassCard dark className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="eyebrow">Arrival Confidence</p>
                </div>
                <p className="body-copy mt-4 text-white/68">
                  Your order confirmation is the source of truth for access. If live inventory is
                  active, tickets are tied to your ZOYA order before card payment begins.
                </p>
              </GlassCard>
              <GlassCard dark className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="eyebrow">Need Support</p>
                </div>
                <p className="body-copy mt-4 text-white/68">
                  Use {SITE.email} or WhatsApp if you need concierge help with group seating,
                  arrival timing, or guest access before the event.
                </p>
              </GlassCard>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <LiquidLinkButton
                href={event.ticketsAvailable ? `/checkout?event=${event.slug}` : "/contact-us"}
                gold
              >
                {event.ticketsAvailable ? "Book Your Seats" : "Contact The Team"}
              </LiquidLinkButton>
              <LiquidLinkButton href="/events">View More Events</LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Event FAQ"
            title="Answers before you"
            goldWord="arrive"
            subtitle="The strongest event pages remove hesitation. These are the questions mobile buyers usually need answered before they continue to checkout."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {detail.faqs.map((item) => (
              <GlassCard key={item.question} className="h-full px-5 py-5">
                <p className="eyebrow mb-3">{item.question}</p>
                <p className="body-copy text-white/68">{item.answer}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {!event.ticketsAvailable ? (
        <section className="px-5 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <GlassCard gold className="px-6 py-8 text-center md:px-10">
              <p className="eyebrow mb-4">Waitlist Access</p>
              <h2 className="section-title">
                Stay close to the next release <em>window</em>
              </h2>
              <p className="body-copy mx-auto mt-5 max-w-2xl">
                If tickets are paused or sold out, join the list and ZOYA can notify you before
                the next release or availability update.
              </p>
              <div className="mt-8 flex justify-center">
                <NewsletterForm source={`waitlist:${event.slug}`} />
              </div>
            </GlassCard>
          </div>
        </section>
      ) : null}

      <StickyBuyCTA
        href={event.ticketsAvailable ? `/checkout?event=${event.slug}` : "/contact-us"}
        price={event.priceFrom || undefined}
        label={event.ticketsAvailable ? "Buy Tickets" : "Contact Support"}
      />
    </main>
  );
}
