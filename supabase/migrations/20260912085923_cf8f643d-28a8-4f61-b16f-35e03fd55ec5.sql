ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT public.next_order_number();
ALTER TABLE public.bundle_orders ALTER COLUMN order_number SET DEFAULT public.next_bundle_order_number();
ALTER TABLE public.buy_swap_requests ALTER COLUMN request_number SET DEFAULT public.next_buy_swap_number();