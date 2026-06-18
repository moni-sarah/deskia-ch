import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyReceptionist, getMyLeads, deleteLead } from "@/lib/receptionist.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Trash2, Users, CalendarCheck, MessageCircleQuestion, TrendingUp, Radio } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useLang } from "@/lib/app-i18n";

export const Route = createFileRoute("/_authenticated/app")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — Deskia" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useLang();
  const router = useRouter();
  const qc = useQueryClient();
  const getR = useServerFn(getMyReceptionist);
  const getL = useServerFn(getMyLeads);
  const delL = useServerFn(deleteLead);

  const rQuery = useQuery({ queryKey: ["me"], queryFn: () => getR() });
  const lQuery = useQuery({ queryKey: ["leads"], queryFn: () => getL() });

  const delMut = useMutation({
    mutationFn: (id: string) => delL({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const [origin, setOrigin] = useState("");
  if (typeof window !== "undefined" && !origin) setOrigin(window.location.origin);

  const widgetUrl = rQuery.data ? `${origin}/r/${rQuery.data.slug}` : "";
  const leads = lQuery.data ?? [];
  const totalLeads = leads.length;
  const today = new Date().toDateString();
  const todaysLeads = leads.filter((l: any) => new Date(l.created_at).toDateString() === today).length;

  // Heuristic: a lead counts as a booked appointment if the captured message
  // mentions a booking/appointment intent. Customer "questions" = every lead message.
  const bookingRe = /\b(book|booking|appointment|appt|schedule|reservation|reserve|rendez[- ]?vous|réserv|rdv|consult)/i;
  const appointmentsBooked = leads.filter((l: any) => bookingRe.test(l.message || "")).length;
  const conversionRate = totalLeads > 0 ? Math.round((appointmentsBooked / totalLeads) * 100) : 0;
  const customerQuestions = leads.filter((l: any) => (l.message || "").trim().length > 0).length;

  const destinations = [
    rQuery.data?.sheet_url,
    rQuery.data?.notif_email,
    rQuery.data?.webhook_url,
    rQuery.data?.whatsapp_enabled,
  ].filter(Boolean).length;

  const tiles = [
    {
      label: t.total_leads,
      value: totalLeads,
      icon: Users,
      color: "bg-chart-2/10 text-chart-2",
      iconBg: "bg-chart-2/15",
    },
    {
      label: t.appointments_booked,
      value: appointmentsBooked,
      icon: CalendarCheck,
      color: "bg-chart-1/10 text-chart-1",
      iconBg: "bg-chart-1/15",
    },
    {
      label: t.conversion_rate,
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "bg-chart-3/10 text-chart-3",
      iconBg: "bg-chart-3/15",
    },
    {
      label: t.customer_questions,
      value: customerQuestions,
      icon: MessageCircleQuestion,
      color: "bg-chart-5/10 text-chart-5",
      iconBg: "bg-chart-5/15",
    },
    {
      label: rQuery.data ? t.widget_live : t.widget_offline,
      value: rQuery.data ? "Yes" : "No",
      icon: Radio,
      color: rQuery.data ? "bg-chart-4/10 text-chart-4" : "bg-muted text-muted-foreground",
      iconBg: rQuery.data ? "bg-chart-4/15" : "bg-muted",
    },
    {
      label: t.active_destinations,
      value: destinations,
      icon: Radio,
      color: "bg-chart-4/10 text-chart-4",
      iconBg: "bg-chart-4/15",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{rQuery.data?.business_name || t.your_receptionist}</h1>
          <p className="text-sm text-muted-foreground">{t.dash_subtitle}</p>
        </div>
        <Link to="/settings">
          <Button variant="outline">{t.configure}</Button>
        </Link>
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <Card key={tile.label} className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{tile.label}</p>
                  <p className="text-2xl font-bold">{tile.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${tile.iconBg} ${tile.color}`}>
                  <tile.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Widget URL Card */}
      <Card className="border-l-4 border-l-chart-2">
        <CardHeader><CardTitle className="text-base">{t.share_link}</CardTitle></CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm truncate">{widgetUrl || "…"}</code>
          <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(widgetUrl); toast.success(t.copied); }}>
            <Copy className="size-4" /> {t.copy}
          </Button>
          <a href={widgetUrl} target="_blank" rel="noreferrer">
            <Button><ExternalLink className="size-4" /> {t.open}</Button>
          </a>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader><CardTitle className="text-base">{t.leads} ({lQuery.data?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {lQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">{t.loading}</p>
          ) : !lQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">{t.no_leads}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-3">{t.col_when}</th>
                    <th className="py-2 pr-3">{t.col_name}</th>
                    <th className="py-2 pr-3">{t.col_contact}</th>
                    <th className="py-2 pr-3">{t.col_company}</th>
                    <th className="py-2 pr-3">{t.col_message}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lQuery.data.map((l: any) => (
                    <tr key={l.id} className="border-b last:border-0 align-top">
                      <td className="py-3 pr-3 whitespace-nowrap text-muted-foreground">
                        {new Date(l.created_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
                      </td>
                      <td className="py-3 pr-3 font-medium">{l.name}</td>
                      <td className="py-3 pr-3">
                        <div>{l.email}</div>
                        <div className="text-muted-foreground">{l.phone}</div>
                      </td>
                      <td className="py-3 pr-3">{l.company || "—"}</td>
                      <td className="py-3 pr-3 max-w-md whitespace-pre-wrap">{l.message}</td>
                      <td className="py-3">
                        <Button size="icon" variant="ghost" onClick={() => delMut.mutate(l.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
