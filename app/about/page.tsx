"use client"

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.12;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 py-16 text-amber-200">
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
        className="
          fixed bottom-6 right-6 z-[9999]
          w-12 h-12 rounded-full
          bg-black
          border border-amber-400
          text-amber-400
          flex items-center justify-center
          hover:shadow-[0_0_15px_rgba(255,191,0,0.8)] hover:scale-110 transition-transform duration-300
        "
        aria-label="Toggle sound"
      >
        🔊
      </button>
      {/* HERO */}
      <section className="bg-gradient-to-b from-amber-950/30 to-neutral-950 py-16 border-t border-amber-500/30">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">About This Gala</h1>
          <p className="text-amber-200 leading-relaxed whitespace-pre-line text-xl">Experience elegance, luxury, and unforgettable celebration</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-amber-500/30">
        <div className="space-y-12">
          {/* A NIGHT OF ELEGANCE */}
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🎉 A Night of Elegance & Arabic Spirit</h2>
            <p className="leading-relaxed whitespace-pre-line text-amber-200">
              A night of elegance, luxury, and unforgettable celebration as we welcome 2026 in a breathtaking Black & Gold New Year Gala Dinner — an extraordinary evening designed to bring together the Arab community in California for a celebration unlike any other.
            </p>
          </div>

          {/* THE VENUE */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">✨ The Venue</h3>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                Hosted inside a Sierra ballroom, transformed with lavish black-and-gold décor, a magnificent catwalk stage, stunning LED screens, and immersive lighting, this gala promises a world-class experience from the moment you enter. With its massive hall and glamorous design, it brings together the Arab community for an unforgettable night of unity, joy, and new beginnings.
              </p>
            </CardContent>
          </Card>

          {/* LUXURY GALA DINNER */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🍽️ Luxury Gala Dinner by Hilton</h3>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                Guests will enjoy an exquisite five-star dinner, exclusively curated by Hilton chefs — a premium dining experience featuring gourmet selections, elegant presentation, and impeccable service perfectly matching the event's black-and-gold luxury atmosphere.
              </p>
            </CardContent>
          </Card>

          {/* WORLD-CLASS ENTERTAINMENT */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🎤 World-Class Entertainment</h3>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                Featuring two exceptional stars, live music, professional orchestra, dancing, and a vibrant atmosphere designed to celebrate the new year with pride and joy. The evening combines cultural artistry with modern entertainment.
              </p>
            </CardContent>
          </Card>

          {/* HOW TO RESERVE */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">📋 How to Reserve Your Position</h3>
              <ol className="space-y-3 text-amber-200">
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>Choose your ticket(s) and complete the checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>Open the confirmation email you receive after purchase</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>Click the reservation link to select your preferred position (if available)</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* ULTIMATE EXPERIENCE */}
          <div className="bg-gradient-to-r from-amber-950/20 to-neutral-900 rounded-lg p-8 border border-amber-500/30">
            <h3 className="text-3xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-6">The Ultimate New Year's Eve Gala Experience</h3>
            <div className="space-y-6 text-amber-200 leading-relaxed whitespace-pre-line">
              <p>
                Welcome to the New Year's Eve Gala, a meticulously curated black‑tie celebration designed for guests who expect nothing less than excellence. This is not simply an event; it is a complete luxury experience that blends refined aesthetics, world‑class entertainment, gourmet dining, and seamless hospitality into one unforgettable night. From the moment you arrive, every detail has been considered to ensure comfort, elegance, excitement, and exclusivity.
              </p>

              <p>
                The evening begins with a grand welcome reception where ambient lighting, sophisticated décor, and carefully selected music establish an atmosphere of celebration and refinement. Professional hosts guide guests through a visually striking venue that balances modern luxury with timeless glamour, ensuring a seamless and memorable arrival.
              </p>

              <p>
                Throughout the night, guests enjoy a carefully paced program that encourages both social connection and personal enjoyment. A gourmet gala dinner, prepared by experienced chefs, features premium ingredients and elegant presentation. Each course is designed to complement the evening's rhythm, allowing guests to dine comfortably before transitioning to live entertainment and dancing.
              </p>

              <p>
                Music is central to the gala experience. A professional DJ curates soundscapes that evolve from refined lounge tones to energetic dance tracks as midnight approaches. Advanced lighting, stage design, and acoustics ensure an immersive experience while preserving comfort and conversation.
              </p>

              <p>
                As midnight approaches, anticipation builds. The countdown sequence combines synchronized lighting, sound, and visual effects to create a collective moment of excitement. When the New Year arrives, guests celebrate together in a setting designed to feel both grand and personal.
              </p>
            </div>
          </div>

          {/* VIP EXPERIENCE */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">👑 VIP Experience</h3>
              <p className="mb-4 leading-relaxed whitespace-pre-line text-amber-200">
                VIP ticket holders enjoy reserved seating, exclusive lounge access, priority service, and premium bottle options. The VIP lounge provides a refined environment for networking, celebration, and relaxation, supported by dedicated staff throughout the night.
              </p>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                VIP access is intentionally limited to preserve comfort and exclusivity, ensuring a superior experience for those who choose this elevated level of access.
              </p>
            </CardContent>
          </Card>

          {/* PROFESSIONAL ORGANIZATION */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🎯 Professional Organization</h3>
              <p className="mb-4 leading-relaxed whitespace-pre-line text-amber-200">
                The gala is managed by a seasoned production team with extensive experience in high‑end events. From ticket purchase to event check‑in, every interaction is designed to be secure, intuitive, and efficient. Digital ticketing with QR codes allows for fast, contactless entry.
              </p>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                Automated email confirmations and reminders ensure guests remain informed and confident leading up to the event. On‑site staff are trained to assist guests promptly and professionally.
              </p>
            </CardContent>
          </Card>

          {/* TECHNOLOGY & SECURITY */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🔒 Technology & Security</h3>
              <p className="mb-4 leading-relaxed whitespace-pre-line text-amber-200">
                Payments are securely processed via Stripe, supporting credit cards, Apple Pay, and Google Pay. All transactions are encrypted and handled according to industry best practices, ensuring privacy and security.
              </p>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                User accounts allow guests to manage tickets, review purchase history, and access QR codes at any time. The platform is optimized for speed, reliability, and mobile performance.
              </p>
            </CardContent>
          </Card>

          {/* DRESS CODE */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">👔 Dress Code & Atmosphere</h3>
              <p className="mb-4 leading-relaxed whitespace-pre-line text-amber-200">
                The black‑tie dress code elevates the visual harmony of the event and enhances the sense of occasion. Guests are encouraged to express elegance and confidence through formal attire, contributing to a cohesive and refined atmosphere.
              </p>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                The gala fosters a respectful and welcoming environment where guests can connect, celebrate, and create lasting memories.
              </p>
            </CardContent>
          </Card>

          {/* TRANSPARENCY & TRUST */}
          <Card className="bg-gradient-to-br from-black/70 via-[#1a0730]/60 to-[#2d1b09]/70 border border-amber-500/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🤝 Transparency & Trust</h3>
              <p className="mb-4 leading-relaxed whitespace-pre-line text-amber-200">
                Clear refund and cancellation policies are communicated in advance. In the event of significant changes, guests are promptly informed and supported with fair solutions.
              </p>
              <p className="leading-relaxed whitespace-pre-line text-amber-200">
                Our commitment to transparency, professionalism, and guest satisfaction defines every aspect of the New Year's Eve Gala experience.
              </p>
            </CardContent>
          </Card>

          {/* EVENT ORGANIZER */}
          <Card className="bg-gradient-to-r from-amber-950/30 to-neutral-900 border border-amber-500/40 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">🎯 Event Organizer</h3>
              <p className="text-xl text-amber-200 mb-6">
                Presented by <strong>California Nights Entertainment</strong>
              </p>
              <div className="space-y-2 text-amber-200">
                <p>📧 <a href="mailto:vibesup.event@gmail.com" className="text-amber-400 hover:underline">vibesup.event@gmail.com</a></p>
                <p>📱 <a href="tel:+19492479309" className="text-amber-400 hover:underline">+1 (949) 247-9309</a></p>
                <p>📱 <a href="tel:+19178187850" className="text-amber-400 hover:underline">+1 (917) 818-7850</a></p>
              </div>
            </CardContent>
          </Card>

          {/* CLOSING MESSAGE */}
          <div className="text-center py-8 border-t border-amber-500/30">
            <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">✨ A Celebration Worth Remembering</h3>
            <p className="text-lg leading-relaxed whitespace-pre-line max-w-3xl mx-auto text-amber-200">
              This gala stands apart through its attention to detail, quality, and atmosphere. It is a celebration designed not only to entertain, but to inspire as guests welcome the New Year with intention, elegance, and optimism.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
