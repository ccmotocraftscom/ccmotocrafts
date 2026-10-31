-- CC MOTOCRAFTS | schema-matched security migration
-- Based on the schema + policy exports supplied on 31-Oct-2026.
-- BACK UP Supabase before running. Run once in SQL Editor as project owner.

begin;

-- Admin allow-list. Only verified owner/admin emails belong here.
create table if not exists public.ccm_admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);
insert into public.ccm_admin_allowlist(email)
values ('info@ccmotocrafts.in')
on conflict (email) do nothing;
alter table public.ccm_admin_allowlist enable row level security;
revoke all on public.ccm_admin_allowlist from anon, authenticated;

create or replace function public.ccm_is_admin()
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.ccm_admin_allowlist a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
revoke all on function public.ccm_is_admin() from public;
grant execute on function public.ccm_is_admin() to authenticated;

-- Existing schema already contains the main service fields. Add only fields
-- needed for a clear workmanship guarantee and admin notes; no customer rows deleted.
-- Your export showed bike_bookings.id is NOT NULL with no default. Give it a
-- sequence-backed default so the public booking form can insert without supplying id.
lock table public.bike_bookings in access exclusive mode;
create sequence if not exists public.bike_bookings_id_seq;
alter sequence public.bike_bookings_id_seq owned by public.bike_bookings.id;
select setval('public.bike_bookings_id_seq', coalesce((select max(id) from public.bike_bookings),0)+1, false);
alter table public.bike_bookings alter column id set default nextval('public.bike_bookings_id_seq');

alter table public.bike_bookings
  add column if not exists workmanship_guarantee_days integer not null default 30,
  add column if not exists workmanship_guarantee_text text,
  add column if not exists admin_notes text,
  add column if not exists updated_at timestamptz not null default now();

update public.bike_bookings
set workmanship_guarantee_text = '30-Day Service Workmanship Guarantee: CC Motocrafts provides a 30-day workmanship guarantee on eligible services from the service completion date, subject to the job card, approved work scope and stated exclusions. This guarantee covers eligible workmanship-related issues; it does not automatically cover normal wear and tear, accidental damage, misuse, unrelated faults or parts excluded from the job card.'
where workmanship_guarantee_text is null;

-- Remove the exact unsafe public policies returned in the user's policy export.
drop policy if exists "Allow public read" on public.bike_bookings;
drop policy if exists "Allow public insert" on public.bike_bookings;
drop policy if exists "Allow public log reads" on public.ai_chat_audit_logs;
drop policy if exists "Allow public log inserts" on public.ai_chat_audit_logs;

alter table public.bike_bookings enable row level security;
drop policy if exists ccm_booking_public_insert on public.bike_bookings;
drop policy if exists ccm_booking_customer_read on public.bike_bookings;
drop policy if exists ccm_booking_admin_read on public.bike_bookings;
drop policy if exists ccm_booking_admin_update on public.bike_bookings;
create policy ccm_booking_public_insert on public.bike_bookings
  for insert to anon, authenticated
  with check (
    nullif(trim(customer_name),'') is not null
    and nullif(trim(phone),'') is not null
    and length(regexp_replace(phone,'[^0-9]','','g')) >= 10
  );
create policy ccm_booking_customer_read on public.bike_bookings
  for select to authenticated
  using (lower(coalesce(email,'')) = lower(coalesce(auth.jwt()->>'email','')));
create policy ccm_booking_admin_read on public.bike_bookings
  for select to authenticated using (public.ccm_is_admin());
create policy ccm_booking_admin_update on public.bike_bookings
  for update to authenticated using (public.ccm_is_admin()) with check (public.ccm_is_admin());
revoke all on public.bike_bookings from anon;
grant insert on public.bike_bookings to anon;
grant select, insert, update on public.bike_bookings to authenticated;
-- Permit the new generated bigint id values for public booking inserts.
grant usage, select on sequence public.bike_bookings_id_seq to anon, authenticated;

-- Status history: booking_code stores bike_bookings.booking_id (text).
alter table public.booking_status_events enable row level security;
drop policy if exists ccm_events_admin_all on public.booking_status_events;
drop policy if exists ccm_events_customer_read on public.booking_status_events;
create policy ccm_events_admin_all on public.booking_status_events
  for all to authenticated using (public.ccm_is_admin()) with check (public.ccm_is_admin());
create policy ccm_events_customer_read on public.booking_status_events
  for select to authenticated using (
    exists (select 1 from public.bike_bookings b
      where b.booking_id = booking_status_events.booking_code
      and lower(coalesce(b.email,'')) = lower(coalesce(auth.jwt()->>'email','')))
  );
revoke all on public.booking_status_events from anon;
grant select, insert, update on public.booking_status_events to authenticated;

-- Reviews: public can submit; only approved + consented reviews are public.
alter table public.customer_reviews enable row level security;
drop policy if exists ccm_reviews_public_submit on public.customer_reviews;
drop policy if exists ccm_reviews_public_approved on public.customer_reviews;
drop policy if exists ccm_reviews_admin_all on public.customer_reviews;
create policy ccm_reviews_public_submit on public.customer_reviews
  for insert to anon, authenticated
  with check (rating between 1 and 5 and moderation_status = 'pending' and customer_consent_to_publish = false);
create policy ccm_reviews_public_approved on public.customer_reviews
  for select to anon, authenticated
  using (moderation_status = 'approved' and customer_consent_to_publish = true);
create policy ccm_reviews_admin_all on public.customer_reviews
  for all to authenticated using (public.ccm_is_admin()) with check (public.ccm_is_admin());
grant insert, select on public.customer_reviews to anon;
grant select, insert, update, delete on public.customer_reviews to authenticated;

-- Platform issues are private to authorized admins.
alter table public.platform_issues enable row level security;
drop policy if exists ccm_issues_admin_all on public.platform_issues;
create policy ccm_issues_admin_all on public.platform_issues
  for all to authenticated using (public.ccm_is_admin()) with check (public.ccm_is_admin());
revoke all on public.platform_issues from anon;
grant select, insert, update, delete on public.platform_issues to authenticated;

-- AI audit logs: no public reads or public writes after this migration.
alter table public.ai_chat_audit_logs enable row level security;
drop policy if exists ccm_ai_logs_admin_read on public.ai_chat_audit_logs;
create policy ccm_ai_logs_admin_read on public.ai_chat_audit_logs
  for select to authenticated using (public.ccm_is_admin());
revoke all on public.ai_chat_audit_logs from anon;
grant select on public.ai_chat_audit_logs to authenticated;

-- Admin notification destinations.
create table if not exists public.ccm_admin_settings (
  id integer primary key check (id = 1),
  primary_email text not null default 'info@ccmotocrafts.in',
  backup_email text,
  updated_at timestamptz not null default now()
);
alter table public.ccm_admin_settings enable row level security;
drop policy if exists ccm_settings_admin_all on public.ccm_admin_settings;
create policy ccm_settings_admin_all on public.ccm_admin_settings
  for all to authenticated using (public.ccm_is_admin()) with check (public.ccm_is_admin());
revoke all on public.ccm_admin_settings from anon;
grant select, insert, update on public.ccm_admin_settings to authenticated;
insert into public.ccm_admin_settings(id, primary_email)
values (1, 'info@ccmotocrafts.in') on conflict (id) do nothing;

commit;

-- AFTER RUNNING: enable Realtime for bike_bookings and booking_status_events
-- in Supabase Database > Publications. Confirm no other permissive policies remain.
-- Public booking insert is retained for the current browser form; add Turnstile
-- + server-side rate limiting/validation before public production launch.
