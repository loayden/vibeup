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

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text default 'customer';
alter table public.profiles add column if not exists email_verified boolean default false;
alter table public.profiles add column if not exists marketing_opt_in boolean default true;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

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

alter table public.events add column if not exists slug text;
alter table public.events add column if not exists title text;
alter table public.events add column if not exists subtitle text;
alter table public.events add column if not exists description text;
alter table public.events add column if not exists short_description text;
alter table public.events add column if not exists venue_name text;
alter table public.events add column if not exists venue_address text;
alter table public.events add column if not exists venue_city text default 'Los Angeles';
alter table public.events add column if not exists venue_state text default 'CA';
alter table public.events add column if not exists venue_country text default 'US';
alter table public.events add column if not exists venue_lat numeric;
alter table public.events add column if not exists venue_lng numeric;
alter table public.events add column if not exists event_date timestamptz;
alter table public.events add column if not exists doors_open timestamptz;
alter table public.events add column if not exists event_end timestamptz;
alter table public.events add column if not exists cover_image_url text;
alter table public.events add column if not exists gallery_urls text[] default '{}';
alter table public.events add column if not exists video_url text;
alter table public.events add column if not exists category text;
alter table public.events add column if not exists status text default 'draft';
alter table public.events add column if not exists featured boolean default false;
alter table public.events add column if not exists max_capacity integer;
alter table public.events add column if not exists current_attendees integer default 0;
alter table public.events add column if not exists age_restriction integer default 0;
alter table public.events add column if not exists dress_code text;
alter table public.events add column if not exists parking_info text;
alter table public.events add column if not exists additional_info text;
alter table public.events add column if not exists seo_title text;
alter table public.events add column if not exists seo_description text;
alter table public.events add column if not exists external_ticket_url text;
alter table public.events add column if not exists created_by uuid references public.profiles(id);
alter table public.events add column if not exists created_at timestamptz default now();
alter table public.events add column if not exists updated_at timestamptz default now();

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

alter table public.ticket_types add column if not exists event_id uuid references public.events(id) on delete cascade;
alter table public.ticket_types add column if not exists name text;
alter table public.ticket_types add column if not exists description text;
alter table public.ticket_types add column if not exists price numeric(10, 2);
alter table public.ticket_types add column if not exists original_price numeric(10, 2);
alter table public.ticket_types add column if not exists currency text default 'USD';
alter table public.ticket_types add column if not exists color text;
alter table public.ticket_types add column if not exists badge text;
alter table public.ticket_types add column if not exists max_quantity integer;
alter table public.ticket_types add column if not exists sold_quantity integer default 0;
alter table public.ticket_types add column if not exists min_per_order integer default 1;
alter table public.ticket_types add column if not exists max_per_order integer default 10;
alter table public.ticket_types add column if not exists sale_starts_at timestamptz;
alter table public.ticket_types add column if not exists sale_ends_at timestamptz;
alter table public.ticket_types add column if not exists includes text[] default '{}';
alter table public.ticket_types add column if not exists is_visible boolean default true;
alter table public.ticket_types add column if not exists sort_order integer default 0;
alter table public.ticket_types add column if not exists created_at timestamptz default now();

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

alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists user_id uuid references public.profiles(id);
alter table public.orders add column if not exists event_id uuid references public.events(id);
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists status text default 'pending';
alter table public.orders add column if not exists subtotal numeric(10, 2);
alter table public.orders add column if not exists discount_amount numeric(10, 2) default 0;
alter table public.orders add column if not exists fee_amount numeric(10, 2) default 0;
alter table public.orders add column if not exists total numeric(10, 2);
alter table public.orders add column if not exists currency text default 'USD';
alter table public.orders add column if not exists promo_code text;
alter table public.orders add column if not exists stripe_payment_intent_id text;
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists refund_reason text;
alter table public.orders add column if not exists refunded_at timestamptz;
alter table public.orders add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.orders add column if not exists created_at timestamptz default now();
alter table public.orders add column if not exists updated_at timestamptz default now();

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

alter table public.order_items add column if not exists order_id uuid references public.orders(id) on delete cascade;
alter table public.order_items add column if not exists ticket_type_id uuid references public.ticket_types(id);
alter table public.order_items add column if not exists ticket_type_name text;
alter table public.order_items add column if not exists quantity integer;
alter table public.order_items add column if not exists unit_price numeric(10, 2);
alter table public.order_items add column if not exists total_price numeric(10, 2);
alter table public.order_items add column if not exists created_at timestamptz default now();

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

alter table public.tickets add column if not exists ticket_number text;
alter table public.tickets add column if not exists order_id uuid references public.orders(id) on delete cascade;
alter table public.tickets add column if not exists order_item_id uuid references public.order_items(id);
alter table public.tickets add column if not exists event_id uuid references public.events(id);
alter table public.tickets add column if not exists ticket_type_id uuid references public.ticket_types(id);
alter table public.tickets add column if not exists ticket_type_name text;
alter table public.tickets add column if not exists holder_name text;
alter table public.tickets add column if not exists holder_email text;
alter table public.tickets add column if not exists qr_code text;
alter table public.tickets add column if not exists qr_code_url text;
alter table public.tickets add column if not exists status text default 'valid';
alter table public.tickets add column if not exists checked_in_at timestamptz;
alter table public.tickets add column if not exists checked_in_by uuid references public.profiles(id);
alter table public.tickets add column if not exists seat_number text;
alter table public.tickets add column if not exists table_number text;
alter table public.tickets add column if not exists created_at timestamptz default now();

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

alter table public.promo_codes add column if not exists code text;
alter table public.promo_codes add column if not exists description text;
alter table public.promo_codes add column if not exists discount_type text;
alter table public.promo_codes add column if not exists discount_value numeric(10, 2);
alter table public.promo_codes add column if not exists min_order_amount numeric(10, 2) default 0;
alter table public.promo_codes add column if not exists max_uses integer;
alter table public.promo_codes add column if not exists used_count integer default 0;
alter table public.promo_codes add column if not exists applicable_event_ids uuid[] default '{}';
alter table public.promo_codes add column if not exists applicable_ticket_type_ids uuid[] default '{}';
alter table public.promo_codes add column if not exists valid_from timestamptz default now();
alter table public.promo_codes add column if not exists valid_until timestamptz;
alter table public.promo_codes add column if not exists is_active boolean default true;
alter table public.promo_codes add column if not exists created_at timestamptz default now();

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

alter table public.subscriptions add column if not exists name text;
alter table public.subscriptions add column if not exists source text default 'website';
alter table public.subscriptions add column if not exists tags text[] default '{}';
alter table public.subscriptions add column if not exists status text default 'active';
alter table public.subscriptions add column if not exists unsubscribed_at timestamptz;
alter table public.subscriptions add column if not exists created_at timestamptz default now();

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

alter table public.enquiries add column if not exists name text;
alter table public.enquiries add column if not exists email text;
alter table public.enquiries add column if not exists phone text;
alter table public.enquiries add column if not exists company text;
alter table public.enquiries add column if not exists event_type text;
alter table public.enquiries add column if not exists guest_count text;
alter table public.enquiries add column if not exists event_date date;
alter table public.enquiries add column if not exists budget text;
alter table public.enquiries add column if not exists message text;
alter table public.enquiries add column if not exists status text default 'new';
alter table public.enquiries add column if not exists assigned_to uuid references public.profiles(id);
alter table public.enquiries add column if not exists notes text;
alter table public.enquiries add column if not exists source text default 'website';
alter table public.enquiries add column if not exists created_at timestamptz default now();
alter table public.enquiries add column if not exists updated_at timestamptz default now();

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

alter table public.applications add column if not exists name text;
alter table public.applications add column if not exists email text;
alter table public.applications add column if not exists phone text;
alter table public.applications add column if not exists role text;
alter table public.applications add column if not exists portfolio_url text;
alter table public.applications add column if not exists linkedin_url text;
alter table public.applications add column if not exists message text;
alter table public.applications add column if not exists resume_url text;
alter table public.applications add column if not exists status text default 'new';
alter table public.applications add column if not exists created_at timestamptz default now();

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

alter table public.reservations add column if not exists full_name text;
alter table public.reservations add column if not exists ticket_type text;
alter table public.reservations add column if not exists ticket_id text;
alter table public.reservations add column if not exists quantity integer default 1;
alter table public.reservations add column if not exists promo text;
alter table public.reservations add column if not exists status text default 'pending';
alter table public.reservations add column if not exists created_at timestamptz default now();

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

alter table public.audit_logs add column if not exists user_id uuid references public.profiles(id);
alter table public.audit_logs add column if not exists action text;
alter table public.audit_logs add column if not exists resource_type text;
alter table public.audit_logs add column if not exists resource_id text;
alter table public.audit_logs add column if not exists old_data jsonb;
alter table public.audit_logs add column if not exists new_data jsonb;
alter table public.audit_logs add column if not exists ip_address text;
alter table public.audit_logs add column if not exists user_agent text;
alter table public.audit_logs add column if not exists created_at timestamptz default now();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.tickets enable row level security;
alter table public.promo_codes enable row level security;
alter table public.enquiries enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
for select using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

drop policy if exists "Published events are public" on public.events;
create policy "Published events are public" on public.events
for select using (status = 'published');

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events" on public.events
for all using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

drop policy if exists "Ticket types are public" on public.ticket_types;
create policy "Ticket types are public" on public.ticket_types
for select using (is_visible = true);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
for select using (
  auth.uid() = user_id
  or customer_email = (select email from public.profiles where id = auth.uid())
);

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders" on public.orders
for all using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  )
);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where id = order_id and user_id = auth.uid()
  )
);

drop policy if exists "Users can view own tickets" on public.tickets;
create policy "Users can view own tickets" on public.tickets
for select using (
  holder_email = (select email from public.profiles where id = auth.uid())
  or exists (
    select 1 from public.orders
    where id = order_id and user_id = auth.uid()
  )
);

drop policy if exists "Admins can manage tickets" on public.tickets;
create policy "Admins can manage tickets" on public.tickets
for all using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin', 'super_admin')
  )
);

drop policy if exists "Anyone can validate promo codes" on public.promo_codes;
create policy "Anyone can validate promo codes" on public.promo_codes
for select using (is_active = true);

drop policy if exists "Admins can manage enquiries" on public.enquiries;
create policy "Admins can manage enquiries" on public.enquiries
for all using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin', 'super_admin')
  )
);

drop policy if exists "Approved testimonials are public" on public.testimonials;
create policy "Approved testimonials are public" on public.testimonials
for select using (approved = true);

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
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      updated_at = now();
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
  if new.status = 'paid' and coalesce(old.status, '') != 'paid' then
    update public.events
    set current_attendees = coalesce(current_attendees, 0) + (
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

insert into public.profiles (id, email, full_name, email_verified, role, created_at, updated_at)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data->>'full_name', users.raw_user_meta_data->>'name'),
  users.email_confirmed_at is not null,
  case when users.email = 'vibesup.event@gmail.com' then 'admin' else 'customer' end,
  now(),
  now()
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  email_verified = excluded.email_verified,
  updated_at = now();

update public.profiles
set role = 'admin', updated_at = now()
where email = 'vibesup.event@gmail.com';

insert into public.events (
  id, slug, title, subtitle, description, short_description, venue_name, venue_address,
  venue_city, venue_state, venue_country, event_date, doors_open, event_end, cover_image_url,
  gallery_urls, category, status, featured, max_capacity, current_attendees, age_restriction,
  dress_code, parking_info, additional_info, seo_title, seo_description, created_by, created_at, updated_at
)
values
  (
    '5cfb1a44-0a0d-4c5a-8e74-90a70ad7d5d1',
    'arab-nights',
    'Arab Nights ft. Abdel Karim',
    'An editorial black-tie cultural celebration',
    'A black-tie cultural celebration with live performance, premium dining, ceremonial arrival moments, and a deeply atmospheric midnight sequence.',
    'A black-tie cultural celebration with premium dining, live performance, and ceremonial arrival moments.',
    'Hilton LA / Universal City',
    '555 Universal Hollywood Dr, Universal City, CA 91608',
    'Los Angeles',
    'CA',
    'US',
    '2026-03-28T20:00:00-07:00',
    '2026-03-28T19:00:00-07:00',
    '2026-03-29T01:00:00-07:00',
    '/arabnights-1200.webp',
    array['/VIBEUP21-1600.webp','/VIBEUP10.jpg'],
    'cultural',
    'completed',
    false,
    800,
    640,
    0,
    'Formal evening wear',
    'Valet and self-parking details are shared before arrival.',
    'Guests receive digital confirmation, QR entry instructions, and venue arrival guidance.',
    'Arab Nights ft. Abdel Karim | VibeUp',
    'Relive the Arab Nights cultural gala by VibeUp with premium hospitality, performance, and ceremony.',
    (select id from public.profiles where email = 'vibesup.event@gmail.com' limit 1),
    now(),
    now()
  ),
  (
    '54d1fb33-8f44-4a4d-9fb7-5f1767dd5a90',
    'summer-rooftop-series',
    'Summer Rooftop Series',
    'Sunset hospitality and skyline energy',
    'A sunset-to-midnight rooftop concept featuring elevated hospitality, skyline ambience, curated DJ direction, and premium guest flow.',
    'A rooftop summer concept with premium guest flow, skyline ambience, and curated music direction.',
    'SkyBar Los Angeles',
    '8440 Sunset Blvd, West Hollywood, CA 90069',
    'Los Angeles',
    'CA',
    'US',
    '2026-06-20T18:00:00-07:00',
    '2026-06-20T17:15:00-07:00',
    '2026-06-21T00:00:00-07:00',
    '/fireworks-1600.webp',
    array['/VIBEUP4.jpg','/VIBEUP5.jpg'],
    'rooftop',
    'published',
    false,
    300,
    112,
    21,
    'Summer cocktail attire',
    'Paid valet is available on site. Rideshare drop-off is recommended.',
    'Arrive early for rooftop sunset access and curated opening hospitality.',
    'Summer Rooftop Series | VibeUp',
    'Book rooftop access for VibeUp Summer Rooftop Series with premium hospitality and skyline atmosphere.',
    (select id from public.profiles where email = 'vibesup.event@gmail.com' limit 1),
    now(),
    now()
  ),
  (
    '91c6e0cb-3ff5-4b63-a3ae-c8b0834456c1',
    'eid-al-adha-celebration',
    'Eid Al-Adha Celebration',
    'A premium large-format cultural gathering',
    'A large-format family and community celebration with formal production, entertainment programming, and a refined hospitality structure.',
    'A premium Eid celebration with hospitality, entertainment programming, and refined room energy.',
    'Hilton Los Angeles',
    '555 Universal Hollywood Dr, Universal City, CA 91608',
    'Los Angeles',
    'CA',
    'US',
    '2026-06-28T20:00:00-07:00',
    '2026-06-28T19:00:00-07:00',
    '2026-06-29T00:30:00-07:00',
    '/stage-1600.webp',
    array['/VIBEUP21-1600.webp','/VIBEUP10.jpg'],
    'cultural',
    'published',
    false,
    700,
    188,
    0,
    'Elegant festive attire',
    'Self-parking and valet details are included in the confirmation email.',
    'Family-friendly timing, managed arrival flow, and digital ticket entry are included.',
    'Eid Al-Adha Celebration | VibeUp',
    'Reserve access for VibeUp''s Eid Al-Adha Celebration with premium hospitality and live programming.',
    (select id from public.profiles where email = 'vibesup.event@gmail.com' limit 1),
    now(),
    now()
  ),
  (
    '2b3bcf43-c2fa-4c2d-9c0e-363c1f9881d8',
    'new-years-eve-gala-2027',
    'New Year''s Eve Gala 2027',
    'The signature VibeUp countdown experience',
    'The signature VibeUp countdown experience with cinematic staging, formal dinner service, live entertainment, and a dramatic midnight reveal.',
    'A cinematic countdown gala with dinner service, live entertainment, and a dramatic midnight reveal.',
    'Hilton LA / Universal City',
    '555 Universal Hollywood Dr, Universal City, CA 91608',
    'Los Angeles',
    'CA',
    'US',
    '2026-12-31T20:30:00-08:00',
    '2026-12-31T19:15:00-08:00',
    '2027-01-01T01:30:00-08:00',
    '/fireworks-1600.webp',
    array['/VIBEUP21-1600.webp','/VIBEUP4.jpg'],
    'gala',
    'published',
    true,
    900,
    245,
    21,
    'Black tie or formal evening wear',
    'Valet and preferred hotel parking are available with advance arrival recommended.',
    'Paid orders receive QR entry, timeline guidance, and concierge support before the event.',
    'New Year''s Eve Gala 2027 | VibeUp',
    'Secure tickets for VibeUp''s signature New Year''s Eve Gala with premium hospitality and cinematic countdown production.',
    (select id from public.profiles where email = 'vibesup.event@gmail.com' limit 1),
    now(),
    now()
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  short_description = excluded.short_description,
  venue_name = excluded.venue_name,
  venue_address = excluded.venue_address,
  venue_city = excluded.venue_city,
  venue_state = excluded.venue_state,
  venue_country = excluded.venue_country,
  event_date = excluded.event_date,
  doors_open = excluded.doors_open,
  event_end = excluded.event_end,
  cover_image_url = excluded.cover_image_url,
  gallery_urls = excluded.gallery_urls,
  category = excluded.category,
  status = excluded.status,
  featured = excluded.featured,
  max_capacity = excluded.max_capacity,
  current_attendees = excluded.current_attendees,
  age_restriction = excluded.age_restriction,
  dress_code = excluded.dress_code,
  parking_info = excluded.parking_info,
  additional_info = excluded.additional_info,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  created_by = excluded.created_by,
  updated_at = now();

insert into public.ticket_types (
  id, event_id, name, description, price, original_price, currency, color, badge,
  max_quantity, sold_quantity, min_per_order, max_per_order, includes, is_visible, sort_order, created_at
)
values
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0011','54d1fb33-8f44-4a4d-9fb7-5f1767dd5a90','General Admission','Sunset entry, curated music, and full access to the rooftop atmosphere.',80,null,'USD','rgba(77,192,182,0.72)',null,180,56,1,8,array['Sunset entry','Curated rooftop access'],true,1,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0012','54d1fb33-8f44-4a4d-9fb7-5f1767dd5a90','VIP Lounge','Priority arrival, stronger sightlines, and dedicated lounge service.',145,165,'USD','rgba(214,75,75,0.72)','Popular',70,22,1,6,array['Priority arrival','Lounge access','Dedicated service'],true,2,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0013','54d1fb33-8f44-4a4d-9fb7-5f1767dd5a90','Group Table','Best-value table package for coordinated groups.',125,145,'USD','rgba(77,121,214,0.72)','Best Value',50,8,4,10,array['Shared table','Group coordination support'],true,3,now()),

  ('8a6a5663-8f10-44a7-9e63-085a1f3a0021','91c6e0cb-3ff5-4b63-a3ae-c8b0834456c1','Purple','A streamlined access tier with strong social atmosphere and event access.',100,null,'USD','rgba(136,91,214,0.72)',null,220,74,1,8,array['Event access','Cultural programming'],true,1,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0022','91c6e0cb-3ff5-4b63-a3ae-c8b0834456c1','Green','Comfortable premium access with stronger room placement.',145,165,'USD','rgba(74,177,112,0.72)','Popular',180,66,1,8,array['Priority room placement','Premium hospitality flow'],true,2,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0023','91c6e0cb-3ff5-4b63-a3ae-c8b0834456c1','VIP Red','Highest-touch arrival, premium placement, and concierge-style service.',220,250,'USD','rgba(214,75,75,0.72)','Premium',80,19,1,6,array['Concierge arrival','Premium placement','VIP service'],true,3,now()),

  ('8a6a5663-8f10-44a7-9e63-085a1f3a0031','2b3bcf43-c2fa-4c2d-9c0e-363c1f9881d8','Purple','Streamlined gala access for guests who want the room, countdown, and atmosphere.',150,null,'USD','rgba(136,91,214,0.72)',null,280,104,1,8,array['Gala access','Countdown experience'],true,1,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0032','2b3bcf43-c2fa-4c2d-9c0e-363c1f9881d8','Blue','Refined seating tier with premium service flow and stronger sightlines.',200,225,'USD','rgba(77,121,214,0.72)','Popular',220,83,1,8,array['Refined seating','Premium service flow'],true,2,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0033','2b3bcf43-c2fa-4c2d-9c0e-363c1f9881d8','VIP Red','Priority access, premium table placement, and the most elevated room experience.',250,285,'USD','rgba(214,75,75,0.72)','Premium',120,44,1,6,array['Priority access','Premium table placement','Concierge arrival'],true,3,now()),
  ('8a6a5663-8f10-44a7-9e63-085a1f3a0034','2b3bcf43-c2fa-4c2d-9c0e-363c1f9881d8','Group','A coordinated booking option for four or more guests with better per-seat value.',145,160,'USD','rgba(77,192,182,0.72)','Best Value',100,20,4,10,array['Group coordination','Better per-seat value'],true,4,now())
on conflict (id) do update
set
  event_id = excluded.event_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  original_price = excluded.original_price,
  currency = excluded.currency,
  color = excluded.color,
  badge = excluded.badge,
  max_quantity = excluded.max_quantity,
  sold_quantity = excluded.sold_quantity,
  min_per_order = excluded.min_per_order,
  max_per_order = excluded.max_per_order,
  includes = excluded.includes,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;
