"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPin,
  Music4,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { CountdownTimer } from "@/components/site/countdown";
import { HomeHeroVisual } from "@/components/site/home-hero-visual";
import {
  GlassCard,
  LiquidLinkButton,
  PageHero,
  SectionHeader,
} from "@/components/site/liquid";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { StickyBuyCTA } from "@/components/site/sticky-buy-cta";
import { SwipeCarousel } from "@/components/site/swipe-carousel";
import type { PublicEventsFeed, PublicTicketType } from "@/lib/public-events";
import {
  FEATURED_EVENT,
  GALLERY_ITEMS,
  HERO_STATS,
  PARTNERS,
  SERVICES,
  SITE,
  TESTIMONIALS,
  TICKET_TYPES,
  WHY_ZOYA,
} from "@/lib/site-data";

const revealProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
};

const serviceHighlights = SERVICES.slice(0, 4);
const galleryHighlights = GALLERY_ITEMS.slice(0, 6);

export default function HomePage() {
  const [eventsFeed, setEventsFeed] = useState<PublicEventsFeed | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/public/events-feed", {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch live event feed");
        }

        const payload = (await response.json()) as PublicEventsFeed;
        setEventsFeed(payload);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Unable to refresh home event feed", error);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const featuredEvent = eventsFeed?.featured;
  const nextEvent = eventsFeed?.nextEvent;
  const liveCatalogHealthy = Boolean(eventsFeed && !eventsFeed.degraded);
  const featuredTicketTypes: Array<PublicTicketType | (typeof TICKET_TYPES)[number]> =
    featuredEvent?.ticketTypes.length ? featuredEvent.ticketTypes : [...TICKET_TYPES];
  const featuredCheckoutHref =
    featuredEvent?.ticketsAvailable && featuredEvent.slug
      ? `/checkout?event=${featuredEvent.slug}`
      : "/contact-us";
  const featuredDetailHref = featuredEvent?.slug ? `/events/${featuredEvent.slug}` : "/events";
  const testimonialCards = TESTIMONIALS.map((testimonial) => (
    <GlassCard key={testimonial.name} hover className="h-full px-6 py-6">
      <p className="font-serif text-[2rem] font-light leading-snug text-white">
        “{testimonial.quote}”
      </p>
      <div className="gold-divider-left mt-6 h-px w-20" />
      <p className="eyebrow mt-5">{testimonial.event}</p>
      <p className="body-copy mt-2 text-white/68">{testimonial.name}</p>
      <p className="body-copy text-[0.78rem]">{testimonial.role}</p>
    </GlassCard>
  ));

  return (
    <main className="overflow-x-hidden">
      <section className="relative min-h-[85vh] overflow-hidden sm:min-h-screen">
        <HomeHeroVisual />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.62)_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,#080808)]" />

        <div className="relative z-10 flex min-h-[85vh] items-center px-5 pt-28 sm:min-h-screen sm:px-10 sm:pt-32 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <PageHero
              eyebrow="ZOYA Events & Services"
              title="Creating unforgettable"
              goldWord="experiences"
              description="A premium event company shaping cultural nights, private parties, gala dinners, and luxury celebrations with clear creative direction, disciplined production, and the kind of room energy guests remember long after the last song."
              media={
                <GlassCard className="p-4 md:p-5">
                  <div className="overflow-hidden rounded-[18px]">
                    <Image
                      src={featuredEvent?.coverImageUrl || "/arabnights-1200.webp"}
                      alt={featuredEvent?.title || "Arab Nights featured event"}
                      width={1100}
                      height={1300}
                      className="h-[300px] w-full object-cover sm:h-[420px] md:h-[460px]"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 38vw"
                    />
                  </div>
                  <div className="grid gap-3 px-1 pb-2 pt-5 sm:grid-cols-3">
                    {[
                      {
                        icon: CalendarDays,
                        label: "Next Signature Night",
                        value: nextEvent?.formattedDate || "Live schedule pending",
                      },
                      {
                        icon: MapPin,
                        label: "Venue",
                        value: nextEvent?.shortVenue || SITE.venue,
                      },
                      {
                        icon: Music4,
                        label: "Headline Moment",
                        value: featuredEvent?.title || "Marquee cultural production",
                      },
                    ].map((item) => (
                      <div key={item.label} className="glass-card glass-card-dark rounded-[18px] px-4 py-4">
                        <div className="spec-line" />
                        <item.icon className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                        <p className="eyebrow mb-2">{item.label}</p>
                        <p className="body-copy text-white/68">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              }
              actions={
                <>
                  <LiquidLinkButton href={featuredCheckoutHref} gold>
                    {featuredEvent?.ticketsAvailable ? "Book Tickets" : "Contact Team"}{" "}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                  </LiquidLinkButton>
                  <LiquidLinkButton href="/events">
                    Explore Events <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                  </LiquidLinkButton>
                </>
              }
            />
          </div>
        </div>
      </section>

      {eventsFeed?.degraded ? (
        <section className="px-5 py-4 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <GlassCard warm className="px-5 py-5">
              <p className="eyebrow mb-3">Live Catalog Status</p>
              <p className="body-copy text-white/68">
                {eventsFeed.degraded_message ||
                  "The live event database is unavailable. This page is showing a curated fallback schedule, and ticket purchase stays closed until the real catalog is healthy again."}
              </p>
            </GlassCard>
          </div>
        </section>
      ) : null}

      <motion.section {...revealProps} className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
          {HERO_STATS.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard gold className="h-full px-5 py-6">
                <p className="eyebrow mb-3">{item.label}</p>
                <p className="font-serif text-[2.3rem] font-light tracking-[0.05em] text-[var(--gold)]">
                  {item.value}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-6 sm:px-10 sm:py-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <GlassCard warm className="px-5 py-6 md:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow mb-3">How Mobile Booking Works</p>
                <h2 className="section-title text-[2rem]">
                  From social click to confirmed <em>entry</em>
                </h2>
                <p className="body-copy mt-4 text-white/58">
                  {liveCatalogHealthy
                    ? "The mobile flow is built for speed: choose the event, build the order, and move into secure payment without losing context."
                    : "The mobile flow stays honest when live ticket inventory is offline: review the event, contact the team, or join the list instead of being pushed into a broken purchase path."}
                </p>
              </div>
              <LiquidLinkButton href={featuredCheckoutHref} gold className="w-full justify-center lg:w-auto">
                {featuredEvent?.ticketsAvailable ? "Start Checkout" : "Talk To The Team"}
              </LiquidLinkButton>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  icon: CalendarDays,
                  title: "Choose The Night",
                  body: "Open the live event page, confirm the date, venue, and current access tiers.",
                },
                {
                  icon: ShieldCheck,
                  title: "Build The Order",
                  body: "Ticket quantities, fees, and promo checks happen inside the ZOYA checkout flow.",
                },
                {
                  icon: Sparkles,
                  title: "Receive Confirmation",
                  body: "Paid orders trigger QR delivery and clear arrival instructions before the event.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <item.icon className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="eyebrow mb-2">{item.title}</p>
                  <p className="body-copy text-[0.8rem] text-white/60">{item.body}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Count Down"
            title="The room is almost"
            goldWord="ready"
            subtitle="The next headline ZOYA night is already on the calendar. Tickets, guest flow, and hospitality tiers are structured for an elegant, high-energy evening from first arrival to final close."
          />
          <CountdownTimer
            targetDate={new Date(nextEvent?.countdownIso || SITE.countdownIso)}
            label={nextEvent ? `Until ${nextEvent.title}` : "Next marquee countdown"}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                label: "Event",
                value: nextEvent?.title || "ZOYA signature night",
              },
              {
                icon: MapPin,
                label: "Venue",
                value: nextEvent?.shortVenue || SITE.venue,
              },
              {
                icon: Sparkles,
                label: "Experience",
                value:
                  nextEvent?.shortDescription ||
                  "Black-tie atmosphere with live performance",
              },
            ].map((item) => (
              <GlassCard key={item.label} className="px-5 py-5">
                <item.icon className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                <p className="eyebrow mb-2">{item.label}</p>
                <p className="body-copy text-white/68">{item.value}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Featured Event"
            title={featuredEvent?.title.split(" ").slice(0, -1).join(" ") || "Arab Nights"}
            goldWord={featuredEvent?.title.split(" ").slice(-1).join(" ") || "returns"}
            subtitle={featuredEvent?.description || FEATURED_EVENT.description}
          />
          <GlassCard hover className="grid overflow-hidden rounded-[26px] lg:grid-cols-[1fr_1.08fr]">
            <div className="relative min-h-[360px]">
              <Image
                src={featuredEvent?.coverImageUrl || FEATURED_EVENT.image}
                alt={featuredEvent?.title || FEATURED_EVENT.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 44vw"
              />
            </div>
              <div className="px-6 py-7 md:px-8 md:py-8">
                <p className="eyebrow mb-4">Signature Experience</p>
                <h3 className="section-title text-[2.25rem]">
                  {featuredEvent?.title || FEATURED_EVENT.title} <em>night</em>
                </h3>
                <div className="gold-divider-left mt-5 h-px w-24" />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <GlassCard dark className="px-4 py-4">
                    <p className="eyebrow mb-2">Date</p>
                    <p className="body-copy text-white/70">
                      {featuredEvent?.formattedDate || FEATURED_EVENT.date}
                    </p>
                  </GlassCard>
                  <GlassCard dark className="px-4 py-4">
                    <p className="eyebrow mb-2">Venue</p>
                    <p className="body-copy text-white/70">
                      {featuredEvent?.shortVenue || FEATURED_EVENT.venue}
                    </p>
                  </GlassCard>
                </div>
                <div className="mt-6 grid gap-3">
                  {(
                    featuredEvent?.ticketTypes.length
                      ? [
                          featuredEvent.ticketsAvailable
                            ? "Live checkout is active for this event."
                            : "Ticket inventory is currently unavailable.",
                          `Pricing starts at $${featuredEvent.priceFrom}`,
                          featuredEvent.shortDescription,
                          `${featuredEvent.shortVenue}, ${featuredEvent.cityLine}`,
                        ]
                      : FEATURED_EVENT.details
                  ).map((detail) => (
                    <GlassCard key={detail} className="px-4 py-4">
                      <p className="body-copy text-white/68">{detail}</p>
                    </GlassCard>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <LiquidLinkButton
                    href={featuredCheckoutHref}
                    gold
                    className="w-full justify-center sm:w-auto"
                  >
                    {featuredEvent?.ticketsAvailable ? "Reserve Seats" : "Contact Team"}
                  </LiquidLinkButton>
                  <LiquidLinkButton
                    href={featuredDetailHref}
                    className="w-full justify-center sm:w-auto"
                  >
                    View Event Detail
                  </LiquidLinkButton>
                </div>
              </div>
            </GlassCard>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why ZOYA"
            title="Premium nights need stronger"
            goldWord="control"
            subtitle="We are hired when clients want the evening to feel expensive, effortless, and culturally alive. That takes more than decoration. It takes real production structure."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {WHY_ZOYA.map((item, index) => {
              const icons = [Music4, ShieldCheck, Globe2];
              const Icon = icons[index];

              return (
                <GlassCard key={item.title} hover className="px-6 py-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(198,169,98,0.18),rgba(198,169,98,0.06))]">
                    <Icon className="h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
                  </div>
                  <h3 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                    {item.title}
                  </h3>
                  <div className="gold-divider-left mt-4 h-px w-24" />
                  <p className="body-copy mt-5">{item.body}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Access Options"
            title="Choose the right level of"
            goldWord="arrival"
            subtitle={
              liveCatalogHealthy
                ? "Each tier is structured around sightlines, service flow, and the feeling you want your night to carry. Pricing and availability below are tied to the live event catalog."
                : "These access tiers are representative of the ZOYA guest experience. Live pricing and availability reopen only when the real event catalog is healthy."
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTicketTypes.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard hover className="h-full px-6 py-6">
                  <div
                    className="mb-5 h-1.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${ticket.color}, transparent)` }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow mb-3">Ticket Tier</p>
                      <h3 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                        {ticket.name}
                      </h3>
                    </div>
                    {ticket.badge ? (
                      <span className="liquid-button-gold px-4 py-2 !text-[9px]">{ticket.badge}</span>
                    ) : null}
                  </div>
                  <p className="mt-4 font-serif text-[2.2rem] font-light tracking-[0.04em] text-[var(--gold)]">
                    ${ticket.price}
                  </p>
                  <p className="body-copy mt-4">{ticket.description}</p>
                  <LiquidLinkButton
                    href={featuredCheckoutHref}
                    gold
                    className="mt-7 w-full justify-center"
                  >
                    {liveCatalogHealthy && featuredEvent?.ticketsAvailable
                      ? "Reserve Seat"
                      : "Request Access"}
                  </LiquidLinkButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Services"
            title="Capabilities built for premium"
            goldWord="events"
            subtitle="The same discipline that shapes our public nights is available to private clients, brands, and partners looking for a more controlled event standard."
          />
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {serviceHighlights.map((service) => (
              <GlassCard key={service.title} hover className="h-full px-5 py-6">
                <p className="eyebrow mb-3">{service.category}</p>
                <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                  {service.title}
                </h3>
                <div className="gold-divider-left mt-4 h-px w-20" />
                <p className="body-copy mt-5">{service.summary}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <LiquidLinkButton href="/services" gold>
              View All Services
            </LiquidLinkButton>
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Past Moments"
            title="Proof of atmosphere and"
            goldWord="scale"
            subtitle="A selection of frames from previous productions, capturing the visual texture, room energy, and production finish that define the ZOYA signature."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {galleryHighlights.map((item, index) => (
              <motion.div
                key={`${item.title}-${item.image}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard hover className="overflow-hidden p-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,8,8,0.85))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="eyebrow mb-2">{item.date}</p>
                      <h3 className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <LiquidLinkButton href="/gallery">Open Gallery</LiquidLinkButton>
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Client Voices"
            title="How the experience"
            goldWord="lands"
            subtitle="Our best feedback tends to say the same thing in different ways: the room feels calm, elevated, and fully considered, even when the event energy is high. These are representative client and guest impressions, not live booking metrics."
          />
          <div className="hidden gap-5 lg:grid lg:grid-cols-3">{testimonialCards}</div>
          <div className="lg:hidden">
            <SwipeCarousel items={testimonialCards} />
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Partners"
            title="Trusted by venues, producers, and"
            goldWord="collaborators"
            subtitle="We work best in rooms where quality matters, timing matters, and the brand around the event matters as much as the event itself. These partner references are brand proof, not live event inventory signals."
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((partner) => (
              <GlassCard key={partner} className="flex items-center justify-center px-4 py-6 text-center">
                <p className="eyebrow text-white/28">{partner}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...revealProps} className="px-5 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard gold className="px-6 py-8 text-center md:px-10 md:py-10">
            <p className="eyebrow mb-4">Private Access</p>
            <h2 className="section-title">
              Join the guest list <em>early</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              Receive first access to new releases, private event announcements, premium table
              opportunities, and editorial recaps from ZOYA productions.
            </p>
            <div className="mt-8 flex justify-center">
              <NewsletterForm source="home-cta" />
            </div>
          </GlassCard>
        </div>
      </motion.section>

      <StickyBuyCTA
        href={featuredCheckoutHref}
        price={featuredEvent?.ticketsAvailable ? featuredEvent.priceFrom : undefined}
        label={featuredEvent?.ticketsAvailable ? "Buy Tickets" : "Contact Team"}
      />
    </main>
  );
}
