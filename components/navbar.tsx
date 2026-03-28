"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Glass nav background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 border-b border-amber-500/20"
        style={{
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
      />

      {/* Specular top line */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,191,0,0.30), transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="vibeup-logo.png"
              alt="VIBEUP Events Organizer"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: "/", label: "Home" },
              { href: "/events", label: "Upcoming Events" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-300 text-amber-400 hover:text-amber-500"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  fontWeight: 300,
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Amber pill CTA */}
            <Link
              href="/tickets"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-full font-light tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.28em",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
            >
              Tickets
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-amber-400 transition-colors duration-300"
          >
            {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden mt-4 space-y-3 pb-4 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(18,18,20,0.94) 0%, rgba(10,10,12,0.97) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
              padding: "16px",
            }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/events", label: "Upcoming Events" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-amber-400 hover:text-amber-500 transition-colors duration-300"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  fontWeight: 300,
                  textTransform: "uppercase",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Amber pill CTA for mobile */}
            <Link
              href="/tickets"
              className="block bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-full text-center font-light tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 mt-3"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.28em",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
              onClick={() => setIsOpen(false)}
            >
              Tickets
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}