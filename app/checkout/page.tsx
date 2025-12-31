"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreditCard, MapPin, Clock, Users, DollarSign, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from '@/lib/supabase'

const TICKETS = [
  { id: "vip-red", name: "VIP Red", price: 250, color: "🔴", badge: "Premium", description: "Best view of the stage with priority service" },
  { id: "blue", name: "Blue", price: 200, color: "🔵", badge: "Popular", description: "Great sightlines and premium experience" },
  { id: "green", name: "Green", price: 175, color: "🟢", description: "Excellent value with full access" },
  { id: "yellow", name: "Yellow", price: 150, color: "🟡", description: "Affordable premium seating" },
  { id: "purple", name: "Purple", price: 120, color: "🟣", description: "Budget-friendly option" },
  { id: "group", name: "Group (4+ People)", price: 145, color: "🟢", badge: "Best Value", description: "Save when booking 4+ tickets together" },
]

export default function CheckoutPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ticket = selectedTicket ? TICKETS.find(t => t.id === selectedTicket) : null
  const total = ticket ? ticket.price * quantity : 0

  const handleCheckout = async () => {
    if (!name || !email || !selectedTicket) {
      setStatus("⚠️ Please fill all fields and select a ticket");
      return;
    }

    setLoading(true);
    setStatus("moment …");

    try {
      // Option 1: Insert new reservation
      // await supabase.from('reservations').insert([{ email, ticket_id: selectedTicketId, full_name: userFullName, quantity: selectedQuantity }]);

      // Option 2: Upsert reservation (update if exists)
      await supabase
        .from('reservations')
        .upsert(
          [
            {
              email,
              full_name: name,
              ticket_id: selectedTicket,
              quantity
            }
          ],
          { onConflict: 'email,ticket_id' } // ensure table has UNIQUE(email, ticket_id)
        );
      
      setStatus(`Reservation successful! check your email`);
    } catch (err: any) {
      setStatus(`Error processing reservation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/80 via-[#1a0730]/70 to-[#2d1b09]/80 py-16 text-amber-200">
      {/* HEADER */}
      <header className="border-b border-amber-700 bg-black/80 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition">
            <ArrowLeft className="h-5 w-5 text-amber-400" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-extrabold uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] text-amber-400">Book Your Tickets</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* TICKET SELECTION */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] text-amber-400 mb-6">Select Your Seating</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {TICKETS.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`relative cursor-pointer transition-all duration-300 border rounded-lg hover:scale-105 ${
                    selectedTicket === ticket.id
                      ? "border-amber-500 border-2 bg-gradient-to-br from-amber-950/50 to-neutral-900"
                      : "border-amber-500/50 hover:border-amber-500"
                  }`}
                >
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardContent className="p-6">
                      {ticket.badge && <Badge className="absolute right-4 top-4 bg-amber-500 text-black text-xs">{ticket.badge}</Badge>}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{ticket.color}</span>
                        <div>
                          <h3 className="font-extrabold uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] text-amber-400 text-lg">{ticket.name}</h3>
                        </div>
                      </div>
                      <p className="text-amber-200 leading-relaxed whitespace-pre-line mb-4">{ticket.description}</p>
                      <p className="text-2xl font-extrabold text-amber-400">${ticket.price.toFixed(2)}</p>
                      {selectedTicket === ticket.id && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-amber-400 text-sm">
                          <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                          Selected
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <Card className="bg-gradient-to-b from-black/80 via-black/70 to-amber-900/70 border border-amber-500/70 shadow-none sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-extrabold uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,191,0,0.8)] text-amber-400 mb-6">Order Summary</h3>

                {ticket ? (
                  <>
                    {/* TICKET INFO */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-amber-700">
                      <div className="flex justify-between">
                        <span className="text-amber-200">Ticket Type</span>
                        <span className="font-semibold flex items-center gap-2 text-amber-400">{ticket.color} {ticket.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-200">Price per ticket</span>
                        <span className="font-semibold text-amber-400">${ticket.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-200">Quantity</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 bg-black/70 hover:bg-black/50 rounded text-amber-400 font-bold transition hover:scale-105">-</button>
                          <span className="w-8 text-center font-semibold text-amber-400">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 bg-black/70 hover:bg-black/50 rounded text-amber-400 font-bold transition hover:scale-105">+</button>
                        </div>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="mb-6 pb-6 border-b border-amber-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-extrabold text-amber-400">Total</span>
                        <span className="text-3xl font-extrabold text-amber-400">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* FORM */}
                    <div className="space-y-3 mb-6">
                      <div>
                        <label className="text-xs text-amber-200 mb-1 block">Full Name</label>
                        <Input
                          placeholder="John Doe"
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          className="bg-black/70 border-amber-700 text-amber-200 placeholder-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-amber-200 mb-1 block">Email Address</label>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          className="bg-black/70 border-amber-700 text-amber-200 placeholder-amber-400"
                        />
                      </div>
                    </div>

                    {/* STATUS MESSAGE */}
                    {status && (
                      <p className="mb-4 text-center text-sm text-amber-300 animate-pulse">
                        {status}
                      </p>
                    )}

                    {/* PAYMENT BUTTON */}
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className={`w-full font-extrabold text-lg py-3 transition bg-gradient-to-br from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/40 hover:scale-105 ${
                        loading
                          ? "bg-neutral-700 cursor-not-allowed shadow-none hover:shadow-none hover:scale-100"
                          : ""
                      }`}
                    >
                      {loading ? (
                        <>booking...</>
                      ) : (
                        <>
                          Book
                        </>
                      )}
                    </Button>

                    {/* EVENT INFO */}
                    <div className="mt-6 space-y-3 pt-6 border-t border-amber-700 text-xs text-amber-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-400" />
                        <span>Dec 31, 2025 • 8:30 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-400" />
                        <span>Hilton Los Angeles</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-amber-400">
                    <p className="text-sm leading-relaxed whitespace-pre-line">Select a ticket to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Calendar icon since it's not in lucide-react imports
const Calendar = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
