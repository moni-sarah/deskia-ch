import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyReceptionist, updateMyReceptionist } from "@/lib/receptionist.functions";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { KnowledgeEditor } from "@/components/KnowledgeEditor";
import { KnowledgeTester } from "@/components/KnowledgeTester";
import { DocumentImporter } from "@/components/DocumentImporter";
import { useLang } from "@/lib/app-i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings — AI Receptionist" }] }),
  component: Settings,
});

function Settings() {
  const { t } = useLang();
  const qc = useQueryClient();
  const getR = useServerFn(getMyReceptionist);
  const upd = useServerFn(updateMyReceptionist);
  const q = useQuery({ queryKey: ["me"], queryFn: () => getR() });

  const [form, setForm] = useState<any>(null);
  useEffect(() => {
    if (q.data && !form) setForm({ ...q.data });
  }, [q.data]);

  const m = useMutation({
    mutationFn: (data: any) => upd({ data }),
    onSuccess: () => { toast.success(t.saved); qc.invalidateQueries({ queryKey: ["me"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure how your AI receptionist talks and where leads go.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Business</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Business name">
            <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
          </Field>
          <Field label="Short description" hint="One or two sentences about what you do.">
            <Textarea rows={2} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge base</CardTitle>
          <p className="text-xs text-muted-foreground">
            Add the FAQs your AI receptionist should answer — prices, services,
            opening hours, policies. The AI uses ONLY this info to answer
            customers, in English or French.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocumentImporter
            onAppend={(text, name) => {
              const header = `\n\n--- From ${name} ---\n`;
              set("faqs", (form.faqs || "") + header + text);
            }}
          />
          <KnowledgeEditor
            value={form.faqs || ""}
            onChange={(next) => set("faqs", next)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test the AI</CardTitle>
          <p className="text-xs text-muted-foreground">
            Ask a customer question and see how the AI would answer using your
            current knowledge base.
          </p>
        </CardHeader>
        <CardContent>
          <KnowledgeTester draftFaqs={form.faqs || ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Calendly booking</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="15-min call URL">
            <Input placeholder="https://calendly.com/you/15min" value={form.calendly_15 || ""}
              onChange={(e) => set("calendly_15", e.target.value)} />
          </Field>
          <Field label="30-min consultation URL">
            <Input placeholder="https://calendly.com/you/30min" value={form.calendly_30 || ""}
              onChange={(e) => set("calendly_30", e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Lead destinations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Google Sheet URL" hint="Leads will be appended as rows. Share the sheet with the workspace's connected Google account.">
            <Input placeholder="https://docs.google.com/spreadsheets/d/…" value={form.sheet_url || ""}
              onChange={(e) => set("sheet_url", e.target.value)} />
          </Field>
          <Field label="Notification email" hint="We email you whenever a lead is captured.">
            <Input type="email" value={form.notif_email || ""} onChange={(e) => set("notif_email", e.target.value)} />
          </Field>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="text-sm font-medium">WhatsApp notifications</div>
              <div className="text-xs text-muted-foreground">Send a WhatsApp message on every lead.</div>
            </div>
            <Switch checked={!!form.whatsapp_enabled}
              onCheckedChange={(v) => set("whatsapp_enabled", v)} />
          </div>
          {form.whatsapp_enabled && (
            <Field label="WhatsApp number (E.164)" hint="Include country code, e.g. +14155551234">
              <Input placeholder="+14155551234" value={form.whatsapp_number || ""}
                onChange={(e) => set("whatsapp_number", e.target.value)} />
            </Field>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={() => m.mutate({
          business_name: form.business_name,
          description: form.description || "",
          faqs: form.faqs || "",
          calendly_15: form.calendly_15 || "",
          calendly_30: form.calendly_30 || "",
          sheet_url: form.sheet_url || "",
          notif_email: form.notif_email || "",
          whatsapp_enabled: !!form.whatsapp_enabled,
          whatsapp_number: form.whatsapp_number || "",
        })} disabled={m.isPending}>
          {m.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
