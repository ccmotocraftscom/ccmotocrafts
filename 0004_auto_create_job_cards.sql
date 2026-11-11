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
