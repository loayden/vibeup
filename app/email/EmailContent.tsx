"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    // التحقق من صحة البريد الإلكتروني
    if (!emailToSubmit || !/\S+@\S+\.\S+/.test(emailToSubmit)) {
      setStatus("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from("subscriptions").insert([{ email: emailToSubmit }]);

      if (error) {
        if (error.code === "23505") {
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
    <div className="min-w-0 min-h-0 max-w-md w-full bg-neutral-900/70 backdrop-blur-md p-8 rounded-2xl border border-amber-500/30 text-center">
      <h1 className="text-4xl font-extrabold text-amber-400 mb-4 animate-pulse">🎫 Reserve Your Spot!</h1>
      <p className="text-neutral-400 mb-6">
        Enter your email to get updates and confirm your ticket reservation.
      </p>

      <Input
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-neutral-800 border border-amber-500 text-white placeholder:text-neutral-400 mb-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
        disabled={loading}
      />

      <Button
        onClick={() => handleSubmit(email)}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold py-3 mb-2 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-amber-500/40 transition-all"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Continue to Tickets"}
      </Button>

      {status && (
        <p className={`mt-4 text-sm font-medium ${status.includes("saved") ? "text-green-400" : "text-amber-400"}`}>
          {status}
        </p>
      )}
    </div>
  );
}