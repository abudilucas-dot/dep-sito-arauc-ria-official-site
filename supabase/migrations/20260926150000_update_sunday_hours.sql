-- The store opens on every Sunday except the last Sunday of the month.
UPDATE public.company_settings
SET business_hours = COALESCE(business_hours, '{}'::jsonb) || jsonb_build_object(
  'sunday',
  'Domingos (exceto o último): 08:00 às 12:00; último domingo: Fechado'
);