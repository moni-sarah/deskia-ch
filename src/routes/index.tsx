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
  Check,
  Headphones,
  Users,
  TrendingUp,
  HeartHandshake,
  Phone,
  Mail,
  Headset,
  Funnel,
  Building2,
  CalendarDays,
  ClipboardList,
  Banknote,
} from "lucide-react";
import { useState, useEffect } from "react";

type Lang = "en" | "fr";

const t = {
  en: {
    navAbout: "About",
    navDashboard: "Dashboard",
    navSettings: "Settings",
    navDemo: "Demo",
    badge: "Powered by your own knowledge base",
    heroEyebrow: "Try Our Live Demo",
    heroTitle: "Discover how our AI caller transforms customer conversations.",
    heroDesc:
      "Replies to FAQs, collects leads and books meetings — automatically in French and English, trained on your FAQs and documents.",
    callFormLabel: "Receive a live call from our AI",
    callFormPhone: "Phone Number",
    callFormEmail: "Email Address",
    callFormButton: "GET A CALL",
    useCasesTitle: "One AI caller for every front-desk job",
    aboutTitle: "Deskia AI – Your 24/7 Receptionist",
    aboutSubtitle: "Never miss another call or customer.",
    aboutDesc:
      "Deskia automatically answers calls, qualifies leads, books appointments and answers your customers' questions in French, English, German and Italian.",
    aboutChecks: [
      "Available 24/7",
      "Reduces admin costs",
      "Generates more appointments",
      "Improves customer experience",
    ],
    badge24: "24/7 availability",
    badgeLang: "FR & EN auto-detect",
    badgeData: "Your data, your rules",
    featuresTitle: "Everything a front-desk does — without the wait",
    featuresSubtitle:
      "One AI agent on your site that handles the repetitive work and routes the rest to you.",
    feat1Title: "Answers FAQs instantly",
    feat1Desc:
      "Prices, services, hours — replied to in seconds using your own knowledge base.",
    feat2Title: "Captures leads",
    feat2Desc:
      "Collects name, phone, email and request, saved to your dashboard.",
    feat3Title: "Books meetings",
    feat3Desc:
      "Shares your Calendly link for 15-min calls or 30-min consultations.",
    feat4Title: "French & English",
    feat4Desc:
      "Detects the customer's language automatically and replies in kind.",
    feat5Title: "Trained on your docs",
    feat5Desc:
      "Upload PDFs or Word documents — the AI uses them to answer.",
    feat6Title: "Always on",
    feat6Desc:
      "Working 24/7 so you never miss another lead, even after hours.",
    howTitle: "How it works",
    step1Title: "Add your knowledge",
    step1Desc: "Paste FAQs or import a PDF / Word document in Settings.",
    step2Title: "Share your link",
    step2Desc: "Send your Deskia page to customers or embed it on your site.",
    step3Title: "Get notified",
    step3Desc:
      "Leads appear in your dashboard with optional email or WhatsApp alerts.",
    demoTitle: "Ready to see it answer your customers?",
    demoDesc:
      "Add your FAQs, upload a PDF, and share your Deskia link.",
    demoConfigure: "Configure Deskia",
    demoOpen: "Open demo page",
    footerCopy: "Deskia",
    footerDashboard: "Dashboard",
    footerSettings: "Settings",
    footerPrivacy: "Privacy",
    footerContact: "Contact",
    langLabel: "EN",
  },
  fr: {
    navAbout: "À propos",
    navDashboard: "Tableau de bord",
    navSettings: "Paramètres",
    navDemo: "Démo",
    badge: "Alimenté par votre propre base de connaissances",
    heroEyebrow: "Essayez notre démo en direct",
    heroTitle: "Découvrez comment notre agent vocal IA transforme les conversations clients.",
    heroDesc:
      "Répond aux FAQ, collecte les prospects et planifie les rendez-vous — automatiquement en français et en anglais, formée sur vos FAQ et documents.",
    callFormLabel: "Recevez un appel en direct de notre IA",
    callFormPhone: "Numéro de téléphone",
    callFormEmail: "Adresse e-mail",
    callFormButton: "RECEVOIR UN APPEL",
    useCasesTitle: "Un agent vocal IA pour chaque tâche d'accueil",
    aboutTitle: "Deskia AI – Votre réceptionniste 24h/24",
    aboutSubtitle: "Ne manquez plus aucun appel ni aucun client.",
    aboutDesc:
      "Deskia répond automatiquement aux appels, qualifie les prospects, prend les rendez-vous et répond aux questions de vos clients en français, anglais, allemand et italien.",
    aboutChecks: [
      "Disponible 24h/24",
      "Réduit les coûts administratifs",
      "Génère plus de rendez-vous",
      "Améliore l'expérience client",
    ],
    badge24: "Disponible 24h/24",
    badgeLang: "FR & EN détection auto",
    badgeData: "Vos données, vos règles",
    featuresTitle: "Tout ce qu'une secrétaire fait — sans l'attente",
    featuresSubtitle:
      "Un agent IA sur votre site qui gère le travail répétitif et vous transmet le reste.",
    feat1Title: "Répond aux FAQ instantanément",
    feat2Title: "Capture les prospects",
    feat3Title: "Planifie les rendez-vous",
    feat4Title: "Français & Anglais",
    feat5Title: "Formée sur vos documents",
    feat6Title: "Toujours disponible",
    feat1Desc:
      "Prix, services, horaires — répondu en quelques secondes grâce à votre base de connaissances.",
    feat2Desc:
      "Collecte nom, téléphone, e-mail et demande, enregistrés dans votre tableau de bord.",
    feat3Desc:
      "Partage votre lien Calendly pour appels de 15 min ou consultations de 30 min.",
    feat4Desc:
      "Détecte automatiquement la langue du client et répond dans la même langue.",
    feat5Desc:
      "Importez des PDF ou Word — l'IA les utilise pour répondre.",
    feat6Desc:
      "Opérationnelle 24h/24 pour ne plus jamais manquer un prospect, même en dehors des heures.",
    howTitle: "Comment ça marche",
    step1Title: "Ajoutez vos connaissances",
    step1Desc:
      "Collez des FAQ ou importez un PDF / document Word dans les Paramètres.",
    step2Title: "Partagez votre lien",
    step2Desc:
      "Envoyez votre page Deskia aux clients ou intégrez-la sur votre site.",
    step3Title: "Soyez notifié",
    step3Desc:
      "Les prospects apparaissent dans votre tableau de bord avec alertes e-mail ou WhatsApp optionnelles.",
    demoTitle: "Prêt à la voir répondre à vos clients ?",
    demoDesc:
      "Ajoutez vos FAQ, importez un PDF et partagez votre lien Deskia.",
    demoConfigure: "Configurer Deskia",
    demoOpen: "Ouvrir la page démo",
    footerCopy: "Deskia",
    footerDashboard: "Tableau de bord",
    footerSettings: "Paramètres",
    footerPrivacy: "Confidentialité",
    footerContact: "Contact",
    langLabel: "FR",
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
      { title: "Deskia — 24/7 AI Caller in French & English" },
      {
        name: "description",
        content:
          "An AI caller that answers FAQs, captures leads and books meetings in French and English — trained on your own knowledge base.",
      },
      { property: "og:title", content: "Deskia — 24/7 AI Caller" },
      {
        property: "og:description",
        content:
          "Answer customer calls, capture leads and book meetings 24/7 in French & English.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [lang, setLang] = useLang();
  const copy = t[lang];
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const features = [
    { icon: MessageSquare, title: copy.feat1Title, desc: copy.feat1Desc },
    { icon: Bot, title: copy.feat2Title, desc: copy.feat2Desc },
    { icon: CalendarCheck, title: copy.feat3Title, desc: copy.feat3Desc },
    { icon: Globe2, title: copy.feat4Title, desc: copy.feat4Desc },
    { icon: FileText, title: copy.feat5Title, desc: copy.feat5Desc },
    { icon: Clock, title: copy.feat6Title, desc: copy.feat6Desc },
  ];

  const steps = [
    { title: copy.step1Title, desc: copy.step1Desc },
    { title: copy.step2Title, desc: copy.step2Desc },
    { title: copy.step3Title, desc: copy.step3Desc },
  ];

  const useCases = [
    { icon: Headset, image: serviceReceptionist, label: lang === "fr" ? "Réceptionniste" : "Receptionist" },
    { icon: Funnel, image: serviceLeads, label: lang === "fr" ? "Qualification de leads" : "Lead Qualification" },
    { icon: Building2, image: serviceSupport, label: lang === "fr" ? "Service client" : "Customer Service" },
    { icon: CalendarDays, image: serviceAppointments, label: lang === "fr" ? "Prise de rendez-vous" : "Appointment Setter" },
    { icon: ClipboardList, image: serviceSurvey, label: lang === "fr" ? "Sondage" : "Survey" },
    { icon: Banknote, image: serviceDebt, label: lang === "fr" ? "Recouvrement de créances" : "Debt Collection" },
  ];

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
            <a href="#about" className="hover:text-foreground">{copy.navAbout}</a>
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
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/settings">{copy.navSettings}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app">
                {copy.navDashboard} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center md:pt-24 md:pb-16">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {copy.heroEyebrow}
          </div>
          <h1 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {copy.heroDesc}
          </p>

          <form onSubmit={startLiveCall} className="mt-10 mx-auto max-w-xl rounded-2xl border border-border/60 bg-muted/20 p-2 text-left">
            <p className="mb-3 px-2 text-sm font-medium text-center">{copy.callFormLabel}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder={copy.callFormPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-11 bg-background"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={copy.callFormEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-background"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-3 w-full">
              {copy.callFormButton}
            </Button>
          </form>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">{copy.useCasesTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <div
                key={u.label}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-background transition-colors hover:bg-accent/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={u.image}
                    alt={u.label}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                    <u.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-4">
                  <span className="font-medium">{u.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                <Headphones className="h-3.5 w-3.5 text-chart-1" />
                Deskia AI
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {copy.aboutTitle}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {copy.aboutSubtitle}
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {copy.aboutDesc}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {copy.aboutChecks.map((check, i) => {
                  const icons = [
                    <Clock className="h-4 w-4 text-chart-1" />,
                    <TrendingUp className="h-4 w-4 text-chart-2" />,
                    <CalendarCheck className="h-4 w-4 text-chart-3" />,
                    <HeartHandshake className="h-4 w-4 text-chart-4" />,
                  ];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chart-1/10">
                        {icons[i]}
                      </div>
                      <span className="text-sm font-medium">{check}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-1/10">
                    <Bot className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Deskia</p>
                    <p className="text-xs text-muted-foreground">24/7 AI Receptionist</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-chart-2/10 px-2 py-0.5 text-xs font-medium text-chart-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                    Online
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="rounded-xl rounded-tl-none bg-muted/60 px-4 py-2 text-sm text-foreground">
                      Bonjour ! Comment puis-je vous aider aujourd'hui ?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="rounded-xl rounded-tr-none bg-primary px-4 py-2 text-sm text-primary-foreground">
                      Je voudrais prendre rendez-vous
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chart-3/10">
                      <Bot className="h-4 w-4 text-chart-3" />
                    </div>
                    <div className="rounded-xl rounded-tl-none bg-muted/60 px-4 py-2 text-sm text-foreground">
                      Bien sûr ! Quel jour vous conviendrait ?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">{copy.featuresTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            {copy.featuresSubtitle}
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
          <h2 className="text-center text-3xl font-semibold tracking-tight">{copy.howTitle}</h2>
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
          <h2 className="text-3xl font-semibold tracking-tight">{copy.demoTitle}</h2>
          <p className="mt-3 text-muted-foreground">
            {copy.demoDesc}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/settings">{copy.demoConfigure}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/r/$slug" params={{ slug: "demo" }}>{copy.demoOpen}</Link>
            </Button>
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
