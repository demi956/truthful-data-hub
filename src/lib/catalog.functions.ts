import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicClient } from "./supabase-public.server";

const PRODUCT_SELECT = `
  id, name, slug, brand, model, subcategory, description, specifications, featured,
  category:categories ( id, name, slug ),
  variants:product_variants ( id, sku, storage, color, condition, stock_type, sealed_in_box, network_lock, battery_health_percent, price, sale_price, stock_quantity, stock_tracking_mode, availability_status, active ),
  images:product_images ( id, image_url, is_primary, sort_order )
`;

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        category: z.string().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .order("name", { ascending: true });

    if (data.category) query = query.eq("subcategory", data.category);
    if (data.featured) query = query.eq("featured", true);
    if (data.search) query = query.ilike("name", `%${data.search}%`);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listBundles = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("data_bundles")
    .select("*")
    .eq("active", true)
    .order("network", { ascending: true })
    .order("data_gb", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("service_offers")
    .select("*")
    .eq("active", true);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) throw new Error(error.message);
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = JSON.stringify(row.value);
  return map;
});
