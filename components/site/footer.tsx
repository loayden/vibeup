import Link from "next/link";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { GlassCard } from "@/components/site/liquid";
import { NAV_LINKS, SECONDARY_NAV_LINKS, SITE } from "@/lib/site-data";

const footerGroups = [
  {
    title: "Navigation",
    links: NAV_LINKS,
  },
  {
    title: "Explore",
    links: SECONDARY_NAV_LINKS,
  },
  {
    title: "Admin",
    links: [{ href: "/admin/dashboard", label: "Dashboard" }],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-6 pb-8 pt-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <GlassCard warm className="px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
            <div className="space-y-5">
              <p className="eyebrow">VibeUp Events & Services</p>
              <h3 className="section-title text-[2rem]">
                Elevated nights, refined <em>execution</em>
              </h3>
              <p className="body-copy max-w-md">
                We build events for clients who want atmosphere, structure, and a
                luxury standard that holds from arrival to final departure.
              </p>
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
              <p className="body-copy">{SITE.email}</p>
              <p className="body-copy">{SITE.phonePrimary}</p>
              <p className="body-copy">{SITE.phoneSecondary}</p>
              <div className="h-px subtle-divider" />
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
            <Link href={SITE.socials.whatsapp} className="eyebrow text-white/30 transition hover:text-[var(--gold)]">
              WhatsApp
            </Link>
            <Link href={SITE.socials.facebook} className="eyebrow text-white/30 transition hover:text-[var(--gold)]">
              Facebook
            </Link>
            <Link href={SITE.socials.instagram} className="eyebrow text-white/30 transition hover:text-[var(--gold)]">
              Instagram
            </Link>
            <Link href={SITE.socials.tiktok} className="eyebrow text-white/30 transition hover:text-[var(--gold)]">
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
