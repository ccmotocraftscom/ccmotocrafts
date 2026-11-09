-- CC Motocrafts master platform schema
-- Run in Supabase SQL Editor. All public access is denied by default; public writes go through Cloudflare Worker.
create extension if not exists pgcrypto;

create type public.platform_role as enum ('platform_admin','garage_owner','garage_manager','technician','service_advisor');
create type public.request_status as enum ('pending','approved','rejected','closed');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.garages (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  display_name text not null,
  owner_user_id uuid references auth.users(id),
  phone text,
  email text,
  address jsonb not null default '{}'::jsonb,
  service_divisions text[] not null default array['2W']::text[] check (service_divisions <@ array['2W','4W']::text[]),
  gst_registered boolean not null default false,
  gstin text,
  trade_license_number text,
  certificates jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending','active','suspended','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references public.garages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.platform_role not null default 'technician',
  status text not null default 'pending' check (status in ('pending','active','revoked')),
  created_at timestamptz not null default now(),
  unique(garage_id,user_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  job_id text unique not null,
  garage_id uuid references public.garages(id),
  customer_user_id uuid references auth.users(id),
  division text not null default '2W' check (division in ('2W','4W')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  vehicle_reg text not null,
  vehicle_class text,
  vehicle_model text not null,
  custom_vehicle_name text,
  service_package text not null,
  machinery_spec text,
  pincode text not null check (pincode ~ '^\d{6}$'),
  pickup_fee numeric(12,2) not null default 0 check (pickup_fee >= 0),
  preferred_date date,
  preferred_slot text,
  customer_notes text,
  gps_lat double precision,
  gps_lng double precision,
  google_maps_link text,
  base_price numeric(12,2) check (base_price is null or base_price >= 0),
  status text not null default 'request_received' check (status in ('request_received','verification_pending','confirmed','assigned','inspection','in_progress','awaiting_approval','quality_check','ready_for_delivery','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_cards (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  garage_id uuid references public.garages(id),
  odometer_km integer,
  customer_concerns text,
  inspection_notes text,
  work_approved boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_card_updates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  garage_id uuid references public.garages(id),
  status text not null,
  title text not null,
  description text,
  visible_to_customer boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.customer_vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid references auth.users(id),
  customer_phone text not null,
  vehicle_reg text not null,
  vehicle_model text not null,
  division text not null check (division in ('2W','4W')),
  created_at timestamptz not null default now(),
  unique(customer_phone,vehicle_reg)
);

create table if not exists public.service_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  garage_id uuid references public.garages(id),
  customer_user_id uuid references auth.users(id),
  customer_phone text not null,
  vehicle_reg text not null,
  service_date date not null default current_date,
  odometer_km integer,
  work_performed jsonb not null default '[]'::jsonb,
  parts_used jsonb not null default '[]'::jsonb,
  next_service_due_km integer,
  next_service_due_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  garage_id uuid references public.garages(id),
  invoice_number text not null,
  invoice_type text not null check (invoice_type in ('gst','retail')),
  gst_snapshot jsonb not null default '{}'::jsonb,
  line_items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  watermark_text text not null default 'CC MOTOCRAFTS',
  pdf_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(garage_id,invoice_number)
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  garage_id uuid references public.garages(id),
  quote_number text not null,
  line_items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  valid_until date,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(garage_id,quote_number)
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('partner_access','customer_tracking')),
  name text not null,
  phone text not null,
  email text not null,
  details jsonb not null default '{}'::jsonb,
  status public.request_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.otp_challenges (
  id uuid primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0 check (attempts between 0 and 5),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid references public.garages(id),
  created_by uuid references auth.users(id),
  division text not null check (division in ('2W','4W')),
  vehicle_details jsonb not null default '{}'::jsonb,
  input_type text not null check (input_type in ('text','obd_code','photo','audio')),
  question text,
  result jsonb not null default '{}'::jsonb,
  safety_reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  customer_phone text not null,
  description text not null,
  status text not null default 'new' check (status in ('new','acknowledged','approved','declined','completed')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_garage_created_idx on public.bookings(garage_id,created_at desc);
create index if not exists bookings_phone_reg_idx on public.bookings(customer_phone,vehicle_reg);
create index if not exists job_updates_booking_idx on public.job_card_updates(booking_id,created_at);
create index if not exists service_records_vehicle_idx on public.service_records(customer_phone,vehicle_reg,service_date desc);
create index if not exists invoices_garage_created_idx on public.invoices(garage_id,created_at desc);

create or replace function public.is_platform_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select coalesce((auth.jwt()->'app_metadata'->>'platform_role')='platform_admin', false)
    or exists(select 1 from public.memberships m where m.user_id=auth.uid() and m.role='platform_admin' and m.status='active');
$$;
create or replace function public.has_garage_access(target_garage uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select public.is_platform_admin() or exists(select 1 from public.memberships m where m.user_id=auth.uid() and m.garage_id=target_garage and m.status='active');
$$;

-- RLS is enabled on every table. There are intentionally no anon SELECT/INSERT policies.
do $$ declare t text; begin
  foreach t in array array['profiles','garages','memberships','bookings','job_cards','job_card_updates','customer_vehicles','service_records','invoices','quotations','access_requests','otp_challenges','diagnostic_sessions','customer_requests'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

create policy profiles_self_select on public.profiles for select to authenticated using (id=auth.uid() or public.is_platform_admin());
create policy profiles_self_update on public.profiles for update to authenticated using (id=auth.uid() or public.is_platform_admin()) with check (id=auth.uid() or public.is_platform_admin());
create policy garages_member_select on public.garages for select to authenticated using (public.has_garage_access(id));
create policy garages_admin_all on public.garages for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy memberships_self_or_admin_select on public.memberships for select to authenticated using (user_id=auth.uid() or public.is_platform_admin() or public.has_garage_access(garage_id));
create policy memberships_admin_manage on public.memberships for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy bookings_garage_select on public.bookings for select to authenticated using (public.has_garage_access(garage_id) or customer_user_id=auth.uid());
create policy bookings_garage_update on public.bookings for update to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy job_cards_garage_all on public.job_cards for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy job_updates_garage_all on public.job_card_updates for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy job_updates_customer_select on public.job_card_updates for select to authenticated using (visible_to_customer and exists(select 1 from public.bookings b where b.id=booking_id and b.customer_user_id=auth.uid()));
create policy vehicles_owner_select on public.customer_vehicles for select to authenticated using (customer_user_id=auth.uid() or public.is_platform_admin());
create policy vehicles_garage_select on public.customer_vehicles for select to authenticated using (exists(select 1 from public.bookings b where b.customer_phone=customer_vehicles.customer_phone and public.has_garage_access(b.garage_id)));
create policy service_records_garage_all on public.service_records for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy service_records_customer_select on public.service_records for select to authenticated using (customer_user_id=auth.uid());
create policy invoices_garage_all on public.invoices for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy quotations_garage_all on public.quotations for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy access_requests_admin_select on public.access_requests for select to authenticated using (public.is_platform_admin());
create policy access_requests_admin_update on public.access_requests for update to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy diagnostic_sessions_garage_all on public.diagnostic_sessions for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
create policy customer_requests_garage_select on public.customer_requests for select to authenticated using (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)));
create policy customer_requests_garage_update on public.customer_requests for update to authenticated using (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id))) with check (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)));

-- OTP challenges are backend-only. Never grant authenticated or anon table access.
revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.garages, public.memberships, public.bookings, public.job_card_updates, public.customer_vehicles, public.service_records to authenticated;
grant insert, update, delete, select on public.job_cards, public.invoices, public.quotations, public.diagnostic_sessions, public.customer_requests to authenticated;
grant select, update on public.access_requests to authenticated;
grant usage, select on all sequences in schema public to authenticated;
