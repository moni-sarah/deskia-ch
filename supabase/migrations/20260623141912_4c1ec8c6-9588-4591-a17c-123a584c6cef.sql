
-- Receptionists: owner-scoped access via user_id
CREATE POLICY "Users can view their own receptionist"
  ON public.receptionists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own receptionist"
  ON public.receptionists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own receptionist"
  ON public.receptionists FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own receptionist"
  ON public.receptionists FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Bookings: scoped to rows whose receptionist belongs to the user
CREATE POLICY "Users can view bookings for their receptionist"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = bookings.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert bookings for their receptionist"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = bookings.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can update bookings for their receptionist"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = bookings.receptionist_id AND r.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = bookings.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete bookings for their receptionist"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = bookings.receptionist_id AND r.user_id = auth.uid()
  ));

-- Leads: scoped to rows whose receptionist belongs to the user
CREATE POLICY "Users can view leads for their receptionist"
  ON public.leads FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = leads.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert leads for their receptionist"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = leads.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can update leads for their receptionist"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = leads.receptionist_id AND r.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = leads.receptionist_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete leads for their receptionist"
  ON public.leads FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.receptionists r
    WHERE r.id = leads.receptionist_id AND r.user_id = auth.uid()
  ));
