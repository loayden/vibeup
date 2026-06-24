import type { Metadata } from "next";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "World Cup Fan Zone - Arab Community Matches",
  description: "The ultimate Arab World Cup fan experience in Southern California. Support Egypt, Saudi Arabia, Iraq, Jordan, Algeria, Morocco, Tunisia & Qatar live with thousands of fans.",
};

const arabNations = [
  { name: "Egypt", flag: "🇪🇬", priority: 1 },
  { name: "Saudi Arabia", flag: "🇸🇦", priority: 2 },
  { name: "Qatar", flag: "🇶🇦", priority: 8 },
  { name: "Iraq", flag: "🇮🇶", priority: 3 },
  { name: "Jordan", flag: "🇯🇴", priority: 4 },
  { name: "Algeria", flag: "🇩🇿", priority: 5 },
  { name: "Morocco", flag: "🇲🇦", priority: 6 },
  { name: "Tunisia", flag: "🇹🇳", priority: 7 },
].sort((a, b) => a.priority - b.priority);

const arabMatches = [
  {
    day: "Sunday",
    date: "June 29, 2026",
    matches: [
      { home: "Tunisia", away: "Japan", time: "10:00 AM" },
      { home: "Spain", away: "Saudi Arabia", time: "1:00 PM" },
    ],
  },
  {
    day: "Monday",
    date: "June 30, 2026",
    matches: [
      { home: "New Zealand", away: "Egypt", time: "11:00 AM" },
    ],
  },
  {
    day: "Tuesday",
    date: "July 1, 2026",
    matches: [
      { home: "France", away: "Iraq", time: "10:00 AM" },
      { home: "Jordan", away: "Algeria", time: "1:00 PM" },
    ],
  },
];

export default function WorldCupPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="World Cup Fan Zone"
        title="The Ultimate Arab World Cup"
        goldWord="Fan Experience"
        description="Support your country with thousands of fans in a premium stadium-style atmosphere. Wear your jersey, bring your flag, and represent your nation."
        align="center"
      />

      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Featured Arab Nations"
            title="Cheer for Your"
            goldWord="Country"
            subtitle="Egypt, Saudi Arabia, Iraq, Jordan, Algeria, Morocco, Tunisia & Qatar - all represented in one premium fan zone."
          />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {arabNations.map((nation) => (
              <GlassCard
                key={nation.name}
                gold={nation.priority === 1}
                hover
                className="px-5 py-6 text-center"
              >
                <div className="text-5xl mb-3">{nation.flag}</div>
                <h3 className="section-subtitle text-[1.35rem]">{nation.name}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Featured Arab Matches"
            title="Priority Match"
            goldWord="Schedule"
            subtitle="Don't miss these key fixtures featuring Arab national teams. Join thousands of fans to support your country live."
          />

          <div className="space-y-6">
            {arabMatches.map((day) => (
              <div key={day.day} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-[var(--cream)]" strokeWidth={1.2} />
                  <div>
                    <p className="eyebrow">{day.day}</p>
                    <p className="body-copy text-white/60">{day.date}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {day.matches.map((match) => (
                    <GlassCard key={`${match.home}-${match.away}`} hover className="px-6 py-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {arabNations.find((n) => n.name === match.home)?.flag || "⚽"}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{match.home}</p>
                            <p className="body-copy text-white/60 text-sm">vs</p>
                            <p className="font-semibold text-white">{match.away}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="eyebrow text-[var(--cream)]">{match.time}</p>
                        </div>
                      </div>
                      <LiquidLinkButton href="/contact-us" gold className="w-full justify-center">
                        Reserve Seats <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                      </LiquidLinkButton>
                    </GlassCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard gold className="px-8 py-10 text-center md:px-12 md:py-12">
            <Users className="mx-auto h-6 w-6 text-[var(--cream)]" strokeWidth={1.2} />
            <p className="eyebrow mt-4 mb-4">Join the Community</p>
            <h2 className="section-title text-[2.5rem]">
              Wear Your Jersey. Bring Your <em>Flag</em>.
            </h2>
            <p className="body-copy mx-auto mt-6 max-w-2xl text-white/68">
              The premier destination for Arab football fans in Southern California to watch and celebrate World Cup matches together in a premium atmosphere.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <LiquidLinkButton href="/contact-us" gold>
                Get Group Tickets <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
              </LiquidLinkButton>
              <LiquidLinkButton href="/events">View All Events</LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Venue Information"
            title="Grand Theater"
            goldWord="Anaheim"
            subtitle="Premium stadium-style viewing experience with large screens, premium seating, and full food & beverage service."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <GlassCard className="px-6 py-6">
              <MapPin className="mb-4 h-5 w-5 text-[var(--cream)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">Location</p>
              <p className="body-copy text-white/68">Grand Theater Anaheim</p>
              <p className="body-copy text-white/60 text-sm mt-1">Anaheim, California</p>
            </GlassCard>
            <GlassCard className="px-6 py-6">
              <Calendar className="mb-4 h-5 w-5 text-[var(--cream)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">Event Dates</p>
              <p className="body-copy text-white/68">June 29 - July 1, 2026</p>
              <p className="body-copy text-white/60 text-sm mt-1">Multiple matchdays</p>
            </GlassCard>
            <GlassCard className="px-6 py-6">
              <Users className="mb-4 h-5 w-5 text-[var(--cream)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">Capacity</p>
              <p className="body-copy text-white/68">Premium Seating</p>
              <p className="body-copy text-white/60 text-sm mt-1">Group packages available</p>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  );
}
