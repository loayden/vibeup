"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50" style={{
      background: "linear-gradient(180deg, rgba(10,10,12,0.92), rgba(10,10,12,0.75))",
      backdropFilter: "blur(24px) saturate(160%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>

      {/* specular line */}
      <div
        className="absolute inset-x-10 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
      />

      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/vibeup-logo.png"
            alt="VIBEUP"
            width={224}
            height={56}
            className="h-14 w-auto transition duration-500 hover:scale-110"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">

          {[
            { name: "Home", href: "/" },
            { name: "Exclusive events", href: "/about" },
            { name: "Gallery", href: "/upcoming-events" },
            { name: "Contact Us", href: "/contact-us" },
            { name: "Services", href: "/services" }
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="relative text-white/40 hover:text-white transition duration-300"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 300
              }}
            >
              {item.name}

              {/* subtle underline hover */}
              <span
                className="absolute left-0 -bottom-2 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: "rgba(198,169,98,0.6)" }}
              />
            </Link>
          ))}

          {/* Gold CTA */}
          <Link
            href="https://vibesup.org/events/arab-nights?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
          >
            <button
              style={{
                background: "linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(198,169,98,0.35)",
                borderRadius: 9999,
                padding: "12px 28px",
                color: "#C6A962",
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 300,
                boxShadow: "0 0 28px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                transition: "all 0.35s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Tickets
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/60"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden mx-6 mb-6 p-6 rounded-2xl"
          style={{
            background: "linear-gradient(160deg, rgba(18,18,20,0.94), rgba(10,10,12,0.97))",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55)"
          }}
        >
          <div className="flex flex-col gap-5">
            {[
              { name: "Home", href: "/" },
              { name: "Exclusive events", href: "/about" },
              { name: "Gallery", href: "/upcoming-events" },
              { name: "Contact Us", href: "/contact-us" },
              { name: "Services", href: "/services" }
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition"
                style={{
                  fontFamily: "'Jost'",
                  fontSize: "11px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase"
                }}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="https://vibesup.org/events/arab-nights?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              onClick={() => setIsOpen(false)}
            >
              <button
                className="w-full mt-4"
                style={{
                  background: "linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
                  border: "1px solid rgba(198,169,98,0.35)",
                  borderRadius: 9999,
                  padding: "14px",
                  color: "#C6A962",
                  fontFamily: "'Jost'",
                  fontSize: "10px",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase"
                }}
              >
                Tickets
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
