"use client";

import { format } from "date-fns";
import {
  ArrowRight,
  ChartNoAxesCombined,
  DollarSign,
  LogOut,
  RefreshCw,
  Shield,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { GlassCard, LiquidButton } from "@/components/site/liquid";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
  email_verified: boolean | null;
  marketing_opt_in: boolean | null;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: number;
  created_at: string;
  events?: {
    title: string;
    event_date: string;
  } | null;
};

type Subscription = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  created_at: string;
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  status: string;
  event_type: string | null;
  created_at: string;
};

type AnalyticsPayload = {
  monthly_revenue: Array<{ month: string; revenue: number }>;
  top_events: Array<{
    id: string;
    title: string;
    event_date: string;
    attendees: number | null;
    max_capacity: number | null;
    revenue: number;
  }>;
  totals: {
    revenue: number;
    paid_orders: number;
    refunded_orders: number;
  };
};

type DashboardStats = {
  orders_this_month: number;
  active_tickets: number;
  new_enquiries: number;
  total_subscribers: number;
  published_events: number;
  revenue_this_month: number;
};

type AuthProfile = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
};

type BannerState = {
  type: "error" | "success" | "info";
  message: string;
};

export function AdminDashboardClient() {
  const [authStatus, setAuthStatus] = useState<
    "checking" | "unauthenticated" | "forbidden" | "ready"
  >("checking");
  const [authProfile, setAuthProfile] = useState<AuthProfile | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  async function loadDashboardData() {
    setLoading(true);
    setBanner(null);

    try {
      const [statsResponse, analyticsResponse, ordersResponse, subscriptionsResponse, enquiriesResponse, usersResponse] =
        await Promise.all([
          fetch("/api/admin/dashboard", { credentials: "include" }),
          fetch("/api/admin/analytics", { credentials: "include" }),
          fetch("/api/admin/orders?limit=8", { credentials: "include" }),
          fetch("/api/admin/subscriptions?limit=8", { credentials: "include" }),
          fetch("/api/admin/enquiries?limit=8", { credentials: "include" }),
          fetch("/api/admin/users?limit=8", { credentials: "include" }),
        ]);

      if ([statsResponse, analyticsResponse, ordersResponse, subscriptionsResponse, enquiriesResponse, usersResponse].some((response) => !response.ok)) {
        throw new Error("Unable to load dashboard data.");
      }

      const statsPayload = (await statsResponse.json()) as { stats: DashboardStats };
      const analyticsPayload = (await analyticsResponse.json()) as AnalyticsPayload;
      const ordersPayload = (await ordersResponse.json()) as { orders: Order[] };
      const subscriptionsPayload = (await subscriptionsResponse.json()) as {
        subscriptions: Subscription[];
      };
      const enquiriesPayload = (await enquiriesResponse.json()) as { enquiries: Enquiry[] };
      const usersPayload = (await usersResponse.json()) as { users: Profile[] };

      setStats(statsPayload.stats);
      setAnalytics(analyticsPayload);
      setOrders(ordersPayload.orders || []);
      setSubscriptions(subscriptionsPayload.subscriptions || []);
      setEnquiries(enquiriesPayload.enquiries || []);
      setUsers(usersPayload.users || []);
    } catch (error) {
      setBanner({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });

      if (response.status === 401) {
        setAuthStatus("unauthenticated");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to validate the current session.");
      }

      const payload = (await response.json()) as { profile: AuthProfile };

      if (!["admin", "super_admin"].includes(payload.profile.role)) {
        setAuthProfile(payload.profile);
        setAuthStatus("forbidden");
        return;
      }

      setAuthProfile(payload.profile);
      setAuthStatus("ready");
    } catch {
      setAuthStatus("unauthenticated");
    }
  }

  useEffect(() => {
    void checkAuth();
  }, []);

  useEffect(() => {
    if (authStatus === "ready") {
      void loadDashboardData();
    }
  }, [authStatus]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoggingIn(true);
    setBanner(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok) {
        setBanner({
          type: "error",
          message: payload?.error || "Invalid login credentials.",
        });
        return;
      }

      setBanner({
        type: "success",
        message: "Session confirmed. Loading dashboard.",
      });
      await checkAuth();
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setAuthProfile(null);
    setStats(null);
    setAnalytics(null);
    setOrders([]);
    setSubscriptions([]);
    setEnquiries([]);
    setUsers([]);
    setAuthStatus("unauthenticated");
    setBanner({
      type: "info",
      message: "You have been logged out.",
    });
  }

  const maxRevenue = Math.max(
    ...(analytics?.monthly_revenue.map((item) => item.revenue) || [1]),
    1,
  );

  if (authStatus === "checking") {
    return (
      <div className="space-y-6">
        <GlassCard warm className="px-6 py-7">
          <p className="eyebrow mb-3">Admin Access</p>
          <h2 className="section-title text-[2.2rem]">
            Validating <em>session</em>
          </h2>
          <p className="body-copy mt-5">Checking the current admin session before loading data.</p>
        </GlassCard>
      </div>
    );
  }

  if (authStatus === "unauthenticated" || authStatus === "forbidden") {
    return (
      <div className="mx-auto max-w-3xl">
        <GlassCard gold className="px-6 py-7 md:px-8">
          <p className="eyebrow mb-4">Admin Portal</p>
          <h2 className="section-title text-[2.4rem]">
            Secure dashboard <em>access</em>
          </h2>
          <p className="body-copy mt-5">
            Sign in with an administrator account to review user profiles, orders, subscribers,
            event performance, and new enquiries from the live system.
          </p>

          {banner ? (
            <div
              className="mt-6 rounded-[18px] px-4 py-3"
              style={{
                background:
                  banner.type === "success"
                    ? "rgba(52,211,153,0.08)"
                    : banner.type === "info"
                      ? "rgba(198,169,98,0.08)"
                      : "rgba(255,60,60,0.07)",
                border:
                  banner.type === "success"
                    ? "1px solid rgba(52,211,153,0.18)"
                    : banner.type === "info"
                      ? "1px solid rgba(198,169,98,0.18)"
                      : "1px solid rgba(255,80,80,0.18)",
              }}
            >
              <p className="body-copy text-[0.8rem] text-white/70">{banner.message}</p>
            </div>
          ) : null}

          {authStatus === "forbidden" ? (
            <GlassCard dark className="mt-6 px-5 py-5">
              <p className="eyebrow mb-3">Permission Required</p>
              <p className="body-copy">
                Signed in as {authProfile?.email}. This account does not have admin access to the
                full dashboard.
              </p>
            </GlassCard>
          ) : (
            <form className="mt-7 space-y-4" onSubmit={handleLogin}>
              <input
                className="glass-input"
                placeholder="Admin Email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
              <input
                className="glass-input"
                placeholder="Password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
              <div className="flex justify-end">
                <LiquidButton gold type="submit" disabled={loggingIn}>
                  <span className="inline-flex items-center gap-2">
                    {loggingIn ? "Signing In" : "Open Dashboard"}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                  </span>
                </LiquidButton>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GlassCard warm className="px-6 py-7 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-4">Admin Overview</p>
            <h2 className="section-title text-[2.6rem]">
              Live business <em>signals</em>
            </h2>
            <p className="body-copy mt-5 max-w-2xl">
              Monitor recent revenue, ticket movement, subscribers, incoming enquiries, and the
              latest user profiles without leaving the main VibeUp experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <LiquidButton onClick={() => void loadDashboardData()} disabled={loading}>
              <span className="inline-flex items-center gap-2">
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.2} />
                Refresh
              </span>
            </LiquidButton>
            <LiquidButton gold onClick={() => void handleLogout()}>
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.2} />
                Logout
              </span>
            </LiquidButton>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Orders This Month",
              value: stats?.orders_this_month || 0,
              icon: ChartNoAxesCombined,
            },
            {
              label: "Revenue This Month",
              value: `$${(stats?.revenue_this_month || 0).toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Active Tickets",
              value: stats?.active_tickets || 0,
              icon: Ticket,
            },
            {
              label: "Published Events",
              value: stats?.published_events || 0,
              icon: Shield,
            },
          ].map((item) => (
            <GlassCard key={item.label} gold className="px-5 py-5">
              <item.icon className="mb-4 h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="font-serif text-[2rem] font-light tracking-[0.05em] text-[var(--gold)]">
                {item.value}
              </p>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="px-6 py-6">
          <p className="eyebrow mb-4">Revenue Timeline</p>
          <div className="space-y-4">
            {(analytics?.monthly_revenue || []).map((entry) => (
              <div key={entry.month} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="body-copy text-white/70">{entry.month}</p>
                  <p className="body-copy text-white/70">${entry.revenue.toLocaleString()}</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(198,169,98,0.65),rgba(198,169,98,0.22))]"
                    style={{ width: `${Math.max((entry.revenue / maxRevenue) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="px-6 py-6">
          <p className="eyebrow mb-4">Top Events</p>
          <div className="space-y-4">
            {(analytics?.top_events || []).slice(0, 4).map((event) => (
              <div key={event.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="font-serif text-[1.6rem] font-light tracking-[0.05em] text-white">
                  {event.title}
                </p>
                <p className="body-copy mt-3 text-white/68">
                  {format(new Date(event.event_date), "MMMM d, yyyy")}
                </p>
                <div className="mt-4 flex flex-wrap gap-5">
                  <p className="eyebrow text-white/28">
                    Revenue ${event.revenue.toLocaleString()}
                  </p>
                  <p className="eyebrow text-white/28">
                    Attendance {event.attendees || 0}
                    {event.max_capacity ? ` / ${event.max_capacity}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <GlassCard className="px-6 py-6">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow">Recent Users</p>
          </div>
          <div className="mt-5 space-y-4">
            {users.map((user) => (
              <div key={user.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="font-serif text-[1.5rem] font-light tracking-[0.05em] text-white">
                  {user.full_name || "Unnamed User"}
                </p>
                <p className="body-copy mt-3 text-white/68">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <p className="eyebrow text-white/28">{user.role}</p>
                  <p className="eyebrow text-white/28">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="px-6 py-6">
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow">Recent Orders</p>
          </div>
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-[1.45rem] font-light tracking-[0.05em] text-white">
                      {order.order_number}
                    </p>
                    <p className="body-copy mt-2 text-white/68">{order.customer_name}</p>
                  </div>
                  <span className="liquid-button-ghost px-4 py-2 !text-[9px]">{order.status}</span>
                </div>
                <p className="body-copy mt-4 text-white/68">
                  {order.events?.title || order.customer_email}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <p className="eyebrow text-white/28">
                    ${order.total.toLocaleString()}
                  </p>
                  <p className="eyebrow text-white/28">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="px-6 py-6">
          <p className="eyebrow">Subscribers & Enquiries</p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                Subscribers
              </p>
              <div className="mt-4 space-y-3">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-3">
                    <p className="body-copy text-white/68">{subscription.email}</p>
                    <p className="eyebrow mt-2 text-white/28">
                      {format(new Date(subscription.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="subtle-divider h-px" />

            <div>
              <p className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                New Enquiries
              </p>
              <div className="mt-4 space-y-3">
                {enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-3">
                    <p className="body-copy text-white/68">{enquiry.name}</p>
                    <p className="body-copy text-[0.8rem] text-white/50">{enquiry.email}</p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <p className="eyebrow text-white/28">{enquiry.status}</p>
                      <p className="eyebrow text-white/28">
                        {enquiry.event_type || "General"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
