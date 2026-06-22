ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS landing_path text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS search_query text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS gclid text;

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid primary key default gen_random_uuid(),
  receptionist_id uuid references public.receptionists(id) on delete set null,
  kind text not null default 'calendly',
  destination text,
  page_path text,
  landing_path text,
  referrer text,
  search_query text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  user_agent text,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read bookings" ON public.bookings
  FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_utm_source_idx ON public.bookings (utm_source);
CREATE INDEX IF NOT EXISTS leads_utm_source_idx ON public.leads (utm_source);