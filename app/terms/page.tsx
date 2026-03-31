import { GlassCard, PageHero } from "@/components/site/liquid";

const termsSections = [
  {
    title: "Tickets",
    body:
      "Ticket purchases are subject to event-specific availability, tier limits, pricing updates, and published access conditions. Entry is granted only to valid ticket holders under the event policies in effect at the time of admission.",
  },
  {
    title: "Refunds",
    body:
      "Refund and cancellation rules depend on the event and ticket type. Where refunds are permitted, they are processed according to the payment and platform terms presented at checkout or inside a service agreement.",
  },
  {
    title: "Event Rules",
    body:
      "Guests are expected to follow venue guidance, event dress expectations, entry instructions, and conduct standards. VibeUp reserves the right to refuse entry or remove attendees whose behavior disrupts safety or guest experience.",
  },
  {
    title: "Liability",
    body:
      "VibeUp is not responsible for losses caused by venue changes, artist substitutions, force majeure, or conditions outside reasonable operational control. Where required, rescheduling or credit options may be offered.",
  },
  {
    title: "Contact",
    body:
      "Questions about tickets, service agreements, payments, or event rules should be directed to VibeUp through the official contact channels listed on this site.",
  },
] as const;

export default function TermsPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Terms"
        title="The rules that support the guest"
        goldWord="experience"
        description="These terms explain the basic rules for ticketing, attendance, event conduct, payments, and the operating limitations of the VibeUp platform."
        align="center"
      />

      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-5">
          {termsSections.map((section) => (
            <GlassCard key={section.title} className="px-6 py-6 md:px-8">
              <p className="eyebrow mb-3">{section.title}</p>
              <h2 className="font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                {section.title}
              </h2>
              <div className="gold-divider-left mt-4 h-px w-20" />
              <p className="body-copy mt-5">{section.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  );
}
