DROP POLICY IF EXISTS products_public_read ON public.products;
CREATE POLICY products_public_active_read ON public.products FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY products_admin_read_all ON public.products FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS categories_public_read ON public.categories;
CREATE POLICY categories_public_active_read ON public.categories FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY categories_admin_read_all ON public.categories FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS banners_public_read ON public.banners;
CREATE POLICY banners_public_active_read ON public.banners FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY banners_admin_read_all ON public.banners FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));