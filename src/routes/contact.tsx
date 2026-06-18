import logoAsset from "@/assets/deskia-logo.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, MessageSquare, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Deskia" },
      {
        name: "description",
        content: "Get in touch with the Deskia team.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          Have a question, need support, or want to learn more about Deskia? We&apos;re here to help.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach us anytime at
              </p>
              <a
                href="mailto:hello@deskia.ai"
                className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
              >
                hello@deskia.ai
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">Chat with Deskia</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try the live demo and chat with our AI receptionist directly.
              </p>
              <Button asChild variant="link" className="mt-1 h-auto p-0 text-sm">
                <Link to="/r/$slug" params={{ slug: "demo" }}>
                  Open demo
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">Response time</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We aim to reply to all inquiries within 24 hours during business days.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">Based in</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Serving clinics and dental practices across Europe and North America.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
