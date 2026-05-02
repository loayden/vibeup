"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  HelpCircle,
  Image as ImageIcon,
  Mail,
  Menu,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SITE } from "@/lib/site-data";

const EASING = [0.22, 1, 0.36, 1] as const;

const DESKTOP_LEFT = [
  { label: "Events", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

const DESKTOP_RIGHT = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
] as const;

const MOBILE_PRIMARY = [
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Buy Tickets", href: "/checkout", icon: Ticket },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Contact", href: "/contact-us", icon: Mail },
] as const;

const MOBILE_SECONDARY = [
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "About", href: "/about", icon: UserRound },
  { label: "Find Order", href: "/orders/find", icon: Ticket },
  { label: "Journal", href: "/blog", icon: ArrowRight },
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function DesktopNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className="group relative flex min-h-[44px] items-center px-3 py-2"
      style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: "9px",
        letterSpacing: "0.30em",
        fontWeight: 300,
        textTransform: "uppercase",
        color: active ? "rgba(198,169,98,0.84)" : "rgba(255,255,255,0.45)",
      }}
    >
      {label}
      <span
        className="absolute bottom-1 left-3 h-px transition-all duration-300"
        style={{
          width: active ? "calc(100% - 24px)" : "0%",
          background: "linear-gradient(90deg, rgba(198,169,98,0.68), transparent)",
        }}
      />
      <span
        className="absolute bottom-1 left-3 h-px w-0 transition-all duration-300 group-hover:w-[calc(100%-24px)]"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.22), transparent)",
        }}
      />
    </Link>
  );
}

function MobileOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const pathname = usePathname();
  const supportActions = useMemo(
    () => [
      {
        label: "WhatsApp",
        href: SITE.socials.whatsapp,
        note: "Fastest support",
        external: true,
      },
      {
        label: "Email",
        href: `mailto:${SITE.email}`,
        note: SITE.email,
        external: false,
      },
      {
        label: "Find Order",
        href: "/orders/find",
        note: "Open or resend paid tickets",
        external: false,
      },
    ],
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: EASING }}
      className="safe-top safe-bottom fixed inset-0 z-[100] flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, rgba(14,10,6,0.97), rgba(9,6,3,0.99))",
        backdropFilter: "blur(40px)",
        paddingLeft: "max(env(safe-area-inset-left), 20px)",
        paddingRight: "max(env(safe-area-inset-right), 20px)",
      }}
    >
      <div className="absolute inset-x-6 top-0 h-px pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(198,169,98,0.35),transparent)]" />

      <div className="flex items-center justify-between pb-5 pt-2">
        <div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 300,
              fontSize: "1rem",
              letterSpacing: "0.34em",
              color: "rgba(198,169,98,0.74)",
              textTransform: "uppercase",
            }}
          >
            VIBEUP
          </p>
          <p className="mt-1 text-[7px] uppercase tracking-[0.36em] text-white/24">
            Events & Services
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58"
        >
          <X className="h-4 w-4" strokeWidth={1.3} />
        </button>
      </div>

      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          {MOBILE_PRIMARY.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="glass-card glass-card-warm flex min-h-[76px] items-center gap-3 rounded-[18px] px-4 py-4"
                style={{
                  borderColor: active
                    ? "rgba(198,169,98,0.28)"
                    : "rgba(255,255,255,0.08)",
                  background: active
                    ? "linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.04))"
                    : undefined,
                }}
              >
                <div className="spec-line" />
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[rgba(198,169,98,0.16)] bg-[rgba(198,169,98,0.08)]">
                  <Icon className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/74">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="glass-card glass-card-dark rounded-[22px] p-4">
          <div className="spec-line" />
          <p className="eyebrow mb-4">Explore More</p>
          <div className="grid grid-cols-2 gap-2">
            {MOBILE_SECONDARY.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-[52px] items-center gap-3 rounded-[16px] border px-4 py-3"
                  style={{
                    borderColor: active
                      ? "rgba(198,169,98,0.22)"
                      : "rgba(255,255,255,0.06)",
                    background: active ? "rgba(198,169,98,0.08)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5 text-[var(--gold)]" strokeWidth={1.2} />
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/62">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-[22px] p-4">
          <div className="spec-line" />
          <p className="eyebrow mb-3">Need A Fast Answer</p>
          <p className="body-copy text-[0.82rem] text-white/58">
            Mobile guests usually need one thing quickly: ticket help, timing, or access support.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {supportActions.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
              >
                <p className="eyebrow mb-2 text-[var(--gold)]">{item.label}</p>
                <p className="body-copy text-white/68">{item.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Link
          href="/checkout"
          onClick={onClose}
          className="liquid-button-gold flex w-full justify-center"
        >
          <span className="inline-flex items-center gap-2">
            Buy Tickets
            <Ticket className="h-3.5 w-3.5" strokeWidth={1.2} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: open ? 0 : 1, y: open ? -16 : 0 }}
        transition={{ duration: 0.35, ease: EASING }}
        className="safe-top fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={
          scrolled
            ? {
                background:
                  "linear-gradient(180deg, rgba(8,6,4,0.84) 0%, rgba(6,4,2,0.9) 100%)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                borderBottom: "1px solid rgba(198,169,98,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.42)",
              }
            : {
                background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }
        }
      >
        {scrolled ? (
          <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(198,169,98,0.18),transparent)]" />
        ) : null}

        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
          style={{
            height: scrolled ? 56 : 64,
            transition: "height 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {DESKTOP_LEFT.map((item) => (
              <DesktopNavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <Link
            href="/"
            className="group flex min-h-[44px] flex-col items-start justify-center md:items-center lg:mx-6"
            onClick={() => setOpen(false)}
          >
            <span
              className="font-light uppercase tracking-[0.38em] text-white/88 transition-all duration-300 group-hover:text-white"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(0.8rem,3vw,0.98rem)",
              }}
            >
              VIBEUP
            </span>
            <div className="mt-1 h-px w-8 bg-[linear-gradient(90deg,transparent,rgba(198,169,98,0.56),transparent)] transition-all duration-300 group-hover:w-full" />
            <span className="mt-1 hidden text-[6px] uppercase tracking-[0.42em] text-white/22 sm:block">
              Events & Services
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-end gap-1 lg:flex">
            {DESKTOP_RIGHT.map((item) => (
              <DesktopNavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <Link href="/checkout" className="liquid-button-gold ml-2">
              <span className="inline-flex items-center gap-2">
                Buy Tickets
                <Ticket className="h-3.5 w-3.5" strokeWidth={1.2} />
              </span>
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Link
              href="/checkout"
              className="liquid-button-gold min-h-[44px] !px-4"
            >
              <span className="inline-flex items-center gap-1.5">
                <Ticket className="h-3 w-3" strokeWidth={1.2} />
                Tickets
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="nav-mobile-button"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.35} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.35} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open ? <MobileOverlay onClose={() => setOpen(false)} /> : null}</AnimatePresence>
    </>
  );
}
