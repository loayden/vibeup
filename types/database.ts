export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "staff" | "admin" | "super_admin";
          email_verified: boolean;
          marketing_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "staff" | "admin" | "super_admin";
          email_verified?: boolean;
          marketing_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "staff" | "admin" | "super_admin";
          email_verified?: boolean;
          marketing_opt_in?: boolean;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          short_description: string | null;
          venue_name: string;
          venue_address: string | null;
          venue_city: string | null;
          venue_state: string | null;
          venue_country: string | null;
          venue_lat: number | null;
          venue_lng: number | null;
          event_date: string;
          doors_open: string | null;
          event_end: string | null;
          cover_image_url: string | null;
          gallery_urls: string[];
          video_url: string | null;
          category:
            | "gala"
            | "concert"
            | "cultural"
            | "corporate"
            | "private"
            | "festival"
            | "rooftop"
            | "other"
            | null;
          status:
            | "draft"
            | "published"
            | "sold_out"
            | "cancelled"
            | "completed";
          featured: boolean;
          max_capacity: number | null;
          current_attendees: number;
          age_restriction: number;
          dress_code: string | null;
          parking_info: string | null;
          additional_info: string | null;
          seo_title: string | null;
          seo_description: string | null;
          external_ticket_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          short_description?: string | null;
          venue_name: string;
          venue_address?: string | null;
          venue_city?: string | null;
          venue_state?: string | null;
          venue_country?: string | null;
          venue_lat?: number | null;
          venue_lng?: number | null;
          event_date: string;
          doors_open?: string | null;
          event_end?: string | null;
          cover_image_url?: string | null;
          gallery_urls?: string[];
          video_url?: string | null;
          category?:
            | "gala"
            | "concert"
            | "cultural"
            | "corporate"
            | "private"
            | "festival"
            | "rooftop"
            | "other"
            | null;
          status?:
            | "draft"
            | "published"
            | "sold_out"
            | "cancelled"
            | "completed";
          featured?: boolean;
          max_capacity?: number | null;
          current_attendees?: number;
          age_restriction?: number;
          dress_code?: string | null;
          parking_info?: string | null;
          additional_info?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          external_ticket_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      ticket_types: {
        Row: {
          id: string;
          event_id: string | null;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          currency: string;
          color: string | null;
          badge: string | null;
          max_quantity: number | null;
          sold_quantity: number;
          min_per_order: number;
          max_per_order: number;
          sale_starts_at: string | null;
          sale_ends_at: string | null;
          includes: string[];
          is_visible: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          currency?: string;
          color?: string | null;
          badge?: string | null;
          max_quantity?: number | null;
          sold_quantity?: number;
          min_per_order?: number;
          max_per_order?: number;
          sale_starts_at?: string | null;
          sale_ends_at?: string | null;
          includes?: string[];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ticket_types"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          event_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          status:
            | "pending"
            | "paid"
            | "cancelled"
            | "refunded"
            | "partially_refunded";
          subtotal: number;
          discount_amount: number;
          fee_amount: number;
          total: number;
          currency: string;
          promo_code: string | null;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          payment_method: string | null;
          notes: string | null;
          refund_reason: string | null;
          refunded_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          event_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          status?:
            | "pending"
            | "paid"
            | "cancelled"
            | "refunded"
            | "partially_refunded";
          subtotal: number;
          discount_amount?: number;
          fee_amount?: number;
          total: number;
          currency?: string;
          promo_code?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          payment_method?: string | null;
          notes?: string | null;
          refund_reason?: string | null;
          refunded_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          ticket_type_id: string | null;
          ticket_type_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          ticket_type_id?: string | null;
          ticket_type_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      tickets: {
        Row: {
          id: string;
          ticket_number: string;
          order_id: string | null;
          order_item_id: string | null;
          event_id: string | null;
          ticket_type_id: string | null;
          ticket_type_name: string;
          holder_name: string | null;
          holder_email: string | null;
          qr_code: string | null;
          qr_code_url: string | null;
          status: "valid" | "used" | "cancelled" | "refunded";
          checked_in_at: string | null;
          checked_in_by: string | null;
          seat_number: string | null;
          table_number: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_number: string;
          order_id: string;
          order_item_id?: string | null;
          event_id: string;
          ticket_type_id?: string | null;
          ticket_type_name: string;
          holder_name?: string | null;
          holder_email?: string | null;
          qr_code?: string | null;
          qr_code_url?: string | null;
          status?: "valid" | "used" | "cancelled" | "refunded";
          checked_in_at?: string | null;
          checked_in_by?: string | null;
          seat_number?: string | null;
          table_number?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tickets"]["Insert"]>;
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: "percentage" | "fixed" | null;
          discount_value: number;
          min_order_amount: number;
          max_uses: number | null;
          used_count: number;
          applicable_event_ids: string[];
          applicable_ticket_type_ids: string[];
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type?: "percentage" | "fixed" | null;
          discount_value: number;
          min_order_amount?: number;
          max_uses?: number | null;
          used_count?: number;
          applicable_event_ids?: string[];
          applicable_ticket_type_ids?: string[];
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["promo_codes"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          source: string | null;
          tags: string[];
          status: "active" | "unsubscribed" | "bounced";
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          source?: string | null;
          tags?: string[];
          status?: "active" | "unsubscribed" | "bounced";
          unsubscribed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      reservations: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          ticket_type: string | null;
          ticket_id: string | null;
          quantity: number | null;
          promo: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          ticket_type?: string | null;
          ticket_id?: string | null;
          quantity?: number | null;
          promo?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          event_type: string | null;
          guest_count: string | null;
          event_date: string | null;
          budget: string | null;
          message: string;
          status:
            | "new"
            | "in_review"
            | "quoted"
            | "booked"
            | "closed"
            | "spam";
          assigned_to: string | null;
          notes: string | null;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          event_type?: string | null;
          guest_count?: string | null;
          event_date?: string | null;
          budget?: string | null;
          message: string;
          status?:
            | "new"
            | "in_review"
            | "quoted"
            | "booked"
            | "closed"
            | "spam";
          assigned_to?: string | null;
          notes?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_role: string | null;
          author_company: string | null;
          author_image_url: string | null;
          event_id: string | null;
          event_name: string | null;
          rating: number | null;
          approved: boolean;
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_role?: string | null;
          author_company?: string | null;
          author_image_url?: string | null;
          event_id?: string | null;
          event_name?: string | null;
          rating?: number | null;
          approved?: boolean;
          featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string;
          portfolio_url: string | null;
          linkedin_url: string | null;
          message: string | null;
          resume_url: string | null;
          status: "new" | "reviewing" | "interview" | "offered" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          role: string;
          portfolio_url?: string | null;
          linkedin_url?: string | null;
          message?: string | null;
          resume_url?: string | null;
          status?: "new" | "reviewing" | "interview" | "offered" | "rejected";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];
