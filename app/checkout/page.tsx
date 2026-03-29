import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

import { CheckoutExperience } from "@/components/site/checkout-experience";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { SITE } from "@/lib/site-data";

export default function CheckoutPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Checkout"
        title="Reserve your place before the room"
        goldWord="fills"
        description="Choose the ticket tiers that fit your night, save your reservation, and continue into final purchase. This experience is designed to keep ticket selection calm, clear, and premium from the first click."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src="/arabnights.jpeg"
                alt="Arab Nights checkout"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </GlassCard>
        }
        actions={
          <>
            <LiquidLinkButton href={SITE.buyUrl} gold external>
              Official Ticket Page <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/events/arab-nights">View Event Detail</LiquidLinkButton>
          </>
        }
      />

      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              label: "Secure Flow",
              body: "Reservation details are captured before final payment so your ticket intent is clear and trackable.",
            },
            {
              icon: CheckCircle2,
              label: "Fast Confirmation",
              body: "Once payment is completed, the system is prepared to issue instant order confirmation and QR-based delivery.",
            },
            {
              icon: Sparkles,
              label: "Luxury Access",
              body: "Every tier is structured around arrival quality, room feel, and a stronger guest-experience standard.",
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

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Ticket Selection"
            title="Build your order with more"
            goldWord="clarity"
            subtitle="Select quantity by tier, save your contact details, and move to the official payment step with a cleaner understanding of what you are buying."
          />
          <CheckoutExperience />
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {[
            {
              title: "Arrival Standard",
              body: "Doors open into a guided guest journey with a stronger sense of ceremony, room control, and premium hospitality.",
            },
            {
              title: "Ticket Delivery",
              body: "Paid orders are prepared for immediate confirmation, QR ticket generation, and entrance validation at the event.",
            },
            {
              title: "Support",
              body: "If you need group coordination, a private table, or concierge help, contact the team before finalizing your order.",
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
    </main>
  );
}
