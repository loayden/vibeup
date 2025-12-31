"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 backdrop-blur-sm border-b border-amber-500/20 z-50 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center font-sans">
            <img src="vibeup-logo.png" alt="VIBEUP Events Organizer" className="h-16 w-auto hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans">
              Home
            </Link>
            <Link href="/about" className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans">
              Upcoming events
            </Link>
            <Link href="/checkout" className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans">
              About us
            </Link>
            <Link href="/checkout" className="font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans">
              Contact us
            </Link>
            <Link 
              href="/checkout" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-lg font-extrabold tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 transition-all duration-300 font-sans"
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
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-amber-500/20 p-4 rounded-lg bg-black/30 backdrop-blur-sm">
            <Link
              href="/"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
             <Link
              href="/"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans"
              onClick={() => setIsOpen(false)}
            >
              Upcoming events
            </Link>
            <Link
              href="/about"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans"
              onClick={() => setIsOpen(false)}
            >
              About us
            </Link>
            <Link
              href="/contact"
              className="block font-extrabold tracking-wider uppercase text-amber-400 drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] hover:text-amber-500 hover:drop-shadow-[0_0_16px_rgba(255,191,0,0.9)] transition-all duration-300 font-sans"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>
            <Link
              href="/checkout"
              className="block bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-lg font-extrabold tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 transition-all duration-300 text-center font-sans"
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
