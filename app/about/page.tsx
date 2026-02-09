"use client"

import { useRef, useEffect } from "react";

export default function AboutPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.12;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-black via-black to-[#2d1b09]/80 py-16 text-amber-200">

      {/* Background Music */}
      <audio ref={audioRef} autoPlay loop preload="auto">
        <source src="/luxury-ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Sound Toggle */}
      <button
        onClick={() => {
          if (!audioRef.current) return;
          audioRef.current.paused
            ? audioRef.current.play()
            : audioRef.current.pause();
        }}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-black border border-amber-400 text-amber-400 flex items-center justify-center hover:shadow-[0_0_15px_rgba(255,191,0,0.8)] hover:scale-110 transition-transform duration-300"
        aria-label="Toggle sound"
      >
        🔊
      </button>

      {/* HERO */}
      <section className="bg-gradient-to-b from-amber-950/30 to-neutral-950 py-16 border-t border-amber-500/30 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,191,0,0.12),transparent_60%)] pointer-events-none"></div>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] mb-4">
            Layali Al Arab in Los Angeles
          </h1>
          <p className="text-amber-200 text-xl">
            A Celebration of Arab Music, Heritage & Elegance
          </p>
          <div className="mt-10 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-[0_0_40px_rgba(255,191,0,0.35)] max-w-3xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none"></div>
              <img
                src="/arabnights.jpeg"
                alt="Layali Al Arab Event"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-amber-500/30 relative">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
        <div className="mx-auto max-w-5xl grid gap-10">

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <p className="text-xl leading-relaxed text-center">
              An exceptional night in the heart of Los Angeles, where authentic Arab music meets elegant Arab heritage —
              a complete experience that begins on the red carpet and continues with a night-long celebration until dawn.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-solid fa-microphone-lines mr-2"></i>Featured Artist</h2>
            <p className="text-lg leading-relaxed">
              <strong>Abdel Karim Hamdan</strong><br />
              Arab Idol Star<br /><br />
              A live performance carrying the spirit of the Levant, with a voice that blends authenticity and modern emotion — a night to remember.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]">
              <i className="fa-regular fa-clock mr-2"></i>5:00 PM – 7:00 PM | Red Carpet & Heritage Experience
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Red Carpet Walk & Media Coverage</li>
              <li>Arab Heritage Fashion Appearances</li>
              <li>Best Arab Heritage Costume Award</li>
              <li>Live Singer Performance with DJ</li>
            </ul>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]">
              <i className="fa-solid fa-champagne-glasses mr-2"></i>7:00 PM – 12:00 AM | Main Party
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Live Performance by Abdel Karim Hamdan</li>
              <li>DJ Set (Arabic & Fusion Beats)</li>
              <li>Open Dance Floor & Celebration</li>
            </ul>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-solid fa-user-tie mr-2"></i>Dress Code</h2>
            <p>
              Arab Heritage Inspired Attire<br />
              (Traditional • Modern Fusion • Elegant Cultural Looks)
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-solid fa-trophy mr-2"></i>Special Highlight</h2>
            <p>Best Arab Heritage Costume Award</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-regular fa-calendar mr-2"></i>Date & Time</h2>
            <p>March 28, 2026 · 7:00 PM – 12:00 AM</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-solid fa-location-dot mr-2"></i>Location</h2>
            <p>
              Encino Banquet & Garden<br />
              5955 Lindley Ave, Tarzana, CA 91356<br />
              Los Angeles, California
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,191,0,0.12)] hover:shadow-[0_0_35px_rgba(255,191,0,0.25)] transition-shadow duration-500">
            <h2 className="text-3xl font-bold text-amber-400 mb-4 tracking-wide drop-shadow-[0_0_6px_rgba(255,191,0,0.6)]"><i className="fa-solid fa-circle-info mr-2"></i>Refund Policy</h2>
            <p>
              Tickets are non-refundable.<br />
              Prices are subject to change.<br /><br />
              For more information:<br />
              (949) 247-9309 · (917) 818-7850
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}