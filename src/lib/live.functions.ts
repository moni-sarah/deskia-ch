import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LIVE_MODEL = "models/gemini-live-2.5-flash-preview";

export const mintLiveToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ receptionist_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not configured");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: r, error } = await supabaseAdmin
      .from("receptionists")
      .select("business_name, description, faqs, calendly_15, calendly_30")
      .eq("id", data.receptionist_id)
      .maybeSingle();
    if (error || !r) throw new Error("Receptionist not found");

    const systemInstruction = `You are the 24/7 live video & voice receptionist for "${r.business_name}".
${r.description ? `About: ${r.description}\n` : ""}
Speak naturally and concisely, like a friendly human receptionist.
Detect the visitor's language from their first words and reply in that language (English or French).
Use ONLY the FAQ knowledge below to answer questions. If outside scope, offer to have a teammate follow up.
When booking is requested, say the Calendly link aloud and tell them you'll show it on screen:
${r.calendly_15 ? `- 15-min: ${r.calendly_15}` : ""}
${r.calendly_30 ? `- 30-min: ${r.calendly_30}` : ""}
You can SEE the visitor through their camera — comment naturally if helpful (e.g. "I can see your screen, the error is on line 3").

=== FAQ KNOWLEDGE ===
${r.faqs || "(No FAQs configured.)"}
=== END FAQ ===`;

    // Token expires in 30 min; session must start within 2 min of mint
    const now = Date.now();
    const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1alpha/auth_tokens?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            uses: 1,
            expireTime,
            newSessionExpireTime,
            liveConnectConstraints: {
              model: LIVE_MODEL,
              config: {
                responseModalities: ["AUDIO"],
                systemInstruction: { parts: [{ text: systemInstruction }] },
              },
            },
          },
        }),
      },
    );
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Failed to mint live token: ${res.status} ${txt}`);
    }
    const json = (await res.json()) as { name: string };
    return { token: json.name, model: LIVE_MODEL, expireTime };
  });
