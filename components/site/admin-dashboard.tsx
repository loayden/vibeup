"use client";

import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowRight,
  ChartNoAxesCombined,
  DollarSign,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Shield,
  ShoppingBag,
  Ticket,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { GlassCard, LiquidButton } from "@/components/site/liquid";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean | null;
  marketing_opt_in: boolean | null;
  auth_user?: {
    phone: string | null;
    created_at: string | null;
    updated_at: string | null;
    last_sign_in_at: string | null;
    email_confirmed_at: string | null;
    user_metadata: Record<string, unknown>;
    app_metadata: Record<string, unknown>;
    providers: string[];
  } | null;
};

type Order = {
  id: string;
  order_number: string;
  user_id?: string | null;
  event_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  status: string;
  total: number;
  subtotal?: number;
  discount_amount?: number;
  fee_amount?: number;
  currency?: string;
  promo_code?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  events?: {
    id?: string;
    title: string;
    event_date: string;
  } | null;
  order_items?: Array<{
    id: string;
    ticket_type_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  tickets?: Array<{
    id: string;
    ticket_number: string;
    status: string;
    ticket_type_name?: string;
    holder_name?: string | null;
    holder_email?: string | null;
    created_at?: string;
  }>;
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

type ReservationSummary = {
  id: string;
  email: string;
  full_name: string | null;
  ticket_type: string;
  ticket_id: string | null;
  quantity: number;
  promo: string | null;
  status: string;
  created_at: string;
};

type ReservationDetail = {
  reservation: ReservationSummary;
  linked_user: Profile | null;
  related_orders: Order[];
  related_reservations: ReservationSummary[];
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

type HealthCheck = {
  key: string;
  label: string;
  status: "healthy" | "degraded" | "offline";
  detail: string;
};

type AdminListResponse<T> = {
  degraded?: boolean;
  degraded_message?: string | null;
  source?: string;
} & T;

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

function formatDateValue(value?: string | null, fallback = "Unavailable") {
  if (!value) {
    return fallback;
  }

  try {
    return format(new Date(value), "MMMM d, yyyy 'at' p");
  } catch {
    return fallback;
  }
}

function formatCurrencyValue(value?: number, currency = "USD") {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function hasObjectEntries(value: Record<string, unknown> | null | undefined) {
  return Boolean(value && Object.keys(value).length);
}

function matchesDashboardSearch(
  query: string,
  values: Array<string | null | undefined>,
) {
  if (!query.trim()) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(normalized));
}

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
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);
  const [reservationDetail, setReservationDetail] = useState<ReservationDetail | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [dashboardSearch, setDashboardSearch] = useState("");

  // ✅ Track in-flight requests to prevent setState on unmounted components
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadDashboardAbortRef = useRef<AbortController | null>(null);

  async function fetchAdminJson<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, {
      credentials: "include",
      signal,
    });
    const payload = (await response.json().catch(() => null)) as
      | (T & { error?: string; message?: string })
      | null;

    if (!response.ok) {
      throw new Error(
        payload?.error || payload?.message || `Unable to load ${url}.`,
      );
    }

    if (!payload) {
      throw new Error(`Empty response returned by ${url}.`);
    }

    return payload;
  }

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setBanner(null);

    // ✅ Cancel previous dashboard load if still in-flight
    loadDashboardAbortRef.current?.abort();
    loadDashboardAbortRef.current = new AbortController();
    const signal = loadDashboardAbortRef.current.signal;

    try {
      // ✅ Use Promise.allSettled for partial failure handling
      const responses = await Promise.allSettled([
        fetchAdminJson<{
          stats: DashboardStats;
          health?: HealthCheck[];
          degraded?: boolean;
          degraded_message?: string | null;
        }>("/api/admin/dashboard", signal),
        fetchAdminJson<AnalyticsPayload>("/api/admin/analytics", signal),
        fetchAdminJson<{ orders?: Order[] }>("/api/admin/orders", signal),
        fetchAdminJson<{ subscriptions?: Subscription[] }>("/api/admin/subscriptions", signal),
        fetchAdminJson<{ enquiries?: Enquiry[] }>("/api/admin/enquiries", signal),
        fetchAdminJson<AdminListResponse<{ users?: Profile[] }>>("/api/admin/users", signal),
        fetchAdminJson<AdminListResponse<{ reservations?: ReservationSummary[] }>>(
          "/api/admin/reservations",
          signal,
        ),
      ]);

      // ✅ Check if request was cancelled
      if (signal.aborted) return;

      // ✅ Extract results with fallbacks for failures
      const [
        statsResult,
        analyticsResult,
        ordersResult,
        subscriptionsResult,
        enquiriesResult,
        usersResult,
        reservationsResult,
      ] = responses;
      const degradedMessages: string[] = [];

      // ✅ Set each piece of state independently
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value.stats);
        setHealthChecks(statsResult.value.health || []);
        if (statsResult.value.degraded_message) {
          degradedMessages.push(statsResult.value.degraded_message);
        }
      }
      if (analyticsResult.status === "fulfilled") {
        setAnalytics(analyticsResult.value);
      }
      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value.orders || []);
      }
      if (subscriptionsResult.status === "fulfilled") {
        setSubscriptions(subscriptionsResult.value.subscriptions || []);
      }
      if (enquiriesResult.status === "fulfilled") {
        setEnquiries(enquiriesResult.value.enquiries || []);
      }
      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value.users || []);
        if (usersResult.value.degraded_message) {
          degradedMessages.push(usersResult.value.degraded_message);
        }
      }
      if (reservationsResult.status === "fulfilled") {
        setReservations(reservationsResult.value.reservations || []);
        if (reservationsResult.value.degraded_message) {
          degradedMessages.push(reservationsResult.value.degraded_message);
        }
      }

      // ✅ Show warning if some endpoints failed
      const failedFetches = responses.filter((r) => r.status === "rejected");
      if (failedFetches.length > 0 || degradedMessages.length > 0) {
        setBanner({
          type: "info",
          message:
            degradedMessages[0] ||
            `Some dashboard data is unavailable (${failedFetches.length}/${responses.length} sections offline). Showing available data.`,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return; // ✅ Request cancelled, don't setState
      }
      if (!signal.aborted) {
        setBanner({
          type: "error",
          message:
            error instanceof Error ? error.message : "Unable to load dashboard data.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  async function checkAuth() {
    // ✅ Cancel previous auth check
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        signal,
      });

      if (signal.aborted) return;

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
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      setAuthStatus("unauthenticated");
    }
  }

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      loadDashboardAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    void checkAuth();
  }, []);

  useEffect(() => {
    if (authStatus === "ready") {
      void loadDashboardData();
    }
  }, [authStatus, loadDashboardData]);

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

      let errorMessage = "Invalid login credentials.";

      if (!response.ok) {
        try {
          // ✅ Proper error message extraction
          const payload = (await response.json()) as { error?: string; message?: string };
          errorMessage = payload?.error || payload?.message || errorMessage;
        } catch {
          // ✅ Handle parse errors properly
          console.error("Response parse error", {
            status: response.status,
            statusText: response.statusText,
          });

          if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (response.status === 429) {
            errorMessage = "Too many login attempts. Please wait before trying again.";
          }
        }

        setBanner({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      setBanner({
        type: "success",
        message: "Session confirmed. Loading dashboard.",
      });
      await checkAuth();
    } catch (error) {
      console.error("Login error", error);
      setBanner({
        type: "error",
        message:
          error instanceof Error && error.name === "AbortError"
            ? "Request cancelled."
            : "Unable to connect to server.",
      });
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
    setReservations([]);
    setHealthChecks([]);
    setActiveReservationId(null);
    setReservationDetail(null);
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
  const filteredUsers = users.filter((user) =>
    matchesDashboardSearch(dashboardSearch, [
      user.full_name,
      user.email,
      user.phone,
      user.role,
    ]),
  );
  const filteredOrders = orders.filter((order) =>
    matchesDashboardSearch(dashboardSearch, [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.events?.title,
      order.status,
    ]),
  );
  const filteredReservations = reservations.filter((reservation) =>
    matchesDashboardSearch(dashboardSearch, [
      reservation.full_name,
      reservation.email,
      reservation.ticket_type,
      reservation.ticket_id,
      reservation.status,
      reservation.promo,
    ]),
  );
  const filteredSubscriptions = subscriptions.filter((subscription) =>
    matchesDashboardSearch(dashboardSearch, [
      subscription.email,
      subscription.name,
      subscription.status,
    ]),
  );
  const filteredEnquiries = enquiries.filter((enquiry) =>
    matchesDashboardSearch(dashboardSearch, [
      enquiry.name,
      enquiry.email,
      enquiry.status,
      enquiry.event_type,
    ]),
  );

  async function openReservationDetails(reservationId: string) {
    setActiveReservationId(reservationId);
    setReservationLoading(true);
    setBanner(null);

    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        credentials: "include",
      });

      const payload = (await response.json().catch(() => null)) as
        | ReservationDetail
        | { error?: string }
        | null;

      if (!response.ok || !payload || !("reservation" in payload)) {
        throw new Error(
          (payload && "error" in payload && payload.error) ||
            "Unable to load reservation details.",
        );
      }

      setReservationDetail(payload);
    } catch (error) {
      setReservationDetail(null);
      setBanner({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load reservation details.",
      });
    } finally {
      setReservationLoading(false);
    }
  }

  function closeReservationDetails() {
    setActiveReservationId(null);
    setReservationDetail(null);
    setReservationLoading(false);
  }

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
                inputMode="email"
                autoComplete="email"
                style={{ fontSize: "16px" }}
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
                autoComplete="current-password"
                style={{ fontSize: "16px" }}
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
              <div className="flex justify-end">
                <LiquidButton gold type="submit" className="w-full justify-center sm:w-auto" disabled={loggingIn}>
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

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap">
            <div className="relative min-w-[280px] flex-1 lg:min-w-[320px]">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold)]"
                strokeWidth={1.2}
              />
              <input
                className="glass-input pl-11"
                placeholder="Search users, orders, reservations, subscribers, or enquiries"
                value={dashboardSearch}
                onChange={(event) => setDashboardSearch(event.target.value)}
              />
            </div>
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

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Profiles", value: users.length },
            { label: "Reservations", value: reservations.length },
            { label: "Subscribers", value: subscriptions.length },
            { label: "Enquiries", value: enquiries.length },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
            >
              <p className="eyebrow mb-2">{item.label}</p>
              <p className="font-serif text-[1.7rem] font-light tracking-[0.05em] text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {healthChecks.length ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {healthChecks.map((item) => (
              <div
                key={item.key}
                className="rounded-[18px] border px-4 py-4"
                style={{
                  borderColor:
                    item.status === "healthy"
                      ? "rgba(52,211,153,0.18)"
                      : item.status === "offline"
                        ? "rgba(255,80,80,0.18)"
                        : "rgba(198,169,98,0.18)",
                  background:
                    item.status === "healthy"
                      ? "rgba(52,211,153,0.05)"
                      : item.status === "offline"
                        ? "rgba(255,60,60,0.05)"
                        : "rgba(198,169,98,0.06)",
                }}
              >
                <p className="eyebrow mb-2">{item.label}</p>
                <p
                  className="eyebrow mb-3"
                  style={{
                    color:
                      item.status === "healthy"
                        ? "rgba(110,231,183,0.92)"
                        : item.status === "offline"
                          ? "rgba(255,140,140,0.88)"
                          : "rgba(198,169,98,0.88)",
                  }}
                >
                  {item.status}
                </p>
                <p className="body-copy text-[0.78rem] text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
        ) : null}
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

      <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
        <GlassCard className="px-6 py-6">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow">Recent Users</p>
            <span className="eyebrow text-white/18">{filteredUsers.length}</span>
          </div>
          <div className="mt-5 space-y-4">
            {filteredUsers.length ? filteredUsers.map((user) => (
              <div key={user.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="font-serif text-[1.5rem] font-light tracking-[0.05em] text-white">
                  {user.full_name || "Unnamed User"}
                </p>
                <p className="body-copy mt-3 text-white/68">{user.email}</p>
                <p className="body-copy mt-2 text-white/52">{user.phone || "No phone on file"}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <p className="eyebrow text-white/28">{user.role}</p>
                  <p className="eyebrow text-white/28">
                    {user.email_verified ? "Email Verified" : "Email Pending"}
                  </p>
                  <p className="eyebrow text-white/28">
                    {user.marketing_opt_in ? "Marketing Opt-In" : "No Marketing"}
                  </p>
                  <p className="eyebrow text-white/28">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            )) : (
              <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="body-copy text-white/62">No user profiles match the current search.</p>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="px-6 py-6">
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow">Recent Orders</p>
            <span className="eyebrow text-white/18">{filteredOrders.length}</span>
          </div>
          <div className="mt-5 space-y-4">
            {filteredOrders.length ? filteredOrders.map((order) => (
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
            )) : (
              <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="body-copy text-white/62">No orders match the current search.</p>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="px-6 py-6">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
            <p className="eyebrow">Reserve Selections</p>
            <span className="eyebrow text-white/18">{filteredReservations.length}</span>
          </div>
          <div className="mt-5 space-y-4">
            {filteredReservations.length ? (
              filteredReservations.map((reservation) => (
                <button
                  key={reservation.id}
                  type="button"
                  onClick={() => void openReservationDetails(reservation.id)}
                  className="w-full rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4 text-left transition-all duration-300 hover:border-[rgba(198,169,98,0.24)] hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-[1.45rem] font-light tracking-[0.05em] text-white">
                        {reservation.full_name || "Guest Reservation"}
                      </p>
                      <p className="body-copy mt-2 text-white/68">{reservation.email}</p>
                    </div>
                    <span className="liquid-button-ghost px-4 py-2 !text-[9px]">
                      {reservation.status}
                    </span>
                  </div>
                  <p className="body-copy mt-4 text-white/68">{reservation.ticket_type}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <p className="eyebrow text-white/28">
                      Qty {reservation.quantity}
                    </p>
                    <p className="eyebrow text-white/28">
                      {format(new Date(reservation.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="body-copy text-white/62">
                  {dashboardSearch
                    ? "No reservation selections match the current search."
                    : "No reservation selections have been captured yet."}
                </p>
              </div>
            )}
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
                {filteredSubscriptions.length ? filteredSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-3">
                    <p className="body-copy text-white/68">{subscription.email}</p>
                    <p className="eyebrow mt-2 text-white/28">
                      {format(new Date(subscription.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                )) : (
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="body-copy text-white/62">No subscribers match the current search.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="subtle-divider h-px" />

            <div>
              <p className="font-serif text-[1.8rem] font-light tracking-[0.05em] text-white">
                New Enquiries
              </p>
              <div className="mt-4 space-y-3">
                {filteredEnquiries.length ? filteredEnquiries.map((enquiry) => (
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
                )) : (
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="body-copy text-white/62">No enquiries match the current search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {activeReservationId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex justify-end bg-black/55 px-4 py-4 backdrop-blur-md"
            onClick={closeReservationDetails}
          >
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 48 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <GlassCard dark className="flex h-full flex-col overflow-hidden px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow mb-3">Reservation Detail</p>
                    <h3 className="section-title text-[2rem]">
                      Reserve selection <em>context</em>
                    </h3>
                    <p className="body-copy mt-4 max-w-xl">
                      Review the captured reservation, the matched VibeUp user profile, and every
                      order we can link by customer email.
                    </p>
                  </div>
                  <LiquidButton
                    className="!px-4 !py-3"
                    onClick={closeReservationDetails}
                  >
                    <span className="inline-flex items-center gap-2">
                      <X className="h-3.5 w-3.5" strokeWidth={1.2} />
                      Close
                    </span>
                  </LiquidButton>
                </div>

                <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
                  {reservationLoading ? (
                    <GlassCard warm className="px-5 py-5">
                      <p className="eyebrow mb-3">Loading</p>
                      <p className="body-copy">Pulling the linked user and order history now.</p>
                    </GlassCard>
                  ) : reservationDetail ? (
                    <>
                      <GlassCard warm className="px-5 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-serif text-[1.95rem] font-light tracking-[0.05em] text-white">
                              {reservationDetail.reservation.full_name || "Guest Reservation"}
                            </p>
                            <p className="body-copy mt-3 text-white/68">
                              {reservationDetail.reservation.email}
                            </p>
                          </div>
                          <span className="liquid-button-gold px-4 py-2 !text-[9px]">
                            {reservationDetail.reservation.status}
                          </span>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                            <p className="eyebrow mb-2">Selection</p>
                            <p className="body-copy text-white/68">
                              {reservationDetail.reservation.ticket_type}
                            </p>
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                            <p className="eyebrow mb-2">Quantity</p>
                            <p className="body-copy text-white/68">
                              {reservationDetail.reservation.quantity}
                            </p>
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                            <p className="eyebrow mb-2">Promo</p>
                            <p className="body-copy text-white/68">
                              {reservationDetail.reservation.promo || "No promo"}
                            </p>
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                            <p className="eyebrow mb-2">Captured</p>
                            <p className="body-copy text-white/68">
                              {format(
                                new Date(reservationDetail.reservation.created_at),
                                "MMMM d, yyyy 'at' p",
                              )}
                            </p>
                          </div>
                        </div>
                      </GlassCard>

                      <GlassCard className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <Users className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                          <p className="eyebrow">Linked User</p>
                        </div>
                        {reservationDetail.linked_user ? (
                          <div className="mt-5 space-y-4">
                            <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                              <p className="font-serif text-[1.6rem] font-light tracking-[0.05em] text-white">
                                {reservationDetail.linked_user.full_name || "VibeUp User"}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-4">
                                <p className="eyebrow text-white/28">
                                  {reservationDetail.linked_user.role}
                                </p>
                                <p className="eyebrow text-white/28">
                                  {reservationDetail.linked_user.email_verified
                                    ? "Email verified"
                                    : "Email unverified"}
                                </p>
                                <p className="eyebrow text-white/28">
                                  {reservationDetail.linked_user.marketing_opt_in
                                    ? "Marketing opt-in"
                                    : "Marketing opt-out"}
                                </p>
                              </div>
                              <div className="mt-5 grid gap-3 md:grid-cols-2">
                                <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                  <p className="eyebrow mb-2">Email</p>
                                  <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                                    <p className="body-copy text-white/68">
                                      {reservationDetail.linked_user.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                  <p className="eyebrow mb-2">Phone</p>
                                  <p className="body-copy text-white/68">
                                    {reservationDetail.linked_user.phone ||
                                      reservationDetail.linked_user.auth_user?.phone ||
                                      "Unavailable"}
                                  </p>
                                </div>
                                <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                  <p className="eyebrow mb-2">Profile Created</p>
                                  <p className="body-copy text-white/68">
                                    {formatDateValue(reservationDetail.linked_user.created_at)}
                                  </p>
                                </div>
                                <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                  <p className="eyebrow mb-2">Profile Updated</p>
                                  <p className="body-copy text-white/68">
                                    {formatDateValue(reservationDetail.linked_user.updated_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-5 rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                <p className="eyebrow mb-3">Profile Id</p>
                                <p className="body-copy break-all text-white/68">
                                  {reservationDetail.linked_user.id}
                                </p>
                              </div>
                              {reservationDetail.linked_user.auth_user ? (
                                <div className="mt-5 space-y-3">
                                  <p className="eyebrow text-white/28">Auth Account Snapshot</p>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-2">Email Confirmed</p>
                                      <p className="body-copy text-white/68">
                                        {formatDateValue(
                                          reservationDetail.linked_user.auth_user.email_confirmed_at,
                                          "Not confirmed",
                                        )}
                                      </p>
                                    </div>
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-2">Last Sign In</p>
                                      <p className="body-copy text-white/68">
                                        {formatDateValue(
                                          reservationDetail.linked_user.auth_user.last_sign_in_at,
                                          "No sign-in recorded",
                                        )}
                                      </p>
                                    </div>
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-2">Auth Created</p>
                                      <p className="body-copy text-white/68">
                                        {formatDateValue(
                                          reservationDetail.linked_user.auth_user.created_at,
                                        )}
                                      </p>
                                    </div>
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-2">Providers</p>
                                      <p className="body-copy text-white/68">
                                        {reservationDetail.linked_user.auth_user.providers.length
                                          ? reservationDetail.linked_user.auth_user.providers.join(", ")
                                          : "Email"}
                                      </p>
                                    </div>
                                  </div>

                                  {hasObjectEntries(
                                    reservationDetail.linked_user.auth_user.user_metadata,
                                  ) ? (
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-3">User Metadata</p>
                                      <pre className="body-copy overflow-x-auto whitespace-pre-wrap break-all text-white/62">
                                        {JSON.stringify(
                                          reservationDetail.linked_user.auth_user.user_metadata,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  ) : null}

                                  {hasObjectEntries(
                                    reservationDetail.linked_user.auth_user.app_metadata,
                                  ) ? (
                                    <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                      <p className="eyebrow mb-3">App Metadata</p>
                                      <pre className="body-copy overflow-x-auto whitespace-pre-wrap break-all text-white/62">
                                        {JSON.stringify(
                                          reservationDetail.linked_user.auth_user.app_metadata,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-5 rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                            <p className="body-copy text-white/62">
                              No matching profile or authenticated user was found for this reservation email.
                            </p>
                          </div>
                        )}
                      </GlassCard>

                      <GlassCard className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                          <p className="eyebrow">Linked Orders</p>
                        </div>
                        <div className="mt-5 space-y-4">
                          {reservationDetail.related_orders.length ? (
                            reservationDetail.related_orders.map((order) => (
                              <div
                                key={order.id}
                                className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <p className="font-serif text-[1.45rem] font-light tracking-[0.05em] text-white">
                                      {order.order_number}
                                    </p>
                                    <p className="body-copy mt-2 text-white/68">
                                      {order.customer_name}
                                    </p>
                                  </div>
                                  <span className="liquid-button-ghost px-4 py-2 !text-[9px]">
                                    {order.status}
                                  </span>
                                </div>
                                <p className="body-copy mt-4 text-white/68">
                                  {order.events?.title || order.customer_email}
                                </p>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Customer Email</p>
                                    <p className="body-copy text-white/68">{order.customer_email}</p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Customer Phone</p>
                                    <p className="body-copy text-white/68">
                                      {order.customer_phone || "Unavailable"}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Created</p>
                                    <p className="body-copy text-white/68">
                                      {formatDateValue(order.created_at)}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Payment Method</p>
                                    <p className="body-copy text-white/68">
                                      {order.payment_method || "Awaiting confirmation"}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Subtotal</p>
                                    <p className="body-copy text-white/68">
                                      {formatCurrencyValue(order.subtotal, order.currency)}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Discount</p>
                                    <p className="body-copy text-white/68">
                                      {formatCurrencyValue(order.discount_amount, order.currency)}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Fees</p>
                                    <p className="body-copy text-white/68">
                                      {formatCurrencyValue(order.fee_amount, order.currency)}
                                    </p>
                                  </div>
                                  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Total</p>
                                    <p className="body-copy text-white/68">
                                      {formatCurrencyValue(order.total, order.currency)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-4">
                                  <p className="eyebrow text-white/28">
                                    Promo {order.promo_code || "None"}
                                  </p>
                                  <p className="eyebrow text-white/28">
                                    User {order.user_id || "Guest checkout"}
                                  </p>
                                  <p className="eyebrow text-white/28">
                                    Event {order.event_id || order.events?.id || "Unavailable"}
                                  </p>
                                </div>
                                {order.notes ? (
                                  <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-2">Order Notes</p>
                                    <p className="body-copy text-white/68">{order.notes}</p>
                                  </div>
                                ) : null}
                                {order.order_items?.length ? (
                                  <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-3">Order Items</p>
                                    <div className="space-y-3">
                                      {order.order_items.map((item) => (
                                        <div
                                          key={item.id}
                                          className="rounded-[14px] border border-white/8 bg-black/10 px-4 py-3"
                                        >
                                          <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                              <p className="body-copy text-white/70">
                                                {item.ticket_type_name}
                                              </p>
                                              <p className="eyebrow mt-2 text-white/28">
                                                Qty {item.quantity}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="body-copy text-white/70">
                                                {formatCurrencyValue(item.total_price, order.currency)}
                                              </p>
                                              <p className="eyebrow mt-2 text-white/28">
                                                Each {formatCurrencyValue(item.unit_price, order.currency)}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                                {order.tickets?.length ? (
                                  <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-3">Issued Tickets</p>
                                    <div className="space-y-3">
                                      {order.tickets.map((ticket) => (
                                        <div
                                          key={ticket.id}
                                          className="rounded-[14px] border border-white/8 bg-black/10 px-4 py-3"
                                        >
                                          <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                              <p className="body-copy break-all text-white/70">
                                                {ticket.ticket_number}
                                              </p>
                                              <p className="eyebrow mt-2 text-white/28">
                                                {ticket.ticket_type_name || "Ticket"}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="eyebrow text-white/28">{ticket.status}</p>
                                              <p className="body-copy mt-2 text-white/62">
                                                {ticket.holder_name || ticket.holder_email || "Guest holder"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                                {hasObjectEntries(order.metadata) ? (
                                  <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
                                    <p className="eyebrow mb-3">Order Metadata</p>
                                    <pre className="body-copy overflow-x-auto whitespace-pre-wrap break-all text-white/62">
                                      {JSON.stringify(order.metadata, null, 2)}
                                    </pre>
                                  </div>
                                ) : null}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                              <p className="body-copy text-white/62">
                                No orders are linked to this email yet. Reservations can exist before payment is completed.
                              </p>
                            </div>
                          )}
                        </div>
                      </GlassCard>

                      <GlassCard className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <Ticket className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                          <p className="eyebrow">Other Reservations</p>
                        </div>
                        <div className="mt-5 space-y-3">
                          {reservationDetail.related_reservations.length ? (
                            reservationDetail.related_reservations.map((reservation) => (
                              <div
                                key={reservation.id}
                                className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <p className="body-copy text-white/68">
                                      {reservation.ticket_type}
                                    </p>
                                    <p className="eyebrow mt-3 text-white/28">
                                      Qty {reservation.quantity}
                                    </p>
                                  </div>
                                  <span className="liquid-button-ghost px-4 py-2 !text-[9px]">
                                    {reservation.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
                              <p className="body-copy text-white/62">
                                No additional reservation selections were found for this email.
                              </p>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </>
                  ) : (
                    <GlassCard warm className="px-5 py-5">
                      <p className="eyebrow mb-3">Unavailable</p>
                      <p className="body-copy">
                        Reservation details could not be loaded for the selected row.
                      </p>
                    </GlassCard>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
