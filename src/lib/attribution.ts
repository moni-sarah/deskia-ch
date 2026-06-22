// Client-side conversion attribution.
// Captures landing_path, referrer, search query (from Google/Bing/etc.),
// UTM params and gclid on first visit and persists them for the session.

export type Attribution = {
  landing_path: string | null;
  referrer: string | null;
  search_query: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
};

const KEY = "deskia_attr_v1";
const EMPTY: Attribution = {
  landing_path: null, referrer: null, search_query: null,
  utm_source: null, utm_medium: null, utm_campaign: null,
  utm_term: null, utm_content: null, gclid: null,
};

function parseSearchQueryFromReferrer(ref: string | null): string | null {
  if (!ref) return null;
  try {
    const u = new URL(ref);
    const host = u.hostname.toLowerCase();
    const isSearch = /(google|bing|yahoo|duckduckgo|ecosia|qwant|brave|yandex|baidu)\./.test(host);
    if (!isSearch) return null;
    return u.searchParams.get("q") || u.searchParams.get("query") || null;
  } catch {
    return null;
  }
}

function inferSource(host: string | null): { source: string | null; medium: string | null } {
  if (!host) return { source: null, medium: null };
  const h = host.toLowerCase();
  if (/google\./.test(h)) return { source: "google", medium: "organic" };
  if (/bing\./.test(h)) return { source: "bing", medium: "organic" };
  if (/duckduckgo\./.test(h)) return { source: "duckduckgo", medium: "organic" };
  if (/yahoo\./.test(h)) return { source: "yahoo", medium: "organic" };
  if (/ecosia\./.test(h)) return { source: "ecosia", medium: "organic" };
  if (/qwant\./.test(h)) return { source: "qwant", medium: "organic" };
  if (/yandex\./.test(h)) return { source: "yandex", medium: "organic" };
  if (/baidu\./.test(h)) return { source: "baidu", medium: "organic" };
  if (/(facebook|instagram|t\.co|twitter|x\.com|linkedin|reddit|youtube|tiktok)\./.test(h)) {
    return { source: h.replace(/^www\./, "").split(".")[0], medium: "social" };
  }
  return { source: h.replace(/^www\./, ""), medium: "referral" };
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return JSON.parse(existing) as Attribution;

    const url = new URL(window.location.href);
    const sp = url.searchParams;
    const ref = document.referrer || null;
    let refHost: string | null = null;
    try { refHost = ref ? new URL(ref).hostname : null; } catch { refHost = null; }
    const inferred = inferSource(refHost);

    const attr: Attribution = {
      landing_path: url.pathname + url.search,
      referrer: ref,
      search_query: parseSearchQueryFromReferrer(ref),
      utm_source: sp.get("utm_source") || inferred.source,
      utm_medium: sp.get("utm_medium") || inferred.medium,
      utm_campaign: sp.get("utm_campaign"),
      utm_term: sp.get("utm_term") || parseSearchQueryFromReferrer(ref),
      utm_content: sp.get("utm_content"),
      gclid: sp.get("gclid"),
    };
    sessionStorage.setItem(KEY, JSON.stringify(attr));
    return attr;
  } catch {
    return EMPTY;
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {/* ignore */}
  return captureAttribution();
}
