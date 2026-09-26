-- Submit an entire quote in one database transaction so failed item inserts never leave partial requests.
CREATE OR REPLACE FUNCTION public.create_quote_with_items(
  _customer_name text,
  _customer_phone text,
  _customer_email text,
  _items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _quote_id uuid;
  _item jsonb;
  _product public.products%ROWTYPE;
  _quantity integer;
  _estimated_total numeric(12, 2) := 0;
  _has_unpriced_item boolean := false;
BEGIN
  IF length(trim(coalesce(_customer_name, ''))) < 2
    OR length(trim(coalesce(_customer_phone, ''))) < 8 THEN
    RAISE EXCEPTION 'Nome e telefone são obrigatórios.';
  END IF;

  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) = 0 OR jsonb_array_length(_items) > 100 THEN
    RAISE EXCEPTION 'A lista de materiais é inválida.';
  END IF;

  INSERT INTO public.quotes (user_id, customer_name, customer_phone, customer_email, notes)
  VALUES (
    auth.uid(),
    trim(_customer_name),
    trim(_customer_phone),
    nullif(trim(coalesce(_customer_email, '')), ''),
    'Solicitado pelo site via Minha Lista.'
  )
  RETURNING id INTO _quote_id;

  FOR _item IN SELECT value FROM jsonb_array_elements(_items)
  LOOP
    _quantity := nullif(_item ->> 'quantity', '')::integer;
    IF _quantity IS NULL OR _quantity < 1 OR _quantity > 10000 THEN
      RAISE EXCEPTION 'Quantidade inválida.';
    END IF;

    SELECT * INTO _product
    FROM public.products
    WHERE id = (_item ->> 'product_id')::uuid
      AND active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Um produto da lista não está mais disponível.';
    END IF;

    INSERT INTO public.quote_items (quote_id, product_id, product_name, quantity, unit_price)
    VALUES (
      _quote_id,
      _product.id,
      _product.name,
      _quantity,
      coalesce(_product.promotional_price, _product.price)
    );

    IF coalesce(_product.promotional_price, _product.price) IS NULL THEN
      _has_unpriced_item := true;
    ELSE
      _estimated_total := _estimated_total + (coalesce(_product.promotional_price, _product.price) * _quantity);
    END IF;
  END LOOP;

  UPDATE public.quotes
  SET estimated_total = CASE WHEN _has_unpriced_item THEN NULL ELSE _estimated_total END
  WHERE id = _quote_id;

  RETURN _quote_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_quote_with_items(text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_quote_with_items(text, text, text, jsonb) TO anon, authenticated;
