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
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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

      {/* HERO */}
      <section 
        className="relative h-[95vh] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/gala-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
              New Year's Gala 2026
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 text-xl md:text-2xl text-amber-300 drop-shadow-md">
              Black & Gold Gala Dinner Party
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-2 text-lg text-amber-400 font-semibold drop-shadow-md">
              Featuring Abdelkarim Hamdan & Sherine Zaza
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/checkout" className="inline-block">
                <Button size="lg" className="rounded-2xl bg-amber-500 text-black hover:bg-amber-400 font-bold">Buy Tickets Now</Button>
              </Link>
              <Link href="/about" className="inline-block">
              <Button size="lg" variant="outline" className="rounded-2xl border-amber-400 text-amber-400 hover:bg-amber-400/10">Learn More</Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-8 flex items-center justify-center gap-4 text-sm">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-amber-100">{d}d {h}h {m}m {s}s until doors open</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-neutral-900/70">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-2">Event Details</h2>
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
          <Card className="bg-neutral-900/70">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
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

      {/* SCHEDULE */}
      <section className="bg-neutral-900/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl font-bold">Evening Schedule</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { id: "door-open", time: "8:30 PM", event: "🚪 Door Open" },
              { id: "dinner-concert", time: "10:00 PM", event: "🍽️ Dinner & Concert" },
              { id: "countdown", time: "11:45 PM", event: "⏰ Midnight Countdown" },
              { id: "event-ends", time: "2:00 AM", event: "🎉 Event Ends" }
            ].map((t) => (
              <Card key={t.id} className="bg-neutral-950"><CardContent className="p-4 text-center">
                <p className="text-lg font-semibold text-amber-400">{t.time}</p>
                <p className="text-sm mt-2">{t.event}</p>
              </CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-3xl font-bold text-center">Seating Chart & Pricing</h2>
        <p className="text-center text-neutral-400 mb-12">Choose your perfect seating location</p>
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-3 w-full max-w-md mb-4">
            <Input
              placeholder="Enter your email to reserve"
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
              className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-500/20"
            >
              <CardContent className="p-6">
                {t.badge && (
                  <Badge className="absolute right-4 top-4 bg-amber-500 text-black text-xs">
                    {t.badge}
                  </Badge>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{t.color}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t.name}</h3>
                    {t.id === "group" && (
                      <p className="text-xs text-neutral-400">4 or more people</p>
                    )}
                  </div>
                </div>
                <div className="border-t border-neutral-700 pt-4 mb-4">
                  <p className="text-3xl font-extrabold text-amber-400">
                    ${t.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Per person</p>
                </div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2 text-neutral-300">
                    <Check className="h-4 w-4 text-amber-400" /> Reserved Seating
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <Check className="h-4 w-4 text-amber-400" /> Full Event Access
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <Check className="h-4 w-4 text-amber-400" /> Dinner & Show
                  </li>
                </ul>
                <Button
                  onClick={() => startCheckout(t.id)}
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  disabled={!email || !email.includes("@")}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 bg-neutral-900/50 rounded-lg p-6 border border-amber-500/20">
          <h3 className="font-semibold text-amber-400 mb-3">💡 Pro Tips:</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li>
              • <strong>VIP Red</strong> - Best view of the stage with priority service
            </li>
            <li>
              • <strong>Blue &amp; Green</strong> - Great sightlines and premium experience
            </li>
            <li>
              • <strong>Yellow &amp; Purple</strong> - Excellent value with full access
            </li>
            <li>
              • <strong>Group Tickets</strong> - Save money when booking 4+ people together
            </li>
          </ul>
        </div>
      </section>

      {/* EMAIL */}
      <section className="bg-gradient-to-r from-amber-950/50 to-neutral-950 py-16 border-y border-amber-500/20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-2">Stay Updated</h2>
          <p className="text-neutral-400 mb-8">
            Get exclusive updates, reminders, and special offers for the gala
          </p>
          <div className="flex gap-3 flex-col sm:flex-row sm:items-center sm:justify-center">
            <Input
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 sm:max-w-sm"
            />
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold min-w-fit"
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
          <p className="text-xs text-neutral-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* PERFORMERS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold text-center">Featuring Exceptional Artists</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-neutral-900/70">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-3 text-amber-400">✨ Abdelkarim Hamdan</h3>
              <p className="text-neutral-300 mb-4">
                One of the most beloved voices in the Arab world. With his warm tone, heartfelt emotion, and remarkable presence, he rose to fame from the Arab Idol stage and captured the hearts of millions.
              </p>
              <p className="text-neutral-400 italic">
                "His voice carries the soul of Damascus, the beauty of Syria, and the timeless spirit of Arabic music. A performance you will feel… not just hear."
              </p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/70">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-3 text-amber-400">✨ Sherine Zaza</h3>
              <p className="text-neutral-300 mb-4">
                A celebrated vocalist known for her graceful presence and soulful voice. She will open tonight's gala with a powerful rendition of the National Anthem.
              </p>
              <p className="text-neutral-400">
                Accompanied by our orchestra ensemble to set the perfect tone for this unforgettable evening.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SOCIAL PROOF & CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-3xl font-bold text-center">Why Attend?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/20"><CardContent className="p-6 text-center">
            <p className="text-4xl mb-4">✨</p>
            <p className="font-semibold text-lg mb-2">World-Class Entertainment</p>
            <p className="text-sm text-neutral-400">Featuring renowned Arab artists and live orchestra</p>
          </CardContent></Card>
          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/20"><CardContent className="p-6 text-center">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="font-semibold text-lg mb-2">Five-Star Dining</p>
            <p className="text-sm text-neutral-400">Exquisite gourmet menu curated by Hilton chefs</p>
          </CardContent></Card>
          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/20"><CardContent className="p-6 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <p className="font-semibold text-lg mb-2">Unforgettable Celebration</p>
            <p className="text-sm text-neutral-400">Prime New Year countdown with luxury atmosphere</p>
          </CardContent></Card>
        </div>
      </section>
{/* ABOUT & INFO */}
      <section className="mx-auto max-w-6xl px-6 py-20 space-y-10">
        <h2 className="text-3xl font-bold">About This Gala</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">🎉 A Night of Elegance & Arabic Spirit</h3>
            <p className="text-neutral-300">
              A night of elegance, luxury, and unforgettable celebration as we welcome 2026 in a breathtaking Black & Gold New Year Gala Dinner — an extraordinary evening designed to bring together the Arab community in California for a celebration unlike any other.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">✨ The Venue</h3>
            <p className="text-neutral-300">
              Hosted inside a Sierra ballroom, transformed with lavish black-and-gold décor, a magnificent catwalk stage, stunning LED screens, and immersive lighting, this gala promises a world-class experience from the moment you enter. With its massive hall and glamorous design, it brings together the Arab community for an unforgettable night of unity, joy, and new beginnings.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">🍽️ Luxury Gala Dinner by Hilton</h3>
            <p className="text-neutral-300">
              Guests will enjoy an exquisite five-star dinner, exclusively curated by Hilton chefs — a premium dining experience featuring gourmet selections, elegant presentation, and impeccable service perfectly matching the event's black-and-gold luxury atmosphere.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">🎤 World-Class Entertainment</h3>
            <p className="text-neutral-300">
              Featuring two exceptional stars, live music, professional orchestra, dancing, and a vibrant atmosphere designed to celebrate the new year with pride and joy. The evening combines cultural artistry with modern entertainment.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">📋 How to Reserve Your Position</h3>
            <ol className="space-y-2 text-neutral-300 list-decimal list-inside">
              <li>Choose your ticket(s) and complete the checkout</li>
              <li>Open the confirmation email you receive after purchase</li>
              <li>Click the reservation link to select your preferred position (if available)</li>
            </ol>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">🎯 Event Organizer</h3>
            <p className="text-neutral-300 mb-2">
              Presented by <strong>California Nights Entertainment</strong>
            </p>
            <p className="text-sm text-neutral-400">
              Contact: vibesup.event@gmail.com | +1 (949) 247-9309 | +1 (917) 818-7850
            </p>
          </div>
        </div>
      </section>

      {/* Tabs: rendered client-side only to safely set initial tab without hydration issues */}
      {mounted && (
        <Tabs>
          <TabsList>
            <TabsTrigger value="details"></TabsTrigger>
            <TabsTrigger value="pricing"></TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <section className="mx-auto max-w-6xl px-6 py-20 space-y-10">
              <h2 className="text-3xl font-bold">The Ultimate New Year’s Eve Gala Experience</h2>
              <p>Welcome to the New Year’s Eve Gala, a meticulously curated black‑tie celebration designed for guests who expect nothing less than excellence. This is not simply an event; it is a complete luxury experience that blends refined aesthetics, world‑class entertainment, gourmet dining, and seamless hospitality into one unforgettable night. From the moment you arrive, every detail has been considered to ensure comfort, elegance, excitement, and exclusivity.</p>
              <p>The evening begins with a grand welcome reception where ambient lighting, sophisticated décor, and carefully selected music establish an atmosphere of celebration and refinement. Professional hosts guide guests through a visually striking venue that balances modern luxury with timeless glamour, ensuring a seamless and memorable arrival.</p>
              <p>Throughout the night, guests enjoy a carefully paced program that encourages both social connection and personal enjoyment. A gourmet gala dinner, prepared by experienced chefs, features premium ingredients and elegant presentation. Each course is designed to complement the evening’s rhythm, allowing guests to dine comfortably before transitioning to live entertainment and dancing.</p>
              <p>Music is central to the gala experience. A professional DJ curates soundscapes that evolve from refined lounge tones to energetic dance tracks as midnight approaches. Advanced lighting, stage design, and acoustics ensure an immersive experience while preserving comfort and conversation.</p>
              <p>As midnight approaches, anticipation builds. The countdown sequence combines synchronized lighting, sound, and visual effects to create a collective moment of excitement. When the New Year arrives, guests celebrate together in a setting designed to feel both grand and personal.</p>
              <h3 className="text-2xl font-semibold">VIP Experience</h3>
              <p>VIP ticket holders enjoy reserved seating, exclusive lounge access, priority service, and premium bottle options. The VIP lounge provides a refined environment for networking, celebration, and relaxation, supported by dedicated staff throughout the night.</p>
              <p>VIP access is intentionally limited to preserve comfort and exclusivity, ensuring a superior experience for those who choose this elevated level of access.</p>
              <h3 className="text-2xl font-semibold">Professional Organization</h3>
              <p>The gala is managed by a seasoned production team with extensive experience in high‑end events. From ticket purchase to event check‑in, every interaction is designed to be secure, intuitive, and efficient. Digital ticketing with QR codes allows for fast, contactless entry.</p>
              <p>Automated email confirmations and reminders ensure guests remain informed and confident leading up to the event. On‑site staff are trained to assist guests promptly and professionally.</p>
              <h3 className="text-2xl font-semibold">Technology & Security</h3>
              <p>Payments are securely processed via Stripe, supporting credit cards, Apple Pay, and Google Pay. All transactions are encrypted and handled according to industry best practices, ensuring privacy and security.</p>
              <p>User accounts allow guests to manage tickets, review purchase history, and access QR codes at any time. The platform is optimized for speed, reliability, and mobile performance.</p>
              <h3 className="text-2xl font-semibold">Dress Code & Atmosphere</h3>
              <p>The black‑tie dress code elevates the visual harmony of the event and enhances the sense of occasion. Guests are encouraged to express elegance and confidence through formal attire, contributing to a cohesive and refined atmosphere.</p>
              <p>The gala fosters a respectful and welcoming environment where guests can connect, celebrate, and create lasting memories.</p>
              <h3 className="text-2xl font-semibold">Transparency & Trust</h3>
              <p>Clear refund and cancellation policies are communicated in advance. In the event of significant changes, guests are promptly informed and supported with fair solutions.</p>
              <p>Our commitment to transparency, professionalism, and guest satisfaction defines every aspect of the New Year’s Eve Gala experience.</p>
              <h3 className="text-2xl font-semibold">A Celebration Worth Remembering</h3>
              <p>This gala stands apart through its attention to detail, quality, and atmosphere. It is a celebration designed not only to entertain, but to inspire as guests welcome the New Year with intention, elegance, and optimism.</p>
            </section>
          </TabsContent>

          <TabsContent value="pricing">
            {/* pricing content here */}
            <section className="mx-auto max-w-6xl px-6 py-20">
              <h2 className="text-3xl font-bold mb-4">Pricing Information</h2>
              <p>See the "Seating Chart & Pricing" section above for details on ticket tiers and pricing. Group discounts and VIP options available. For further questions, please contact us.</p>
            </section>
          </TabsContent>
        </Tabs>
      )}
      
      {/* FOOTER */}
      <footer className="border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4">About Gala</h3>
              <p className="text-sm text-neutral-400">Experience the most luxurious New Year celebration with world-class entertainment and exquisite dining.</p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/" className="hover:text-amber-400 transition">Home</Link></li>
                <li><Link href="/checkout" className="hover:text-amber-400 transition">Tickets</Link></li>
                <li><a href="/upcoming-events" className="hover:text-amber-400 transition">memories</a></li>
                <li><a href="/contact-us" className="hover:text-amber-400 transition">Contact</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:vibesup.event@gmail.com" className="hover:text-amber-400 transition">vibesup.event@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <a href="tel:+19492479309" className="hover:text-amber-400 transition">+1 (949) 247-9309</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <a href="tel:+19178187850" className="hover:text-amber-400 transition">+1 (917) 818-7850</a>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4">Follow Us</h3>
              <div className="flex gap-4 text-2xl">
                <a href="https://wa.me/19492479309" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="text-green-500 hover:scale-110 transition" />
                </a>
                <a href="https://www.facebook.com/vibeupevents" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-blue-600 hover:scale-110 transition" />
                </a>
                <a href="https://www.instagram.com/vibeupevent/?__pwa=1" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-pink-500 hover:scale-110 transition" />
                </a>
                <a href="https://www.tiktok.com/@vibesupevent" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="text-white hover:scale-110 transition" />
                </a>
              </div>
              <p className="text-xs text-neutral-500 mt-4">Stay updated with our latest news and behind-the-scenes content</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-neutral-500">© 2025 New Year's Gala 2026. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-neutral-500">
                <a href="https://policies.google.com/privacy?hl=en-US" className="hover:text-amber-400 transition">Privacy Policy</a>
                <a href="https://policies.google.com/terms?hl=en-US" className="hover:text-amber-400 transition">Terms of Service</a>
                <a href="https://policies.google.com/privacy?hl=en-US" className="hover:text-amber-400 transition">Refund Policy</a>
              </div>
            </div>
          </div>
          
          {/* Event Organizer */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-600">
            <p>
              Presented by{" "}
              <a
                href="https://www.instagram.com/fr3_fdn/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
              >
                <span className="text-purple-500">FR</span>
                <span className="text-amber-400">ع</span>
              </a>
            </p>
          </div>
        </div>
      </footer>

      
    </div>
  );
}


