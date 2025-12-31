"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 backdrop-blur-sm border-b border-neutral-800 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="vibeup-logo.png" alt="VIBEUP Events Organizer" className="h-16 w-auto hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
            >
              Home
            </Link>
            <Link
              href="/upcoming-events"
              className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
            >
              Memories
            </Link>
            <Link
              href="/about"
              className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
            >
              Upcoming event
            </Link>
            <Link
              href="/contact-us"
              className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
            >
              Contact
            </Link>
            <Link
              href="/checkout"
              className="bg-gradient-to-r from-amber-500 to-amber-600 font-extrabold tracking-wider text-black rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 px-6 py-2 transition"
            >
              Tickets
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-amber-400"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 bg-black/30 backdrop-blur-sm rounded-lg p-4">
            <Link
              href="/"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/upcoming-events"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Memories
            </Link>
            <Link
              href="/about"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Upcoming event
            </Link>
            <Link
              href="/contact-us"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/checkout"
              className="block bg-gradient-to-r from-amber-500 to-amber-600 font-extrabold tracking-wider text-black rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 px-6 py-2 transition text-center"
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
