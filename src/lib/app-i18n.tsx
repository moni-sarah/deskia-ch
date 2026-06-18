import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";
const STORAGE_KEY = "app-lang";

const dict = {
  en: {
    brand: "Deskia",
    nav_leads: "Leads",
    nav_settings: "Settings",
    lang_toggle: "FR",
    back: "Back",
    home: "Home",
    // Dashboard
    your_receptionist: "Your assistant",
    dash_subtitle: "Share your Deskia assistant with visitors and watch leads come in.",
    configure: "Configure",
    share_link: "Your shareable chat link",
    copy: "Copy",
    open: "Open",
    copied: "Copied!",
    leads: "Leads",
    loading: "Loading…",
    no_leads: "No leads yet. Share your link to get started.",
    col_when: "When",
    col_name: "Name",
    col_contact: "Contact",
    col_company: "Company",
    col_message: "Message",
    // Settings
    settings_title: "Settings",
    settings_subtitle: "Configure how your Deskia assistant talks and where leads go.",
    business: "Business",
    business_name: "Business name",
    short_desc: "Short description",
    short_desc_hint: "One or two sentences about what you do.",
    kb: "Knowledge base",
    kb_hint: "Add the FAQs your Deskia assistant should answer — prices, services, opening hours, policies. The AI uses ONLY this info to answer customers, in English or French.",
    test_ai: "Test the AI",
    test_ai_hint: "Ask a customer question and see how the AI would answer using your current knowledge base.",
    calendly: "Calendly booking",
    cal_15: "15-min call URL",
    cal_30: "30-min consultation URL",
    lead_dest: "Lead destinations",
    sheet_url: "Google Sheet URL",
    sheet_hint: "Leads will be appended as rows. Share the sheet with the workspace's connected Google account.",
    webhook_url: "CRM / Webhook URL",
    webhook_hint: "Send every new lead to your CRM or appointment software (HubSpot, Pipedrive, Zoho, Dentrix, Jane, NexHealth…). Paste a Zapier or Make webhook URL — we POST the lead as JSON.",
    notif_email: "Notification email",
    notif_hint: "We email you whenever a lead is captured.",
    wa_title: "WhatsApp notifications",
    wa_sub: "Send a WhatsApp message on every lead.",
    wa_num: "WhatsApp number (E.164)",
    wa_num_hint: "Include country code, e.g. +14155551234",
    save: "Save changes",
    saving: "Saving…",
    saved: "Saved",
    total_leads: "Leads Generated",
    todays_leads: "Today",
    active_destinations: "Active Destinations",
    widget_live: "Widget Live",
    widget_offline: "Widget Offline",
    sources: "Sources",
    appointments_booked: "Appointments Booked",
    conversion_rate: "Conversion Rate",
    customer_questions: "Customer Questions",
    recent_questions: "Recent customer questions",
    no_questions: "No questions yet.",
    overview: "Overview",
  },
  fr: {
    brand: "Deskia",
    nav_leads: "Prospects",
    nav_settings: "Paramètres",
    lang_toggle: "EN",
    back: "Retour",
    home: "Accueil",
    your_receptionist: "Votre assistant",
    dash_subtitle: "Partagez votre assistant Deskia avec vos visiteurs et recevez des prospects.",
    configure: "Configurer",
    share_link: "Votre lien de chat à partager",
    copy: "Copier",
    open: "Ouvrir",
    copied: "Copié !",
    leads: "Prospects",
    loading: "Chargement…",
    no_leads: "Aucun prospect. Partagez votre lien pour commencer.",
    col_when: "Date",
    col_name: "Nom",
    col_contact: "Contact",
    col_company: "Entreprise",
    col_message: "Message",
    settings_title: "Paramètres",
    settings_subtitle: "Configurez la voix de votre assistant Deskia et la destination des prospects.",
    business: "Entreprise",
    business_name: "Nom de l'entreprise",
    short_desc: "Brève description",
    short_desc_hint: "Une ou deux phrases sur votre activité.",
    kb: "Base de connaissances",
    kb_hint: "Ajoutez les FAQ auxquelles votre assistant Deskia doit répondre — tarifs, services, horaires, politiques. L'IA n'utilise QUE ces informations pour répondre, en français ou en anglais.",
    test_ai: "Tester l'IA",
    test_ai_hint: "Posez une question client et voyez la réponse de l'IA basée sur votre base de connaissances actuelle.",
    calendly: "Réservation Calendly",
    cal_15: "URL appel 15 min",
    cal_30: "URL consultation 30 min",
    lead_dest: "Destinations des prospects",
    sheet_url: "URL Google Sheet",
    sheet_hint: "Les prospects seront ajoutés en lignes. Partagez la feuille avec le compte Google connecté.",
    webhook_url: "URL CRM / Webhook",
    webhook_hint: "Envoyez chaque prospect vers votre CRM ou logiciel de rendez-vous (HubSpot, Pipedrive, Zoho, Dentrix, Jane, NexHealth…). Collez une URL de webhook Zapier ou Make — nous envoyons le prospect en JSON.",
    notif_email: "Email de notification",
    notif_hint: "Nous vous écrivons à chaque nouveau prospect.",
    wa_title: "Notifications WhatsApp",
    wa_sub: "Envoyer un message WhatsApp à chaque prospect.",
    wa_num: "Numéro WhatsApp (E.164)",
    wa_num_hint: "Inclure l'indicatif, ex. +14155551234",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Enregistré",
    total_leads: "Prospects générés",
    todays_leads: "Aujourd'hui",
    active_destinations: "Destinations actives",
    widget_live: "Widget actif",
    widget_offline: "Widget inactif",
    sources: "Sources",
    appointments_booked: "Rendez-vous pris",
    conversion_rate: "Taux de conversion",
    customer_questions: "Questions clients",
    recent_questions: "Questions récentes des clients",
    no_questions: "Aucune question pour le moment.",
    overview: "Aperçu",
  },
} as const;

type Dict = Record<keyof typeof dict.en, string>;
type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: Dict };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "en" || stored === "fr") setLangState(stored);
    else {
      const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
      setLangState(nav.startsWith("fr") ? "fr" : "en");
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };
  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "en" ? "fr" : "en"),
    t: dict[lang],
  };
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang must be used within LangProvider");
  return c;
}
