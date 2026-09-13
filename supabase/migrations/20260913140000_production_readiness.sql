-- Make a fresh Supabase project usable without manual seed steps.
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-assets', 'catalog-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO public.company_settings (
  company_name, whatsapp, phone, email, instagram_handle, instagram_url,
  address_line, neighborhood, city_state, business_hours, google_maps_url
)
SELECT
  'Depósito Araucária', '554432640413', '(44) 3264-0413', NULL,
  '@depositoaraucaria', 'https://www.instagram.com/depositoaraucaria/',
  'Av. Felício Turquinio, 632', 'Jardim Nova Independência', 'Sarandi - PR',
  '{"monday_friday":"08:00 às 18:00","saturday":"08:00 às 12:00","sunday":"Fechado"}'::jsonb,
  'https://www.google.com/maps/search/?api=1&query=Av.+Fel%C3%ADcio+Turquinio,+632,+Sarandi+-+PR'
WHERE NOT EXISTS (SELECT 1 FROM public.company_settings);
