"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Users, Coffee, Check, Music, MapPin,
  Mail, Phone, ArrowRight, Volume2, VolumeX,
} from "lucide-react";
import {
  FaWhatsapp, FaFacebook, FaInstagram, FaTiktok,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";

const EVENT_DATE = new Date("2025-12-31T20:30:00");

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return { d: 0, h: 0, m: 0, s: 0 };
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

/* ── Ambient orbs ── */
function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{ position:"absolute", width:800, height:800, top:"-20%", right:"-15%",
        background:"radial-gradient(circle, rgba(198,169,98,0.10) 0%, transparent 65%)",
        filter:"blur(100px)", animation:"vbOA 28s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:600, height:600, bottom:"0%", left:"-10%",
        background:"radial-gradient(circle, rgba(198,100,60,0.07) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"vbOB 34s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:500, height:500, top:"40%", left:"35%",
        background:"radial-gradient(circle, rgba(198,169,98,0.05) 0%, transparent 65%)",
        filter:"blur(70px)", animation:"vbOA 22s ease-in-out infinite reverse" }} />
      <style>{`
        @keyframes vbOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
        @keyframes vbOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(35px,-22px)} }
      `}</style>
    </div>
  );
}

/* ── Countdown digit ── */
function CountDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width:"clamp(64px,12vw,96px)", height:"clamp(64px,12vw,96px)",
          borderRadius:16,
          background:"linear-gradient(135deg, rgba(198,169,98,0.16) 0%, rgba(198,169,98,0.04) 100%)",
          backdropFilter:"blur(24px) saturate(160%)",
          border:"1px solid rgba(198,169,98,0.35)",
          boxShadow:"0 0 32px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <div className="absolute inset-x-2 top-0 h-px"
             style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent)" }} />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y:-20, opacity:0 }}
            animate={{ y:0, opacity:1 }}
            exit={{ y:20, opacity:0 }}
            transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
            className="font-light text-[#C6A962]"
            style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,5vw,3rem)", letterSpacing:"0.04em" }}
          >
            {String(value).padStart(2,"0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-white/30 text-[8px] tracking-[0.4em] uppercase"
         style={{ fontFamily:"'Jost',sans-serif" }}>{label}</p>
    </div>
  );
}

/* ── Glass card ── */
function GlassCard({ children, className = "", gold = false }: { children: React.ReactNode; className?: string; gold?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={gold ? {
        background:"linear-gradient(135deg, rgba(198,169,98,0.14) 0%, rgba(198,169,98,0.04) 100%)",
        backdropFilter:"blur(24px) saturate(160%)",
        border:"1px solid rgba(198,169,98,0.28)",
        boxShadow:"0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
      } : {
        background:"linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter:"blur(24px) saturate(160%)",
        border:"1px solid rgba(255,255,255,0.09)",
        boxShadow:"0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background:`linear-gradient(90deg, transparent, ${gold ? "rgba(198,169,98,0.45)" : "rgba(255,255,255,0.18)"}, transparent)` }} />
      {children}
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ eyebrow, title, gold }: { eyebrow: string; title: React.ReactNode; gold?: string }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ duration:0.8 }} className="text-center mb-14">
      <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4"
         style={{ fontFamily:"'Jost',sans-serif" }}>{eyebrow}</p>
      <h2 className="font-light text-white"
          style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,4vw,3.2rem)", letterSpacing:"0.06em" }}>
        {title}{gold && <em style={{ color:"#C6A962", fontStyle:"italic" }}> {gold}</em>}
      </h2>
      <div className="mt-5 mx-auto w-10 h-px"
           style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)" }} />
    </motion.div>
  );
}

const SERVICES = [
  { title:"Event Planning & Management", icon:"✦", items:["Full-service event planning and execution","Corporate events, private parties, concerts, cultural and social events","Timeline creation and on-site event coordination","Vendor and supplier management (sound, lighting, staging, décor)"] },
  { title:"Artist & Talent Management", icon:"✦", items:["Booking and coordination of artists, DJs, performers, and hosts","Contract management and scheduling","Artist hospitality and performance coordination"] },
  { title:"Event Marketing & Promotion", icon:"✦", items:["Digital marketing campaigns for events","Social media management (Instagram, Facebook, TikTok, LinkedIn)","Audience targeting and engagement strategies","Influencer and media collaborations"] },
  { title:"Ticketing & Guest Management", icon:"✦", items:["Ticket sales setup and management","Digital invitations and RSVP systems","Guest list management and check-in solutions","Promotional codes and VIP access coordination"] },
  { title:"Branding & Creative Services", icon:"✦", items:["Brand identity development","Logo design and visual branding","Event flyers, posters, banners, and invitations","Creative concepts and themed event design"] },
  { title:"Media Production", icon:"✦", items:["Professional photography and videography","Event highlight videos and promotional content","Video editing and post-production","Social media-ready visual content"] },
  { title:"Technical & Production", icon:"✦", items:["Sound, lighting, and stage production","LED screens and visual displays","Live streaming and broadcast solutions","Technical setup and on-site supervision"] },
  { title:"Logistics & Operations", icon:"✦", items:["Equipment coordination and transportation","Venue setup and breakdown","Staff coordination (ushers, security, technicians)","On-site operations management"] },
  { title:"Sponsorship & Partnerships", icon:"✦", items:["Sponsor acquisition and management","Brand placement and activation strategies","Partnership coordination before and during events"] },
  { title:"Consulting & Event Strategy", icon:"✦", items:["Event concept development","Budget planning and cost optimization","Market research and competitor analysis","Post-event reports and performance analysis"] },
];

export default function GalaPage() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const [email,         setEmail]         = useState("");
  const [subStatus,     setSubStatus]     = useState<string | null>(null);
  const [reserveStatus, setReserveStatus] = useState<string | null>(null);
  const [muted,         setMuted]         = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) { audioRef.current.volume = 0.10; audioRef.current.play().catch(() => {}); }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const subscribe = async () => {
    if (!email.includes("@")) { setSubStatus("Please enter a valid email address."); return; }
    try {
      const { error } = await supabase.from("subscriptions").insert([{ email }]);
      setSubStatus(error ? "Subscription failed. Please try again." : "Subscribed successfully!");
      if (!error) setEmail("");
    } catch { setSubStatus("Subscription failed. Please try again."); }
  };

  const startCheckout = async (ticketId: string) => {
    if (!email.includes("@")) { setReserveStatus("Please enter a valid email address."); return; }
    try {
      const { error } = await supabase.from("reservations").insert([{ email, ticket_type:ticketId, status:"pending" }]);
      setReserveStatus(error ? "Reservation failed. Please try again." : "Reservation successful! Check your email for next steps.");
      if (!error) setEmail("");
    } catch { setReserveStatus("Reservation failed. Please try again."); }
  };

  const tickets = useMemo(() => [
    { id:"vip-red",  name:"VIP Red",         price:250, badge:"Premium",    color:"rgba(220,60,60,0.6)" },
    { id:"blue",     name:"Blue",             price:200, badge:"Popular",    color:"rgba(60,120,220,0.6)" },
    { id:"green",    name:"Green",            price:175, badge:null,         color:"rgba(60,180,100,0.6)" },
    { id:"yellow",   name:"Yellow",           price:150, badge:null,         color:"rgba(220,180,60,0.6)" },
    { id:"purple",   name:"Purple",           price:120, badge:null,         color:"rgba(140,80,220,0.6)" },
    { id:"group",    name:"Group (4+ People)",price:145, badge:"Best Value", color:"rgba(60,200,160,0.6)" },
  ], []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background:#080808; font-family:'Jost',sans-serif; }
        ::selection { background:#C6A962; color:#080808; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(198,169,98,0.3); border-radius:9999px; }
      `}</style>

      <div className="relative bg-[#080808] text-white overflow-x-hidden min-h-screen">
        <Orbs />

        {/* Audio */}
        <audio ref={audioRef} loop preload="auto">
          <source src="/luxury-ambient.mp3" type="audio/mpeg" />
        </audio>

        {/* Sound toggle */}
        <motion.button
          onClick={() => setMuted(v => !v)}
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-11 h-11 rounded-full"
          style={{
            background:"linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))",
            backdropFilter:"blur(20px)",
            border:"1px solid rgba(198,169,98,0.35)",
            boxShadow:"0 0 24px rgba(198,169,98,0.15)",
          }}
          aria-label="Toggle sound"
        >
          {muted
            ? <VolumeX strokeWidth={1.3} className="w-4 h-4 text-[#C6A962]" />
            : <Volume2 strokeWidth={1.3} className="w-4 h-4 text-[#C6A962]" />
          }
        </motion.button>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover scale-105"
            src="/arab.mp4" autoPlay loop muted playsInline
            style={{ filter:"brightness(0.35) saturate(0.8)" }}
          />
          <div className="absolute inset-0"
               style={{ background:"radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.65) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-64"
               style={{ background:"linear-gradient(to top, #080808, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-32"
               style={{ background:"linear-gradient(to bottom, rgba(8,8,8,0.6), transparent)" }} />

          <div className="relative z-10 text-center px-6 flex flex-col items-center">
            <motion.span
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.3 }}
              className="inline-block mb-7 px-5 py-2 rounded-full text-white/35 text-[9px] tracking-[0.45em] uppercase font-light"
              style={{
                background:"linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.03))",
                backdropFilter:"blur(20px)",
                border:"1px solid rgba(198,169,98,0.25)",
                boxShadow:"inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              VibeUp Events &amp; Services
            </motion.span>

            <motion.h1
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:1.1, delay:0.45, ease:[0.22,1,0.36,1] }}
              className="font-light text-white leading-none mb-5"
              style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(3rem,9vw,8rem)",
                letterSpacing:"0.04em",
                textShadow:"0 4px 48px rgba(0,0,0,0.4)",
              }}
            >
              Creating<br /><em style={{ color:"#C6A962" }}>Unforgettable</em><br />Experiences
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.7 }}
              className="text-white/35 font-light mb-10 max-w-md leading-relaxed"
              style={{ fontSize:"0.88rem", letterSpacing:"0.10em" }}
            >
              Join us for Abdel Karim's Arab Nights — March 28th.<br />Limited tickets available.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.9 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/about"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white/65 text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-400 hover:text-white/90 hover:scale-[1.02]"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(255,255,255,0.10)",
                }}>
                Upcoming Events <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="https://vibesup.org/events/arab-nights"
                target="_blank"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[#C6A962] text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(198,169,98,0.35)",
                  boxShadow:"0 0 28px rgba(198,169,98,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}>
                Buy Tickets Now <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 z-10">
            <span className="text-white text-[8px] tracking-[0.4em] uppercase">Scroll</span>
            <div className="w-px h-9 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ══════════════════════════════════════
            COUNTDOWN
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6"
                 style={{ borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <SectionHeader eyebrow="Time Remaining" title="The Night" gold="Approaches" />
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8 }}
            className="flex items-start justify-center gap-4 sm:gap-8 flex-wrap"
          >
            <CountDigit value={d} label="Days" />
            <div className="text-[#C6A962]/40 text-3xl font-light mt-4" style={{ fontFamily:"'Cormorant Garamond',serif" }}>:</div>
            <CountDigit value={h} label="Hours" />
            <div className="text-[#C6A962]/40 text-3xl font-light mt-4" style={{ fontFamily:"'Cormorant Garamond',serif" }}>:</div>
            <CountDigit value={m} label="Minutes" />
            <div className="text-[#C6A962]/40 text-3xl font-light mt-4" style={{ fontFamily:"'Cormorant Garamond',serif" }}>:</div>
            <CountDigit value={s} label="Seconds" />
          </motion.div>

          {/* Event details strip */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8, delay:0.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon:<MapPin strokeWidth={1.3} className="w-3.5 h-3.5" />, text:"Hilton Los Angeles / Universal City" },
              { icon:<Music  strokeWidth={1.3} className="w-3.5 h-3.5" />, text:"Arab Nights — Live Performance" },
              { icon:<Star   strokeWidth={1.3} className="w-3.5 h-3.5" />, text:"December 31, 2025 · 8:30 PM" },
            ].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                   style={{
                     background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                     backdropFilter:"blur(16px)",
                     border:"1px solid rgba(255,255,255,0.08)",
                   }}>
                <span style={{ color:"#C6A962" }}>{item.icon}</span>
                <span className="text-white/45 text-[9px] tracking-[0.2em] uppercase"
                      style={{ fontFamily:"'Jost',sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            TICKETS
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 sm:px-12">
          <SectionHeader eyebrow="Reserve Your Place" title="Choose Your" gold="Experience" />

          {/* Email input */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8 }}
            className="max-w-md mx-auto mb-10"
          >
            <div className="flex gap-3">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-2xl px-5 py-3.5 text-white/75 text-sm font-light outline-none transition-all duration-300"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(255,255,255,0.09)",
                  fontFamily:"'Jost',sans-serif",
                  letterSpacing:"0.05em",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(198,169,98,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,169,98,0.09)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            {reserveStatus && (
              <p className="mt-3 text-[10px] tracking-[0.2em] text-center"
                 style={{ color: reserveStatus.includes("successful") ? "rgba(80,200,120,0.75)" : "rgba(255,80,80,0.75)", fontFamily:"'Jost',sans-serif" }}>
                {reserveStatus}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.08, duration:0.8, ease:[0.22,1,0.36,1] }}
              >
                <GlassCard className="p-6 flex flex-col gap-4 h-full" gold={ticket.badge === "Premium"}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/20 text-[8px] tracking-[0.35em] uppercase mb-1"
                         style={{ fontFamily:"'Jost',sans-serif" }}>Ticket</p>
                      <h3 className="font-light text-white/90"
                          style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", letterSpacing:"0.06em" }}>
                        {ticket.name}
                      </h3>
                    </div>
                    {ticket.badge && (
                      <span className="px-3 py-1 rounded-full text-[8px] tracking-[0.25em] uppercase"
                            style={{
                              background:"linear-gradient(135deg, rgba(198,169,98,0.20), rgba(198,169,98,0.06))",
                              border:"1px solid rgba(198,169,98,0.30)",
                              color:"#C6A962",
                              fontFamily:"'Jost',sans-serif",
                            }}>
                        {ticket.badge}
                      </span>
                    )}
                  </div>

                  {/* Color swatch */}
                  <div className="w-8 h-1 rounded-full" style={{ background:ticket.color }} />

                  <p className="font-light"
                     style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:"#C6A962", letterSpacing:"0.04em" }}>
                    ${ticket.price}
                    <span className="text-white/25 text-sm ml-1" style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.75rem", letterSpacing:"0.1em" }}>/ person</span>
                  </p>

                  <motion.button
                    onClick={() => startCheckout(ticket.id)}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    className="mt-auto w-full py-3 rounded-full text-[10px] tracking-[0.28em] uppercase font-light transition-all duration-400"
                    style={{
                      background:"linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))",
                      border:"1px solid rgba(198,169,98,0.30)",
                      backdropFilter:"blur(12px)",
                      color:"#C6A962",
                      fontFamily:"'Jost',sans-serif",
                    }}
                  >
                    Reserve Seat
                  </motion.button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-12 h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.2), transparent)" }} />

        {/* ══════════════════════════════════════
            WHY ATTEND
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 sm:px-12">
          <SectionHeader eyebrow="Why Attend" title="An Evening" gold="Unlike Any Other" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon:<Star strokeWidth={1.2} className="w-6 h-6" />, title:"World-Class Entertainment", body:"Featuring renowned Arab artists and live orchestra for an unmatched cultural experience." },
              { icon:<Coffee strokeWidth={1.2} className="w-6 h-6" />, title:"Five-Star Dining", body:"Exquisite gourmet menu curated by Hilton's finest chefs — every course a revelation." },
              { icon:<Users strokeWidth={1.2} className="w-6 h-6" />, title:"Unforgettable Celebration", body:"Prime New Year countdown in a luxury atmosphere you will remember for a lifetime." },
            ].map((card, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.1, duration:0.8, ease:[0.22,1,0.36,1] }}>
                <GlassCard className="p-8 text-center flex flex-col items-center gap-4 h-full">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl"
                       style={{
                         background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))",
                         border:"1px solid rgba(198,169,98,0.22)",
                         color:"#C6A962",
                       }}>
                    {card.icon}
                  </div>
                  <h3 className="font-light text-white/85"
                      style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", letterSpacing:"0.06em" }}>
                    {card.title}
                  </h3>
                  <div className="w-8 h-px" style={{ background:"rgba(198,169,98,0.4)" }} />
                  <p className="text-white/35 font-light leading-relaxed text-sm"
                     style={{ letterSpacing:"0.05em" }}>
                    {card.body}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-12 h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.2), transparent)" }} />

        {/* ══════════════════════════════════════
            SERVICES (Luxury Design System)
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6 sm:px-12">
          <Orbs />
          <SectionHeader
            eyebrow="What We Do"
            title={<span>VibeUp</span>}
            gold="Services"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto">
            {SERVICES.map((service, i) => {
              // Split last word for gold italic
              const words = service.title.split(" ");
              const last = words.pop();
              const titleStyled = (
                <span>
                  {words.join(" ")}{" "}
                  <em style={{ color: "#C6A962", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>
                    {last}
                  </em>
                </span>
              );
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 2) * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard
                    className={`p-8 h-full flex flex-col`}
                    gold={i % 2 === 0}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        style={{
                          color: "#C6A962",
                          opacity: 0.35,
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: "1.3rem",
                          fontStyle: "italic",
                        }}
                        aria-hidden
                      >
                        {service.icon}
                      </span>
                      <h3
                        className="font-light text-white"
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: "clamp(1.15rem,2.4vw,1.45rem)",
                          letterSpacing: "0.07em",
                          fontWeight: 300,
                        }}
                      >
                        {titleStyled}
                      </h3>
                    </div>
                    <div
                      className="mb-5 w-14 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, #C6A96280 50%, transparent)",
                        marginLeft: 38,
                      }}
                    />
                    <ul className="space-y-3">
                      {service.items.map((item) => {
                        // Gold last word for each point
                        const itemWords = item.split(" ");
                        const itemLast = itemWords.pop();
                        return (
                          <li key={item} className="flex items-start gap-3">
                            <span className="flex-shrink-0 pt-1">
                              <Check style={{ color: "#C6A962", opacity: 0.7 }} className="w-4 h-4" />
                            </span>
                            <span
                              className="text-white/60 font-light text-[1rem] leading-relaxed"
                              style={{
                                fontFamily: "'Jost',sans-serif",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {itemWords.join(" ")}
                              {itemWords.length > 0 && " "}
                              <em
                                style={{
                                  color: "#C6A962",
                                  fontStyle: "italic",
                                  fontFamily: "'Cormorant Garamond',serif",
                                  fontWeight: 400,
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {itemLast}
                              </em>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
          {/* Divider */}
          <div className="mx-auto mt-16 mb-8 w-24 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.22), transparent)",
            }}
          />
          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8 flex flex-col items-center" gold>
              <p
                className="text-white/30 text-[10px] tracking-[0.45em] uppercase mb-6"
                style={{ fontFamily: "'Jost',sans-serif" }}
              >
                Optional Add-Ons
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {[
                  "VIP and hospitality services",
                  "Catering and food vendor coordination",
                  "Custom décor and luxury event styling",
                  "Corporate and brand activations",
                ].map((item) => {
                  const itemWords = item.split(" ");
                  const itemLast = itemWords.pop();
                  return (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex-shrink-0 pt-0.5">
                        <Check style={{ color: "#C6A962", opacity: 0.8 }} className="w-4 h-4" />
                      </span>
                      <span
                        className="text-white/70 font-light text-[1rem]"
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {itemWords.join(" ")}
                        {itemWords.length > 0 && " "}
                        <em
                          style={{
                            color: "#C6A962",
                            fontStyle: "italic",
                            fontFamily: "'Cormorant Garamond',serif",
                            fontWeight: 400,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {itemLast}
                        </em>
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
          {/* View all services */}
          <div className="text-center mt-14">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-[#C6A962] text-[11px] font-light tracking-[0.3em] uppercase transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(198,169,98,0.28)",
                boxShadow: "0 0 28px rgba(198,169,98,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
                fontFamily: "'Jost',sans-serif",
              }}
            >
              View All Services <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-12 h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.2), transparent)" }} />

        {/* ══════════════════════════════════════
            SUBSCRIBE
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-6">
          <div className="max-w-lg mx-auto text-center">
            <SectionHeader eyebrow="Stay Updated" title="Join the" gold="Inner Circle" />
            <p className="text-white/30 font-light text-sm leading-relaxed mb-10"
               style={{ letterSpacing:"0.06em" }}>
              Get exclusive updates, reminders, and early access offers for upcoming events.
            </p>

            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-2xl px-5 py-3.5 text-white/75 text-sm font-light outline-none transition-all duration-300"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(255,255,255,0.09)",
                  fontFamily:"'Jost',sans-serif",
                  letterSpacing:"0.05em",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(198,169,98,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,169,98,0.09)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }}
                onKeyDown={e => e.key === "Enter" && subscribe()}
              />
              <motion.button onClick={subscribe} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                className="px-7 py-3.5 rounded-full text-[#C6A962] text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-400"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.20), rgba(198,169,98,0.07))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(198,169,98,0.30)",
                  boxShadow:"0 0 24px rgba(198,169,98,0.12)",
                  fontFamily:"'Jost',sans-serif",
                  whiteSpace:"nowrap",
                }}>
                Subscribe
              </motion.button>
            </div>

            {subStatus && (
              <p className="mt-4 text-[10px] tracking-[0.2em]"
                 style={{ color: subStatus.includes("success") ? "rgba(80,200,120,0.75)" : "rgba(255,80,80,0.75)", fontFamily:"'Jost',sans-serif" }}>
                {subStatus}
              </p>
            )}
            <p className="mt-5 text-white/15 text-[9px] tracking-[0.25em]"
               style={{ fontFamily:"'Jost',sans-serif" }}>
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <footer className="relative z-10"
                style={{ background:"#060606", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.20), transparent)" }} />

          <div className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">

              {/* Quick links */}
              <GlassCard className="p-7">
                <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5"
                   style={{ fontFamily:"'Jost',sans-serif" }}>Quick Links</p>
                <ul className="space-y-3">
                  {[
                    { href:"/", label:"Home" },
                    { href:"/checkout", label:"Tickets" },
                    { href:"/upcoming-events", label:"Memories" },
                    { href:"/contact-us", label:"Contact" },
                  ].map(l => (
                    <li key={l.href}>
                      <Link href={l.href}
                        className="flex items-center gap-2 text-white/35 hover:text-[#C6A962] transition-colors duration-300 text-sm font-light"
                        style={{ fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em" }}>
                        <ArrowRight strokeWidth={1.2} className="w-3 h-3" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Contact */}
              <GlassCard className="p-7">
                <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5"
                   style={{ fontFamily:"'Jost',sans-serif" }}>Contact</p>
                <ul className="space-y-4">
                  <li>
                    <a href="mailto:vibesup.event@gmail.com"
                       className="flex items-center gap-3 text-white/40 hover:text-[#C6A962] transition-colors duration-300 text-sm font-light"
                       style={{ fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em" }}>
                      <Mail strokeWidth={1.3} className="w-3.5 h-3.5 shrink-0" style={{ color:"rgba(198,169,98,0.6)" }} />
                      vibesup.event@gmail.com
                    </a>
                  </li>
                  {["+1 (949) 247-9309", "+1 (917) 818-7850"].map(n => (
                    <li key={n}>
                      <a href={`tel:${n.replace(/\D/g,"")}`}
                         className="flex items-center gap-3 text-white/40 hover:text-[#C6A962] transition-colors duration-300 text-sm font-light"
                         style={{ fontFamily:"'Jost',sans-serif" }}>
                        <Phone strokeWidth={1.3} className="w-3.5 h-3.5 shrink-0" style={{ color:"rgba(198,169,98,0.6)" }} />
                        {n}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center gap-3">
                    <MapPin strokeWidth={1.3} className="w-3.5 h-3.5 shrink-0" style={{ color:"rgba(198,169,98,0.6)" }} />
                    <span className="text-white/30 text-sm font-light" style={{ fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em" }}>
                      Hilton Los Angeles / Universal City
                    </span>
                  </li>
                </ul>
              </GlassCard>

              {/* Social */}
              <GlassCard className="p-7">
                <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5"
                   style={{ fontFamily:"'Jost',sans-serif" }}>Follow Us</p>
                <div className="flex gap-3 mb-5">
                  {[
                    { icon:<FaWhatsapp />, href:"https://wa.me/19492479309",                color:"#22c55e" },
                    { icon:<FaFacebook />, href:"https://www.facebook.com/vibeupevents",   color:"#3b82f6" },
                    { icon:<FaInstagram/>, href:"https://www.instagram.com/vibeupevent/",  color:"#ec4899" },
                    { icon:<FaTiktok   />, href:"https://www.tiktok.com/@vibesupevent",    color:"#fff" },
                  ].map((s, i) => (
                    <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale:1.12, y:-2 }} whileTap={{ scale:0.9 }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-lg"
                      style={{
                        background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                        border:"1px solid rgba(255,255,255,0.09)",
                        color: s.color,
                      }}>
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
                <p className="text-white/20 text-xs font-light leading-relaxed"
                   style={{ fontFamily:"'Jost',sans-serif", letterSpacing:"0.05em" }}>
                  Stay updated with our latest news and behind-the-scenes content.
                </p>
              </GlassCard>
            </div>

            {/* Bottom bar */}
            <div className="h-px mb-8"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/20 text-[9px] tracking-[0.3em]"
                 style={{ fontFamily:"'Jost',sans-serif" }}>
                © 2025 VibeUp Events. All rights reserved.
              </p>
              <div className="flex gap-6">
                {["Privacy Policy","Terms of Service","Refund Policy"].map(l => (
                  <a key={l} href="https://policies.google.com/privacy"
                     className="text-white/20 text-[9px] tracking-[0.2em] uppercase hover:text-white/45 transition-colors duration-300"
                     style={{ fontFamily:"'Jost',sans-serif" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Presented by */}
            <div className="mt-8 pt-6 text-center"
                 style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-white/15 text-[9px] tracking-[0.3em]"
                 style={{ fontFamily:"'Jost',sans-serif" }}>
                Presented by{" "}
                <a href="https://www.instagram.com/fr3_fdn/" target="_blank" rel="noopener noreferrer"
                   className="hover:opacity-80 transition-opacity">
                  <span style={{ color:"#7C3AED" }}>FR</span>
                  <span style={{ color:"#C6A962" }}>ع</span>
                </a>
                {" "}· California Nights Entertainment
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}