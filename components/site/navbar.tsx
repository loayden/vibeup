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
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { useDeviceProfile } from "@/components/site/use-device-profile";
import { SITE } from "@/lib/site-data";

const EASING = [0.22, 1, 0.36, 1] as const;

const DESKTOP_LEFT = [
  { label: "Events", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

const DESKTOP_RIGHT = [
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
] as const;

const MOBILE_PRIMARY = [
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "About", href: "/about", icon: UserRound },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
] as const;

const MOBILE_SECONDARY = [
  { label: "Contact Us", href: "/contact-us", icon: Mail },
  { label: "Find My Order", href: "/orders/find", icon: ArrowRight },
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
      aria-current={active ? "page" : undefined}
      style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: "9px",
        letterSpacing: "0.30em",
        fontWeight: 300,
        textTransform: "uppercase",
        color: active ? "rgba(164,127,43,0.92)" : "rgba(48,42,31,0.56)",
      }}
    >
      {label}
      <span
        className="absolute bottom-1 left-3 h-px transition-all duration-300"
        style={{
          width: active ? "calc(100% - 24px)" : "0%",
          background: "linear-gradient(90deg, rgba(164,127,43,0.72), transparent)",
        }}
      />
      <span
        className="absolute bottom-1 left-3 h-px w-0 transition-all duration-300 group-hover:w-[calc(100%-24px)]"
        style={{
          background: "linear-gradient(90deg, rgba(164,127,43,0.28), transparent)",
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
    ],
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: EASING }}
      className="mobile-nav-overlay safe-top safe-bottom fixed inset-y-0 right-0 z-[100] w-[280px] flex flex-col overflow-y-auto"
      style={{
        height: "100dvh",
        WebkitOverflowScrolling: "touch",
        background: "rgba(13, 8, 8, 0.98)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <span
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontWeight: 300,
            fontSize: "1.1rem",
            letterSpacing: "0.34em",
            color: "rgba(198,169,98,0.9)",
            textTransform: "uppercase",
          }}
        >
          ZOYA
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" strokeWidth={1.3} />
        </button>
      </div>

      <div className="flex-1 px-5 py-4">
        <div className="space-y-1">
          {MOBILE_PRIMARY.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                style={{
                  backgroundColor: active ? "rgba(198,169,98,0.15)" : "transparent",
                  color: active ? "rgba(198,169,98,0.9)" : "rgba(255,255,255,0.8)",
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.2} />
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="my-4 h-px bg-white/10" />

        <div className="space-y-1">
          {MOBILE_SECONDARY.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                style={{
                  backgroundColor: active ? "rgba(198,169,98,0.15)" : "transparent",
                  color: active ? "rgba(198,169,98,0.9)" : "rgba(255,255,255,0.8)",
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.2} />
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 space-y-3">
        <Link
          href="/checkout"
          onClick={onClose}
          className="block w-full bg-amber-500 text-black font-semibold text-sm px-5 py-2.5 rounded-sm text-center"
        >
          Buy Tickets
        </Link>
        <Link
          href={SITE.socials.whatsapp}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="block w-full bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-sm text-center"
        >
          WhatsApp
        </Link>
      </div>
    </motion.div>
  );
}

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const { hasMounted, isMobile } = useDeviceProfile();
  const liteSurface = hasMounted && isMobile;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: open ? 0 : 1, y: open ? -16 : 0 }}
        transition={{ duration: 0.35, ease: EASING }}
        className="site-navbar-shell safe-top fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          height: "56px",
          background: liteSurface
            ? "rgba(13, 8, 8, 0.97)"
            : "linear-gradient(180deg, rgba(13, 8, 8, 0.96) 0%, rgba(11, 6, 6, 0.92) 100%)",
          borderBottom: "1px solid rgba(164,127,43,0.14)",
          boxShadow: "0 8px 28px rgba(69,52,18,0.06)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(198,169,98,0.18),transparent)]" />

        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
          style={{
            height: "56px",
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
              className="font-light uppercase tracking-[0.38em] text-[var(--foreground)] transition-all duration-300 group-hover:text-[var(--gold)]"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(0.8rem,3vw,0.98rem)",
              }}
            >
              {SITE.shortName.toUpperCase()}
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
            <Link href="/contact-us" className="liquid-button-gold ml-2">
              Contact
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
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
                    <X className="h-4 w-4 text-white" strokeWidth={1.35} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4 text-white" strokeWidth={1.35} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[99] bg-black/60"
              onClick={() => setOpen(false)}
            />
            <MobileOverlay onClose={() => setOpen(false)} />
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
