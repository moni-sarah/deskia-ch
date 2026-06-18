## AI Receptionist SaaS — MVP

A multi-tenant SaaS where each business owner signs up, configures their own AI receptionist, and gets a shareable chat widget link they can embed on their site.

### What each user gets

1. **Account** (email + password sign-in via Lovable Cloud).
2. **Settings page** to configure their receptionist:
   - Business name + short description
   - FAQs (prices, services, opening hours) — free-text block the AI uses as knowledge
   - Calendly links: 15-min call URL + 30-min consultation URL
   - Google Sheet URL (where leads get appended)
   - Notification email (where lead alerts are sent)
   - WhatsApp notifications: toggle + phone number (E.164)
3. **Shareable chat page** at `/r/{slug}` — public URL, no login required for end visitors.
4. **Leads dashboard** — table of all captured leads with status.

### End-visitor experience (the receptionist)

- Chat widget powered by Lovable AI (Gemini), auto-detects French/English from the visitor's first message and replies in that language.
- System prompt is built per-tenant from their FAQs + business info.
- AI can:
  - Answer FAQs
  - Offer the Calendly links when the visitor wants to book ("Vous pouvez réserver ici : [link]")
  - Trigger an inline lead form (Name, Phone, Email, Company optional, Message) when the visitor wants to be contacted
- On lead submit:
  1. Save to Lovable Cloud DB (`leads` table)
  2. Append a row to the owner's Google Sheet (via Google Sheets connector)
  3. Send notification email to the owner (Lovable Emails)
  4. If WhatsApp enabled, send WhatsApp message to the owner (Twilio connector)

### Tech / integrations

- **Auth + DB**: Lovable Cloud (Supabase under the hood). Tables: `receptionists` (one per user, holds config), `leads`, `conversations`, `messages`.
- **AI**: Lovable AI Gateway, `google/gemini-3-flash-preview`, via a `createServerFn` for chat.
- **Google Sheets**: standard connector (developer-owned). For MVP, all tenants' sheets are written through the workspace owner's Google connection — the user pastes a sheet URL they've shared with that Google account. *(True per-user Google OAuth is post-MVP.)*
- **Email**: Lovable Emails (requires Cloud + email domain setup).
- **WhatsApp**: Twilio connector. Tenant supplies destination number; Twilio sender is the workspace number.

### Routes

```text
/                       Landing page (what it is, sign up CTA)
/auth                   Sign in / sign up
/_authenticated/app     Dashboard (leads list)
/_authenticated/settings  Receptionist config
/r/$slug                Public chat widget (the receptionist)
/api/chat               Streaming chat endpoint
/api/public/lead        Lead submission (public, rate-limited)
```

### What's NOT in the MVP

- Per-end-user Google OAuth (single workspace Google account writes all sheets).
- Voice/phone calls (chat only).
- Custom branding/theming per tenant beyond business name.
- Billing/plans.
- Analytics dashboards.

### Order of build

1. Enable Lovable Cloud + email domain prompt.
2. DB schema (receptionists, leads, conversations, messages) + RLS.
3. Auth pages + `_authenticated` layout.
4. Settings page (config form).
5. Public chat page + streaming AI server route with per-tenant system prompt.
6. Lead form + lead-submit server route → DB + Sheets + Email + Twilio.
7. Leads dashboard.
8. Landing page.

### Confirmations needed

- Connectors I'll wire: **Google Sheets**, **Twilio** (for WhatsApp). You'll be prompted to connect them when I get to those steps.
- Email sender domain: I'll prompt you to set one up so notification emails come from your brand.
- Sign-in method: **email + password** (fastest for MVP). Add Google later if you want.

Reply "go" and I'll start building, or tell me what to change.