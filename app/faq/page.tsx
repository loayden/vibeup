import { FaqShowcase } from "@/components/site/faq-showcase";
import { GlassCard, LiquidLinkButton, PageHero, SectionHeader } from "@/components/site/liquid";
import { FAQ_GROUPS } from "@/lib/site-data";

export default function FaqPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="FAQ"
        title="Answers for guests, clients, and event"
        goldWord="partners"
        description="This page covers the questions we hear most often around tickets, event policies, private bookings, payments, and the way VibeUp works behind the scenes."
        align="center"
      />

      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            "Ticketing, refunds, and guest-entry questions are answered here before checkout friction starts.",
            "Service and production questions help private clients understand how we scope projects and timelines.",
            "If you need a faster answer, contact the team directly and we will point you to the right next step.",
          ].map((item, index) => (
            <GlassCard key={item} gold={index === 1} className="px-5 py-5">
              <p className="body-copy text-white/68">{item}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Support"
            title="Browse the most common"
            goldWord="questions"
            subtitle="Switch between categories to find answers for general event information, ticketing, services, and payment-related concerns."
          />
          <FaqShowcase groups={FAQ_GROUPS} />
        </div>
      </section>

      <section className="px-6 pt-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <GlassCard warm className="px-6 py-8 text-center md:px-10 md:py-10">
            <p className="eyebrow mb-4">Still Need Help</p>
            <h2 className="section-title">
              Speak with the team <em>directly</em>
            </h2>
            <p className="body-copy mx-auto mt-5 max-w-2xl">
              If the answer is not here, send us a message with your event, ticket, or booking
              question and we will respond with clear guidance.
            </p>
            <div className="mt-8 flex justify-center">
              <LiquidLinkButton href="/contact-us" gold>
                Contact VibeUp
              </LiquidLinkButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
