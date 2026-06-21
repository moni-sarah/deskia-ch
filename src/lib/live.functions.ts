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

=== LANGUAGE DETECTION (CRITICAL) ===
You are fully bilingual in English and French (français). Automatically detect which of the two the visitor is speaking and ALWAYS reply in that same language.
- Detect from the visitor's very first utterance (greetings like "hi/hello/hey" → English; "bonjour/salut/allô/bonsoir" → French) and from accent, vocabulary, and grammar.
- If the first utterance is ambiguous or non-verbal, open with a short bilingual greeting: "Hello / Bonjour — how can I help you? / comment puis-je vous aider ?" then lock to whichever language they answer in.
- Mid-conversation, if the visitor switches language, switch with them on the very next reply.
- Never mix the two languages in the same reply once the language is locked. Translate FAQ content on the fly when needed — do not quote English FAQs verbatim to a French speaker, or vice versa.
- Keep proper nouns, brand names, and the Calendly URLs unchanged regardless of language.
=== END LANGUAGE DETECTION ===

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
