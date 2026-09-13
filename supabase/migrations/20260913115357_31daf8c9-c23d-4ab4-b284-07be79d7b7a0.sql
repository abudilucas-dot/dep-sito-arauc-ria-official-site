GRANT SELECT ON public.products, public.categories, public.product_images, public.company_settings, public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products, public.categories, public.product_images, public.company_settings, public.banners, public.inventory_movements, public.quotes, public.quote_items, public.favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.products, public.categories, public.product_images, public.company_settings, public.banners, public.inventory_movements, public.quotes, public.quote_items, public.favorites, public.profiles, public.user_roles TO service_role;