import { ArrowRight, Layers3, Megaphone, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";

import { LiquidAccordion } from "@/components/site/accordion";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { ServiceCatalog } from "@/components/site/service-catalog";
import {
  SERVICE_ADDONS,
  SERVICE_PACKAGES,
  SERVICE_PROCESS,
  SERVICES,
} from "@/lib/site-data";

const serviceFaq = [
  {
    question: "Do you only produce public ticketed events?",
    answer:
      "No. VibeUp produces public, private, corporate, and partner-led experiences. The same production standards can be scaled to intimate dinners or large live events.",
  },
  {
    question: "Can you handle creative direction as well as logistics?",
    answer:
      "Yes. We regularly lead both the visual narrative and the operational system so the event feels coherent from brand language to on-site timing.",
  },
  {
    question: "Do you work with existing vendors or only your own network?",
    answer:
      "Both. We can integrate trusted client vendors when they meet project requirements, or we can build the partner stack from our own network.",
  },
  {
    question: "How involved are you on event day?",
    answer:
      "We stay deeply involved on event day. Production leadership, coordination, troubleshooting, and guest-facing rhythm are part of the service, not an afterthought.",
  },
  {
    question: "Can you support sponsorship strategy and partner moments?",
    answer:
      "Yes. Sponsorship planning, activation design, placement strategy, and partner reporting are part of our commercial support offering.",
  },
  {
    question: "Do you help with recurring event series?",
    answer:
      "Yes. We can help structure a full event line with repeatable standards, creative evolution, stronger data capture, and better long-term growth decisions.",
  },
] as const;

export default function ServicesPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Services"
        title="Luxury production for events that need more"
        goldWord="control"
        description="We provide planning, creative direction, marketing, technical production, hospitality, and operating structure for events that need to look refined, feel smooth, and perform well commercially."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src="/stage.jpg"
                alt="VibeUp services"
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
            <LiquidLinkButton href="/contact-us" gold>
              Request A Quote <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/events">See Live Examples</LiquidLinkButton>
          </>
        }
      />

      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            {
              icon: Sparkles,
              label: "Event Planning",
              body: "Luxury strategy and guest flow architecture.",
            },
            {
              icon: Megaphone,
              label: "Marketing",
              body: "Audience positioning, launch, and conversion support.",
            },
            {
              icon: Layers3,
              label: "Production",
              body: "Sound, stage, vendors, staffing, and execution control.",
            },
            {
              icon: Wand2,
              label: "Creative",
              body: "Visual language, experience styling, and premium presentation.",
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

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Capabilities"
            title="The full service"
            goldWord="catalog"
            subtitle="Select a category to view the operating areas we handle most often for luxury public nights, private events, and branded experiences."
          />
          <ServiceCatalog services={SERVICES} />
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Process"
            title="A cleaner path from idea to live"
            goldWord="execution"
            subtitle="The experience feels smooth for guests because the work is structured carefully behind the scenes."
          />

          <div className="grid gap-5 lg:grid-cols-5">
            {SERVICE_PROCESS.map((step) => (
              <GlassCard key={step.title} hover className="h-full px-5 py-6">
                <p className="eyebrow mb-3">{step.title}</p>
                <h3 className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                  {step.title}
                </h3>
                <div className="gold-divider-left mt-4 h-px w-16" />
                <p className="body-copy mt-5">{step.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Packages"
            title="Flexible support at the right"
            goldWord="scale"
            subtitle="Pricing is shaped by guest count, technical complexity, creative ambition, and commercial scope. These tiers help frame the conversation."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {SERVICE_PACKAGES.map((pkg, index) => (
              <GlassCard
                key={pkg.title}
                gold={index === 1}
                hover
                className="h-full px-6 py-7"
              >
                <p className="eyebrow mb-3">{pkg.title}</p>
                <h3 className="font-serif text-[2.1rem] font-light tracking-[0.05em] text-white">
                  {pkg.title}
                </h3>
                <p className="mt-4 font-serif text-[2rem] font-light tracking-[0.05em] text-[var(--gold)]">
                  {pkg.price}
                </p>
                <div className="gold-divider-left mt-5 h-px w-20" />
                <p className="body-copy mt-5">{pkg.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard gold className="px-6 py-7 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="eyebrow mb-4">Add-On Services</p>
                <h3 className="section-title text-[2.3rem]">
                  Enhancements that elevate the guest <em>memory</em>
                </h3>
                <p className="body-copy mt-5">
                  These add-ons are frequently layered into private or high-visibility events to
                  sharpen perceived value and strengthen guest retention.
                </p>
              </div>

              <div className="grid gap-3">
                {SERVICE_ADDONS.map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[rgba(198,169,98,0.2)] bg-[rgba(198,169,98,0.05)] px-4 py-4"
                  >
                    <p className="body-copy text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Questions"
            title="Common service"
            goldWord="answers"
            subtitle="A few of the questions clients ask before we move into consultation, planning, and proposal development."
          />
          <LiquidAccordion items={serviceFaq} />
        </div>
      </section>

      <section className="px-6 pt-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard warm className="px-6 py-8 text-center md:px-10 md:py-10">
            <p className="eyebrow mb-4">Next Step</p>
            <h2 className="section-title">
              Request a custom <em>quote</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              If you have a date range, venue direction, guest estimate, or a rough budget, that is
              enough to start a serious conversation with us.
            </p>
            <div className="mt-8 flex justify-center">
              <LiquidLinkButton href="/contact-us" gold>
                Request A Custom Quote
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
