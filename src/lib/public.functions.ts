import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function publicSupabase() {
  // Lazy import: keep server-only module out of client bundle
  return import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  );
}

export const getReceptionistBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ slug: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await publicSupabase();
    const { data: row, error } = await supabase
      .from("receptionists")
      .select(
        "id, slug, business_name, description, calendly_15, calendly_30",
      )
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const LeadSchema = z.object({
  receptionist_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(4).max(40),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(120).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
  language: z.enum(["en", "fr"]).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load receptionist config
    const { data: r, error: rErr } = await supabaseAdmin
      .from("receptionists")
      .select("*")
      .eq("id", data.receptionist_id)
      .maybeSingle();
    if (rErr || !r) throw new Error("Receptionist not found");

    // Insert lead
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("leads")
      .insert({
        receptionist_id: r.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company || null,
        message: data.message,
        language: data.language ?? null,
      })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);

    // Fire-and-forget integrations
    const integrations: string[] = [];
    const errors: string[] = [];

    // Google Sheets append
    if (r.sheet_url && process.env.GOOGLE_SHEETS_API_KEY && process.env.LOVABLE_API_KEY) {
      try {
        const match = r.sheet_url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const sid = match[1];
          const range = "Sheet1!A:H";
          const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${sid}/values/${range}:append?valueInputOption=USER_ENTERED`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": process.env.GOOGLE_SHEETS_API_KEY,
            },
            body: JSON.stringify({
              values: [[
                new Date().toISOString(),
                data.name,
                data.phone,
                data.email,
                data.company || "",
                data.message,
                data.language ?? "",
                r.business_name,
              ]],
            }),
          });
          if (res.ok) integrations.push("google_sheets");
          else errors.push(`sheets:${res.status}`);
        }
      } catch (e) {
        errors.push(`sheets:${(e as Error).message}`);
      }
    }

    // Email notification (Resend connector)
    if (r.notif_email && process.env.RESEND_API_KEY && process.env.LOVABLE_API_KEY) {
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": process.env.RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: "AI Receptionist <onboarding@resend.dev>",
            to: [r.notif_email],
            subject: `New lead: ${data.name}`,
            html: `
              <h2>New lead for ${escapeHtml(r.business_name)}</h2>
              <p><b>Name:</b> ${escapeHtml(data.name)}</p>
              <p><b>Phone:</b> ${escapeHtml(data.phone)}</p>
              <p><b>Email:</b> ${escapeHtml(data.email)}</p>
              ${data.company ? `<p><b>Company:</b> ${escapeHtml(data.company)}</p>` : ""}
              <p><b>Message:</b><br/>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
            `,
          }),
        });
        if (res.ok) integrations.push("email");
        else errors.push(`email:${res.status}`);
      } catch (e) {
        errors.push(`email:${(e as Error).message}`);
      }
    }

    // WhatsApp via Twilio
    if (
      r.whatsapp_enabled &&
      r.whatsapp_number &&
      process.env.TWILIO_API_KEY &&
      process.env.LOVABLE_API_KEY &&
      process.env.TWILIO_WHATSAPP_FROM
    ) {
      try {
        const body = new URLSearchParams({
          To: `whatsapp:${r.whatsapp_number}`,
          From: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
          Body: `New lead for ${r.business_name}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}${data.company ? `\nCompany: ${data.company}` : ""}\nMessage: ${data.message}`,
        });
        const res = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": process.env.TWILIO_API_KEY,
          },
          body,
        });
        if (res.ok) integrations.push("whatsapp");
        else errors.push(`whatsapp:${res.status}`);
      } catch (e) {
        errors.push(`whatsapp:${(e as Error).message}`);
      }
    }

    // Generic webhook (Zapier / Make / any CRM or appointment software)
    if (r.webhook_url) {
      try {
        const res = await fetch(r.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "lead.created",
            lead_id: inserted.id,
            created_at: inserted.created_at,
            business_name: r.business_name,
            name: data.name,
            phone: data.phone,
            email: data.email,
            company: data.company || "",
            message: data.message,
            language: data.language ?? "",
            source: "ai-receptionist",
          }),
        });
        if (res.ok) integrations.push("webhook");
        else errors.push(`webhook:${res.status}`);
      } catch (e) {
        errors.push(`webhook:${(e as Error).message}`);
      }
    }

    return { ok: true, id: inserted.id, integrations, errors };
  });

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
