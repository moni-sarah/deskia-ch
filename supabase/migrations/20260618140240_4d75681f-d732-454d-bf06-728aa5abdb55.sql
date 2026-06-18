
CREATE TABLE public.receptionists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL DEFAULT 'My Business',
  description TEXT NOT NULL DEFAULT '',
  faqs TEXT NOT NULL DEFAULT '',
  calendly_15 TEXT,
  calendly_30 TEXT,
  sheet_url TEXT,
  notif_email TEXT,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.receptionists TO authenticated;
GRANT SELECT ON public.receptionists TO anon;
GRANT ALL ON public.receptionists TO service_role;

ALTER TABLE public.receptionists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own receptionist"
  ON public.receptionists FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public can read minimal info for the chat widget (we'll project columns in code)
CREATE POLICY "Public can read receptionists by slug"
  ON public.receptionists FOR SELECT TO anon
  USING (true);

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receptionist_id UUID NOT NULL REFERENCES public.receptionists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read their leads"
  ON public.leads FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.receptionists r WHERE r.id = receptionist_id AND r.user_id = auth.uid()));

CREATE POLICY "Owners delete their leads"
  ON public.leads FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.receptionists r WHERE r.id = receptionist_id AND r.user_id = auth.uid()));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER receptionists_touch BEFORE UPDATE ON public.receptionists
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create receptionist on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.receptionists (user_id, slug, notif_email)
  VALUES (
    NEW.id,
    lower(substring(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    NEW.email
  );
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
