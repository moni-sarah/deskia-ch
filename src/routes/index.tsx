import logoAsset from "@/assets/deskia-logo.png.asset.json";
import serviceReceptionist from "@/assets/service-receptionist.jpg";
import serviceLeads from "@/assets/service-leads.jpg";
import serviceSupport from "@/assets/service-support.jpg";
import serviceAppointments from "@/assets/service-appointments.jpg";
import serviceSurvey from "@/assets/service-survey.jpg";
import serviceDebt from "@/assets/service-debt.jpg";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Languages,
  Phone,
  Mail,
  Sparkles,
  Wrench,
  PlayCircle,
  Rocket,
  LineChart,
} from "lucide-react";
import { useState, useEffect } from "react";

type Lang = "en" | "fr";

const t = {
  en: {
    navAbout: "About",
    navDashboard: "Dashboard",
    navSettings: "Settings",
    navDemo: "Demo",
    useCaseBadge: "Use Case",
    heroTitleA: "AI Receptionists",
    heroTitleB: "That Deliver Human-Like Conversations",
    heroDesc:
      "With Deskia as your AI virtual receptionist, every interaction reflects your brand's values — during peak hours, after hours, or across time zones. No phone trees: warm, human-like conversations that keep callers engaged in French and English.",
    heroPrimary: "TRY FOR FREE",
    heroSecondary: "CONTACT SALES",

    advantagesEyebrow: "Deskia Advantages",
    advantagesTitle: "Benefits of using Deskia as your AI receptionist",
    benefits: [
      {
        title: "Enhanced customer experience and first impressions",
        desc: "Callers are greeted with immediate, natural responses instead of frustrating hold times or voicemails — building trust and long-term loyalty from the very first call.",
      },
      {
        title: "Increased efficiency and cost savings",
        desc: "Automating receptionist duties frees your team to focus on in-person interactions and complex requests. Cut staffing costs while keeping a consistent, high-quality service.",
      },
      {
        title: "Scalable for businesses of all sizes",
        desc: "From small clinics to large enterprises, Deskia handles high call volumes without sacrificing personalization — and answers in French or English automatically.",
      },
      {
        title: "Advanced lead qualification",
        desc: "Deskia identifies intent, captures key customer details and routes calls with full context — helping your sales team close more deals, faster.",
      },
    ],

    progressEyebrow: "Progress",
    progressTitle: "How a Deskia call works",
    progressDesc:
      "Deskia connects to your existing tools, understands caller intent, manages back-and-forth conversation, and executes actions in real time — on a build, test, deploy, monitor cycle.",
    steps: [
      { title: "Set up agents", desc: "Use a template to create an agent based on your call script." },
      { title: "Test agents", desc: "Run live calls in seconds and refine your prompts." },
      { title: "Deploy agents", desc: "Connect your own telephony or pick a Deskia number to go live." },
      { title: "Monitor agents", desc: "Track every call and outcome from the Deskia dashboard." },
    ],

    demoEyebrow: "Use Cases",
    demoTitle: "Try our live demo",
    demoDesc: "Discover how our AI caller transforms customer conversations.",
    callFormLabel: "Receive a live call from our agent",
    callFormPhone: "Phone Number",
    callFormEmail: "Email Address",
    callFormButton: "GET A CALL",

    integrationsEyebrow: "Integrations",
    integrationsTitle: "Integrate your tech stack",
    integrationsDesc:
      "Deskia plugs into your existing telephony, CRM and scheduling tools — so going live takes minutes, not weeks.",

    langLabel: "EN",
    footerCopy: "Deskia",
    footerDashboard: "Dashboard",
    footerSettings: "Settings",
    footerPrivacy: "Privacy",
    footerContact: "Contact",
  },
  fr: {
    navAbout: "À propos",
    navDashboard: "Tableau de bord",
    navSettings: "Paramètres",
    navDemo: "Démo",
    useCaseBadge: "Cas d'usage",
    heroTitleA: "Réceptionnistes IA",
    heroTitleB: "Qui mènent des conversations dignes d'un humain",
    heroDesc:
      "Avec Deskia comme réceptionniste IA, chaque interaction reflète les valeurs de votre marque — en heures de pointe, hors horaires, ou sur plusieurs fuseaux. Pas d'arborescence téléphonique : des conversations chaleureuses en français et en anglais.",
    heroPrimary: "ESSAYER GRATUITEMENT",
    heroSecondary: "CONTACTER LES VENTES",

    advantagesEyebrow: "Avantages Deskia",
    advantagesTitle: "Les bénéfices de Deskia comme réceptionniste IA",
    benefits: [
      {
        title: "Une meilleure expérience client dès le premier contact",
        desc: "Vos appelants sont accueillis par des réponses immédiates et naturelles, sans attente ni messagerie — créant la confiance dès le premier appel.",
      },
      {
        title: "Plus d'efficacité, moins de coûts",
        desc: "Automatisez les tâches d'accueil et libérez votre équipe pour les demandes complexes. Réduisez les coûts sans sacrifier la qualité de service.",
      },
      {
        title: "Évolutif pour toutes les tailles d'entreprise",
        desc: "De la petite clinique à la grande entreprise, Deskia gère de gros volumes d'appels — et répond automatiquement en français ou en anglais.",
      },
      {
        title: "Qualification avancée des prospects",
        desc: "Deskia identifie l'intention, collecte les informations clés et transmet les appels avec tout le contexte nécessaire à votre équipe commerciale.",
      },
    ],

    progressEyebrow: "Processus",
    progressTitle: "Comment fonctionne un appel Deskia",
    progressDesc:
      "Deskia se connecte à vos outils existants, comprend l'intention de l'appelant, mène la conversation et déclenche les actions en temps réel.",
    steps: [
      { title: "Configurez vos agents", desc: "Partez d'un modèle adapté à votre script d'appel." },
      { title: "Testez vos agents", desc: "Lancez des appels en direct et affinez vos prompts." },
      { title: "Déployez vos agents", desc: "Connectez votre téléphonie ou choisissez un numéro Deskia." },
      { title: "Suivez vos agents", desc: "Pilotez chaque appel depuis votre tableau de bord." },
    ],

    demoEyebrow: "Cas d'usage",
    demoTitle: "Essayez notre démo en direct",
    demoDesc: "Découvrez comment notre agent vocal IA transforme les conversations clients.",
    callFormLabel: "Recevez un appel en direct de notre agent",
    callFormPhone: "Numéro de téléphone",
    callFormEmail: "Adresse e-mail",
    callFormButton: "RECEVOIR UN APPEL",

    integrationsEyebrow: "Intégrations",
    integrationsTitle: "Intégrez votre stack technique",
    integrationsDesc:
      "Deskia se connecte à votre téléphonie, CRM et agenda existants — pour passer en production en quelques minutes.",

    langLabel: "FR",
    footerCopy: "Deskia",
    footerDashboard: "Tableau de bord",
    footerSettings: "Paramètres",
    footerPrivacy: "Confidentialité",
    footerContact: "Contact",
  },
};

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("homepage-lang");
    if (saved === "en" || saved === "fr") setLang(saved);
  }, []);
  const set = (l: Lang) => {
    localStorage.setItem("homepage-lang", l);
    setLang(l);
  };
  return [lang, set];
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deskia — AI Receptionists with Human-Like Conversations" },
      {
        name: "description",
        content:
          "Deskia is your 24/7 AI receptionist in French & English — handling FAQs, qualifying leads and booking meetings with human-like conversations.",
      },
      { property: "og:title", content: "Deskia — AI Receptionists" },
      {
        property: "og:description",
        content:
          "Human-like AI receptionists in French & English — answering calls, qualifying leads and booking meetings 24/7.",
      },
    ],
  }),
  component: HomePage,
});

const INTEGRATION_LOGOS = [
  "Twilio", "HubSpot", "Salesforce", "Calendly", "Cal.com", "Zapier",
  "Make", "Slack", "Stripe", "Google", "Microsoft Teams", "Zendesk",
  "Intercom", "Pipedrive", "Airtable", "Notion",
];

function HomePage() {
  const [lang, setLang] = useLang();
  const copy = t[lang];
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [activeCase, setActiveCase] = useState(0);

  const useCases = [
    { image: serviceReceptionist, label: lang === "fr" ? "Réceptionniste" : "Receptionist" },
    { image: serviceAppointments, label: lang === "fr" ? "Prise de rendez-vous" : "Appointment Setter" },
    { image: serviceLeads, label: lang === "fr" ? "Qualification de leads" : "Lead Qualification" },
    { image: serviceSurvey, label: lang === "fr" ? "Sondage" : "Survey" },
    { image: serviceSupport, label: lang === "fr" ? "Service client" : "Customer Service" },
    { image: serviceDebt, label: lang === "fr" ? "Recouvrement" : "Debt Collection" },
  ];

  const stepIcons = [Wrench, PlayCircle, Rocket, LineChart];

  function startLiveCall(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) return;
    navigate({ to: "/r/$slug/call", params: { slug: "demo" } });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoAsset.url}
              alt="Deskia AI"
              className="h-8 w-auto sm:h-10 md:h-12 rounded-lg border border-border/60 bg-white p-1"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#advantages" className="hover:text-foreground">{copy.navAbout}</a>
            <Link to="/app" className="hover:text-foreground">{copy.navDashboard}</Link>
            <Link to="/settings" className="hover:text-foreground">{copy.navSettings}</Link>
            <Link to="/r/$slug" params={{ slug: "demo" }} className="hover:text-foreground">{copy.navDemo}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "fr" : "en")}
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              aria-label="Toggle language"
            >
              <Languages className="h-3.5 w-3.5" />
              {copy.langLabel}
            </button>
            <Button asChild size="sm">
              <Link to="/app">
                {copy.navDashboard} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              {copy.useCaseBadge}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
                {copy.heroTitleA}
              </span>
              <br />
              <span className="text-foreground">{copy.heroTitleB}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.heroDesc}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/r/$slug/call" params={{ slug: "demo" }}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {copy.heroPrimary}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/contact">{copy.heroSecondary}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-xl">
              <img
                src={serviceReceptionist}
                alt="AI receptionist greeting a customer"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-3xl bg-gradient-to-br from-sky-400/40 via-violet-400/40 to-rose-400/40 blur-2xl md:block" />
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.advantagesEyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.advantagesTitle}
          </h2>
          <div className="mt-12 divide-y divide-border/60 border-y border-border/60">
            {copy.benefits.map((b, i) => (
              <div key={b.title} className="grid gap-6 py-8 md:grid-cols-[120px_1fr_2fr] md:items-start">
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <h3 className="text-xl font-semibold tracking-tight">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRESS / HOW IT WORKS */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.progressEyebrow}
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.progressTitle}</h2>
            <p className="text-muted-foreground">{copy.progressDesc}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((s, i) => {
              const Icon = stepIcons[i];
              return (
                <div
                  key={s.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 transition-colors hover:border-foreground/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-6 font-mono text-xs text-muted-foreground">0{i + 1}</div>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE DEMO + USE CASES */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.demoEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.demoTitle}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{copy.demoDesc}</p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-sm">
              <img
                src={useCases[activeCase].image}
                alt={useCases[activeCase].label}
                className="aspect-[4/3] w-full object-cover transition-opacity duration-500"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-sm font-medium backdrop-blur">
                {useCases[activeCase].label}
              </div>
            </div>

            <div>
              <form
                onSubmit={startLiveCall}
                className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm"
              >
                <p className="text-sm font-semibold">{copy.callFormLabel}</p>
                <div className="mt-4 grid gap-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder={copy.callFormPhone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={copy.callFormEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="mt-4 w-full rounded-full">
                  {copy.callFormButton}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {useCases.map((u, i) => (
              <button
                key={u.label}
                onClick={() => setActiveCase(i)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  i === activeCase
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.integrationsEyebrow}
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.integrationsTitle}</h2>
            <p className="text-muted-foreground">{copy.integrationsDesc}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {INTEGRATION_LOGOS.map((name) => (
              <div
                key={name}
                className="flex aspect-square items-center justify-center rounded-2xl border border-border/60 bg-background p-3 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} {copy.footerCopy}</span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/app" className="hover:text-foreground">{copy.footerDashboard}</Link>
            <Link to="/settings" className="hover:text-foreground">{copy.footerSettings}</Link>
            <Link to="/privacy" className="hover:text-foreground">{copy.footerPrivacy}</Link>
            <Link to="/contact" className="hover:text-foreground">{copy.footerContact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
