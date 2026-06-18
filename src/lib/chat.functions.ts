import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const ChatInput = z.object({
  receptionist_id: z.string().uuid(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

export const chat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    // Load receptionist for system prompt
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: r, error } = await supabaseAdmin
      .from("receptionists")
      .select("business_name, description, faqs, calendly_15, calendly_30")
      .eq("id", data.receptionist_id)
      .maybeSingle();
    if (error || !r) throw new Error("Receptionist not found");

    const system = `You are the 24/7 AI receptionist for "${r.business_name}".
${r.description ? `About the business: ${r.description}\n` : ""}
Your job:
1. Answer visitor questions using ONLY the FAQ knowledge below. If a question is outside that scope, politely say you'll have a team member follow up, and offer to collect their contact details.
2. Detect the visitor's language from THEIR FIRST MESSAGE and reply in that language for the whole conversation. Support both English and French (Français). Default to English if uncertain.
3. When a visitor wants to book a meeting, share the appropriate Calendly link:
   ${r.calendly_15 ? `- 15-minute call: ${r.calendly_15}` : "- (15-min call link not configured)"}
   ${r.calendly_30 ? `- 30-minute consultation: ${r.calendly_30}` : "- (30-min consultation link not configured)"}
   Say (EN): "You can book directly here: <link>" — (FR): "Vous pouvez réserver directement ici : <link>"
4. When the visitor wants to be contacted, leave a message, or asks anything that needs human follow-up, tell them to use the "Leave your details" form below the chat (EN) / le formulaire "Laissez vos coordonnées" sous le chat (FR). Do NOT ask for their phone/email in chat — direct them to the form.
5. Be concise, warm, and professional. Use markdown sparingly. Never invent prices or services not in the FAQs.

=== FAQ KNOWLEDGE ===
${r.faqs || "(No FAQs configured yet. If asked about prices, services, or hours, say you'll have the team follow up and point them to the contact form.)"}
=== END FAQ ===`;

    const gateway = createLovableAiGatewayProvider(key);
    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        messages: data.messages,
      });
      return { text: result.text };
    } catch (e) {
      const msg = (e as Error).message || "";
      if (msg.includes("429")) throw new Error("Too many requests, please slow down.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Owner must top up.");
      throw new Error("AI error: " + msg);
    }
  });
