"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { CountdownTimer } from "@/components/site/countdown";
import { GlassCard, LiquidButton, LiquidLinkButton } from "@/components/site/liquid";
import { supabase } from "@/lib/supabase";
import { SITE, TICKET_TYPES, TRUST_SIGNALS } from "@/lib/site-data";

type QuantityMap = Record<string, number>;
type BannerState = {
  type: "success" | "error" | "info";
  message: string;
};

const initialQuantities = TICKET_TYPES.reduce<QuantityMap>((accumulator, ticket) => {
  accumulator[ticket.id] = 0;
  return accumulator;
}, {});

export function CheckoutExperience() {
  const [quantities, setQuantities] = useState<QuantityMap>(initialQuantities);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    promo: "",
  });
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedTickets = TICKET_TYPES.filter((ticket) => quantities[ticket.id] > 0).map(
    (ticket) => ({
      ...ticket,
      quantity: quantities[ticket.id],
    }),
  );
  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0,
  );
  const fee = subtotal > 0 ? Number((subtotal * 0.03).toFixed(2)) : 0;
  const total = subtotal + fee;

  function updateQuantity(ticketId: string, direction: "up" | "down") {
    setQuantities((current) => {
      const nextQuantity =
        direction === "up"
          ? Math.min((current[ticketId] || 0) + 1, 10)
          : Math.max((current[ticketId] || 0) - 1, 0);

      return {
        ...current,
        [ticketId]: nextQuantity,
      };
    });
  }

  function applyPromo() {
    if (!form.promo.trim()) {
      setAppliedPromo(null);
      setBanner({
        type: "info",
        message: "Add a code first. Concierge review is available during final confirmation.",
      });
      return;
    }

    setAppliedPromo(form.promo.trim().toUpperCase());
    setBanner({
      type: "info",
      message:
        "Promo code saved. Final validation is completed during ticket confirmation and payment.",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTickets.length) {
      setBanner({
        type: "error",
        message: "Select at least one ticket tier before continuing.",
      });
      return;
    }

    if (!form.name || !form.email) {
      setBanner({
        type: "error",
        message: "Your name and email are required to save the reservation.",
      });
      return;
    }

    setLoading(true);
    setBanner(null);

    try {
      const { error } = await supabase.from("reservations").insert(
        selectedTickets.map((ticket) => ({
          email: form.email,
          ticket_type: ticket.id,
          promo: appliedPromo,
          status: "pending",
        })),
      );

      if (error) {
        throw error;
      }

      setBanner({
        type: "success",
        message:
          "Your reservation has been saved. Continue to the official ticket page to complete final purchase.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        promo: "",
      });
      setAppliedPromo(null);
      setQuantities(initialQuantities);
    } catch (error) {
      setBanner({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save your reservation right now.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <GlassCard warm className="px-6 py-6 md:px-8">
          <p className="eyebrow mb-4">Signature Countdown</p>
          <CountdownTimer targetDate={new Date(SITE.countdownIso)} label="Until the next marquee night" />
        </GlassCard>

        <div className="grid gap-5 md:grid-cols-2">
          {TICKET_TYPES.map((ticket) => {
            const quantity = quantities[ticket.id] || 0;
            const selected = quantity > 0;

            return (
              <GlassCard
                key={ticket.id}
                hover
                className={`px-5 py-5 ${selected ? "border-[rgba(198,169,98,0.32)] shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_28px_rgba(198,169,98,0.10),inset_0_1px_0_rgba(255,255,255,0.14)]" : ""}`}
              >
                <div
                  className="mb-5 h-1.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${ticket.color}, transparent)` }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow mb-3">Ticket Tier</p>
                    <h3 className="font-serif text-[1.85rem] font-light tracking-[0.05em] text-white">
                      {ticket.name}
                    </h3>
                  </div>
                  {ticket.badge ? (
                    <span className="liquid-button-gold px-4 py-2 !text-[9px]">{ticket.badge}</span>
                  ) : null}
                </div>

                <p className="mt-4 font-serif text-[2.1rem] font-light tracking-[0.05em] text-[var(--gold)]">
                  ${ticket.price}
                </p>
                <p className="body-copy mt-4">{ticket.description}</p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="nav-mobile-button"
                      type="button"
                      onClick={() => updateQuantity(ticket.id, "down")}
                      data-cursor="hover"
                    >
                      <Minus className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                    </button>
                    <span className="font-serif text-[1.6rem] font-light tracking-[0.05em] text-white">
                      {quantity}
                    </span>
                    <button
                      className="nav-mobile-button"
                      type="button"
                      onClick={() => updateQuantity(ticket.id, "up")}
                      data-cursor="hover"
                    >
                      <Plus className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                    </button>
                  </div>

                  {selected ? (
                    <div className="flex items-center gap-2 rounded-full border border-[rgba(198,169,98,0.24)] bg-[rgba(198,169,98,0.10)] px-3 py-2">
                      <Check className="h-3.5 w-3.5 text-[var(--gold)]" strokeWidth={1.5} />
                      <span className="eyebrow text-[var(--gold)]">Selected</span>
                    </div>
                  ) : null}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <GlassCard gold className="px-6 py-6 md:px-7">
          <p className="eyebrow mb-4">Reservation Form</p>
          <h2 className="section-title text-[2.2rem]">
            Save your <em>selection</em>
          </h2>
          <p className="body-copy mt-4">
            Choose your tiers, save your reservation, and continue to the official ticket page
            for payment completion.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <input
              className="glass-input"
              placeholder="Full Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              className="glass-input"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              className="glass-input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                className="glass-input"
                placeholder="Promo or concierge code"
                value={form.promo}
                onChange={(event) => setForm((current) => ({ ...current, promo: event.target.value }))}
              />
              <LiquidButton type="button" onClick={applyPromo}>
                Apply
              </LiquidButton>
            </div>

            <AnimatePresence>
              {banner ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden rounded-[18px] px-4 py-3"
                  style={{
                    background:
                      banner.type === "success"
                        ? "rgba(52,211,153,0.08)"
                        : banner.type === "error"
                          ? "rgba(255,60,60,0.07)"
                          : "rgba(198,169,98,0.08)",
                    border:
                      banner.type === "success"
                        ? "1px solid rgba(52,211,153,0.18)"
                        : banner.type === "error"
                          ? "1px solid rgba(255,80,80,0.18)"
                          : "1px solid rgba(198,169,98,0.18)",
                  }}
                >
                  <p className="body-copy text-[0.8rem] text-white/70">{banner.message}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <GlassCard dark className="px-5 py-5">
              <p className="eyebrow mb-4">Order Summary</p>
              <div className="space-y-4">
                {selectedTickets.length ? (
                  selectedTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="body-copy text-white/70">{ticket.name}</p>
                        <p className="eyebrow mt-2 text-white/28">Quantity {ticket.quantity}</p>
                      </div>
                      <p className="body-copy text-white/70">
                        ${(ticket.price * ticket.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="body-copy">Select a ticket tier to begin building your order.</p>
                )}
              </div>

              <div className="subtle-divider mt-5 h-px" />

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="body-copy">Subtotal</p>
                  <p className="body-copy text-white/70">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="body-copy">Estimated Fees</p>
                  <p className="body-copy text-white/70">${fee.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="body-copy">Promo Status</p>
                  <p className="body-copy text-white/70">
                    {appliedPromo ? `Saved: ${appliedPromo}` : "Optional"}
                  </p>
                </div>
              </div>

              <div className="gold-divider-left mt-5 h-px w-24" />

              <div className="mt-5 flex items-center justify-between">
                <p className="eyebrow">Estimated Total</p>
                <p className="font-serif text-[2rem] font-light tracking-[0.05em] text-[var(--gold)]">
                  ${total.toFixed(2)}
                </p>
              </div>
            </GlassCard>

            <LiquidButton gold type="submit" className="w-full justify-center" disabled={loading}>
              <span className="inline-flex items-center gap-2">
                {loading ? "Saving Reservation" : "Reserve Selection"}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
              </span>
            </LiquidButton>
          </form>
        </GlassCard>

        <GlassCard warm className="px-6 py-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.3} />
            <p className="eyebrow">Trust Signals</p>
          </div>
          <div className="mt-5 space-y-3">
            {TRUST_SIGNALS.map((item) => (
              <div key={item} className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3">
                <p className="body-copy text-white/65">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <LiquidLinkButton href={SITE.buyUrl} gold external className="w-full justify-center">
              Proceed To Official Payment
            </LiquidLinkButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
