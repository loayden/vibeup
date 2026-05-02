import type { Metadata } from "next";
import { GlassCard, PageHero } from "@/components/site/liquid";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Review how VibeUp collects, uses, stores, and shares guest, booking, and communication data.",
};

const privacySections = [
  {
    title: "Data Collection",
    body:
      "We collect the information you provide through bookings, contact forms, subscriptions, and account creation. This may include your name, email address, phone number, booking details, and event preferences.",
  },
  {
    title: "How We Use Data",
    body:
      "We use collected information to manage bookings, communicate event updates, issue tickets, respond to enquiries, improve the guest experience, and maintain the operational quality of the VibeUp platform.",
  },
  {
    title: "Third Parties",
    body:
      "We work with trusted providers such as Supabase, Stripe, and Resend to support authentication, payments, email delivery, and secure infrastructure. These providers process only the data needed for their role.",
  },
  {
    title: "Cookies",
    body:
      "Cookies and related technologies are used for session management, authentication continuity, and basic site performance. We do not sell personal data and we keep tracking use limited and purpose-driven.",
  },
  {
    title: "Contact",
    body:
      "If you need to review, correct, or delete your data, contact VibeUp Events & Services through the contact page and include enough detail for us to locate the relevant account or booking record.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Privacy"
        title="How VibeUp handles your"
        goldWord="information"
        description="This summary explains what information we collect, why we use it, and how it supports bookings, communication, and the broader operation of the VibeUp platform."
        align="center"
      />

      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-5">
          {privacySections.map((section) => (
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
