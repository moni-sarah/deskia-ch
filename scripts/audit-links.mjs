#!/usr/bin/env node
/**
 * Static broken-link audit.
 *
 * Scans the source tree for internal link targets (Link `to=`, anchor `href=`,
 * `navigate(...)`, `redirect(...)`) and verifies each one resolves to a route
 * defined under src/routes/.
 *
 * Usage:
 *   node scripts/audit-links.mjs
 *
 * Exits 1 if any broken internal link is found.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = join(ROOT, "src", "routes");
const SRC_DIR = join(ROOT, "src");

// Routes that don't have a file but are valid (external handlers, anchors, etc.)
const ALLOWLIST = new Set(["/", "/sitemap.xml"]);

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
  // src/routes/foo.bar.$id.tsx -> /foo/bar/$id
  // src/routes/index.tsx       -> /
  // src/routes/foo.index.tsx   -> /foo
  // src/routes/sitemap[.]xml.ts -> /sitemap.xml
  let rel = relative(ROUTES_DIR, file).replace(/\.(tsx?|jsx?)$/, "");
  if (rel === "__root" || rel.endsWith(".server") || rel.endsWith(".functions"))
    return null;
  // Convert escaped dot [.]
  rel = rel.replace(/\[\.\]/g, "__DOT__");
  // index leaf
  rel = rel.replace(/(^|\.)index$/, "");
  // dots become slashes
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

// ---------- 2. Match a candidate URL against defined routes ----------
function routeMatches(url) {
  // strip query/hash
  const clean = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (definedRoutes.has(clean)) return true;
  // try dynamic match: replace each segment with $param if a defined route fits
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

// ---------- 3. Scan source for link targets ----------
const LINK_PATTERNS = [
  /\bto\s*[:=]\s*["'`](\/[^"'`\s${}]*)["'`]/g,         // to="/foo"
  /\bhref\s*=\s*["'`](\/[^"'`\s${}]*)["'`]/g,           // href="/foo"
  /\bnavigate\(\s*["'`](\/[^"'`\s${}]*)["'`]/g,          // navigate("/foo")
  /\bredirect\(\s*\{\s*to\s*:\s*["'`](\/[^"'`\s${}]*)["'`]/g,
];

const broken = [];
for (const f of walk(SRC_DIR)) {
  if (!/\.(tsx?|jsx?)$/.test(f)) continue;
  if (f.includes("routeTree.gen")) continue;
  const src = readFileSync(f, "utf8");
  for (const re of LINK_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const url = m[1];
      // skip assets, api, mailto, hash-only, protocol-relative
      if (url.startsWith("/api/")) continue;
      if (url.startsWith("//")) continue;
      if (/\.(png|jpe?g|svg|webp|ico|mp4|css|js|json|txt|pdf|webmanifest)$/i.test(url)) continue;
      if (!routeMatches(url)) {
        const line = src.slice(0, m.index).split("\n").length;
        broken.push({ file: relative(ROOT, f), line, url });
      }
    }
  }
}

// ---------- 4. Report ----------
console.log(`Found ${definedRoutes.size} defined routes.`);
if (broken.length === 0) {
  console.log("✓ No broken internal links.");
  process.exit(0);
}
console.error(`✗ ${broken.length} broken internal link(s):`);
for (const b of broken) console.error(`  ${b.file}:${b.line}  →  ${b.url}`);
process.exit(1);
