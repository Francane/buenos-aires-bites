ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- Public read of check-ins so feed on venue page works
DROP POLICY IF EXISTS "Check-ins are viewable by everyone" ON public.check_ins;
CREATE POLICY "Check-ins are viewable by everyone"
  ON public.check_ins FOR SELECT
  USING (true);

GRANT SELECT ON public.check_ins TO anon;
GRANT SELECT ON public.venue_reviews TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.venues TO anon;