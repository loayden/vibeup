import { ArrowRight, Award, Building2, Globe2, Quote, Sparkles } from "lucide-react";
import Image from "next/image";

import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import {
  AWARDS,
  MILESTONES,
  PARTNERS,
  PRESS_QUOTES,
  SITE,
  TEAM,
  VALUES,
} from "@/lib/site-data";

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="About VibeUp"
        title="Building culture through premium"
        goldWord="experiences"
        description="VibeUp Events & Services was founded in Los Angeles to produce nights that feel elegant, emotionally resonant, and operationally sharp. We work where cultural relevance, hospitality, and luxury presentation need to live in the same room without friction."
        media={
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[18px]">
              <Image
                src="/gala-hero.jpg"
                alt="VibeUp gala room"
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
            <LiquidLinkButton href="/events" gold>
              Explore Events <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/contact-us">
              Book A Consultation
            </LiquidLinkButton>
          </>
        }
      />

      <section className="px-6 py-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard gold className="px-6 py-8 text-center md:px-10 md:py-10">
            <Quote className="mx-auto h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="mt-6 font-serif text-[2rem] font-light leading-relaxed tracking-[0.05em] text-white md:text-[2.5rem]">
              We produce events for clients who want the room to feel expensive, the timing to
              feel calm, and the memory to last longer than the moment itself.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="overflow-hidden p-3">
            <div className="relative min-h-[540px] overflow-hidden rounded-[18px]">
              <Image
                src="/VIBEUP22.jpeg"
                alt="VibeUp story"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </GlassCard>

          <div>
            <SectionHeader
              eyebrow="Our Story"
              title="Founded in Los Angeles, built for a wider"
              goldWord="audience"
              subtitle="Since 2018, VibeUp has grown from boutique cultural activations into a premium event company producing public nights, private celebrations, and branded experiences with the same luxury-standard operating model."
              centered={false}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  label: "Base Market",
                  value: SITE.city,
                  body: "Los Angeles remains the center of our venue network, audience insight, and creative identity.",
                },
                {
                  label: "Community Reach",
                  value: "Arab-American and beyond",
                  body: "Our work resonates with culturally engaged guests while staying premium and globally legible.",
                },
                {
                  label: "Operating Style",
                  value: "Luxury with discipline",
                  body: "We balance atmosphere, elegance, and operational control instead of overproduced noise.",
                },
                {
                  label: "Client Promise",
                  value: "Full-service clarity",
                  body: "Planning, production, hospitality, and storytelling move under one clear creative direction.",
                },
              ].map((item) => (
                <GlassCard key={item.label} dark className="px-5 py-5">
                  <p className="eyebrow mb-3">{item.label}</p>
                  <p className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                    {item.value}
                  </p>
                  <p className="body-copy mt-4">{item.body}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Values"
            title="Standards that shape the"
            goldWord="brand"
            subtitle="Luxury means very little without substance. These are the internal standards that guide how we design, communicate, and execute every project."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {VALUES.map((value, index) => {
              const icons = [Sparkles, Globe2, Building2];
              const Icon = icons[index];

              return (
                <GlassCard key={value.title} gold hover className="h-full px-6 py-7">
                  <Icon className="mb-5 h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
                  <h3 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                    {value.title}
                  </h3>
                  <div className="gold-divider-left mt-4 h-px w-20" />
                  <p className="body-copy mt-5">{value.body}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Leadership"
            title="The team behind the"
            goldWord="experience"
            subtitle="The company is intentionally cross-functional. Creative direction, production management, partnerships, and audience strategy all sit close enough together to keep quality high and decisions fast."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {TEAM.map((member) => (
              <GlassCard key={member.name} hover className="h-full px-6 py-6">
                <p className="eyebrow mb-3">{member.role}</p>
                <h3 className="font-serif text-[1.9rem] font-light tracking-[0.05em] text-white">
                  {member.name}
                </h3>
                <div className="gold-divider-left mt-4 h-px w-20" />
                <p className="body-copy mt-5">{member.bio}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Milestones"
            title="How the company has"
            goldWord="grown"
            subtitle="Each stage of growth was tied to stronger room scale, broader audience trust, and a sharper operational model."
          />

          <div className="space-y-5">
            {MILESTONES.map((milestone) => (
              <GlassCard key={milestone.year} className="px-6 py-6 md:px-8">
                <div className="grid gap-5 lg:grid-cols-[180px_1fr] lg:items-start">
                  <div>
                    <p className="eyebrow mb-3">Year</p>
                    <p className="font-serif text-[2.4rem] font-light tracking-[0.05em] text-[var(--gold)]">
                      {milestone.year}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                      {milestone.title}
                    </h3>
                    <div className="gold-divider-left mt-4 h-px w-24" />
                    <p className="body-copy mt-5">{milestone.body}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <GlassCard className="px-6 py-6">
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow">Awards & Recognition</p>
            </div>

            <div className="mt-5 space-y-4">
              {AWARDS.map((award) => (
                <div key={award.title} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                  <p className="font-serif text-[1.5rem] font-light tracking-[0.05em] text-white">
                    {award.title}
                  </p>
                  <p className="body-copy mt-3 text-white/68">{award.issuer}</p>
                  <p className="eyebrow mt-3 text-white/28">{award.year}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="px-6 py-6">
            <p className="eyebrow mb-4">Partners & Press</p>

            <div className="grid gap-4 md:grid-cols-2">
              {PARTNERS.map((partner) => (
                <div key={partner} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                  <p className="eyebrow text-white/28">{partner}</p>
                </div>
              ))}
            </div>

            <div className="subtle-divider mt-6 h-px" />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {PRESS_QUOTES.map((item) => (
                <GlassCard key={item.source} dark className="px-5 py-5">
                  <p className="eyebrow mb-3">{item.source}</p>
                  <p className="font-serif text-[1.6rem] font-light leading-snug text-white">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="px-6 pt-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard warm className="px-6 py-8 text-center md:px-10 md:py-10">
            <p className="eyebrow mb-4">Work With VibeUp</p>
            <h2 className="section-title">
              Ready to create something more <em>intentional</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              If you want a public event, private celebration, or branded experience that feels
              polished from first invite to final exit, start the conversation with our team.
            </p>
            <div className="mt-8 flex justify-center">
              <LiquidLinkButton href="/contact-us" gold>
                Start A Conversation
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
