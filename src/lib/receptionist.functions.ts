import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function getSingleton() {
  const sb = await admin();
  const { data, error } = await sb
    .from("receptionists")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data;
  // Auto-seed if missing
  const { data: inserted, error: insErr } = await sb
    .from("receptionists")
    .insert({ slug: "demo", business_name: "My Business" })
    .select()
    .single();
  if (insErr) throw new Error(insErr.message);
  return inserted;
}

export const getMyReceptionist = createServerFn({ method: "GET" }).handler(async () => {
  return await getSingleton();
});

const UpdateSchema = z.object({
  business_name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  faqs: z.string().trim().max(8000).default(""),
  calendly_15: z.string().trim().url().or(z.literal("")).nullable().optional(),
  calendly_30: z.string().trim().url().or(z.literal("")).nullable().optional(),
  sheet_url: z.string().trim().url().or(z.literal("")).nullable().optional(),
  notif_email: z.string().trim().email().or(z.literal("")).nullable().optional(),
  webhook_url: z.string().trim().url().or(z.literal("")).nullable().optional(),
  whatsapp_enabled: z.boolean(),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{6,20}$/, "Use E.164 format, e.g. +14155551234")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export const updateMyReceptionist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UpdateSchema.parse(input))
  .handler(async ({ data }) => {
    const r = await getSingleton();
    const clean = {
      ...data,
      calendly_15: data.calendly_15 || null,
      calendly_30: data.calendly_30 || null,
      sheet_url: data.sheet_url || null,
      notif_email: data.notif_email || null,
      whatsapp_number: data.whatsapp_number || null,
    };
    const sb = await admin();
    const { error } = await sb.from("receptionists").update(clean).eq("id", r.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyLeads = createServerFn({ method: "GET" }).handler(async () => {
  const r = await getSingleton();
  const sb = await admin();
  const { data, error } = await sb
    .from("leads")
    .select("*")
    .eq("receptionist_id", r.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const deleteLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { error } = await sb.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
