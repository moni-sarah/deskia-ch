import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getReceptionistBySlug } from "@/lib/public.functions";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/r/$slug")({
  loader: async ({ params }) => {
    const r = await getReceptionistBySlug({ data: { slug: params.slug } });
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.business_name} — AI Receptionist` },
          { name: "description", content: loaderData.description || `Chat with ${loaderData.business_name} 24/7` },
          { property: "og:title", content: loaderData.business_name },
          { property: "og:description", content: loaderData.description || "" },
        ]
      : [{ title: "AI Receptionist" }],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold">Couldn't load</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold">Not found</h1>
        <p className="text-sm text-muted-foreground mt-2">This receptionist link doesn't exist.</p>
      </div>
    </div>
  ),
  component: PublicChat,
});

function PublicChat() {
  const r = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 pl-2 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
        </div>
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">{r.business_name}</h1>
          {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
          <div className="mt-4 flex justify-center">
            <Link to="/r/$slug/call" params={{ slug: r.slug }}>
              <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
                <Video className="size-4" /> Start live call
              </Button>
            </Link>
          </div>
        </header>
        <ChatWidget
          receptionistId={r.id}
          businessName={r.business_name}
          calendly15={r.calendly_15}
          calendly30={r.calendly_30}
        />
      </div>
    </div>
  );
}
