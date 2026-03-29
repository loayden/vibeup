"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

const TICKETS = [
  { id: "vip-red", name: "VIP Red", price: 250 },
  { id: "blue", name: "Blue", price: 200 },
  { id: "green", name: "Green", price: 175 },
  { id: "yellow", name: "Yellow", price: 150 },
  { id: "purple", name: "Purple", price: 120 },
]

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:700, height:700, top:"-15%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(90px)", animation:"orbA 26s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:550, height:550, bottom:"5%", left:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"orbB 32s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
        @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
      `}</style>
    </div>
  )
}

export default function CheckoutPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const quantity = 1
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ticket = selectedTicket ? TICKETS.find(t => t.id === selectedTicket) : null
  const total = ticket ? ticket.price * quantity : 0

  const handleCheckout = async () => {
    if (!name || !email || !selectedTicket) {
      setStatus("Please complete all fields")
      return
    }

    setLoading(true)

    try {
      await supabase.from("reservations").upsert([
        {
          email,
          full_name: name,
          ticket_id: selectedTicket,
          quantity
        }
      ])

      setStatus("Reservation confirmed")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300&display=swap');
        body { background:#080808 }
      `}</style>

      <main className="relative min-h-screen bg-[#080808] text-white" style={{fontFamily:"'Jost',sans-serif"}}>
        <Orbs />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

          {/* HEADER */}
          <div className="mb-16 text-center">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">
              Checkout
            </p>

            <h1 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(2.5rem,6vw,4.5rem)",
              fontWeight:300,
              letterSpacing:"0.04em"
            }}>
              Book Your <em style={{color:"#C6A962"}}>Seat</em>
            </h1>

            <div className="mt-6 mx-auto w-16 h-px"
              style={{background:"linear-gradient(90deg,transparent,rgba(198,169,98,0.5),transparent)"}} />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* TICKETS */}
            <div className="space-y-6">
              {TICKETS.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t.id)}
                  className="relative p-6 rounded-2xl cursor-pointer transition"
                  style={{
                    background:"linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
                    backdropFilter:"blur(24px)",
                    border:selectedTicket === t.id
                      ? "1px solid rgba(198,169,98,0.4)"
                      : "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <div className="absolute inset-x-5 top-0 h-px"
                    style={{background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)"}} />

                  <h3 style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:"1.5rem",
                    fontWeight:300
                  }}>
                    {t.name}
                  </h3>

                  <p className="text-white/30 text-sm mt-2">
                    ${t.price}
                  </p>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="relative p-8 rounded-2xl"
              style={{
                background:"linear-gradient(135deg, rgba(198,169,98,0.16), rgba(198,169,98,0.05))",
                backdropFilter:"blur(20px)",
                border:"1px solid rgba(198,169,98,0.25)"
              }}
            >
              <div className="absolute inset-x-5 top-0 h-px"
                style={{background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)"}} />

              <h2 style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"2rem",
                fontWeight:300
              }}>
                Order <em style={{color:"#C6A962"}}>Summary</em>
              </h2>

              {ticket && (
                <>
                  <p className="mt-6 text-white/40 text-sm">
                    {ticket.name} × {quantity}
                  </p>

                  <p className="text-3xl mt-4" style={{color:"#C6A962"}}>
                    ${total}
                  </p>

                  <div className="mt-8 space-y-4">
                    <input
                      placeholder="Full Name"
                      value={name}
                      onChange={e=>setName(e.target.value)}
                      className="w-full glass-input"
                    />
                    <input
                      placeholder="Email"
                      value={email}
                      onChange={e=>setEmail(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>

                  {status && (
                    <p className="text-white/30 text-xs mt-4">
                      {status}
                    </p>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="mt-8 w-full"
                    style={{
                      background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(198,169,98,0.08))",
                      backdropFilter:"blur(16px)",
                      border:"1px solid rgba(198,169,98,0.35)",
                      borderRadius:9999,
                      padding:"14px 32px",
                      color:"#C6A962",
                      fontSize:"10px",
                      letterSpacing:"0.32em",
                      textTransform:"uppercase"
                    }}
                  >
                    {loading ? "Processing" : "Confirm"}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
