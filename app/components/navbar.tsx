"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar, Briefcase, Image as ImageIcon, Users,
  Ticket, Menu, X, ChevronDown, ArrowRight,
  Rss, HelpCircle, Phone,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const BRAND = { name: "ZOYA", sub: "Events & Services" };

const LEFT_LINKS  = [
  { label: "Events",   href: "/events"   },
  { label: "Services", href: "/services" },
];
const RIGHT_LINKS = [
  { label: "Gallery",  href: "/gallery"  },
  { label: "About",    href: "/about"    },
];
const MORE_LINKS = [
  { label:"Blog",    href:"/blog",       desc:"Tips & spotlights",        icon:<Rss         strokeWidth={1.2} className="w-3.5 h-3.5"/> },
  { label:"FAQ",     href:"/faq",        desc:"Common questions",         icon:<HelpCircle  strokeWidth={1.2} className="w-3.5 h-3.5"/> },
  { label:"Contact", href:"/contact-us", desc:"Reach our team",           icon:<Phone       strokeWidth={1.2} className="w-3.5 h-3.5"/> },
  { label:"Careers", href:"/careers",    desc:"Join ZOYA",              icon:<Briefcase   strokeWidth={1.2} className="w-3.5 h-3.5"/> },
];

const ALL_MOBILE = [
  { label:"Events",   href:"/events",   icon:<Calendar   strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"Services", href:"/services", icon:<Briefcase  strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"Gallery",  href:"/gallery",  icon:<ImageIcon  strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"About",    href:"/about",    icon:<Users      strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"Blog",     href:"/blog",     icon:<Rss        strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"FAQ",      href:"/faq",      icon:<HelpCircle strokeWidth={1.2} className="w-4 h-4"/> },
  { label:"Contact",  href:"/contact-us",icon:<Phone     strokeWidth={1.2} className="w-4 h-4"/> },
];

const E = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   NAV LINK
───────────────────────────────────────── */
function NavLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} className="group relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-400"
      style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: "9px",
        letterSpacing: "0.30em",
        fontWeight: 300,
        textTransform: "uppercase",
        color: active ? "rgba(198,169,98,0.85)" : "rgba(255,255,255,0.40)",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.40)"; }}
    >
      {label}
      {/* Underline */}
      <span className="absolute bottom-0 left-3 h-px transition-all duration-500"
            style={{
              width: active ? "calc(100% - 24px)" : "0%",
              background: "linear-gradient(90deg, rgba(198,169,98,0.7), transparent)",
            }} />
      {/* Hover underline */}
      <span className="absolute bottom-0 left-3 h-px w-0 group-hover:w-[calc(100%-24px)] transition-all duration-400"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.25), transparent)" }} />
    </Link>
  );
}

/* ─────────────────────────────────────────
   MORE DROPDOWN
───────────────────────────────────────── */
function MoreMenu() {
  const [open, setOpen] = useState(false);
  const t = useRef<NodeJS.Timeout | null>(null);
  const enter = () => { if (t.current) clearTimeout(t.current); setOpen(true); };
  const leave = () => { t.current = setTimeout(() => setOpen(false), 150); };
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);

  return (
    <div className="relative flex items-center" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="flex items-center gap-1 px-3 py-1.5 transition-all duration-400"
        style={{
          fontFamily:"'Jost',sans-serif", fontSize:"9px",
          letterSpacing:"0.30em", fontWeight:300, textTransform:"uppercase",
          color: open ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.40)",
        }}
      >
        More
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.3 }}>
          <ChevronDown strokeWidth={1.2} className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:8, scale:0.98 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:8, scale:0.98 }}
            transition={{ duration:0.22, ease:E }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 overflow-hidden z-50"
            style={{
              borderRadius: 16,
              background: "linear-gradient(160deg, rgba(10,8,5,0.96) 0%, rgba(7,5,3,0.98) 100%)",
              border: "1px solid rgba(198,169,98,0.20)",
              boxShadow: [
                "0 0 0 1px rgba(198,169,98,0.06)",
                "0 20px 60px rgba(0,0,0,0.80)",
                "inset 0 1px 0 rgba(198,169,98,0.18)",
              ].join(","),
            }}
          >
            <div className="absolute inset-x-4 top-0 h-px"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.35), transparent)" }} />
            <div className="p-2">
              {MORE_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className="group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200"
                  style={{ background:"transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          background:"rgba(198,169,98,0.08)",
                          border:"1px solid rgba(198,169,98,0.15)",
                          color:"rgba(198,169,98,0.60)",
                        }}>
                    {l.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block" style={{ fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"0.12em", color:"rgba(255,255,255,0.65)" }}>
                      {l.label}
                    </span>
                    <span className="block mt-0.5" style={{ fontFamily:"'Jost',sans-serif", fontSize:"8.5px", color:"rgba(255,255,255,0.22)" }}>
                      {l.desc}
                    </span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="w-3 h-3 opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0"
                              style={{ color:"rgba(198,169,98,0.7)" }} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOBILE OVERLAY
───────────────────────────────────────── */
function MobileOverlay({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.35 }}
      className="fixed inset-0 z-40"
      style={{ 
        background:"rgba(0,0,0,0.75)", 
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Backdrop tap to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        style={{
          pointerEvents: "auto",
          touchAction: "manipulation",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
        exit={{ opacity:0, y:-20 }}
        transition={{ duration:0.4, ease:E }}
        className="absolute inset-x-3 top-3 overflow-hidden"
        style={{
          borderRadius:24,
          background:"linear-gradient(160deg, rgba(14,10,6,0.97) 0%, rgba(9,6,3,0.99) 100%)",
          border:"1px solid rgba(198,169,98,0.22)",
          boxShadow:[
            "0 0 0 1px rgba(198,169,98,0.06)",
            "0 32px 80px rgba(0,0,0,0.85)",
            "inset 0 1px 0 rgba(198,169,98,0.20)",
          ].join(","),
        }}
      >
        {/* Top specular */}
        <div className="absolute inset-x-6 top-0 h-px"
             style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.35), transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5"
             style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"1.1rem", letterSpacing:"0.35em", color:"rgba(198,169,98,0.70)", textTransform:"uppercase" }}>
              {BRAND.name}
            </p>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"7px", letterSpacing:"0.35em", color:"rgba(255,255,255,0.20)", textTransform:"uppercase", marginTop:2 }}>
              {BRAND.sub}
            </p>
          </div>
          <motion.button 
            type="button"
            onClick={onClose} 
            onTouchStart={(e) => e.currentTarget.style.opacity = "0.7"}
            onTouchEnd={(e) => e.currentTarget.style.opacity = "1"}
            whileTap={{ scale:0.85 }}
            className="flex h-9 w-9 items-center justify-center rounded-full active:opacity-70"
            style={{ 
              border:"1px solid rgba(255,255,255,0.10)", 
              background:"rgba(255,255,255,0.04)", 
              color:"rgba(255,255,255,0.45)",
              pointerEvents: "auto",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              cursor: "pointer",
            }}>
            <X strokeWidth={1.3} className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Links grid */}
        <div className="p-4 grid grid-cols-2 gap-2">
          {ALL_MOBILE.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl min-h-[52px] transition-all duration-300"
                style={{
                  background: active ? "rgba(198,169,98,0.09)" : "rgba(255,255,255,0.03)",
                  border: active ? "1px solid rgba(198,169,98,0.22)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <span style={{ color: active ? "rgba(198,169,98,0.75)" : "rgba(255,255,255,0.30)" }}>
                  {item.icon}
                </span>
                <span style={{
                  fontFamily:"'Jost',sans-serif", fontSize:"10.5px",
                  letterSpacing:"0.10em", fontWeight:300,
                  color: active ? "rgba(198,169,98,0.80)" : "rgba(255,255,255,0.55)",
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-4 pb-5">
          <Link href="/checkout" onClick={onClose}
            className="relative overflow-hidden flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl transition-all duration-400"
            style={{
              background:"linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))",
              border:"1px solid rgba(198,169,98,0.32)",
              color:"rgba(198,169,98,0.80)",
              fontFamily:"'Jost',sans-serif", fontSize:"10px",
              letterSpacing:"0.30em", fontWeight:300, textTransform:"uppercase",
            }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)" }} />
            <Ticket strokeWidth={1.3} className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Buy Tickets</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────── */
export function SiteNavbar() {
  const scrolled = true;
  const [open,     setOpen]     = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400&display=swap');
      `}</style>

      <motion.header
        initial={{ opacity:0, y:-16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, ease:E }}
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background:"linear-gradient(180deg, rgba(8,6,4,0.82) 0%, rgba(6,4,2,0.88) 100%)",
          borderBottom:"1px solid rgba(198,169,98,0.12)",
          boxShadow:"0 1px 0 rgba(198,169,98,0.06), 0 8px 32px rgba(0,0,0,0.40)",
        } : {
          background:"linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 100%)",
          borderBottom:"1px solid transparent",
        }}
      >
        {/* Bottom specular line when scrolled */}
        {scrolled && (
          <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
               style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)" }} />
        )}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between"
             style={{ height: scrolled ? 52 : 62, transition:"height 0.45s cubic-bezier(0.22,1,0.36,1)" }}>

          {/* ── LEFT LINKS (desktop) ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {LEFT_LINKS.map(l => <NavLink key={l.href} {...l} />)}
            <MoreMenu />
          </nav>

          {/* ── LOGO (centered) ── */}
          <Link href="/" className="group flex flex-col items-center flex-shrink-0 mx-6"
                onClick={() => setOpen(false)}>
            <span
              className="font-light tracking-[0.42em] uppercase transition-all duration-500 group-hover:opacity-80"
              style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(0.78rem,2.2vw,0.96rem)",
                color:"rgba(255,255,255,0.85)",
                letterSpacing:"0.42em",
              }}
            >
              {BRAND.name}
            </span>
            {/* Gold underline — always visible, dims on scroll */}
            <div className="mt-1 h-px w-8 transition-all duration-500 group-hover:w-full"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)" }} />
            <span className="mt-0.5 hidden sm:block"
                  style={{ fontFamily:"'Jost',sans-serif", fontSize:"6px", letterSpacing:"0.45em", color:"rgba(255,255,255,0.22)", textTransform:"uppercase" }}>
              {BRAND.sub}
            </span>
          </Link>

          {/* ── RIGHT LINKS (desktop) ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-end">
            {RIGHT_LINKS.map(l => <NavLink key={l.href} {...l} />)}

            {/* Divider */}
            <div className="w-px h-4 mx-2" style={{ background:"rgba(255,255,255,0.10)" }} />

            {/* CTA */}
            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              <Link href="/checkout"
                className="relative overflow-hidden flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-400"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.16), rgba(198,169,98,0.06))",
                  border:"1px solid rgba(198,169,98,0.32)",
                  boxShadow:"0 0 18px rgba(198,169,98,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
                  color:"rgba(198,169,98,0.80)",
                  fontFamily:"'Jost',sans-serif", fontSize:"9px",
                  letterSpacing:"0.28em", fontWeight:300, textTransform:"uppercase",
                }}>
                {/* Shimmer */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)" }} />
                <Ticket strokeWidth={1.3} className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Buy Tickets</span>
              </Link>
            </motion.div>
          </nav>

          {/* ── MOBILE CONTROLS ── */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Link href="/checkout"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full"
              style={{
                background:"rgba(198,169,98,0.12)",
                border:"1px solid rgba(198,169,98,0.25)",
                color:"rgba(198,169,98,0.75)",
                fontFamily:"'Jost',sans-serif", fontSize:"8.5px",
                letterSpacing:"0.22em", textTransform:"uppercase",
              }}>
              <Ticket strokeWidth={1.3} className="w-3 h-3" />
              Tickets
            </Link>

            <motion.button
              type="button"
              onClick={() => setOpen(v => !v)}
              onTouchStart={(e) => e.currentTarget.style.opacity = "0.8"}
              onTouchEnd={(e) => e.currentTarget.style.opacity = "1"}
              whileTap={{ scale:0.88 }}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 active:opacity-80"
              style={{
                background: open ? "rgba(198,169,98,0.12)" : "rgba(255,255,255,0.06)",
                border: open ? "1px solid rgba(198,169,98,0.28)" : "1px solid rgba(255,255,255,0.10)",
                color: open ? "rgba(198,169,98,0.80)" : "rgba(255,255,255,0.50)",
                pointerEvents: "auto",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                cursor: "pointer",
              }}
            >
              <AnimatePresence mode="wait">
                {open
                  ? <motion.span key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.2}}><X strokeWidth={1.4} className="w-4 h-4"/></motion.span>
                  : <motion.span key="m" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.2}}><Menu strokeWidth={1.4} className="w-4 h-4"/></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && <MobileOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
