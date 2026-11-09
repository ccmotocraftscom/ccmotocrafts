-- Run once in Supabase: SQL Editor > New query > paste > Run. Safe to run again.
create table if not exists public.bookings (id bigint generated always as identity primary key, created_at timestamptz default now(), name text not null, phone text not null, pincode text not null, bike text not null, service text, pickup_date date, notes text, free_pickup boolean default false, status text default 'new');
alter table public.bookings
  add column if not exists booking_code text, add column if not exists brand text, add column if not exists model text,
  add column if not exists problems text, add column if not exists km text, add column if not exists slot text,
  add column if not exists source text, add column if not exists next_service_date date,
  add column if not exists service_km text, add column if not exists serviced_at date, add column if not exists work_done text,
  add column if not exists labour_charge numeric, add column if not exists parts_charge numeric;
alter table public.bookings enable row level security;
drop policy if exists "public can insert bookings" on public.bookings;
create policy "public can insert bookings" on public.bookings for insert to anon with check (true);

create table if not exists public.reviews (id bigint generated always as identity primary key, created_at timestamptz default now(), name text, phone text, partner text, stars int check (stars between 1 and 5), comment text);
alter table public.reviews enable row level security;
drop policy if exists "public can insert reviews" on public.reviews;
create policy "public can insert reviews" on public.reviews for insert to anon with check (true);

-- Track my bike: a customer sees ONLY their own records, and only with booking code + mobile number together.
create or replace function public.my_history(p_code text, p_phone text)
returns table(booking_code text, created_at timestamptz, bike text, problems text, status text, service_km text, serviced_at date, work_done text, labour_charge numeric, parts_charge numeric, next_service_date date)
language sql security definer set search_path = public as $$
  select b.booking_code, b.created_at, b.bike, b.problems, b.status, b.service_km, b.serviced_at, b.work_done, b.labour_charge, b.parts_charge, b.next_service_date
  from public.bookings b
  where right(b.phone,10) = right(p_phone,10)
    and exists (select 1 from public.bookings x where x.booking_code = upper(p_code) and right(x.phone,10) = right(p_phone,10))
  order by b.created_at desc limit 20
$$;
revoke all on function public.my_history(text,text) from public;
grant execute on function public.my_history(text,text) to anon;

-- 2-month reminders (private to you). Run: select * from due_reminders where next_service_date <= current_date + 7;
create or replace view public.due_reminders as
select name, phone, bike, next_service_date,
 'https://wa.me/91'||right(phone,10)||'?text='||replace('Hello '||name||', your '||bike||' is due for its 2-month service. Book free pickup at https://ccmotocrafts.in',' ','%20') as whatsapp_link
from public.bookings;
alter view public.due_reminders set (security_invoker = on);
revoke all on public.due_reminders from anon, authenticated;

-- Marketing tracking + bike photos
alter table public.bookings add column if not exists campaign text, add column if not exists keyword text, add column if not exists landing text;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('bike-photos','bike-photos',false,2097152,array['image/jpeg']) on conflict (id) do nothing;
drop policy if exists "anon can upload bike photos" on storage.objects;
create policy "anon can upload bike photos" on storage.objects for insert to anon with check (bucket_id = 'bike-photos');
-- Photos are private: open them in Supabase > Storage > bike-photos > booking code folder.
