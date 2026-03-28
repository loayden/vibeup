// FULL LUXURY WEBSITE (MULTI-PAGE STRUCTURE)
// Built with React + Tailwind + Framer Motion

'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{ position:"absolute", width:700, height:700, top:"-15%", right:"-10%", background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)", filter:"blur(90px)" }} />
      <div style={{ position:"absolute", width:550, height:550, bottom:"5%", left:"-8%", background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)", filter:"blur(80px)" }} />
    </div>
  )
}

function SectionHeader({ eyebrow, title, highlight }: { eyebrow: string; title: string; highlight: string }) {
  return (
    <div className="text-center mb-14">
      <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">{eyebrow}</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(1.8rem,4vw,3rem)" }}>
        {title} <em style={{ color:"#C6A962" }}>{highlight}</em>
      </h2>
      <div className="mt-5 mx-auto w-10 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(198,169,98,0.55),transparent)" }} />
    </div>
  )
}

function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative p-6 rounded-[20px] border border-white/10"
      style={{
        background:"linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
        backdropFilter:"blur(24px)",
      }}>
      <div className="absolute inset-x-5 top-0 h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }} />
      {children}
    </div>
  )
}

// ================= HOME PAGE =================
export function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      <Orbs />

      <section className="relative z-10 px-6 py-32 text-center">
        <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Aurelien</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3rem,6vw,5rem)" }}>
          Curated <em style={{ color:"#C6A962" }}>Luxury</em>
        </h1>
        <p className="text-white/30 mt-6 max-w-xl mx-auto">
          A refined digital experience bridging boutique fashion with a global audience.
        </p>
      </section>

      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <SectionHeader eyebrow="Collections" title="Latest" highlight="Drops" />

        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <GlassCard key={i}>
              <div className="h-60 bg-white/5 rounded-xl mb-4" />
              <p className="text-white/50 text-xs">Boutique Item</p>
              <h3 className="mt-2">Product Name</h3>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  )
}

// ================= PRODUCT PAGE =================
export function ProductPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-24">
      <Orbs />

      <div className="relative z-10 grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div className="h-[500px] bg-white/5 rounded-2xl" />

        <div>
          <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Boutique</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300 }}>
            Silk <em style={{ color:"#C6A962" }}>Dress</em>
          </h1>
          <p className="text-white/30 mt-6">
            Crafted from premium silk, sourced from exclusive boutique collections.
          </p>

          <button className="mt-10 px-8 py-4 rounded-full border border-[#C6A962]/40 text-[#C6A962]">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  )
}

// ================= CART PAGE =================
export function CartPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-24">
      <Orbs />

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeader eyebrow="Cart" title="Your" highlight="Selection" />

        <GlassCard>
          <p className="text-white/40">Your cart is empty.</p>
        </GlassCard>
      </div>
    </main>
  )
}

// ================= CHECKOUT PAGE =================
export function CheckoutPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-24">
      <Orbs />

      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionHeader eyebrow="Checkout" title="Secure" highlight="Payment" />

        <GlassCard>
          <input placeholder="Full Name" className="glass-input w-full mb-4" />
          <input placeholder="Address" className="glass-input w-full mb-4" />
          <button className="w-full mt-6 py-4 rounded-full border border-[#C6A962]/40 text-[#C6A962]">
            Complete Order
          </button>
        </GlassCard>
      </div>
    </main>
  )
}

// ================= ACCOUNT PAGE =================
export function AccountPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-24">
      <Orbs />

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeader eyebrow="Account" title="Your" highlight="Profile" />

        <GlassCard>
          <p className="text-white/40">User details and orders appear here.</p>
        </GlassCard>
      </div>
    </main>
  )
}


export default HomePage