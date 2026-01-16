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
    <div className="min-h-screen bg-black text-neutral-100 font-sans">
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
          <h1 className="relative z-10 max-w-4xl mx-auto text-center py-20">
            {/* Subheadline */}
            <span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-lg md:text-xl font-serif tracking-widest uppercase mb-4 opacity-0 animate-fadeIn delay-100"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              VibeUp Events &amp; Services
            </span>

            {/* Main Headline */}
            <span
              className="block text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-snug md:leading-tight mb-4 opacity-0 animate-fadeIn delay-200"
              style={{
                textShadow: '0 0 12px rgba(255,215,64,0.3), 0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              Creating Unforgettable Experiences
            </span>

            {/* Tagline */}
            <span
              className="block text-amber-200/90 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed opacity-0 animate-fadeIn delay-300"
              style={{ letterSpacing: '0.04em' }}
            >
              Premium end-to-end event experiences, delivered flawlessly.
            </span>
          </h1>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .animate-fadeIn {
              animation: fadeIn 1s ease forwards;
            }

            .delay-100 { animation-delay: 0.1s; }
            .delay-200 { animation-delay: 0.3s; }
            .delay-300 { animation-delay: 0.5s; }
          `}</style>
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

      {/* View All Services Button */}
      <div className="flex justify-center mt-12">
        <Link
          href="/services"
          className="px-10 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-black font-black text-lg rounded-xl shadow-2xl shadow-amber-400/30 hover:from-yellow-400 hover:to-amber-500 hover:shadow-amber-400/60 hover:scale-105 border-2 border-amber-300/60 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest drop-shadow-glow"
          style={{ letterSpacing: '0.13em', textShadow: '0 0 12px #fffbe6a0' }}
        >
          View All Services
        </Link>
      </div>

<div className="border-t border-amber-500/30 my-12"></div>
      {/* VIBEUP SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-3xl font-bold text-center uppercase tracking-widest text-amber-400 drop-shadow-glow">
          VibeUp Services
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Event Planning & Management",
              items: [
                "Full-service event planning and execution",
                "Corporate events, private parties, concerts, cultural and social events",
                "Timeline creation and on-site event coordination",
                "Vendor and supplier management (sound, lighting, staging, décor)",
              ],
            },
            {
              title: "Artist & Talent Management",
              items: [
                "Booking and coordination of artists, DJs, performers, and hosts",
                "Contract management and scheduling",
                "Artist hospitality and performance coordination",
              ],
            },
            {
              title: "Event Marketing & Promotion",
              items: [
                "Digital marketing campaigns for events",
                "Social media management (Instagram, Facebook, TikTok, LinkedIn)",
                "Audience targeting and engagement strategies",
                "Influencer and media collaborations",
              ],
            },
            {
              title: "Ticketing & Guest Management",
              items: [
                "Ticket sales setup and management",
                "Digital invitations and RSVP systems",
                "Guest list management and check-in solutions",
                "Promotional codes and VIP access coordination",
              ],
            },
            {
              title: "Branding & Creative Services",
              items: [
                "Brand identity development",
                "Logo design and visual branding",
                "Event flyers, posters, banners, and invitations",
                "Creative concepts and themed event design",
              ],
            },
            {
              title: "Media Production",
              items: [
                "Professional photography and videography",
                "Event highlight videos and promotional content",
                "Video editing and post-production",
                "Social media-ready visual content",
              ],
            },
            {
              title: "Technical & Production Services",
              items: [
                "Sound, lighting, and stage production",
                "LED screens and visual displays",
                "Live streaming and broadcast solutions",
                "Technical setup and on-site supervision",
              ],
            },
            {
              title: "Logistics & Operations",
              items: [
                "Equipment coordination and transportation",
                "Venue setup and breakdown",
                "Staff coordination (ushers, security, technicians)",
                "On-site operations management",
              ],
            },
            {
              title: "Sponsorship & Partnerships",
              items: [
                "Sponsor acquisition and management",
                "Brand placement and activation strategies",
                "Partnership coordination before and during events",
              ],
            },
            {
              title: "Consulting & Event Strategy",
              items: [
                "Event concept development",
                "Budget planning and cost optimization",
                "Market research and competitor analysis",
                "Post-event reports and performance analysis",
              ],
            },
          ].map((service) => (
            <Card
              key={service.title}
              className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-extrabold mb-4 text-amber-400 uppercase tracking-wider drop-shadow-glow">
                  {service.title}
                </h3>
                <ul className="space-y-2 text-amber-100 font-medium">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 text-amber-400 drop-shadow-glow" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 p-8 rounded-xl shadow-2xl border border-amber-500/30">
          <h3 className="text-2xl font-extrabold text-amber-400 uppercase tracking-widest mb-4 drop-shadow-glow text-center">
            Optional Add-On Services
          </h3>
          <ul className="grid gap-3 md:grid-cols-2 text-amber-100 font-medium">
            {[
              "VIP and hospitality services",
              "Catering and food vendor coordination",
              "Custom décor and luxury event styling",
              "Corporate and brand activations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 text-amber-400 drop-shadow-glow" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* DETAILS */}
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
      className="relative bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 border border-amber-500/30 rounded-xl shadow-2xl shadow-black/40 hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
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
{/* Divider */}
<div className="border-t border-amber-500/30 my-12"></div>
      {/* SOCIAL PROOF & CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-3xl font-bold text-center uppercase tracking-widest text-amber-400 drop-shadow-glow">Why Attend?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Star className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">World-Class Entertainment</p>
              <p className="text-sm text-amber-200">Featuring renowned Arab artists and live orchestra</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Coffee className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">Five-Star Dining</p>
              <p className="text-sm text-amber-200">Exquisite gourmet menu curated by Hilton chefs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 border border-amber-500/20 rounded-xl shadow-xl shadow-black/40 hover:scale-105 hover:shadow-amber-400/30 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Users className="text-amber-400 text-4xl mb-4 mx-auto drop-shadow-glow" />
              <p className="font-extrabold text-lg mb-2 uppercase tracking-widest text-amber-100">Unforgettable Celebration</p>
              <p className="text-sm text-amber-200">Prime New Year countdown with luxury atmosphere</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-900/40 bg-black backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* Quick Links */}
            <div>
              <div className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
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
              <div className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
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
              <div className="bg-gradient-to-br from-yellow-400/40 via-yellow-600/20 to-black/80 rounded-xl shadow-2xl border border-amber-500/20 p-6 h-full flex flex-col">
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