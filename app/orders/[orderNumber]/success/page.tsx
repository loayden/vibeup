import type { Metadata } from "next";

import { OrderExperience } from "@/components/site/order-experience";
import { PageHero } from "@/components/site/liquid";

type OrderSuccessPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Order Success",
  description:
    "Payment complete. Review your confirmed ZOYA order and retrieve your QR tickets.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const { orderNumber } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Payment Result"
        title="Your order has been"
        goldWord="received"
        description="Stripe sent you back to ZOYA after checkout. This page verifies the order, shows the current payment state, and exposes any QR tickets already generated."
      />

      <section className="px-5 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <OrderExperience
            orderNumber={orderNumber}
            sessionId={resolvedSearchParams.session_id}
            success
          />
        </div>
      </section>
    </main>
  );
}
