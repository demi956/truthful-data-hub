import { getRequest } from "@tanstack/react-start/server";
import { publicClient } from "./supabase-public.server";

// Missing credentials mean guest; invalid credentials must never become guest.
export async function requestIdentity() {
  const header = getRequest().headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer (\S+)$/.exec(header);
  if (!match) throw new Error("Unauthorized. Please sign in again.");
  const { data, error } = await publicClient().auth.getUser(match[1]);
  if (error || !data.user) throw new Error("Unauthorized. Please sign in again.");
  return data.user.id;
}

export async function authorizeOrder(
  order: { customer_id: string | null; phone: string } | null,
  userId: string | null,
  phone?: string,
) {
  const denied = () => {
    throw new Error("Order unavailable or verification failed.");
  };
  if (!order) return denied();
  if (userId) {
    if (order.customer_id === userId) return;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (error) return denied();
    if (data === true) return;
    return denied();
  }
  const normalize = (value: string) => value.replace(/[\s()+-]/g, "");
  if (order.customer_id !== null || !phone || normalize(phone) !== normalize(order.phone))
    return denied();
}
