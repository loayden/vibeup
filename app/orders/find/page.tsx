import type { Metadata } from "next";

import { OrderLookupForm } from "@/components/site/order-lookup-form";
import { PageHero } from "@/components/site/liquid";

export const metadata: Metadata = {
  title: "Find Order",
  description:
    "Open an existing VibeUp order, verify payment status, or resend confirmed ticket delivery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FindOrderPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Order Support"
        title="Find your order or resend"
        goldWord="tickets"
        description="Use the checkout email and order number to retrieve the current order state, open QR tickets, or trigger a fresh ticket email if payment has already been confirmed."
      />

      <section className="px-5 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <OrderLookupForm />
        </div>
      </section>
    </main>
  );
}
