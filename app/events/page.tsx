import { ArrowRight, CalendarRange, Music2, Sparkles } from "lucide-react";
import Image from "next/image";

import { EventsShowcase } from "@/components/site/events-showcase";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { StickyBuyCTA } from "@/components/site/sticky-buy-cta";
import {
  FEATURED_EVENT,
  PAST_EVENTS,
  SITE,
  UPCOMING_EVENTS,
} from "@/lib/site-data";

export default function EventsPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Events Calendar"
        title="Signature nights and curated"
        goldWord="experiences"
        description="Explore the public side of VibeUp: premium cultural evenings, gala formats, rooftop experiences, and milestone celebrations designed for guests who want atmosphere with real production quality."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src="/arabnights-1200.webp"
                alt="VibeUp events"
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
              Reserve Tickets <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">Book A Private Event</LiquidLinkButton>
          </>
        }
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: CalendarRange,
              label: "Release Rhythm",
              body: "A balanced mix of marquee launches, cultural evenings, and recurring room concepts.",
            },
            {
              icon: Music2,
              label: "Programming",
              body: "Live performers, DJs, hosts, and social pacing designed to keep the room emotionally alive.",
            },
            {
              icon: Sparkles,
              label: "Guest Standard",
              body: "Premium hospitality, elegant arrival, and clear guest guidance from pre-event to close.",
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
            subtitle="Move between the grid and calendar views to understand what is coming next, what sold strongly, and which room formats define the VibeUp standard."
          />
          <EventsShowcase upcoming={UPCOMING_EVENTS} past={PAST_EVENTS} />
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard hover className="grid overflow-hidden rounded-[26px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[360px]">
              <Image
                src={FEATURED_EVENT.image}
                alt={FEATURED_EVENT.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="px-6 py-7 md:px-8">
              <p className="eyebrow mb-4">Arab Nights Feature</p>
              <h3 className="section-title text-[2.4rem]">
                {FEATURED_EVENT.title.split(" ").slice(0, -1).join(" ")}{" "}
                <em>{FEATURED_EVENT.title.split(" ").slice(-1)}</em>
              </h3>
              <div className="gold-divider-left mt-5 h-px w-24" />
              <p className="body-copy mt-5">{FEATURED_EVENT.description}</p>

              <div className="mt-6 grid gap-3">
                {FEATURED_EVENT.details.map((detail) => (
                  <div key={detail} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="body-copy text-white/68">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <LiquidLinkButton href="/events/arab-nights" gold>
                  View Event Detail
                </LiquidLinkButton>
                <LiquidLinkButton href={SITE.buyUrl} external>
                  Official Ticket Link
                </LiquidLinkButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <StickyBuyCTA href="/checkout" price={120} />
    </main>
  );
}
