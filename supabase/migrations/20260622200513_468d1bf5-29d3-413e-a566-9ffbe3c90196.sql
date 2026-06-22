ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS event_name text,
  ADD COLUMN IF NOT EXISTS calendly_event_uri text,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

CREATE UNIQUE INDEX IF NOT EXISTS bookings_calendly_invitee_uri_key
  ON public.bookings (calendly_invitee_uri)
  WHERE calendly_invitee_uri IS NOT NULL;