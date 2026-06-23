-- bookings: drop public read (writes go through service role)
DROP POLICY IF EXISTS "Anyone can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.bookings FROM anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

-- leads: drop public read & delete (writes via service role)
DROP POLICY IF EXISTS "Anyone can read leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can delete leads" ON public.leads;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.leads FROM anon, authenticated;
GRANT ALL ON public.leads TO service_role;

-- receptionists: drop unrestricted public read & update (server fns use service role)
DROP POLICY IF EXISTS "Anyone can read receptionists" ON public.receptionists;
DROP POLICY IF EXISTS "Anyone can update receptionists" ON public.receptionists;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.receptionists FROM anon, authenticated;
GRANT ALL ON public.receptionists TO service_role;