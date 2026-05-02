import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/site/admin-dashboard";
import { PageHero } from "@/components/site/liquid";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Administrative dashboard for monitoring VibeUp users, orders, reservations, revenue, and operational signals.",
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
        title="Monitor users, revenue, and operational"
        goldWord="signals"
        description="This dashboard is designed for administrators who need a cleaner view of profiles, subscriptions, enquiries, order flow, and event performance inside the VibeUp system."
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
