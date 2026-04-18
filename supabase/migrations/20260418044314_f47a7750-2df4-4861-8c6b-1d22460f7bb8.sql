-- 1. Add pickup_slot to orders (text key like "2026-05-01T14:00" for uniqueness)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_slot TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS orders_pickup_slot_unique
  ON public.orders (pickup_slot)
  WHERE pickup_slot IS NOT NULL AND status <> 'cancelled';

-- 2. Blackout dates table
CREATE TABLE IF NOT EXISTS public.blackout_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blackout_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blackout_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blackout dates"
  ON public.blackout_dates FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert blackout dates"
  ON public.blackout_dates FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blackout dates"
  ON public.blackout_dates FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blackout dates"
  ON public.blackout_dates FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Trigger: enforce max 3 orders/day (excluding cancelled) and no blackout
CREATE OR REPLACE FUNCTION public.check_pickup_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pickup_day DATE;
  day_count INT;
BEGIN
  IF NEW.pickup_at IS NULL THEN
    RETURN NEW;
  END IF;

  pickup_day := (NEW.pickup_at AT TIME ZONE 'UTC')::date;

  -- Blackout check
  IF EXISTS (SELECT 1 FROM public.blackout_dates WHERE blackout_date = pickup_day) THEN
    RAISE EXCEPTION 'This date is unavailable for pickup';
  END IF;

  -- Daily cap (3 active orders/day)
  SELECT COUNT(*) INTO day_count
  FROM public.orders
  WHERE (pickup_at AT TIME ZONE 'UTC')::date = pickup_day
    AND status <> 'cancelled'
    AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

  IF day_count >= 3 THEN
    RAISE EXCEPTION 'This date is fully booked (3 orders maximum per day)';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_pickup_capacity ON public.orders;
CREATE TRIGGER enforce_pickup_capacity
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.check_pickup_capacity();

-- 4. Admin policies on existing tables
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products delete"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view besties"
  ON public.besties FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));