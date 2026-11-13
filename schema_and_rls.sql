-- ============================================================================
-- CC MOTOCRAFTS AI ENGINE LABS SERVICE (https://ccmotocrafts.in)
-- ALL-IN-ONE MASTER SUPABASE SQL SETUP (COPY & RUN ONCE IN SUPABASE SQL EDITOR)
-- ============================================================================
-- Exact 1-to-1 Keyword Mapping between Website Booking Form & Supabase Tables:
--   1. public.bike_bookings  (Primary 2-Wheeler Bookings Table)
--   2. public.bookings       (Universal Bookings Table)
--   3. public.customer_reviews (Public Star Ratings & Work Completion Feedback)
--   4. public.customer_requests (Quick AI Chat & WhatsApp Lead Capture)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- TABLE 1: public.bike_bookings (100% Matching Website Form Keywords)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bike_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    booking_id TEXT,
    customer_name TEXT,
    phone TEXT,
    email TEXT DEFAULT 'info@ccmotocrafts.in',
    vehicle_brand TEXT,
    bike_model TEXT,
    reg_number TEXT,
    vehicle_class TEXT,
    engine_cc TEXT,
    service_type TEXT,
    area TEXT,
    pincode TEXT,
    booking_date TEXT,
    time_slot TEXT,
    complaint_note TEXT,
    address TEXT,
    landmark TEXT,
    gps_coords TEXT,
    rating NUMERIC,
    feedback TEXT,
    status TEXT DEFAULT 'Booking Confirmed',
    odometer_km NUMERIC,
    service_date TEXT,
    engine_warranty_status TEXT DEFAULT '30-Day Workmanship Guarantee',
    warranty_parts_covered TEXT DEFAULT '100% Genuine OEM Parts (WhatsApp Approved Only)',
    warranty_void_rule TEXT DEFAULT 'Zero Unapproved Parts — Not Even 1 Paisa Added Without Consent',
    pickup_zone_type TEXT DEFAULT 'VIP_FREE',
    pickup_charge NUMERIC DEFAULT 0,
    cancellation_penalty NUMERIC DEFAULT 300,
    total_dispatch_fee NUMERIC DEFAULT 0,
    vehicle_displacement_cc TEXT,
    workmanship_guarantee_days INTEGER DEFAULT 30,
    admin_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure every single website keyword column exists even if table was created earlier:
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS booking_id TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'info@ccmotocrafts.in';
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_brand TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS bike_model TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS reg_number TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_class TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS engine_cc TEXT;
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
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS pickup_zone_type TEXT DEFAULT 'VIP_FREE';
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS pickup_charge NUMERIC DEFAULT 0;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS cancellation_penalty NUMERIC DEFAULT 300;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS total_dispatch_fee NUMERIC DEFAULT 0;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS vehicle_displacement_cc TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS workmanship_guarantee_days INTEGER DEFAULT 30;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.bike_bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- TABLE 2: public.bookings (Universal Bookings Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT,
    booking_code TEXT,
    division TEXT DEFAULT '2W',
    customer_name TEXT,
    customer_phone TEXT,
    customer_mobile TEXT,
    customer_email TEXT DEFAULT 'info@ccmotocrafts.in',
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_reg TEXT,
    registration_no TEXT,
    vehicle_class TEXT,
    engine_cc TEXT,
    machinery_spec TEXT,
    service_package TEXT,
    service_category TEXT,
    complaint_notes TEXT,
    customer_notes TEXT,
    area_name TEXT,
    pincode TEXT,
    pickup_fee NUMERIC DEFAULT 0,
    pickup_charge NUMERIC DEFAULT 0,
    cancellation_fee NUMERIC DEFAULT 300,
    preferred_date TEXT,
    preferred_slot TEXT,
    preferred_time_window TEXT,
    street_address TEXT,
    landmark TEXT,
    google_maps_link TEXT,
    gps_coords TEXT,
    base_price NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Booking Confirmed',
    booking_status TEXT DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS job_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS division TEXT DEFAULT '2W';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_mobile TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email TEXT DEFAULT 'info@ccmotocrafts.in';
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
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_fee NUMERIC DEFAULT 300;
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

-- ----------------------------------------------------------------------------
-- TABLE 3: public.customer_reviews (Customer Star Ratings & Work Completion)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT,
    rating INTEGER DEFAULT 5,
    review_text TEXT,
    display_name TEXT,
    moderation_status TEXT DEFAULT 'approved',
    customer_consent_to_publish BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 4: public.customer_requests (AI Assistant & Quick WhatsApp Leads)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT,
    customer_phone TEXT,
    description TEXT,
    status TEXT DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- UNBLOCK PERMISSIONS & ROW-LEVEL SECURITY (RLS) FOR WEBSITE BOOKINGS
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;
GRANT ALL ON TABLE public.bike_bookings TO anon, authenticated, public;
GRANT ALL ON TABLE public.bookings TO anon, authenticated, public;
GRANT ALL ON TABLE public.customer_reviews TO anon, authenticated, public;
GRANT ALL ON TABLE public.customer_requests TO anon, authenticated, public;

ALTER TABLE public.bike_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_bike_bookings_all" ON public.bike_bookings;
CREATE POLICY "ccm_bike_bookings_all"
    ON public.bike_bookings FOR ALL
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_bookings_all" ON public.bookings;
CREATE POLICY "ccm_bookings_all"
    ON public.bookings FOR ALL
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_customer_reviews_all" ON public.customer_reviews;
CREATE POLICY "ccm_customer_reviews_all"
    ON public.customer_reviews FOR ALL
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ccm_customer_requests_all" ON public.customer_requests;
CREATE POLICY "ccm_customer_requests_all"
    ON public.customer_requests FOR ALL
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

-- Reload PostgREST Schema Cache immediately so new columns work in 0 seconds:
NOTIFY pgrst, 'reload schema';

-- Insert 1 Verification Lead Row so you can immediately see it in Table Editor:
INSERT INTO public.bike_bookings (
    booking_id, customer_name, phone, email, vehicle_brand, bike_model,
    reg_number, vehicle_class, engine_cc, service_type, area, pincode,
    booking_date, time_slot, complaint_note, address, landmark,
    status, pickup_zone_type, pickup_charge, cancellation_penalty
) VALUES (
    'CCM-VERIFY-001',
    'CC Motocrafts Live Connection Test',
    '+918333084261',
    'info@ccmotocrafts.in',
    'Kawasaki',
    'Z900 Superbike',
    'TS09CCM001',
    'Multi-Cylinder Superbike (600–2500cc)',
    '900cc',
    'FI/ECU diagnostics',
    'Jubilee Hills / Film Nagar',
    '500033',
    CURRENT_DATE::TEXT,
    '11:00–13:00',
    'Supabase Live Table Connection Verified — Ready for Customer Bookings!',
    'Road No. 45, Jubilee Hills',
    'Peddamma Temple Metro',
    'Booking Confirmed',
    'VIP_FREE',
    0,
    300
);
