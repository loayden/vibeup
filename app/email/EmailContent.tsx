"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmailContent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (emailToSubmit: string) => {
    setStatus(null);

    if (!emailToSubmit || !/\S+@\S+\.\S+/.test(emailToSubmit)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("subscriptions").insert([{ email: emailToSubmit }]);

      if (error) {
        if (error.code === "23505") {
          setStatus("This email is already subscribed.");
        } else {
          setStatus(`Subscription failed: ${error.message}`);
        }
      } else {
        localStorage.setItem("preCheckoutEmail", emailToSubmit);
        setStatus("Email saved — redirecting to tickets…");
        setTimeout(() => router.push("/checkout"), 1000);
      }
    } catch (error) {
      setStatus(
        `Subscription failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = status?.includes("saved");

  return (
    <div className="glass-card-warm w-full max-w-md px-8 py-10 text-center">
      {/* Spec line accent */}
      <div className="spec-line" />

      <p className="eyebrow mb-5">Exclusive Access</p>

      <h1 className="section-title mb-4">
        Reserve Your <em>Spot</em>
      </h1>

      <p className="body-copy mx-auto mb-8 max-w-xs">
        Enter your email to receive updates and confirm your ticket reservation.
      </p>

      <input
        className="glass-input mb-4"
        placeholder="your@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") void handleSubmit(email); }}
        disabled={loading}
      />

      <button
        className="liquid-button-gold w-full justify-center"
        onClick={() => void handleSubmit(email)}
        disabled={loading}
      >
        <span className="inline-flex items-center gap-2">
          {loading ? "Submitting…" : "Continue to Tickets"}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
        </span>
      </button>

      {status && (
        <p
          className={`body-copy mt-5 text-[0.8rem] ${
            isSuccess ? "text-emerald-300/80" : "text-[var(--gold)]"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
