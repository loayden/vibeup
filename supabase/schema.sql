create extension if not exists pgcrypto;

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique not null,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'staff', 'admin', 'super_admin')),
  email_verified boolean default false,
  marketing_opt_in boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
for select using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  short_description text,
  venue_name text not null,
  venue_address text,
  venue_city text default 'Los Angeles',
  venue_state text default 'CA',
  venue_country text default 'US',
  venue_lat numeric,
  venue_lng numeric,
  event_date timestamptz not null,
  doors_open timestamptz,
  event_end timestamptz,
  cover_image_url text,
  gallery_urls text[] default '{}',
  video_url text,
  category text check (category in ('gala', 'concert', 'cultural', 'corporate', 'private', 'festival', 'rooftop', 'other')),
  status text default 'draft' check (status in ('draft', 'published', 'sold_out', 'cancelled', 'completed')),
  featured boolean default false,
  max_capacity integer,
  current_attendees integer default 0,
  age_restriction integer default 0,
  dress_code text,
  parking_info text,
  additional_info text,
  seo_title text,
  seo_description text,
  external_ticket_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Published events are public" on public.events
for select using (status = 'published');

create policy "Admins can manage events" on public.events
for all using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

create table if not exists public.ticket_types (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  currency text default 'USD',
  color text,
  badge text,
  max_quantity integer,
  sold_quantity integer default 0,
  min_per_order integer default 1,
  max_per_order integer default 10,
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  includes text[] default '{}',
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.ticket_types enable row level security;

create policy "Ticket types are public" on public.ticket_types
for select using (is_visible = true);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references public.profiles(id),
  event_id uuid references public.events(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded', 'partially_refunded')),
  subtotal numeric(10, 2) not null,
  discount_amount numeric(10, 2) default 0,
  fee_amount numeric(10, 2) default 0,
  total numeric(10, 2) not null,
  currency text default 'USD',
  promo_code text,
  stripe_payment_intent_id text,
  stripe_session_id text,
  payment_method text,
  notes text,
  refund_reason text,
  refunded_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders" on public.orders
for select using (
  auth.uid() = user_id
  or customer_email = (
    select email
    from public.profiles
    where id = auth.uid()
  )
);

create policy "Admins can manage orders" on public.orders
for all using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  ticket_type_id uuid references public.ticket_types(id),
  ticket_type_name text not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items" on public.order_items
for select using (
  exists (
    select 1
    from public.orders
    where id = order_id and user_id = auth.uid()
  )
);

create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  ticket_number text unique not null,
  order_id uuid references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id),
  event_id uuid references public.events(id),
  ticket_type_id uuid references public.ticket_types(id),
  ticket_type_name text not null,
  holder_name text,
  holder_email text,
  qr_code text,
  qr_code_url text,
  status text default 'valid' check (status in ('valid', 'used', 'cancelled', 'refunded')),
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(id),
  seat_number text,
  table_number text,
  created_at timestamptz default now()
);

alter table public.tickets enable row level security;

create policy "Users can view own tickets" on public.tickets
for select using (
  holder_email = (
    select email
    from public.profiles
    where id = auth.uid()
  )
  or exists (
    select 1
    from public.orders
    where id = order_id and user_id = auth.uid()
  )
);

create policy "Admins can manage tickets" on public.tickets
for all using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('staff', 'admin', 'super_admin')
  )
);

create table if not exists public.promo_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 2) not null,
  min_order_amount numeric(10, 2) default 0,
  max_uses integer,
  used_count integer default 0,
  applicable_event_ids uuid[] default '{}',
  applicable_ticket_type_ids uuid[] default '{}',
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promo_codes enable row level security;

create policy "Anyone can validate promo codes" on public.promo_codes
for select using (is_active = true);

create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  source text default 'website',
  tags text[] default '{}',
  status text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  event_type text,
  guest_count text,
  event_date date,
  budget text,
  message text not null,
  status text default 'new' check (status in ('new', 'in_review', 'quoted', 'booked', 'closed', 'spam')),
  assigned_to uuid references public.profiles(id),
  notes text,
  source text default 'website',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.enquiries enable row level security;

create policy "Admins can manage enquiries" on public.enquiries
for all using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('staff', 'admin', 'super_admin')
  )
);

create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  quote text not null,
  author_name text not null,
  author_role text,
  author_company text,
  author_image_url text,
  event_id uuid references public.events(id),
  event_name text,
  rating integer check (rating between 1 and 5),
  approved boolean default false,
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

create policy "Approved testimonials are public" on public.testimonials
for select using (approved = true);

create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  role text not null,
  portfolio_url text,
  linkedin_url text,
  message text,
  resume_url text,
  status text default 'new' check (status in ('new', 'reviewing', 'interview', 'offered', 'rejected')),
  created_at timestamptz default now()
);

create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists public.reservations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  full_name text,
  ticket_type text,
  ticket_id text,
  quantity integer default 1,
  promo text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_event_date on public.events(event_date);
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_orders_email on public.orders(customer_email);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_stripe on public.orders(stripe_payment_intent_id);
create index if not exists idx_tickets_number on public.tickets(ticket_number);
create index if not exists idx_tickets_order on public.tickets(order_id);
create index if not exists idx_subscriptions_email on public.subscriptions(email);
create index if not exists idx_enquiries_status on public.enquiries(status);

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
for each row execute function public.update_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
for each row execute function public.update_updated_at();

drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at before update on public.enquiries
for each row execute function public.update_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.generate_order_number()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := 'VU-';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

create or replace function public.generate_ticket_number()
returns text as $$
begin
  return 'TKT-' || upper(replace(gen_random_uuid()::text, '-', ''));
end;
$$ language plpgsql;

create or replace function public.update_event_attendees()
returns trigger as $$
begin
  if new.status = 'paid' and old.status != 'paid' then
    update public.events
    set current_attendees = current_attendees + (
      select coalesce(sum(quantity), 0)
      from public.order_items
      where order_id = new.id
    )
    where id = new.event_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists order_paid_update_attendees on public.orders;
create trigger order_paid_update_attendees
after update on public.orders
for each row execute function public.update_event_attendees();
