"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Mail, Phone, X } from "lucide-react";

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

function FooterAccordion({ title, links }: { title: string; links: ReadonlyArray<{ href: string; label: string }> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="group" open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
      <summary className="flex min-h-[44px] items-center justify-between cursor-pointer list-none">
        <p className="eyebrow">{title}</p>
        <X className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} strokeWidth={1.2} />
      </summary>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block py-2 text-sm text-white/80 hover:text-[var(--gold)]">
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-5 pb-8 pt-8 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <GlassCard warm className="px-5 py-6 md:px-8 md:py-10">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.15fr]">
            <div className="space-y-5 sm:col-span-2 lg:col-span-1">
              <p className="eyebrow">ZOYA Events & Services</p>
              <h3 className="section-title text-[2rem]">
                Elevated nights, refined <em>execution</em>
              </h3>
              <p className="body-copy max-w-md">
                Browse events, buy tickets, or contact the team for private celebrations.
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
              <div key={group.title} className="hidden lg:block">
                <p className="eyebrow mb-4">{group.title}</p>
                <div className="space-y-2.5">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="body-copy block transition hover:text-[var(--gold)]">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="lg:hidden space-y-4">
              {footerGroups.map((group) => (
                <FooterAccordion key={group.title} title={group.title} links={group.links} />
              ))}
            </div>

            <div className="space-y-4">
              <p className="eyebrow">Stay Close</p>
              <div className="space-y-3">
                <Link href={`mailto:${SITE.email}`} className="body-copy block transition hover:text-[var(--gold)]">
                  {SITE.email}
                </Link>
                <Link href="tel:+19492479309" className="body-copy block transition hover:text-[var(--gold)]">
                  {SITE.phonePrimary}
                </Link>
                <Link href="tel:+19178187850" className="body-copy block transition hover:text-[var(--gold)]">
                  {SITE.phoneSecondary}
                </Link>
              </div>
              <div className="h-px subtle-divider" />
              <p className="body-copy text-[0.78rem] text-white/50">
                Subscribe for early ticket releases and future event reminders.
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
            className="body-copy inline-flex items-center justify-center gap-2 text-[0.74rem] transition hover:text-[var(--gold)] md:justify-start"
          >
            <span className="text-white/40">Powered by</span>
            <span style={{ color: "rgba(147, 108, 224, 0.94)" }}>FR</span>
            <span style={{ color: "var(--gold)" }}>ع</span>
          </Link>
          <div className="flex gap-4 justify-center py-4 lg:justify-end lg:py-0">
            <Link
              href={`mailto:${SITE.email}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Mail className="h-4 w-4 text-white" strokeWidth={1.2} />
            </Link>
            <Link
              href={`tel:+19492479309`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Phone className="h-4 w-4 text-white" strokeWidth={1.2} />
            </Link>
            <Link
              href={SITE.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span className="text-sm font-semibold text-white">W</span>
            </Link>
            <Link
              href={SITE.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Facebook className="h-4 w-4 text-white" strokeWidth={1.2} />
            </Link>
            <Link
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Instagram className="h-4 w-4 text-white" strokeWidth={1.2} />
            </Link>
            <Link
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span className="text-sm font-semibold text-white">TT</span>
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="body-copy text-xs text-white/40">
            © 2026 ZOYA · <Link href="/terms" className="hover:text-[var(--gold)]">Terms</Link> · <Link href="/privacy" className="hover:text-[var(--gold)]">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
