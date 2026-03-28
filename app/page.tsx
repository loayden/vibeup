"use client"

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #FFBF00; color: #080808; }
      `}</style>

      {/* Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div style={{
          position: "absolute", width: 700, height: 700, top: "-15%", right: "-10%",
          background: "radial-gradient(circle, rgba(255,191,0,0.08) 0%, transparent 65%)",
          filter: "blur(90px)", animation: "orbA 26s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 550, height: 550, bottom: "5%", left: "-8%",
          background: "radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
          filter: "blur(80px)", animation: "orbB 32s ease-in-out infinite",
        }} />
        <style>{`
          @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
          @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
        `}</style>
      </div>

      <main className="relative z-10 pt-24">
        {/* HERO SECTION */}
        <section className="relative pb-32 pt-12 border-b border-amber-500/20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Eyebrow */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.20)"
            }} className="uppercase mb-4">
              Welcome to VIBEUP
            </p>

            {/* Hero Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em"
            }} className="mb-6 max-w-4xl">
              Extraordinary <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Events</em>
            </h1>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(255,191,0,0.6), transparent)"
            }} className="mb-10 max-w-md" />

            {/* Hero Description */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "1.1rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.9",
              maxWidth: "600px"
            }} className="mb-12">
              Experience unforgettable celebrations where Arab music, heritage, and elegance converge. From red carpet moments to dawn-filled dances, we craft memories that last a lifetime.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/upcoming-events"
                className="flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,191,0,0.35)",
                  borderRadius: 9999,
                  padding: "14px 32px",
                  color: "#FFBF00",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.28em",
                  fontWeight: 300,
                  textTransform: "uppercase",
                  boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  width: "fit-content"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
                  e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                  e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
                }}
              >
                Explore Events
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>

              <Link
                href="/https://vibesup.org/events/arab-nights?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnWQs1Mvd95ByZN4s8Yeqmf7FXwG_T2f7w-rlURYmCZweC6A10lUGQxCCTX_g_aem_G-3aaqjxga85jL1r59pnDQ"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3 rounded-full font-light tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 flex items-center justify-center gap-2"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.28em",
                  fontWeight: 300,
                  textTransform: "uppercase",
                }}
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED EVENT SECTION */}
        <section className="py-20 border-b border-amber-500/20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Header */}
            <div className="max-w-2xl mb-16">
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "9px",
                letterSpacing: "0.45em",
                color: "rgba(255,255,255,0.20)"
              }} className="uppercase mb-4">
                Featured Event
              </p>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                letterSpacing: "0.06em"
              }} className="mb-6">
                Layali Al <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Arab</em>
              </h2>

              <div style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)"
              }} className="mb-6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Feature Image */}
              <div className="relative rounded-3xl overflow-hidden" style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}>
                <div
                  className="absolute inset-x-5 top-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
                />
                <img
                  src="/arabnights.jpeg"
                  alt="Layali Al Arab"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="space-y-8">
                <div>
                  <p style={{
                    fontFamily: "'Jost'",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.50)",
                    letterSpacing: "0.05em"
                  }} className="uppercase mb-4">
                    March 28, 2026
                  </p>
                  <p style={{
                    fontFamily: "'Jost'",
                    fontSize: "1.05rem",
                    color: "rgba(255,255,255,0.70)",
                    lineHeight: "1.9",
                    letterSpacing: "0.03em"
                  }}>
                    An exceptional night where authentic Arab music meets elegant heritage. Experience red carpet elegance, live performances, and celebration until dawn.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div style={{
                    background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                    backdropFilter: "blur(20px) saturate(150%)",
                    border: "1px solid rgba(255,191,0,0.20)",
                    borderRadius: "16px",
                    padding: "20px",
                  }}>
                    <div
                      className="absolute inset-x-2 top-0 h-px pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
                    />
                    <Calendar size={20} style={{ color: "#FFBF00", marginBottom: "8px" }} />
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.50)",
                      letterSpacing: "0.03em"
                    }} className="mb-2">DATE</p>
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "0.02em"
                    }}>March 28</p>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                    backdropFilter: "blur(20px) saturate(150%)",
                    border: "1px solid rgba(255,191,0,0.20)",
                    borderRadius: "16px",
                    padding: "20px",
                  }}>
                    <div
                      className="absolute inset-x-2 top-0 h-px pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
                    />
                    <MapPin size={20} style={{ color: "#FFBF00", marginBottom: "8px" }} />
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.50)",
                      letterSpacing: "0.03em"
                    }} className="mb-2">LOCATION</p>
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "0.02em"
                    }}>Tarzana, CA</p>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                    backdropFilter: "blur(20px) saturate(150%)",
                    border: "1px solid rgba(255,191,0,0.20)",
                    borderRadius: "16px",
                    padding: "20px",
                    gridColumn: "1 / -1"
                  }}>
                    <div
                      className="absolute inset-x-2 top-0 h-px pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
                    />
                    <Users size={20} style={{ color: "#FFBF00", marginBottom: "8px" }} />
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.50)",
                      letterSpacing: "0.03em"
                    }} className="mb-2">FEATURED ARTIST</p>
                    <p style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "0.02em"
                    }}>Abdel Karim Hamdan - Arab Idol Star</p>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,191,0,0.35)",
                    borderRadius: 9999,
                    padding: "12px 28px",
                    color: "#FFBF00",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    fontWeight: 300,
                    textTransform: "uppercase",
                    boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                    cursor: "pointer",
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
                    e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                    e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
                  }}
                >
                  Learn More
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY VIBEUP SECTION */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Header */}
            <div className="max-w-2xl mb-16">
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "9px",
                letterSpacing: "0.45em",
                color: "rgba(255,255,255,0.20)"
              }} className="uppercase mb-4">
                Why Choose Us
              </p>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                letterSpacing: "0.06em"
              }} className="mb-6">
                Unforgettable <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Experiences</em>
              </h2>

              <div style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)"
              }} className="mb-6" />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Curated Events",
                  description: "Hand-picked celebrations featuring world-class artists and authentic cultural experiences."
                },
                {
                  title: "Premium Experience",
                  description: "From red carpet moments to exclusive VIP access, every detail is meticulously crafted."
                },
                {
                  title: "Cultural Heritage",
                  description: "Celebrate Arab music and traditions with elegance and authenticity at every turn."
                },
                {
                  title: "Seamless Ticketing",
                  description: "Easy booking, flexible options, and dedicated support for all your event needs."
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "20px",
                    boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
                    padding: "40px"
                  }}
                >
                  <div
                    className="absolute inset-x-5 top-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
                  />
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    color: "#FFBF00",
                    letterSpacing: "0.06em",
                    marginBottom: "12px"
                  }}>
                    {feature.title}
                  </h3>
                  <div style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
                    marginBottom: "16px"
                  }} />
                  <p style={{
                    fontFamily: "'Jost'",
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: "1.7",
                    letterSpacing: "0.03em"
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 border-t border-amber-500/20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 300,
              letterSpacing: "0.06em",
              marginBottom: "24px"
            }}>
              Ready to Experience <em style={{ color: "#FFBF00", fontStyle: "italic" }}>VIBEUP?</em>
            </h2>

            <p style={{
              fontFamily: "'Jost'",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.05em",
              maxWidth: "500px",
              margin: "0 auto 32px"
            }}>
              Join us for an unforgettable celebration of music, heritage, and elegance.
            </p>

            <Link
              href="/https://vibesup.org/events/arab-nights?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnWQs1Mvd95ByZN4s8Yeqmf7FXwG_T2f7w-rlURYmCZweC6A10lUGQxCCTX_g_aem_G-3aaqjxga85jL1r59pnDQ"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3 rounded-full font-light tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 inline-block"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.28em",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
            >
              Get Your Tickets Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}