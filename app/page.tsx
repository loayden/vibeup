"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Check, Clock, CreditCard, MapPin, Star, Music, Users, Coffee } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaCreditCard as FaCreditCardIcon,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock as FaClockIcon,
  FaStar,
   FaUtensils,
   FaMusic,
    FaClipboardList,
     FaUsers 
} from "react-icons/fa";
import { FaPersonDress } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";

/**
 * PRODUCTION NOTES
 * ----------------
 * Payments: Stripe Checkout (Card, Apple Pay, Google Pay)
 * Backend: Supabase (Auth, DB, Storage, Edge Functions)
 * Email: Mailchimp/ConvertKit via webhook after purchase + reminders
 * QR Tickets: Generate on backend after successful payment
 * ENV VARS (example):
 *  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *  - STRIPE_SECRET_KEY (server)
 *  - SUPABASE_URL
 *  - SUPABASE_ANON_KEY
 *  - MAILCHIMP_API_KEY / CONVERTKIT_API_KEY
 */

const EVENT_DATE = new Date("2025-12-31T20:30:00");

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Prevent hydration mismatch between server and client
  if (now === null) {
    return { d: 0, h: 0, m: 0, s: 0, diff: 0 };
  }

  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return { d, h, m, s, diff };
}

export default function GalaPage() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [subStatus, setSubStatus] = useState<null | string>(null);
  const [reserveStatus, setReserveStatus] = useState<null | string>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.12;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const tickets = useMemo(
    () => [
      { id: "vip-red", name: "VIP Red", price: 250, color: "🔴", badge: "Premium" },
      { id: "blue", name: "Blue", price: 200, color: "🔵", badge: "Popular" },
      { id: "green", name: "Green", price: 175, color: "🟢" },
      { id: "yellow", name: "Yellow", price: 150, color: "🟡" },
      { id: "purple", name: "Purple", price: 120, color: "🟣" },
      { id: "group", name: "Group (4+ People)", price: 145, color: "🟢", badge: "Best Value" },
    ],
    []
  );
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
  // Subscription flow: enhanced, with inline feedback
  const subscribe = async (): Promise<void> => {
    setSubStatus(null);
    if (!email || !email.includes("@")) {
      setSubStatus("Please enter a valid email address.");
      return;
    }
    try {
      const { error } = await supabase.from("subscriptions").insert([{ email }]);
      if (error) {
        setSubStatus("Subscription failed. Please try again.");
      } else {
        setSubStatus("Subscribed successfully!");
        setEmail("");
      }
    } catch {
      setSubStatus("Subscription failed. Please try again.");
    }
  };
  {/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>

  // Ticket reservation: prompt-free, linkable via email input
  const startCheckout = async (ticketId: string) => {
    setReserveStatus(null);
    if (!email || !email.includes("@")) {
      setReserveStatus("Please enter a valid email address.");
      return;
    }
    try {
      const { error } = await supabase.from("reservations").insert([
        {
          email,
          ticket_type: ticketId,
          promo: promo || null,
          status: "pending",
        },
      ]);
      if (error) {
        setReserveStatus("Reservation failed. Please try again.");
      } else {
        setReserveStatus("Reservation successful! Check your email for next steps.");
        setEmail("");
      }
    } catch {
      setReserveStatus("Reservation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 text-neutral-100 font-sans">
      <div>
        <audio ref={audioRef} autoPlay loop preload="auto">
          <source src="/luxury-ambient.mp3" type="audio/mpeg" />
        </audio>
        <button
  onClick={() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }}
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 999999,
  }}
  className="w-10 h-10 rounded-full bg-black border border-amber-400 text-amber-400 flex items-center justify-center shadow-lg hover:scale-110 transition"
  aria-label="Toggle sound"
>
          🔊
        </button>
      </div>
      {/* SEO: metadata is exported via `export const metadata` for the App Router */}

      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg')` }}
        >
          {/* Luxury overlay: deep purple-black gradient with gold shimmer */}
         <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-600/20 via-amber-400/10 to-amber-900/20 border border-amber-500/40 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-amber-400/10">
            <Star className="w-5 h-5 text-amber-400 drop-shadow-glow" />
            <span className="text-amber-200 text-sm font-semibold tracking-widest uppercase" style={{ letterSpacing: '0.12em' }}>Limited Tickets Available</span>
          </div>
          <h1 className="text-[2.8rem] md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight tracking-widest drop-shadow-[0_4px_32px_rgba(255,215,64,0.3)] uppercase" style={{letterSpacing:'0.11em', textShadow: '0 0 16px #ffd70099, 0 2px 8px #000'}}>
            <span className="block text-amber-400 text-[1.3em] leading-tight font-black tracking-wider uppercase drop-shadow-glow" style={{letterSpacing:'0.13em', textShadow: '0 0 32px #ffb30099, 0 2px 8px #000'}}>New Year's Gala 2026</span>
            <span className="block text-white mt-2 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-wider drop-shadow-[0_4px_32px_rgba(255,255,255,0.08)] uppercase" style={{letterSpacing:'0.1em'}}>Black &amp; Gold Gala Dinner</span>
            <span className="block mt-4 text-xl md:text-2xl text-amber-200 font-semibold tracking-wider uppercase" style={{letterSpacing:'0.08em', textShadow: '0 0 8px #ffd70055'}}>
              Featuring <span className="inline-flex items-center gap-2"><Music className="inline-block text-amber-400 drop-shadow-glow" /> Abdelkarim Hamdan</span> &amp; <span className="inline-flex items-center gap-2"><Music className="inline-block text-amber-400 drop-shadow-glow" /> Sherine Zaza</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(255,215,64,0.13)]">
            A Black-Tie Gala with Five-Star Dining, Live Entertainment, DJ, and VIP Experience at Hilton Los Angeles
          </p>
          <div className="mb-12 flex gap-4 justify-center items-center">
            {/* Countdown Blocks */}
            {[
              { label: "days", value: d },
              { label: "hours", value: h },
              { label: "minutes", value: m },
              { label: "seconds", value: s },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-[#fbbf24] via-[#eab308] to-[#b45309] rounded-lg px-4 py-3 min-w-[80px] shadow-xl border border-amber-400/70 transition-all duration-200 hover:scale-105 hover:shadow-amber-400/60" style={{ boxShadow: '0 0 24px 0 #ffd70044, 0 2px 8px #0008' }}>
                  <div className="text-3xl md:text-4xl font-black text-black drop-shadow-[0_2px_8px_rgba(255,220,40,0.17)] tracking-widest uppercase">{t.value.toString().padStart(2, "0")}</div>
                </div>
                <div className="text-xs md:text-sm text-amber-200 mt-2 uppercase tracking-widest font-semibold">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
            <Link
              href="/checkout"
              className="px-10 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-black font-black text-lg rounded-xl shadow-2xl shadow-amber-400/30 hover:from-yellow-400 hover:to-amber-500 hover:shadow-amber-400/60 hover:scale-105 border-2 border-amber-300/60 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest"
              style={{ letterSpacing: '0.13em', textShadow: '0 0 12px #fffbe6a0' }}
            >
              <FaCreditCardIcon className="mr-2 h-5 w-5 drop-shadow-glow" /> Buy Tickets Now
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:text-amber-400 hover:scale-105 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest shadow-lg"
              style={{ letterSpacing: '0.11em', textShadow: '0 0 8px #fffbe6a0' }}
            >
              <FaClockIcon className="mr-2 h-5 w-5 drop-shadow-glow" /> Upcoming Events
            </Link>
          </div>
        </div>
      </div>
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* DETAILS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest text-amber-400 drop-shadow-glow">Event Details</h2>
              <div className="flex items-start gap-3">
                <FaClockIcon className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Date &amp; Time</span>
                  <p className="text-neutral-300">December 31, 2025 • 8:30 PM - 2:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Location</span>
                  <p className="text-neutral-300">Hilton Los Angeles/Universal City</p>
                  <p className="text-sm text-neutral-400">555 Universal Hollywood Dr, Universal City, CA 91608</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPersonDress className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Dress Code</span>
                  <p className="text-neutral-300">Formal Attire</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-widest text-amber-400 drop-shadow-glow">Contact Us</h3>
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Email</span>
                  <p className="text-neutral-300">vibesup.event@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Phone</span>
                  <p className="text-neutral-300">+1 (949) 247-9309</p>
                  <p className="text-neutral-300">+1 (917) 818-7850</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCreditCardIcon className="mt-1 text-amber-400" />
                <div>
                  <span className="font-semibold text-neutral-200">Refund Policy</span>
                  <p className="text-sm text-neutral-400">Tickets are non-refundable. Prices subject to change.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* SCHEDULE */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-widest text-amber-400 drop-shadow-glow">Evening Schedule</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                id: "door-open",
                time: "8:30 PM",
                event: (
                  <>
                    <FaMapMarkerAlt className="inline-block text-amber-400 mr-2 mb-1 drop-shadow-glow" /> Door Open
                  </>
                ),
              },
              {
                id: "dinner-concert",
                time: "10:00 PM",
                event: (
                  <>
                    <FaPersonDress className="inline-block text-amber-400 mr-2 mb-1 drop-shadow-glow" /> Dinner &amp; Concert
                  </>
                ),
              },
              {
                id: "countdown",
                time: "11:45 PM",
                event: (
                  <>
                    <FaClockIcon className="inline-block text-amber-400 mr-2 mb-1 drop-shadow-glow" /> Midnight Countdown
                  </>
                ),
              },
              {
                id: "event-ends",
                time: "2:00 AM",
                event: (
                  <>
                    <Star className="inline-block text-amber-400 mr-2 mb-1 drop-shadow-glow" /> Event Ends
                  </>
                ),
              },
            ].map((t) => (
              <Card key={t.id} className="bg-gradient-to-br from-[#1a0730]/90 to-neutral-950 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-extrabold text-amber-400 tracking-widest uppercase drop-shadow-glow">{t.time}</p>
                  <p className="text-sm mt-2 font-semibold text-amber-100">{t.event}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* PRICING */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-3xl font-bold text-center uppercase tracking-widest text-amber-400 drop-shadow-glow">Seating Chart & Pricing</h2>
        <p className="text-center text-amber-200 mb-12 font-medium">Choose your perfect seating location</p>
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-3 w-full max-w-md mb-4">
            <Input
              placeholder="Enter your email to book your tickets"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 flex-1"
            />
          </div>
          {reserveStatus && (
            <p className={`text-xs mt-2 ${reserveStatus.includes("success") ? "text-green-400" : "text-red-400"}`}>{reserveStatus}</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {tickets.map((t) => (
    <Card
      key={t.id}
      className="relative bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40 hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
    >
      <CardContent className="p-6">
        {/* Badge */}
        {t.badge && (
          <Badge
            className="absolute right-4 top-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 text-black text-xs font-extrabold uppercase tracking-[0.11em] shadow-lg shadow-amber-300/40 border border-amber-200/60"
            // boxShadow: '0 0 16px #ffd70055' is handled by shadow-lg + shadow-amber-300/40
          >
            {t.badge}
          </Badge>
        )}
        {/* Ticket Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-6 h-6 rounded-full flex-shrink-0 shadow-lg`}
            style={{
              backgroundColor:
                t.color === "🔴"
                  ? "#F87171"
                  : t.color === "🔵"
                  ? "#60A5FA"
                  : t.color === "🟢"
                  ? "#34D399"
                  : t.color === "🟡"
                  ? "#FACC15"
                  : t.color === "🟣"
                  ? "#A78BFA"
                  : "#6B7280",
              boxShadow: '0 0 12px #ffd70066, 0 2px 8px #0008'
            }}
          ></span>
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">{t.name}</h3>
            {t.id === "group" && (
              <p className="text-xs text-neutral-400">4 or more people</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="border-t border-amber-400/30 pt-4 mb-4">
          <p className="text-3xl font-black text-amber-400 drop-shadow-glow">${t.price.toFixed(2)}</p>
          <p className="text-xs text-neutral-400 mt-1">Per person</p>
        </div>

        {/* Features */}
        <ul className="space-y-2 text-sm mb-6 text-amber-100 font-semibold">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-amber-400 drop-shadow-glow" /> Reserved Seating
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-amber-400 drop-shadow-glow" /> Full Event Access
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-amber-400 drop-shadow-glow" /> Dinner & Show
          </li>
        </ul>

        {/* Book Button */}
        <Button
          key={shakeKey}
          onClick={() => {
            setShakeKey(prev => prev + 1);
            if (!email || !email.includes("@")) {
              setReserveStatus("ENTER_EMAIL_REQUIRED");
              return;
            }
            startCheckout(t.id);
          }}
          className="w-full rounded-lg bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg hover:shadow-amber-400/60 transition-all duration-300 animate-shake"
          style={{ letterSpacing: '0.09em', textShadow: '0 0 8px #fffbe6a0' }}
        >
          {reserveStatus === "ENTER_EMAIL_REQUIRED"
            ? "Enter your email to book"
            : <>
                <CreditCard className="h-4 w-4 drop-shadow-glow" /> Book Now
              </>
          }
        </Button>
      </CardContent>
    </Card>
  ))}
      </div>
</section>

      {/* EMAIL */}
      <section className="py-16 border-y border-amber-500/20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-2 uppercase tracking-widest text-amber-400 drop-shadow-glow">Stay Updated</h2>
          <p className="text-amber-200 mb-8 font-medium">
            Get exclusive updates, reminders, and special offers for the gala
          </p>
          <div className="flex gap-3 flex-col sm:flex-row sm:items-center sm:justify-center">
            <Input
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-neutral-900 border-amber-700 text-white placeholder:text-neutral-500 sm:max-w-sm"
            />
            <Button
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black min-w-fit uppercase tracking-widest shadow-lg hover:shadow-amber-400/60 hover:scale-105 transition-all duration-300"
              style={{ letterSpacing: '0.09em', textShadow: '0 0 8px #fffbe6a0' }}
              onClick={subscribe}
              disabled={!email || !email.includes("@")}
            >
              Subscribe
            </Button>
          </div>
          {subStatus && (
            <p className={`text-xs mt-4 ${subStatus.includes("success") ? "text-green-400" : "text-red-400"}`}>
              {subStatus}
            </p>
          )}
          <p className="text-xs text-neutral-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

<div className="border-t border-amber-500/30 my-12"></div>
      {/* PERFORMERS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold text-center uppercase tracking-widest text-amber-400 drop-shadow-glow">Featuring Exceptional Artists</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40">
            <CardContent className="p-6">
              <h3 className="text-2xl font-extrabold mb-3 text-amber-400 uppercase tracking-wider drop-shadow-glow">✨ Abdelkarim Hamdan</h3>
              <p className="text-neutral-200 mb-4 font-medium">
                One of the most beloved voices in the Arab world. With his warm tone, heartfelt emotion, and remarkable presence, he rose to fame from the Arab Idol stage and captured the hearts of millions.
              </p>
              <p className="text-amber-200 italic">
                "His voice carries the soul of Damascus, the beauty of Syria, and the timeless spirit of Arabic music. A performance you will feel… not just hear."
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40">
            <CardContent className="p-6">
              <h3 className="text-2xl font-extrabold mb-3 text-amber-400 uppercase tracking-wider drop-shadow-glow">✨ Sherine Zaza</h3>
              <p className="text-neutral-200 mb-4 font-medium">
                A celebrated vocalist known for her graceful presence and soulful voice. She will open tonight's gala with a powerful rendition of the National Anthem.
              </p>
              <p className="text-amber-200">
                Accompanied by our orchestra ensemble to set the perfect tone for this unforgettable evening.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* SOCIAL PROOF & CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-3xl font-bold text-center uppercase tracking-widest text-amber-400 drop-shadow-glow">Why Attend?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-950 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Star className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">World-Class Entertainment</p>
              <p className="text-sm text-amber-200">Featuring renowned Arab artists and live orchestra</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-950 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Coffee className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">Five-Star Dining</p>
              <p className="text-sm text-amber-200">Exquisite gourmet menu curated by Hilton chefs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-950 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Users className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">Unforgettable Celebration</p>
              <p className="text-sm text-amber-200">Prime New Year countdown with luxury atmosphere</p>
            </CardContent>
          </Card>
        </div>
      </section>
{/* ABOUT & INFO */}
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* ABOUT & INFO */}
<section className="mx-auto max-w-6xl px-6 py-20 space-y-12">
  <h2 className="text-3xl font-bold text-amber-400 uppercase mb-8 text-center tracking-widest drop-shadow-glow">About This Gala</h2>

  <div className="grid gap-8 md:grid-cols-2">
    {/* Night of Elegance */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaStar className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">A Night of Elegance & Cultural Spirit</h3>
      </div>
      <p className="text-amber-100 leading-relaxed font-medium">
        Experience an unforgettable evening of sophistication and luxury as we welcome 2026 with a Black & Gold Gala Dinner. 
        This extraordinary event brings together the Arab community in California for a celebration of unity, culture, and refinement.
      </p>
    </div>

    {/* Venue */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaMapMarkerAlt className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">The Venue</h3>
      </div>
      <p className="text-amber-100 leading-relaxed font-medium">
        The gala will be held in a grand Sierra ballroom with lavish black-and-gold décor, a state-of-the-art catwalk stage, 
        stunning LED displays, and immersive lighting. Every detail is curated to deliver a world-class experience.
      </p>
    </div>

    {/* Luxury Dinner */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaUtensils className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">Luxury Gala Dinner by Hilton</h3>
      </div>
      <p className="text-amber-100 leading-relaxed font-medium">
        Guests will enjoy an exquisite five-star dinner prepared by Hilton chefs. 
        Each dish combines gourmet quality, elegant presentation, and impeccable service to complement the event's luxurious atmosphere.
      </p>
    </div>

    {/* Entertainment */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaMusic className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">World-Class Entertainment</h3>
      </div>
      <p className="text-amber-100 leading-relaxed font-medium">
        The evening features top-tier live performances, professional orchestra, and curated music, 
        creating a dynamic atmosphere that celebrates both cultural artistry and modern entertainment.
      </p>
    </div>

    {/* Reservation */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaClipboardList className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">How to Reserve Your Position</h3>
      </div>
      <ol className="list-decimal list-inside text-amber-100 font-medium space-y-1">
        <li>Choose your ticket(s) and complete the checkout.</li>
        <li>Open the confirmation email received after purchase.</li>
        <li>Click the reservation link to select your preferred seating (if available).</li>
      </ol>
    </div>

    {/* Event Organizer */}
    <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 p-6 rounded-xl shadow-2xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaUsers className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider drop-shadow-glow">Event Organizer</h3>
      </div>
      <p className="text-amber-100 font-medium">
        Presented by <strong>California Nights Entertainment</strong>.
      </p>
      <p className="text-sm text-neutral-400 mt-2">
        Contact: vibesup.event@gmail.com | +1 (949) 247-9309 | +1 (917) 818-7850
      </p>
    </div>
  </div>

  {/* Ultimate Gala Experience */}
  <div className="mt-16 p-8 bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 rounded-xl shadow-2xl border border-amber-500/30">
    <h2 className="text-3xl font-bold text-amber-400 uppercase mb-6 text-center tracking-widest drop-shadow-glow">The Ultimate New Year’s Eve Gala Experience</h2>
    <div className="space-y-4 text-amber-100 leading-relaxed font-medium">
      <p>
        The New Year’s Eve Gala is a meticulously curated black-tie celebration designed for guests seeking an exceptional experience. 
        Every element, from ambiance to service, is crafted to ensure comfort, elegance, and exclusivity.
      </p>
      <p>
        Guests will enjoy a gourmet gala dinner prepared by renowned chefs, followed by world-class entertainment and a live DJ. 
        The program is carefully paced to balance social connection and personal enjoyment.
      </p>
      <p>
        VIP ticket holders enjoy reserved seating, exclusive lounge access, priority service, and premium bottle options. 
        VIP access is intentionally limited to maintain exclusivity and comfort.
      </p>
      <p>
        Advanced lighting, acoustics, and synchronized countdown effects enhance the midnight celebration, creating an unforgettable collective moment for all attendees.
      </p>
      <p>
        The black-tie dress code elevates the event atmosphere, fostering elegance, sophistication, and memorable experiences.
      </p>
      <p>
        Transparency and professionalism define the event, ensuring guests are well-informed and supported throughout the evening.
      </p>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="border-t border-amber-900/40 bg-gradient-to-br from-black/95 via-[#1a0730]/90 to-[#2d1b09]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* About */}
            <div>
              <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
                <h3 className="font-extrabold text-lg text-amber-400 mb-4 tracking-widest uppercase drop-shadow-glow">About Gala</h3>
                <p className="text-sm text-amber-200 flex-1">Experience the most luxurious New Year celebration with world-class entertainment and exquisite dining.</p>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
                <h3 className="font-extrabold text-lg text-amber-400 mb-4 tracking-widest uppercase drop-shadow-glow">Quick Links</h3>
                <ul className="space-y-2 text-sm text-amber-200 flex-1">
                  <li>
                    <Link href="/" className="flex items-center gap-2 hover:text-amber-400 transition group font-semibold">
                      <FaStar className="text-amber-400 group-hover:scale-110 transition drop-shadow-glow" /> Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="flex items-center gap-2 hover:text-amber-400 transition group font-semibold">
                      <FaCreditCardIcon className="text-amber-400 group-hover:scale-110 transition drop-shadow-glow" /> Tickets
                    </Link>
                  </li>
                  <li>
                    <a href="/upcoming-events" className="flex items-center gap-2 hover:text-amber-400 transition group font-semibold">
                      <FaClockIcon className="text-amber-400 group-hover:scale-110 transition drop-shadow-glow" /> Memories
                    </a>
                  </li>
                  <li>
                    <a href="/contact-us" className="flex items-center gap-2 hover:text-amber-400 transition group font-semibold">
                      <FaEnvelope className="text-amber-400 group-hover:scale-110 transition drop-shadow-glow" /> Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Contact Info */}
            <div>
              <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
                <h3 className="font-extrabold text-lg text-amber-400 mb-4 tracking-widest uppercase drop-shadow-glow">Contact</h3>
                <ul className="space-y-2 text-sm text-amber-200 flex-1">
                  <li className="flex items-center gap-2">
                    <FaEnvelope className="text-amber-400 drop-shadow-glow" />
                    <a href="mailto:vibesup.event@gmail.com" className="hover:text-amber-400 transition font-semibold">vibesup.event@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPhoneAlt className="text-amber-400 drop-shadow-glow" />
                    <a href="tel:+19492479309" className="hover:text-amber-400 transition font-semibold">+1 (949) 247-9309</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPhoneAlt className="text-amber-400 drop-shadow-glow" />
                    <a href="tel:+19178187850" className="hover:text-amber-400 transition font-semibold">+1 (917) 818-7850</a>
                  </li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-400">
                  <FaMapMarkerAlt className="text-amber-400 drop-shadow-glow" />
                  <span>Hilton Los Angeles/Universal City</span>
                </div>
              </div>
            </div>
            {/* Social Media */}
            <div>
              <div className="bg-gradient-to-br from-[#1a0730]/80 to-neutral-900/90 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
                <h3 className="font-extrabold text-lg text-amber-400 mb-4 tracking-widest uppercase drop-shadow-glow">Follow Us</h3>
                <div className="flex gap-4 text-2xl mb-2">
                  <a
                    href="https://wa.me/19492479309"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition"
                    aria-label="Whatsapp"
                  >
                    <FaWhatsapp className="text-green-500 drop-shadow-glow" />
                  </a>
                  <a
                    href="https://www.facebook.com/vibeupevents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-blue-600 drop-shadow-glow" />
                  </a>
                  <a
                    href="https://www.instagram.com/vibeupevent/?__pwa=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-pink-500 drop-shadow-glow" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@vibesupevent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition"
                    aria-label="Tiktok"
                  >
                    <FaTiktok className="text-white drop-shadow-glow" />
                  </a>
                </div>
                <p className="text-xs text-amber-200 mt-2">
                  Stay updated with our latest news and behind-the-scenes content
                </p>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-amber-900/40 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-amber-100">
                © 2025 New Year's Gala 2026. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-amber-200">
                <a href="https://policies.google.com/privacy?hl=en-US" className="hover:text-amber-400 transition">Privacy Policy</a>
                <a href="https://policies.google.com/terms?hl=en-US" className="hover:text-amber-400 transition">Terms of Service</a>
                <a href="https://policies.google.com/privacy?hl=en-US" className="hover:text-amber-400 transition">Refund Policy</a>
              </div>
            </div>
          </div>
          {/* Event Organizer */}
          <div className="mt-6 pt-6 border-t border-amber-900/40 text-center text-xs text-amber-300">
            <p>
              Presented by{" "}
              <a
                href="https://www.instagram.com/fr3_fdn/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold"
              >
                <span className="text-purple-400">FR</span>
                <span className="text-amber-400">ع</span>
              </a>
              {" "} | California Nights Entertainment
            </p>
          </div>
        </div>
      </footer>

      
    </div>
  );
}



      {/* GLOW/SHADOW TAILWIND OVERRIDES */}
      <style jsx global>{`
        .drop-shadow-glow {
          text-shadow: 0 0 12px #ffd70099, 0 2px 8px #000a;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>