import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Globe2,
  CalendarCheck,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
  Languages,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Receptionist — 24/7 Lead Capture in French & English" },
      {
        name: "description",
        content:
          "An AI receptionist that answers FAQs, captures leads and books meetings in French and English — trained on your own knowledge base.",
      },
      { property: "og:title", content: "AI Receptionist — 24/7 Lead Capture" },
      {
        property: "og:description",
        content:
          "Answer customer questions, capture leads and book meetings 24/7 in French & English.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">AI Receptionist</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#demo" className="hover:text-foreground">Demo</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app">
                Open app <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by your own knowledge base
          </div>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            A 24/7 AI receptionist that <span className="text-primary">answers, captures & books</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Replies to FAQs, collects leads and books meetings — automatically in
            French and English, trained on your FAQs and documents.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/app">
                Open dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/r/$slug" params={{ slug: "demo" }}>
                Try the live demo
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> 24/7 availability</span>
            <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-primary" /> FR & EN auto-detect</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Your data, your rules</span>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Everything a receptionist does — without the wait</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            One AI agent on your site that handles the repetitive work and routes the rest to you.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border/60 p-6">
                <div className="text-sm font-mono text-primary">0{i + 1}</div>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to see it answer your customers?</h2>
          <p className="mt-3 text-muted-foreground">
            Add your FAQs, upload a PDF, and share your receptionist link.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/settings">Configure your receptionist</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/r/$slug" params={{ slug: "demo" }}>Open demo page</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} AI Receptionist</span>
          <div className="flex gap-4">
            <Link to="/app" className="hover:text-foreground">Dashboard</Link>
            <Link to="/settings" className="hover:text-foreground">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: MessageSquare, title: "Answers FAQs instantly", desc: "Prices, services, hours — replied to in seconds using your own knowledge base." },
  { icon: Bot, title: "Captures leads", desc: "Collects name, phone, email and request, saved to your dashboard." },
  { icon: CalendarCheck, title: "Books meetings", desc: "Shares your Calendly link for 15-min calls or 30-min consultations." },
  { icon: Globe2, title: "French & English", desc: "Detects the customer's language automatically and replies in kind." },
  { icon: FileText, title: "Trained on your docs", desc: "Upload PDFs or Word documents — the AI uses them to answer." },
  { icon: Clock, title: "Always on", desc: "Working 24/7 so you never miss another lead, even after hours." },
];

const steps = [
  { title: "Add your knowledge", desc: "Paste FAQs or import a PDF / Word document in Settings." },
  { title: "Share your link", desc: "Send your receptionist page to customers or embed it on your site." },
  { title: "Get notified", desc: "Leads appear in your dashboard with optional email or WhatsApp alerts." },
];
