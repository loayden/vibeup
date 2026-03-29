import "server-only";

import Stripe from "stripe";

import { getServerEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(getServerEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-12-15.clover",
    });
  }

  return stripeClient;
}
