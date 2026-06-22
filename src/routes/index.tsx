import logoAsset from "@/assets/deskia-logo.png.asset.json";
import serviceReceptionist from "@/assets/service-receptionist.jpg";
import serviceLeads from "@/assets/service-leads.jpg";
import serviceSupport from "@/assets/service-support.jpg";
import serviceAppointments from "@/assets/service-appointments.jpg";
import serviceSurvey from "@/assets/service-survey.jpg";
import serviceDebt from "@/assets/service-debt.jpg";
import heroVideo from "@/assets/hero.mp4.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Search,
  Workflow,
  Bot,
  LineChart,
  Calendar,
  Mail,
  PhoneCall,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { useSiteLang, LangSwitcher, CALENDLY_URL, type SiteLang } from "@/lib/site-lang";

type Copy = {
  navServices: string;
  navProcess: string;
  navDemo: string;
  navContact: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleB: string;
  heroDesc: string;
  trustLine: string;
  servicesEyebrow: string;
  servicesTitle: string;
  services: { title: string; desc: string; image: string }[];
  processEyebrow: string;
  processTitle: string;
  processDesc: string;
  steps: { title: string; desc: string }[];
  whyEyebrow: string;
  whyTitle: string;
  why: { title: string; desc: string }[];
  demoEyebrow: string;
  demoTitle: string;
  demoDesc: string;
  demoCta: string;
  ctaSectionTitle: string;
  ctaSectionDesc: string;
  bookCall: string;
  writeUs: string;
  footerRights: string;
  footerPrivacy: string;
  footerContact: string;
};

const COPY: Record<SiteLang, Copy> = {
  fr: {
    navServices: "Services",
    navProcess: "Processus",
    navDemo: "Démo",
    navContact: "Contact",
    ctaPrimary: "Réserver un audit",
    ctaSecondary: "Nous contacter",
    heroEyebrow: "Agence Suisse d'automatisation IA",
    heroTitleA: "Automatisation IA pour PME suisses,",
    heroTitleB: "et une réception qui ne dort jamais.",
    heroDesc:
      "Deskia est une agence basée en Suisse qui audite votre entreprise, identifie les tâches répétitives et les remplace par des automatisations sur mesure — y compris une réceptionniste IA disponible 24h/24, en français, allemand et anglais.",
    trustLine: "Basé à Genève, Suisse · Conforme RGPD/LPD · Hébergé en Europe",
    servicesEyebrow: "Ce que nous faisons",
    servicesTitle: "Deux offres, un objectif : libérer votre équipe",
    services: [
      {
        title: "Réceptionniste IA 24/7",
        desc: "Une voix IA naturelle qui répond à chaque appel, qualifie les demandes, prend les rendez-vous et transmet les urgences — en FR, DE et EN.",
        image: serviceReceptionist,
      },
      {
        title: "Audit & automatisations sur mesure",
        desc: "Nous cartographions vos tâches répétitives (devis, relances, prise de RDV, saisie CRM) et construisons les workflows qui les font disparaître.",
        image: serviceAppointments,
      },
    ],
    processEyebrow: "Notre méthode",
    processTitle: "Vous n'avez rien à configurer.",
    processDesc:
      "Vous nous parlez de votre quotidien. Nous identifions les tâches à fort gain, nous les construisons, et nous les opérons pour vous.",
    steps: [
      { title: "Audit gratuit", desc: "30 min d'échange : nous cartographions les tâches répétitives qui coûtent le plus de temps." },
      { title: "Plan d'automatisation", desc: "Devis clair : ce qu'on automatise, le gain de temps estimé et le délai de livraison." },
      { title: "Construction & connexion", desc: "Nous construisons l'IA et les workflows, branchés à vos outils (CRM, agenda, téléphonie, e-mail)." },
      { title: "Pilotage continu", desc: "Nous monitorons, ajustons et faisons évoluer vos agents IA mois après mois." },
    ],
    whyEyebrow: "Pourquoi Deskia",
    whyTitle: "Une équipe Suisse, des résultats mesurables.",
    why: [
      { title: "Disponibilité 24/7", desc: "Plus aucun appel manqué, plus aucun lead perdu — y compris le soir et le week-end." },
      { title: "Conformité Suisse / UE", desc: "Données hébergées en Europe, conformes LPD et RGPD. Confidentialité par défaut." },
      { title: "Multilingue natif", desc: "Français, allemand suisse et anglais — détection automatique de la langue du client." },
      { title: "ROI rapide", desc: "Premiers gains en quelques semaines, sans bouleverser vos outils existants." },
    ],
    demoEyebrow: "Démo en direct",
    demoTitle: "Écoutez la réceptionniste IA en action.",
    demoDesc:
      "Lancez un appel vidéo de démonstration. Posez-lui une question, demandez un rendez-vous — comme le ferait un de vos clients.",
    demoCta: "Lancer la démo",
    ctaSectionTitle: "Prêt à automatiser les tâches qui vous épuisent ?",
    ctaSectionDesc:
      "Réservez un audit gratuit de 30 minutes. Nous regardons votre activité, nous chiffrons le potentiel d'automatisation, et nous vous remettons un plan clair.",
    bookCall: "Réserver l'audit",
    writeUs: "Écrire un message",
    footerRights: "Tous droits réservés.",
    footerPrivacy: "Confidentialité",
    footerContact: "Contact",
  },
  en: {
    navServices: "Services",
    navProcess: "Process",
    navDemo: "Demo",
    navContact: "Contact",
    ctaPrimary: "Book a free audit",
    ctaSecondary: "Contact us",
    heroEyebrow: "Swiss AI automation agency",
    heroTitleA: "AI automation for Swiss SMEs,",
    heroTitleB: "and a front desk that never sleeps.",
    heroDesc:
      "Deskia is a Switzerland-based agency. We audit your business, find the repetitive tasks that drain your team, and replace them with custom automations — including a 24/7 AI receptionist in French, German and English.",
    trustLine: "Based in Geneva, Switzerland · GDPR / FADP compliant · EU hosting",
    servicesEyebrow: "What we do",
    servicesTitle: "Two services, one goal: free your team's time.",
    services: [
      {
        title: "24/7 AI receptionist",
        desc: "A natural AI voice that answers every call, qualifies requests, books appointments and routes urgent calls — in FR, DE and EN.",
        image: serviceReceptionist,
      },
      {
        title: "Audit & custom automations",
        desc: "We map your repetitive tasks (quotes, follow-ups, scheduling, CRM data entry) and build the workflows that make them disappear.",
        image: serviceAppointments,
      },
    ],
    processEyebrow: "How we work",
    processTitle: "You configure nothing. We do.",
    processDesc:
      "You tell us about your day-to-day. We identify the highest-impact tasks, we build them, and we operate them for you.",
    steps: [
      { title: "Free audit", desc: "30-minute call. We map the repetitive tasks costing your team the most time." },
      { title: "Automation plan", desc: "Clear quote: what we automate, expected time saved, and delivery timeline." },
      { title: "Build & connect", desc: "We build the AI agents and workflows, wired into your tools (CRM, calendar, phone, email)." },
      { title: "Ongoing operation", desc: "We monitor, fine-tune and evolve your AI agents month after month." },
    ],
    whyEyebrow: "Why Deskia",
    whyTitle: "A Swiss team. Measurable results.",
    why: [
      { title: "24/7 availability", desc: "No more missed calls, no more lost leads — evenings and weekends included." },
      { title: "Swiss / EU compliant", desc: "Data hosted in Europe, FADP & GDPR compliant. Privacy by default." },
      { title: "Native multilingual", desc: "French, Swiss German and English — automatic language detection per caller." },
      { title: "Fast ROI", desc: "First wins within weeks, without disrupting your existing tooling." },
    ],
    demoEyebrow: "Live demo",
    demoTitle: "Hear the AI receptionist in action.",
    demoDesc:
      "Launch a live video demo call. Ask a question, request an appointment — exactly like one of your customers would.",
    demoCta: "Launch demo",
    ctaSectionTitle: "Ready to automate the tasks that drain your team?",
    ctaSectionDesc:
      "Book a free 30-minute audit. We review your business, estimate the automation potential and hand you a clear plan.",
    bookCall: "Book the audit",
    writeUs: "Send a message",
    footerRights: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerContact: "Contact",
  },
  de: {
    navServices: "Leistungen",
    navProcess: "Prozess",
    navDemo: "Demo",
    navContact: "Kontakt",
    ctaPrimary: "Kostenloses Audit buchen",
    ctaSecondary: "Kontakt aufnehmen",
    heroEyebrow: "Schweizer Agentur für KI-Automatisierung",
    heroTitleA: "KI-Automatisierung für Schweizer KMU,",
    heroTitleB: "und ein Empfang, der nie schläft.",
    heroDesc:
      "Deskia ist eine Agentur mit Sitz in der Schweiz. Wir auditieren Ihr Unternehmen, identifizieren wiederkehrende Aufgaben und ersetzen sie durch massgeschneiderte Automatisierungen — inklusive eines 24/7 KI-Empfangs auf Deutsch, Französisch und Englisch.",
    trustLine: "Sitz in Genf, Schweiz · DSG / DSGVO-konform · Hosting in der EU",
    servicesEyebrow: "Was wir tun",
    servicesTitle: "Zwei Leistungen, ein Ziel: Ihr Team entlasten.",
    services: [
      {
        title: "24/7 KI-Empfang",
        desc: "Eine natürliche KI-Stimme nimmt jeden Anruf entgegen, qualifiziert Anfragen, vereinbart Termine und leitet dringende Anrufe weiter — auf DE, FR und EN.",
        image: serviceReceptionist,
      },
      {
        title: "Audit & massgeschneiderte Automatisierungen",
        desc: "Wir erfassen Ihre repetitiven Aufgaben (Offerten, Nachfassen, Terminierung, CRM-Eingaben) und bauen die Workflows, die sie eliminieren.",
        image: serviceAppointments,
      },
    ],
    processEyebrow: "So arbeiten wir",
    processTitle: "Sie konfigurieren nichts. Wir schon.",
    processDesc:
      "Sie erzählen uns von Ihrem Alltag. Wir identifizieren die wirkungsvollsten Aufgaben, bauen sie und betreiben sie für Sie.",
    steps: [
      { title: "Kostenloses Audit", desc: "30 Minuten Gespräch: Wir kartieren die repetitiven Aufgaben, die am meisten Zeit kosten." },
      { title: "Automatisierungsplan", desc: "Klare Offerte: Was automatisieren wir, geschätzte Zeitersparnis, Liefertermin." },
      { title: "Aufbau & Anbindung", desc: "Wir bauen die KI-Agenten und Workflows und binden sie an Ihre Tools (CRM, Kalender, Telefonie, E-Mail) an." },
      { title: "Laufender Betrieb", desc: "Wir überwachen, optimieren und entwickeln Ihre KI-Agenten Monat für Monat weiter." },
    ],
    whyEyebrow: "Warum Deskia",
    whyTitle: "Ein Schweizer Team. Messbare Ergebnisse.",
    why: [
      { title: "24/7 erreichbar", desc: "Keine verpassten Anrufe, keine verlorenen Leads mehr — auch abends und am Wochenende." },
      { title: "CH/EU-konform", desc: "Daten in Europa gehostet, DSG- und DSGVO-konform. Datenschutz von Anfang an." },
      { title: "Mehrsprachig", desc: "Deutsch, Französisch und Englisch — automatische Spracherkennung pro Anrufer." },
      { title: "Schneller ROI", desc: "Erste Erfolge in wenigen Wochen, ohne Ihre bestehenden Tools umzustellen." },
    ],
    demoEyebrow: "Live-Demo",
    demoTitle: "Hören Sie den KI-Empfang in Aktion.",
    demoDesc:
      "Starten Sie einen Live-Video-Demoanruf. Stellen Sie eine Frage oder buchen Sie einen Termin — wie es Ihre Kunden tun würden.",
    demoCta: "Demo starten",
    ctaSectionTitle: "Bereit, die zeitfressenden Aufgaben zu automatisieren?",
    ctaSectionDesc:
      "Buchen Sie ein kostenloses 30-Minuten-Audit. Wir analysieren Ihr Geschäft, schätzen das Automatisierungspotenzial und übergeben Ihnen einen klaren Plan.",
    bookCall: "Audit buchen",
    writeUs: "Nachricht senden",
    footerRights: "Alle Rechte vorbehalten.",
    footerPrivacy: "Datenschutz",
    footerContact: "Kontakt",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deskia — Swiss AI automation & 24/7 AI receptionist" },
      {
        name: "description",
        content:
          "Deskia is a Swiss agency that audits your business, automates repetitive tasks and runs a 24/7 AI receptionist in French, German and English.",
      },
      { property: "og:title", content: "Deskia — Swiss AI automation agency" },
      {
        property: "og:description",
        content:
          "We audit your business, automate the repetitive tasks and run your 24/7 AI receptionist. Based in Switzerland.",
      },
    ],
  }),
  component: HomePage,
});

const stepIcons = [Search, Workflow, Bot, LineChart];
const whyIcons = [Clock, ShieldCheck, Sparkles, LineChart];

function HomePage() {
  const { lang } = useSiteLang();
  const copy = COPY[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoAsset.url}
              alt="Deskia"
              className="h-9 w-auto rounded-lg border border-border/60 bg-white p-1"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#services" className="hover:text-foreground">{copy.navServices}</a>
            <a href="#process" className="hover:text-foreground">{copy.navProcess}</a>
            <a href="#demo" className="hover:text-foreground">{copy.navDemo}</a>
            <Link to="/contact" className="hover:text-foreground">{copy.navContact}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Button asChild size="sm" className="rounded-full">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                {copy.ctaPrimary} <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,theme(colors.sky.400/0.12),transparent_60%),radial-gradient(circle_at_bottom_right,theme(colors.rose.400/0.10),transparent_60%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              🇨🇭 {copy.heroEyebrow}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-foreground">{copy.heroTitleA}</span>{" "}
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
                {copy.heroTitleB}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.heroDesc}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  {copy.ctaPrimary}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/contact">{copy.ctaSecondary}</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
              {copy.trustLine}
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-xl">
              <video
                src={heroVideo.url}
                poster={serviceReceptionist}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-3xl bg-gradient-to-br from-sky-400/30 via-violet-400/30 to-rose-400/30 blur-2xl md:block" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.servicesEyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.servicesTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {copy.services.map((s, i) => (
              <div
                key={s.title}
                className="group overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                      {i === 0 ? <PhoneCall className="h-4 w-4" /> : <Workflow className="h-4 w-4" />}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.processEyebrow}
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.processTitle}</h2>
            <p className="text-muted-foreground">{copy.processDesc}</p>
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

      {/* WHY DESKIA */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {copy.whyEyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.whyTitle}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.why.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={w.title} className="rounded-2xl border border-border/60 bg-background p-6">
                  <Icon className="h-6 w-6 text-foreground" />
                  <h3 className="mt-4 font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {copy.demoEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {copy.demoTitle}
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{copy.demoDesc}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to="/r/$slug/call" params={{ slug: "demo" }}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {copy.demoCta}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                    <Calendar className="mr-2 h-4 w-4" />
                    {copy.bookCall}
                  </a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[serviceReceptionist, serviceAppointments, serviceLeads, serviceSupport, serviceSurvey, serviceDebt].slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border/60 shadow-sm"
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-gradient-to-br from-foreground to-foreground/90 text-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.ctaSectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-background/70">{copy.ctaSectionDesc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                <Calendar className="mr-2 h-4 w-4" />
                {copy.bookCall}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-background/30 bg-transparent px-6 text-background hover:bg-background/10 hover:text-background">
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                {copy.writeUs}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Deskia — {copy.footerRights}</span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="hover:text-foreground">{copy.footerPrivacy}</Link>
            <Link to="/contact" className="hover:text-foreground">{copy.footerContact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
