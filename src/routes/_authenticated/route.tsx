import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { Bot, Languages, ArrowLeft, Home, Inbox, Settings as SettingsIcon } from "lucide-react";
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
  const router = useRouter();

  const navLink =
    "px-3 py-1.5 text-sm rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors inline-flex items-center gap-1.5";
  const navLinkActive =
    "px-3 py-1.5 text-sm rounded-full bg-foreground text-background inline-flex items-center gap-1.5 shadow-sm";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70 supports-[backdrop-filter]:bg-background/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.history.back()}
              aria-label={t.back}
              className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 hover:bg-accent/60 transition-colors"
            >
              <ArrowLeft className="size-4" />
            </button>
            <Link to="/" className="hidden sm:inline-flex items-center justify-center size-9 rounded-full border border-border/60 hover:bg-accent/60 transition-colors" aria-label={t.home}>
              <Home className="size-4" />
            </Link>
            <Link to="/app" className="ml-1 flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
                <Bot className="size-4" />
              </span>
              <span className="hidden sm:inline">{t.brand}</span>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <Link to="/app" className={navLink} activeProps={{ className: navLinkActive }}>
              <Inbox className="size-4" />
              <span className="hidden sm:inline">{t.nav_leads}</span>
            </Link>
            <Link to="/settings" className={navLink} activeProps={{ className: navLinkActive }}>
              <SettingsIcon className="size-4" />
              <span className="hidden sm:inline">{t.nav_settings}</span>
            </Link>
            <button
              onClick={toggle}
              aria-label="Toggle language"
              className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border/60 hover:bg-accent/60 transition-colors"
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
