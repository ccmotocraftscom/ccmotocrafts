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
create policy partner_service_areas_admin_manage
  on public.partner_service_areas for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());
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
