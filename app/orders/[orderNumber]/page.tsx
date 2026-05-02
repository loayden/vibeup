import type { Metadata } from "next";

import { OrderExperience } from "@/components/site/order-experience";
import { PageHero } from "@/components/site/liquid";

type OrderPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    email?: string;
    session_id?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Order Details",
  description:
    "Review your VibeUp order status, ticket items, and QR entry passes after checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { orderNumber } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Order Detail"
        title="Review your ticket"
        goldWord="order"
        description="This page shows the current VibeUp order state, ticket items, payment result, and any QR passes already generated for entry."
      />

      <section className="px-5 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <OrderExperience
            orderNumber={orderNumber}
            email={resolvedSearchParams.email}
            sessionId={resolvedSearchParams.session_id}
          />
        </div>
      </section>
    </main>
  );
}
