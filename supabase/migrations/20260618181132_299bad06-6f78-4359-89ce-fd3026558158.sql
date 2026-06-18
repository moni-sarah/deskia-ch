ALTER TABLE public.receptionists
  ADD COLUMN IF NOT EXISTS webhook_url text;