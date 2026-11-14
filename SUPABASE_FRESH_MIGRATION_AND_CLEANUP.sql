CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS public.active_sessions CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.platform_issues CASCADE;
DROP TABLE IF EXISTS public.otp_challenges CASCADE;
DROP TABLE IF EXISTS public.diagnostic_sessions CASCADE;
DROP TABLE IF EXISTS public.access_requests CASCADE;
DROP TABLE IF EXISTS public.ai_chat_audit_logs CASCADE;

CREATE TABLE IF NOT EXISTS public.bike_bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS booking_id TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_brand TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS bike_model TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS reg_number TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_class TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS engine_cc TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS odometer_km NUMERIC DEFAULT 0;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS booking_date TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS time_slot TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS complaint_note TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS gps_coords TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Booking Confirmed';
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS pickup_zone_type TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS pickup_charge NUMERIC DEFAULT 0;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS cancellation_penalty NUMERIC DEFAULT 300;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS total_dispatch_fee NUMERIC DEFAULT 0;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_displacement_cc TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS workmanship_guarantee_days INTEGER DEFAULT 30;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS next_service_due_date TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS next_service_due_km NUMERIC;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS parts_changed TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.bike_bookings ALTER COLUMN email DROP DEFAULT;

DELETE FROM public.bike_bookings WHERE booking_id IN ('CCM-LIVE-TEST-01', 'CCM-VERIFY-001') OR customer_name ILIKE '%Live Verified%' OR customer_name ILIKE '%Live Connection%' OR phone = '+918333084261';

CREATE TABLE IF NOT EXISTS public.bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS job_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS division TEXT DEFAULT '2W-PETROL';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_mobile TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_brand TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_reg TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS registration_no TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_class TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS engine_cc TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS machinery_spec TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_package TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_category TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS area_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pickup_fee NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pickup_charge NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS preferred_date TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS preferred_slot TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS preferred_time_window TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS street_address TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS google_maps_link TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS gps_coords TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS base_price NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Booking Confirmed';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_status TEXT DEFAULT 'received';
ALTER TABLE public.bookings ALTER COLUMN customer_email DROP DEFAULT;

DELETE FROM public.bookings WHERE job_id IN ('CCM-LIVE-TEST-01', 'CCM-VERIFY-001') OR customer_name ILIKE '%Live Verified%' OR customer_phone = '+918333084261';

CREATE TABLE IF NOT EXISTS public.customer_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id TEXT, customer_name TEXT, customer_phone TEXT, customer_email TEXT, description TEXT, status TEXT DEFAULT 'Booking Confirmed', created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.customer_requests ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.customer_requests ADD COLUMN IF NOT EXISTS customer_email TEXT;

CREATE TABLE IF NOT EXISTS public.job_cards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), job_card_no TEXT, booking_id TEXT, customer_name TEXT, customer_phone TEXT, vehicle_model TEXT, reg_number TEXT, odometer_km NUMERIC DEFAULT 0, next_service_due_km NUMERIC DEFAULT 3000, next_service_due_date TEXT, inspection_notes TEXT, parts_changed TEXT, labor_charge NUMERIC DEFAULT 0, parts_charge NUMERIC DEFAULT 0, total_amount NUMERIC DEFAULT 0, warranty_certificate_no TEXT, warranty_status TEXT DEFAULT '30-Day Unconditional Workmanship Guarantee Active', dispatched_by TEXT DEFAULT 'Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)', work_approved BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS job_card_no TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS reg_number TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS odometer_km NUMERIC DEFAULT 0;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS next_service_due_km NUMERIC DEFAULT 3000;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS next_service_due_date TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS parts_changed TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS warranty_certificate_no TEXT;
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS warranty_status TEXT DEFAULT '30-Day Unconditional Workmanship Guarantee Active';
ALTER TABLE public.job_cards ADD COLUMN IF NOT EXISTS dispatched_by TEXT DEFAULT 'Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)';

CREATE TABLE IF NOT EXISTS public.family_vehicles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_phone TEXT NOT NULL, customer_name TEXT, vehicle_brand TEXT NOT NULL, vehicle_model TEXT NOT NULL, reg_number TEXT NOT NULL, vehicle_class TEXT, engine_cc TEXT, odometer_km NUMERIC DEFAULT 0, last_service_date TEXT, next_service_due_date TEXT, next_service_due_km NUMERIC, parts_changed_history TEXT, warranty_status TEXT DEFAULT '30-Day Workmanship Guarantee Active', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());

GRANT USAGE ON SCHEMA public TO anon, authenticated, public;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, public;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, public;

ALTER TABLE public.bike_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_bike_bookings_all" ON public.bike_bookings;
CREATE POLICY "ccm_bike_bookings_all" ON public.bike_bookings FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_bookings_all" ON public.bookings;
CREATE POLICY "ccm_bookings_all" ON public.bookings FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_customer_requests_all" ON public.customer_requests;
CREATE POLICY "ccm_customer_requests_all" ON public.customer_requests FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_job_cards_all" ON public.job_cards;
CREATE POLICY "ccm_job_cards_all" ON public.job_cards FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.family_vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_family_vehicles_all" ON public.family_vehicles;
CREATE POLICY "ccm_family_vehicles_all" ON public.family_vehicles FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
