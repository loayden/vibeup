"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CountdownTimer } from "@/components/site/countdown";
import { GlassCard, LiquidButton } from "@/components/site/liquid";
import type { PublicEvent, PublicTicketType } from "@/lib/public-events";
import { SITE } from "@/lib/site-data";

type QuantityMap = Record<string, number>;
type BannerState = {
  type: "success" | "error" | "info";
  message: string;
};
type PromoState = {
  code: string | null;
  discountAmount: number;
  description: string | null;
  loading: boolean;
};

type CheckoutExperienceProps = {
  event: PublicEvent | null;
  trustSignals: string[];
  unavailableMessage: string;
  wasCancelled?: boolean;
};

const emptyTicketTypes: PublicTicketType[] = [];
const checkoutSteps = [
  {
    label: "Choose Tickets",
    body: "Select the right tier and quantity for your group.",
  },
  {
    label: "Add Details",
    body: "Create the order inside VibeUp before card payment begins.",
  },
  {
    label: "Pay In Stripe",
    body: "Complete secure payment and receive QR tickets after confirmation.",
  },
] as const;

function FieldLabel({
  children,
  optional = false,
}: {
  children: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <p className="eyebrow">{children}</p>
      {optional ? <span className="eyebrow text-white/18">Optional</span> : null}
    </div>
  );
}

function buildInitialQuantities(ticketTypes: PublicTicketType[]): QuantityMap {
  return ticketTypes.reduce<QuantityMap>((accumulator, ticketType) => {
    accumulator[ticketType.id] = 0;
    return accumulator;
  }, {});
}

function renderBannerStyles(type: BannerState["type"]) {
  if (type === "success") {
    return {
      background: "rgba(52,211,153,0.08)",
      border: "1px solid rgba(52,211,153,0.18)",
    };
  }

  if (type === "error") {
    return {
      background: "rgba(255,60,60,0.07)",
      border: "1px solid rgba(255,80,80,0.18)",
    };
  }

  return {
    background: "rgba(198,169,98,0.08)",
    border: "1px solid rgba(198,169,98,0.18)",
  };
}

export function CheckoutExperience({
  event,
  trustSignals,
  unavailableMessage,
  wasCancelled = false,
}: CheckoutExperienceProps) {
  const ticketTypes = event?.ticketTypes || emptyTicketTypes;
  const [quantities, setQuantities] = useState<QuantityMap>(() =>
    buildInitialQuantities(ticketTypes),
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    promo: "",
  });
  const [promoState, setPromoState] = useState<PromoState>({
    code: null,
    discountAmount: 0,
    description: null,
    loading: false,
  });
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuantities(buildInitialQuantities(ticketTypes));
    setSummaryOpen(false);
  }, [ticketTypes]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (wasCancelled) {
      setBanner({
        type: "info",
        message:
          "Stripe checkout was cancelled before payment completed. Your selections are still here if you want to try again.",
      });
    }
  }, [wasCancelled]);

  const selectedTickets = ticketTypes
    .filter((ticketType) => (quantities[ticketType.id] || 0) > 0)
    .map((ticketType) => ({
      ...ticketType,
      quantity: quantities[ticketType.id],
    }));
  const subtotal = selectedTickets.reduce(
    (sum, ticketType) => sum + ticketType.price * ticketType.quantity,
    0,
  );
  const totalSelectedTickets = selectedTickets.reduce(
    (sum, ticketType) => sum + ticketType.quantity,
    0,
  );
  const discountAmount =
    promoState.code && subtotal > 0 ? Math.min(promoState.discountAmount, subtotal) : 0;
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const fee = discountedSubtotal > 0 ? Number((discountedSubtotal * 0.03).toFixed(2)) : 0;
  const total = discountedSubtotal + fee;
  const checkoutEnabled = Boolean(event?.id && event.ticketsAvailable && ticketTypes.length > 0);

  function toggleTicketSelection(ticketId: string) {
    setQuantities((current) => ({
      ...current,
      [ticketId]: current[ticketId] > 0 ? 0 : 1,
    }));
    setBanner(null);
  }

  function updateQuantity(ticketId: string, direction: "up" | "down") {
    setQuantities((current) => {
      const ticketType = ticketTypes.find((candidate) => candidate.id === ticketId);
      const maxPerOrder = ticketType?.maxPerOrder || 10;
      const currentQuantity = current[ticketId] || 0;
      const nextQuantity =
        direction === "up"
          ? Math.min(currentQuantity + 1, maxPerOrder)
          : Math.max(currentQuantity - 1, 0);

      return {
        ...current,
        [ticketId]: nextQuantity,
      };
    });
    setBanner(null);
  }

  async function applyPromo() {
    if (!form.promo.trim()) {
      setPromoState({
        code: null,
        discountAmount: 0,
        description: null,
        loading: false,
      });
      setBanner({
        type: "info",
        message: "Add a promo code if you received one from the VibeUp team.",
      });
      return;
    }

    if (!event?.id) {
      setBanner({
        type: "error",
        message: unavailableMessage,
      });
      return;
    }

    if (!selectedTickets.length) {
      setBanner({
        type: "error",
        message: "Select at least one ticket tier before applying a promo code.",
      });
      return;
    }

    setPromoState((current) => ({ ...current, loading: true }));
    setBanner(null);

    try {
      const response = await fetch("/api/orders/validate-promo", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.promo.trim(),
          event_id: event.id,
          subtotal,
          ticket_type_ids: selectedTickets.map((ticketType) => ticketType.id),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        valid?: boolean;
        discount_amount?: number;
        description?: string | null;
      };

      if (!response.ok || !payload.valid) {
        setPromoState({
          code: null,
          discountAmount: 0,
          description: null,
          loading: false,
        });
        setBanner({
          type: "error",
          message: payload.error || "Promo code validation failed.",
        });
        return;
      }

      setPromoState({
        code: form.promo.trim().toUpperCase(),
        discountAmount: payload.discount_amount || 0,
        description: payload.description || null,
        loading: false,
      });
      setBanner({
        type: "success",
        message:
          payload.discount_amount && payload.discount_amount > 0
            ? `Promo applied. Your order is reduced by $${payload.discount_amount.toFixed(2)}.`
            : "Promo validated for this order.",
      });
    } catch (error) {
      console.error("Promo validation failed", error);
      setPromoState({
        code: null,
        discountAmount: 0,
        description: null,
        loading: false,
      });
      setBanner({
        type: "error",
        message: "Unable to validate promo code right now.",
      });
    }
  }

  async function handleSubmit(eventObject: React.FormEvent<HTMLFormElement>) {
    eventObject.preventDefault();

    if (!checkoutEnabled || !event?.id) {
      setBanner({
        type: "error",
        message: unavailableMessage,
      });
      return;
    }

    if (!selectedTickets.length) {
      setBanner({
        type: "error",
        message: "Select at least one ticket tier before continuing.",
      });
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      setBanner({
        type: "error",
        message: "Your name and email are required to continue to payment.",
      });
      return;
    }

    setLoading(true);
    setBanner(null);
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          customer_name: form.name.trim(),
          customer_email: form.email.trim(),
          customer_phone: form.phone.trim() || null,
          promo_code: promoState.code,
          items: selectedTickets.map((ticketType) => ({
            ticket_type_id: ticketType.id,
            quantity: ticketType.quantity,
          })),
        }),
        signal,
      });

      const payload = (await response.json()) as {
        error?: string;
        checkout_url?: string;
      };

      if (!response.ok || !payload.checkout_url) {
        setBanner({
          type: "error",
          message: payload.error || "Unable to create your order right now.",
        });
        return;
      }

      setBanner({
        type: "success",
        message: "Order created. Redirecting you to secure Stripe Checkout now.",
      });
      window.location.assign(payload.checkout_url);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Order creation failed", error);
      setBanner({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create your order right now.",
      });
    } finally {
      setLoading(false);
    }
  }

  const orderSummaryContent = (
    <GlassCard dark className="px-5 py-5">
      <p className="eyebrow mb-4">Order Summary</p>
      <p className="body-copy text-[0.8rem] text-white/54">
        {selectedTickets.length
          ? `${totalSelectedTickets} ticket${totalSelectedTickets > 1 ? "s" : ""} currently selected`
          : "No ticket tiers selected yet"}
      </p>
      <div className="space-y-4">
        {selectedTickets.length ? (
          selectedTickets.map((ticketType) => (
            <div key={ticketType.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="body-copy text-white/70">{ticketType.name}</p>
                <p className="eyebrow mt-2 text-white/28">Quantity {ticketType.quantity}</p>
              </div>
              <p className="body-copy text-white/70">
                ${(ticketType.price * ticketType.quantity).toFixed(2)}
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
          <p className="body-copy">Promo Discount</p>
          <p className="body-copy text-white/70">
            {discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : "$0.00"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="body-copy">Estimated Fees</p>
          <p className="body-copy text-white/70">${fee.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="body-copy">Promo Status</p>
          <p className="body-copy text-right text-white/70">
            {promoState.code
              ? `${promoState.code}${promoState.description ? ` · ${promoState.description}` : ""}`
              : "Optional"}
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
      <p className="body-copy mt-4 text-[0.78rem] text-white/52">
        Final card payment is completed in Stripe after this VibeUp order is created.
      </p>
    </GlassCard>
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <GlassCard className="px-5 py-5">
          <p className="eyebrow mb-4">Mobile Purchase Flow</p>
          <div className="grid gap-3 md:grid-cols-3">
            {checkoutSteps.map((step, index) => (
              <div
                key={step.label}
                className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4"
              >
                <p className="eyebrow mb-2 text-[var(--gold)]">Step {index + 1}</p>
                <p className="body-copy text-white/68">{step.label}</p>
                <p className="body-copy mt-2 text-[0.78rem] text-white/50">{step.body}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard warm className="px-6 py-6 md:px-8">
          <p className="eyebrow mb-4">Signature Countdown</p>
          <CountdownTimer
            targetDate={new Date(event?.countdownIso || new Date().toISOString())}
            label={event ? `Until ${event.title}` : "Live inventory unavailable"}
          />
        </GlassCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
          {ticketTypes.length ? (
            ticketTypes.map((ticketType) => {
              const quantity = quantities[ticketType.id] || 0;
              const selected = quantity > 0;
              const soldOut = ticketType.isSoldOut;

              return (
                <GlassCard
                  key={ticketType.id}
                  hover={!soldOut}
                  className={`px-5 py-5 ${selected ? "border-[rgba(198,169,98,0.32)] shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_28px_rgba(198,169,98,0.10),inset_0_1px_0_rgba(255,255,255,0.14)]" : ""} ${soldOut ? "opacity-65" : ""}`}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => {
                      if (!soldOut) {
                        toggleTicketSelection(ticketType.id);
                      }
                    }}
                    disabled={soldOut}
                  >
                    <div
                      className="mb-5 h-1.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${ticketType.color}, transparent)`,
                      }}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow mb-3">Ticket Tier</p>
                        <h3 className="font-serif text-[1.75rem] font-light tracking-[0.05em] text-white sm:text-[1.85rem]">
                          {ticketType.name}
                        </h3>
                      </div>
                      {ticketType.badge ? (
                        <span className="liquid-button-gold px-4 py-2 !text-[9px]">
                          {ticketType.badge}
                        </span>
                      ) : soldOut ? (
                        <span className="liquid-button-ghost px-4 py-2 !text-[9px]">Sold Out</span>
                      ) : null}
                    </div>

                    <p className="mt-4 font-serif text-[2rem] font-light tracking-[0.05em] text-[var(--gold)] sm:text-[2.1rem]">
                      ${ticketType.price}
                    </p>
                    <p className="body-copy mt-4">{ticketType.description}</p>
                    <div className="mt-4 space-y-2">
                      {(ticketType.includes.length
                        ? ticketType.includes.slice(0, 3)
                        : [
                            ticketType.remainingQuantity != null
                              ? `${ticketType.remainingQuantity} seats currently remaining`
                              : "Live inventory is available for this tier",
                            `Up to ${ticketType.maxPerOrder} tickets per order`,
                            "QR delivery follows successful payment confirmation",
                          ]
                      ).map((item) => (
                        <div
                          key={item}
                          className="rounded-[14px] border border-white/8 bg-white/[0.02] px-3 py-3"
                        >
                          <p className="body-copy text-[0.78rem] text-white/58">{item}</p>
                        </div>
                      ))}
                    </div>
                  </button>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="nav-mobile-button !h-12 !w-12"
                        type="button"
                        onClick={(eventObject) => {
                          eventObject.stopPropagation();
                          updateQuantity(ticketType.id, "down");
                        }}
                        disabled={soldOut}
                        data-cursor="hover"
                      >
                        <Minus className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.4} />
                      </button>
                      <span className="font-serif text-[1.6rem] font-light tracking-[0.05em] text-white">
                        {quantity}
                      </span>
                      <button
                        className="nav-mobile-button !h-12 !w-12"
                        type="button"
                        onClick={(eventObject) => {
                          eventObject.stopPropagation();
                          updateQuantity(ticketType.id, "up");
                        }}
                        disabled={soldOut}
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
                    ) : soldOut ? (
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                        <span className="eyebrow text-white/45">Unavailable</span>
                      </div>
                    ) : null}
                  </div>
                </GlassCard>
              );
            })
          ) : (
            <GlassCard dark className="px-6 py-8 sm:col-span-2 xl:col-span-2">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-4 w-4 text-[var(--gold)]" strokeWidth={1.3} />
                <div>
                  <p className="eyebrow mb-3">Ticketing Unavailable</p>
                  <p className="body-copy text-white/68">{unavailableMessage}</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <GlassCard gold className="px-6 py-6 md:px-7">
          <p className="eyebrow mb-4">Order Form</p>
          <h2 className="section-title text-[2.2rem]">
            Complete your <em>order</em>
          </h2>
          <p className="body-copy mt-4">
            {checkoutEnabled
              ? "Your order is created inside VibeUp first, then card payment continues securely in Stripe Checkout."
              : unavailableMessage}
          </p>

          <form id="checkout-order-form" className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input
                className="glass-input"
                placeholder="Name on the order"
                autoComplete="name"
                style={{ fontSize: "16px" }}
                value={form.name}
                onChange={(eventObject) =>
                  setForm((current) => ({ ...current, name: eventObject.target.value }))
                }
              />
            </div>
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <input
                className="glass-input"
                placeholder="Where should we deliver tickets?"
                type="email"
                inputMode="email"
                autoComplete="email"
                style={{ fontSize: "16px" }}
                value={form.email}
                onChange={(eventObject) =>
                  setForm((current) => ({ ...current, email: eventObject.target.value }))
                }
              />
            </div>
            <div>
              <FieldLabel optional>Phone Number</FieldLabel>
              <input
                className="glass-input"
                placeholder="Useful for guest support and urgent updates"
                inputMode="tel"
                autoComplete="tel"
                style={{ fontSize: "16px" }}
                value={form.phone}
                onChange={(eventObject) =>
                  setForm((current) => ({ ...current, phone: eventObject.target.value }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="sm:col-span-1">
                <FieldLabel optional>Promo Code</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Add code if VibeUp sent one"
                  autoComplete="off"
                  style={{ fontSize: "16px" }}
                  value={form.promo}
                  onChange={(eventObject) =>
                    setForm((current) => ({ ...current, promo: eventObject.target.value }))
                  }
                />
              </div>
              <LiquidButton
                type="button"
                className="w-full self-end sm:w-auto"
                onClick={applyPromo}
                disabled={promoState.loading || !checkoutEnabled}
              >
                {promoState.loading ? "Checking" : "Apply"}
              </LiquidButton>
            </div>

            <AnimatePresence>
              {banner ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden rounded-[18px] px-4 py-3"
                  style={renderBannerStyles(banner.type)}
                >
                  <p className="body-copy text-[0.8rem] text-white/70">{banner.message}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="hidden md:block">{orderSummaryContent}</div>

            <GlassCard dark className="px-5 py-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                <p className="eyebrow">Need Help Before Payment</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href={SITE.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                    <div>
                      <p className="eyebrow mb-1 text-[var(--gold)]">WhatsApp</p>
                      <p className="body-copy text-[0.8rem] text-white/62">Fastest guest support</p>
                    </div>
                  </div>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                    <div>
                      <p className="eyebrow mb-1 text-[var(--gold)]">Email Team</p>
                      <p className="body-copy text-[0.8rem] text-white/62">{SITE.email}</p>
                    </div>
                  </div>
                </a>
              </div>
            </GlassCard>

            <LiquidButton
              gold
              type="submit"
              className="w-full justify-center"
              disabled={loading || !checkoutEnabled}
            >
              <span className="inline-flex items-center gap-2">
                {loading
                  ? "Preparing Checkout"
                  : checkoutEnabled
                    ? "Continue To Stripe"
                    : "Ticketing Unavailable"}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
              </span>
            </LiquidButton>
          </form>
        </GlassCard>

        <GlassCard warm className="px-6 py-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.3} />
            <p className="eyebrow">Order Signals</p>
          </div>
          <div className="mt-5 space-y-3">
            {trustSignals.map((item) => (
              <div
                key={item}
                className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <p className="body-copy text-white/65">{item}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 md:hidden">
        <AnimatePresence initial={false}>
          {summaryOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3"
            >
              {orderSummaryContent}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="glass-card glass-card-warm flex items-center gap-3 rounded-[20px] p-3">
          <button
            type="button"
            onClick={() => setSummaryOpen((current) => !current)}
            className="liquid-button-ghost min-w-[148px] justify-center !px-4"
          >
            <span className="inline-flex items-center gap-2">
              {totalSelectedTickets ? `${totalSelectedTickets} Ticket${totalSelectedTickets > 1 ? "s" : ""}` : "Summary"}
              {summaryOpen ? (
                <ChevronDown className="h-4 w-4" strokeWidth={1.3} />
              ) : (
                <ChevronUp className="h-4 w-4" strokeWidth={1.3} />
              )}
            </span>
          </button>

          <button
            type="submit"
            form="checkout-order-form"
            disabled={loading || !checkoutEnabled}
            className="liquid-button-gold flex min-h-[56px] flex-1 items-center justify-between !px-5"
          >
            <span>
              {loading
                ? "Preparing"
                : checkoutEnabled
                  ? "Continue To Stripe"
                  : "Unavailable"}
            </span>
            <span className="font-serif text-[1.1rem] tracking-[0.03em]">${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
