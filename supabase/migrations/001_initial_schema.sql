-- Newton's Hub initial schema blueprint
create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','admin');
create type public.order_status as enum ('pending','payment_pending_verification','payment_confirmed','processing','ready','out_for_delivery','delivered','cancelled');
create type public.payment_status as enum ('pending','pending_verification','successful','failed','refunded');
create type public.bundle_order_status as enum ('pending','payment_confirmed','processing','completed','failed','cancelled');
create type public.request_type as enum ('sell','swap');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  description text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  sku text unique,
  name text not null,
  slug text not null unique,
  brand text,
  model text,
  subcategory text,
  description text,
  specifications jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  storage text,
  color text,
  stock_type text,
  condition text,
  sealed_in_box boolean,
  network_lock text,
  battery_health_percent numeric check (battery_health_percent between 0 and 100),
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  cost_price numeric(12,2) check (cost_price is null or cost_price >= 0),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  low_stock_threshold integer not null default 2 check (low_stock_threshold >= 0),
  stock_tracking_mode text not null default 'exact' check (stock_tracking_mode in ('exact','status_only')),
  availability_status text not null default 'available' check (availability_status in ('available','out_of_stock','preorder','inactive')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  image_url text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  region text,
  city text,
  address_line text,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(customer_id, variant_id)
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2),
  total numeric(12,2),
  delivery_fee_confirmed boolean not null default false,
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending',
  fulfillment_method text not null default 'delivery' check (fulfillment_method in ('delivery','pickup')),
  full_name text not null,
  email text,
  phone text not null,
  region text,
  city text,
  delivery_address text,
  landmark text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_snapshot text not null,
  variant_snapshot jsonb not null default '{}'::jsonb,
  sku_snapshot text,
  unit_price_snapshot numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  reference text unique,
  provider text,
  payment_method text,
  amount numeric(12,2) not null check (amount >= 0),
  status public.payment_status not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create table public.data_bundles (
  id uuid primary key default gen_random_uuid(),
  network text not null,
  name text not null,
  data_gb numeric not null check (data_gb > 0),
  price numeric(12,2) not null check (price >= 0),
  validity text,
  activation_time text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(network, name, price)
);

create table public.bundle_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  bundle_id uuid not null references public.data_bundles(id),
  receiving_phone text not null,
  amount numeric(12,2) not null,
  payment_status public.payment_status not null default 'pending',
  status public.bundle_order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_offers (
  id uuid primary key default gen_random_uuid(),
  service_code text not null unique,
  name text not null,
  network text,
  price numeric(12,2) not null,
  active boolean not null default true,
  description text,
  created_at timestamptz not null default now()
);

create table public.buy_swap_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  request_type public.request_type not null,
  customer_name text,
  customer_phone text not null,
  current_brand text,
  current_model text,
  current_storage text,
  current_condition text,
  battery_health_percent numeric,
  imei_or_serial text,
  desired_product_id uuid references public.products(id) on delete set null,
  desired_variant_id uuid references public.product_variants(id) on delete set null,
  photo_urls jsonb not null default '[]'::jsonb,
  customer_notes text,
  admin_status text not null default 'submitted',
  admin_offer numeric(12,2),
  admin_notes text,
  witness_name text,
  witness_contact text,
  ownership_confirmed boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  source text not null default 'web',
  subject text,
  summary text,
  order_id uuid references public.orders(id) on delete set null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.delivery_locations (
  id uuid primary key default gen_random_uuid(),
  region text,
  city text,
  label text not null,
  fee numeric(12,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  discount_type text check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index idx_products_active on public.products(active);
create index idx_products_category on public.products(category_id);
create index idx_variants_product on public.product_variants(product_id);
create index idx_orders_customer on public.orders(customer_id, created_at desc);
create index idx_bundle_orders_customer on public.bundle_orders(customer_id, created_at desc);
create index idx_buy_swap_customer on public.buy_swap_requests(customer_id, created_at desc);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.data_bundles enable row level security;
alter table public.bundle_orders enable row level security;
alter table public.service_offers enable row level security;
alter table public.buy_swap_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.support_requests enable row level security;
alter table public.delivery_locations enable row level security;
alter table public.promotions enable row level security;
alter table public.app_settings enable row level security;

-- Public catalog reads
create policy categories_public_read on public.categories for select using (active or public.is_admin());
create policy products_public_read on public.products for select using (active or public.is_admin());
create policy variants_public_read on public.product_variants for select using ((active and availability_status <> 'inactive') or public.is_admin());
create policy images_public_read on public.product_images for select using (true);
create policy bundles_public_read on public.data_bundles for select using (active or public.is_admin());
create policy services_public_read on public.service_offers for select using (active or public.is_admin());
create policy delivery_public_read on public.delivery_locations for select using (active or public.is_admin());
create policy promotions_public_read on public.promotions for select using (active or public.is_admin());

-- Profile ownership
create policy profile_self_read on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profile_self_update on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- User-owned records
create policy addresses_owner_all on public.addresses for all using (customer_id = auth.uid() or public.is_admin()) with check (customer_id = auth.uid() or public.is_admin());
create policy cart_owner_all on public.cart_items for all using (customer_id = auth.uid() or public.is_admin()) with check (customer_id = auth.uid() or public.is_admin());
create policy wishlist_owner_all on public.wishlist_items for all using (customer_id = auth.uid() or public.is_admin()) with check (customer_id = auth.uid() or public.is_admin());
create policy orders_owner_read on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy order_items_owner_read on public.order_items for select using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=auth.uid() or public.is_admin())));
create policy order_history_owner_read on public.order_status_history for select using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=auth.uid() or public.is_admin())));
create policy payments_owner_read on public.payments for select using (customer_id = auth.uid() or public.is_admin());
create policy bundle_orders_owner_read on public.bundle_orders for select using (customer_id = auth.uid() or public.is_admin());
create policy buy_swap_owner_insert on public.buy_swap_requests for insert with check (customer_id = auth.uid() or customer_id is null);
create policy buy_swap_owner_read on public.buy_swap_requests for select using (customer_id = auth.uid() or public.is_admin());
create policy contact_insert on public.contact_messages for insert with check (true);
create policy contact_owner_read on public.contact_messages for select using (customer_id = auth.uid() or public.is_admin());
create policy support_owner_read on public.support_requests for select using (customer_id = auth.uid() or public.is_admin());
create policy support_owner_insert on public.support_requests for insert with check (customer_id = auth.uid() or customer_id is null);

-- Admin management policies
create policy categories_admin_write on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy products_admin_write on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy variants_admin_write on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy images_admin_write on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy orders_admin_write on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy order_items_admin_write on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy order_history_admin_write on public.order_status_history for all using (public.is_admin()) with check (public.is_admin());
create policy payments_admin_write on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy bundles_admin_write on public.data_bundles for all using (public.is_admin()) with check (public.is_admin());
create policy bundle_orders_admin_write on public.bundle_orders for all using (public.is_admin()) with check (public.is_admin());
create policy services_admin_write on public.service_offers for all using (public.is_admin()) with check (public.is_admin());
create policy buy_swap_admin_write on public.buy_swap_requests for all using (public.is_admin()) with check (public.is_admin());
create policy contact_admin_write on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());
create policy support_admin_write on public.support_requests for all using (public.is_admin()) with check (public.is_admin());
create policy delivery_admin_write on public.delivery_locations for all using (public.is_admin()) with check (public.is_admin());
create policy promotions_admin_write on public.promotions for all using (public.is_admin()) with check (public.is_admin());
create policy settings_admin_all on public.app_settings for all using (public.is_admin()) with check (public.is_admin());
