"use client"

import React from "react";
import { Mail, Phone, MessageCircle, Facebook, Instagram, Music } from "lucide-react";

export default function ContactUs() {
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

      <main className="relative z-10 pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Header Section */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            {/* Eyebrow */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.20)"
            }} className="uppercase mb-4">
              Get In Touch
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em"
            }} className="mb-6">
              Contact <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Us</em>
            </h1>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, rgba(255,191,0,0.6), transparent)"
            }} className="mb-10" />

            {/* Description */}
            <p style={{
              fontFamily: "'Jost'",
              fontSize: "1rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.8"
            }}>
              We&apos;d love to hear from you. For inquiries, ticket bookings, collaborations, or VIP experiences, our team is ready to assist you anytime.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            
            {/* Email Card */}
            <a
              href="mailto:vibesup.event@gmail.com"
              className="group transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                backdropFilter: "blur(20px) saturate(150%)",
                border: "1px solid rgba(255,191,0,0.20)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 48px rgba(255,191,0,0.15), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
            >
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <Mail size={40} strokeWidth={1.2} style={{ color: "#FFBF00", marginBottom: "16px" }} />
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.25rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.05em",
                marginBottom: "12px"
              }}>
                Email
              </h3>
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.03em",
                wordBreak: "break-all"
              }} className="hover:text-amber-300 transition-colors">
                vibesup.event@gmail.com
              </p>
            </a>

            {/* Phone 1 Card */}
            <a
              href="tel:+19492479309"
              className="group transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                backdropFilter: "blur(20px) saturate(150%)",
                border: "1px solid rgba(255,191,0,0.20)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 48px rgba(255,191,0,0.15), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
            >
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <Phone size={40} strokeWidth={1.2} style={{ color: "#FFBF00", marginBottom: "16px" }} />
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.25rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.05em",
                marginBottom: "12px"
              }}>
                Phone
              </h3>
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.03em"
              }} className="hover:text-amber-300 transition-colors">
                +1 (949) 247-9309
              </p>
            </a>

            {/* Phone 2 Card */}
            <a
              href="tel:+19178187850"
              className="group transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,191,0,0.10) 0%, rgba(255,191,0,0.03) 100%)",
                backdropFilter: "blur(20px) saturate(150%)",
                border: "1px solid rgba(255,191,0,0.20)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 48px rgba(255,191,0,0.15), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,191,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)"
              }}
            >
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <Phone size={40} strokeWidth={1.2} style={{ color: "#FFBF00", marginBottom: "16px" }} />
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.25rem",
                fontWeight: 300,
                color: "#FFBF00",
                letterSpacing: "0.05em",
                marginBottom: "12px"
              }}>
                Phone
              </h3>
              <p style={{
                fontFamily: "'Jost'",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.03em"
              }} className="hover:text-amber-300 transition-colors">
                +1 (917) 818-7850
              </p>
            </a>

          </div>

          {/* WhatsApp CTA */}
          <div className="max-w-2xl mx-auto mb-20">
            <a
              href="https://wa.me/19492479309"
              className="flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,191,0,0.22), rgba(255,191,0,0.08))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,191,0,0.35)",
                borderRadius: 9999,
                padding: "16px 32px",
                color: "#FFBF00",
                fontFamily: "'Jost', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.28em",
                fontWeight: 300,
                textTransform: "uppercase",
                boxShadow: "0 0 28px rgba(255,191,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                display: "inline-block",
                margin: "0 auto",
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
              <MessageCircle size={18} strokeWidth={1.5} />
              Message Us on WhatsApp
            </a>
          </div>

          {/* Social Links Section */}
          <div className="text-center">
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.8rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.70)",
              letterSpacing: "0.06em",
              marginBottom: "24px"
            }}>
              Follow <em style={{ color: "#FFBF00", fontStyle: "italic" }}>Us</em>
            </h2>

            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.4), transparent)",
              marginBottom: "24px",
              maxWidth: "200px",
              margin: "0 auto 24px"
            }} />

            <div className="flex justify-center gap-6">
              <a
                href="https://wa.me/19492479309"
                aria-label="WhatsApp"
                title="Message us on WhatsApp"
                className="transition-all duration-300"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))",
                  border: "1px solid rgba(255,191,0,0.20)",
                  color: "#FFBF00",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.25), rgba(255,191,0,0.10))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.20)"
                }}
              >
                <MessageCircle size={24} strokeWidth={1.3} />
              </a>

              <a
                href="https://www.facebook.com/vibeupevents"
                aria-label="Facebook"
                title="Follow us on Facebook"
                className="transition-all duration-300"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))",
                  border: "1px solid rgba(255,191,0,0.20)",
                  color: "#FFBF00",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.25), rgba(255,191,0,0.10))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.20)"
                }}
              >
                <Facebook size={24} strokeWidth={1.3} />
              </a>

              <a
                href="https://www.instagram.com/vibeupevent/?__pwa=1"
                aria-label="Instagram"
                title="Follow us on Instagram"
                className="transition-all duration-300"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))",
                  border: "1px solid rgba(255,191,0,0.20)",
                  color: "#FFBF00",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.25), rgba(255,191,0,0.10))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.20)"
                }}
              >
                <Instagram size={24} strokeWidth={1.3} />
              </a>

              <a
                href="https://www.tiktok.com/@vibesupevent"
                aria-label="TikTok"
                title="Follow us on TikTok"
                className="transition-all duration-300"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))",
                  border: "1px solid rgba(255,191,0,0.20)",
                  color: "#FFBF00",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.25), rgba(255,191,0,0.10))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,191,0,0.15), rgba(255,191,0,0.05))"
                  e.currentTarget.style.borderColor = "rgba(255,191,0,0.20)"
                }}
              >
                <Music size={24} strokeWidth={1.3} />
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
