-- CC MOTOCRAFTS | AI ENGINE LABS - SUPABASE REBUILD INSTALLER
-- Paste the COMPLETE file into Supabase SQL Editor and Run once.
-- Designed for the case where application tables were accidentally deleted.
-- Safe to re-run for existing tables/policies where possible; it does NOT drop data or schema objects.
-- Canonical booking table: public.bookings. Compatibility view: public.bike_bookings.
-- IMPORTANT: Run only in the correct Supabase project. Take a backup if any data remains.
-- This creates database structures and a notification queue; it does NOT itself send email/WhatsApp
-- or provide live GPS. A trusted backend/Edge Function/Worker and provider credentials are required.

-- ============================================================
-- BEGIN 0001_master_schema.sql
-- ============================================================
-- CC Motocrafts master platform schema
-- Run in Supabase SQL Editor. All public access is denied by default; public writes go through Cloudflare Worker.
create extension if not exists pgcrypto;

do $$ begin
  create type public.platform_role as enum ('platform_admin','garage_owner','garage_manager','technician','service_advisor');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.request_status as enum ('pending','approved','rejected','closed');
exception when duplicate_object then null; end $$;

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


create or replace function public.is_platform_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select coalesce((auth.jwt()->'app_metadata'->>'platform_role')='platform_admin', false)
    or exists(select 1 from public.memberships m where m.user_id=auth.uid() and m.role='platform_admin' and m.status='active');
$$;
create or replace function public.has_garage_access(target_garage uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select public.is_platform_admin() or exists(select 1 from public.memberships m where m.user_id=auth.uid() and m.garage_id=target_garage and m.status='active');
$$;

-- ============================================================
-- EXTRA PLATFORM TABLES: tracking, notification queue, warranty
-- ============================================================
create table if not exists public.customer_tracking_sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  enabled boolean not null default false,
  authorized_by uuid references auth.users(id),
  authorized_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check ((enabled = false) or (authorized_by is not null and authorized_at is not null and revoked_at is null))
);

create table if not exists public.tracking_points (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.customer_tracking_sessions(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  accuracy_m double precision,
  recorded_at timestamptz not null default now(),
  visible_to_customer boolean not null default false
);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  channel text not null check (channel in ('email','whatsapp')),
  event_type text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','processing','sent','failed','cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  provider_message_id text,
  last_error text,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.warranty_certificates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  garage_id uuid references public.garages(id),
  customer_user_id uuid references auth.users(id),
  customer_phone text not null,
  vehicle_reg text not null,
  certificate_number text not null unique,
  warranty_type text not null,
  starts_on date not null,
  ends_on date not null,
  terms jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','expired','void')),
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create index if not exists tracking_points_session_time_idx on public.tracking_points(session_id, recorded_at desc);
create index if not exists notification_outbox_pending_idx on public.notification_outbox(status, scheduled_at) where status = 'pending';
create index if not exists warranty_customer_vehicle_idx on public.warranty_certificates(customer_phone, vehicle_reg, ends_on desc);

alter table public.customer_tracking_sessions enable row level security;
alter table public.tracking_points enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.warranty_certificates enable row level security;

drop policy if exists tracking_session_garage_select on public.customer_tracking_sessions;
create policy tracking_session_garage_select on public.customer_tracking_sessions for select to authenticated
using (exists (select 1 from public.bookings b where b.id=booking_id and (public.has_garage_access(b.garage_id) or b.customer_user_id=auth.uid())));
drop policy if exists tracking_session_garage_update on public.customer_tracking_sessions;
create policy tracking_session_garage_update on public.customer_tracking_sessions for update to authenticated
using (exists (select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)))
with check (exists (select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)));
drop policy if exists tracking_points_authorized_read on public.tracking_points;
create policy tracking_points_authorized_read on public.tracking_points for select to authenticated
using (visible_to_customer and exists (select 1 from public.customer_tracking_sessions s join public.bookings b on b.id=s.booking_id where s.id=session_id and s.enabled and s.revoked_at is null and (b.customer_user_id=auth.uid() or public.has_garage_access(b.garage_id))));
drop policy if exists warranty_customer_read on public.warranty_certificates;
create policy warranty_customer_read on public.warranty_certificates for select to authenticated
using (customer_user_id=auth.uid() or public.is_platform_admin());
drop policy if exists warranty_garage_read on public.warranty_certificates;
create policy warranty_garage_read on public.warranty_certificates for select to authenticated
using (public.has_garage_access(garage_id));

revoke all on public.customer_tracking_sessions, public.tracking_points, public.notification_outbox, public.warranty_certificates from anon, authenticated;
grant select, update on public.customer_tracking_sessions to authenticated;
grant select on public.tracking_points, public.warranty_certificates to authenticated;
grant all on public.customer_tracking_sessions, public.tracking_points, public.notification_outbox, public.warranty_certificates to service_role;
grant usage, select on sequence public.tracking_points_id_seq to service_role;

create index if not exists bookings_garage_created_idx on public.bookings(garage_id,created_at desc);
create index if not exists bookings_phone_reg_idx on public.bookings(customer_phone,vehicle_reg);
create index if not exists job_updates_booking_idx on public.job_card_updates(booking_id,created_at);
create index if not exists service_records_vehicle_idx on public.service_records(customer_phone,vehicle_reg,service_date desc);
create index if not exists invoices_garage_created_idx on public.invoices(garage_id,created_at desc);

-- RLS is enabled on every table. There are intentionally no anon SELECT/INSERT policies.
do $$ declare t text; begin
  foreach t in array array['profiles','garages','memberships','bookings','job_cards','job_card_updates','customer_vehicles','service_records','invoices','quotations','access_requests','otp_challenges','diagnostic_sessions','customer_requests'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles for select to authenticated using (id=auth.uid() or public.is_platform_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update to authenticated using (id=auth.uid() or public.is_platform_admin()) with check (id=auth.uid() or public.is_platform_admin());
drop policy if exists garages_member_select on public.garages;
create policy garages_member_select on public.garages for select to authenticated using (public.has_garage_access(id));
drop policy if exists garages_admin_all on public.garages;
create policy garages_admin_all on public.garages for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists memberships_self_or_admin_select on public.memberships;
create policy memberships_self_or_admin_select on public.memberships for select to authenticated using (user_id=auth.uid() or public.is_platform_admin() or public.has_garage_access(garage_id));
drop policy if exists memberships_admin_manage on public.memberships;
create policy memberships_admin_manage on public.memberships for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists bookings_garage_select on public.bookings;
create policy bookings_garage_select on public.bookings for select to authenticated using (public.has_garage_access(garage_id) or customer_user_id=auth.uid());
drop policy if exists bookings_garage_update on public.bookings;
create policy bookings_garage_update on public.bookings for update to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists job_cards_garage_all on public.job_cards;
create policy job_cards_garage_all on public.job_cards for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists job_updates_garage_all on public.job_card_updates;
create policy job_updates_garage_all on public.job_card_updates for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists job_updates_customer_select on public.job_card_updates;
create policy job_updates_customer_select on public.job_card_updates for select to authenticated using (visible_to_customer and exists(select 1 from public.bookings b where b.id=booking_id and b.customer_user_id=auth.uid()));
drop policy if exists vehicles_owner_select on public.customer_vehicles;
create policy vehicles_owner_select on public.customer_vehicles for select to authenticated using (customer_user_id=auth.uid() or public.is_platform_admin());
drop policy if exists vehicles_garage_select on public.customer_vehicles;
create policy vehicles_garage_select on public.customer_vehicles for select to authenticated using (exists(select 1 from public.bookings b where b.customer_phone=customer_vehicles.customer_phone and public.has_garage_access(b.garage_id)));
drop policy if exists service_records_garage_all on public.service_records;
create policy service_records_garage_all on public.service_records for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists service_records_customer_select on public.service_records;
create policy service_records_customer_select on public.service_records for select to authenticated using (customer_user_id=auth.uid());
drop policy if exists invoices_garage_all on public.invoices;
create policy invoices_garage_all on public.invoices for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists quotations_garage_all on public.quotations;
create policy quotations_garage_all on public.quotations for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists access_requests_admin_select on public.access_requests;
create policy access_requests_admin_select on public.access_requests for select to authenticated using (public.is_platform_admin());
drop policy if exists access_requests_admin_update on public.access_requests;
create policy access_requests_admin_update on public.access_requests for update to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists diagnostic_sessions_garage_all on public.diagnostic_sessions;
create policy diagnostic_sessions_garage_all on public.diagnostic_sessions for all to authenticated using (public.has_garage_access(garage_id)) with check (public.has_garage_access(garage_id));
drop policy if exists customer_requests_garage_select on public.customer_requests;
create policy customer_requests_garage_select on public.customer_requests for select to authenticated using (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)));
drop policy if exists customer_requests_garage_update on public.customer_requests;
create policy customer_requests_garage_update on public.customer_requests for update to authenticated using (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id))) with check (exists(select 1 from public.bookings b where b.id=booking_id and public.has_garage_access(b.garage_id)));

-- OTP challenges are backend-only. Never grant authenticated or anon table access.
revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.garages, public.memberships, public.bookings, public.job_card_updates, public.customer_vehicles, public.service_records to authenticated;
grant insert, update, delete, select on public.job_cards, public.invoices, public.quotations, public.diagnostic_sessions, public.customer_requests to authenticated;
grant select, update on public.access_requests to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- END 0001_master_schema.sql


-- ============================================================
-- BEGIN 0002_booking_routing_ads.sql
-- ============================================================
-- CC Motocrafts booking reliability, PIN routing and Ads attribution
-- Run AFTER 0001_master_schema.sql. Safe additive migration; does not drop existing data.

alter table public.bookings
  add column if not exists area text,
  add column if not exists landmark text,
  add column if not exists customer_source text not null default 'website',
  add column if not exists gclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists idempotency_key text;

create unique index if not exists bookings_idempotency_key_uidx
  on public.bookings(idempotency_key) where idempotency_key is not null;

create index if not exists bookings_pincode_created_idx
  on public.bookings(pincode, created_at desc);

-- One row per garage/PIN. Lower priority number wins if multiple garages cover a PIN.
-- Only ACTIVE garages are selected by the Worker at booking time.
create table if not exists public.partner_service_areas (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references public.garages(id) on delete cascade,
  pincode text not null check (pincode ~ '^[0-9]{6}$'),
  priority integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (garage_id, pincode)
);

create index if not exists partner_service_areas_pin_route_idx
  on public.partner_service_areas(pincode, is_active, priority);

alter table public.partner_service_areas enable row level security;
drop policy if exists partner_service_areas_admin_manage on public.partner_service_areas;
create policy partner_service_areas_admin_manage
  on public.partner_service_areas for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists partner_service_areas_garage_read on public.partner_service_areas;
create policy partner_service_areas_garage_read
  on public.partner_service_areas for select to authenticated
  using (public.has_garage_access(garage_id));
revoke all on public.partner_service_areas from anon;
grant select on public.partner_service_areas to authenticated;
grant select, insert, update, delete on public.partner_service_areas to service_role;

-- Compatibility view for integrations that expect the historical bike_bookings name.
-- Canonical writable table remains public.bookings; all public writes go through the Worker.
create or replace view public.bike_bookings
  with (security_invoker = true)
as select * from public.bookings;
revoke all on public.bike_bookings from anon, authenticated;
grant select on public.bike_bookings to service_role;

comment on table public.partner_service_areas is
  'Maps six-digit customer PIN codes to active partner garages. Seed only verified partner coverage.';
comment on column public.bookings.idempotency_key is
  'Optional client-generated retry key. Unique when present to prevent duplicate booking inserts.';

-- END 0002_booking_routing_ads.sql


-- ============================================================
-- BEGIN 0003_quick_booking_customer_notifications_parts_approval.sql
-- ============================================================
-- CC Motocrafts quick booking, customer notification consent and parts approval controls
-- Run AFTER 0001_master_schema.sql and 0002_booking_routing_ads.sql.
-- Additive only: does not delete or rewrite existing booking records.

alter table public.bookings
  add column if not exists customer_whatsapp_opt_in boolean not null default false,
  add column if not exists customer_email_opt_in boolean not null default false,
  add column if not exists location_capture_method text,
  add column if not exists pickup_requested boolean not null default true;

alter table public.job_cards
  add column if not exists parts_quote jsonb not null default '[]'::jsonb,
  add column if not exists parts_photo_video_url text,
  add column if not exists customer_parts_approved boolean not null default false,
  add column if not exists customer_parts_approval_method text,
  add column if not exists customer_parts_approved_at timestamptz;

alter table public.job_cards
  drop constraint if exists job_cards_parts_approval_method_check;
alter table public.job_cards
  add constraint job_cards_parts_approval_method_check
  check (customer_parts_approval_method is null or customer_parts_approval_method in ('whatsapp','email','in_app','written'));

comment on column public.bookings.customer_whatsapp_opt_in is
  'Customer explicitly consented to receive booking updates on WhatsApp.';
comment on column public.bookings.customer_email_opt_in is
  'Customer explicitly consented to receive booking updates by email.';
comment on column public.job_cards.parts_quote is
  'Itemized proposed replacement parts and quotation; customer approval is required before replacement.';
comment on column public.job_cards.customer_parts_approved is
  'Must be true before any quoted spare part replacement is started.';

-- Guardrail: prevent marking parts approved without recording an approval method and timestamp.
create or replace function public.enforce_parts_approval_evidence()
returns trigger language plpgsql as $$
begin
  if new.customer_parts_approved = true then
    if new.customer_parts_approval_method is null or new.customer_parts_approved_at is null then
      raise exception 'Parts replacement approval requires method and timestamp';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_parts_approval_evidence on public.job_cards;
create trigger trg_enforce_parts_approval_evidence
before insert or update on public.job_cards
for each row execute function public.enforce_parts_approval_evidence();

-- END 0003_quick_booking_customer_notifications_parts_approval.sql


-- CC Motocrafts migration 0004: create a job card atomically for every booking.
-- PostgreSQL trigger executes in the same transaction as the booking INSERT.
create or replace function public.create_job_card_for_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.job_cards (booking_id, garage_id, customer_concerns)
  values (new.id, new.garage_id, new.customer_notes)
  on conflict (booking_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_create_job_card_for_booking on public.bookings;
create trigger trg_create_job_card_for_booking
after insert on public.bookings
for each row execute function public.create_job_card_for_booking();
