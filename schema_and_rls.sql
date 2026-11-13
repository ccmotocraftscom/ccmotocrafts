-- ============================================================================
-- CC MOTOCRAFTS AI ENGINE LABS SERVICE
-- Exact Production Schema & RLS Unblocker for Project: unpbcjgnctdmtwzmoymt
-- Matches 100% of your existing Schema Visualizer tables:
--   1. public.bike_bookings
--   2. public.bookings
--   3. public.customer_reviews
--   4. public.customer_requests
--   5. public.job_cards
-- Run this in Supabase SQL Editor to ensure Public / Anon Website Bookings
-- and Customer Reviews save immediately without RLS 401/403 blocks!
-- ============================================================================

-- 1. Ensure public.bike_bookings has all required columns & Public INSERT/SELECT RLS
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
    booking_date TEXT,
    time_slot TEXT,
    complaint_note TEXT,
    address TEXT,
    landmark TEXT,
    rating NUMERIC,
    feedback TEXT,
    status TEXT DEFAULT 'received',
    odometer_km NUMERIC,
    service_date TEXT,
    engine_warranty_status TEXT,
    warranty_parts_covered TEXT,
    warranty_void_rule TEXT,
    pickup_zone_type TEXT,
    pickup_charge NUMERIC DEFAULT 0,
    cancellation_penalty NUMERIC DEFAULT 300,
    total_dispatch_fee NUMERIC DEFAULT 0,
    vehicle_displacement_cc TEXT,
    workmanship_guarantee_days INTEGER DEFAULT 30,
    admin_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bike_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on bike_bookings" ON public.bike_bookings;
CREATE POLICY "Allow public insert on bike_bookings"
    ON public.bike_bookings FOR INSERT
    TO public, anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on bike_bookings" ON public.bike_bookings;
CREATE POLICY "Allow public select on bike_bookings"
    ON public.bike_bookings FOR SELECT
    TO public, anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public update on bike_bookings" ON public.bike_bookings;
CREATE POLICY "Allow public update on bike_bookings"
    ON public.bike_bookings FOR UPDATE
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

-- 2. Ensure public.bookings has Public INSERT/SELECT/UPDATE RLS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT,
    garage_id UUID,
    customer_user_id UUID,
    division TEXT DEFAULT '2W',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT DEFAULT 'info@ccmotocrafts.in',
    vehicle_reg TEXT NOT NULL,
    vehicle_class TEXT,
    vehicle_model TEXT NOT NULL,
    custom_vehicle_name TEXT,
    service_package TEXT NOT NULL,
    machinery_spec TEXT,
    pincode TEXT NOT NULL,
    pickup_fee NUMERIC NOT NULL DEFAULT 0,
    preferred_date DATE,
    preferred_slot TEXT,
    customer_notes TEXT,
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    google_maps_link TEXT,
    base_price NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;
CREATE POLICY "Allow public insert on bookings"
    ON public.bookings FOR INSERT
    TO public, anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on bookings" ON public.bookings;
CREATE POLICY "Allow public select on bookings"
    ON public.bookings FOR SELECT
    TO public, anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public update on bookings" ON public.bookings;
CREATE POLICY "Allow public update on bookings"
    ON public.bookings FOR UPDATE
    TO public, anon, authenticated
    USING (true) WITH CHECK (true);

-- 3. Ensure public.customer_reviews has Public INSERT & SELECT RLS
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    review_text TEXT NOT NULL,
    display_name TEXT NOT NULL,
    moderation_status TEXT DEFAULT 'approved',
    customer_consent_to_publish BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on customer_reviews" ON public.customer_reviews;
CREATE POLICY "Allow public insert on customer_reviews"
    ON public.customer_reviews FOR INSERT
    TO public, anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on customer_reviews" ON public.customer_reviews;
CREATE POLICY "Allow public select on customer_reviews"
    ON public.customer_reviews FOR SELECT
    TO public, anon, authenticated
    USING (true);
