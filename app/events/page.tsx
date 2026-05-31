import type { Metadata } from "next";
import { ArrowRight, CalendarRange, Music2, Sparkles } from "lucide-react";
import Image from "next/image";

import { EventsShowcase } from "@/components/site/events-showcase";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { StickyBuyCTA } from "@/components/site/sticky-buy-cta";
import { getPublicEventsFeed } from "@/lib/public-events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse live ZOYA events, ticket availability, venues, and premium cultural experiences from the active event catalog.",
};

export default async function EventsPage() {
  const feed = await getPublicEventsFeed();
  const featuredEvent = feed.featured;
  const featuredCheckoutHref =
    featuredEvent?.ticketsAvailable && featuredEvent.eventState !== "past"
      ? `/checkout?event=${featuredEvent.slug}`
      : "/contact-us";

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Events Calendar"
        title="Signature nights and curated"
        goldWord="experiences"
        description="Explore the public side of ZOYA through the live event catalog: premium cultural evenings, gala formats, rooftop experiences, and milestone celebrations with real ticket visibility."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[320px] sm:min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src={featuredEvent?.coverImageUrl || "/arabnights-1200.webp"}
                alt={featuredEvent?.title || "ZOYA events"}
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
            <LiquidLinkButton href={featuredCheckoutHref} gold>
              {featuredEvent?.ticketsAvailable ? "Reserve Tickets" : "Contact Team"}{" "}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">Book A Private Event</LiquidLinkButton>
          </>
        }
      />

      {feed.degraded ? (
        <section className="px-5 py-4 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <GlassCard warm className="px-5 py-5">
              <p className="eyebrow mb-3">Catalog Status</p>
              <p className="body-copy text-white/68">
                {feed.degraded_message ||
                  "The live event catalog is unavailable, so this page is showing a curated fallback schedule. Checkout stays closed until live inventory is restored."}
              </p>
            </GlassCard>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: CalendarRange,
              label: "Live Catalog",
              body: "Published events, featured placements, and sold-out states now come from the event database instead of a static marketing list.",
            },
            {
              icon: Music2,
              label: "Programming",
              body: "Live performers, DJs, hosts, and social pacing designed to keep the room emotionally alive without losing production control.",
            },
            {
              icon: Sparkles,
              label: "Guest Standard",
              body: "Premium hospitality, elegant arrival, and clear guest guidance from pre-event communications through venue entry.",
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="h-full px-5 py-5">
              <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="body-copy text-white/68">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Browse The Calendar"
            title="Upcoming launches and event"
            goldWord="history"
            subtitle="Move between the grid and calendar views to understand what is coming next, what already sold, and which room formats define the ZOYA standard."
          />
          <EventsShowcase upcoming={feed.upcoming} past={feed.past} />
        </div>
      </section>

      {featuredEvent ? (
        <section className="px-5 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <GlassCard hover className="grid overflow-hidden rounded-[26px] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[360px]">
                <Image
                  src={featuredEvent.coverImageUrl}
                  alt={featuredEvent.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="px-6 py-7 md:px-8">
                <p className="eyebrow mb-4">Featured Event</p>
                <h3 className="section-title text-[2.4rem]">
                  {featuredEvent.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <em>{featuredEvent.title.split(" ").slice(-1)}</em>
                </h3>
                <div className="gold-divider-left mt-5 h-px w-24" />
                <p className="body-copy mt-5">{featuredEvent.description}</p>

                <div className="mt-6 grid gap-3">
                  {[
                    `Event date: ${featuredEvent.formattedDate}`,
                    `Venue: ${featuredEvent.shortVenue}`,
                    featuredEvent.priceFrom > 0
                      ? `Pricing starts at $${featuredEvent.priceFrom}`
                      : "Pricing available on request",
                    featuredEvent.ticketsAvailable
                      ? "Live ticket inventory is currently available."
                      : "Ticket inventory is temporarily unavailable.",
                  ].map((detail) => (
                    <div
                      key={detail}
                      className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
                    >
                      <p className="body-copy text-white/68">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <LiquidLinkButton href={`/events/${featuredEvent.slug}`} gold>
                    View Event Detail
                  </LiquidLinkButton>
                  <LiquidLinkButton
                    href={featuredEvent.ticketsAvailable ? `/checkout?event=${featuredEvent.slug}` : "/contact-us"}
                  >
                    {featuredEvent.ticketsAvailable ? "Start Checkout" : "Contact Team"}
                  </LiquidLinkButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      ) : null}

      <StickyBuyCTA
        href={featuredCheckoutHref}
        price={featuredEvent?.priceFrom || undefined}
      />
    </main>
  );
}
