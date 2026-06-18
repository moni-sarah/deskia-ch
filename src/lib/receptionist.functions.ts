import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getMyReceptionist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("receptionists")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const UpdateSchema = z.object({
  business_name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  faqs: z.string().trim().max(8000).default(""),
  calendly_15: z.string().trim().url().or(z.literal("")).nullable().optional(),
  calendly_30: z.string().trim().url().or(z.literal("")).nullable().optional(),
  sheet_url: z.string().trim().url().or(z.literal("")).nullable().optional(),
  notif_email: z.string().trim().email().or(z.literal("")).nullable().optional(),
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
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UpdateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const clean = {
      ...data,
      calendly_15: data.calendly_15 || null,
      calendly_30: data.calendly_30 || null,
      sheet_url: data.sheet_url || null,
      notif_email: data.notif_email || null,
      whatsapp_number: data.whatsapp_number || null,
    };
    const { error } = await context.supabase
      .from("receptionists")
      .update(clean)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: r } = await context.supabase
      .from("receptionists")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!r) return [];
    const { data, error } = await context.supabase
      .from("leads")
      .select("*")
      .eq("receptionist_id", r.id)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
