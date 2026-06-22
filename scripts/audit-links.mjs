#!/usr/bin/env node
/**
 * Static broken-link + sitemap-coverage audit.
 *
 * 1. Discovers all routes defined under src/routes/.
 * 2. Parses sitemap entries from src/routes/sitemap[.]xml.ts.
 * 3. Scans the source for internal link targets (Link `to=`, anchor `href=`,
 *    `navigate(...)`, `redirect(...)`).
 * 4. Reports:
 *      - broken links: targets that don't match any defined route
 *      - sitemap drift: indexable routes missing from the sitemap
 *      - stale sitemap entries: sitemap paths that don't match any route
 *      - uncovered referenced links: internal links pointing to indexable
 *        routes that aren't in the sitemap
 *
 * Usage:  node scripts/audit-links.mjs
 * Exits 1 on any finding.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = join(ROOT, "src", "routes");
const SRC_DIR = join(ROOT, "src");
const SITEMAP_FILE = join(ROUTES_DIR, "sitemap[.]xml.ts");

// Static URLs without route files but still valid link targets.
const ALLOWLIST = new Set(["/", "/sitemap.xml"]);

// Routes that exist but should NOT appear in the sitemap (private / dynamic /
// non-indexable). Patterns are exact route paths from the file system.
const NON_INDEXABLE = [
  /^\/admin(\/|$)/,
  /\$/,            // any dynamic segment route
  /^\/sitemap\.xml$/,
  /^\/api(\/|$)/,
  /^\/r(\/|$)/,    // short-link redirects
];

function isIndexable(routePath) {
  return !NON_INDEXABLE.some((re) => re.test(routePath));
}

// ---------- 1. Discover defined routes ----------
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function fileToRoutePath(file) {
  let rel = relative(ROUTES_DIR, file).replace(/\.(tsx?|jsx?)$/, "");
  if (rel === "__root" || rel.endsWith(".server") || rel.endsWith(".functions"))
    return null;
  rel = rel.replace(/\[\.\]/g, "__DOT__");
  rel = rel.replace(/(^|\.)index$/, "");
  let path = "/" + rel.split(".").join("/");
  path = path.replace(/__DOT__/g, ".");
  if (path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

const definedRoutes = new Set([...ALLOWLIST]);
for (const f of walk(ROUTES_DIR)) {
  if (!/\.(tsx?|jsx?)$/.test(f)) continue;
  const p = fileToRoutePath(f);
  if (p) definedRoutes.add(p);
}

// ---------- 2. Parse sitemap entries ----------
const sitemapPaths = new Set();
try {
  const src = readFileSync(SITEMAP_FILE, "utf8");
  const re = /path:\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(src))) sitemapPaths.add(m[1]);
} catch {
  console.warn("⚠ No sitemap file found at src/routes/sitemap[.]xml.ts");
}

// ---------- 3. Match a candidate URL against defined routes ----------
function routeMatches(url) {
  const clean = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (definedRoutes.has(clean)) return true;
  const parts = clean.split("/");
  for (const route of definedRoutes) {
    const rParts = route.split("/");
    if (rParts.length !== parts.length) continue;
    let ok = true;
    for (let i = 0; i < rParts.length; i++) {
      if (rParts[i].startsWith("$")) continue;
      if (rParts[i] !== parts[i]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

// ---------- 4. Scan source for link targets ----------
const LINK_PATTERNS = [
  /\bto\s*[:=]\s*["'`](\/[^"'`\s${}]*)["'`]/g,
  /\bhref\s*=\s*["'`](\/[^"'`\s${}]*)["'`]/g,
  /\bnavigate\(\s*["'`](\/[^"'`\s${}]*)["'`]/g,
  /\bredirect\(\s*\{\s*to\s*:\s*["'`](\/[^"'`\s${}]*)["'`]/g,
];

const broken = [];
const referencedLinks = new Set();
for (const f of walk(SRC_DIR)) {
  if (!/\.(tsx?|jsx?)$/.test(f)) continue;
  if (f.includes("routeTree.gen")) continue;
  const src = readFileSync(f, "utf8");
  for (const re of LINK_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const url = m[1];
      if (url.startsWith("/api/")) continue;
      if (url.startsWith("//")) continue;
      if (/\.(png|jpe?g|svg|webp|ico|mp4|css|js|json|txt|pdf|webmanifest)$/i.test(url)) continue;
      const clean = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
      referencedLinks.add(clean);
      if (!routeMatches(url)) {
        const line = src.slice(0, m.index).split("\n").length;
        broken.push({ file: relative(ROOT, f), line, url });
      }
    }
  }
}

// ---------- 5. Cross-checks ----------
const indexableRoutes = [...definedRoutes].filter(isIndexable);

const missingFromSitemap = indexableRoutes
  .filter((r) => !sitemapPaths.has(r))
  .sort();

const staleSitemap = [...sitemapPaths]
  .filter((p) => !routeMatches(p))
  .sort();

const uncoveredReferenced = [...referencedLinks]
  .filter((u) => isIndexable(u) && routeMatches(u) && !sitemapPaths.has(u))
  .sort();

// ---------- 6. Report ----------
console.log(`Routes defined : ${definedRoutes.size}`);
console.log(`Sitemap entries: ${sitemapPaths.size}`);
console.log(`Indexable      : ${indexableRoutes.length}`);
console.log("");

let fail = 0;

if (broken.length) {
  fail += broken.length;
  console.error(`✗ ${broken.length} broken internal link(s):`);
  for (const b of broken) console.error(`    ${b.file}:${b.line}  →  ${b.url}`);
  console.error("");
}

if (missingFromSitemap.length) {
  fail += missingFromSitemap.length;
  console.error(`✗ ${missingFromSitemap.length} indexable route(s) missing from sitemap:`);
  for (const r of missingFromSitemap) console.error(`    ${r}`);
  console.error("");
}

if (staleSitemap.length) {
  fail += staleSitemap.length;
  console.error(`✗ ${staleSitemap.length} sitemap entr(ies) that don't match any route:`);
  for (const r of staleSitemap) console.error(`    ${r}`);
  console.error("");
}

if (uncoveredReferenced.length) {
  // Soft warning — overlaps with missingFromSitemap but useful when narrowed.
  console.warn(`⚠ ${uncoveredReferenced.length} referenced link(s) not in sitemap:`);
  for (const r of uncoveredReferenced) console.warn(`    ${r}`);
  console.warn("");
}

if (fail === 0) {
  console.log("✓ No issues. Links, routes, and sitemap are in sync.");
  process.exit(0);
}
process.exit(1);
