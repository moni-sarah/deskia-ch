
-- Strip auth: convert to single-tenant. Drop signup trigger, make user_id optional, allow public access.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

ALTER TABLE public.receptionists DROP CONSTRAINT IF EXISTS receptionists_user_id_fkey;
ALTER TABLE public.receptionists ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.receptionists DROP CONSTRAINT IF EXISTS receptionists_user_id_key;

DROP POLICY IF EXISTS "Users manage their own receptionist" ON public.receptionists;
DROP POLICY IF EXISTS "Public can read receptionists by slug" ON public.receptionists;
DROP POLICY IF EXISTS "Owners read their leads" ON public.leads;
DROP POLICY IF EXISTS "Owners delete their leads" ON public.leads;

-- Open policies; the app uses the service-role admin client server-side anyway.
CREATE POLICY "Anyone can read receptionists" ON public.receptionists FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update receptionists" ON public.receptionists FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can read leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete leads" ON public.leads FOR DELETE TO anon, authenticated USING (true);

GRANT SELECT ON public.leads TO anon;

-- Seed singleton receptionist
INSERT INTO public.receptionists (slug, business_name)
SELECT 'demo', 'My Business'
WHERE NOT EXISTS (SELECT 1 FROM public.receptionists);
