import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const orderInput = z.object({
  items: z
    .array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1).max(20) }))
    .min(1),
  fulfillment_method: z.enum(["delivery", "pickup"]),
  full_name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().email().optional().or(z.literal("")),
  region: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(120).optional().or(z.literal("")),
  delivery_address: z.string().max(400).optional().or(z.literal("")),
  landmark: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  customer_id: z.string().uuid().nullable().optional(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = data.items.map((i) => i.variantId);
    const { data: variants, error: vErr } = await supabaseAdmin
      .from("product_variants")
      .select(
        "id, sku, storage, color, condition, price, sale_price, active, availability_status, product:products ( id, name )",
      )
      .in("id", ids)
      .eq("active", true);
    if (vErr) throw new Error(vErr.message);
    if (!variants || variants.length !== ids.length) {
      throw new Error("Some items are no longer available. Please review your cart.");
    }

    // Server-side authoritative pricing.
    let subtotal = 0;
    const itemRows = data.items.map((item) => {
      const v = variants.find((row) => row.id === item.variantId)!;
      const unit = Number(v.sale_price ?? v.price);
      const line = unit * item.quantity;
      subtotal += line;
      const product = v.product as unknown as { id: string; name: string } | null;
      return {
        product_id: product?.id ?? null,
        variant_id: v.id,
        product_name_snapshot: product?.name ?? "Item",
        variant_snapshot: {
          storage: v.storage,
          color: v.color,
          condition: v.condition,
        },
        sku_snapshot: v.sku,
        unit_price_snapshot: unit,
        quantity: item.quantity,
        subtotal: line,
      };
    });

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: "",
        customer_id: data.customer_id ?? null,
        subtotal,
        delivery_fee: null,
        total: data.fulfillment_method === "pickup" ? subtotal : null,
        delivery_fee_confirmed: data.fulfillment_method === "pickup",
        fulfillment_method: data.fulfillment_method,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        region: data.region || null,
        city: data.city || null,
        delivery_address: data.delivery_address || null,
        landmark: data.landmark || null,
        notes: data.notes || null,
        payment_status: "pending",
        order_status: "pending",
      })
      .select("id, order_number, subtotal")
      .single();
    if (oErr) throw new Error(oErr.message);

    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(itemRows.map((row) => ({ ...row, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    await supabaseAdmin.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      note: "Order placed on the website.",
    });

    return { id: order.id, order_number: order.order_number, subtotal: Number(order.subtotal) };
  });

export const submitMomoReference = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        order_id: z.string().uuid(),
        reference: z.string().min(3).max(60),
        amount: z.number().nonnegative(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payments").insert({
      order_id: data.order_id,
      reference: data.reference,
      provider: "mtn_momo_manual",
      payment_method: "mobile_money",
      amount: data.amount,
      status: "pending_verification",
      metadata: { submitted_from: "web_checkout" },
    });
    if (error) throw new Error(error.message);

    await supabaseAdmin
      .from("orders")
      .update({ payment_status: "pending_verification", order_status: "payment_pending_verification" })
      .eq("id", data.order_id);

    await supabaseAdmin.from("order_status_history").insert({
      order_id: data.order_id,
      status: "payment_pending_verification",
      note: "Customer submitted a mobile money reference. Awaiting admin verification.",
    });

    return { ok: true };
  });

export const getOrderByNumber = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ order_number: z.string().min(3) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, subtotal, delivery_fee, total, delivery_fee_confirmed, payment_status, order_status, fulfillment_method, full_name, created_at, items:order_items ( id, product_name_snapshot, variant_snapshot, unit_price_snapshot, quantity, subtotal )",
      )
      .eq("order_number", data.order_number)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, order_number, subtotal, delivery_fee, total, payment_status, order_status, fulfillment_method, created_at, items:order_items ( id, product_name_snapshot, quantity, subtotal )",
      )
      .eq("customer_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createBundleOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        bundle_id: z.string().uuid(),
        receiving_phone: z.string().min(6).max(30),
        customer_id: z.string().uuid().nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: bundle, error: bErr } = await supabaseAdmin
      .from("data_bundles")
      .select("id, price, active")
      .eq("id", data.bundle_id)
      .eq("active", true)
      .maybeSingle();
    if (bErr) throw new Error(bErr.message);
    if (!bundle) throw new Error("That bundle is no longer available.");

    const { data: row, error } = await supabaseAdmin
      .from("bundle_orders")
      .insert({
        order_number: "",
        bundle_id: bundle.id,
        receiving_phone: data.receiving_phone,
        amount: bundle.price,
        customer_id: data.customer_id ?? null,
        payment_status: "pending",
        status: "pending",
      })
      .select("id, order_number, amount")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, order_number: row.order_number, amount: Number(row.amount) };
  });
