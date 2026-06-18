import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyReceptionist, updateMyReceptionist } from "@/lib/receptionist.functions";
import { useEffect, useState, type ComponentType } from "react";
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
import { Building2, BookOpen, FlaskConical, CalendarCheck, Share2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings — AI Receptionist" }] }),
  component: Settings,
});

const sectionMeta: Record<string, { icon: ComponentType<{ className?: string }>; color: string }> = {
  business: { icon: Building2, color: "border-l-chart-2" },
  kb: { icon: BookOpen, color: "border-l-chart-1" },
  test_ai: { icon: FlaskConical, color: "border-l-chart-4" },
  calendly: { icon: CalendarCheck, color: "border-l-chart-5" },
  lead_dest: { icon: Share2, color: "border-l-chart-3" },
  wa_title: { icon: MessageCircle, color: "border-l-chart-2" },
};

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

  if (!form) return <div className="p-8 text-sm text-muted-foreground">{t.loading}</div>;

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          {t.settings_title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.settings_subtitle}</p>
      </div>

      <SettingsCard id="business" title={t.business}>
        <div className="space-y-4">
          <Field label={t.business_name}>
            <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
          </Field>
          <Field label={t.short_desc} hint={t.short_desc_hint}>
            <Textarea rows={2} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard id="kb" title={t.kb} subtitle={t.kb_hint}>
        <div className="space-y-6">
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
        </div>
      </SettingsCard>

      <SettingsCard id="test_ai" title={t.test_ai} subtitle={t.test_ai_hint}>
        <KnowledgeTester draftFaqs={form.faqs || ""} />
      </SettingsCard>

      <SettingsCard id="calendly" title={t.calendly}>
        <div className="space-y-4">
          <Field label={t.cal_15}>
            <Input placeholder="https://calendly.com/you/15min" value={form.calendly_15 || ""}
              onChange={(e) => set("calendly_15", e.target.value)} />
          </Field>
          <Field label={t.cal_30}>
            <Input placeholder="https://calendly.com/you/30min" value={form.calendly_30 || ""}
              onChange={(e) => set("calendly_30", e.target.value)} />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard id="lead_dest" title={t.lead_dest}>
        <div className="space-y-4">
          <Field label={t.sheet_url} hint={t.sheet_hint}>
            <Input placeholder="https://docs.google.com/spreadsheets/d/…" value={form.sheet_url || ""}
              onChange={(e) => set("sheet_url", e.target.value)} />
          </Field>
          <Field label={t.notif_email} hint={t.notif_hint}>
            <Input type="email" value={form.notif_email || ""} onChange={(e) => set("notif_email", e.target.value)} />
          </Field>
          <Field label={t.webhook_url} hint={t.webhook_hint}>
            <Input placeholder="https://hooks.zapier.com/hooks/catch/..." value={form.webhook_url || ""}
              onChange={(e) => set("webhook_url", e.target.value)} />
          </Field>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="text-sm font-medium">{t.wa_title}</div>
              <div className="text-xs text-muted-foreground">{t.wa_sub}</div>
            </div>
            <Switch checked={!!form.whatsapp_enabled}
              onCheckedChange={(v) => set("whatsapp_enabled", v)} />
          </div>
          {form.whatsapp_enabled && (
            <Field label={t.wa_num} hint={t.wa_num_hint}>
              <Input placeholder="+14155551234" value={form.whatsapp_number || ""}
                onChange={(e) => set("whatsapp_number", e.target.value)} />
            </Field>
          )}
        </div>
      </SettingsCard>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          size="lg"
          className="rounded-full shadow-lg shadow-primary/20"
          onClick={() => m.mutate({
            business_name: form.business_name,
            description: form.description || "",
            faqs: form.faqs || "",
            calendly_15: form.calendly_15 || "",
            calendly_30: form.calendly_30 || "",
            sheet_url: form.sheet_url || "",
            notif_email: form.notif_email || "",
            webhook_url: form.webhook_url || "",
            whatsapp_enabled: !!form.whatsapp_enabled,
            whatsapp_number: form.whatsapp_number || "",
          })} disabled={m.isPending}>
          {m.isPending ? t.saving : t.save}
        </Button>
      </div>

    </div>
  );
}

function SettingsCard({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  const meta = sectionMeta[id] ?? { icon: Building2, color: "border-l-chart-2" };
  const Icon = meta.icon;
  return (
    <Card className={`border-l-4 ${meta.color}`}>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className={`p-2 rounded-lg ${meta.color.replace("border-l-", "bg-")}/10 ${meta.color.replace("border-l-", "text-")}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
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
