import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitBuySwapRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        request_type: z.enum(["sell", "swap"]),
        customer_name: z.string().min(2).max(120),
        customer_phone: z.string().min(6).max(30),
        current_brand: z.string().max(60).optional().or(z.literal("")),
        current_model: z.string().max(120).optional().or(z.literal("")),
        current_storage: z.string().max(60).optional().or(z.literal("")),
        current_condition: z.string().max(60).optional().or(z.literal("")),
        battery_health_percent: z.number().min(0).max(100).nullable().optional(),
        imei_or_serial: z.string().max(60).optional().or(z.literal("")),
        desired_product_id: z.string().uuid().nullable().optional(),
        customer_notes: z.string().max(1000).optional().or(z.literal("")),
        ownership_confirmed: z.boolean(),
        customer_id: z.string().uuid().nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (!data.ownership_confirmed) {
      throw new Error("Please confirm that the device belongs to you.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("buy_swap_requests")
      .insert({
        request_type: data.request_type,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        current_brand: data.current_brand || null,
        current_model: data.current_model || null,
        current_storage: data.current_storage || null,
        current_condition: data.current_condition || null,
        battery_health_percent: data.battery_health_percent ?? null,
        imei_or_serial: data.imei_or_serial || null,
        desired_product_id: data.desired_product_id ?? null,
        customer_notes: data.customer_notes || null,
        ownership_confirmed: true,
        customer_id: data.customer_id ?? null,
        admin_status: "pending_review",
        photo_urls: [],
      })
      .select("id, request_number")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        name: z.string().min(2).max(120),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().max(30).optional().or(z.literal("")),
        subject: z.string().max(160).optional().or(z.literal("")),
        message: z.string().min(5).max(2000),
        customer_id: z.string().uuid().nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      customer_id: data.customer_id ?? null,
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
