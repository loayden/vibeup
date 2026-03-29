"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { LiquidButton } from "@/components/site/liquid";

type BannerState = {
  type: "success" | "error";
  message: string;
};

const eventTypes = [
  { value: "corporate", label: "Corporate" },
  { value: "private", label: "Private Party" },
  { value: "concert", label: "Concert" },
  { value: "cultural", label: "Cultural" },
  { value: "wedding", label: "Wedding" },
  { value: "other", label: "Other" },
] as const;

const guestCounts = ["Under 50", "50-200", "200-500", "500+"] as const;
const budgetRanges = ["Under $5K", "$5K-$15K", "$15K-$50K", "$50K+"] as const;

export function ContactForm() {
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    event_type: string;
    guest_count: string;
    event_date: string;
    budget: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    company: "",
    event_type: "private",
    guest_count: guestCounts[1],
    event_date: "",
    budget: budgetRanges[1],
    message: "",
  });
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setBanner(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone || null,
          company: form.company || null,
          event_date: form.event_date || null,
          source: "contact-page",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setBanner({
          type: "error",
          message: payload?.error || "Unable to submit your enquiry.",
        });
        return;
      }

      setBanner({
        type: "success",
        message: payload?.message || "Your enquiry has been sent successfully.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        event_type: "private",
        guest_count: guestCounts[1],
        event_date: "",
        budget: budgetRanges[1],
        message: "",
      });
    } catch {
      setBanner({
        type: "error",
        message: "Unable to submit your enquiry.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AnimatePresence>
        {banner ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-3 overflow-hidden rounded-[18px] px-4 py-3"
            style={{
              background:
                banner.type === "success"
                  ? "rgba(52,211,153,0.08)"
                  : "rgba(255,60,60,0.07)",
              border:
                banner.type === "success"
                  ? "1px solid rgba(52,211,153,0.18)"
                  : "1px solid rgba(255,80,80,0.18)",
            }}
          >
            {banner.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300/80" strokeWidth={1.3} />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-300/80" strokeWidth={1.3} />
            )}
            <p className="body-copy text-[0.8rem] text-white/70">{banner.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="glass-input"
          placeholder="Full Name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          className="glass-input"
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="glass-input"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        />
        <input
          className="glass-input"
          placeholder="Company / Brand"
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="glass-input"
          value={form.event_type}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              event_type: event.target.value as typeof form.event_type,
            }))
          }
        >
          {eventTypes.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#121214] text-white">
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="glass-input"
          value={form.guest_count}
          onChange={(event) => setForm((current) => ({ ...current, guest_count: event.target.value }))}
        >
          {guestCounts.map((option) => (
            <option key={option} value={option} className="bg-[#121214] text-white">
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="glass-input"
          type="date"
          value={form.event_date}
          onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
        />
        <select
          className="glass-input"
          value={form.budget}
          onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
        >
          {budgetRanges.map((option) => (
            <option key={option} value={option} className="bg-[#121214] text-white">
              {option}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="glass-input min-h-[160px] resize-none"
        placeholder="Tell us about the experience you want to create."
        value={form.message}
        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        required
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="body-copy max-w-xl text-[0.78rem]">
          We review every enquiry personally and usually respond within 24 hours with a
          clear next step.
        </p>
        <LiquidButton gold type="submit" disabled={loading}>
          <span className="inline-flex items-center gap-2">
            {loading ? "Sending" : "Send Enquiry"}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
          </span>
        </LiquidButton>
      </div>
    </form>
  );
}
