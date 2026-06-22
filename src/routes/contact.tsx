import logoAsset from "@/assets/deskia-logo.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Calendar, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  useSiteLang,
  LangSwitcher,
  CALENDLY_URL,
  CONTACT_EMAIL,
  type SiteLang,
} from "@/lib/site-lang";

type Copy = {
  back: string;
  title: string;
  subtitle: string;
  bookEyebrow: string;
  bookTitle: string;
  bookDesc: string;
  bookCta: string;
  formEyebrow: string;
  formTitle: string;
  formDesc: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  errorRequired: string;
  emailLabel: string;
  emailDesc: string;
  locationLabel: string;
  locationDesc: string;
};

const COPY: Record<SiteLang, Copy> = {
  fr: {
    back: "Retour",
    title: "Parlons de vos automatisations",
    subtitle:
      "Que vous vouliez tester la réceptionniste IA ou automatiser un workflow précis, écrivez-nous ou réservez un audit gratuit de 30 minutes.",
    bookEyebrow: "Le plus rapide",
    bookTitle: "Réserver un audit gratuit",
    bookDesc: "30 minutes pour cartographier vos tâches répétitives et chiffrer le potentiel d'automatisation.",
    bookCta: "Choisir un créneau",
    formEyebrow: "Ou écrivez-nous",
    formTitle: "Envoyez-nous un message",
    formDesc: "Décrivez en quelques lignes ce que vous voulez automatiser. Nous revenons vers vous sous 24 h.",
    name: "Nom",
    company: "Entreprise",
    email: "E-mail",
    phone: "Téléphone (optionnel)",
    message: "Votre message",
    messagePlaceholder: "Ex : nous recevons 40 appels par jour, j'aimerais qu'une IA réponde et prenne les rendez-vous…",
    send: "Envoyer",
    sending: "Envoi…",
    sent: "Message prêt — votre client e-mail va s'ouvrir.",
    errorRequired: "Merci de remplir les champs requis.",
    emailLabel: "E-mail",
    emailDesc: "Réponse sous 24 h ouvrables.",
    locationLabel: "Basé à Genève, Suisse",
    locationDesc: "Au service des PME romandes, alémaniques et tessinoises depuis Genève.",
  },
  en: {
    back: "Back",
    title: "Let's talk about your automations",
    subtitle:
      "Whether you want to try the AI receptionist or automate a specific workflow, send us a message or book a free 30-minute audit.",
    bookEyebrow: "Fastest path",
    bookTitle: "Book a free audit",
    bookDesc: "30 minutes to map your repetitive tasks and estimate the automation potential.",
    bookCta: "Pick a slot",
    formEyebrow: "Or write to us",
    formTitle: "Send us a message",
    formDesc: "Describe in a few lines what you want to automate. We reply within 24 hours.",
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone (optional)",
    message: "Your message",
    messagePlaceholder: "e.g. we get 40 calls a day, I'd like an AI to answer and book appointments…",
    send: "Send",
    sending: "Sending…",
    sent: "Message ready — your email client will open.",
    errorRequired: "Please fill in the required fields.",
    emailLabel: "Email",
    emailDesc: "Reply within 24 business hours.",
    locationLabel: "Based in Geneva, Switzerland",
    locationDesc: "Serving SMEs across French, German and Italian Switzerland from Geneva.",
  },
  de: {
    back: "Zurück",
    title: "Sprechen wir über Ihre Automatisierungen",
    subtitle:
      "Ob Sie den KI-Empfang testen oder einen bestimmten Workflow automatisieren möchten — schreiben Sie uns oder buchen Sie ein kostenloses 30-Minuten-Audit.",
    bookEyebrow: "Der schnellste Weg",
    bookTitle: "Kostenloses Audit buchen",
    bookDesc: "30 Minuten, um Ihre repetitiven Aufgaben zu kartieren und das Automatisierungspotenzial einzuschätzen.",
    bookCta: "Termin wählen",
    formEyebrow: "Oder schreiben Sie uns",
    formTitle: "Senden Sie uns eine Nachricht",
    formDesc: "Beschreiben Sie in wenigen Zeilen, was Sie automatisieren möchten. Wir antworten innerhalb von 24 Stunden.",
    name: "Name",
    company: "Unternehmen",
    email: "E-Mail",
    phone: "Telefon (optional)",
    message: "Ihre Nachricht",
    messagePlaceholder: "z. B. wir erhalten 40 Anrufe pro Tag, eine KI soll antworten und Termine vereinbaren…",
    send: "Senden",
    sending: "Senden…",
    sent: "Nachricht bereit — Ihr E-Mail-Programm öffnet sich.",
    errorRequired: "Bitte füllen Sie die Pflichtfelder aus.",
    emailLabel: "E-Mail",
    emailDesc: "Antwort innerhalb von 24 Geschäftsstunden.",
    locationLabel: "Sitz in Genf, Schweiz",
    locationDesc: "Für KMU in der Deutsch-, Romandie- und Tessin-Schweiz, von Genf aus.",
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Deskia" },
      {
        name: "description",
        content: "Contact Deskia — Swiss AI automation agency. Book a free audit or send us a message.",
      },
      { property: "og:title", content: "Contact Deskia" },
      { property: "og:description", content: "Book a free audit or send us a message." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const { lang } = useSiteLang();
  const copy = COPY[lang];

  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(copy.errorRequired);
      return;
    }
    setSending(true);
    const subject = `Deskia — ${parsed.data.company || parsed.data.name}`;
    const body = [
      `Name: ${parsed.data.name}`,
      parsed.data.company ? `Company: ${parsed.data.company}` : null,
      `Email: ${parsed.data.email}`,
      parsed.data.phone ? `Phone: ${parsed.data.phone}` : null,
      "",
      parsed.data.message,
    ].filter(Boolean).join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => {
      setSending(false);
      toast.success(copy.sent);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoAsset.url}
              alt="Deskia"
              className="h-9 w-auto rounded-lg border border-border/60 bg-white p-1"
            />
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {copy.back}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{copy.subtitle}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Calendly card */}
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 p-6 dark:from-sky-950/30 dark:via-violet-950/30 dark:to-rose-950/30">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {copy.bookEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{copy.bookTitle}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{copy.bookDesc}</p>
            <Button asChild size="lg" className="mt-5 w-full rounded-full">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                <Calendar className="mr-2 h-4 w-4" />
                {copy.bookCta}
              </a>
            </Button>

            <div className="mt-8 space-y-4 border-t border-border/60 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{copy.emailLabel}</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-foreground">
                    {CONTACT_EMAIL}
                  </a>
                  <p className="text-xs text-muted-foreground">{copy.emailDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{copy.locationLabel}</p>
                  <p className="text-xs text-muted-foreground">{copy.locationDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {copy.formEyebrow}
            </p>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <MessageSquare className="h-5 w-5" /> {copy.formTitle}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{copy.formDesc}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">{copy.name} *</Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">{copy.company}</Label>
                <Input id="company" value={form.company} onChange={(e) => update("company", e.target.value)} maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{copy.email} *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required maxLength={255} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{copy.phone}</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={40} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message">{copy.message} *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder={copy.messagePlaceholder}
                  required
                  maxLength={2000}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full rounded-full" disabled={sending}>
              {sending ? copy.sending : copy.send}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
