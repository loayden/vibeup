import { ArrowRight, Sparkles, Users2, Wand2 } from "lucide-react";

import { CareersBoard } from "@/components/site/careers-board";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { CAREER_BENEFITS, OPEN_POSITIONS } from "@/lib/site-data";

export default function CareersPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Careers"
        title="Join the team behind premium"
        goldWord="experiences"
        description="We are building a company where creative taste, production discipline, hospitality standards, and community understanding all matter. If that combination suits how you like to work, we want to hear from you."
        align="center"
        actions={
          <>
            <LiquidLinkButton href="#open-roles" gold>
              View Open Roles <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
            </LiquidLinkButton>
            <LiquidLinkButton href="/about">Learn About VibeUp</LiquidLinkButton>
          </>
        }
      />

      <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why Work Here"
            title="A team culture built around quality and"
            goldWord="growth"
            subtitle="We are not interested in chaotic production culture. We want people who like strong taste, clear standards, and work that leaves a visible result in the room."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {CAREER_BENEFITS.map((benefit, index) => {
              const icons = [Sparkles, Wand2, Users2];
              const Icon = icons[index];

              return (
                <GlassCard key={benefit.title} gold hover className="h-full px-6 py-7">
                  <Icon className="mb-5 h-5 w-5 text-[var(--gold)]" strokeWidth={1.2} />
                  <h3 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                    {benefit.title}
                  </h3>
                  <div className="gold-divider-left mt-4 h-px w-20" />
                  <p className="body-copy mt-5">{benefit.body}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Open Positions"
            title="Current roles and application"
            goldWord="flow"
            subtitle="Choose a role that matches your background, then send a concise application with links that show your thinking and your work."
          />
          <CareersBoard positions={OPEN_POSITIONS} />
        </div>
      </section>
    </main>
  );
}
