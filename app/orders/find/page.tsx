import type { Metadata } from "next";

import { OrderLookupForm } from "@/components/site/order-lookup-form";
import { PageHero } from "@/components/site/liquid";

export const metadata: Metadata = {
  title: "Find Order",
  description:
    "Open an existing ZOYA order, verify payment status, or resend confirmed ticket delivery.",
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
        title="Find your order and resend"
        goldWord="tickets"
        description="Enter your order number and checkout email to open your order, view ticket status, or resend confirmed QR tickets."
      />

      <section className="px-5 pb-20 pt-2 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <OrderLookupForm />
        </div>
      </section>
    </main>
  );
}
