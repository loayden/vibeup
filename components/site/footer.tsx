import Link from "next/link";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { GlassCard } from "@/components/site/liquid";
import { NAV_LINKS, SITE } from "@/lib/site-data";

const footerGroups = [
  {
    title: "Navigation",
    links: NAV_LINKS.filter((link) => link.href !== "/"),
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact-us", label: "Contact" },
      { href: "/services", label: "Private Events" },
      { href: "/checkout", label: "Buy Tickets" },
      { href: "/orders/find", label: "Find Order" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Journal" },
      { href: "/careers", label: "Careers" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-6 pb-8 pt-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <GlassCard warm className="px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1.15fr]">
            <div className="space-y-5">
              <p className="eyebrow">ZOYA Events & Services</p>
              <h3 className="section-title text-[2rem]">
                Elevated nights, refined <em>execution</em>
              </h3>
              <p className="body-copy max-w-md">
                We build events for clients who want atmosphere, structure, and a
                luxury standard that holds from arrival to final departure.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/checkout" className="liquid-button-gold w-full justify-center sm:w-auto">
                  Buy Tickets
                </Link>
                <Link
                  href={SITE.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-button-ghost w-full justify-center sm:w-auto"
                >
                  WhatsApp
                </Link>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-4">{group.title}</p>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="body-copy block transition hover:text-white/72">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-4">
              <p className="eyebrow">Stay Close</p>
              <div className="space-y-3">
                <Link href={`mailto:${SITE.email}`} className="body-copy block transition hover:text-white/72">
                  {SITE.email}
                </Link>
                <Link href="tel:+19492479309" className="body-copy block transition hover:text-white/72">
                  {SITE.phonePrimary}
                </Link>
                <Link href="tel:+19178187850" className="body-copy block transition hover:text-white/72">
                  {SITE.phoneSecondary}
                </Link>
              </div>
              <div className="h-px subtle-divider" />
              <p className="body-copy text-[0.78rem] text-white/50">
                Mobile guests can subscribe here and get early access to releases, table drops,
                and future event reminders.
              </p>
              <NewsletterForm compact source="footer" />
            </div>
          </div>
        </GlassCard>

        <div className="mt-6 flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <Link
            href={SITE.frInstagram}
            target="_blank"
            rel="noreferrer"
            className="body-copy inline-flex items-center justify-center gap-2 text-[0.74rem] transition hover:text-white/72 md:justify-start"
          >
            <span className="text-white/40">Powered by</span>
            <span style={{ color: "rgba(147, 108, 224, 0.94)" }}>FR</span>
            <span style={{ color: "var(--gold)" }}>ع</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <Link
              href={SITE.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-white/30 transition hover:text-[var(--gold)]"
            >
              WhatsApp
            </Link>
            <Link
              href={SITE.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-white/30 transition hover:text-[var(--gold)]"
            >
              Facebook
            </Link>
            <Link
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-white/30 transition hover:text-[var(--gold)]"
            >
              Instagram
            </Link>
            <Link
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-white/30 transition hover:text-[var(--gold)]"
            >
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
