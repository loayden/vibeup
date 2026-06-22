"use client";

import { format } from "date-fns";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { GlassCard, LiquidLinkButton } from "@/components/site/liquid";
import type { PublicEvent } from "@/lib/public-events";

type EventsShowcaseProps = {
  upcoming: readonly PublicEvent[];
  past: readonly PublicEvent[];
};

function getStatusLabel(event: PublicEvent) {
  if (event.eventState === "limited") {
    return "Limited";
  }

  if (event.eventState === "sold_out") {
    return "Sold Out";
  }

  if (event.eventState === "past") {
    return "Memories";
  }

  if (event.eventState === "cancelled") {
    return "Cancelled";
  }

  return "Upcoming";
}

function statusClass(event: PublicEvent) {
  if (event.eventState === "limited") {
    return "glass-card glass-card-gold";
  }

  if (event.eventState === "sold_out") {
    return "glass-card glass-card-dark";
  }

  return "glass-card";
}

function buildCalendarMonthLabel(event: PublicEvent) {
  return format(new Date(event.eventDate), "MMMM yyyy");
}

export function EventsShowcase({ upcoming, past }: EventsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  const [view, setView] = useState<"grid" | "calendar">("grid");

  const visibleUpcoming = activeTab === "past" ? [] : upcoming;
  const visiblePast = activeTab === "upcoming" ? [] : past;

  const calendarItems = [
    ...upcoming.map((event) => ({
      id: event.slug,
      title: event.title,
      dateLabel: event.formattedDate,
      monthLabel: buildCalendarMonthLabel(event),
      venue: event.shortVenue,
      href: `/events/${event.slug}`,
      kind: "upcoming" as const,
      status: getStatusLabel(event),
    })),
    ...past.map((event) => ({
      id: event.slug,
      title: event.title,
      dateLabel: event.formattedDate,
      monthLabel: buildCalendarMonthLabel(event),
      venue: event.shortVenue,
      href: `/events/${event.slug}`,
      kind: "past" as const,
      status: "Memories",
    })),
  ].filter((item) => {
    if (activeTab === "all") {
      return true;
    }

    return item.kind === activeTab;
  });

  const groupedCalendarItems = calendarItems.reduce<Record<string, typeof calendarItems>>(
    (groups, item) => {
      if (!groups[item.monthLabel]) {
        groups[item.monthLabel] = [];
      }

      groups[item.monthLabel].push(item);
      return groups;
    },
    {},
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[
            { key: "all", label: "All Events" },
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Past" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${activeTab === tab.key ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
              onClick={() => setActiveTab(tab.key as "all" | "upcoming" | "past")}
              data-cursor="hover"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            className={`${view === "grid" ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
            onClick={() => setView("grid")}
            data-cursor="hover"
          >
            Cards
          </button>
          <button
            className={`${view === "calendar" ? "liquid-button-gold" : "liquid-button-ghost"} shrink-0`}
            onClick={() => setView("calendar")}
            data-cursor="hover"
          >
            Calendar
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="space-y-12">
          {visibleUpcoming.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleUpcoming.map((event) => (
                <div
                  key={event.slug}
                >
                  <GlassCard hover className="h-full overflow-hidden p-3">
                    <div className="flex gap-3 sm:block">
                      <div className="relative aspect-square w-[124px] shrink-0 overflow-hidden rounded-[18px] sm:w-full sm:aspect-[16/10]">
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,8,8,0.86))]" />
                        <div className="absolute left-4 top-4 on-image-text">
                          <div className={`${statusClass(event)} rounded-full px-4 py-2`}>
                            <div className="spec-line" />
                            <p className="eyebrow text-white/50">{getStatusLabel(event)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col px-1 pb-1 pt-1 sm:px-3 sm:pb-3 sm:pt-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="eyebrow mb-2">Ticketed Experience</p>
                            <h3 className="font-serif text-[1.45rem] font-light tracking-[0.05em] text-white sm:text-[2rem]">
                              {event.title}
                            </h3>
                          </div>
                          <p className="font-serif text-[1.25rem] font-light tracking-[0.05em] text-white sm:text-[1.8rem]">
                            {event.priceFrom > 0 ? `From $${event.priceFrom}` : "Invite Only"}
                          </p>
                        </div>

                        <div className="gold-divider-left mt-3 h-px w-16 sm:mt-4 sm:w-24" />

                        <div className="mt-3 grid gap-3 sm:mt-5 sm:grid-cols-2">
                          <GlassCard dark className="px-4 py-4">
                            <CalendarDays className="mb-2 h-4 w-4 text-white" strokeWidth={1.2} />
                            <p className="eyebrow mb-2">Date</p>
                            <p className="body-copy text-white/68">{event.formattedDate}</p>
                          </GlassCard>
                          <GlassCard dark className="px-4 py-4">
                            <MapPin className="mb-2 h-4 w-4 text-white" strokeWidth={1.2} />
                            <p className="eyebrow mb-2">Venue</p>
                            <p className="body-copy text-white/68">
                              {event.shortVenue}
                              <br />
                              {event.cityLine}
                            </p>
                          </GlassCard>
                        </div>

                        <p className="body-copy mt-4 sm:mt-5">{event.shortDescription}</p>

                        <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-4">
                          <LiquidLinkButton
                            href={`/events/${event.slug}`}
                            gold
                            className="w-full justify-center sm:w-auto"
                          >
                            Details <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                          </LiquidLinkButton>
                          <LiquidLinkButton
                            href={event.ticketsAvailable ? `/checkout?event=${event.slug}` : "/contact-us"}
                            className="w-full justify-center sm:w-auto"
                          >
                            {event.ticketsAvailable ? "Buy Tickets" : "Contact"}{" "}
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                          </LiquidLinkButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : null}

          {visiblePast.length ? (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Archive</p>
                  <h3 className="section-title text-[2.2rem]">
                    Past event <em>memories</em>
                  </h3>
                </div>
                <LiquidLinkButton href="/gallery">Open Gallery</LiquidLinkButton>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePast.map((event) => (
                  <div
                    key={event.slug}
                  >
                    <GlassCard hover className="h-full overflow-hidden p-3">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,8,8,0.86))]" />
                        <div className="absolute left-4 top-4 rounded-full bg-[rgba(8,8,8,0.55)] px-4 py-2 backdrop-blur-md on-image-text">
                          <p className="eyebrow text-white/45">Memories</p>
                        </div>
                      </div>

                      <div className="px-3 pb-3 pt-5">
                        <p className="eyebrow mb-3">{event.formattedDate}</p>
                        <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                          {event.title}
                        </h3>
                        <div className="gold-divider-left mt-4 h-px w-20" />
                        <p className="body-copy mt-5 text-white/68">
                          {event.shortVenue}
                          <br />
                          {event.cityLine}
                        </p>
                        <p className="body-copy mt-5">{event.shortDescription}</p>
                        <Link
                          href={`/events/${event.slug}`}
                          className="liquid-button-ghost mt-6 inline-flex w-full justify-center sm:w-auto"
                        >
                          View Details
                        </Link>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!visibleUpcoming.length && !visiblePast.length ? (
            <GlassCard dark className="px-6 py-12 text-center">
              <p className="eyebrow mb-4">No Events</p>
              <h3 className="section-title text-[2rem]">
                Nothing scheduled <em>here</em>
              </h3>
              <p className="body-copy mx-auto mt-5 max-w-xl">
                Adjust the filter and the calendar view to browse upcoming launches, past
                experiences, or both together.
              </p>
            </GlassCard>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCalendarItems).map(([monthLabel, items]) => (
            <GlassCard key={monthLabel} className="px-6 py-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:w-60">
                  <p className="eyebrow mb-3">Calendar Window</p>
                  <h3 className="section-title text-[2rem]">
                    {monthLabel.split(" ")[0]}{" "}
                    <em>{monthLabel.split(" ").slice(1).join(" ")}</em>
                  </h3>
                </div>

                <div className="grid flex-1 gap-4">
                  {items.map((item) => (
                    <Link
                      key={`${item.monthLabel}-${item.id}`}
                      href={item.href}
                      className="glass-card glass-card-dark block rounded-[20px] px-5 py-5 transition hover:border-[rgba(198,169,98,0.26)]"
                      data-cursor="hover"
                    >
                      <div className="spec-line" />
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="eyebrow mb-2">{item.status}</p>
                          <p className="font-serif text-[1.75rem] font-light tracking-[0.05em] text-white">
                            {item.title}
                          </p>
                          <p className="body-copy mt-3 text-white/65">
                            {item.dateLabel}
                            <br />
                            {item.venue}
                          </p>
                        </div>
                        <span className="eyebrow text-white">Open</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
