-- ============================================================================
-- CC MOTOCRAFTS AI ENGINE LABS SERVICE (100cc - 2500cc TWO-WHEELER PLATFORM)
-- Complete Production PostgreSQL Schema, RLS Policies, Triggers & Seed Data
-- Official Email: info@ccmotocrafts.in | Official WhatsApp: +91 8333084261
-- Publishable Key Configured: sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I
-- Safe Migration: Preserves existing tables & data using IF NOT EXISTS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT DEFAULT 'info@ccmotocrafts.in',
    area_name TEXT,
    pincode TEXT NOT NULL,
    street_address TEXT,
    landmark TEXT,
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    gps_maps_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    custom_model TEXT,
    registration_no TEXT NOT NULL,
    vehicle_class TEXT NOT NULL CHECK (vehicle_class IN (
        'Scooter / Gearless',
        'Commuter (100–160cc)',
        'Sports (200–500cc)',
        'Multi-Cylinder Superbike (600–2500cc)'
    )),
    engine_cc TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE PRICING TABLE (Dynamic CRUD by Master Owner Admin)
CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    category TEXT NOT NULL,
    scooter_price INTEGER NOT NULL DEFAULT 999,
    commuter_price INTEGER NOT NULL DEFAULT 1199,
    sports_price INTEGER NOT NULL DEFAULT 2199,
    superbike_price INTEGER NOT NULL DEFAULT 4499,
    labor_charge INTEGER NOT NULL DEFAULT 499,
    warranty_terms TEXT DEFAULT '30-Day Unconditional Workmanship Guarantee',
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PARTNER GARAGES & STAFF TABLE
CREATE TABLE IF NOT EXISTS public.partner_garages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_code TEXT UNIQUE NOT NULL,
    garage_name TEXT NOT NULL,
    owner_or_tech_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('master_owner', 'manager', 'partner', 'technician')),
    mobile TEXT NOT NULL,
    email TEXT,
    zone_cluster TEXT NOT NULL,
    covered_pincodes TEXT[] DEFAULT '{}',
    is_online BOOLEAN DEFAULT TRUE,
    account_status TEXT NOT NULL DEFAULT 'approved' CHECK (account_status IN ('pending', 'approved', 'suspended', 'revoked')),
    flatbed_van_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 4.90,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACTIVE SESSIONS TABLE (Remote Kill-Switch & Instant Session Revocation)
CREATE TABLE IF NOT EXISTS public.active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.partner_garages(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_reason TEXT,
    revoked_by TEXT,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BOOKINGS TABLE (Instant Customer Intake & Dispatch Tracker)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    customer_email TEXT DEFAULT 'info@ccmotocrafts.in',
    vehicle_brand TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    registration_no TEXT NOT NULL,
    vehicle_class TEXT NOT NULL,
    engine_cc TEXT NOT NULL,
    service_category TEXT NOT NULL,
    complaint_notes TEXT,
    area_name TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_vip_free_pickup BOOLEAN DEFAULT FALSE,
    pickup_charge INTEGER NOT NULL DEFAULT 0,
    cancellation_fee INTEGER NOT NULL DEFAULT 300,
    preferred_date DATE NOT NULL,
    preferred_time_window TEXT NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT NOT NULL,
    gps_coords TEXT,
    assigned_partner_id UUID REFERENCES public.partner_garages(id) ON DELETE SET NULL,
    bay_number TEXT DEFAULT 'BAY-01',
    booking_status TEXT NOT NULL DEFAULT 'received' CHECK (booking_status IN (
        'received',
        'pickup_dispatched',
        'in_inspection',
        'awaiting_whatsapp_approval',
        'repair_in_progress',
        'qc_testing',
        'ready_for_delivery',
        'completed',
        'cancelled'
    )),
    customer_parts_approval_status TEXT NOT NULL DEFAULT 'pending_inspection' CHECK (customer_parts_approval_status IN (
        'pending_inspection',
        'quotation_sent_on_whatsapp',
        'approved_by_customer',
        'declined_no_extra_parts'
    )),
    estimated_cost INTEGER DEFAULT 0,
    source_channel TEXT DEFAULT 'website_direct',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOB CARDS & DIGITAL APPROVAL WORKFLOW TABLE
CREATE TABLE IF NOT EXISTS public.job_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_card_no TEXT UNIQUE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES public.partner_garages(id) ON DELETE SET NULL,
    technician_name TEXT DEFAULT 'Mr. Shaik Mujahid Qadri',
    obd_ecu_fault_codes TEXT,
    inspection_findings TEXT NOT NULL,
    recommended_genuine_parts JSONB DEFAULT '[]'::jsonb,
    parts_total_inr INTEGER NOT NULL DEFAULT 0,
    labor_total_inr INTEGER NOT NULL DEFAULT 0,
    pickup_charge_inr INTEGER NOT NULL DEFAULT 0,
    grand_total_inr INTEGER NOT NULL DEFAULT 0,
    inspection_photo_urls TEXT[] DEFAULT '{}',
    whatsapp_approval_requested_at TIMESTAMPTZ,
    customer_approval_decision TEXT DEFAULT 'pending' CHECK (customer_approval_decision IN (
        'pending',
        'approved',
        'rejected_labor_only'
    )),
    customer_approved_at TIMESTAMPTZ,
    zero_unapproved_parts_pledge BOOLEAN DEFAULT TRUE,
    qc_checklist_passed BOOLEAN DEFAULT FALSE,
    warranty_certificate_no TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS TABLE (Complete Administrative & Security Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action_type TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public / Anon Policies so Website Customer Booking & Live Tracker work seamlessly
DROP POLICY IF EXISTS "Public read active service pricing" ON public.service_pricing;
CREATE POLICY "Public read active service pricing"
    ON public.service_pricing FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin CRUD service pricing" ON public.service_pricing;
CREATE POLICY "Admin CRUD service pricing"
    ON public.service_pricing FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public select bookings for tracker" ON public.bookings;
CREATE POLICY "Public select bookings for tracker"
    ON public.bookings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin and Partner update bookings" ON public.bookings;
CREATE POLICY "Admin and Partner update bookings"
    ON public.bookings FOR UPDATE
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert customers" ON public.customers;
CREATE POLICY "Public insert customers"
    ON public.customers FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public select customers" ON public.customers;
CREATE POLICY "Public select customers"
    ON public.customers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public insert vehicles" ON public.vehicles;
CREATE POLICY "Public insert vehicles"
    ON public.vehicles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public select vehicles" ON public.vehicles;
CREATE POLICY "Public select vehicles"
    ON public.vehicles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public read and update partner garages" ON public.partner_garages;
CREATE POLICY "Public read and update partner garages"
    ON public.partner_garages FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read and update job cards" ON public.job_cards;
CREATE POLICY "Public read and update job cards"
    ON public.job_cards FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Session verification and kill switch" ON public.active_sessions;
CREATE POLICY "Session verification and kill switch"
    ON public.active_sessions FOR ALL
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs insert and read" ON public.audit_logs;
CREATE POLICY "Audit logs insert and read"
    ON public.audit_logs FOR ALL
    USING (true) WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKETS (Inspection Photos, Job Sheets & Invoices)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('inspection-photos', 'inspection-photos', true),
    ('inspection-sheets', 'inspection-sheets', true),
    ('service-invoices', 'service-invoices', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DEFAULT SEED DATA (8 Mandatory Service Categories & Partner Garages)
-- ============================================================================
INSERT INTO public.service_pricing (service_code, service_name, category, scooter_price, commuter_price, sports_price, superbike_price, labor_charge, warranty_terms, description)
VALUES
    ('SRV-GEN', 'General Periodic Service & AI Multi-Point Inspection', 'General service', 899, 1099, 1999, 3999, 450, '30-Day Unconditional Workmanship Guarantee', 'Complete engine oil change, filter cleaning/replacement, chain/CVT lubrication, brake tuning, and 40-point diagnostic check.'),
    ('SRV-ENG', 'Complete Engine Repair, Overhaul & Precision Rebuild', 'Engine repair/rebuild', 3499, 4499, 7999, 16999, 2500, 'Major Engine Warranty (Crankshaft, Cylinder Bore, Valves) — First check 15-30 days / 500-750 km', 'Cylinder head resurfacing, valve seat lapping, piston & ring replacement, crankshaft balancing, and compression restoration.'),
    ('SRV-ECU', 'Computerized OBD-II / FI / ECU Diagnostics & Remapping', 'FI/ECU diagnostics', 499, 599, 999, 1999, 499, '30-Day Diagnostic & Sensor Calibration Guarantee', 'Live sensor telemetry, injector flow testing, throttle body synchronization, fault code clearing, and ECU remapping.'),
    ('SRV-ELC', 'Advanced Electrical, Wiring Harness & Sensor Troubleshooting', 'Electrical troubleshooting', 399, 499, 899, 1799, 399, '30-Day Electrical Workmanship Guarantee', 'Stator coil testing, rectifier/regulator check, wiring harness short-circuit repair, ABS sensor & digital cluster diagnostics.'),
    ('SRV-BRK', 'Brake Caliper Overhaul, ABS Bleeding & Fork Suspension Rebuild', 'Brake & suspension', 699, 899, 1599, 3299, 550, '30-Day Workmanship Guarantee', 'Front fork oil & seal replacement, monoshock tuning, sintered/ceramic pad replacement, and hydraulic ABS brake fluid bleeding.'),
    ('SRV-CLT', 'Clutch Assembly Overhaul, Slipper Clutch & CVT Transmission', 'Clutch & transmission', 799, 1199, 2199, 4499, 650, '30-Day Workmanship Guarantee', 'Clutch plate & pressure plate replacement, scooter CVT variator/roller/belt service, and sprocket drivetrain kit alignment.'),
    ('SRV-BAT', 'Battery Load Test, Self-Starter Motor & Charging System Care', 'Battery & starting', 299, 399, 699, 1299, 299, 'Manufacturer Battery Warranty + 30-Day Labor Guarantee', 'Digital CCA load testing, starter relay & carbon brush replacement, parasitic battery drain resolution.'),
    ('SRV-ACC', 'Chassis Alignment, Fairing Restoration & Accident Repair', 'Accident repair', 1999, 2499, 4999, 9999, 1500, '30-Day Structural & Paint Workmanship Guarantee', 'Laser fork & chassis alignment, OEM genuine fairing/body part replacement after prior WhatsApp quote approval.')
ON CONFLICT (service_code) DO NOTHING;

INSERT INTO public.partner_garages (partner_code, garage_name, owner_or_tech_name, role, mobile, email, zone_cluster, covered_pincodes, is_online, account_status, flatbed_van_available, rating)
VALUES
    ('CCM-HQ-01', 'CC Motocrafts AI Engine Labs HQ (Manikonda / Shaikpet Hub)', 'Mr. Shaik Mujahid Qadri (Master Tech)', 'master_owner', '+918333084261', 'info@ccmotocrafts.in', 'POST 2: Gachibowli, Financial District, Kokapet, Narsingi & Puppalguda', ARRAY['500032','500075','500089','500096'], true, 'approved', true, 4.95),
    ('CCM-PRT-02', 'CC Motocrafts VIP Hub — Jubilee & Banjara Hills', 'Syed Irfan (Senior Superbike Tech)', 'partner', '+918333084261', 'info@ccmotocrafts.in', 'POST 1: Jubilee Hills, Banjara Hills & Film Nagar Special', ARRAY['500033','500034','500096'], true, 'approved', true, 4.90),
    ('CCM-PRT-03', 'CC Motocrafts Cyberabad Bay — HITEC City & Kondapur', 'Ramesh Kumar (FI & ECU Specialist)', 'partner', '+918333084261', 'info@ccmotocrafts.in', 'POST 3: Hitech City, Madhapur, Kondapur & Lanco Hills', ARRAY['500081','500084','500089'], true, 'approved', true, 4.88),
    ('CCM-STF-04', 'Suspended Demo Bay — Old Partner Terminal', 'Vikram Reddy (Former Partner)', 'partner', '+919000000000', 'info@ccmotocrafts.in', 'Greater Hyderabad Zone', ARRAY['500028','500008'], false, 'revoked', false, 4.10)
ON CONFLICT (partner_code) DO NOTHING;
