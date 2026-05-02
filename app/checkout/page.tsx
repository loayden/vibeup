import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

import { CheckoutExperience } from "@/components/site/checkout-experience";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import {
  getCheckoutEventContext,
  getCheckoutUnavailableMessage,
  getTrustMessagingForEvent,
} from "@/lib/public-events";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Build a real VibeUp order, continue through secure Stripe payment, and receive confirmed ticket delivery after payment succeeds.",
};

type CheckoutPageProps = {
  searchParams: Promise<{
    event?: string;
    cancelled?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { event: requestedEventSlug, cancelled } = await searchParams;
  const event = await getCheckoutEventContext(requestedEventSlug || "arab-nights");
  const unavailableMessage = getCheckoutUnavailableMessage();
  const trustSignals = getTrustMessagingForEvent(event);
  const checkoutReady = Boolean(event?.id && event.ticketsAvailable);

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Checkout"
        title="Build your order with more"
        goldWord="control"
        description={
          checkoutReady
            ? "Choose the ticket tiers that fit your night, create the order inside VibeUp, and continue into secure Stripe payment without leaving the VibeUp commerce flow."
            : unavailableMessage
        }
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src={event?.coverImageUrl || "/arabnights-1200.webp"}
                alt={event?.title || "VibeUp checkout"}
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
            <LiquidLinkButton href={event ? `/events/${event.slug}` : "/events"} gold>
              {event ? "View Event Detail" : "Browse Events"}{" "}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">
              Need Group Support?
            </LiquidLinkButton>
          </>
        }
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              label: "First-Party Order",
              body: checkoutReady
                ? "Your order is created inside the VibeUp platform before card payment begins, so order state, totals, and customer details stay in one system."
                : "Live event inventory is unavailable, so checkout is intentionally blocked instead of sending guests into an unreliable purchase flow.",
            },
            {
              icon: CheckCircle2,
              label: "Confirmed Delivery",
              body: "Confirmation email and QR tickets are issued only after Stripe confirms a successful payment through the webhook flow.",
            },
            {
              icon: Sparkles,
              label: "Inventory Awareness",
              body: "Ticket quantities, sold-out tiers, fees, and promo validation are calculated from the live event catalog rather than static marketing data.",
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="px-5 py-5">
              <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="body-copy text-white/68">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 pt-2 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <GlassCard warm className="px-5 py-5 md:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Step 1: choose quantity by live ticket tier.",
                "Step 2: create the order inside VibeUp with your contact details.",
                "Step 3: complete card payment in Stripe and receive QR delivery after confirmation.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <p className="body-copy text-[0.8rem] text-white/62">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Ticket Selection"
            title="Select tiers with live"
            goldWord="pricing"
            subtitle="Choose quantity by access tier, validate any promo code, and move into secure Stripe Checkout with a real VibeUp order already created."
          />
          <CheckoutExperience
            event={event}
            trustSignals={trustSignals}
            unavailableMessage={unavailableMessage}
            wasCancelled={cancelled === "true"}
          />
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {[
            {
              title: "Order Ownership",
              body: "VibeUp now owns the order record from the start of checkout, which means the team can see customer details, totals, ticket items, and post-payment status in the admin dashboard.",
            },
            {
              title: "Ticket Delivery",
              body: "Paid orders flow through Stripe webhook confirmation, QR ticket generation, and transactional email delivery before the guest arrives at the venue.",
            },
            {
              title: "Support",
              body: `If live inventory is unavailable or you need concierge help, contact ${SITE.email} before directing guests into checkout.`,
            },
          ].map((item) => (
            <GlassCard key={item.title} warm className="h-full px-6 py-6">
              <p className="eyebrow mb-3">{item.title}</p>
              <h3 className="font-serif text-[1.9rem] font-light tracking-[0.05em] text-white">
                {item.title}
              </h3>
              <div className="gold-divider-left mt-4 h-px w-20" />
              <p className="body-copy mt-5">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard gold className="px-6 py-7 md:px-8">
            <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="eyebrow mb-4">Concierge Help</p>
                <h2 className="section-title text-[2.2rem]">
                  Need support before you <em>pay</em>
                </h2>
                <p className="body-copy mt-5">
                  Group seating, inventory clarification, or guest questions can be handled before
                  payment so the mobile checkout stays clean.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${SITE.email}`}
                  className="rounded-[18px] border border-[rgba(198,169,98,0.18)] bg-[rgba(198,169,98,0.05)] px-4 py-4"
                >
                  <Mail className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="eyebrow mb-2 text-[var(--gold)]">Email Team</p>
                  <p className="body-copy text-[0.8rem] text-white/62">{SITE.email}</p>
                </a>
                <a
                  href={SITE.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[18px] border border-[rgba(198,169,98,0.18)] bg-[rgba(198,169,98,0.05)] px-4 py-4"
                >
                  <Phone className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="eyebrow mb-2 text-[var(--gold)]">Guest Support</p>
                  <p className="body-copy text-[0.8rem] text-white/62">
                    WhatsApp for time-sensitive ticket help
                  </p>
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
