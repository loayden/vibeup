import type { Metadata } from "next";
import { ArrowRight, CalendarRange, Music2, Sparkles } from "lucide-react";
import Image from "next/image";

import { EventsShowcase } from "@/components/site/events-showcase";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { getPublicEventsFeed } from "@/lib/public-events";

const worldCupSchedule = [
  { day: "Friday", matches: ["Canada vs Qatar", "Mexico vs Korea", "USA vs Australia"] },
  { day: "Saturday", matches: ["Scotland vs Morocco"] },
  { day: "Sunday", matches: ["Tunisia vs Japan", "Spain vs Saudi Arabia"] },
  { day: "Monday", matches: ["New Zealand vs Egypt"] },
  { day: "Tuesday", matches: ["France vs Iraq", "Jordan vs Algeria"] },
];

const featuredNations = ["Egypt", "Tunisia", "Algeria", "Morocco", "Canada", "USA", "Mexico", "Jordan", "Iraq", "Saudi Arabia", "Qatar"];

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse BEDOUIN White Party dates, premium beach and desert-style experiences, and the full event archive.",
};

export default async function EventsPage() {
  const feed = await getPublicEventsFeed();
  const featuredEvent = feed.featured;
  const featuredActionHref = featuredEvent ? `/events/${featuredEvent.slug}` : "#events-calendar";

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="This September"
        title="BEDOUIN White Party"
        goldWord="Calendar"
        description="Browse upcoming BEDOUIN experiences, compare dates and venues, and open the new annual celebration."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[320px] sm:min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src={featuredEvent?.coverImageUrl || "/bedouin/vibeup-31.jpg"}
                alt={featuredEvent?.title || "BEDOUIN events"}
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
            <LiquidLinkButton href={featuredActionHref} gold>
              View Event Details{" "}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">Join The List</LiquidLinkButton>
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
              label: "Annual Edition",
              body: "The BEDOUIN calendar centers on one signature white-party experience each September, with the archive available beside it.",
            },
            {
              icon: Music2,
              label: "Programming",
              body: "Live musicians, DJs, majlis moments, and coastal hospitality designed to move from elegant sunset to high-energy night.",
            },
            {
              icon: Sparkles,
              label: "Guest Standard",
              body: "White dress code, elevated food, and premium service from arrival through the final lounge sequence.",
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

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <GlassCard className="overflow-hidden px-5 py-6 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="eyebrow mb-3">World Cup Fan Festival</p>
                <h2 className="section-title text-[2rem]">
                  Stadium atmosphere inside <em>Grand Theater Anaheim</em>
                </h2>
                <p className="body-copy mt-4 text-white/84">
                  Massive LED match viewing, DJ entertainment, premium indoor comfort, food and
                  beverage access, and a focused spotlight on Arab national teams.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredNations.map((nation) => (
                    <span key={nation} className="rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[0.78rem] font-medium tracking-[0.08em] text-white">
                      {nation}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                {worldCupSchedule.map((item) => (
                  <div key={item.day} className="rounded-[18px] border border-white/10 bg-white/[0.07] px-4 py-4">
                    <p className="eyebrow mb-2 text-white/78">{item.day}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.matches.map((match) => (
                        <span
                          key={match}
                          className="rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[0.78rem] font-medium tracking-[0.03em] text-white"
                        >
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="events-calendar" className="px-5 py-12 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Browse The Calendar"
            title="Compare dates, venues, and"
            goldWord="history"
            subtitle="Use the filters to find the annual BEDOUIN edition, review the archive, and open the experience details."
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
                    "Access details available through the ZOYA team",
                    "Simple guest support by contact form, WhatsApp, or email",
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
                    View Details
                  </LiquidLinkButton>
                  <LiquidLinkButton href="/contact-us">
                    Contact Support
                  </LiquidLinkButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      ) : null}
    </main>
  );
}
