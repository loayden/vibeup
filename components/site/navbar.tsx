"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Menu,
  Phone,
  Rss,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BRAND = {
  name: "VIBEUP",
  tagline: "Events & Services",
  logo: "/vibeup-logo-512.webp",
  href: "/",
};

type NavChild = {
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  {
    label: "Events",
    href: "/events",
    icon: <Calendar strokeWidth={1.3} className="h-4 w-4" />,
  },
  {
    label: "Services",
    href: "/services",
    icon: <Briefcase strokeWidth={1.3} className="h-4 w-4" />,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: <ImageIcon strokeWidth={1.3} className="h-4 w-4" />,
  },
  {
    label: "About",
    href: "/about",
    icon: <Users strokeWidth={1.3} className="h-4 w-4" />,
  },
  {
    label: "More",
    href: "#",
    children: [
      {
        label: "Blog",
        href: "/blog",
        description: "Event tips, artist spotlights, and news",
        icon: <Rss strokeWidth={1.3} className="h-4 w-4" />,
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Guest questions and booking answers",
        icon: <HelpCircle strokeWidth={1.3} className="h-4 w-4" />,
      },
      {
        label: "Careers",
        href: "/careers",
        description: "Join the VibeUp team",
        icon: <Briefcase strokeWidth={1.3} className="h-4 w-4" />,
      },
      {
        label: "Contact",
        href: "/contact-us",
        description: "Talk to the production team",
        icon: <Phone strokeWidth={1.3} className="h-4 w-4" />,
      },
      {
        label: "Privacy",
        href: "/privacy",
        description: "Policies and guest terms",
        icon: <FileText strokeWidth={1.3} className="h-4 w-4" />,
      },
    ],
  },
];

const CTA = { label: "Buy Tickets", href: "/checkout" };
const ease = [0.22, 1, 0.36, 1] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/" || href === "#") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const active = Boolean(item.children?.some((child) => isActivePath(pathname, child.href)));

  const handleEnter = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    setOpen(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <li className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className="group relative flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300"
        style={{
          fontFamily: "'Jost',sans-serif",
          fontSize: "9.5px",
          letterSpacing: "0.22em",
          fontWeight: 300,
          textTransform: "uppercase",
          color: active ? "#C6A962" : "rgba(255,255,255,0.52)",
          background: open ? "rgba(198,169,98,0.08)" : "transparent",
        }}
      >
        {item.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown strokeWidth={1.3} className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease }}
            className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 overflow-hidden"
            style={{
              borderRadius: 20,
              background:
                "linear-gradient(160deg, rgba(14,11,9,0.97) 0%, rgba(10,8,6,0.99) 100%)",
              backdropFilter: "blur(36px) saturate(180%)",
              WebkitBackdropFilter: "blur(36px) saturate(180%)",
              border: "1px solid rgba(198,169,98,0.28)",
              boxShadow: [
                "0 0 0 1px rgba(198,169,98,0.07)",
                "0 0 28px rgba(198,169,98,0.12)",
                "0 28px 64px rgba(0,0,0,0.75)",
                "inset 0 1px 0 rgba(198,169,98,0.18)",
              ].join(","),
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-4 top-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent)",
              }}
            />

            <div className="p-2">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="group flex min-h-[52px] items-start gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.03))",
                      border: "1px solid rgba(198,169,98,0.14)",
                      color: "rgba(198,169,98,0.6)",
                    }}
                  >
                    {child.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-white/75 transition-colors duration-200 group-hover:text-[#C6A962]"
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {child.label}
                    </span>
                    <span
                      className="mt-0.5 block text-white/25"
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {child.description}
                    </span>
                  </span>
                  <ArrowRight
                    strokeWidth={1.2}
                    className="mt-1 h-3 w-3 flex-shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    style={{ color: "rgba(198,169,98,0.6)" }}
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

function DesktopLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActivePath(pathname, item.href);

  return (
    <li>
      <Link
        href={item.href}
        className="group relative flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300"
        style={{
          fontFamily: "'Jost',sans-serif",
          fontSize: "9.5px",
          letterSpacing: "0.22em",
          fontWeight: 300,
          textTransform: "uppercase",
          color: active ? "#C6A962" : "rgba(255,255,255,0.52)",
          background: active ? "rgba(198,169,98,0.09)" : "transparent",
        }}
      >
        {item.label}
        {active ? (
          <motion.span
            layoutId="nav-dot"
            className="absolute bottom-1.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full"
            style={{ background: "rgba(198,169,98,0.7)" }}
            transition={{ ease }}
          />
        ) : null}
      </Link>
    </li>
  );
}

function MobileOverlay({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const links = NAV.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({
          label: child.label,
          href: child.href,
          icon: child.icon,
        }))
      : [
          {
            label: item.label,
            href: item.href,
            icon: item.icon,
          },
        ],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.28, ease }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: "linear-gradient(160deg, rgba(14,10,6,0.97), rgba(9,6,3,0.99))",
        backdropFilter: "blur(40px)",
        paddingTop: "max(env(safe-area-inset-top), 16px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
        paddingLeft: "max(env(safe-area-inset-left), 20px)",
        paddingRight: "max(env(safe-area-inset-right), 20px)",
      }}
    >
      <div className="flex items-center justify-between">
        <Link href={BRAND.href} className="flex items-center gap-3" onClick={onClose}>
          <Image
            src={BRAND.logo}
            alt={BRAND.name}
            width={104}
            height={40}
            className="h-9 w-auto"
            sizes="104px"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="nav-mobile-button"
          aria-label="Close navigation"
        >
          <X strokeWidth={1.4} className="h-4 w-4 text-[var(--gold)]" />
        </button>
      </div>

      <div className="subtle-divider mt-6 h-px" />

      <div className="mt-6 grid flex-1 auto-rows-fr grid-cols-2 gap-3 overflow-y-auto">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="glass-card glass-card-dark flex min-h-[92px] flex-col justify-between rounded-[18px] px-4 py-4"
              style={{
                borderColor: active ? "rgba(198,169,98,0.28)" : "rgba(255,255,255,0.08)",
                background: active
                  ? "linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.04))"
                  : undefined,
              }}
            >
              <div className="spec-line" />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                style={{
                  background: active
                    ? "rgba(198,169,98,0.14)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  border: active
                    ? "1px solid rgba(198,169,98,0.24)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: active ? "#C6A962" : "rgba(255,255,255,0.58)",
                }}
              >
                {link.icon}
              </span>
              <span
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: active ? "#C6A962" : "rgba(255,255,255,0.78)",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <Link href={CTA.href} onClick={onClose} className="liquid-button-gold flex w-full">
          <span className="inline-flex items-center gap-2">
            <Ticket strokeWidth={1.3} className="h-4 w-4" />
            {CTA.label}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function preventScroll(event: TouchEvent) {
      event.preventDefault();
    }

    const previousOverflow = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setMenuOpen(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [menuOpen, pathname]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        style={{
          paddingTop: `max(env(safe-area-inset-top), ${scrolled ? 10 : 16}px)`,
          transition: "padding 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease, delay: 0.05 }}
          className="pointer-events-auto relative w-[min(calc(100vw-20px),1100px)]"
        >
          <div
            className="relative flex items-center justify-between gap-3 px-3 sm:px-4"
            style={{
              height: scrolled ? 56 : 60,
              borderRadius: 9999,
              transition: "height 0.45s cubic-bezier(0.22,1,0.36,1)",
              background:
                "linear-gradient(175deg, rgba(32,25,14,0.80) 0%, rgba(18,13,7,0.92) 45%, rgba(28,21,11,0.80) 100%)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              border: "1px solid rgba(198,169,98,0.58)",
              boxShadow: [
                "0 0 0 1px rgba(198,169,98,0.09)",
                "0 0 22px rgba(198,169,98,0.20)",
                "0 0 64px rgba(198,169,98,0.07)",
                "0 14px 50px rgba(0,0,0,0.65)",
                "inset 0 1px 0 rgba(198,169,98,0.42)",
                "inset 0 -1px 0 rgba(0,0,0,0.50)",
              ].join(","),
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 5%, rgba(198,169,98,0.50) 35%, rgba(255,240,180,0.30) 50%, rgba(198,169,98,0.50) 65%, transparent 95%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-8 bottom-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.55), transparent)",
              }}
            />

            <Link href={BRAND.href} className="flex flex-shrink-0 items-center gap-2.5">
              <Image
                src={BRAND.logo}
                alt={BRAND.name}
                width={112}
                height={42}
                className="h-8 w-auto sm:h-9"
                sizes="112px"
                priority
              />
            </Link>

            <ul className="hidden flex-1 items-center justify-center gap-0 md:flex">
              {NAV.map((item) =>
                item.children ? (
                  <DesktopDropdown key={item.label} item={item} pathname={pathname} />
                ) : (
                  <DesktopLink key={item.href} item={item} pathname={pathname} />
                ),
              )}
            </ul>

            <div className="hidden items-center gap-2 md:flex">
              <div className="mx-1 h-4 w-px" style={{ background: "rgba(198,169,98,0.20)" }} />
              <Link href={CTA.href} className="liquid-button-gold">
                <span className="inline-flex items-center gap-2">
                  <Ticket strokeWidth={1.3} className="h-3.5 w-3.5" />
                  {CTA.label}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link href={CTA.href} className="liquid-button-gold !min-h-[44px] !px-4">
                {CTA.label}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="nav-mobile-button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X strokeWidth={1.4} className="h-4 w-4 text-[var(--gold)]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu strokeWidth={1.4} className="h-4 w-4 text-[var(--gold)]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {menuOpen ? <MobileOverlay pathname={pathname} onClose={() => setMenuOpen(false)} /> : null}
      </AnimatePresence>
    </>
  );
}
