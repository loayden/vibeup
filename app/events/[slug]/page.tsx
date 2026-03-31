import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { StickyBuyCTA } from "@/components/site/sticky-buy-cta";
import { SITE, TICKET_TYPES, UPCOMING_EVENTS } from "@/lib/site-data";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const eventDetails: Record<
  string,
  {
    overview: string;
    flow: Array<{ title: string; body: string }>;
    highlights: string[];
    venueNotes: Array<{ label: string; value: string }>;
  }
> = {
  "arab-nights": {
    overview:
      "Arab Nights is one of VibeUp's signature cultural productions: a premium social evening where ceremony, hospitality, music, and room energy are paced deliberately to create a strong emotional build throughout the night.",
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
      "Live headline performance by Abdel Karim Hamdan",
      "Elegant room styling and controlled atmosphere pacing",
    ],
    venueNotes: [
      { label: "Dress Code", value: "Formal evening wear or elevated cultural glamour" },
      { label: "Doors Open", value: "Guests are encouraged to arrive 45 minutes early" },
      { label: "Venue", value: SITE.venue },
    ],
  },
};

export function generateStaticParams() {
  return UPCOMING_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = UPCOMING_EVENTS.find((item) => item.slug === slug);

  if (!event) {
    notFound();
  }

  const detail = eventDetails[slug] || eventDetails["arab-nights"];

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Event Detail"
        title={event.title.split(" ").slice(0, -1).join(" ")}
        goldWord={event.title.split(" ").slice(-1).join(" ")}
        description={detail.overview}
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[520px] overflow-hidden rounded-[18px]">
              <Image
                src={event.image}
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
            <LiquidLinkButton href="/checkout" gold>
              Reserve Tickets
            </LiquidLinkButton>
            <LiquidLinkButton href="/events">Back To Events</LiquidLinkButton>
          </>
        }
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: CalendarDays, label: "Date", value: event.date },
            { icon: MapPin, label: "Venue", value: `${event.venue}, ${event.city}` },
            { icon: Clock3, label: "From", value: `$${event.priceFrom}` },
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
                <div key={item} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                  <p className="body-copy text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="px-6 py-6">
            <p className="eyebrow mb-4">Ticket Access</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {TICKET_TYPES.map((ticket) => (
                <GlassCard key={ticket.id} dark className="px-4 py-4">
                  <p className="eyebrow mb-2">{ticket.badge || "Access Tier"}</p>
                  <h3 className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                    {ticket.name}
                  </h3>
                  <p className="mt-3 font-serif text-[1.8rem] font-light tracking-[0.05em] text-[var(--gold)]">
                    ${ticket.price}
                  </p>
                  <p className="body-copy mt-4">{ticket.description}</p>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard warm className="px-6 py-7 md:px-8">
            <p className="eyebrow mb-4">Venue Notes</p>
            <div className="grid gap-5 md:grid-cols-3">
              {detail.venueNotes.map((note) => (
                <GlassCard key={note.label} dark className="px-5 py-5">
                  <p className="eyebrow mb-2">{note.label}</p>
                  <p className="body-copy text-white/68">{note.value}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <LiquidLinkButton href="/checkout" gold>
                Book Your Seats
              </LiquidLinkButton>
              <LiquidLinkButton href={SITE.buyUrl} external>
                Official Payment Link
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>

      <StickyBuyCTA href="/checkout" price={event.priceFrom} label="Book Seats" />
    </main>
  );
}
