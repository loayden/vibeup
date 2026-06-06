import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/site/admin-dashboard";
import { PageHero } from "@/components/site/liquid";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Administrative dashboard for monitoring ZOYA users, orders, reservations, revenue, and operational signals.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return (
    <main className="overflow-x-hidden pb-20">
      <PageHero
        eyebrow="Admin Dashboard"
        title="Manage orders, guests, and"
        goldWord="operations"
        description="Review orders, users, reservations, enquiries, tickets, and revenue from one focused admin view."
        align="center"
      />

      <section className="px-5 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <AdminDashboardClient />
        </div>
      </section>
    </main>
  );
}
