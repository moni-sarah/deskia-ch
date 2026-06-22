import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Globe2,
  PhoneCall,
  Calendar,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useSiteLang, LangSwitcher, CALENDLY_URL } from "@/lib/site-lang";
import logoAsset from "@/assets/deskia-logo.png.asset.json";
import serviceReceptionist from "@/assets/service-receptionist.jpg";

export const Route = createFileRoute("/ai-receptionist-switzerland")({
  head: () => ({
    meta: [
      { title: "AI Receptionist in Switzerland — 24/7 FR / DE / EN | Deskia" },
      {
        name: "description",
        content:
          "Deskia builds 24/7 AI receptionists for Swiss businesses. Answers FAQs, books meetings and captures leads in French, German and English. Geneva-based, GDPR/FADP compliant, EU hosting.",
      },
      {
        name: "keywords",
        content:
          "AI receptionist Switzerland, virtual receptionist Switzerland, réceptionniste IA Suisse, réceptionniste IA Genève, KI Empfang Schweiz, AI assistant Swiss SME, 24/7 receptionist Geneva, automated receptionist Switzerland",
      },
      { property: "og:title", content: "AI Receptionist in Switzerland — Deskia" },
      {
        property: "og:description",
        content:
          "24/7 AI receptionist for Swiss businesses. FR / DE / EN. Geneva-based, GDPR/FADP compliant.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ai-receptionist-switzerland" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: "AI Receptionist in Switzerland — Deskia" },
      {
        name: "twitter:description",
        content: "24/7 AI receptionist for Swiss SMEs in FR / DE / EN.",
      },
    ],
    links: [{ rel: "canonical", href: "/ai-receptionist-switzerland" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Receptionist Switzerland",
          serviceType: "AI Receptionist",
          provider: {
            "@type": "ProfessionalService",
            name: "Deskia",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Geneva",
              addressRegion: "GE",
              addressCountry: "CH",
            },
          },
          areaServed: {
            "@type": "Country",
            name: "Switzerland",
          },
          availableLanguage: ["French", "German", "English"],
          description:
            "24/7 AI receptionist for Swiss businesses. Answers FAQs, books meetings, and captures leads in French, German and English.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is an AI receptionist?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "An AI receptionist is a 24/7 virtual assistant that greets visitors on your website, answers frequent questions, books meetings, and captures qualified leads — automatically and in multiple languages.",
              },
            },
            {
              "@type": "Question",
              name: "Does the AI receptionist speak French, German and English?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Deskia's AI receptionist detects the visitor's language and replies in French, German or English — ideal for Swiss businesses serving multilingual customers.",
              },
            },
            {
              "@type": "Question",
              name: "Is the AI receptionist GDPR and FADP compliant?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Deskia is based in Geneva, Switzerland, hosts data in the EU, and operates in line with GDPR and the Swiss Federal Act on Data Protection (FADP / nLPD).",
              },
            },
            {
              "@type": "Question",
              name: "How fast can I deploy an AI receptionist on my Swiss business website?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most Deskia AI receptionists are live within one to two weeks: business audit, knowledge base setup, AI configuration in your languages, and embed on your site.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AiReceptionistSwitzerland,
});

type Copy = {
  eyebrow: string;
  h1: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  featuresTitle: string;
  features: { title: string; desc: string }[];
  whyTitle: string;
  whyBullets: string[];
  citiesTitle: string;
  citiesDesc: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  closingTitle: string;
  closingDesc: string;
  backHome: string;
};

const COPY: Record<"fr" | "en" | "de", Copy> = {
  en: {
    eyebrow: "AI Receptionist · Switzerland",
    h1: "The 24/7 AI Receptionist for Swiss businesses",
    intro:
      "Deskia builds AI receptionists for Swiss SMEs. Your virtual assistant answers customer questions, books meetings and captures leads around the clock — in French, German and English. Based in Geneva, hosted in Europe, compliant with GDPR and the Swiss FADP.",
    ctaPrimary: "Book a free 30-min audit",
    ctaSecondary: "See live demo",
    featuresTitle: "What your AI receptionist does",
    features: [
      { title: "Answers in seconds, 24/7", desc: "Every visitor gets an instant reply, even at 2am or on Sunday. No missed leads, no voicemail." },
      { title: "Multilingual by default", desc: "French, German and English out of the box — your AI auto-detects the visitor's language." },
      { title: "Books meetings into your calendar", desc: "Connects to Calendly or any booking link. The AI proposes slots and sends invites." },
      { title: "Captures qualified leads", desc: "Name, phone, email, company and intent — pushed to your Google Sheet, email and CRM via webhook." },
      { title: "Trained on your business", desc: "We feed it your prices, services, opening hours and FAQs so answers stay on-brand." },
      { title: "Swiss-grade compliance", desc: "EU hosting, GDPR / FADP aligned, no data resale. Built for Swiss banking, legal, medical and B2B teams." },
    ],
    whyTitle: "Why Swiss businesses choose Deskia",
    whyBullets: [
      "Geneva-based team — French, German and English-speaking",
      "EU hosting, GDPR / FADP (nLPD) compliant",
      "Live in 1–2 weeks, not 3 months",
      "Integrates with Calendly, Google Sheets, Resend, Twilio WhatsApp",
      "Custom AI knowledge base trained on your prices, services and FAQs",
    ],
    citiesTitle: "Serving the whole of Switzerland",
    citiesDesc:
      "We work with SMEs across Geneva, Lausanne, Zurich, Bern, Basel, Lugano and beyond — remotely. Whether you serve French, German or Italian-speaking Switzerland, your AI receptionist greets each visitor in their language.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What is an AI receptionist?", a: "A 24/7 virtual assistant on your website that greets visitors, answers frequent questions, books meetings and captures qualified leads — automatically." },
      { q: "Does it speak French, German and English?", a: "Yes. Our AI detects the visitor's language and replies in FR / DE / EN — perfect for Switzerland's multilingual market." },
      { q: "Is it GDPR and FADP compliant?", a: "Yes. Deskia is based in Geneva, hosts data in the EU and operates in line with the GDPR and the Swiss Federal Act on Data Protection (FADP / nLPD)." },
      { q: "How long does setup take?", a: "Typically 1–2 weeks: audit your business, build the knowledge base, configure the AI in your languages, embed on your site." },
      { q: "Can it replace my front desk completely?", a: "It handles the repetitive front-desk work — FAQs, scheduling, lead intake — so your team focuses on real conversations. Many Swiss SMEs run it as their only first-line contact channel." },
    ],
    closingTitle: "Ready to put a 24/7 AI receptionist on your site?",
    closingDesc:
      "Book a free 30-minute audit. We'll review your business, identify what the AI can automate, and show you a working demo of your receptionist.",
    backHome: "Back to Deskia",
  },
  fr: {
    eyebrow: "Réceptionniste IA · Suisse",
    h1: "La réceptionniste IA 24/7 pour les entreprises suisses",
    intro:
      "Deskia crée des réceptionnistes IA pour les PME suisses. Votre assistant virtuel répond aux questions, prend les rendez-vous et capture les leads 24h/24 — en français, allemand et anglais. Basé à Genève, hébergé en Europe, conforme RGPD et LPD.",
    ctaPrimary: "Réserver un audit gratuit (30 min)",
    ctaSecondary: "Voir la démo en direct",
    featuresTitle: "Ce que fait votre réceptionniste IA",
    features: [
      { title: "Répond en secondes, 24/7", desc: "Chaque visiteur reçoit une réponse instantanée, même à 2h du matin ou un dimanche. Plus de leads perdus." },
      { title: "Multilingue par défaut", desc: "Français, allemand et anglais — l'IA détecte automatiquement la langue du visiteur." },
      { title: "Prend les rendez-vous", desc: "Connecté à Calendly ou tout autre outil. L'IA propose les créneaux et envoie les invitations." },
      { title: "Capture les leads qualifiés", desc: "Nom, téléphone, email, société, intention — envoyés vers votre Google Sheet, email et CRM via webhook." },
      { title: "Formé sur votre entreprise", desc: "Nous l'entraînons sur vos prix, services, horaires et FAQ pour des réponses précises." },
      { title: "Conformité suisse", desc: "Hébergement EU, conforme RGPD / LPD (nLPD), sans revente de données. Pensé pour les cabinets, études, cliniques et PME B2B." },
    ],
    whyTitle: "Pourquoi les entreprises suisses choisissent Deskia",
    whyBullets: [
      "Équipe basée à Genève — français, allemand et anglais",
      "Hébergement EU, conforme RGPD / LPD (nLPD)",
      "En production en 1–2 semaines, pas 3 mois",
      "S'intègre avec Calendly, Google Sheets, Resend, Twilio WhatsApp",
      "Base de connaissances IA sur mesure : prix, services, FAQ",
    ],
    citiesTitle: "Au service de toute la Suisse",
    citiesDesc:
      "Nous accompagnons les PME à Genève, Lausanne, Zurich, Berne, Bâle, Lugano et au-delà — à distance. Que votre clientèle soit romande, alémanique ou tessinoise, votre réceptionniste IA l'accueille dans sa langue.",
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Qu'est-ce qu'une réceptionniste IA ?", a: "Un assistant virtuel 24/7 sur votre site qui accueille les visiteurs, répond aux questions fréquentes, prend les rendez-vous et capture les leads qualifiés — automatiquement." },
      { q: "Parle-t-elle français, allemand et anglais ?", a: "Oui. Notre IA détecte la langue du visiteur et répond en FR / DE / EN — parfait pour le marché multilingue suisse." },
      { q: "Est-elle conforme RGPD et LPD ?", a: "Oui. Deskia est basée à Genève, héberge les données en Europe et opère en conformité avec le RGPD et la Loi fédérale sur la protection des données (LPD / nLPD)." },
      { q: "Combien de temps pour la mise en place ?", a: "Généralement 1–2 semaines : audit, construction de la base de connaissances, configuration multilingue, intégration sur votre site." },
      { q: "Peut-elle remplacer totalement mon accueil ?", a: "Elle prend en charge le travail répétitif — FAQ, prise de RDV, collecte de leads — pour que votre équipe se concentre sur les vraies conversations. De nombreuses PME suisses l'utilisent comme premier canal de contact." },
    ],
    closingTitle: "Prêt à mettre une réceptionniste IA 24/7 sur votre site ?",
    closingDesc:
      "Réservez un audit gratuit de 30 minutes. Nous analysons votre activité, identifions ce que l'IA peut automatiser et vous montrons une démo de votre réceptionniste.",
    backHome: "Retour à Deskia",
  },
  de: {
    eyebrow: "KI-Empfang · Schweiz",
    h1: "Der 24/7 KI-Empfang für Schweizer Unternehmen",
    intro:
      "Deskia entwickelt KI-Empfänge für Schweizer KMU. Ihr virtueller Assistent beantwortet Kundenfragen, vereinbart Termine und erfasst Leads rund um die Uhr — auf Deutsch, Französisch und Englisch. Sitz in Genf, Hosting in Europa, DSGVO- und DSG-konform.",
    ctaPrimary: "Kostenloses 30-Min-Audit buchen",
    ctaSecondary: "Live-Demo ansehen",
    featuresTitle: "Was Ihr KI-Empfang leistet",
    features: [
      { title: "Antwortet in Sekunden, 24/7", desc: "Jeder Besucher erhält sofort eine Antwort — auch nachts oder sonntags. Keine verpassten Leads." },
      { title: "Standardmässig mehrsprachig", desc: "Deutsch, Französisch und Englisch — die KI erkennt automatisch die Sprache des Besuchers." },
      { title: "Bucht Termine in Ihren Kalender", desc: "Verbunden mit Calendly oder jedem Buchungs-Tool. Die KI schlägt Slots vor und versendet Einladungen." },
      { title: "Erfasst qualifizierte Leads", desc: "Name, Telefon, E-Mail, Firma, Anliegen — direkt in Ihr Google Sheet, E-Mail und CRM per Webhook." },
      { title: "Auf Ihr Unternehmen trainiert", desc: "Wir trainieren die KI mit Ihren Preisen, Leistungen, Öffnungszeiten und FAQs für präzise Antworten." },
      { title: "Schweizer Compliance", desc: "EU-Hosting, DSGVO- und DSG-konform, kein Datenweiterverkauf. Gemacht für Banking, Recht, Medizin und B2B in der Schweiz." },
    ],
    whyTitle: "Warum Schweizer Unternehmen Deskia wählen",
    whyBullets: [
      "Team in Genf — Deutsch, Französisch und Englisch",
      "EU-Hosting, DSGVO- und DSG-konform",
      "In 1–2 Wochen live, nicht in 3 Monaten",
      "Integriert mit Calendly, Google Sheets, Resend, Twilio WhatsApp",
      "Massgeschneiderte KI-Wissensbasis: Preise, Leistungen, FAQs",
    ],
    citiesTitle: "Für die ganze Schweiz",
    citiesDesc:
      "Wir betreuen KMU in Zürich, Bern, Basel, Genf, Lausanne, Lugano und darüber hinaus — remote. Ob deutsch-, französisch- oder italienischsprachige Schweiz, Ihr KI-Empfang begrüsst jeden in seiner Sprache.",
    faqTitle: "Häufige Fragen",
    faqs: [
      { q: "Was ist ein KI-Empfang?", a: "Ein virtueller 24/7-Assistent auf Ihrer Website, der Besucher begrüsst, häufige Fragen beantwortet, Termine bucht und qualifizierte Leads erfasst — automatisch." },
      { q: "Spricht er Deutsch, Französisch und Englisch?", a: "Ja. Unsere KI erkennt die Sprache des Besuchers und antwortet auf DE / FR / EN — perfekt für den mehrsprachigen Schweizer Markt." },
      { q: "Ist er DSGVO- und DSG-konform?", a: "Ja. Deskia hat ihren Sitz in Genf, hostet Daten in der EU und arbeitet in Übereinstimmung mit der DSGVO und dem Schweizer Datenschutzgesetz (DSG / nDSG)." },
      { q: "Wie lange dauert die Einrichtung?", a: "In der Regel 1–2 Wochen: Audit, Aufbau der Wissensbasis, mehrsprachige Konfiguration, Einbindung auf Ihrer Website." },
      { q: "Kann er meinen Empfang komplett ersetzen?", a: "Er übernimmt die wiederkehrende Arbeit — FAQs, Terminvereinbarung, Lead-Erfassung — damit Ihr Team sich auf echte Gespräche konzentriert. Viele Schweizer KMU nutzen ihn als einzigen ersten Kontaktkanal." },
    ],
    closingTitle: "Bereit, einen 24/7 KI-Empfang auf Ihre Website zu stellen?",
    closingDesc:
      "Buchen Sie ein kostenloses 30-Minuten-Audit. Wir analysieren Ihr Geschäft, identifizieren das Automatisierungspotenzial und zeigen Ihnen eine Demo Ihres KI-Empfangs.",
    backHome: "Zurück zu Deskia",
  },
};

function AiReceptionistSwitzerland() {
  const { lang } = useSiteLang();
  const copy = COPY[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Deskia — Swiss AI automation agency"
              className="h-14 w-auto rounded-lg border border-border/60 bg-white p-1"
            />
            <span className="text-2xl font-bold tracking-tight">Deskia</span>
          </Link>
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
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {copy.eyebrow}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {copy.h1}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {copy.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  {copy.ctaPrimary} <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/">{copy.ctaSecondary}</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 24/7</span>
              <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" /> FR · DE · EN</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> RGPD / LPD</span>
            </div>
          </div>
          <div className="relative">
            <img
              src={serviceReceptionist}
              alt="AI receptionist for Swiss businesses, available 24/7 in French, German and English"
              className="relative w-full rounded-2xl border border-border/60 object-cover shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{copy.featuresTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.features.map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-b border-border/60 bg-muted/30 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{copy.whyTitle}</h2>
          </div>
          <ul className="space-y-3">
            {copy.whyBullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CITIES */}
      <section className="border-b border-border/60 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{copy.citiesTitle}</h2>
          <p className="mt-4 text-base text-muted-foreground">{copy.citiesDesc}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {["Geneva", "Lausanne", "Zurich", "Bern", "Basel", "Lugano", "Fribourg", "Neuchâtel", "Sion"].map((c) => (
              <span key={c} className="rounded-full border border-border/60 px-3 py-1">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border/60 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{copy.faqTitle}</h2>
          <div className="mt-8 space-y-4">
            {copy.faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="text-base font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{copy.closingTitle}</h2>
          <p className="mt-4 text-base text-muted-foreground">{copy.closingDesc}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                <Calendar className="mr-1 h-4 w-4" /> {copy.ctaPrimary}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/">
                <PhoneCall className="mr-1 h-4 w-4" /> {copy.backHome}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
