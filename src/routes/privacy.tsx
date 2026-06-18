import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, ShieldCheck, ArrowLeft, Lock, Eye, Trash2, Server, Scale, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Data Protection — Deskia" },
      {
        name: "description",
        content: "Deskia privacy policy and data protection practices.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">Deskia</span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          App-maintained page
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy & Data Protection
        </h1>
        <p className="mt-4 text-muted-foreground">
          This page is maintained by Deskia to answer common security and privacy questions about our service.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold">Data we collect</h2>
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Deskia collects the minimum data needed to provide the AI receptionist service:
              conversation transcripts, lead contact details (name, email, phone), and business knowledge-base content you upload.
              We do not sell personal data to third parties.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              All data is transmitted over HTTPS (TLS 1.2+). Deskia runs on a managed cloud platform with regular security updates,
              automated backups, and role-based access controls. Authentication is handled via secure session tokens.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Server className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold">Subprocessors & integrations</h2>
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Deskia uses the following subprocessors for hosting, AI inference, and optional integrations:
              cloud hosting provider, AI model provider, and any CRM or webhook destinations you configure (Google Sheets, Zapier, HubSpot, etc.).
              You control which integrations are active in your Settings.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <Trash2 className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold">Retention & deletion</h2>
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Conversation and lead data are retained for as long as your account is active.
              You can delete individual leads or your entire account data from the Dashboard at any time.
              Upon account deletion, all associated data is permanently removed within 30 days.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold">Your rights</h2>
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal data.
              To make a privacy request, contact us via the Contact page or email the address listed there.
              We will respond within 30 days.
            </p>
          </section>
        </div>

        <Card className="mt-12 border-border/60">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              This privacy page reflects Deskia&apos;s current practices and is updated periodically.
              Last updated: June 2026.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
