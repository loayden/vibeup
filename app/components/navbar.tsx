"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="vibeup-logo.png" alt="VIBEUP Events Organizer" className="h-16 w-auto hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-neutral-300 hover:text-amber-400 transition font-semibold">
              Home
            </Link>
            <Link href="/about" className="text-neutral-300 hover:text-amber-400 transition font-semibold">
              Upcoming events
            </Link>
            <Link href="/checkout" className="text-neutral-300 hover:text-amber-400 transition font-semibold">
              About us
            </Link>
            <Link href="/checkout" className="text-neutral-300 hover:text-amber-400 transition font-semibold">
              Contact us
            </Link>
            <Link 
              href="/checkout" 
              className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-lg font-semibold transition"
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
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              href="/"
              className="block text-neutral-300 hover:text-amber-400 transition font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
             <Link
              href="/"
              className="block text-neutral-300 hover:text-amber-400 transition font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Upcoming events
            </Link>
            <Link
              href="/about"
              className="block text-neutral-300 hover:text-amber-400 transition font-semibold"
              onClick={() => setIsOpen(false)}
            >
              About us
            </Link>
            <Link
              href="/contact"
              className="block text-neutral-300 hover:text-amber-400 transition font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>
            <Link
              href="/checkout"
              className="block bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-lg font-semibold transition text-center"
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
