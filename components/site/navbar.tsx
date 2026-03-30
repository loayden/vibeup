"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, Menu, X, Ticket, Phone,
  Calendar, Image as ImageIcon, Briefcase, Users,
  HelpCircle, FileText, Rss, ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════
   CONFIGURATION — edit this section only
══════════════════════════════════════════════ */

const BRAND = {
  name: "VIBEUP",
  tagline: "Events & Services",
  logo: "/vibeup-logo.png",   // set to "" to show text wordmark
  href: "/",
};

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;             // e.g. "New", "Live"
  children?: { label: string; href: string; description: string; icon: React.ReactNode }[];
};

const NAV: NavItem[] = [
  { label: "Events",    href: "/events",   icon: <Calendar  strokeWidth={1.3} className="w-3.5 h-3.5" /> },
  { label: "Services",  href: "/services", icon: <Briefcase strokeWidth={1.3} className="w-3.5 h-3.5" /> },
  { label: "Gallery",   href: "/gallery",  icon: <ImageIcon strokeWidth={1.3} className="w-3.5 h-3.5" /> },
  { label: "About",     href: "/about",    icon: <Users     strokeWidth={1.3} className="w-3.5 h-3.5" /> },
  {
    label: "More",
    href: "#",
    children: [
      { label: "Blog",    href: "/blog",    description: "Event tips, artist spotlights & news",  icon: <Rss        strokeWidth={1.3} className="w-4 h-4" /> },
      { label: "FAQ",     href: "/faq",     description: "Common questions answered",              icon: <HelpCircle strokeWidth={1.3} className="w-4 h-4" /> },
      { label: "Careers", href: "/careers", description: "Join the VibeUp team",                  icon: <Briefcase  strokeWidth={1.3} className="w-4 h-4" /> },
      { label: "Contact", href: "/contact-us", description: "Get in touch with our team",         icon: <Phone      strokeWidth={1.3} className="w-4 h-4" /> },
      { label: "Privacy", href: "/privacy", description: "Our privacy & terms policies",          icon: <FileText   strokeWidth={1.3} className="w-4 h-4" /> },
    ],
  },
];

const CTA = { label: "Buy Tickets", href: "/checkout" };

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const;

function useActive(href: string) {
  const pathname = usePathname();
  if (href === "/" || href === "#") return pathname === "/";
  return pathname.startsWith(href);
}

/* ══════════════════════════════════════════════
   DESKTOP DROPDOWN
══════════════════════════════════════════════ */

function Dropdown({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const active = Boolean(
    item.children?.some((child) => child.href !== "#" && pathname.startsWith(child.href)),
  );

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <li className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300"
        style={{
          fontFamily:"'Jost',sans-serif", fontSize:"9.5px", letterSpacing:"0.22em",
          fontWeight:300, textTransform:"uppercase",
          color: active ? "#C6A962" : "rgba(255,255,255,0.52)",
          background: open ? "rgba(198,169,98,0.08)" : "transparent",
        }}
        onMouseEnter={() => { (document.activeElement as HTMLElement)?.blur(); }}
      >
        {item.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.3 }}>
          <ChevronDown strokeWidth={1.3} className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:10, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:10, scale:0.97 }}
            transition={{ duration:0.25, ease }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 overflow-hidden z-50"
            style={{
              borderRadius:20,
              background:"linear-gradient(160deg, rgba(14,11,9,0.97) 0%, rgba(10,8,6,0.99) 100%)",
              backdropFilter:"blur(36px) saturate(180%)",
              WebkitBackdropFilter:"blur(36px) saturate(180%)",
              border:"1px solid rgba(198,169,98,0.28)",
              boxShadow:[
                "0 0 0 1px rgba(198,169,98,0.07)",
                "0 0 28px rgba(198,169,98,0.12)",
                "0 28px 64px rgba(0,0,0,0.75)",
                "inset 0 1px 0 rgba(198,169,98,0.18)",
              ].join(","),
            }}
          >
            {/* Gold specular top */}
            <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent)" }} />

            <div className="p-2">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="group flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:border-[rgba(198,169,98,0.3)]"
                        style={{
                          background:"linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.03))",
                          border:"1px solid rgba(198,169,98,0.14)",
                          color:"rgba(198,169,98,0.6)",
                        }}>
                    {child.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-white/75 group-hover:text-[#C6A962] transition-colors duration-200"
                          style={{ fontFamily:"'Jost',sans-serif", fontSize:"11px", letterSpacing:"0.1em" }}>
                      {child.label}
                    </span>
                    <span className="block text-white/25 mt-0.5"
                          style={{ fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"0.04em" }}>
                      {child.description}
                    </span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="mt-1 w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                              style={{ color:"rgba(198,169,98,0.6)", flexShrink:0 }} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ══════════════════════════════════════════════
   DESKTOP NAV LINK
══════════════════════════════════════════════ */

function NavLink({ item }: { item: NavItem }) {
  const active = useActive(item.href);

  return (
    <li>
      <Link
        href={item.href}
        className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300"
        style={{
          fontFamily:"'Jost',sans-serif", fontSize:"9.5px", letterSpacing:"0.22em",
          fontWeight:300, textTransform:"uppercase",
          color: active ? "#C6A962" : "rgba(255,255,255,0.52)",
          background: active ? "rgba(198,169,98,0.09)" : "transparent",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(198,169,98,0.06)"; e.currentTarget.style.color = active ? "#C6A962" : "rgba(255,255,255,0.85)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = active ? "rgba(198,169,98,0.09)" : "transparent"; e.currentTarget.style.color = active ? "#C6A962" : "rgba(255,255,255,0.52)"; }}
      >
        {item.badge && (
          <span className="absolute -top-1.5 -right-1.5 h-3.5 px-1.5 rounded-full flex items-center justify-center"
                style={{ background:"rgba(198,169,98,0.85)", color:"#080808", fontSize:"7px", letterSpacing:"0.1em" }}>
            {item.badge}
          </span>
        )}
        {item.label}
        {active && (
          <motion.span layoutId="nav-dot" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full"
                       style={{ background:"rgba(198,169,98,0.7)" }} transition={{ ease }} />
        )}
      </Link>
    </li>
  );
}

/* ══════════════════════════════════════════════
   MOBILE PANEL
══════════════════════════════════════════════ */

function MobilePanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const allLinks = NAV.flatMap(item => item.children ? item.children.map(c => ({ label:c.label, href:c.href, icon:c.icon })) : [{ label:item.label, href:item.href, icon:item.icon }]);

  return (
    <motion.div
      initial={{ opacity:0, x:32, scale:0.98 }}
      animate={{ opacity:1, x:0, scale:1 }}
      exit={{ opacity:0, x:32, scale:0.98 }}
      transition={{ duration:0.45, ease }}
      className="absolute right-0 top-[calc(100%+10px)] w-[min(92vw,340px)] overflow-hidden z-50"
      style={{
        borderRadius:24,
        background:"linear-gradient(160deg, rgba(16,12,8,0.98) 0%, rgba(10,8,5,1.0) 100%)",
        backdropFilter:"blur(40px) saturate(180%)",
        WebkitBackdropFilter:"blur(40px) saturate(180%)",
        border:"1px solid rgba(198,169,98,0.30)",
        boxShadow:[
          "0 0 0 1px rgba(198,169,98,0.07)",
          "0 0 28px rgba(198,169,98,0.14)",
          "0 28px 64px rgba(0,0,0,0.8)",
          "inset 0 1px 0 rgba(198,169,98,0.22)",
        ].join(","),
      }}
    >
      {/* Top specular */}
      <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
           style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.45), transparent)" }} />

      {/* Left gold edge */}
      <div className="absolute left-0 inset-y-8 w-px"
           style={{ background:"linear-gradient(to bottom, transparent, rgba(198,169,98,0.45) 30%, rgba(198,169,98,0.2) 70%, transparent)" }} />

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4"
             style={{ borderBottom:"1px solid rgba(198,169,98,0.12)" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"9px", letterSpacing:"0.55em", color:"rgba(198,169,98,0.45)", textTransform:"uppercase" }}>
            {BRAND.name}
          </span>
          <motion.button onClick={onClose} whileTap={{ scale:0.85 }}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ border:"1px solid rgba(198,169,98,0.18)", background:"rgba(198,169,98,0.04)", color:"rgba(198,169,98,0.6)" }}>
            <X strokeWidth={1.3} className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Nav links */}
        <nav className="space-y-0.5 mb-4">
          {allLinks.map((item) => {
            const active = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 min-h-[44px]"
                style={{
                  background: active ? "rgba(198,169,98,0.08)" : "transparent",
                  border: active ? "1px solid rgba(198,169,98,0.15)" : "1px solid transparent",
                }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        background: active ? "linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))" : "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                        border: active ? "1px solid rgba(198,169,98,0.25)" : "1px solid rgba(255,255,255,0.07)",
                        color: active ? "#C6A962" : "rgba(255,255,255,0.4)",
                      }}>
                  {item.icon}
                </span>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"12px", letterSpacing:"0.09em", fontWeight:300, color: active ? "#C6A962" : "rgba(255,255,255,0.62)" }}>
                  {item.label}
                </span>
                {active && <span className="ml-auto w-1 h-1 rounded-full flex-shrink-0" style={{ background:"#C6A962" }} />}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link href={CTA.href} onClick={onClose}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full transition-all duration-400"
          style={{
            background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
            border:"1px solid rgba(198,169,98,0.38)",
            backdropFilter:"blur(12px)",
            boxShadow:"0 0 24px rgba(198,169,98,0.14), inset 0 1px 0 rgba(255,255,255,0.12)",
            color:"#C6A962",
            fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"0.30em", fontWeight:300, textTransform:"uppercase",
          }}>
          <Ticket strokeWidth={1.3} className="w-3.5 h-3.5" />
          {CTA.label}
        </Link>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════ */

export function SiteNavbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400&display=swap');
      `}</style>

      {/* Outer pill wrapper */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        style={{ paddingTop: scrolled ? 8 : 14, transition:"padding 0.5s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <motion.div
          initial={{ y:-64, opacity:0 }}
          animate={{ y:0, opacity:1 }}
          transition={{ duration:0.85, ease, delay:0.05 }}
          className="pointer-events-auto relative"
          style={{ width:"min(calc(100vw - 20px), 1100px)" }}
        >
          {/* ── PILL SHELL ── */}
          <div
            className="relative flex items-center justify-between px-3 sm:px-4"
            style={{
              height: scrolled ? 46 : 54,
              borderRadius: 9999,
              transition:"height 0.45s cubic-bezier(0.22,1,0.36,1)",
              /* Warm dark fill */
              background:"linear-gradient(175deg, rgba(32,25,14,0.80) 0%, rgba(18,13,7,0.92) 45%, rgba(28,21,11,0.80) 100%)",
              backdropFilter:"blur(40px) saturate(200%)",
              WebkitBackdropFilter:"blur(40px) saturate(200%)",
              /* Gold border */
              border:"1px solid rgba(198,169,98,0.58)",
              boxShadow:[
                "0 0 0 1px rgba(198,169,98,0.09)",
                "0 0 22px rgba(198,169,98,0.20)",
                "0 0 64px rgba(198,169,98,0.07)",
                "0 14px 50px rgba(0,0,0,0.65)",
                "inset 0 1px 0 rgba(198,169,98,0.42)",
                "inset 0 -1px 0 rgba(0,0,0,0.50)",
              ].join(","),
            }}
          >
            {/* Top specular line — gold tinted */}
            <div className="absolute inset-x-8 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent 5%, rgba(198,169,98,0.50) 35%, rgba(255,240,180,0.30) 50%, rgba(198,169,98,0.50) 65%, transparent 95%)" }} />
            {/* Bottom shadow line */}
            <div className="absolute inset-x-8 bottom-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(0,0,0,0.55), transparent)" }} />

            {/* ── LOGO ── */}
            <Link href={BRAND.href} className="group relative flex items-center gap-2.5 flex-shrink-0"
                  onClick={() => setMenuOpen(false)}>
              {BRAND.logo ? (
                <Image
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={128}
                  height={36}
                  className="h-7 w-auto"
                />
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-light text-white/78 group-hover:text-[#C6A962] transition-colors duration-500 tracking-[0.38em] uppercase"
                        style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.7rem,2vw,0.88rem)" }}>
                    {BRAND.name}
                  </span>
                  <span className="hidden sm:block text-white/20 tracking-[0.25em] uppercase"
                        style={{ fontFamily:"'Jost',sans-serif", fontSize:"7px" }}>
                    {BRAND.tagline}
                  </span>
                </div>
              )}
              {/* Gold underline */}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.8), transparent)" }} />
            </Link>

            {/* ── DESKTOP NAV ── */}
            <ul className="hidden md:flex items-center gap-0 flex-1 justify-center">
              {NAV.map((item) =>
                item.children
                  ? <Dropdown key={item.label} item={item} />
                  : <NavLink   key={item.href}  item={item} />
              )}
            </ul>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {/* Separator */}
              <div className="w-px h-4 mx-1" style={{ background:"rgba(198,169,98,0.20)" }} />

              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <Link href={CTA.href}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-400"
                  style={{
                    background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
                    border:"1px solid rgba(198,169,98,0.40)",
                    backdropFilter:"blur(12px)",
                    boxShadow:"0 0 20px rgba(198,169,98,0.14), inset 0 1px 0 rgba(255,255,255,0.12)",
                    color:"#C6A962",
                    fontFamily:"'Jost',sans-serif", fontSize:"9.5px", letterSpacing:"0.28em",
                    fontWeight:300, textTransform:"uppercase",
                  }}>
                  <Ticket strokeWidth={1.3} className="w-3.5 h-3.5" />
                  {CTA.label}
                </Link>
              </motion.div>
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <motion.button
              onClick={() => setMenuOpen(v => !v)}
              whileTap={{ scale:0.88 }}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full ml-1 transition-all duration-300"
              style={{
                background: menuOpen ? "rgba(198,169,98,0.12)" : "rgba(198,169,98,0.05)",
                border:"1px solid rgba(198,169,98,0.22)",
                color:"#C6A962",
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.span key="x" initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:0.2 }}>
                    <X strokeWidth={1.4} className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate:90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:-90,opacity:0 }} transition={{ duration:0.2 }}>
                    <Menu strokeWidth={1.4} className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* ── MOBILE PANEL ── */}
          <AnimatePresence>
            {menuOpen && <MobilePanel onClose={() => setMenuOpen(false)} />}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
