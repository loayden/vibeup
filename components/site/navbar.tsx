"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_LINKS, SECONDARY_NAV_LINKS, SITE } from "@/lib/site-data";

const navTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  function closeMenus() {
    setOpen(false);
    setMoreOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4">
      <motion.nav
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -18, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative w-full max-w-[1120px]"
      >
        <div
          className="relative mx-auto flex items-center justify-between overflow-visible rounded-full px-3 md:px-4"
          style={{
            width: "min(calc(100vw - 24px), 1100px)",
            height: scrolled ? 48 : 56,
            background:
              "linear-gradient(175deg, rgba(32,25,14,0.78) 0%, rgba(18,13,7,0.90) 45%, rgba(28,21,11,0.78) 100%)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(198,169,98,0.60)",
            boxShadow: [
              "0 0 0 1px rgba(198,169,98,0.10)",
              "0 0 20px rgba(198,169,98,0.20)",
              "0 12px 48px rgba(0,0,0,0.65)",
              "inset 0 1px 0 rgba(198,169,98,0.40)",
              "inset 0 -1px 0 rgba(0,0,0,0.5)",
            ].join(", "),
          }}
        >
          <div className="spec-line" />

          <Link
            href="/"
            className="flex min-w-[160px] items-center gap-3 rounded-full px-3 py-2"
            data-cursor="hover"
            onClick={closeMenus}
          >
            <Image src="/vibeup-logo.png" alt={SITE.name} width={104} height={30} className="h-8 w-auto" priority />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="hover"
                className={`nav-pill ${isActive(pathname, item.href) ? "nav-pill-active" : ""}`}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className={`nav-pill ${SECONDARY_NAV_LINKS.some((item) => isActive(pathname, item.href)) ? "nav-pill-active" : ""}`}
                onClick={() => setMoreOpen((value) => !value)}
                data-cursor="hover"
              >
                More <ChevronDown className={`h-3.5 w-3.5 transition ${moreOpen ? "rotate-180" : ""}`} strokeWidth={1.2} />
              </button>

              <AnimatePresence>
                {moreOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={navTransition}
                    className="glass-card glass-card-dark absolute right-0 mt-3 min-w-[220px] rounded-[22px] p-3"
                  >
                    <div className="spec-line" />
                    <div className="space-y-1">
                      {SECONDARY_NAV_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="nav-dropdown-link"
                          data-cursor="hover"
                          onClick={closeMenus}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/checkout" className="liquid-button-gold" data-cursor="hover" onClick={closeMenus}>
              Book Now
            </Link>
          </div>

          <button
            className="nav-mobile-button md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            data-cursor="hover"
          >
            {open ? <X className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} /> : <Menu className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={navTransition}
              className="glass-card glass-card-dark pointer-events-auto absolute right-0 top-[calc(100%+12px)] w-[min(92vw,360px)] rounded-[26px] p-5 md:hidden"
            >
              <div className="spec-line" />
              <div className="absolute inset-y-6 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(198,169,98,0.55),transparent)]" />
              <div className="space-y-1 pl-3">
                {[...NAV_LINKS, ...SECONDARY_NAV_LINKS].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-mobile-link"
                    data-cursor="hover"
                    onClick={closeMenus}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/checkout"
                  className="liquid-button-gold mt-4 w-full justify-center"
                  data-cursor="hover"
                  onClick={closeMenus}
                >
                  Reserve Tickets
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
