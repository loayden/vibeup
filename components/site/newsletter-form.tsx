"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { LiquidButton } from "@/components/site/liquid";

type NewsletterFormProps = {
  source?: string;
  compact?: boolean;
};

export function NewsletterForm({
  source = "website",
  compact = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setStatus(payload?.error || "Subscription failed. Please try again.");
      } else {
        setStatus(payload?.message || "Subscribed successfully.");
        setEmail("");
      }
    } catch {
      setStatus("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${compact ? "" : "max-w-2xl"}`}>
      <div className={`flex flex-col gap-3 sm:flex-row ${compact ? "" : "sm:items-center"}`}>
        <input
          className="glass-input flex-1"
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleSubmit();
            }
          }}
        />
        <LiquidButton gold onClick={() => void handleSubmit()} disabled={loading}>
          <span className="inline-flex items-center gap-2">
            {loading ? "Sending" : "Subscribe"}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
          </span>
        </LiquidButton>
      </div>
      {status ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="body-copy text-[0.78rem]"
        >
          {status}
        </motion.p>
      ) : null}
    </div>
  );
}
