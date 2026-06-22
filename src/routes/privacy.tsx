import logoAsset from "@/assets/deskia-logo.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, Lock, Eye, Trash2, Server, Scale, ChevronRight } from "lucide-react";
import { LangSwitcher, useSiteLang, type SiteLang } from "@/lib/site-lang";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Data Protection — Deskia" },
      {
        name: "description",
        content: "Deskia privacy policy and data protection practices.",
      },
    ],
  }),
  component: PrivacyPage,
});

type Copy = {
  back: string;
  badge: string;
  title: string;
  intro: string;
  collect: { h: string; p: string };
  security: { h: string; p: string };
  sub: { h: string; p: string };
  retention: { h: string; p: string };
  rights: { h: string; p: string };
  gdpr: {
    h: string;
    intro: string;
    lawful: { h: string; p: string };
    what: { h: string; p: string; items: string[] };
    ret: { h: string; p: string; items: string[] };
    yours: { h: string; p: string; items: string[]; foot: (contact: string) => React.ReactNode };
    intl: { h: string; p: string };
  };
  updated: string;
};

const COPY: Record<SiteLang, Copy> = {
  en: {
    back: "Back",
    badge: "App-maintained page",
    title: "Privacy & Data Protection",
    intro: "This page is maintained by Deskia to answer common security and privacy questions about our service.",
    collect: {
      h: "Data we collect",
      p: "Deskia collects the minimum data needed to provide the AI receptionist service: conversation transcripts, lead contact details (name, email, phone), and business knowledge-base content you upload. We do not sell personal data to third parties.",
    },
    security: {
      h: "Security",
      p: "All data is transmitted over HTTPS (TLS 1.2+). Deskia runs on a managed cloud platform with regular security updates, automated backups, and role-based access controls. Authentication is handled via secure session tokens.",
    },
    sub: {
      h: "Subprocessors & integrations",
      p: "Deskia uses the following subprocessors for hosting, AI inference, and optional integrations: cloud hosting provider, AI model provider, and any CRM or webhook destinations you configure (Google Sheets, Zapier, HubSpot, etc.). Integrations are only enabled when you ask us to activate them.",
    },
    retention: {
      h: "Retention & deletion",
      p: "Conversation and lead data are retained for as long as your account is active. You can delete individual leads or your entire account data from the Dashboard at any time. Upon account deletion, all associated data is permanently removed within 30 days.",
    },
    rights: {
      h: "Your rights",
      p: "You have the right to access, correct, or delete your personal data. To make a privacy request, contact us via the Contact page or email the address listed there. We will respond within 30 days.",
    },
    gdpr: {
      h: "GDPR Compliance",
      intro: "Deskia is committed to complying with the General Data Protection Regulation (GDPR). Below is how we handle your data in accordance with GDPR principles.",
      lawful: {
        h: "Lawful basis for processing",
        p: "We process personal data on the basis of contractual necessity (to provide the Deskia service you signed up for) and legitimate interest (to improve service quality and prevent abuse). For optional marketing communications, we rely on consent, which you can withdraw at any time.",
      },
      what: {
        h: "What data we collect and why",
        p: "We collect only what is necessary:",
        items: [
          "Account data: email, password hash, business name — to authenticate you and personalise your experience.",
          "Conversation data: chat transcripts and lead details (name, phone, email) — to deliver the AI receptionist service and let you follow up with prospects.",
          "Knowledge-base content: FAQs and documents you upload — so the AI can answer accurately on your behalf.",
          "Technical logs: IP address, browser type, timestamps — for security, debugging, and fraud prevention (retained for 90 days).",
        ],
      },
      ret: {
        h: "Data retention",
        p: "We retain personal data only for as long as necessary:",
        items: [
          "Account and lead data: retained while your account is active.",
          "Inactive accounts: automatically reviewed after 24 months; you are notified before any deletion.",
          "Technical logs: deleted after 90 days.",
          "Deleted accounts: all personal data is permanently erased within 30 days of deletion.",
        ],
      },
      yours: {
        h: "Your GDPR rights",
        p: "Under GDPR you have the following rights regarding your personal data:",
        items: [
          "Right to access: request a copy of all data we hold about you.",
          "Right to rectification: correct inaccurate or incomplete data.",
          "Right to erasure (“right to be forgotten”): request deletion of your personal data.",
          "Right to restrict processing: limit how we use your data in certain circumstances.",
          "Right to data portability: receive your data in a structured, machine-readable format.",
          "Right to object: object to processing based on legitimate interests or direct marketing.",
          "Right to withdraw consent: withdraw consent at any time where processing is based on consent.",
        ],
        foot: (contact) => <>To exercise any of these rights, contact us via the {contact}. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority.</>,
      },
      intl: {
        h: "International transfers",
        p: "Deskia’s infrastructure is hosted within the European Economic Area (EEA). Where we use subprocessors outside the EEA (e.g. AI providers), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your data.",
      },
    },
    updated: "This privacy page reflects Deskia’s current practices and is updated periodically. Last updated: June 2026.",
  },
  fr: {
    back: "Retour",
    badge: "Page maintenue par l’application",
    title: "Confidentialité & protection des données",
    intro: "Cette page est maintenue par Deskia pour répondre aux questions courantes sur la sécurité et la confidentialité de notre service.",
    collect: {
      h: "Données collectées",
      p: "Deskia collecte le minimum de données nécessaires pour fournir le service de réceptionniste IA : transcriptions des conversations, coordonnées des prospects (nom, e-mail, téléphone) et contenu de la base de connaissances que vous importez. Nous ne vendons aucune donnée personnelle à des tiers.",
    },
    security: {
      h: "Sécurité",
      p: "Toutes les données sont transmises via HTTPS (TLS 1.2+). Deskia fonctionne sur une plateforme cloud managée avec mises à jour régulières, sauvegardes automatiques et contrôles d’accès basés sur les rôles. L’authentification est gérée par des jetons de session sécurisés.",
    },
    sub: {
      h: "Sous-traitants & intégrations",
      p: "Deskia utilise les sous-traitants suivants pour l’hébergement, l’inférence IA et les intégrations optionnelles : hébergeur cloud, fournisseur de modèle IA, ainsi que les CRM ou webhooks que vous configurez (Google Sheets, Zapier, HubSpot, etc.). Les intégrations ne sont activées que sur votre demande.",
    },
    retention: {
      h: "Conservation & suppression",
      p: "Les conversations et données de prospects sont conservées tant que votre compte est actif. Vous pouvez supprimer des prospects ou l’intégralité de vos données depuis le tableau de bord à tout moment. À la suppression du compte, toutes les données associées sont définitivement effacées sous 30 jours.",
    },
    rights: {
      h: "Vos droits",
      p: "Vous avez le droit d’accéder, corriger ou supprimer vos données personnelles. Pour toute demande, contactez-nous via la page Contact ou par e-mail à l’adresse indiquée. Nous répondons sous 30 jours.",
    },
    gdpr: {
      h: "Conformité RGPD",
      intro: "Deskia s’engage à respecter le Règlement Général sur la Protection des Données (RGPD). Voici comment nous traitons vos données conformément aux principes du RGPD.",
      lawful: {
        h: "Base légale du traitement",
        p: "Nous traitons les données personnelles sur la base de la nécessité contractuelle (pour fournir le service Deskia auquel vous avez souscrit) et de l’intérêt légitime (pour améliorer la qualité du service et prévenir les abus). Pour les communications marketing optionnelles, nous nous appuyons sur votre consentement, que vous pouvez retirer à tout moment.",
      },
      what: {
        h: "Données collectées et finalités",
        p: "Nous ne collectons que le strict nécessaire :",
        items: [
          "Données de compte : e-mail, hash du mot de passe, nom de l’entreprise — pour vous authentifier et personnaliser votre expérience.",
          "Données de conversation : transcriptions et coordonnées des prospects (nom, téléphone, e-mail) — pour fournir le service et permettre le suivi.",
          "Base de connaissances : FAQ et documents que vous importez — pour que l’IA réponde précisément en votre nom.",
          "Journaux techniques : adresse IP, type de navigateur, horodatages — pour la sécurité, le débogage et la prévention des fraudes (conservés 90 jours).",
        ],
      },
      ret: {
        h: "Conservation des données",
        p: "Nous ne conservons les données personnelles que le temps nécessaire :",
        items: [
          "Données de compte et de prospects : conservées tant que votre compte est actif.",
          "Comptes inactifs : examinés automatiquement après 24 mois ; vous êtes prévenu avant toute suppression.",
          "Journaux techniques : supprimés après 90 jours.",
          "Comptes supprimés : toutes les données personnelles sont effacées définitivement sous 30 jours.",
        ],
      },
      yours: {
        h: "Vos droits RGPD",
        p: "Au titre du RGPD, vous disposez des droits suivants sur vos données :",
        items: [
          "Droit d’accès : demander une copie de toutes les données vous concernant.",
          "Droit de rectification : corriger des données inexactes ou incomplètes.",
          "Droit à l’effacement (« droit à l’oubli ») : demander la suppression de vos données.",
          "Droit à la limitation du traitement : restreindre l’usage de vos données dans certains cas.",
          "Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.",
          "Droit d’opposition : vous opposer à un traitement fondé sur l’intérêt légitime ou au marketing direct.",
          "Droit de retirer votre consentement à tout moment lorsque le traitement est basé sur le consentement.",
        ],
        foot: (contact) => <>Pour exercer l’un de ces droits, contactez-nous via la {contact}. Nous répondrons sous 30 jours. Vous avez également le droit d’introduire une réclamation auprès de votre autorité locale de protection des données.</>,
      },
      intl: {
        h: "Transferts internationaux",
        p: "L’infrastructure de Deskia est hébergée dans l’Espace économique européen (EEE). Lorsque nous recourons à des sous-traitants hors EEE (ex. fournisseurs IA), nous mettons en place des garanties appropriées, notamment les Clauses Contractuelles Types (CCT) approuvées par la Commission européenne.",
      },
    },
    updated: "Cette page reflète les pratiques actuelles de Deskia et est mise à jour régulièrement. Dernière mise à jour : juin 2026.",
  },
  de: {
    back: "Zurück",
    badge: "Von der App gepflegte Seite",
    title: "Datenschutz & Datensicherheit",
    intro: "Diese Seite wird von Deskia gepflegt, um häufige Fragen zu Sicherheit und Datenschutz unseres Dienstes zu beantworten.",
    collect: {
      h: "Erhobene Daten",
      p: "Deskia erhebt nur die Daten, die für den AI-Receptionist-Dienst notwendig sind: Gesprächsprotokolle, Lead-Kontaktdaten (Name, E-Mail, Telefon) und die von Ihnen hochgeladene Wissensdatenbank. Wir verkaufen keine personenbezogenen Daten an Dritte.",
    },
    security: {
      h: "Sicherheit",
      p: "Alle Daten werden über HTTPS (TLS 1.2+) übertragen. Deskia läuft auf einer verwalteten Cloud-Plattform mit regelmäßigen Sicherheitsupdates, automatischen Backups und rollenbasierten Zugriffskontrollen. Die Authentifizierung erfolgt über sichere Session-Tokens.",
    },
    sub: {
      h: "Auftragsverarbeiter & Integrationen",
      p: "Deskia nutzt folgende Auftragsverarbeiter für Hosting, KI-Inferenz und optionale Integrationen: Cloud-Hosting-Anbieter, KI-Modellanbieter sowie von Ihnen konfigurierte CRM- oder Webhook-Ziele (Google Sheets, Zapier, HubSpot usw.). Integrationen werden nur auf Ihre Anforderung aktiviert.",
    },
    retention: {
      h: "Aufbewahrung & Löschung",
      p: "Gesprächs- und Lead-Daten werden so lange aufbewahrt, wie Ihr Konto aktiv ist. Sie können einzelne Leads oder alle Daten jederzeit im Dashboard löschen. Bei Kontolöschung werden alle zugehörigen Daten innerhalb von 30 Tagen endgültig entfernt.",
    },
    rights: {
      h: "Ihre Rechte",
      p: "Sie haben das Recht, Ihre personenbezogenen Daten einzusehen, zu korrigieren oder löschen zu lassen. Für eine Datenschutzanfrage kontaktieren Sie uns über die Kontaktseite oder per E-Mail an die dort angegebene Adresse. Wir antworten innerhalb von 30 Tagen.",
    },
    gdpr: {
      h: "DSGVO-Konformität",
      intro: "Deskia verpflichtet sich zur Einhaltung der Datenschutz-Grundverordnung (DSGVO). Im Folgenden erläutern wir, wie wir Ihre Daten gemäß DSGVO behandeln.",
      lawful: {
        h: "Rechtsgrundlage der Verarbeitung",
        p: "Wir verarbeiten personenbezogene Daten auf Grundlage der Vertragserfüllung (zur Erbringung des von Ihnen gebuchten Deskia-Dienstes) und des berechtigten Interesses (zur Verbesserung der Dienstqualität und zur Missbrauchsprävention). Für optionale Marketingmitteilungen stützen wir uns auf Ihre Einwilligung, die Sie jederzeit widerrufen können.",
      },
      what: {
        h: "Welche Daten wir erheben und warum",
        p: "Wir erheben nur das Notwendige:",
        items: [
          "Kontodaten: E-Mail, Passwort-Hash, Firmenname – zur Authentifizierung und Personalisierung.",
          "Gesprächsdaten: Chat-Transkripte und Lead-Daten (Name, Telefon, E-Mail) – zur Erbringung des Dienstes und Nachverfolgung.",
          "Wissensdatenbank: FAQs und Dokumente, die Sie hochladen – damit die KI in Ihrem Namen präzise antworten kann.",
          "Technische Logs: IP-Adresse, Browsertyp, Zeitstempel – für Sicherheit, Debugging und Betrugsprävention (90 Tage gespeichert).",
        ],
      },
      ret: {
        h: "Speicherdauer",
        p: "Wir speichern personenbezogene Daten nur so lange wie nötig:",
        items: [
          "Konto- und Lead-Daten: aktiv, solange Ihr Konto besteht.",
          "Inaktive Konten: nach 24 Monaten automatisch geprüft; Sie werden vor jeder Löschung benachrichtigt.",
          "Technische Logs: nach 90 Tagen gelöscht.",
          "Gelöschte Konten: alle personenbezogenen Daten werden innerhalb von 30 Tagen endgültig gelöscht.",
        ],
      },
      yours: {
        h: "Ihre Rechte nach DSGVO",
        p: "Nach der DSGVO stehen Ihnen folgende Rechte zu:",
        items: [
          "Recht auf Auskunft: Kopie aller über Sie gespeicherten Daten anfordern.",
          "Recht auf Berichtigung: unrichtige oder unvollständige Daten korrigieren.",
          "Recht auf Löschung („Recht auf Vergessenwerden“): Löschung Ihrer Daten verlangen.",
          "Recht auf Einschränkung der Verarbeitung: Nutzung Ihrer Daten in bestimmten Fällen beschränken.",
          "Recht auf Datenübertragbarkeit: Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.",
          "Widerspruchsrecht: Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen oder Direktwerbung.",
          "Recht auf Widerruf der Einwilligung: jederzeit widerrufbar, sofern die Verarbeitung auf Einwilligung beruht.",
        ],
        foot: (contact) => <>Zur Ausübung dieser Rechte kontaktieren Sie uns über die {contact}. Wir antworten innerhalb von 30 Tagen. Sie haben außerdem das Recht, Beschwerde bei Ihrer lokalen Datenschutzbehörde einzulegen.</>,
      },
      intl: {
        h: "Internationale Übermittlungen",
        p: "Deskias Infrastruktur wird im Europäischen Wirtschaftsraum (EWR) gehostet. Bei Auftragsverarbeitern außerhalb des EWR (z. B. KI-Anbietern) gewährleisten wir geeignete Garantien wie die von der Europäischen Kommission genehmigten Standardvertragsklauseln (SCC).",
      },
    },
    updated: "Diese Seite spiegelt die aktuellen Praktiken von Deskia wider und wird regelmäßig aktualisiert. Letzte Aktualisierung: Juni 2026.",
  },
};

function PrivacyPage() {
  const { lang } = useSiteLang();
  const t = COPY[lang];
  const contactLabel = lang === "fr" ? "page Contact" : lang === "de" ? "Kontaktseite" : "Contact page";

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
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {t.back}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {t.badge}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.intro}</p>

        <div className="mt-12 space-y-10">
          <Section icon={<Eye className="h-4 w-4" />} tone="chart-1" title={t.collect.h}>
            {t.collect.p}
          </Section>
          <Section icon={<Lock className="h-4 w-4" />} tone="chart-2" title={t.security.h}>
            {t.security.p}
          </Section>
          <Section icon={<Server className="h-4 w-4" />} tone="chart-3" title={t.sub.h}>
            {t.sub.p}
          </Section>
          <Section icon={<Trash2 className="h-4 w-4" />} tone="chart-4" title={t.retention.h}>
            {t.retention.p}
          </Section>
          <Section icon={<ShieldCheck className="h-4 w-4" />} tone="chart-5" title={t.rights.h}>
            {t.rights.p}
          </Section>

          <section className="rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">{t.gdpr.h}</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t.gdpr.intro}</p>

            <div className="mt-8 space-y-8">
              <SubSection tone="chart-1" title={t.gdpr.lawful.h}>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.gdpr.lawful.p}</p>
              </SubSection>

              <SubSection tone="chart-2" title={t.gdpr.what.h}>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.gdpr.what.p}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {t.gdpr.what.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </SubSection>

              <SubSection tone="chart-3" title={t.gdpr.ret.h}>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.gdpr.ret.p}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {t.gdpr.ret.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </SubSection>

              <SubSection tone="chart-4" title={t.gdpr.yours.h}>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.gdpr.yours.p}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {t.gdpr.yours.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {t.gdpr.yours.foot(
                    <Link to="/contact" className="text-primary hover:underline">{contactLabel}</Link>,
                  )}
                </p>
              </SubSection>

              <SubSection tone="chart-5" title={t.gdpr.intl.h}>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.gdpr.intl.p}</p>
              </SubSection>
            </div>
          </section>
        </div>

        <Card className="mt-12 border-border/60">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{t.updated}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Section({ icon, tone, title, children }: { icon: React.ReactNode; tone: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${tone}/10 text-${tone}`}>
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="mt-3 text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}

function SubSection({ tone, title, children }: { tone: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-foreground">
        <ChevronRight className={`h-4 w-4 text-${tone}`} />
        {title}
      </h3>
      {children}
    </div>
  );
}
