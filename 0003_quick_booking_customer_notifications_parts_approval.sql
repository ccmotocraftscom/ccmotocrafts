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
