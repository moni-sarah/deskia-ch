import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, MessageSquare, Calendar, Database, Languages } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Receptionist — 24/7 bilingual chat that books meetings" },
      { name: "description", content: "A 24/7 AI receptionist for your business. Answers FAQs, collects leads, books meetings, in English and French." },
      { property: "og:title", content: "AI Receptionist — 24/7 bilingual chat" },
      { property: "og:description", content: "Answers FAQs, captures leads, books meetings. EN + FR." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Bot className="size-5 text-primary" />
            <span>AI Receptionist</span>
          </div>
          <Link to="/auth"><Button size="sm">Get started</Button></Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
          <Sparkles className="size-3.5" /> 24/7 · Bilingual · Lead-ready
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Your AI receptionist,<br />ready in 5 minutes.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Answers FAQs, captures leads into your Google Sheet, and books meetings via Calendly — all in English and French, around the clock.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/auth"><Button size="lg">Create your receptionist</Button></Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Feature icon={<MessageSquare />} title="Answers FAQs" desc="Prices, services, opening hours — straight from your knowledge base." />
        <Feature icon={<Database />} title="Captures leads" desc="Saves to your dashboard, your Google Sheet, your email, and WhatsApp." />
        <Feature icon={<Calendar />} title="Books meetings" desc="Hands out your Calendly 15-min and 30-min links right in chat." />
        <Feature icon={<Languages />} title="EN + FR" desc="Auto-detects your visitor's language and replies in kind." />
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border p-5">
      <div className="size-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
