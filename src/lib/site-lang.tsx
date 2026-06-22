import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteLang = "en" | "fr" | "de";
const KEY = "deskia-site-lang";

type Ctx = { lang: SiteLang; setLang: (l: SiteLang) => void };
const SiteLangCtx = createContext<Ctx | null>(null);

export const CALENDLY_URL = "https://calendly.com/deskia-ai/audit";
export const CONTACT_EMAIL = "hello@deskia.ai";

export function SiteLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>("fr");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) as SiteLang | null;
    if (stored === "en" || stored === "fr" || stored === "de") {
      setLangState(stored);
      return;
    }
    const nav = (typeof navigator !== "undefined" ? navigator.language : "fr").toLowerCase();
    if (nav.startsWith("de")) setLangState("de");
    else if (nav.startsWith("en")) setLangState("en");
    else setLangState("fr");
  }, []);
  const setLang = (l: SiteLang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  };
  return <SiteLangCtx.Provider value={{ lang, setLang }}>{children}</SiteLangCtx.Provider>;
}

export function useSiteLang(): Ctx {
  const c = useContext(SiteLangCtx);
  if (!c) throw new Error("useSiteLang must be used within SiteLangProvider");
  return c;
}

export function LangSwitcher() {
  const { lang, setLang } = useSiteLang();
  const langs: SiteLang[] = ["fr", "en", "de"];
  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-background p-0.5 text-xs font-medium">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`Switch to ${l.toUpperCase()}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
