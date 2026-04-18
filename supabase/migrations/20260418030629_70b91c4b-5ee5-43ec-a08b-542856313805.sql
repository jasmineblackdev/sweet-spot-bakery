-- ROLES
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profile owner read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Profile owner update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- PRODUCTS
create type public.product_category as enum ('sweet_treat', 'shop', 'on_site_only');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  category product_category not null default 'sweet_treat',
  image_url text,
  available boolean not null default true,
  preorder_only boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Products public read" on public.products for select to anon, authenticated using (true);
create policy "Admins manage products" on public.products for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ORDERS
create type public.order_status as enum ('pending', 'paid', 'ready', 'picked_up', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  pickup_at timestamptz,
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,
  status order_status not null default 'pending',
  notes text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Customers see own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "Anyone create order" on public.orders for insert to anon, authenticated with check (true);
create policy "Admins manage orders" on public.orders for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0)
);
alter table public.order_items enable row level security;
create policy "Order items owner read" on public.order_items for select to authenticated
using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Anyone insert order items" on public.order_items for insert to anon, authenticated with check (true);
create policy "Admins manage order items" on public.order_items for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- BESTIES
create table public.besties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  birthday date,
  created_at timestamptz not null default now()
);
alter table public.besties enable row level security;
create policy "Anyone join besties" on public.besties for insert to anon, authenticated with check (true);
create policy "Admins read besties" on public.besties for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage besties" on public.besties for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- STORAGE
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images public read" on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update product images" on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete product images" on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- SEED
insert into public.products (name, description, price_cents, category, sort_order) values
  ('Banana Bread — Chocolate', 'Moist banana bread with rich chocolate chips.', 800, 'sweet_treat', 1),
  ('Banana Bread — Plain', 'Classic homestyle banana bread.', 700, 'sweet_treat', 2),
  ('Chocolate Cake', 'Rich layered chocolate cake.', 3500, 'sweet_treat', 3),
  ('Vanilla Cake', 'Light, fluffy vanilla cake with buttercream.', 3500, 'sweet_treat', 4),
  ('Chocolate Muffin', 'Bakery-style double chocolate muffin.', 400, 'sweet_treat', 5),
  ('Blueberry Muffin', 'Loaded with fresh blueberries.', 400, 'sweet_treat', 6),
  ('Cookies (half dozen)', 'Soft-baked, your choice of flavor.', 1500, 'sweet_treat', 7),
  ('Brownies (half dozen)', 'Fudgy, rich, and chewy.', 1500, 'sweet_treat', 8),
  ('Rice Krispies Treats', 'Buttery and gooey, made fresh.', 350, 'sweet_treat', 9),
  ('Coconut Lemonade', 'Made with coconut water — refreshing twist.', 500, 'sweet_treat', 10),
  ('Sweet Tea', 'Southern-style sweet tea.', 400, 'sweet_treat', 11),
  ('AOVO Cologne Candle', 'Hand-poured cologne-scented candle.', 2400, 'shop', 1),
  ('AOVO Lavender Woods Candle', 'Calming lavender and warm woods.', 2400, 'shop', 2),
  ('AOVO Vintage Leather Candle', 'Smoky leather and amber notes.', 2400, 'shop', 3),
  ('Frosted Remedies Tumbler — Black', '20oz insulated tumbler with brand logo.', 2800, 'shop', 4),
  ('Frosted Remedies Tumbler — White', '20oz insulated tumbler with brand logo.', 2800, 'shop', 5);