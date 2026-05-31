"use client";

import { Mail, Search } from "lucide-react";
import { useState } from "react";

import { GlassCard, LiquidButton } from "@/components/site/liquid";

type BannerState = {
  type: "error" | "success" | "info";
  message: string;
};

function FieldLabel({ children }: { children: string }) {
  return <p className="eyebrow mb-2">{children}</p>;
}

function bannerStyles(type: BannerState["type"]) {
  if (type === "success") {
    return {
      background: "rgba(52,211,153,0.08)",
      border: "1px solid rgba(52,211,153,0.18)",
    };
  }

  if (type === "info") {
    return {
      background: "rgba(198,169,98,0.08)",
      border: "1px solid rgba(198,169,98,0.18)",
    };
  }

  return {
    background: "rgba(255,60,60,0.07)",
    border: "1px solid rgba(255,80,80,0.18)",
  };
}

export function OrderLookupForm() {
  const [form, setForm] = useState({
    orderNumber: "",
    email: "",
  });
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  function validate() {
    if (form.orderNumber.trim().length < 4) {
      setBanner({
        type: "error",
        message: "Enter the order number from your ZOYA confirmation email.",
      });
      return false;
    }

    if (!form.email.includes("@")) {
      setBanner({
        type: "error",
        message: "Enter the email used during checkout so the order can be verified safely.",
      });
      return false;
    }

    return true;
  }

  function buildLookupUrl() {
    const params = new URLSearchParams({
      email: form.email.trim(),
    });

    return `/orders/${encodeURIComponent(form.orderNumber.trim())}?${params.toString()}`;
  }

  function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setBanner({
      type: "info",
      message: "Opening your order details now.",
    });
    window.location.assign(buildLookupUrl());
  }

  async function handleResend() {
    if (!validate()) {
      return;
    }

    setResending(true);
    setBanner(null);

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(form.orderNumber.trim())}/resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim(),
          }),
        },
      );

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setBanner({
          type: "error",
          message: payload?.error || "Unable to resend tickets right now.",
        });
        return;
      }

      setBanner({
        type: "success",
        message:
          payload?.message ||
          "If the order is paid and tickets are ready, the ticket email has been resent.",
      });
    } catch (error) {
      setBanner({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to resend tickets right now.",
      });
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <GlassCard gold className="px-6 py-7 md:px-8">
        <p className="eyebrow mb-4">Secure Order Access</p>
        <h2 className="section-title text-[2.3rem]">
          Find your confirmed <em>order</em>
        </h2>
        <p className="body-copy mt-5 max-w-2xl text-white/68">
          Use the order number and checkout email to open the ticket page, verify payment state,
          and retrieve any QR passes already issued.
        </p>

        {banner ? (
          <div
            className="mt-6 rounded-[18px] px-4 py-3"
            style={bannerStyles(banner.type)}
          >
            <p className="body-copy text-[0.82rem] text-white/72">{banner.message}</p>
          </div>
        ) : null}

        <form className="mt-7 space-y-4" onSubmit={handleLookup}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Order Number</FieldLabel>
              <input
                className="glass-input"
                value={form.orderNumber}
                onChange={(event) =>
                  setForm((current) => ({ ...current, orderNumber: event.target.value }))
                }
                placeholder="Ex: VU-ABC123"
                autoComplete="off"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div>
              <FieldLabel>Checkout Email</FieldLabel>
              <input
                className="glass-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="Email used when paying"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LiquidButton gold type="submit" className="w-full justify-center sm:w-auto" disabled={loading}>
              <span className="inline-flex items-center gap-2">
                <Search className="h-3.5 w-3.5" strokeWidth={1.2} />
                {loading ? "Opening Order" : "Open Order"}
              </span>
            </LiquidButton>
            <LiquidButton
              type="button"
              className="w-full justify-center sm:w-auto"
              onClick={() => void handleResend()}
              disabled={resending}
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.2} />
                {resending ? "Sending Email" : "Resend Tickets"}
              </span>
            </LiquidButton>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="px-6 py-7">
        <p className="eyebrow mb-4">What You Can Do</p>
        <div className="space-y-4">
          {[
            "Verify whether payment completed successfully.",
            "Open QR tickets already attached to a paid order.",
            "Resend the confirmation email if you cannot find it.",
            "Move into support quickly if the order still shows as pending.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
            >
              <p className="body-copy text-white/68">{item}</p>
            </div>
          ))}
        </div>

        <div className="gold-divider-left mt-6 h-px w-20" />

        <div className="mt-6 space-y-3">
          <p className="eyebrow text-[var(--gold)]">Support Note</p>
          <p className="body-copy text-white/68">
            If the order is still pending, the fastest next step is to check the confirmation email
            first, then contact ZOYA support with the order number.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="mailto:vibesup.event@gmail.com" className="liquid-button-ghost w-full justify-center sm:w-auto">
              Email Support
            </a>
            <a href="https://wa.me/19492479309" target="_blank" rel="noreferrer" className="liquid-button-gold w-full justify-center sm:w-auto">
              WhatsApp
            </a>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
