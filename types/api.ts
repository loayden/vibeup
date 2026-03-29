export type ApiErrorResponse = {
  error: string;
  details?: unknown;
};

export type TicketSelectionItem = {
  ticket_type_id: string;
  quantity: number;
};

export type CreateOrderRequest = {
  event_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  items: TicketSelectionItem[];
  promo_code?: string | null;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export type AdminDashboardStats = {
  orders_this_month: number;
  active_tickets: number;
  new_enquiries: number;
  total_subscribers: number;
  revenue_this_month: number;
};
