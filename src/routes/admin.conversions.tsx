import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getConversions } from "@/lib/public.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Calendar, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/conversions")({
  head: () => ({ meta: [{ title: "Conversions — Deskia" }, { name: "robots", content: "noindex" }] }),
  component: ConversionsPage,
});

type Lead = {
  id: string; created_at: string; name: string; email: string; phone: string;
  company: string | null; message: string; language: string | null;
  landing_path: string | null; referrer: string | null; search_query: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
  utm_term: string | null; utm_content: string | null; gclid: string | null;
};
type Booking = {
  id: string; created_at: string; kind: string; destination: string | null;
  page_path: string | null; landing_path: string | null; referrer: string | null;
  search_query: string | null; utm_source: string | null; utm_medium: string | null;
  utm_campaign: string | null; utm_term: string | null; utm_content: string | null; gclid: string | null;
};

function ConversionsPage() {
  const fetchFn = useServerFn(getConversions);
  const [password, setPassword] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("deskia_admin_pw") : null;
    if (saved) setPassword(saved);
  }, []);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["conversions", password],
    queryFn: () => fetchFn({ data: { password: password! } }),
    enabled: !!password,
    retry: false,
  });

  useEffect(() => {
    if (error && /unauthorized/i.test((error as Error).message)) {
      localStorage.removeItem("deskia_admin_pw");
      setPassword(null);
    }
  }, [error]);

  const [tab, setTab] = useState<"overview" | "leads" | "bookings">("overview");

  if (!password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <Card className="p-6 w-full max-w-sm space-y-4">
          <div>
            <h1 className="text-lg font-semibold">Admin access</h1>
            <p className="text-sm text-muted-foreground">Enter the admin password to view conversions.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!pwInput) return;
              localStorage.setItem("deskia_admin_pw", pwInput);
              setPassword(pwInput);
              setPwInput("");
            }}
            className="space-y-3"
          >
            <Input
              type="password"
              autoFocus
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Password"
            />
            <Button type="submit" className="w-full">Unlock</Button>
          </form>
        </Card>
      </div>
    );
  }

  const leads = (data?.leads || []) as Lead[];
  const bookings = (data?.bookings || []) as Booking[];

  const sourceAgg = useMemo(() => groupBy([
    ...leads.map((l) => ({ kind: "lead" as const, source: l.utm_source, medium: l.utm_medium, campaign: l.utm_campaign })),
    ...bookings.map((b) => ({ kind: "booking" as const, source: b.utm_source, medium: b.utm_medium, campaign: b.utm_campaign })),
  ], (x) => `${x.source || "(direct)"} · ${x.medium || "—"}${x.campaign ? ` · ${x.campaign}` : ""}`), [leads, bookings]);

  const queryAgg = useMemo(() => groupBy([
    ...leads.filter((l) => l.search_query).map((l) => ({ kind: "lead" as const, q: l.search_query! })),
    ...bookings.filter((b) => b.search_query).map((b) => ({ kind: "booking" as const, q: b.search_query! })),
  ], (x) => x.q.toLowerCase()), [leads, bookings]);

  const landingAgg = useMemo(() => groupBy([
    ...leads.filter((l) => l.landing_path).map((l) => ({ kind: "lead" as const, p: l.landing_path! })),
    ...bookings.filter((b) => b.landing_path).map((b) => ({ kind: "booking" as const, p: b.landing_path! })),
  ], (x) => x.p), [leads, bookings]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="size-4 mr-1" /> Home</Link></Button>
            <h1 className="text-lg font-semibold">Conversions</h1>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {error && <Card className="p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</Card>}
        {isLoading && <Card className="p-6 text-sm text-muted-foreground">Loading conversions…</Card>}

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Stat icon={<MessageSquare className="size-4" />} label="Leads (form submits)" value={leads.length} />
              <Stat icon={<Calendar className="size-4" />} label="Booking clicks" value={bookings.length} />
              <Stat icon={<Search className="size-4" />} label="With search query" value={leads.filter((l) => l.search_query).length + bookings.filter((b) => b.search_query).length} />
            </div>

            <div className="flex gap-2 border-b">
              {(["overview", "leads", "bookings"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-2 text-sm border-b-2 -mb-px capitalize ${tab === t ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <AggTable title="Top search queries (SEO)" rows={queryAgg} emptyHint="No organic search queries captured yet. Visitors arriving from a Google/Bing result will populate this." />
                <AggTable title="Top sources" rows={sourceAgg} />
                <AggTable title="Top landing pages" rows={landingAgg} className="lg:col-span-2" />
              </div>
            )}

            {tab === "leads" && <LeadsTable rows={leads} />}
            {tab === "bookings" && <BookingsTable rows={bookings} />}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
    </Card>
  );
}

type AggRow = { key: string; total: number; leads: number; bookings: number };
function groupBy<T extends { kind: "lead" | "booking" }>(items: T[], keyFn: (x: T) => string): AggRow[] {
  const map = new Map<string, AggRow>();
  for (const it of items) {
    const k = keyFn(it);
    const row = map.get(k) || { key: k, total: 0, leads: 0, bookings: 0 };
    row.total++;
    if (it.kind === "lead") row.leads++; else row.bookings++;
    map.set(k, row);
  }
  return [...map.values()].sort((a, b) => b.total - a.total).slice(0, 25);
}

function AggTable({ title, rows, emptyHint, className }: { title: string; rows: AggRow[]; emptyHint?: string; className?: string }) {
  return (
    <Card className={`p-4 ${className || ""}`}>
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyHint || "No data yet."}</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr><th className="text-left font-normal py-1">Key</th><th className="text-right font-normal">Leads</th><th className="text-right font-normal">Bookings</th><th className="text-right font-normal">Total</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t">
                <td className="py-1.5 pr-2 truncate max-w-[420px]" title={r.key}>{r.key}</td>
                <td className="py-1.5 text-right tabular-nums">{r.leads}</td>
                <td className="py-1.5 text-right tabular-nums">{r.bookings}</td>
                <td className="py-1.5 text-right tabular-nums font-medium">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function LeadsTable({ rows }: { rows: Lead[] }) {
  if (rows.length === 0) return <Card className="p-6 text-sm text-muted-foreground">No leads yet.</Card>;
  return (
    <Card className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground bg-muted/40">
          <tr>
            {["When", "Name", "Email", "Phone", "Source / Medium", "Campaign", "Search query", "Landing"].map((h) => (
              <th key={h} className="text-left font-normal px-3 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id} className="border-t align-top">
              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{fmt(l.created_at)}</td>
              <td className="px-3 py-2">{l.name}{l.company ? <div className="text-xs text-muted-foreground">{l.company}</div> : null}</td>
              <td className="px-3 py-2">{l.email}</td>
              <td className="px-3 py-2">{l.phone}</td>
              <td className="px-3 py-2">{l.utm_source || "(direct)"}{l.utm_medium ? ` / ${l.utm_medium}` : ""}</td>
              <td className="px-3 py-2">{l.utm_campaign || "—"}</td>
              <td className="px-3 py-2">{l.search_query || "—"}</td>
              <td className="px-3 py-2 max-w-[240px] truncate" title={l.landing_path || ""}>{l.landing_path || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function BookingsTable({ rows }: { rows: Booking[] }) {
  if (rows.length === 0) return <Card className="p-6 text-sm text-muted-foreground">No booking clicks yet.</Card>;
  return (
    <Card className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground bg-muted/40">
          <tr>
            {["When", "Kind", "Page", "Source / Medium", "Campaign", "Search query", "Landing"].map((h) => (
              <th key={h} className="text-left font-normal px-3 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-t align-top">
              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{fmt(b.created_at)}</td>
              <td className="px-3 py-2">{b.kind}</td>
              <td className="px-3 py-2 max-w-[180px] truncate" title={b.page_path || ""}>{b.page_path || "—"}</td>
              <td className="px-3 py-2">{b.utm_source || "(direct)"}{b.utm_medium ? ` / ${b.utm_medium}` : ""}</td>
              <td className="px-3 py-2">{b.utm_campaign || "—"}</td>
              <td className="px-3 py-2">{b.search_query || "—"}</td>
              <td className="px-3 py-2 max-w-[240px] truncate" title={b.landing_path || ""}>{b.landing_path || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function fmt(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
