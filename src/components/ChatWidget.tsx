import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { chat } from "@/lib/chat.functions";
import { submitLead, trackBooking } from "@/lib/public.functions";
import { captureAttribution, getAttribution } from "@/lib/attribution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, User, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/deskia-logo.png.asset.json";


type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget({
  receptionistId, businessName, calendly15, calendly30,
}: {
  receptionistId: string;
  businessName: string;
  calendly15: string | null;
  calendly30: string | null;
}) {
  const chatFn = useServerFn(chat);
  const leadFn = useServerFn(submitLead);
  const bookingFn = useServerFn(trackBooking);

  useEffect(() => { captureAttribution(); }, []);

  function logBooking(kind: "calendly_15" | "calendly_30", destination: string | null) {
    try {
      void bookingFn({
        data: {
          receptionist_id: receptionistId,
          kind,
          destination,
          page_path: typeof window !== "undefined" ? window.location.pathname : null,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
          attribution: getAttribution(),
        },
      });
    } catch {/* non-blocking */}
  }

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hi! I'm the AI assistant for **${businessName}**. Ask me anything — prices, services, hours, or book a call. _(Je parle aussi français — écrivez-moi simplement en français.)_` },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await chatFn({ data: { receptionist_id: receptionistId, messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      toast.error((e as Error).message);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I had trouble responding. Please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  // Lead form
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lang = detectLang(messages);
      await leadFn({
        data: {
          receptionist_id: receptionistId,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim() || null,
          message: form.message.trim(),
          language: lang,
        },
      });
      setSubmitted(true);
      setShowForm(false);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: lang === "fr"
            ? "Merci ! Nous avons bien reçu vos coordonnées. Nous vous recontacterons très bientôt. 🙌"
            : "Thanks! We've got your details and will reach out shortly. 🙌" },
      ]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/5 px-4 py-3 border-b flex items-center gap-2">
        <img src={logoAsset.url} alt="Deskia" className="h-6 w-auto rounded-sm" />
        <span className="font-medium text-sm">Deskia · 24/7</span>
      </div>

      <div ref={scrollRef} className="h-[420px] overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <img src={logoAsset.url} alt="Deskia" className="h-5 w-auto rounded-sm" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm prose prose-sm max-w-none ${
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
            {m.role === "user" && (
              <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                <User className="size-4" />
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex gap-2">
            <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
              <img src={logoAsset.url} alt="Deskia" className="h-5 w-auto rounded-sm" />
            </div>
            <div className="px-3 py-2 rounded-2xl bg-muted text-sm text-muted-foreground">…</div>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message… / Posez votre question…"
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !input.trim()} size="icon">
          <Send className="size-4" />
        </Button>
      </form>

      <div className="border-t p-3 flex flex-wrap gap-2">
        {calendly15 && (
          <a href={calendly15} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm"><Calendar className="size-4" /> Book 15-min call</Button>
          </a>
        )}
        {calendly30 && (
          <a href={calendly30} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm"><Calendar className="size-4" /> Book 30-min consult</Button>
          </a>
        )}
        {!submitted ? (
          <Button variant="secondary" size="sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Hide form" : "Leave your details"}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 px-2">
            <CheckCircle2 className="size-4" /> Details sent
          </span>
        )}
      </div>

      {showForm && (
        <form onSubmit={submitForm} className="border-t p-4 space-y-3 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name *"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone *"><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Email *"><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          </div>
          <Field label="Message *"><Textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : "Send"}
          </Button>
        </form>
      )}
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function detectLang(messages: Msg[]): "en" | "fr" {
  const first = messages.find((m) => m.role === "user")?.content.toLowerCase() || "";
  const frHits = (first.match(/\b(bonjour|salut|merci|je|nous|vous|prix|tarif|réserver|rendez-vous|heures|ouvert|services?)\b/g) || []).length;
  return frHits >= 1 ? "fr" : "en";
}
