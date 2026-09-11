-- 1. Dedicated roles table (prevents privilege escalation via profiles)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.user_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin');
$$;

create policy user_roles_self_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy user_roles_admin_write on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- profiles.role is no longer authoritative
alter table public.profiles drop column role;

-- 2. Restrict SECURITY DEFINER helpers to signed-in users only
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.has_role(uuid, public.user_role) from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;
grant execute on function public.has_role(uuid, public.user_role) to authenticated, service_role;

-- 3. Public (anon) catalogue reads must not call is_admin()
drop policy categories_public_read on public.categories;
drop policy products_public_read on public.products;
drop policy variants_public_read on public.product_variants;
drop policy bundles_public_read on public.data_bundles;
drop policy services_public_read on public.service_offers;
drop policy delivery_public_read on public.delivery_locations;
drop policy promotions_public_read on public.promotions;

create policy categories_anon_read on public.categories for select to anon using (active);
create policy categories_auth_read on public.categories for select to authenticated using (active or public.is_admin());
create policy products_anon_read on public.products for select to anon using (active);
create policy products_auth_read on public.products for select to authenticated using (active or public.is_admin());
create policy variants_anon_read on public.product_variants for select to anon using (active and availability_status <> 'inactive');
create policy variants_auth_read on public.product_variants for select to authenticated using ((active and availability_status <> 'inactive') or public.is_admin());
create policy bundles_anon_read on public.data_bundles for select to anon using (active);
create policy bundles_auth_read on public.data_bundles for select to authenticated using (active or public.is_admin());
create policy services_anon_read on public.service_offers for select to anon using (active);
create policy services_auth_read on public.service_offers for select to authenticated using (active or public.is_admin());
create policy delivery_anon_read on public.delivery_locations for select to anon using (active);
create policy delivery_auth_read on public.delivery_locations for select to authenticated using (active or public.is_admin());
create policy promotions_anon_read on public.promotions for select to anon using (active);
create policy promotions_auth_read on public.promotions for select to authenticated using (active or public.is_admin());

-- Public business settings are readable by everyone (contact details, policies)
create policy settings_public_read on public.app_settings for select to anon, authenticated using (true);

-- 4. Grants
grant select on public.categories, public.products, public.product_variants, public.product_images,
  public.data_bundles, public.service_offers, public.delivery_locations, public.promotions,
  public.app_settings to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant insert on public.buy_swap_requests, public.support_requests to anon, authenticated;
grant select on public.buy_swap_requests, public.support_requests, public.contact_messages to authenticated;
grant select, insert, update, delete on public.addresses, public.cart_items, public.wishlist_items to authenticated;
grant select on public.orders, public.order_items, public.order_status_history, public.payments, public.bundle_orders to authenticated;
grant select, update on public.profiles to authenticated;
grant insert, update, delete on public.categories, public.products, public.product_variants, public.product_images,
  public.data_bundles, public.service_offers, public.delivery_locations, public.promotions, public.app_settings,
  public.orders, public.order_items, public.order_status_history, public.payments, public.bundle_orders,
  public.buy_swap_requests, public.support_requests, public.contact_messages to authenticated;
grant all on public.profiles, public.categories, public.products, public.product_variants, public.product_images,
  public.addresses, public.cart_items, public.wishlist_items, public.orders, public.order_items,
  public.order_status_history, public.payments, public.data_bundles, public.bundle_orders, public.service_offers,
  public.buy_swap_requests, public.contact_messages, public.support_requests, public.delivery_locations,
  public.promotions, public.app_settings to service_role;

-- 5. Profile auto-creation on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Reference number generators
create sequence public.order_number_seq;
create sequence public.bundle_order_number_seq;
create sequence public.buy_swap_number_seq;

create or replace function public.next_order_number()
returns text language sql volatile security definer set search_path = public as $$
  select 'NH-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

create or replace function public.next_bundle_order_number()
returns text language sql volatile security definer set search_path = public as $$
  select 'NB-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.bundle_order_number_seq')::text, 6, '0');
$$;

create or replace function public.next_buy_swap_number()
returns text language sql volatile security definer set search_path = public as $$
  select 'SW-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.buy_swap_number_seq')::text, 6, '0');
$$;

revoke execute on function public.next_order_number() from public, anon, authenticated;
revoke execute on function public.next_bundle_order_number() from public, anon, authenticated;
revoke execute on function public.next_buy_swap_number() from public, anon, authenticated;
grant execute on function public.next_order_number() to service_role;
grant execute on function public.next_bundle_order_number() to service_role;
grant execute on function public.next_buy_swap_number() to service_role;

-- 7. updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
create trigger touch_variants before update on public.product_variants for each row execute function public.touch_updated_at();
create trigger touch_orders before update on public.orders for each row execute function public.touch_updated_at();
create trigger touch_bundle_orders before update on public.bundle_orders for each row execute function public.touch_updated_at();
create trigger touch_buy_swap before update on public.buy_swap_requests for each row execute function public.touch_updated_at();
create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();