"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function CaptureEmailPage() {
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

    // Simple email validation
    if (!emailToSubmit || !/\S+@\S+\.\S+/.test(emailToSubmit)) {
      setStatus("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from("subscriptions").insert([{ email: emailToSubmit }]);

      if (error) {
        if (error.code === "23505") { // unique constraint violation
          setStatus("⚠️ This email is already subscribed.");
        } else {
          setStatus(`❌ Subscription failed: ${error.message}`);
        }
      } else {
        localStorage.setItem("preCheckoutEmail", emailToSubmit);
        setStatus("🎉 Email saved! Redirecting to tickets...");
        setTimeout(() => router.push("/checkout"), 1000);
      }
    } catch (err: any) {
      setStatus(`❌ Subscription failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-neutral-100 px-6">
      <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl border border-amber-500/40 shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-amber-400 mb-4 animate-pulse">🎫 Reserve Your Spot!</h1>
        <p className="text-neutral-400 mb-6">
          Enter your email to get updates and confirm your ticket reservation.
        </p>

        <Input
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 mb-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          disabled={loading}
        />

        <Button
          onClick={() => handleSubmit(email)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 mb-2 transition-transform transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Continue to Tickets"}
        </Button>

        {status && (
          <p className={`mt-4 text-sm ${status.includes("saved") || status.includes("already") ? "text-green-400" : "text-red-400"} font-medium`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}