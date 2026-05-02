"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Mail, MapPin, RefreshCw, Ticket, XCircle } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { GlassCard, LiquidLinkButton } from "@/components/site/liquid";

type TicketRecord = {
  id: string;
  ticket_number: string;
  ticket_type_name: string;
  qr_code_url: string | null;
  status: string;
};

type OrderRecord = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string | null;
  status: "pending" | "paid" | "cancelled" | "refunded" | "partially_refunded";
  subtotal: number;
  discount_amount: number;
  fee_amount: number;
  total: number;
  currency: string;
  created_at: string;
  tickets: TicketRecord[];
  order_items: Array<{
    id: string;
    ticket_type_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  events: {
    title: string;
    event_date: string;
    venue_name: string;
    venue_address?: string | null;
  } | null;
};

type OrderExperienceProps = {
  orderNumber: string;
  email?: string;
  sessionId?: string;
  success?: boolean;
};

type OrderState = {
  order: OrderRecord | null;
  loading: boolean;
  error: string | null;
};

function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function getStatusCopy(status: OrderRecord["status"], success?: boolean) {
  if (status === "paid") {
    return {
      eyebrow: success ? "Payment Confirmed" : "Order Confirmed",
      title: "Your tickets are ready",
      body:
        "Stripe confirmed the payment, VibeUp recorded the order, and your QR tickets are now attached below.",
      Icon: CheckCircle2,
    };
  }

  if (status === "pending") {
    return {
      eyebrow: "Awaiting Payment",
      title: success ? "Payment is still settling" : "Order is still pending",
      body:
        "The order exists in VibeUp, but payment confirmation has not finished yet. If you just completed checkout, refresh in a moment or open the confirmation email when it arrives.",
      Icon: Clock3,
    };
  }

  if (status === "cancelled") {
    return {
      eyebrow: "Order Cancelled",
      title: "This order was not completed",
      body:
        "Stripe checkout expired or payment failed before the order could be completed.",
      Icon: XCircle,
    };
  }

  return {
    eyebrow: "Order Updated",
    title: "This order has changed",
    body:
      "The order was refunded or partially refunded. Review the items and ticket status below for the current state.",
    Icon: Ticket,
  };
}

export function OrderExperience({
  orderNumber,
  email,
  sessionId,
  success = false,
}: OrderExperienceProps) {
  const [state, setState] = useState<OrderState>({
    order: null,
    loading: true,
    error: null,
  });
  const [resendState, setResendState] = useState<{
    loading: boolean;
    message: string | null;
    type: "error" | "success" | null;
  }>({
    loading: false,
    message: null,
    type: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const params = new URLSearchParams();

    if (email) {
      params.set("email", email);
    }

    if (sessionId) {
      params.set("session_id", sessionId);
    }

    const query = params.toString();
    const url = query ? `/api/orders/${orderNumber}?${query}` : `/api/orders/${orderNumber}`;

    fetch(url, {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          order?: OrderRecord;
          error?: string;
        };

        if (!response.ok || !payload.order) {
          throw new Error(
            payload.error ||
              "We could not load this order. Open the order from your confirmation email or sign in first.",
          );
        }

        setState({
          order: payload.order,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setState({
          order: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load order.",
        });
      });

    return () => {
      controller.abort();
    };
  }, [email, orderNumber, sessionId]);

  if (state.loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard gold className="px-6 py-8">
          <p className="eyebrow mb-4">Loading Order</p>
          <div className="space-y-3">
            <div className="h-6 w-1/2 rounded-full bg-white/10" />
            <div className="h-5 w-full rounded-full bg-white/8" />
            <div className="h-5 w-5/6 rounded-full bg-white/8" />
          </div>
        </GlassCard>
        <GlassCard dark className="px-6 py-8">
          <div className="space-y-3">
            <div className="h-5 w-1/3 rounded-full bg-white/10" />
            <div className="h-5 w-full rounded-full bg-white/8" />
            <div className="h-5 w-2/3 rounded-full bg-white/8" />
          </div>
        </GlassCard>
      </div>
    );
  }

  if (state.error || !state.order) {
    return (
      <GlassCard warm className="mx-auto max-w-3xl px-6 py-8 text-center">
        <p className="eyebrow mb-4">Secure Order Access</p>
        <h2 className="section-title text-[2.2rem]">
          We could not verify this <em>order</em>
        </h2>
        <p className="body-copy mx-auto mt-5 max-w-2xl text-white/68">
          {state.error ||
            "Open the order from your confirmation email, or sign in with the email address used during checkout."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LiquidLinkButton href="/checkout" gold className="w-full justify-center sm:w-auto">
            Return To Checkout
          </LiquidLinkButton>
          <LiquidLinkButton href="/contact-us" className="w-full justify-center sm:w-auto">
            Contact Support
          </LiquidLinkButton>
        </div>
      </GlassCard>
    );
  }

  const order = state.order;
  const statusCopy = getStatusCopy(order.status, success);
  const lookupEmail = email || order.customer_email || null;

  async function handleResendTickets() {
    setResendState({
      loading: true,
      message: null,
      type: null,
    });

    try {
      const response = await fetch(`/api/orders/${order.order_number}/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: lookupEmail,
          session_id: sessionId,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setResendState({
          loading: false,
          message: payload?.error || "Unable to resend tickets right now.",
          type: "error",
        });
        return;
      }

      setResendState({
        loading: false,
        message: payload?.message || "Ticket email sent successfully.",
        type: "success",
      });
    } catch (error) {
      setResendState({
        loading: false,
        message: error instanceof Error ? error.message : "Unable to resend tickets right now.",
        type: "error",
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <GlassCard gold className="px-6 py-7 md:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(198,169,98,0.12)]">
            <statusCopy.Icon className="h-5 w-5 text-[var(--gold)]" strokeWidth={1.4} />
          </div>
          <div>
            <p className="eyebrow mb-3">{statusCopy.eyebrow}</p>
            <h2 className="section-title text-[2.2rem]">
              {statusCopy.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em>{statusCopy.title.split(" ").slice(-1).join(" ")}</em>
            </h2>
            <p className="body-copy mt-5 text-white/68">{statusCopy.body}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlassCard dark className="px-5 py-5">
            <p className="eyebrow mb-2">Order Number</p>
            <p className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
              {order.order_number}
            </p>
          </GlassCard>
          <GlassCard dark className="px-5 py-5">
            <p className="eyebrow mb-2">Total Paid</p>
            <p className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-[var(--gold)]">
              {formatMoney(order.total, order.currency)}
            </p>
          </GlassCard>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <GlassCard dark className="px-5 py-5">
            <CalendarDays className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow mb-2">Event Date</p>
            <p className="body-copy text-white/68">
              {order.events?.event_date
                ? format(new Date(order.events.event_date), "EEEE, MMMM d, yyyy")
                : "TBA"}
            </p>
          </GlassCard>
          <GlassCard dark className="px-5 py-5">
            <MapPin className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow mb-2">Venue</p>
            <p className="body-copy text-white/68">{order.events?.venue_name || "VibeUp Event"}</p>
          </GlassCard>
          <GlassCard dark className="px-5 py-5">
            <Mail className="mb-3 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow mb-2">Guest</p>
            <p className="body-copy text-white/68">
              {order.customer_name}
              {order.customer_email ? `\n${order.customer_email}` : ""}
            </p>
          </GlassCard>
        </div>

        <div className="gold-divider-left mt-8 h-px w-24" />

        <div className="mt-8">
          <p className="eyebrow mb-4">Ticket Items</p>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <GlassCard key={item.id} dark className="px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                      {item.ticket_type_name}
                    </p>
                    <p className="body-copy mt-2 text-white/65">
                      Quantity {item.quantity} · {formatMoney(item.unit_price, order.currency)} each
                    </p>
                  </div>
                  <p className="font-serif text-[1.5rem] font-light tracking-[0.05em] text-[var(--gold)]">
                    {formatMoney(item.total_price, order.currency)}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="px-6 py-6">
          <p className="eyebrow mb-4">Order Totals</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="body-copy">Subtotal</p>
              <p className="body-copy text-white/70">
                {formatMoney(order.subtotal, order.currency)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="body-copy">Discount</p>
              <p className="body-copy text-white/70">
                -{formatMoney(order.discount_amount, order.currency)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="body-copy">Fees</p>
              <p className="body-copy text-white/70">
                {formatMoney(order.fee_amount, order.currency)}
              </p>
            </div>
            <div className="gold-divider-left h-px w-20" />
            <div className="flex items-center justify-between">
              <p className="eyebrow">Final Total</p>
              <p className="font-serif text-[1.9rem] font-light tracking-[0.05em] text-[var(--gold)]">
                {formatMoney(order.total, order.currency)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard warm className="px-6 py-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow">QR Tickets</p>
            {order.status === "paid" ? (
              <button
                type="button"
                onClick={() => void handleResendTickets()}
                className="liquid-button-ghost w-full justify-center sm:w-auto"
                disabled={resendState.loading}
              >
                <span className="inline-flex items-center gap-2">
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${resendState.loading ? "animate-spin" : ""}`}
                    strokeWidth={1.2}
                  />
                  {resendState.loading ? "Sending Email" : "Resend Tickets"}
                </span>
              </button>
            ) : null}
          </div>
          {resendState.message ? (
            <div
              className="mb-4 rounded-[18px] px-4 py-3"
              style={{
                background:
                  resendState.type === "success"
                    ? "rgba(52,211,153,0.08)"
                    : "rgba(255,60,60,0.07)",
                border:
                  resendState.type === "success"
                    ? "1px solid rgba(52,211,153,0.18)"
                    : "1px solid rgba(255,80,80,0.18)",
              }}
            >
              <p className="body-copy text-[0.8rem] text-white/72">{resendState.message}</p>
            </div>
          ) : null}
          {order.tickets.length ? (
            <div className="space-y-4">
              {order.tickets.map((ticket) => (
                <GlassCard key={ticket.id} dark className="px-5 py-5">
                  <p className="eyebrow mb-2">{ticket.ticket_type_name}</p>
                  <p className="body-copy text-white/68">{ticket.ticket_number}</p>
                  {ticket.qr_code_url ? (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-white/8 bg-[#080808] p-3">
                      <Image
                        src={ticket.qr_code_url}
                        alt={`QR code for ${ticket.ticket_number}`}
                        width={220}
                        height={220}
                        unoptimized
                        className="mx-auto h-auto w-full max-w-[220px]"
                      />
                    </div>
                  ) : null}
                </GlassCard>
              ))}
            </div>
          ) : (
            <p className="body-copy text-white/68">
              QR tickets will appear here as soon as the payment webhook finishes processing the
              order.
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
