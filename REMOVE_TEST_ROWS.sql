DELETE FROM public.bike_bookings WHERE booking_id IN ('CCM-LIVE-TEST-01', 'CCM-VERIFY-001') OR customer_name LIKE '%Live Verified%' OR customer_name LIKE '%Live Website Connection%' OR customer_name LIKE '%Live Connection Test%';
DELETE FROM public.bookings WHERE job_id IN ('CCM-LIVE-TEST-01', 'CCM-VERIFY-001') OR customer_name LIKE '%Live Verified%' OR customer_name LIKE '%Live Website Connection%';
ALTER TABLE public.bike_bookings ALTER COLUMN email DROP DEFAULT;
ALTER TABLE public.bookings ALTER COLUMN customer_email DROP DEFAULT;
