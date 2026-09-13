CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

ALTER POLICY "profiles_read_own_or_admin" ON public.profiles USING (id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "profiles_update_own_or_admin" ON public.profiles USING (id = auth.uid() OR private.has_role(auth.uid(), 'admin')) WITH CHECK (id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "roles_read_own_or_admin" ON public.user_roles USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "roles_admin_insert" ON public.user_roles WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "roles_admin_update" ON public.user_roles USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "roles_admin_delete" ON public.user_roles USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "categories_public_read" ON public.categories USING (active OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "categories_admin_insert" ON public.categories WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "categories_admin_update" ON public.categories USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "categories_admin_delete" ON public.categories USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "products_public_read" ON public.products USING (active OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "products_admin_insert" ON public.products WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "products_admin_update" ON public.products USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "products_admin_delete" ON public.products USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "product_images_admin_all" ON public.product_images USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "inventory_admin_all" ON public.inventory_movements USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "quotes_customer_read" ON public.quotes USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "quotes_admin_update" ON public.quotes USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "quotes_admin_delete" ON public.quotes USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "quote_items_owner_read" ON public.quote_items USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND (q.user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'))));
ALTER POLICY "quote_items_owner_insert" ON public.quote_items WITH CHECK (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND (q.user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'))));
ALTER POLICY "quote_items_admin_update" ON public.quote_items USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "quote_items_admin_delete" ON public.quote_items USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "company_admin_insert" ON public.company_settings WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "company_admin_update" ON public.company_settings USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "company_admin_delete" ON public.company_settings USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "banners_public_read" ON public.banners USING (active OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY "banners_admin_all" ON public.banners USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "catalog_assets_admin_read" ON storage.objects USING (bucket_id = 'catalog-assets' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "catalog_assets_admin_insert" ON storage.objects WITH CHECK (bucket_id = 'catalog-assets' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "catalog_assets_admin_update" ON storage.objects USING (bucket_id = 'catalog-assets' AND private.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'catalog-assets' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "catalog_assets_admin_delete" ON storage.objects USING (bucket_id = 'catalog-assets' AND private.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION private.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
DROP TRIGGER on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();
DROP FUNCTION public.handle_new_user();
DROP FUNCTION public.has_role(uuid, public.app_role);