import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Bot, Languages } from "lucide-react";
import { LangProvider, useLang } from "@/lib/app-i18n";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}

function Shell() {
  const { t, toggle } = useLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2 font-semibold">
            <Bot className="size-5 text-primary" />
            <span>{t.brand}</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/app" className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              activeProps={{ className: "px-3 py-1.5 text-sm rounded-md bg-accent" }}>
              {t.nav_leads}
            </Link>
            <Link to="/settings" className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              activeProps={{ className: "px-3 py-1.5 text-sm rounded-md bg-accent" }}>
              {t.nav_settings}
            </Link>
            <button
              onClick={toggle}
              aria-label="Toggle language"
              className="ml-1 inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-md border hover:bg-accent"
            >
              <Languages className="size-4" />
              {t.lang_toggle}
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
