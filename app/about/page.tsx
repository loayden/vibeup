"use client"

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AboutPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.12;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #FFBF00; color: #080808; }
      `}</style>

      {/* Background Music */}
      <audio ref={audioRef} autoPlay loop preload="auto">
        <source src="/luxury-ambient.mp3" type="audio/mpeg" />
      </audio>

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
        <section className="relative pb-20 border-b border-amber-500/20">
          <div className="mx-auto max-w-7xl px-6">
            {/* Eyebrow */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.20)"
            }} className="uppercase mb-4">
              About The Event
            </p>

            {/* Hero Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em"
            }} className="mb-6">
              Layali Al <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Arab</em>
            </h1>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(255,191,0,0.6), transparent)"
            }} className="mb-10" />

            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden max-w-4xl" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)"
            }}>
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <Image
                src="/arabnights.jpeg"
                alt="Layali Al Arab Event"
                width={1600}
                height={900}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* INTRO SECTION */}
        <section className="py-20 border-b border-amber-500/20">
          <div className="mx-auto max-w-7xl px-6">
            <div style={{
              background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
              backdropFilter: "blur(20px) saturate(150%)",
              border: "1px solid rgba(255,191,0,0.20)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)",
              padding: "40px"
            }}>
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "1rem",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.70)",
                lineHeight: "1.8"
              }} className="text-center max-w-3xl mx-auto">
                An exceptional night in the heart of Los Angeles, where authentic Arab music meets elegant Arab heritage — a complete experience that begins on the red carpet and continues with a night-long celebration until dawn.
              </p>
            </div>
          </div>
        </section>

        {/* DETAILS SECTIONS */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 space-y-12">

            {/* Featured Artist */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "20px",
              boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
              padding: "40px"
            }}>
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.06em",
                marginBottom: "16px"
              }}>
                Featured Artist
              </h2>
              <div style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
                marginBottom: "24px"
              }} />
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: "1.8",
                letterSpacing: "0.03em"
              }}>
                <strong style={{ color: "rgba(255,255,255,0.85)" }}>Abdel Karim Hamdan</strong><br />
                Arab Idol Star<br /><br />
                A live performance carrying the spirit of the Levant, with a voice that blends authenticity and modern emotion — a night to remember.
              </p>
            </div>

            {/* Red Carpet & Heritage */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "20px",
              boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
              padding: "40px"
            }}>
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.06em",
                marginBottom: "16px"
              }}>
                5:00 PM – 7:00 PM
              </h2>
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.50)",
                letterSpacing: "0.05em",
                marginBottom: "20px"
              }} className="uppercase">
                Red Carpet & Heritage Experience
              </p>
              <div style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
                marginBottom: "24px"
              }} />
              <ul style={{
                fontFamily: "'Jost'",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: "2",
                letterSpacing: "0.03em"
              }} className="space-y-2">
                <li>• Red Carpet Walk & Media Coverage</li>
                <li>• Arab Heritage Fashion Appearances</li>
                <li>• Best Arab Heritage Costume Award</li>
                <li>• Live Singer Performance with DJ</li>
              </ul>
            </div>

            {/* Main Party */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "20px",
              boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
              padding: "40px"
            }}>
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.06em",
                marginBottom: "16px"
              }}>
                7:00 PM – 12:00 AM
              </h2>
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.50)",
                letterSpacing: "0.05em",
                marginBottom: "20px"
              }} className="uppercase">
                Main Party
              </p>
              <div style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
                marginBottom: "24px"
              }} />
              <ul style={{
                fontFamily: "'Jost'",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: "2",
                letterSpacing: "0.03em"
              }} className="space-y-2">
                <li>• Live Performance by Abdel Karim Hamdan</li>
                <li>• DJ Set (Arabic & Fusion Beats)</li>
                <li>• Open Dance Floor & Celebration</li>
              </ul>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dress Code */}
              <div style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "20px",
                boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "40px"
              }}>
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
                  Dress Code
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
                  letterSpacing: "0.03em"
                }}>
                  Arab Heritage Inspired Attire<br />
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>
                    (Traditional • Modern Fusion • Elegant Cultural Looks)
                  </span>
                </p>
              </div>

              {/* Special Highlight */}
              <div style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "20px",
                boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "40px"
              }}>
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
                  Special Highlight
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
                  letterSpacing: "0.03em"
                }}>
                  Best Arab Heritage Costume Award
                </p>
              </div>

              {/* Date & Time */}
              <div style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "20px",
                boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "40px"
              }}>
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
                  Date & Time
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
                  letterSpacing: "0.03em"
                }}>
                  March 28, 2026<br />
                  7:00 PM – 12:00 AM
                </p>
              </div>

              {/* Location */}
              <div style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "20px",
                boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "40px"
              }}>
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
                  Location
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
                  letterSpacing: "0.03em",
                  lineHeight: "1.7"
                }}>
                  Encino Banquet & Garden<br />
                  5955 Lindley Ave<br />
                  Tarzana, CA 91356
                </p>
              </div>
            </div>

            {/* Refund Policy */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "20px",
              boxShadow: "0 20px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)",
              padding: "40px"
            }}>
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
                Refund Policy
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
                lineHeight: "1.8",
                letterSpacing: "0.03em"
              }}>
                Tickets are non-refundable.<br />
                Prices are subject to change.<br /><br />
                For more information:<br />
                <strong style={{ color: "rgba(255,255,255,0.80)" }}>(949) 247-9309 · (917) 818-7850</strong>
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Sound Toggle */}
      <button
        onClick={() => {
          if (!audioRef.current) return;
          const isPlaying = !audioRef.current.paused;
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
          setIsMuted(isPlaying);
        }}
        className="fixed bottom-8 right-8 z-[9999] transition-all duration-300"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,191,0,0.35)",
          boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFBF00"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,191,0,0.50)"
          e.currentTarget.style.boxShadow = "0 0 32px rgba(255,191,0,0.20), inset 0 1px 0 rgba(255,255,255,0.14)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
          e.currentTarget.style.boxShadow = "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)"
        }}
        aria-label="Toggle sound"
      >
        {isMuted ? <VolumeX size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
