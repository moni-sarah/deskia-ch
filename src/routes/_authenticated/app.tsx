import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyReceptionist, getMyLeads, deleteLead } from "@/lib/receptionist.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/app")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — AI Receptionist" }] }),
  component: Dashboard,
});

function Dashboard() {
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{rQuery.data?.business_name || "Your receptionist"}</h1>
          <p className="text-sm text-muted-foreground">Share your AI receptionist with visitors and watch leads come in.</p>
        </div>
        <Link to="/settings">
          <Button variant="outline">Configure</Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Your shareable chat link</CardTitle></CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm truncate">{widgetUrl || "…"}</code>
          <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(widgetUrl); toast.success("Copied!"); }}>
            <Copy className="size-4" /> Copy
          </Button>
          <a href={widgetUrl} target="_blank" rel="noreferrer">
            <Button><ExternalLink className="size-4" /> Open</Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Leads ({lQuery.data?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {lQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !lQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">No leads yet. Share your link to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-3">When</th>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Contact</th>
                    <th className="py-2 pr-3">Company</th>
                    <th className="py-2 pr-3">Message</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lQuery.data.map((l: any) => (
                    <tr key={l.id} className="border-b last:border-0 align-top">
                      <td className="py-3 pr-3 whitespace-nowrap text-muted-foreground">
                        {new Date(l.created_at).toLocaleString()}
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
