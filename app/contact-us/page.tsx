import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { LazyMap } from "@/components/site/lazy-map";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact VibeUp for private events, partnerships, cultural programs, premium celebrations, and ticketing support.",
};

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Contact"
        title="Let's plan something more"
        goldWord="memorable"
        description="For private events, partnerships, cultural programs, and luxury celebrations, send us the essentials and we will respond with a clear next step. We typically reply within 24 hours."
        align="center"
      />

      <section className="px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            {
              icon: Mail,
              label: "Email",
              value: SITE.email,
              href: `mailto:${SITE.email}`,
            },
            {
              icon: Phone,
              label: "Phone",
              value: `${SITE.phonePrimary} / ${SITE.phoneSecondary}`,
              href: "tel:+19492479309",
            },
            {
              icon: MapPin,
              label: "Base",
              value: SITE.city,
              href: "https://maps.apple.com/?q=Los+Angeles,+CA",
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="px-5 py-5">
              <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block min-h-[52px]">
                <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                <p className="eyebrow mb-2">{item.label}</p>
                <p className="body-copy text-white/68">{item.value}</p>
              </a>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-5 pt-2 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <GlassCard warm className="px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-2">Need Ticket Support Faster</p>
                <p className="body-copy text-white/64">
                  For guest-access or time-sensitive event questions, mobile buyers should use the
                  fastest channel first.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LiquidLinkButton href={SITE.socials.whatsapp} gold external>
                  WhatsApp Support
                </LiquidLinkButton>
                <LiquidLinkButton href={`mailto:${SITE.email}`} external>
                  Email Team
                </LiquidLinkButton>
                <LiquidLinkButton href="/orders/find">
                  Find Order
                </LiquidLinkButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <GlassCard className="px-6 py-7 md:px-8">
            <SectionHeader
              eyebrow="Enquiry Form"
              title="Tell us what you are"
              goldWord="building"
              subtitle="The strongest briefs usually include a date window, audience estimate, venue direction, and the kind of atmosphere you want the room to hold."
              centered={false}
            />
            <ContactForm />
          </GlassCard>

          <div className="space-y-6">
            <GlassCard warm className="px-6 py-6">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                <p className="eyebrow">Working Rhythm</p>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  "Monday to Friday, 9:00 AM to 6:00 PM PST",
                  "Weekend consultations by appointment",
                  "Urgent production requests reviewed case by case",
                ].map((item) => (
                  <div key={item} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="body-copy text-white/68">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="px-6 py-6">
              <p className="eyebrow mb-4">What Happens Next</p>
              <div className="space-y-4">
                {[
                  "We review the brief and confirm whether the project fits our production scope.",
                  "If it does, we respond with a consultation path, clarifying questions, or an outline for proposal development.",
                  "For time-sensitive events, we prioritize timeline feasibility and vendor availability first.",
                ].map((item) => (
                  <div key={item} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="body-copy text-white/68">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard gold className="px-6 py-6">
              <p className="eyebrow mb-4">Social Channels</p>
              <div className="flex flex-wrap gap-3">
                <LiquidLinkButton href={SITE.socials.whatsapp} gold external>
                  WhatsApp
                </LiquidLinkButton>
                <LiquidLinkButton href={SITE.socials.facebook} external>
                  Facebook
                </LiquidLinkButton>
                <LiquidLinkButton href={SITE.socials.instagram} external>
                  Instagram
                </LiquidLinkButton>
                <LiquidLinkButton href={SITE.socials.tiktok} external>
                  TikTok
                </LiquidLinkButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Find Us"
            title="Los Angeles remains our operating"
            goldWord="center"
            subtitle="Most VibeUp productions are anchored in Los Angeles, with project support available for expansion markets and destination opportunities."
          />

          <LazyMap
            embedUrl="https://www.google.com/maps?q=Los%20Angeles%2C%20CA&z=11&output=embed"
            openUrl="https://maps.apple.com/?q=Los+Angeles,+CA"
          />
        </div>
      </section>
    </main>
  );
}
