import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2 font-semibold">
            <Bot className="size-5 text-primary" />
            <span>AI Receptionist</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/app" className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              activeProps={{ className: "px-3 py-1.5 text-sm rounded-md bg-accent" }}>
              Leads
            </Link>
            <Link to="/settings" className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              activeProps={{ className: "px-3 py-1.5 text-sm rounded-md bg-accent" }}>
              Settings
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
